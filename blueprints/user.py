from flask import Flask, Blueprint, render_template, jsonify, request
from flask_jwt_extended import jwt_required,get_jwt_identity, get_csrf_token



user = Blueprint("user",__name__)

@user.route("/")
def home():
    return render_template("home.html")

@user.route("/login_html")
def login():
    return render_template("login.html")
