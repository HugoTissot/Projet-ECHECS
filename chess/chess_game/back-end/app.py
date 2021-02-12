#! /usr/bin/env python3

import logging as log
log.basicConfig(level=log.INFO)

# get running version from local file
with open("VERSION") as VERSION:
    branch, commit, date = VERSION.readline().split(" ")

# start flask service
from flask import Flask, jsonify, request, Response
app = Flask("echecs")

import datetime as dt
started = dt.datetime.now()

# get flask configuration, or fall back on environment
from os import environ as ENV

if "APP_CONFIG" in ENV:
    log.info(f"configuring from {ENV['APP_CONFIG']}")
    app.config.from_envvar("APP_CONFIG")
    CONF = app.config  # type: ignore
else:
    log.info("configuring from environment")
    CONF = ENV  # type: ignore

# web app
if CONF.get("ENABLE_FLASK_CORS", False):
    from flask_cors import CORS  # type: ignore
    CORS(app)

# create database connection and load queries
import anodb  # type: ignore

db = anodb.DB(
    CONF["DB_TYPE"], CONF["DB_CONN"], CONF["DB_SQL"], CONF["DB_OPTIONS"]
)


#
# Request parameters, in json, form or args…
#
PARAMS = {}

def set_params():
    global PARAMS
    PARAMS = request.values if request.json is None else request.json

app.before_request(set_params)


#
# AAA: Authentication, Authorization and Audit
#
# Authorizations are mostly the realm of the application itself, once
# the initial access is granted.
#
# Authentication and Audit are best delegated to the web server.
#
# Alas, flask development server (aka Werkzeug) does not know how to do
# Authentication:-(
#
# The usual flask solution is to handle it in flask itself, which looks
# like a poor choice because it is quite inefficient.
# The work around is that *under testing*, the `LOGIN` parameter is accepted
# as a login claim, # and tests can take advantage of this.
# Obviously, this behavior is not welcome in production.
#
# Sigh.
#
LOGIN: str = ""

# setup LOGIN through a hook
if CONF.get("TESTING", False):
    # this ugly hack is only for local testing purposes…
    def set_login():
        assert CONF["TESTING"]
        assert request.remote_user is None
        assert request.environ["REMOTE_ADDR"] == "127.0.0.1"
        global LOGIN
        LOGIN = PARAMS.get("LOGIN", None)
        log.debug(f"LOGIN: {LOGIN}")
else:
    def set_login():
        global LOGIN
        LOGIN = request.remote_user

app.before_request(set_login)


#
# *ALWAYS* commit after request execution
#
# Otherwise the connection is left 'idle in transaction',
# which blocks dumps and the like.
#
# Note: given the simple queries involved, it could probably
# be enough to turn autocommit on.
#
def db_commit(res: Response):
    try:
        db.commit()
        return res
    except Exception as err:
        log.warning(f"db.commit() failed: {err}")
        return "commit failed", 500

app.after_request(db_commit)


#
# GET /version
#
# General information about running app.
#
@app.route("/version", methods=["GET"])
def get_version():
    # TODO: Autorisation
    # if not can_read(LOGIN):
    #     return "", 403
    now = db.get_now()[0][0]
    return jsonify(
        {
            "app": app.name,
            "variant": "anodb",
            "version": 4,
            "db": CONF["DB_TYPE"],
            "started": str(started),
            "user": LOGIN,
            "branch": branch,
            "commit": commit,
            "date": date,
            "now": now,
        }
    ), 200


#
# GET /utilisateur/<pseudo>
#
# Just return the associated value as a scalar.
#
@app.route("/utilisateur/<pseudo>", methods=["GET"])
def get_utilisateur_pseudo(pseudo: str):
    # TODO: Autorisation
    res = db.get_utilisateur_pseudo(pseudo=pseudo)
    if len(res) == 1:
        return jsonify(res[0][0]), 200
    else:
        return "no such resource", 404


#
# PUT /utilisateur/<pseudo>
# PATCH /utilisateur/<pseudo>
#
# It does a graceful insert…
#
@app.route("/utilisateur", methods=["PUT", "PATCH","POST"])
def put_utilisateur_pseudo():
    # TODO: Autorisation
    if "mdp" not in PARAMS:
        return "missing 'mdp' parameter", 400
    elif "nom" not in PARAMS:
        return "missing 'nom' parameter", 400
    elif "prenom" not in PARAMS:
        return "missing 'prenom' parameter", 400
    db.insert_utilisateur(pseudo=PARAMS["pseudo"], mdp=PARAMS["mdp"],nom=PARAMS["nom"],prenom=PARAMS["prenom"])
    return "", 201


#
# DELETE /utilisateur/<pseudo>
#
@app.route("/utilisateur/<pseudo>", methods=["DELETE"])
def del_utilisateur_pseudo(pseudo: str):
    # TODO: Autorisation
    if len(db.get_utilisateur_pseudo(pseudo=pseudo)) != 1:
        return "no such resource", 404
    db.del_utilisateur_pseudo(pseudo=pseudo)
    return "", 204


#
# GET /utilisateur?filter=…
#
@app.route("/utilisateur", methods=["GET"])
def get_utilisateur():
    # TODO: Autorisation
    if "filter" in PARAMS:
        res = db.get_utilisateur_filter(filter=PARAMS["filter"])
    else:
        res = db.get_utilisateur_all()
    return jsonify(res), 200


#
# DELETE /utilisateur?filter=…
#
@app.route("/utilisateur", methods=["DELETE"])
def del_utilisateur():
    # TODO: Autorisation
    if "filter" in PARAMS:
        db.del_utilisateur_filter(filter=PARAMS["filter"])
    else:
        db.del_utilisateur_all()
    return "", 204


#
# POST /utilisateur
#

@app.route("/auth", methods=["POST"])
def match_mdp_utilisateur():
    # TODO: Autorisation
    res0=get_utilisateur_pseudo(PARAMS["pseudo"])
    if "pseudo" not in PARAMS or "mdp" not in PARAMS:
        return jsonify("missing parameter"), 404
    else:    
        res=db.get_motdepasse(pseudo=PARAMS["pseudo"])
        res2=db.get_utilisateur_pseudo(pseudo=PARAMS["pseudo"])
        if res2[0][0]!=PARAMS["pseudo"]:
            return jsonify("false"), 401
        elif res[0][0]!=PARAMS["mdp"]:
            return jsonify("false"), 200
        else: 
            return jsonify("true")

@app.route("/game", methods=["POST"])
def update_fen():
    if "config" not in PARAMS or "num" not in PARAMS:
        return jsonify("missing parameter"), 404
    else:
        db.post_fen(config=PARAMS["config"], num=PARAMS["num"])
        return jsonify("true")

@app.route("/game", methods=["PUT"])
def get_fen():
    if "num" not in PARAMS :
        return jsonify("missing parameter"), 404
    else :
        res = db.get_fen(num=PARAMS["num"])
        return jsonify(res[0][0])