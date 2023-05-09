from fuzzywuzzy import fuzz
import numpy as np
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
import pandas as pd
import pymongo
import os
from dotenv import load_dotenv
load_dotenv()

# Connecting to mongo db
mongo_uri = os.getenv('MONGO_URI')
client = pymongo.MongoClient(mongo_uri)
db = client["TripPlanner"]

# Retrieve data from collections
places_data = db["new_places"].find(projection={"_id": 0})
ratings_data = db["ratings"].find(projection={"_id": 0})

# Creating data frame
df_places = pd.DataFrame(list(places_data))
df_ratings = pd.DataFrame(list(ratings_data))

# pivot ratings into place features
df_place_features = df_ratings.pivot(
    index='placeid',
    columns='userid',
    values='rating'
).fillna(0)

mat_place_features = csr_matrix(df_place_features.values)

# Finding and removing redundant data
model_knn = NearestNeighbors(
    metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)

num_users = len(df_ratings.userid.unique())
num_items = len(df_ratings.placeid.unique())
print('There are {} unique users and {} unique places in this data set'.format(
    num_users, num_items))

df_ratings_cnt_tmp = pd.DataFrame(
    df_ratings.groupby('rating').size(), columns=['count'])

total_cnt = num_users * num_items
rating_zero_cnt = total_cnt - df_ratings.shape[0]

df_ratings_cnt = df_ratings_cnt_tmp.append(
    pd.DataFrame({'count': rating_zero_cnt}, index=[0.0]),
    verify_integrity=True,
).sort_index()

# log normalise to make it easier to interpret on a graph
df_ratings_cnt['log_count'] = np.log(df_ratings_cnt['count'])

# get rating frequency
# number of ratings each place got.
df_places_cnt = pd.DataFrame(df_ratings.groupby(
    'placeid').size(), columns=['count'])

# now we need to take only places that have been rated atleast 50 times to get some idea of the reactions of users towards it
# popularity_thres = 50
popularity_thres = 0
popular_places = list(
    set(df_places_cnt.query('count >= @popularity_thres').index))
df_ratings_drop_places = df_ratings[df_ratings.placeid.isin(popular_places)]
print('shape of original ratings data: ', df_ratings.shape)
print('shape of ratings data after dropping unpopular places: ',
      df_ratings_drop_places.shape)

# get number of ratings given by every user
df_users_cnt = pd.DataFrame(df_ratings_drop_places.groupby(
    'userid').size(), columns=['count'])

# filter data to come to an approximation of user likings.
# ratings_thres = 20
ratings_thres = 0
active_users = list(set(df_users_cnt.query('count >= @ratings_thres').index))
df_ratings_drop_users = df_ratings_drop_places[df_ratings_drop_places.userid.isin(
    active_users)]
print('shape of original ratings data: ', df_ratings.shape)
print('shape of ratings data after dropping both unpopular places and inactive users: ',
      df_ratings_drop_users.shape)

# pivot and create place-user matrix
place_user_mat = df_ratings_drop_users.pivot(
    index='placeid', columns='userid', values='rating').fillna(0)
# map place titles to images
place_to_idx = {
    place: i for i, place in
    enumerate(list(df_places.set_index(
        'features__id').loc[place_user_mat.index].features__properties__name))
}
# transform matrix to scipy sparse matrix
place_user_mat_sparse = csr_matrix(place_user_mat.values)

# Startnig CF recommendation using KNN
# define model
model_knn = NearestNeighbors(
    metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
# fit
model_knn.fit(place_user_mat_sparse)


def fuzzy_matching(mapper, fav_place, verbose=True):
    """
    return the closest match via fuzzy ratio. 

    Parameters
    ----------    
    mapper: dict, map place title name to index of the place in data

    fav_place: str, name of user input place

    verbose: bool, print log if True

    Return
    ------
    index of the closest match
    """
    match_tuple = []
    # get match
    for title, idx in mapper.items():
        ratio = fuzz.ratio(title.lower(), fav_place.lower())
        if ratio >= 60:
            match_tuple.append((title, idx, ratio))
    # sort
    match_tuple = sorted(match_tuple, key=lambda x: x[2])[::-1]
    if not match_tuple:
        print('Oops! No match is found')
        return
    if verbose:
        print('Found possible matches in our database: {0}\n'.format(
            [x[0] for x in match_tuple]))
    return match_tuple[0][1]


def make_recommendation(model_knn, data, mapper, fav_place, n_recommendations):
    """
    return top n similar place recommendations based on user's input place


    Parameters
    ----------
    model_knn: sklearn model, knn model

    data: place-user matrix

    mapper: dict, map place title name to index of the place in data

    fav_place: str, name of user input place

    n_recommendations: int, top n recommendations

    Return
    ------
    list of top n similar place recommendations
    """
    # fit
    model_knn.fit(data)
    # get input place index
    print('You have input place:', fav_place)
    idx = fuzzy_matching(mapper, fav_place, verbose=True)

    print('Recommendation system start to make inference')
    print('......\n')
    distances, indices = model_knn.kneighbors(
        data[idx], n_neighbors=n_recommendations+1)

    raw_recommends = \
        sorted(list(zip(indices.squeeze().tolist(),
               distances.squeeze().tolist())), key=lambda x: x[1])[:0:-1]
    # get reverse mapper
    reverse_mapper = {v: k for k, v in mapper.items()}
    # print recommendations
    print('Recommendations for {}:'.format(fav_place))
    for i, (idx, dist) in enumerate(raw_recommends):
        print('{0}: {1}, with distance of {2}'.format(
            i+1, reverse_mapper[idx], dist))


my_favorite = 'COEP Auditorium'

make_recommendation(
    model_knn=model_knn,
    data=place_user_mat_sparse,
    fav_place=my_favorite,
    mapper=place_to_idx,
    n_recommendations=10)
