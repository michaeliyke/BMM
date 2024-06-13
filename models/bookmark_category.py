from sqlalchemy import Column, String, ForeignKey
from sqlalchemy import Column, String, ForeignKey
from models.base_model import BaseModel, Base


class BookmarkCategory(Base, BaseModel):
    """Defines a junction table for many-to-many relationship"""
    __tablename__ = 'bookmark_category'
    bookmark_id = Column(
        String(60), ForeignKey('bookmarks.id'), primary_key=True)
    category_id = Column(
        String(60), ForeignKey('categories.id'), primary_key=True)

    def __init__(self, *, bookmark_id: str, category_id: str):
        """Initializes a new BookmarkCategory junction table"""
        super().__init__(*[], **{})
        self.bookmark_id = bookmark_id
        self.category_id = category_id

    @classmethod
    def add(BookmarkCategory, *, bookmark_id: str, category_id: str):
        """Initializes a junction table instance"""
        from models import storage

        bt = BookmarkCategory()
        bt.bookmark_id = bookmark_id
        bt.category_id = category_id
        storage.new(bt)
        # print(bt)
        return bt
