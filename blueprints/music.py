from flask import Flask, Blueprint, jsonify, Response, request, current_app
from .account_manage import token_required
import logging
from pydub import AudioSegment
import os as os
from . import db
from .models import Music
from werkzeug.utils import secure_filename
import simpleaudio
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
    test = Music.query.all()
    # for t in test:
    #     print("\n", t.title)
    #     print(t.format)
    #     print(t.link)
    #     print(t.user_id, "\n")
    return jsonify({'message': 'music refreshed'})

@music.route('/static/music/<music>')
@token_required
def play_on_lokal(current_user, music):
    print("\n",music,"\n")
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
        print("\n", music, "\n")
        return Response(generator(music), mimetype="audio/mp3")
    else:
        return jsonify({'message': 'music not in libary'})


@music.route('/static/music/<music>', methods=["POST"])
@token_required
def play_on_host(current_user, music):
    simpleaudio.stop_all()
    music_refresh(current_user)
    music = Music.query.filter_by(title=music.split(".")[0]).first()
    print("\n", music, "\n")
    if not music:
        return jsonify({'message': 'data is empty'})
    simpleaudio.stop_all()
    try:
        music = AudioSegment.from_file(music.link)
        simpleaudio.play_buffer(music.raw_data,num_channels=music.channels,bytes_per_sample=music.sample_width,sample_rate=music.frame_rate)
        return jsonify({'message': 'music is playing'})
    except:
        return jsonify({'message', 'error'})
    return jsonify({'message': 'play_on_host'})


@music.route("/upload_music", methods=["POST"])
@token_required
def upload_music(current_user):
    if request.method == "POST" and request.files["music"]:
        music = request.files["music"]
        if music and music.filename != "":
            if music.filename.upper().split(".")[1] in current_app.config['UPLOAD_EXTENSIONS']:
                sec_filename = secure_filename(music.filename).lower()
                print("\n",dir(music), "\n")
                music.save(os.path.join(current_app.config['MUSIC_UPLOAD'], sec_filename))
                music_refresh(current_user)
                return jsonify({'message': 'file uploaded'})
    return jsonify({'message': 'failed'})

@music.route('/static/music/<music>',methods=["DELETE"])
@token_required
def delete_music(current_user,music):
    if current_user.admin != True:
        return jsonify({'message':'not admin, cant delet'})
    music = Music.query.filter_by(title=music.split(".")[0]).first()
    if music:
        os.system("rm "+music.link)
        db.session.delete(music)
        db.session.commit()
        return jsonify({'message':'deleted'})

    return jsonify({'message':'not deleteed'})