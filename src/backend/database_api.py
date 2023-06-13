from flask import Flask, jsonify, request, send_from_directory
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
from flask_cors import CORS
from pymongo.server_api import ServerApi
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv('../../.env')

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')


# loading from .env to ensure password protected database:
# goto .env to change authentication values
username_DB = os.environ.get('DB_USERNAME')
password = os.environ.get('DB_PASSWORD')

uri = f"mongodb+srv://{username_DB}:{password}@cluster0.pde4tq8.mongodb.net/?retryWrites=true&w=majority"

app.config['MONGO_DBNAME'] = 'MyMunch'
app.config['MONGO_URI'] = 'uri'

mongo = MongoClient(uri, server_api=ServerApi('1'))
username = os.getlogin()

@app.route('/', methods=['GET'])
def hello():
    return 'Velkommen til dette APIet. For å se data, gå til /api'


@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(f'C:/Users/{username}/Pictures/munch', filename)


@app.route('/artworks', methods=['GET'])
def get_all_data():
    artwork = mongo[app.config['MONGO_DBNAME']].artwork
    output = []
    for u in artwork.find():
        output.append({
            '_id': str(u.get('_id', '')),
            'uik': u.get('uik', ''),
            'artwork_name': u.get('artwork_name', ''),
            'artwork_path': transform_path(u.get('artwork_path', '')),
            'signature_path': transform_path(u.get('signature_path', '')),
            'time': u.get('time', '')
        })
    return jsonify({'result': output})

def transform_path(path):
    filename = path.split('/')[-1]
    return f'/images/{filename}'


@app.route('/artworks/<uik>', methods=['GET'])
def get_one_data(uik):
    artwork = mongo[app.config['MONGO_DBNAME']].artwork
    u = artwork.find_one({'uik': uik})
    if u:
        output = {
            '_id': str(u.get('_id', '')),
            'uik': u.get('uik', ''),
            'artwork_name': u.get('artwork_name', ''),
            'artwork_path': transform_path(u.get('artwork_path', '')),
            'signature_path': transform_path(u.get('signature_path', '')),
            'time': u.get('time', '')
        }
    else:
        output = {'error': 'No results found'}
    return jsonify(output)


@app.route('/artworks/all-uik', methods=['GET'])
def get_all_uik():
    artwork = mongo[app.config['MONGO_DBNAME']].artwork
    output = []
    for u in artwork.find():
        output.append({
            'uik': u.get('uik', ''),
            'time': u.get('time', '')
        })
    return jsonify(output)


def not_found():
    return jsonify({'error': 'Not found'})


@app.route('/api', methods=['POST'])
def add_data():
    artwork = mongo[app.config['MONGO_DBNAME']].artwork
    uik = request.json['uik'] # uik = unique image key
    artwork_name = request.json['artwork_name']
    artwork_path = request.json['artwork_path']
    signature_path = request.json['signature_path']
    time = datetime.now().strftime('%Y-%m-%d %H:%M:%S') # change here

    if uik and artwork_path and signature_path:
        result = artwork.insert_one({'uik': uik, 'artwork_name': artwork_name, 'artwork_path': artwork_path, 'signature_path': signature_path, 'time': time})
        id = result.inserted_id
        new_data = artwork.find_one({'_id': id})
        output = {'_id': str(new_data.get('_id', '')), 'uik': new_data.get('uik', ''), 'artwork_name': new_data.get('artwork_name', ''), 'artwork_path': new_data.get('artwork_path', ''), 'signature_path': new_data.get('signature_path', ''), 'time': new_data.get('time', '')}
        print('Emitting new_image event...')
        socketio.emit('new_image', output)
        print('Emitted new_image event:', output)
        return jsonify({'result': output})
    else:
        return not_found()


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
