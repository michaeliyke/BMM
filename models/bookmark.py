#!/usr/bin/python3
""" Place Module for HBNB project """
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship as REL
from models.base_model import BaseModel, Base


class Bookmark(BaseModel, Base):
    """ Defines a Bookmark object """
    __tablename__ = "bookmarks"
    url = Column(String(1024), nullable=False)
    description = Column(String(1024), nullable=True)
    title = Column(String(255), nullable=True)
    # Establishes: Bookmark.categories and Category.bookmarks
    # Serves: /bookmarks/<id>/categories and /categories/<id>/bookmarks
    # Needed: bookmark_categories.py and category_bookmarks.py respectively
    categories =\
        REL('Category', secondary='category_bookmark', backref='bookmarks')
    # Bookmark.tags setup using backref in Tag model

    def __init__(self, *args, **kwargs):
        """Initializes a new Bookmark"""
        super().__init__(*args, **kwargs)
