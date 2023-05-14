from flask import Flask, jsonify, request
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
from fuzzywuzzy import fuzz
import numpy as np
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
import pymongo
import json
import requests
from bson import json_util
from bson import ObjectId
import os
import pandas as pd
from dotenv import load_dotenv
import heapq
import math
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app)

# Connecting to db
mongo_uri = os.getenv('MONGO_URI')
client = pymongo.MongoClient(mongo_uri)
db = client["TripPlanner"]


@app.route('/')
def home():
    return 'Welcome to CBR API!'

@app.route('/place/<id>', methods=['GET'])
def placeInfo(id):
    places_data = db["new_places"]
    results = places_data.find_one({"features__id": int(id)})
    results['_id'] = str(results['_id'])
    results_dict = json.loads(json.dumps(results, default=str))
    return results_dict


@app.route('/test', methods=['POST'])
def get_places():
    data = request.get_json()
    print('Data:',data)
    # coordinates=json.loads(data)
    # latitude=coordinates['latitude']
    # longitude=coordinates['longitude']
    lat = request.args.get('lat')
    long = request.args.get('long')
    print('Lat:',lat)
    print('Long:',long)
    # fetch the places data using the latitude and longitude
    url = f'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext=true&exintro=true&generator=geosearch&ggscoord={lat}|{long}'
    response = requests.get(url)
    places_data = response.json()

    # return the places data as JSON response
    return jsonify(places_data)


@app.route('/search/<term>', methods=['GET'])
def search(term):
    # term = request.args.get('term')
    print("SEARCH TERM: ", term)
    places_data = db["new_places"]
    places_data.create_index([("features__properties__name", "text"), ("features__properties__kinds", "text")])
    results = places_data.find({"$text": {"$search":term}},{"score":{"$meta":"textScore"}}).sort([("score",{"$meta":"textScore"})])
    
    # Convert the MongoDB document objects to JSON format
    json_results = []
    for result in results:
        json_results.append(json.loads(json_util.dumps(result)))

    # Return the search results as JSON
    return jsonify(json_results)

@app.route('/sga/<id>',methods=['GET'])
def sga(id) :
    json_result = []

    # search for the person with that id
    user = db["User"].find_one({"_id": id})
    size = 7
    latitude = user['location']['lat']
    longitude = user['location']['long']
    distance = 5 #in kilometers
    user_array = np.zeros(size,dtype='float')    
    places_visited_subject_array = user['history']

        #condition of not including the subject into sda
    if(len(places_visited_subject_array) < 5):
        return jsonify(json_result)

    for places in places_visited_subject_array:
        new_array = np.zeros(size,dtype=float)
        place = db["Places_Counter"].find_one("place_id":places["placeid"])
            #condition to not include a place in sga
        if(place["review_counter"] < 5 and place["tags_counter"] < 5):
                continue
        place_rating = place["average_rating"]
        new_array[0] = place["nature_counter"]
        new_array[1] = place["trek_counter"]
        new_array[2] = place["religious_counter"]
        new_array[3] = place["historic_counter"]
        new_array[4] = place["themePark_counter"]
        new_array[5] = place["entertainment_counter"]
        new_array[6] = place["architecture_counter"]
        total = sum(new_array)
        for i in range(size):
            new_array[i] = round(new_array[i]/total , 2)
            user_array[i] += new_array[i]*place_rating
        
        max_value = np.max(user_array)

        for i in range(size):
            if(max_value!=0):
                user_array[i] = np.round(user_array[i]/max_value,decimals=2)


    # make a graph for the user with "_id" as id




    # get the list of users within 5km of distance
    users_within_distance = db["User"].find({
            "location": {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "$maxDistance": distance * 1000  # Convert distance from kilometers to meters
                }
            }
        }).limit(1000)



    # get the list of places the user have visited for each user

    mapped_data = {}

    
    for user in users_within_distance:
        id = user["_id"]
        places_visited_user = db["User"].find_one({"_id":id})
        places_visited_array = places_visited_user['history']

        #condition of not including a person into the sga
        if(len(places_visited_array) < 5):
            continue

        mapped_array = np.zeros(size,dtype=float)
        for places in places_visited_array:
            new_array = np.zeros(size,dtype=float)
            place = db["Places_Counter"].find_one({"place_id":places["placeid"]})
            #condition to not include a place in sga
            if(place["review_counter"] < 5 and place["tags_counter"] < 5):
                continue
            place_rating = place["average_rating"]
            new_array[0] = place["nature_counter"]
            new_array[1] = place["trek_counter"]
            new_array[2] = place["religious_counter"]
            new_array[3] = place["historic_counter"]
            new_array[4] = place["themePark_counter"]
            new_array[5] = place["entertainment_counter"]
            new_array[6] = place["architecture_counter"]
            total = sum(new_array)
            for i in range(size):
                new_array[i] = round(new_array[i]/total , 2)
                mapped_array[i] += new_array[i]*place_rating
        
        max_value = np.max(mapped_array)

        for i in range(size):
            if(max_value!=0):
                mapped_array[i] = np.round(mapped_array[i]/max_value,decimals=2)

        mapped_data[id] = mapped_array
            
    
    no_of_recommendations = 4;
    heap = []

    for i,profile in mapped_data.items():
        if(max(profile)==0):
            continue
        value = 0
        for j in range(size):
            temp = abs(profile[j]-user_array[j])
            value += (temp ** 2)
        heapq.heappush(heap,(-math.sqrt(value),i))
        if(len(heap) > no_of_recommendations):
            heapq.heappop(heap)


    while(heap):
        rcmd = heapq.heappop(heap)
        get_user = db["User"].find_one({"_id":rcmd[1]})
        json_result.append(get_user.next())

    return jsonify(json_result)

   


@app.route('/cf',methods=['GET'])
def cf():
    location = request.args.get('location',type=str)
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
    popularity_thres = 1 # Change this later when there are more users
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
    ratings_thres = 0 # Change this later when there are more users
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
    # df_places
    def place(name):
        return df_places.loc[df_places['features__properties__name'] == name]['features__id'].tolist()[0]

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
            return 0
        if verbose:
            print('Found possible matches in our database: {0}\n'.format(
                [x[0] for x in match_tuple]))
        return match_tuple[0][1]

    ls = []
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
        # if idx == 0:
        #     ls.append('No match found')
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
            # print('{0}: {1}, with distance of {2}'.format(
            #     i+1, reverse_mapper[idx], dist))
            dict = {'name':reverse_mapper[idx], 'placeId':place(reverse_mapper[idx])}
            ls.append(dict)


    # my_favorite = 'COEP Auditorium'
    make_recommendation(
        model_knn=model_knn,
        data=place_user_mat_sparse,
        fav_place=location,
        mapper=place_to_idx,
        n_recommendations=10)
    
    return jsonify(ls)


@app.route('/cbr', methods=['GET'])
def cbr():
    # Getting data from db
    places_data = db["new_places"].find()
    ratings_data = db["ratings"].find()

    # Creating data frame out of retieved data
    new_places_df = pd.DataFrame(list(places_data))
    ratings_df = pd.DataFrame(list(ratings_data))

    userid = request.args.get('userid', type=str)
    userid = ObjectId(userid)
    # Selecting all the rows of this userid
    user_ratings_df = ratings_df[ratings_df['userid'] == userid]
    user_places_df = pd.merge(user_ratings_df, new_places_df,
                            left_on='placeid', right_on='features__id')
    user_df = user_places_df[['userid', 'placeid',
                            'features__properties__name', 'features__properties__kinds', 'rating']]

    # print(user_df)

    # creating tfidf matrix
    tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3),
                        min_df=0, stop_words='english')
    tfidf_matrix_places = tf.fit_transform(
        new_places_df['features__properties__kinds'])

    # Finding cosine similarities
    cosine_similarities = linear_kernel(tfidf_matrix_places, tfidf_matrix_places)
    results = {}

    # Comparing each place with every other place
    for idx, row in new_places_df.iterrows():
        similar_indices = cosine_similarities[idx].argsort()[:-100:-1]
        similar_items = [(cosine_similarities[idx][i],
                        new_places_df['features__id'][i]) for i in similar_indices]

        results[row['features__id']] = similar_items[1:]

    # print('done!')


    def item(id):
        return new_places_df.loc[new_places_df['features__id'] == id]['features__properties__name'].tolist()[0]


    # set to avoid duplicate recommedations
    recs_set = set()


    # def recommend(item_id, num):
    #     recs = results[item_id][:num]
    #     for rec in recs:
    #         if rec[1] not in recs_set:
    #             recs_set.add(rec[1])
    #             print("Recommended: " +
    #                 item(rec[1]) + " (score:" + str(rec[0]) + ")" + 'id: ', (rec[1]))
    #             return item(rec[1])

    ls = []
    for idx, row in user_df.iterrows():
        recs_set.add(row['placeid'])
        # Only making recommendations for places rated 4 or above by user
        if row['rating'] >= 4:
            # print(f"PLACES RECOMMENDED FOR {row['features__properties__name']}:")
            recs = results[row['placeid']][:5]
            for rec in recs:
                if rec[1] not in recs_set:
                    recs_set.add(rec[1])
                    dict = {'name':item(rec[1]), 'placeId':int(rec[1])}
                    ls.append(dict)
            # print()
    
    return jsonify(ls)



if __name__ == '__main__':
    app.run(debug=True)
