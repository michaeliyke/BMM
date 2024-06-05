#!/usr/bin/python3
"""This module defines a class User"""
from models.base_model import BaseModel, Base
from sqlalchemy import String, Column
from sqlalchemy.orm import relationship


class User(BaseModel, Base):
    """Defines a User object"""
    __tablename__ = "users"
    email = Column(String(255), nullable=True)
    password = Column(String(255), nullable=True)
    username = Column(String(255), nullable=True)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    # Below establishes: [User.categories and Category.user] all all ta once
    categories = relationship("Category", backref="user")

    def __init__(self, *args, **kwargs):
        """Initializes a new User"""
        super().__init__(*args, **kwargs)
        # If email was omitted, create a dummy one using the id
        if not self.email:
            self.email = self.id + "@localhost"
