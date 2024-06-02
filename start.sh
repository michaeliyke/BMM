#!/usr/bin/bash
# Starts the BMM service on system boot
/home/michaeliyke/michaeliyke/projects/BMM/bin/gunicorn --bind 0.0.0.0:5010 wsgi:app --workers 2
/home/michaeliyke/michaeliyke/projects/BMM/bin/gunicorn --bind 0.0.0.0:5010 wsgi:app --workers 2
