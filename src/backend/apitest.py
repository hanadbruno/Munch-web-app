from pymongo import MongoClient
import bson.binary
import datetime
from pymongo.server_api import ServerApi

uri = "mongodb+srv://munch:munch2023@atlascluster.9zbzama.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(uri, server_api=ServerApi('1'))
db = client['artwork']
collection = db['artwork']
time = datetime.datetime.now()

doc = {
    'artist': 'jonas',
    'artwork': 'myartwork',
    'img': 'C:/munch/test/12345.jpg',
    'time': time
}

collection.insert_one(doc)
client.close()
