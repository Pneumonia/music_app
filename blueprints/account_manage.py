from flask import  Blueprint, jsonify, request, current_app, make_response, render_template, redirect, url_for
from . import db
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_raw_jwt


account_manage = Blueprint("account_manage", __name__)


@account_manage.route('/logout', methods=['DELETE'])
@jwt_required
def logout():
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    jti = get_raw_jwt()['jti']#nicht mehr in 4.02
    current_app.blacklist.add(jti)
    return jsonify({"msg": "Successfully logged out, byby " + current_user.name}), 200


@account_manage.route('/user', methods=['POST'])
@jwt_required
def creat_user():
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    if not current_user.admin:
        return jsonify({'msg ': 'you are not an admin'})
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    # hashed_password = generate_password_hash("admin",method='sha256')
    new_user = User(public_id=str(uuid.uuid4()), name=data['name'], email=data['email'], password=hashed_password,
                    admin=False)
    # new_user = User(public_id=str(uuid.uuid4()), name="admin",email="admin@admin", password=hashed_password, admin=True)
    if User.query.filter_by(email=new_user.email).first():
        return jsonify({'msg': 'email allready in Use'})
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg ': 'new user created'})


@account_manage.route('/login', methods=["GET", "POST"])
def login():
    auth = request.authorization
    if not auth or not auth.username or not auth.password:
        return make_response(jsonify({'msg':'no login'}), 401)
    user = User.query.filter_by(name=auth.username).first()
    if not user:
        return make_response(jsonify({'msg':'no login'}), 401)# {'WWW-Authenticate': 'Basic realm="Login required!"'}öffnet basic login page
    if check_password_hash(user.password, auth.password):
        access_token = create_access_token(identity=user.public_id)
        ret = jsonify({'access_csrf': access_token})
        return make_response(ret, 200)

    return make_response(jsonify({'msg': 'no login'}), 401)


@account_manage.route('/user', methods=['GET'])
@jwt_required
def get_user():
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    if current_user:
        if current_user.admin == True:
            return jsonify({'msg': 'admin'})
        return jsonify({'msg': 'true'})
    else:
        return jsonify({'msg': 'false'})




@account_manage.route('/users', methods=['GET'])
@jwt_required
def get_all_users():
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    if not current_user.admin:
        return jsonify({'msg': 'Cannot perform that function!'})
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
    return jsonify({'users': output})


@account_manage.route('/user/<public_id>', methods=['PUT'])
@jwt_required
def change_admin(public_id):
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    if not current_user.admin:
        return jsonify({'msg': 'Cannot perform that function!'})
    user = User.query.filter_by(public_id=public_id).first()
    if current_user.id == user.id:
        return jsonify({'msg': 'Cannot change yourself'})
    if not user:
        return jsonify({'msg': 'No user found!'})
    if user.admin == False:
        user.admin = True
        db.session.commit()
        return jsonify({'msg': 'promoted'})
    else:
        user.admin = False
        db.session.commit()
    return jsonify({'msg': 'demoted'})


@account_manage.route('/user/<public_id>', methods=['DELETE'])
@jwt_required
def delete_user(public_id):
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    if not current_user.admin:
        return jsonify({'msg': 'Cannot perform that function!'})
    user = User.query.filter_by(public_id=public_id).first()
    if not user:
        return jsonify({'msg': 'No user found!'})
    if user.admin == True:
        return jsonify({'msg': 'cant_delete_admin!'})
    db.session.delete(user)
    db.session.commit()
    return jsonify({'msg': 'delete'})
