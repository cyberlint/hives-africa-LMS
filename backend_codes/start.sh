#!/bin/bash
PORT=${PORT:-8000}
gunicorn --bind 0.0.0.0:$PORT backend_codes.wsgi:application
