# shellcheck shell=ksh
# This file doesn't need a shebang because it will be executed by the stsyemd service
# Starts the BMM service on system boot
/home/michaeliyke/michaeliyke/projects/BMM/bin/gunicorn --bind 0.0.0.0:5000 wsgi:app --workers 2
