import os
import json
from flask import Flask, render_template, send_from_directory
from pymongo import MongoClient

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'terror')
COLLECTION_NAME = 'events'

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/stat")
def stat():
    return render_template('stat.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/img/<filename>")
def img(filename):
  return send_from_directory('img', filename)

@app.route("/stat/data")
def data():
  FIELDS = {
    '_id': False, 'year': True, 'state': True,
    'city': True, 'summary': True
  }

  with MongoClient(MONGO_URI) as conn:
    collection = conn[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS, limit=20000)
    return json.dumps(list(projects))

if __name__ == '__main__':
    app.run(debug=True)
