#!/usr/bin/python3
"""This module instantiates an object of class a named storage engine"""
import os
from dotenv import load_dotenv

load_dotenv()

storage_type = os.getenv("STORAGE_TYPE")
if not storage_type or storage_type == "db":
    from models.engine.db_storage import DBStorage
    storage = DBStorage()  # We use the database here

storage.reload()
