#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Users """
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/users', methods=['GET', 'POST'], strict_slashes=False)
def get_all_or_create_user():
    """
    Retrieve all users or create a new user
    """
    if request.method == 'POST':
        data = request.get_json()
        if not data:
            abort(400, description="Not a JSON")
        # If email is present the password must be present
        if 'email' in data:
            if 'password' not in data:
                abort(400, description="Missing password")
        # If password is present the email must be present
        if 'password' in data:
            if 'email' not in data:
                abort(400, description="Missing email")
        # If email and password are absent, we'll take care in the model
        instance = User(**data)
        instance.save()
        return make_response(jsonify(instance.to_dict()), 201)
    elif request.method == 'GET':
        users = [user.to_dict() for user in storage.all(User).values()]
        return make_response(jsonify(users), 200)


@app_views.route(
    '/users/<user_id>', methods=['GET', 'POST', 'DELETE'], strict_slashes=False)
def update_delete_get_user(user_id):
    """ Retrieve, update, or delete a specific user"""
    user = storage.get(User, user_id)

    # Retrieve the user object if the request method is GET
    if request.method == 'GET':
        if not user:
            abort(404)
        return make_response(jsonify(user.to_dict()), 200)

    # Delete the user object if the request method is DELETE
    if request.method == 'DELETE':
        if not user:
            abort(404)
        storage.delete(user)
        storage.save()
        return make_response(jsonify({}), 200)
    # Modify the user object if the request method is POST
    if request.method == 'POST':
        data = request.get_json()
        if not user:
            abort(404)

        if not data:
            abort(400, description="Not a JSON")

        ignore = ['id', 'created_at', 'updated_at']

        for key, value in data.items():
            if key not in ignore:
                setattr(user, key, value)
        storage.save()
        return make_response(jsonify(user.to_dict()), 200)

# curl -X POST http://0.0.0.0:5000/api/v1/users -H "Content-Type: application/json" -d '{"email": "user@user", "password": "password"}'
# curl -X GET http://0.0.0.0:5000/api/v1/users
# curl -X POST http://0.0.0.0:5000/api/v1/users/e13e9f8f-929a-46e0-b4e4-d4a463e836dc -H "Content-Type: application/json" -d '{"first_name": "odo", "last_name": "Gwu"}'
# curl -X DELETE http://0.0.0.0
