from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
import pymongo
import os
import pandas as pd
from dotenv import load_dotenv
load_dotenv()

# Connecting to db
mongo_uri = os.getenv('MONGO_URI')
client = pymongo.MongoClient(mongo_uri)
db = client["TripPlanner"]

# Getting data from db
places_data = db["new_places"].find()
ratings_data = db["ratings"].find()

# Creating data frame out of retieved data
new_places_df = pd.DataFrame(list(places_data))
ratings_df = pd.DataFrame(list(ratings_data))

# Will generate recommendations for this user
userid = 236

# Selecting all the rows of this userid
user_ratings_df = ratings_df[ratings_df['userid'] == userid]
user_places_df = pd.merge(user_ratings_df, new_places_df,
                          left_on='placeid', right_on='features__id')
user_df = user_places_df[['userid', 'placeid',
                          'features__properties__name', 'features__properties__kinds', 'rating']]

print(user_df)

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

print('done!')


def item(id):
    return new_places_df.loc[new_places_df['features__id'] == id]['features__properties__name'].tolist()[0]


# set to avoid duplicate recommedations
recs_set = set()


def recommend(item_id, num):
    recs = results[item_id][:num]
    for rec in recs:
        if rec[1] not in recs_set:
            recs_set.add(rec[1])
            print("Recommended: " +
                  item(rec[1]) + " (score:" + str(rec[0]) + ")" + 'id: ', (rec[1]))


for idx, row in user_df.iterrows():
    recs_set.add(row['placeid'])
    # Only making recommendations for places rated 4 or above by user
    if row['rating'] >= 4:
        print(f"PLACES RECOMMENDED FOR {row['features__properties__name']}:")
        recommend(row['placeid'], 5)
        print()
