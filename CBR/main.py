from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import pymongo
import os
from dotenv import load_dotenv
load_dotenv()

# Connecting to mongodb
mongo_uri = os.getenv('MONGO_URI')
client = pymongo.MongoClient(mongo_uri)
db = client["TripPlanner"]

# Getting data from the database
places_data = db["new_places"].find()

# Converting the data to a data frame
ds = pd.DataFrame(list(places_data))

# Creating a tfidf matrix
tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 3),
                     min_df=0, stop_words='english')
tfidf_matrix = tf.fit_transform(ds['features__properties__kinds'])

# Comparing places against each other
cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)

results = {}

for idx, row in ds.iterrows():
    similar_indices = cosine_similarities[idx].argsort()[:-100:-1]
    similar_items = [(cosine_similarities[idx][i], ds['features__id'][i])
                     for i in similar_indices]

    results[row['features__id']] = similar_items[1:]


def item(id):
    return ds.loc[ds['features__id'] == id]['features__properties__name'].tolist()[0]


def recommend(item_id, num):
    print("Recommending " + str(num) +
          " places similar to " + item(item_id) + "...")
    print("-------")
    recs = results[item_id][:num]
    for rec in recs:
        print("Recommended: " + item(rec[1]) + " (score:" + str(rec[0]) + ")")


recommend(item_id=1880355, num=10)
