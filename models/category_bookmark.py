from sqlalchemy import Column, String, ForeignKey
from models.base_model import BaseModel, Base


class CategoryBookmark(BaseModel, Base):
    """Defines a junction table for many-to-many relationship"""
    __tablename__ = 'category_bookmark'
    category_id =\
        Column(String(60), ForeignKey('categories.id'), primary_key=True)
    bookmark_id =\
        Column(String(60), ForeignKey('bookmarks.id'), primary_key=True)

    def __init__(self, *, category_id: str, bookmark_id: str):
        """Initializes a new CategoryBookmark"""
        super().__init__(category_id=category_id, bookmark_id=bookmark_id)

    @classmethod
    def add(CategoryBookmark, *, bookmark_id: str, category_id: str):
        """Initializes a junction table instance"""
        from models import storage

        bt = CategoryBookmark()
        bt.bookmark_id = bookmark_id
        bt.category_id = category_id
        # print(bt)
        return bt
