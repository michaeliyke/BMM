#!/usr/bin/python3
""" Place Module for HBNB project """
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship as REL
from models.base_model import BaseModel, Base


class Category(BaseModel, Base):
    """ Defines a Category object """
    __tablename__ = "categories"
    user_id = Column(String(60), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    # Establishes: Category.tags and Tag.categories
    # Serves: /categories/<id>/tags and /tags/<id>/categories
    # Needed: category_tag.py and tag_categories.py respectively
    tags = REL('Tag', secondary="category_tag", backref='categories')
    # Category.bookmarks setup using backref in Bookmark model

    def __init__(self, *args, **kwargs):
        """Initializes a new Category"""
        super().__init__(*args, **kwargs)
