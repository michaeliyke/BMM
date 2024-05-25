#!/usr/bin/python3
""" Place Module for HBNB project """
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship as REL
from models.base_model import BaseModel, Base


class Tag(BaseModel, Base):
    """ Defines a Tag object"""
    __tablename__ = "tags"
    name = Column(String(255), nullable=False)
    # Tag.categories setup using backref in Category model
    # Below: Tag.bookmarks and Bookmark.tags both at once
    bookmarks = REL('Bookmark', secondary='bookmark_tag', backref='tags')

    def __init__(self, *args, **kwargs):
        """Initializes a new Tag"""
        super().__init__(*args, **kwargs)
