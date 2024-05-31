#!/usr/bin/bash
# ExecStart=/home/michaeliyke/michaeliyke/projects/BMM/bin/gunicorn --workers 3 --bind unix:bmm.sock -m 007 wsgi:app
# ExecStart=/home/michaeliyke/michaeliyke/projects/BMM/bin/gunicorn --bind 0.0.0.0:5000 wsgi:app --workers 3
# ExecStart=/home/michaeliyke/michaeliyke/projects/BMM/bin/gunicorn --bind unix:$PROJ_ROOT/bmm.sock wsgi:app -m 777 --workers 4 --threads 2 --timeout 90 --log-level=debug --log-file="$PROJ_ROOT/logs/gunicorn.log" --access-logfile="$PROJ_ROOT/logs/access.log" --error-logfile="$PROJ_ROOT/logs/error.log" --capture-output --enable-stdio-inheritance

# /etc/systemd/system/bmm.service
# sudo systemctl start bmm
# sudo systemctl enable bmm

# gunicorn --bind 0.0.0.0:5000 wsgi:app --workers 4 --threads 2 --timeout 90 --log-level=debug --log-file="$PROJ_ROOT/logs/gunicorn.log" --access-logfile="$PROJ_ROOT/logs/access.log" --error-logfile="$PROJ_ROOT/logs/error.log" --capture-output --enable-stdio-inheritance
# ExecStart=/home/michaeliyke/michaeliyke/projects/BMM/bin/gunicorn --bind unix:bmm.sock wsgi:app -m 007 --workers 2 --threads 2 --timeout 90 --log-level=debug --log-file=logs/gunicorn.log --access-logfile=logs/access.log --error-logfile=logs/error.log --capture-output --enable-stdio-inheritance

# Restart=always
# /etc/systemd/system/bmm.service
# sudo systemctl start bmm
# sudo systemctl enable bmm
# Run init.sh before starting gunicorn
# ExecStartPre=/home/michaeliyke/michaeliyke/projects/BMM/init.sh
# Granting permission to the group ww-data to read and write to x.txt
# sudo setfacl -g:ww-data:rw x.txt
