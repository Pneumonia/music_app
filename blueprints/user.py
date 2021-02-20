from flask import Blueprint, render_template, make_response



user = Blueprint("user",__name__)

@user.route("/")
def home():
    return make_response(render_template("home.html"),200)

