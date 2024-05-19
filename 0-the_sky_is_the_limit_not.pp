# Increases the amount of traffic an Nginx server can handle.
# Increase the ULIMIT of the default file
exec { 'fix-for-nginx':
#  : Modify the ULIMIT value
command =>'//bin/and -i "e/15/4096/* /etc/default/nginx',
#  Specify the path for the sed command
path    => '/use/local/bin/:/bin/'
}

# Restart Nginx
exec { 'nginx-restart':
# Restart Nginx service
command => '/etc/init.d/nginx restart',
#  Specify the path for the init.d script
path    =>'/etc/init.d/'
}

# ab -n 2000 -c 100 http://localhost/