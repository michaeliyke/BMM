#!/usr/bin/bash
# The starter script for the BMM service

# Move to the ROOT of the project
cd ..

# Check for the environment variables file and load it
if [ -f ".env" ]; then
	source ".env"
else
	echo "Environment variables file not found at the location"
	exit 1
fi

# Start the BMM services
# api
/home/ubuntu/apps/BMM/bin/gunicorn --bind 0.0.0.0:5010 wsgi:app --workers 2 --threads 2
# landing
/home/ubuntu/apps/BMM/bin/gunicorn --bind 0.0.0.0:5011 landing.home:app --workers 2 --threads 2
# files
# /home/ubuntu/apps/BMM/bin/gunicorn --bind 0.0.0.0:5012 landing.files:app --workers 2 --threads 2
