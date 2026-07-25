import uuid

from sqlalchemy import (
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class MonitoringRecord(Base):
    __tablename__ = "monitoring_records"

    record_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # Semua record selalu terkait akun user.
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Nullable karena growth bayi pascamelahirkan tidak wajib bergantung
    # pada profil kehamilan aktif.
    pregnancy_profile_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "pregnancy_profiles.profile_id",
            ondelete="CASCADE",
        ),
        nullable=True,
    )

    # FETAL_WEIGHT | HEAD_CIRC | MATERNAL | GROWTH
    # LEGACY hanya untuk record lama sebelum migration ini.
    record_type = Column(String(32), nullable=False)

    check_date = Column(Date, nullable=False)

    # Monitoring janin
    fetal_weight_grams = Column(Float, nullable=True)
    fetal_length_cm = Column(Float, nullable=True)  # legacy, tetap dipertahankan
    head_circumference_cm = Column(Float, nullable=True)

    # Monitoring ibu
    maternal_weight_kg = Column(Float, nullable=True)
    maternal_height_cm = Column(Float, nullable=True)

    # Monitoring pertumbuhan bayi
    growth_indicator = Column(String(32), nullable=True)
    measurement_value = Column(Float, nullable=True)
    age_months = Column(Integer, nullable=True)
    sex = Column(String(10), nullable=True)

    # Hasil evaluasi
    evaluation_status = Column(String(32), nullable=True)
    evaluation_message = Column(Text, nullable=True)
    z_score = Column(Float, nullable=True)
    reference_month_used = Column(Integer, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    __table_args__ = (
        Index(
            "ix_monitoring_records_user_type_date",
            "user_id",
            "record_type",
            "check_date",
        ),
    )