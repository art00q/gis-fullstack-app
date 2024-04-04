from flask import Flask
from flask_cors import CORS
import db

app = Flask(__name__)
cors = CORS(app)


@app.route('/')
def default():
    return db.get_all()


if __name__ == "__main__":
    app.run()
