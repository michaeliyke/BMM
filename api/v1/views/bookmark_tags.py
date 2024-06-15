#!/usr/bin/python3
"""Handles posting a new tag to a bookmark,
and getting all tags of a bookmark
To edit a tag, use the tags endpoints
To delete a tag, use the tags endpoints
"""
from models.tag import Tag
from models.bookmark import Bookmark
from models.bookmark_tag import BookmarkTag
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/bookmarks/<bookmark_id>/tags', methods=['GET', 'POST'],
                 strict_slashes=False)
def get_all_tags_or_create(bookmark_id):
    """
    Retrieves the list of all Tag objects of a Bookmark OR
    creates(or adds) a new Tag object for a Bookmark
    """
    if request.method == 'GET':
        try:
            bookmark = storage.get(Bookmark, bookmark_id)
            if not bookmark:
                abort(404, description="Bookmark not found")
            tags = [tag.to_dict() for tag in bookmark.tags]
            return make_response(jsonify(tags), 200)
        except Exception as e:
            abort(400, description=err_ctxt(e))

    if request.method == 'POST':
        try:
            bookmark = storage.get(Bookmark, bookmark_id)
            data = request.get_json()

            if not bookmark:
                abort(404, description="Bookmark not found")

            if not data:
                abort(400, description="Not a JSON")

            if 'name' in data and 'tag_id' in data:
                msg = "Found both name and tag id, only one needed"
                abort(400, description=msg)

            if 'name' not in data and 'tag_id' not in data:
                msg = "Mising both name and tag id, only one needed"
                abort(400, description=msg)

            if 'name' in data:  # create a new tag
                tag = Tag(**data)
                del data['name']
                data['tag_id'] = tag.id
            elif 'tag_id' in data:  # add an existing tag
                tag = storage.get(Tag, data['tag_id'])

            if not tag:
                abort(404, description="Tag not found")
            data['bookmark_id'] = bookmark_id
            bookmark_tag = BookmarkTag(**data)
            tag.save()
            bookmark_tag.save()
            return make_response(jsonify(tag.to_dict()), 201)
        except Exception as e:
            abort(400, description=err_ctxt(e))

# curl -X POST -H "Content-Type: application/json" -d '{"name":"new tag"}' 0/bmm/api/bookmarks/1/tags
# curl -X GET http://localhost/bmm/api/bookmarks/1/tags
