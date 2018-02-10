import os
from flask import Flask, render_template, send_from_directory
app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)
