# Bookmark Manager (BMM) Alx SE Foundation Portfolio Project

![ScreenShort](./landing/static/tmp/api.png)

## Introduction

Details of API calls including the endpoints, methods, and parameters are provided on Postman. [Click Here](https://documenter.getpostman.com/view/13468200/TzJx9G7m)

## API Installation Instructions

Same as the general installation instructions in the main README.md file.

### General Installation

1. Clone the repository: `git clone repo_url` BMM
1. Change directory: `cd BMM`
1. Create a virtual environment: `python3 -m venv venv`
1. Activate the virtual environment: `source venv/bin/activate`
1. Install the dependencies: `pip install -r requirements.txt`
1. Run the project: `gunicorn --bind 0.0.0.0:5000 wsgi:app --workers 2`

## API Endpoints

1. GET `/api/v1/status` - Get the status of the API

1. **/api/v1/bookmarks/\* Endpoints**

   - GET `/api/v1/bookmarks` - Get all bookmarks
   - POST `/api/v1/bookmarks` :- **{url, description,title}** - Create a new bookmark
   - GET `/api/v1/bookmarks/<id>` - Get a single bookmark
   - DELETE `/api/v1/bookmarks/<id>` - Delete a single bookmark
   - PUT `/api/v1/bookmarks/<id>`: **{url, description,title}** - Update a single bookmark

1. **/api/v1/tags/\* Endpoints**
   - GET `/api/v1/tags` - Get all tags
   - POST `/api/v1/tags` :- **{name}** - Create a new tag
   - GET `/api/v1/tags/<id>` - Get a single tag
   - DELETE `/api/v1/tags/<id>` - Delete a single tag
   - PUT `/api/v1/tags/<id>`: **{name}** - Update a single tag

1. **/api/v1/categories/\* Endpoints**
    - GET `/api/v1/categories` - Get all categories
    - POST `/api/v1/categories` :- **{name,user_id}** - Create a new category
    - GET `/api/v1/categories/<id>` - Get a single category
    - DELETE `/api/v1/categories/<id>` - Delete a single category
    - PUT `/api/v1/categories/<id>`: **{name,user_id}** - Update a single category

1. **/api/v1/users/\* Endpoints**
    - GET `/api/v1/users` - Get all users
    - POST `/api/v1/users` :- **{name,email,password,first_name,last_name}** - Create a user
    - GET `/api/v1/users/<id>` - Get a single user
    - DELETE `/api/v1/users/<id>` - Delete a single user
    - PUT `/api/v1/users/<id>`: **{name,email,password,first_name,last_name}** - Update a user

1. **/api/v1/auth/\* Endpoints**
    - POST `/api/v1/auth/login` :- **{email,password}** - Login a user
    - POST `/api/v1/auth/register` :- **{name,email,password,first_name,last_name}** - Register a user

1. **/api/v1/categories/<category_id>/tags**
    - GET `/api/v1/categories/<category_id>/tags` - Get all tags in a category
    - POST `/api/v1/categories/<category_id>/tags` :- **{category_id,tag_id}** - Create a tag under a category

1. **/api/v1/categories/<category_id>/bookmarks**
    - GET `/api/v1/categories/<category_id>/bookmarks` - Get all bookmarks in a category
    - POST `/api/v1/categories/<category_id>/bookmarks` :- **{category_id,bookmark_id}** - Create a bookmark under a category

1. **/api/v1/tags/<tag_id>/bookmarks**
    - GET `/api/v1/tags/<tag_id>/bookmarks` - Get all bookmarks with a tag
    - POST `/api/v1/tags/<tag_id>/bookmarks` :- **{tag_id,bookmark_id}** - Create a bookmark with a tag

1. **/api/v1/bookmarks/<bookmark_id>/tags**
    - GET `/api/v1/bookmarks/<bookmark_id>/tags` - Get all tags for a bookmark
    - POST `/api/v1/bookmarks/<bookmark_id>/tags` :- **{bookmark_id,tag_id}** - Create a tag for a bookmark

## Contibutors

1. [Michael C Iyke](https://github.com/michaeliyke) - Backend Engineer
1. [Jumoke  Kazeem](https://github.com/Jumoke1) - Frontend Engineer
1. [Dawit Getu](https://github.com/dawitgetuu) - Designer/Frontend Engineer

### Related projects

- Diigo
- Pocket App
- Microsoft Collections
