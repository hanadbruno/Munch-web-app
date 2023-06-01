from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime
from pymongo.server_api import ServerApi
import json

app = Flask(__name__)
CORS(app)

uri = "mongodb+srv://jonas:munch2023@cluster0.nfwqlqv.mongodb.net/?retryWrites=true&w=majority"

app.config['MONGO_DBNAME'] = 'MyMunch'
app.config['MONGO_URI'] = 'uri'

mongo = MongoClient(uri, server_api=ServerApi('1'))


@app.route('/', methods=['GET'])
def hello():
    return 'Velkommen til dette APIet. For å se data, gå til /api'


@app.route('/api', methods=['GET'])
def get_all_data():
    artwork = mongo[app.config['MONGO_DBNAME']].artwork
    output = []
    for u in artwork.find():
        output.append({'_id': str(u.get('_id', '')), 'uik': u.get('uik', ''), 'artist': u.get('artist', ''), 'artwork_name': u.get('artwork_name', ''), 'artwork_path': u.get('artwork_path', ''), 'signature_path': u.get('signature_path', ''), 'time': u.get('time', '')})
    return jsonify({'result': output})



@app.route('/api/<id>', methods=['GET'])
def get_one_data(id):
    artwork = mongo[app.config['MONGO_DBNAME']].artwork
    u = artwork.find_one({'_id': ObjectId(id)})
    if u:
        output = {'_id': str(u.get('_id', '')), 'artist': u.get('artist', ''), 'artwork_name': u.get('artwork_name', ''), 'img': u.get('img', ''), 'time': u.get('time', '')}
    else:
        output = 'No results found'
    return jsonify({'result': output})


def not_found():
    return jsonify({'error': 'Not found'})


@app.route('/api', methods=['POST'])
def add_data():
    artwork = mongo[app.config['MONGO_DBNAME']].artwork
    uik = request.json['uik'] # uik = unique image key
    artist = request.json['artist']
    artwork_name = request.json['artwork_name']
    artwork_path = request.json['artwork_path']
    signature_path = request.json['signature_path']
    time = datetime.now()
    if uik and artist and artwork_path and signature_path:
        result = artwork.insert_one({'uik': uik, 'artist': artist, 'artwork_name': artwork_name, 'artwork_path': artwork_path, 'signature_path': signature_path, 'time': time})
        id = result.inserted_id
        new_data = artwork.find_one({'_id': id})
        output = {'_id': str(new_data.get('_id', '')), 'uik': new_data.get('uik', ''), 'artist': new_data.get('artist', ''), 'artwork_name': new_data.get('artwork_name', ''), 'artwork_path': new_data.get('artwork_path', ''), 'signature_path': new_data.get('signature_path', ''), 'time': new_data.get('time', '')}
        return jsonify({'result': output})
    else:
        return not_found()

# get request



if __name__ == '__main__':
    app.run(debug=True)
