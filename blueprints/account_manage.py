from flask import Flask, Blueprint, jsonify,request,current_app, make_response
from . import db
from .models import User
from functools import wraps
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import uuid

account_manage=Blueprint("account_manage",__name__)


def token_required(function):
    @wraps(function)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
            token = token.split(" ")[1]
        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401
        if token in current_app.blacklist:
            return jsonify({'message' : 'Token is loged out!'}), 401
        try:
            print("\ntokken", token, "\n")
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])#decode braucht algorithems=[""]
            print("\ndata", data, "\n")
            current_user = User.query.filter_by(public_id=data['public_id']).first()
            print("\ncurrent_user",current_user,"\n")
        except:
            return jsonify({'message' : 'Token is invalid!!'}), 401
        return function(current_user, *args, **kwargs)
    return decorated

@account_manage.route('/user',methods=['POST'])
@token_required
def creat_user(current_user):
    if not current_user.admin:
        return jsonify({'message ':'you are not an admin'})
    print("\nadmin\n")
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'],method='sha256')
    #hashed_password = generate_password_hash("admin",method='sha256')
    new_user = User(public_id=str(uuid.uuid4()), name=data['name'],email=data['email'], password=hashed_password, admin=False)
    #new_user = User(public_id=str(uuid.uuid4()), name="admin",email="admin@admin", password=hashed_password, admin=True)
    if User.query.filter_by(email=new_user.email).first():
        return jsonify({'message':'email allready in Use'})
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message ':'new user created'})

@account_manage.route('/login')
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
    user = User.query.filter_by(name=auth.username).first()
    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'public_id' : user.public_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, current_app.config['SECRET_KEY'])
        print("\n","vaalide""\n")
        print(type(token))
        print(token)
        return jsonify({'token' : token})#token eigentlich utf-8 .decode('UTF-8')
    return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

@account_manage.route('/logout')
@token_required
def logout(current_user):
    token = request.headers['Authorization']
    token = token.split(" ")[1]
    current_app.blacklist.add(token)
    return jsonify({'message' : current_user.name+' loged out'})

@account_manage.route('/user', methods=['GET'])
@token_required
def get_all_users(current_user):
    if not current_user.admin:
        return jsonify({'message' : 'Cannot perform that function!'})
    users = User.query.all()
    output = []
    for user in users:
        user_data = {}
        user_data['password'] = user.password
        user_data['admin'] = user.admin
        user_data['name'] = user.name
        user_data['email'] = user.email
        user_data['public_id'] = user.public_id
        output.append(user_data)
    print("\nuser: ",output,"\n")
    return jsonify({'users' : output})

@account_manage.route('/user/<public_id>', methods=['PUT'])
@token_required
def change_admin(current_user, public_id):
    if not current_user.admin:
        return jsonify({'message' : 'Cannot perform that function!'})
    user = User.query.filter_by(public_id=public_id).first()
    if current_user.id == user.id:
        return jsonify({'message' : 'Cannot change yourself'})
    if not user:
        return jsonify({'message' : 'No user found!'})
    if user.admin == False:
        user.admin = True
        db.session.commit()
        return jsonify({'message': 'The user has been promoted! admin: '+str(user.admin)})
    else:
        user.admin = False
        db.session.commit()
    return jsonify({'message' : 'The user has been demoted! admin: '+str(user.admin)})

@account_manage.route('/user/<public_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, public_id):
    if not current_user.admin:
        return jsonify({'message' : 'Cannot perform that function!'})
    user = User.query.filter_by(public_id=public_id).first()
    if not user:
        return jsonify({'message' : 'No user found!'})
    if user.admin == True:
        return jsonify({'message' : 'cant_delete_admin!'})
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message' : 'The user has been deleted!'})