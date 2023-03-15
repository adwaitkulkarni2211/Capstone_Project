import pandas as pd

new_places_data = pd.read_csv("./Datasets/new_places.csv")
new_places_docs = new_places_data.to_dict(orient="records")


import pymongo
import os
from dotenv import load_dotenv
load_dotenv()

mongo_uri = os.getenv('MONGO_URI')

client = pymongo.MongoClient(mongo_uri)
db = client["TripPlanner"]


new_places_collection = db['new_places']
print("before feeding:", new_places_collection.count_documents({}))

new_places_collection.insert_many(new_places_docs)

print("after feeding:", new_places_collection.count_documents({}))