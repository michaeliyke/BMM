#!/usr/bin/env bash

cls

if ! command -v gunicorn; then
	pip install gunicorn
fi

# if ! command -v uwsgi; then
	# [pip|conda] install uwsgi
# fi

# ssshellcheck sssource=/dev/null
if [ -e "$PWD/.env" ]; then source '.env'; fi

# uwsgi --socket 0.0.0.0:8080 --protocol=http -w app:application

python -m api.v1.app
