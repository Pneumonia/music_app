from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import urandom, path

db = SQLAlchemy()
DB_NAME = "database.db"

def create_app():
    app = Flask(__name__)
    #app.config['SECRET_KEY'] =urandom(42)
    app.config['SECRET_KEY'] ="test"

    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MUSIC_UPLOAD']='/home/bert/PycharmProjects/flask/music_app_02/blueprints/static/music/'
    app.config['MAX_MUSIC_LENGTH'] = 20 * 1024 * 1024#max file size(20mb)
    db.init_app(app)

    from .account_manage import account_manage

    app.register_blueprint(account_manage,url_prefix="/")

    from .models import User, Note, Music
    create_database(app)


    return app

def create_database(app):
    if not path.exists('blueprints/' + DB_NAME):
        db.create_all(app=app)