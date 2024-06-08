#!/usr/bin/python3
"""  """
from flask import render_template, jsonify, Blueprint
import uuid

web_view = Blueprint(
    'web_view', __name__, url_prefix='/web/v1', template_folder='templates')


@web_view.route('/health', methods=['GET'], strict_slashes=False)
def status():
    """ Status of API """
    return jsonify({"health": "OK"})


@web_view.route('/', strict_slashes=False)
def home():
    """ BMM landing page is alive! """

    return render_template('index.html', cache_id=uuid.uuid4())


@web_view.route('/about', strict_slashes=False)
def about():
    """ BMM landing about page is alive! """

    return render_template('about.html', cache_id=uuid.uuid4())
