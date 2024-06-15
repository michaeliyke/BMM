from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import declarative_base
from models.base_model import BaseModel, Base


class CategoryTag(Base, BaseModel):
    """Defines a junction table for many-to-many relationship"""
    __tablename__ = 'category_tag'
    category_id =\
        Column(String(60), ForeignKey('categories.id'), primary_key=True)
    tag_id = Column(String(60), ForeignKey('tags.id'), primary_key=True)

    def __init__(self, *, category_id: str, tag_id: str):
        """Initializes a new CategoryTag"""
        super().__init__(*[], **{})
        self.category_id = category_id
        self.tag_id = tag_id

    @classmethod
    def add(CategoryTag, *, tag_id: str, category_id: str):
        """Initializes a junction table instance"""
        from models import storage

        bt = CategoryTag()
        bt.tag_id = tag_id
        bt.category_id = category_id
        # print(bt)
        return bt
