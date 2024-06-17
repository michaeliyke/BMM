#!/usr/bin/python3
"""Handles posting a new bookmark to a category,
and getting all bookmarks of a category
To edit a bookmark, use the bookmarks endpoints
To delete a bookmark, use the bookmarks endpoints
"""
from models.bookmark import Bookmark
from models.category import Category
from models.category_bookmark import CategoryBookmark
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/categories/<category_id>/bookmarks',
                 methods=['GET', 'POST'], strict_slashes=False)
def get_all_category_bookmarks_or_create(category_id):
    """
    Retrieves the list of all Bookmark objects of a Category OR
    creates(or adds) a new Bookmark object for a Category
    """
    if request.method == 'GET':
        try:
            category = storage.get(Category, category_id)
            if not category:
                abort(404, description="Category not found")
            bookmarks = [bookmark.to_dict() for bookmark in category.bookmarks]
            return make_response(jsonify(bookmarks), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    if request.method == 'POST':
        try:
            category = storage.get(Category, category_id)
            data = request.get_json()

            if not category:
                abort(404, description="Category not found")

            if not data:
                abort(400, description="Not a JSON")

            if 'url' in data and 'bookmark_id' in data:
                msg = "Found both url and bookmark id, only one needed"
                abort(400, description=msg)

            if 'url' not in data and 'bookmark_id' not in data:
                msg = "Mising both url and bookmark id, only one needed"
                abort(400, description=msg)

            if 'url' in data:  # create a new bookmark
                bookmark = Bookmark(**data)
                del data['url']
                data['bookmark_id'] = bookmark.id
            elif 'bookmark_id' in data:  # add an existing bookmark
                bookmark = storage.get(Bookmark, data['bookmark_id'])

            if not bookmark:
                abort(404, description="Bookmark not found")
            data['category_id'] = category_id
            category_bookmark = CategoryBookmark(
                category_id=category_id, bookmark_id=bookmark.id)
            print("Storage: ", category_bookmark.to_dict())

            bookmark.save()
            category_bookmark.save()
            return make_response(jsonify(category_bookmark.to_dict()), 201)
        except Exception as e:
            abort(400, description=err_ctxt(e))

# curl -X POST -H "Content-Type: application/json" -d '{"name":"new bookmark"}' 0/bmm/api/categories/1/bookmarks
# curl -X GET http://localhost/bmm/api/categories/1/bookmarks
