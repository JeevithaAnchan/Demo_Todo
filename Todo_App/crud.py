from sqlalchemy.orm import Session
from . import models, schemas

def get_all_todos(db: Session):
    return db.query(models.Todo).all()

def create_todo(db: Session, todo: schemas.TodoCreate):
    db_todo = models.Todo(title=todo.title)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, updated: schemas.TodoUpdate):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        return None
    db_todo.title = updated.title
    db_todo.completed = updated.completed
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        return False
    db.delete(db_todo)
    db.commit()
    return True
