#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Bookmarks """
from models.bookmark import Bookmark
from models.category import Category
from models.tag import Tag
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/default', methods=['GET'], strict_slashes=False)
def default_bookmarks():
    """
    Retrieve all bookmark objects or create a new bookmark object
    """
    try:
        if request.method == 'GET':
            categories = []
            # create an empty dict
            for cat in storage.all(Category).values():
                category = {}
                # Add the category name to category
                category['name'] = cat.name
                # Init the category bookmarks property to an empty list
                category['bookmarks'] = []
                for bookmark in cat.bookmarks:
                    # Hold current bookmark in a variable
                    category_bookmark = bookmark.to_dict()
                    # Save all the tags for the current bookmark in a variable
                    tags = [tag.name for tag in bookmark.tags]
                    # Attach the tags to the current bookmark
                    category_bookmark['tags'] = tags
                    # Add the bookmark to the list of category bookmarks
                    category['bookmarks'].append(category_bookmark)
                # Add current category to the list of categories
                categories.append(category)
            return make_response(jsonify(categories), 200)
        # REQUEST METHOD IS HEADER
        if request.method == 'HEAD':
            return make_response(jsonify({}), 200)
        # 405 Method Not Allowed
        return make_response(jsonify({}), 405)
    except Exception as e:
        abort(400, description=err_ctxt(e))
