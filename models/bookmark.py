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
    categories =\
        REL('Category', secondary='bookmark_category', backref='bookmarks')
    # Bookmark.tags setup using backref in Tag model

    def __init__(self, *args, **kwargs):
        """Initializes a new Bookmark"""
        super().__init__(*args, **kwargs)
