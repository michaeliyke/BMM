#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint

app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')
if True:  # Dummy if to keep the imports below the app_views definition
    from api.v1.views.index import *
    from api.v1.views.tags import *
    from api.v1.views.categories import *
    from api.v1.views.users import *
    from api.v1.views.bookmarks import *
