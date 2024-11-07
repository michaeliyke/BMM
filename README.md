# Bookmark Manager (BMM) Alx SE Foundation Portfolio Project

![ScreenShort](./landing/static/tmp/mockup.jpg)

## Introduction

Bookmark Manager (BMM) is a simple tool meant to ease the stress of bookmarking. It is to be be
simple and serving one single purpose which is to manage links and and get the best of that experience. It works exactly like your regular Chrome Bookmark but contains a lot more. While retaining the user experience of a simple Bookmarking tool, BMM gives the user real searchability into their timeline. You can tag your entries with a tags or simply arrange them in cateories.

[SEE THE LANDING PAGE](http://anexe.tech/)

## Installation Instructions

- For the extension, see the [README](./extension/README.md)
- For the landing page, see the [README](./landing/README.md)
- For the API, see the [README](./api/README.md)

### General Installation

1. Clone the repository: `git clone repo_url` BMM
1. Change directory: `cd BMM`
1. Create a virtual environment: `python3 -m venv venv`
1. Activate the virtual environment: `source venv/bin/activate`
1. Install the dependencies: `pip install -r requirements.txt`
1. Run the project: `gunicorn --bind 0.0.0.0:5000 wsgi:app --workers 2`

## Contibutors

1. [Michael C Iyke](https://github.com/michaeliyke) - Backend Engineer
1. [Jumoke  Kazeem](https://github.com/Jumoke1) - Frontend Engineer
1. [Dawit Getu](https://github.com/dawitgetuu) - Designer/Frontend Engineer

### Related projects

- Diigo
- Pocket App
- Microsoft Collections
