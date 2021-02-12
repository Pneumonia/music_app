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
    app.config['UPLOAD_EXTENSIONS'] = ["MP3", "AAC", "M4A", "WMA", "FLAC", "ALAC", "WAV", "AIFF", "PCM", "OGG"]
    app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024#max file size for all data trafic
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']



    db.init_app(app)

    from .account_manage import account_manage
    from .music import music

    app.register_blueprint(account_manage,url_prefix="/")
    app.register_blueprint(music,url_prefix="/")

    from .models import User, Note, Music
    create_database(app)


    return app

def create_database(app):
    if not path.exists('blueprints/' + DB_NAME):
        db.create_all(app=app)
