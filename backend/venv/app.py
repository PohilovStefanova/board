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


# GET метод по URL '/api/threads' для получения всех тредов.
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
            'created_on': thread['created_on'],
            'updated_on': thread['updated_on'],
            'replies': thread['replies']
        }
    else:
        output = 'No thread found'
    return JSONEncoder().encode(output)


# POST метод по URL '/api/threads' для создания нового треда.
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

    return 'Success'


# POST метод по URL '/api/replies' для ответа в тред
# Необходимые поля: text, thread_id, delete_password
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
                            'delete_password': delete_password,
                            'created_on': getCurrTime()
                        }
                    },
                    # Обновляем поле updated_on треда
                    '$set': {
                        'updated_on': getCurrTime()
                    }

            })
            return JSONEncoder().encode(thread)
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


# DELETE метод по URL '/api/threads' для удаления треда.
# Необходимые поля: thread_id, delete_password
@app.route('/api/threads', methods=['DELETE'])
def delete_thread():
    threads = mongo.db.threads
    try:
        # Получение информации из запроса
        thread_id = ObjectId(request.json['thread_id'])
        delete_password = request.json['delete_password']

        thread = threads.find_one({'_id': thread_id})
        
        if thread:
            # Тред найден
            if thread['delete_password'] == delete_password:
                # Пароль совпадает
                threads.delete_one({'_id': thread_id})
                return 'Success'
            else:
                # Пароль неверный
                return 'Wrong password'
        else:
            return 'Thread not found'

    except KeyError:
        return 'Not all parameters sent!'

    except Exception as e:
        print(e)
        return 'Something went wrong'


# DELETE метод по URL '/api/replies' для удаления ответа.
# Удаление ответа - замена его текста на '[deleted]'!!
# Необходимые поля: thread_id, reply_id, delete_password
@app.route('/api/replies', methods=['DELETE'])
def delete_post():
    threads = mongo.db.threads
    
    #  Получение thread_id из запроса
    try:
        thread_id = ObjectId(request.json['thread_id'])
    except Exception:
        return 'Bad thread_id'

    # Получение запроса
    delete_password = request.json['delete_password']
    reply_id = request.json['reply_id']

    thread = threads.find_one({'_id': thread_id})

    if thread:
        # Если тред найден

        # флаг, станет True если удалится ответ
        was_deleted = False
        for reply in thread['replies']:
            print(reply)
            print(reply['delete_password'])

            if reply['_id'] == reply_id:
                was_deleted = True

                if reply['delete_password'] == delete_password:
                    # Пароль верный
                    new_replies = []
                    for r in thread['replies']:
                        # находим нужный ответ по _id и меняем текст на [deleted]
                        if r['_id'] == reply_id:
                            r['text'] = '[deleted]'
                        new_replies.append(r)

                    # верный запрос
                    threads.update(
                        {'_id': thread_id}, 
                        {
                            '$set': {
                                'replies': new_replies
                            }
                        }
                    )
                    return 'Right password;'
                else:
                    # Пароль неверный
                    return 'Wrong password'

                break
        if not was_deleted:
            # флаг не стал True => ответ не найден
            return 'No reply found'
    else:
        # Тред не найден
        return 'No thread found'