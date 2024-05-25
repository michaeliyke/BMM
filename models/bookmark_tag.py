from sqlalchemy import Column, String, ForeignKey
from models.base_model import BaseModel, Base
from models import storage


class BookmarkTag(Base):
    """Defines a junction table for many-to-many relationship"""
    __tablename__ = 'bookmark_tag'
    bookmark_id =\
        Column(String(60), ForeignKey('bookmarks.id'), primary_key=True)
    tag_id = Column(String(60), ForeignKey('tags.id'), primary_key=True)

    def __init__(self, *, bookmark_id: str, tag_id: str):
        """Initializes a new BookmarkTag junction table"""
        super().__init__(*[], **{})
        self.bookmark_id = bookmark_id
        self.tag_id = tag_id

    @classmethod
    def add(BookmarkTag, *, bookmark_id: str, tag_id: str):
        """Initializes a junction table instance"""
        from models import storage

        bt = BookmarkTag()
        bt.bookmark_id = bookmark_id
        bt.tag_id = tag_id
        # print(bt)
        return bt
