#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Bookmarks """
from models.bookmark import Bookmark
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/bookmarks', methods=['GET', 'POST'], strict_slashes=False)
def get_all_or_create_bookmark():
    """
    Retrieve all bookmark objects or create a new bookmark object
    """
    try:
        if request.method == 'GET':
            bookmarks = []
            for _bookmark in storage.all(Bookmark).values():
                bookmark = _bookmark.to_dict()
                bookmark['tags'] = [tag.name for tag in _bookmark.tags]
                # categories = [cat.name for cat in b.categories] unuseful
                bookmarks.append(bookmark)
            return make_response(jsonify(bookmarks), 200)

        # if request method is POST, create a new bookmark object
        if request.method == 'POST':
            data = request.get_json()
            if not data:
                abort(400, description="Not a JSON")
            if 'url' not in data:
                abort(400, description="Missing URL")
            instance = Bookmark(**data)
            instance.save()
            return make_response(jsonify(instance.to_dict()), 201)

        # REQUEST METHOD IS HEADER
        if request.method == 'HEAD':
            return make_response(jsonify({}), 200)
        # 405 Method Not Allowed
        return make_response(jsonify({}), 405)
    except Exception as e:
        abort(400, description=err_ctxt(e))


@app_views.route(
    '/bookmarks/<ID>', methods=['GET', 'POST', 'DELETE'], strict_slashes=False)
def update_delete_get_bookmark(ID):
    """ Retrieve, update, or delete a specific bookmark"""
    # HEAD request
    if request.method == 'HEAD':
        return make_response(jsonify({}), 200)

    bookmark = storage.get(Bookmark, ID)

    # if request method is GET, retrieve the bookmark object
    if request.method == 'GET':
        if not bookmark:
            abort(404)
        return make_response(jsonify(bookmark.to_dict()), 200)

    # if request method is DELETE, delete the bookmark object
    if request.method == 'DELETE':
        if not bookmark:
            abort(404)
        storage.delete(bookmark)
        storage.save()
        return make_response(jsonify({}), 200)

    # if request method is POST, modify the bookmark object
    if request.method == 'POST':
        data = request.get_json()
        if not bookmark:
            abort(404)

        if not data:
            abort(400, description="Not a JSON")

        ignore = ['id', 'created_at', 'updated_at']

        for key, value in data.items():
            if key not in ignore:
                setattr(bookmark, key, value)
        storage.save()
        return make_response(jsonify(bookmark.to_dict()), 200)

# curl -X GET http://localhost/bmm/api/v1/bookmarks
# curl -X POST http://localhost/bmm/api/v1/bookmarks -H "Content-Type: application/json" -d '{"url":"https://www.google.com"}'
# curl -X GET http://localhost/bmm/api/bookmarks/id
# curl -X POST http://localhost/bmm/api/bookmarks/id -H "Content-Type: application/json" -d '{"url":"https://www.youtube.com"}'
