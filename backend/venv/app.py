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
app = Flask(__name__)

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
        output.append({
            '_id': doc['_id'],
            'text': doc['text'],
            'created_on': doc['created_on'],
            'updated_on': doc['updated_on'],
            'replies': doc['replies']
        })
    
    # Сортировка output по updated_on
    output.sort(key = lambda x: datetime.datetime.strptime(x['updated_on'], "%Y-%m-%d %H:%M:%S"), reverse = True)
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
        output = {
            '_id': thread['_id'],
            'text': thread['text'],
            'created_on': doc['created_on'],
            'updated_on': doc['updated_on'],
            'replies': thread['replies']
        }
    else:
        output = 'No thread found'
    return JSONEncoder().encode(output)


# POST метод по URL '/api/threads/' для создания нового треда.
# Необходимые поля: text, delete_password
@app.route('/api/threads', methods=['POST'])
def create_thread():
    threads = mongo.db.threads

    try:
        # Полуение информации из запроса
        text = request.json['text']
        delete_password = request.json['delete_password']

        # Время записи
        currTime = getCurrTime()

        # Делаем новую запись
        thread_id = threads.insert({
            'text': text,
            "created_on": currTime,
            "updated_on": currTime,
            'delete_password': delete_password,
            'replies': []
        })

        # Находим запись и возвращаем ее
        new_thread = threads.find_one({'_id': thread_id})
        output = {
            'text': new_thread['text'],
            'replies': new_thread['replies'],
            '_id': new_thread['_id']
        }

    except KeyError:
        # Параметра не хватает
        return 'Not all parameters sent!'

    return JSONEncoder().encode(output)


@app.route('/api/replies', methods=['POST'])
def post_reply():
    threads = mongo.db.threads
    try:
        # Полуение информации из запроса
        thread_id = ObjectId(request.json['thread_id'])
        delete_password = request.json['delete_password']
        text = request.json['text']

        thread = threads.find_one({"_id": thread_id})
        if thread:
            # Тред найден
            threads.update({
                "_id": thread_id},
                {
                    # Добавляем в массив ответов новый ответ + случайный _id
                    '$push': {
                        'replies': {
                            '_id': str(uuid.uuid4()),
                            'text': text,
                            'created_on': getCurrTime()
                        }
                    },
                    # Обновляем поле updated_on треда
                    '$set': {
                        'updated_on': getCurrTime()
                    }

            })
            return 'Success'
        else:
            # Тред не найден
            return 'Thread not found'
    except KeyError:
        # Неверный запрос
        return 'Not all parameters sent!'
    except Exception as Exc:
        # Другая ошибка
        print(Exc)
        return 'Something went wrong'

# Удалить все треды
@app.route('/api/deleteAll', methods=['DELETE'])
def delete_all():
    try:
        threads = mongo.db.threads
        threads.remove({})
        return 'Success'
    except Exception as e:
        return e
        print(e)