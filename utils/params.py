#!/usr/bin/env python3
"""Contains project important parameters for easy reference"""
import os
from dotenv import load_dotenv

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BMM_ENV = os.getenv('BMM_ENV')  # This env has to be set in the system

if not BMM_ENV:
    raise ValueError("BMM_ENV environment variable is not set")
elif BMM_ENV == 'DEV':  # Load the development environment variables
    load_dotenv(f"{ROOT_DIR}/.dev.env")
else:  # Load the production environment variables
    load_dotenv(f'{ROOT_DIR}/.env.prod')

STORAGE_TYPE = os.getenv("STORAGE_TYPE")

DB_USER = os.getenv("DB_USER")
DB_PWD = os.getenv("DB_PWD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
BMM_ENV = os.getenv("BMM_ENV")
DB_PORT = os.getenv("DB_PORT")

BMM_API_HOST = os.getenv('BMM_API_HOST')
BMM_API_PORT = os.getenv('BMM_API_PORT')
BMM_API_DEBUG = os.getenv('BMM_API_DEBUG')
