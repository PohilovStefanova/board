from flask import Flask, jsonify, request
from flask_pymongo import PyMongo, ObjectId
import json
from bson import ObjectId
import uuid
import datetime

# Класс для перевода в JSON
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# Функция получения времени в необходимом формате
def getCurrTime():
    now = datetime.datetime.now()
    return now.strftime("%Y-%m-%d %H:%M:%S")

# Приложение 
app = Flask(__name__);

# Конфигурация базы данных 
app.config['MONGO_DBNAME'] = 'threads'
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)

# test
@app.route('/')
def hello_world():
    return 'test test test'

# GET метод по URL '/api/threads/' для получения всех тредов.
@app.route('/api/threads', methods=['GET'])
def get_threads():
    threads = mongo.db.threads
    output = []
    # Из каждого найденного документа пихаем в массив output необходимые поля
    for doc in threads.find():
        output.append({'_id': doc['_id'], 'text': doc['text'], 'created_on':doc['created_on'], 'updated_on':doc['updated_on'], 'replies': doc['replies']})
    return JSONEncoder().encode(output)

# GET метод по URL '/api/replies/<thread_id>' для получения информаци о треде.
@app.route('/api/replies/<thread_id>', methods=['GET'])
def get_replies(thread_id):
    threads = mongo.db.threads
    try:
        thread = threads.find_one({'_id': ObjectId(thread_id)})
    except Exception:
        return 'Wrong thread_id!'
    if thread:
        output = {'_id': thread['_id'], 'text': thread['text'], 'created_on':doc['created_on'], 'updated_on':doc['updated_on'], 'replies': thread['replies']}
    else:
        output = 'No thread found'
    
    return JSONEncoder().encode(output)