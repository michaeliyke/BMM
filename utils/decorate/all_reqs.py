"""Decorators for all request methods"""
from functools import wraps
from flask import request, make_response, jsonify, abort


def dec_api_head(fn):
    """Handler for all HEAD requests on the API Blueprint"""
    @wraps(fn)
    def handler(*args, **kwargs):
        if request.method == 'HEAD':
            return make_response(jsonify({}), 200)
        return fn(*args, **kwargs)
    return handler


def dec_html_head(fn):
    """Handler for all HEAD requests on the HTML Blueprint"""
    @wraps(fn)  # Ensures metadata is preserved
    def handler(*args, **kwargs):
        if request.method == 'HEAD':
            res = make_response()
            res.headers['Content-Type'] = 'text/html; charset=utf-8'
            res.headers['Content-Length'] = 0
            return res
        return fn(*args, **kwargs)  # Call the endpoint fn for other methods
    return handler
