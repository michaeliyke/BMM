#!/usr/bin/python3
"""Handles posting a new bookmark to a tag,
and getting all bookmarks of a tag
To edit a bookmark, use the bookmarks endpoints
To delete a bookmark, use the bookmarks endpoints
"""
from models.bookmark import Bookmark
from models.tag import Tag
from models.bookmark_tag import BookmarkTag
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from utils.err import err_ctxt


@app_views.route('/tags/<tag_id>/bookmarks/', methods=['GET', 'POST'],
                 strict_slashes=False)
def get_all_tag_bookmarks_or_create(tag_id):
    """
    Retrieves the list of all Bookmark objects of a Tag OR
    creates(or adds) a new Bookmark object for a Tag
    """
    if request.method == 'GET':
        try:
            tag = storage.get(Tag, tag_id)
            if not tag:
                abort(404, description="Tag not found")
            bookmarks = [bookmark.to_dict() for bookmark in tag.bookmarks]
            return make_response(jsonify(bookmarks), 200)
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

            if 'url' in data and 'bookmark_id' in data:
                msg = "Found both name and bookmark id, only one needed"
                abort(400, description=msg)

            if 'url' not in data and 'bookmark_id' not in data:
                msg = "Mising both name and bookmark id, only one needed"
                abort(400, description=msg)

            if 'url' in data:  # create a new bookmark
                bookmark = Bookmark(**data)
                del data['url']
                data['bookmark_id'] = bookmark.id
            elif 'bookmark_id' in data:  # add an existing bookmark
                bookmark = storage.get(Bookmark, data['bookmark_id'])

            if not bookmark:
                abort(404, description="Bookmark not found")

            data['tag_id'] = tag_id
            bookmark_tag = BookmarkTag(**data)
            bookmark.save()
            bookmark_tag.save()
            return make_response(jsonify(bookmark.to_dict()), 201)
        except Exception as e:
            abort(400, description=err_ctxt(e))

# curl -X POST -H "Content-Type: application/json" -d '{"name":"new bookmark"}' 0/bmm/api/tags/1/bookmarks
# curl -X GET http://localhost/bmm/api/tags/1/bookmarks
