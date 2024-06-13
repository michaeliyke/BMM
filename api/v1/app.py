#!/usr/bin/python3
""" Flask Application """
from models import storage
from flasgger.utils import swag_from
from flasgger import Swagger
from flask_cors import CORS
from flask import Flask, make_response, jsonify
from api.v1.views import app_views  # The api Blueprint
from landing import web_view  # The web Blueprint
from os import environ


app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.register_blueprint(app_views)
app.register_blueprint(web_view)
# CORS handles the OPTIONS request for us along with CORS headers
# cors = CORS(app, resources={r"/*": {"origins": "0.0.0.0"}})
cors = CORS(app, resources={r"/api/v1/*": {"origins": "*"}})


@app.teardown_appcontext
def close_db(error):
    """ Close Storage """
    storage.close()


@app.errorhandler(405)
def method_not_allowed(error):
    """405 method not allowed error"""
    return make_response(jsonify({"error": "Not allowed"}), 405)


@app.errorhandler(501)
def method_not_allowed(error):
    """405 method not allowed error"""
    return make_response(jsonify({"error": "Not implemented"}), 501)


@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    responses:
    404:
        description: a resource was not found
    """
    return make_response(jsonify({'error': "Not found"}), 404)


@app.errorhandler(400)
def bad_request(error):
    """400 bad request error"""
    return make_response(jsonify({"error": error.description}), 400)


app.config['SWAGGER'] = {
    'title': 'BookMark Manager (BMM) Restful API',
    'uiversion': 3
}

Swagger(app)


if __name__ == "__main__":
    host = environ.get('BMM_API_HOST')
    port = environ.get('BMM_API_PORT')
    if not host:
        host = '0.0.0.0'
    if not port:
        port = '5000'
    app.run(host=host, port=port, threaded=True, debug=True)
