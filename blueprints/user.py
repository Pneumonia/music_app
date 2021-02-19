from flask import Flask, Blueprint, render_template, jsonify, request, make_response
from flask_jwt_extended import jwt_required,get_jwt_identity, get_csrf_token



user = Blueprint("user",__name__)

@user.route("/")
def home():
    return make_response(render_template("home.html"),200)

