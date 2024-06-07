#!/usr/bin/python3
"""Handles posting a new category to a bookmark,
and getting all categories of a bookmark
To edit a category, use the categories endpoints
To delete a category, use the categories endpoints
"""
from models.category import Category
from models.bookmark import Bookmark
from models.bookmark_category import BookmarkCategory
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/bookmarks/<bookmark_id>/categories', methods=['GET', 'POST'],
                 strict_slashes=False)
def get_all_categories_or_create(bookmark_id):
    """
    Retrieves the list of all Category objects of a Bookmark
    """
    if request.method == 'GET':
        bookmark = storage.get(Bookmark, bookmark_id)

        if not bookmark:
            abort(404)

        categories = [category.to_dict() for category in bookmark.categories]
        return jsonify(categories)

    if request.method == 'POST':
        bookmark = storage.get(Bookmark, bookmark_id)

        data = request.get_json()

        if not bookmark:
            abort(404)

        if not data:
            abort(400, description="Not a JSON")

        if 'user_id' not in data:
            abort(400, description="Missing user_id")

        user = storage.get(User, data['user_id'])

        if not user:
            abort(404)

        if 'name' not in request.get_json():  # category name
            abort(400, description="Missing name")

        data['bookmark_id'] = bookmark_id
        instance = Category(**data)
        instance.save()
        del data['name']
        BookmarkCategory(**data).save()
        return make_response(jsonify(instance.to_dict()), 201)

# curl -X GET http://localhost:5000/api/v1/bookmarks/1/categories
