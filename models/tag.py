#!/usr/bin/python3
""" Tag Model for BMM project """
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship as REL
from models.base_model import BaseModel, Base


class Tag(BaseModel, Base):
    """ Defines a Tag object"""
    __tablename__ = "tags"
    name = Column(String(255), nullable=False)
    # Establishes: Tag.bookmarks and Bookmark.tags
    # Serves: /bookmarks/<id>/tags and /tags/<id>/bookmarks
    # Needed: tag_bookmarks.py and bookmark_tags.py respectively
    bookmarks = REL('Bookmark', secondary='bookmark_tag', backref='tags')
    # Tag.categories setup using backref in Category model

    def __init__(self, *args, **kwargs):
        """Initializes a new Tag"""
        super().__init__(*args, **kwargs)
