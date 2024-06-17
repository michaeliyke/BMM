"""Defines a class to manage the BMM db storage using SQLAlchemy """
from sqlalchemy import create_engine, MetaData
import sqlalchemy.orm as orm
import os


class DBStorage:
    """This class manages storage of hbnb models using a DB"""
    __engine = None
    __session = None

    def __init__(self):
        """Returns a sqlachemy orm object of models currently the storage"""
        from models.base_model import Base

        USER = os.getenv("BMM_DB_USER")
        PWD = os.getenv("BMM_DB_PWD")
        HOST = os.getenv("BMM_DB_HOST")
        DB = os.getenv("BMM_DB_NAME")
        ENV = os.getenv("BMM_ENV")
        conn_str = "mysql+mysqldb://{}:{}@{}/{}".format(USER, PWD, HOST, DB)
        self.__engine = create_engine(conn_str, pool_pre_ping=True)
        Base.metadata.create_all(self.__engine)

        if ENV == "test":
            metadata = MetaData()  # Meta data object
            metadata.reflect(self.__engine)  # Analyze db relationships
            # Drop all tables in their dependencies order
            metadata.drop_all(self.__engine)

    def close(self):
        """Closes the current session and engine"""
        # self.__session.remove()
        self.__session.close()

    def all(self, cls):
        """Return all of a certain model class"""
        new_dict = {}
        if cls:
            objs = self.__session.query(cls).all()
            for obj in objs:
                key = obj.__class__.__name__ + '.' + obj.id
                new_dict[key] = obj
        return (new_dict)

    def get(self, cls, id):
        """Returns single object based on the class and its ID, or None"""
        objs = self.__session.query(cls).all()
        for obj in objs:
            if obj.id == id:
                return obj
        return None

    def count(self, cls=None):
        """ Returns the number of objects in storage matching the given class.
        If no class is passed, returns the count of all objects in storage."""
        return len(self.all(cls))

    def new(self, obj):
        """add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current database session"""
        # self.__session.add(self)
        self.__session.commit()

    def delete(self, obj=None):
        """delete from the current database session obj if not None"""
        if obj:
            self.__session.delete(obj)
            self.save()

    def reload(self):
        """create all tables in the database"""
        from models.base_model import BaseModel, Base
        from models.bookmark import Bookmark
        from models.bookmark_tag import BookmarkTag
        from models.category import Category
        from models.category_tag import CategoryTag
        from models.tag import Tag
        from models.user import User

        # for model in [BaseModel, User, Place, State, City, Amenity, Review]:
        #     self.new(model)

        """create all tables in the database"""
        Base.metadata.create_all(self.__engine)
        factory = orm.sessionmaker(bind=self.__engine)
        Session = orm.scoped_session(factory)
        self.__session = Session(bind=self.__engine, expire_on_commit=False)
        # self.__session.dir
