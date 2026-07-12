import uuid

from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database import Base


class EducationContent(Base):
    __tablename__ = "education_contents"

    content_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = Column(String, nullable=False)
    body = Column(String, nullable=False)

    # Berlaku untuk trimester tertentu.
    # NULL = konten umum untuk semua trimester.
    trimester = Column(Integer, nullable=True)

    # Contoh:
    # nutrisi_trimester
    # tablet_tambah_darah
    # tanda_bahaya_kehamilan
    category = Column(String, nullable=True)

    # Urutan tampil dalam kategori
    order_in_category = Column(Integer, nullable=True)

    # Hanya konten published yang tampil di aplikasi mobile
    is_published = Column(Boolean, nullable=False, default=False)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )