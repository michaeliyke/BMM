#!/usr/bin/python3
""" objects that handle all default RestFul API actions for States """
from models.tag import Tag
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/tags', methods=['GET', 'POST'], strict_slashes=False)
def get_all_or_create_tag():
    """
    Retrieve all tag objects or create a new tag object
    """
    if request.method == 'GET':
        try:
            tags = [t.to_dict() for t in storage.all(Tag).values()]
            return make_response(jsonify(tags), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    # if request method is POST, create a new tag object
    if request.method == 'POST':
        if not request.get_json():
            abort(400, description="Not a JSON")
        if 'name' not in request.get_json():
            abort(400, description="Missing name")
        data = request.get_json()
        try:
            instance = Tag(**data)
            instance.save()
            return make_response(jsonify(instance.to_dict()), 201)
        except Exception as e:
            abort(400, description=err_ctxt(e))


@ app_views.route(
    '/tags/<ID>', methods=['GET', 'POST', 'DELETE'], strict_slashes=False)
def update_delete_get_tag(ID):
    """ Retrieve, update, or delete a specific tag"""
    # if request method is GET, retrieve the tag object
    if request.method == 'GET':
        try:
            tag = storage.get(Tag, ID)
        except Exception as e:
            abort(400, description=err_ctxt(e))
        if not tag:
            abort(404)
        try:
            return make_response(jsonify(tag.to_dict()), 200)
        except Exception as e:
            abort(404, description=err_ctxt(e))

    # if rstr(e)quest method is DELETE, delete the tag object
    if request.method == 'DELETE':
        try:
            tag = storage.get(Tag, ID)
            if not tag:
                abort(404)
            storage.delete(tag)
            storage.save()
            return make_response(jsonify({}), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    # if request method is PUT, modify the tag object
    if request.method == 'POST':
        data = request.get_json()
        try:
            tag = storage.get(Tag, ID)
        except Exception as e:
            abort(400, description=err_ctxt(e))

        if not tag:
            abort(404)

        if not data:
            abort(400, description="Not a JSON")

        ignore = ['id', 'created_at', 'updated_at']
        try:
            for key, value in data.items():
                if key not in ignore:
                    setattr(tag, key, value)
            storage.save()
            return make_response(jsonify(tag.to_dict()), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

# curl -X GET http://localhost/bmm/api/tags/
# curl -X POST http://localhost/bmm/api/tags -H "Content-Type: application/json" -d '{"name": "educative"}'
# curl -X GET http://localhost/bmm/api/tags/id
# curl -X POST http://localhost/bmm/api/tags/id -H "Content-Type: application/json" -d '{"name": "informative"}'
