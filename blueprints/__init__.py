from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import urandom, path
from flask_jwt_extended import (JWTManager, jwt_required, get_jwt_identity,create_access_token, create_refresh_token,jwt_refresh_token_required, get_raw_jwt,decode_token
)
from functools import wraps

db = SQLAlchemy()
DB_NAME = "database.db"

def create_app():
    app = Flask(__name__)
    #app.config['SECRET_KEY'] =urandom(42)
    app.config['SECRET_KEY'] ="test"

    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MUSIC_UPLOAD']='/home/bert/PycharmProjects/flask/music_app_02/blueprints/static/music/'
    app.config['UPLOAD_EXTENSIONS'] = ["MP3", "AAC", "M4A", "WMA", "FLAC", "ALAC", "WAV", "AIFF", "PCM", "OGG"]
    app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
    #app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    #app.config['JWT_COOKIE_SECURE'] = False

    jwt = JWTManager(app)

    app.blacklist = set()

    db.init_app(app)

    from .account_manage import account_manage
    from .music import music
    from .user import user

    app.register_blueprint(account_manage,url_prefix="/")
    app.register_blueprint(music,url_prefix="/")
    app.register_blueprint(user,url_prefix="/")

    from .models import User, Note, Music
    create_database(app)

    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decrypted_token):
        jti = decrypted_token['jti']
        return jti in app.blacklist
    return app

def create_database(app):
    if not path.exists('blueprints/' + DB_NAME):
        db.create_all(app=app)

