#!/usr/bin/python3
""" objects that handle all default RestFul API actions for States """
from models.category import Category
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/categories', methods=['GET', 'POST'], strict_slashes=False)
def get_all_or_create_category():
    """
    Retrieve all tag objects or create a new category object
    """
    if request.method == 'GET':
        try:
            categories = [c.to_dict() for c in storage.all(Category).values()]
            return make_response(jsonify(categories), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    # if request method is POST, create a new category object
    data = request.get_json()
    if request.method == 'POST':
        if not data:
            abort(400, description="Not a JSON")
        if 'name' not in data:
            abort(400, description="Missing name")
        if 'user_id' not in data:
            abort(400, description="Missing user_id")
        try:

            instance = Category(**data)
            instance.save()
            return make_response(jsonify(instance.to_dict()), 201)
        except Exception as e:
            abort(400, description=err_ctxt(e))


@app_views.route(
    '/categories/<ID>', methods=['GET', 'POST', 'DELETE'], strict_slashes=False)
def update_delete_get_category(ID):
    """ Retrieve, update, or delete a specific category"""
    # if request method is GET, retrieve the category object
    if request.method == 'GET':
        try:
            category = storage.get(Category, ID)
            if not category:
                abort(404)
            return make_response(jsonify(category.to_dict()), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    # if request method is DELETE, delete the category object
    if request.method == 'DELETE':
        try:
            category = storage.get(Category, ID)
            if not category:
                abort(404)
            storage.delete(category)
            storage.save()
            return make_response(jsonify({}), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    # if request method is POST, modify the tag object
    data = request.get_json()
    if request.method == 'POST':
        try:
            category = storage.get(Category, ID)

            if not category:
                abort(404)

            if not data:
                abort(400, description="Not a JSON")

            ignore = ['id', 'created_at', 'updated_at', 'user_id']

            for key, value in data.items():
                if key not in ignore:
                    setattr(category, key, value)
            storage.save()
            return make_response(jsonify(category.to_dict()), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

# curl -X GET http://localhost:5000/api/v1/categories
# curl -X POST -H "Content-Type: application/json" -d '{"name": "Online", "user_id": "1"}' http://localhost:5000/api/v1/categories
# curl -X GET http://localhost:5000/api/v1/categories/id
# curl -X POST http://localhost:5000/api/v1/categories/id -H "Content-Type: application/json" -d '{"name": "Surfing"}'
