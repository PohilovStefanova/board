from flask import Flask

# Приложение 
app = Flask(__name__);

# Конфигурация базы данных 
app.config['MONGO_DBNAME'] = 'threads'
app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)

# test
@app.route('/')
def hello_world():
    return 'Hello world'

# GET метод по URL '/api/threads/' для получения всех тредов.
@app.route('/api/threads', methods=['GET'])
def get_threads():
    threads = mongo.db.threads
    output = []
    # Из каждого найденного документа пихаем в массив output необходимые поля
    for doc in threads.find():
        output.append({'_id': doc['_id'], 'created_on':doc['created_on'], 'updated_on':doc['updated_on'], 'text': doc['text'], 'replies': doc['replies']})
    return JSONEncoder().encode(output)