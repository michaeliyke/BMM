#!/usr/bin/python3
"""Handles posting a new category to a tag,
and getting all categories of a tag
To edit a category, use the categories endpoints
To delete a category, use the categories endpoints
"""
from models.category import Category
from models.tag import Tag
from models.category_tag import CategoryTag
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/tags/<tag_id>/categories/', methods=['GET', 'POST'],
                 strict_slashes=False)
def get_all_tag_categories_or_create(tag_id):
    """
    Retrieves the list of all Category objects of a Tag OR
    creates(or adds) a new Category object for a Tag
    """
    if request.method == 'GET':
        try:
            tag = storage.get(Tag, tag_id)
            if not tag:
                abort(404, description="Tag not found")
            categories = [category.to_dict() for category in tag.categories]
            return make_response(jsonify(categories), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    if request.method == 'POST':
        try:
            tag = storage.get(Tag, tag_id)
            data = request.get_json()

            if not tag:
                abort(404, description="Tag not found")

            if not data:
                abort(400, description="Not a JSON")

            if 'name' in data and 'category_id' in data:
                msg = "Found both name and category id, only one needed"
                abort(400, description=msg)

            if 'name' not in data and 'category_id' not in data:
                msg = "Mising both name and category id, only one needed"
                abort(400, description=msg)

            if 'name' in data:  # create a new category
                if 'user_id' not in data:
                    abort(400, description="Missing user_id")

                if not storage.get(User, data['user_id']):
                    abort(404, description="User not found")

                category = Category(**data)
                del data['name']
                del data['user_id']
                data['category_id'] = category.id
            elif 'category_id' in data:  # add an existing category
                if 'user_id' in data:
                    abort(400, description="Unnecessary user_id")
                category = storage.get(Category, data['category_id'])

            if not category:
                abort(404, description="Category not found")

            data['tag_id'] = tag_id
            category_tag = CategoryTag(**data)
            category.save()
            category_tag.save()
            return make_response(jsonify(category.to_dict()), 201)
        except Exception as e:
            abort(400, description=err_ctxt(e))

# curl -X POST -H "Content-Type: application/json" -d '{"name":"new category"}' 0/bmm/api/tags/1/categories
# curl -X GET http://localhost/bmm/api/tags/1/categories