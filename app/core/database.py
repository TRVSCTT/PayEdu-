
from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase , sessionmaker
from sqlalchemy import create_engine
from app.core.config import settings



engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)




naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(column_0_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}




class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=naming_convention)


def get_db() :
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()