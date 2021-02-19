from flask import Flask, Blueprint, jsonify, Response, request, current_app, make_response
import logging
from pydub import AudioSegment
import os as os
from . import db
from .models import Music
from werkzeug.utils import secure_filename
from .models import User
import simpleaudio
from flask_jwt_extended import jwt_required,get_jwt_identity
music = Blueprint("music", __name__)


def music_refresh(current_user):
    music_files = os.listdir(os.getcwd() + "/blueprints/static/music/")
    # delet_old
    for item in Music.query.all():
        if item.link.split("/")[-1] not in music_files:
            no_title = Music.query.filter_by(title=item.link.split("/")[-1].split(".")[0]).first()
            db.session.delete(no_title)
            db.session.commit()
    # neue einträge
    for item in music_files:
        if not Music.query.filter_by(title=item.split(".")[0]).first():
            title, format, link, = item.split(".")[0], item.split(".")[
                -1], os.getcwd() + "/blueprints/static/music/" + item
            new_music = Music(title=title, link=link, format=format, user_id=current_user.id)
            db.session.add(new_music)
            db.session.commit()
    return jsonify({'msg': 'music refreshed'})

@music.route('/static/music/<music>')
@jwt_required
def play_on_lokal(music):
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    def generator(music):
        count = 1
        with open(music, "rb") as fwav:
            data = fwav.read(1024)
            while data:
                yield data
                data = fwav.read(1024)
                logging.debug('Music data fragment : ' + str(count))
                count += 1
    music_refresh(current_user)
    music = Music.query.filter_by(title=music.split(".")[0]).first()
    if music:
        music = music.link
        return Response(generator(music), mimetype="audio/mp3")
    else:
        return jsonify({'msg': 'music not in libary'})


@music.route('/static/music/<music>', methods=["POST"])
@jwt_required
def play_on_host(music):
    test = request.headers
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    simpleaudio.stop_all()
    music_refresh(current_user)
    music = Music.query.filter_by(title=music.split(".")[0]).first()
    if not music:
        return jsonify({'msg': 'data is empty'})
    simpleaudio.stop_all()
    try:
        music = AudioSegment.from_file(music.link)
        simpleaudio.play_buffer(music.raw_data,num_channels=music.channels,bytes_per_sample=music.sample_width,sample_rate=music.frame_rate)
        return jsonify({'msg': 'music is playing'})
    except:
        return jsonify({'msg', 'error'})
    return jsonify({'msg': 'play_on_host'})


@music.route("/upload_music", methods=["POST"])
@jwt_required
def upload_music():
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    if request.method != "POST":
        return jsonify({'msg': 'failed'})
    if not request.files['music']:
        return jsonify({'msg': 'failed'})
    music = request.files['music']
    if not music:
        return jsonify({'msg': 'failed'})
    if music.filename == "":
        return jsonify({'msg': 'failed'})
    if music.filename.upper().split(".")[1] not in current_app.config['UPLOAD_EXTENSIONS']:
        return jsonify({'msg': 'failed'})
    sec_filename = secure_filename(music.filename).lower()
    music.save(os.path.join(current_app.config['MUSIC_UPLOAD'], sec_filename))
    music_refresh(current_user)
    return jsonify({'msg': 'file uploaded'})

@music.route('/static/music/<music>',methods=["DELETE"])
@jwt_required
def delete_music(music):
    current_user = get_jwt_identity()
    current_user = User.query.filter_by(public_id=current_user).first()
    if current_user.admin != True:
        return jsonify({'msg':'not admin, cant delet'})
    music = Music.query.filter_by(title=music.split(".")[0]).first()
    if music:
        os.system("rm "+music.link)
        db.session.delete(music)
        db.session.commit()
        return jsonify({'msg':'deleted'})

    return jsonify({'msg':'not deleteed'})

@music.route('/get_music',methods=["POST"])
@jwt_required
def get_music():
    make_response(jsonify({'msg':'make_response'}))
    music = Music.query.all()
    music_info = []
    for m in music:
        music_info += [m.title +"."+m.format]
    return make_response(jsonify({'music_info':music_info}),200)

@music.route('/stop_music',methods=["POST"])
@jwt_required
def stop_music():
    simpleaudio.stop_all()
    return make_response(jsonify({'msg':'music_stopped'}))