#!/usr/bin/bash
# This file must exit successfully for the bmm service to start

# Gunicorn dependency
if ! command -v gunicorn; then
	pip install gunicorn
else
	# copy gunicorn binary /bin
	cp "$(command -v gunicorn)" ./bin
fi

# systemctl stop bmm

if [ -f ".env" ]; then
	source ".env"
else
	echo "Please create a .env file in the project root directory"
	exit 1
fi

exit 0
