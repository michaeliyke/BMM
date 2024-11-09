#!/usr/bin/python3
"""This module instantiates an object of class a named storage engine"""
import os
import utils.params as pa


if not pa.STORAGE_TYPE or pa.STORAGE_TYPE == "db":
    from models.engine.db_storage import DBStorage
    storage = DBStorage()  # We use the database here

storage.reload()
