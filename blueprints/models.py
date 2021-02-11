from . import db  # . ist current package/ . ist wie website was man nimmt wenn man nicht im verzeichniss ist
from flask_login import UserMixin
from sqlalchemy.sql import func

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.String(10000))
    date = db.Column(db.DateTime(timezone=True),default=func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.public_id'))

class Music(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150),unique=True)
    format = db.Column(db.String(150))
    link = db.Column(db.String(150),unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.public_id'))

class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50),unique=True)
    email = db.Column(db.String(150),unique=True)
    password = db.Column(db.String(150))
    name = db.Column(db.String(150))
    admin = db.Column(db.Boolean)
    notes = db.relationship('Note')