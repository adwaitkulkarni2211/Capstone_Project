import os
import pandas as pd
import pymongo
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from fuzzywuzzy import fuzz
from dotenv import load_dotenv
load_dotenv()

mongo_uri = os.getenv('MONGO_URI')

client = pymongo.MongoClient(mongo_uri)
db = client["TripPlanner"]

places_data = db["new_places"].find(projection={"_id": 0})
ratings_data = db["ratings"].find(projection={"_id": 0})

df_places = pd.DataFrame(list(places_data))
df_ratings = pd.DataFrame(list(ratings_data))


# df_movie_features = df_ratings.pivot(
#     index='placeid',
#     columns='userid',
#     values='rating'
# ).fillna(0)

# mat_movie_features = csr_matrix(df_movie_features.values)

df_places_cnt = pd.DataFrame(df_ratings.groupby('placeid').size(), columns=['count'])

popularity_thres = 50
popular_places = list(set(df_places_cnt.query('count >= @popularity_thres').index))
df_ratings_drop_places = df_ratings[df_ratings.placeid.isin(popular_places)]

df_users_cnt = pd.DataFrame(df_ratings_drop_places.groupby('userid').size(), columns=['count'])

ratings_thres = 20
active_users = list(set(df_users_cnt.query('count >= @ratings_thres').index))
df_ratings_drop_users = df_ratings_drop_places[df_ratings_drop_places.userid.isin(active_users)]


places_user_mat = df_ratings_drop_users.pivot(index='placeid', columns='userid', values='rating').fillna(0)
place_to_idx = {
    movie: i for i, movie in 
    enumerate(list(df_places.set_index('features__id').loc[places_user_mat.index].features__properties__name))
}
place_user_mat_sparse = csr_matrix(places_user_mat.values)


model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
model_knn.fit(place_user_mat_sparse)

def fuzzy_matching(mapper, fav_place, verbose=True):
    match_tuple = []
    
    for title, idx in mapper.items():
        ratio = fuzz.ratio(title.lower(), fav_place.lower())
        if ratio >= 60:
            match_tuple.append((title, idx, ratio))

    match_tuple = sorted(match_tuple, key=lambda x: x[2])[::-1]
    if not match_tuple:
        print('Oops! No match is found')
        return
    if verbose:
        print('Found possible matches in our database: {0}\n'.format([x[0] for x in match_tuple]))
    return match_tuple[0][1]

def make_recommendation(model_knn, data, mapper, fav_place, n_recommendations):

    model_knn.fit(data)
    
    print('You have input place:', fav_place)
    idx = fuzzy_matching(mapper, fav_place, verbose=True)
    
    print('Recommendation system start to make inference')
    print('......\n')
    distances, indices = model_knn.kneighbors(data[idx], n_neighbors=n_recommendations+1)
    
    raw_recommends = \
        sorted(list(zip(indices.squeeze().tolist(), distances.squeeze().tolist())), key=lambda x: x[1])[:0:-1]
    
    reverse_mapper = {v: k for k, v in mapper.items()}
    
    print('Recommendations for {}:'.format(fav_place))
    for i, (idx, dist) in enumerate(raw_recommends):
        print('{0}: {1}, with distance of {2}'.format(i+1, reverse_mapper[idx], dist))


my_favorite = 'COEP Auditorium'

make_recommendation(
    model_knn=model_knn,
    data=place_user_mat_sparse,
    fav_place=my_favorite,
    mapper=place_to_idx,
    n_recommendations=10)