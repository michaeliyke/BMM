"""Error Handling goes here"""
import sqlalchemy.exc


def err_ctxt(error: Exception) -> str:
    """Get the context of a SQLAlchemyError error
    But return any other error as a string
    The following are currently considered here:

    sqlalchemy.exc.SQLAlchemyError
  |-- sqlalchemy.exc.InterfaceError
  |-- sqlalchemy.exc.StatementError
  |-- sqlalchemy.exc.DBAPIError
      |-- sqlalchemy.exc.DatabaseError
          |-- sqlalchemy.exc.IntegrityError
          |-- (other database specific errors)
    """

    print(error)

    if isinstance(error, sqlalchemy.exc.IntegrityError):
        return "ORM Integrity Error"

    if isinstance(error, sqlalchemy.exc.DatabaseError):
        return "ORM: Database Error"

    if isinstance(error, sqlalchemy.exc.DBAPIError):
        return "ORM DBAPI Error"

    if isinstance(error, sqlalchemy.exc.StatementError):
        return "ORM Statement Error   "

    if isinstance(error, sqlalchemy.exc.InterfaceError):
        return "ORM Interface Error"

    # Generic SQLAlchemy errors
    if isinstance(error, sqlalchemy.exc.SQLAlchemyError):
        return "ORM Error"

    # Non SQLAlchemy related errors
    return str(error)
