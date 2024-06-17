#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint
# from utils.decorate.all_reqs import dec_api_head

app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')
# app_views.before_request(dec_api_head)  # Decorator for all API HEAD requests
# app_views.before_app_request(dec_api_head)  # Decorator 4 all API HEAD requests

if True:  # Dummy if to keep the imports below the app_views definition
    from api.v1.views.index import *
    from api.v1.views.tags import *
    from api.v1.views.categories import *
    from api.v1.views.users import *
    from api.v1.views.bookmarks import *
    from api.v1.views.bookmark_categories import *
    from api.v1.views.bookmark_tags import *
    from api.v1.views.category_tags import *
    from api.v1.views.category_bookmarks import *
    from api.v1.views.tag_categories import *
