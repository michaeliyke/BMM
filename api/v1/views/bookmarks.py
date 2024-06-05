#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Bookmarks """
from models.bookmark import Bookmark
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/bookmarks', methods=['GET', 'POST'], strict_slashes=False)
def get_all_or_create_bookmark():
    """
    Retrieve all bookmark objects or create a new bookmark object
    """
    if request.method == 'GET':
        bookmarks = [b.to_dict() for b in storage.all(Bookmark).values()]
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


@app_views.route(
    '/bookmarks/<ID>', methods=['GET', 'POST', 'DELETE'], strict_slashes=False)
def update_delete_get_bookmark(ID):
    """ Retrieve, update, or delete a specific bookmark"""
    # if request method is GET, retrieve the bookmark object
    if request.method == 'GET':
        bookmark = storage.get(Bookmark, ID)
        if not bookmark:
            abort(404)
        return make_response(jsonify(bookmark.to_dict()), 200)

    # if request method is DELETE, delete the bookmark object
    if request.method == 'DELETE':
        bookmark = storage.get(Bookmark, ID)
        if not bookmark:
            abort(404)
        storage.delete(bookmark)
        storage.save()
        return make_response(jsonify({}), 200)

    # if request method is POST, modify the bookmark object
    if request.method == 'POST':
        data = request.get_json()
        bookmark = storage.get(Bookmark, ID)

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

# curl -X POST -H "Content-Type: application/json" -d '{"url":"https://www.google.com"}' http://localhost:5000/api/v1/bookmarks
# curl -X GET http://localhost:5000/api/v1/bookmarks
