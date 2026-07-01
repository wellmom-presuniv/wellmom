import uuid
from sqlalchemy import Column, Date, Boolean, String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.sql import func

from app.database import Base


class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    item_id     = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    label       = Column(String, nullable=False)
    category    = Column(String(50), nullable=True)
    is_active   = Column(Boolean, nullable=False, default=True)
    order_index = Column(Integer, nullable=False)


class ChecklistLog(Base):
    __tablename__ = "checklist_logs"

    log_id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id              = Column(UUID(as_uuid=True),
                               ForeignKey("users.id", ondelete="CASCADE"),
                               nullable=False)
    pregnancy_profile_id = Column(UUID(as_uuid=True),
                               ForeignKey("pregnancy_profiles.profile_id", ondelete="CASCADE"),
                               nullable=False)
    item_id              = Column(UUID(as_uuid=True),
                               ForeignKey("checklist_items.item_id", ondelete="CASCADE"),
                               nullable=False)
    log_date             = Column(Date, nullable=False)
    is_completed         = Column(Boolean, nullable=False, default=True)
    notes                = Column(String, nullable=True)
    created_at           = Column(TIMESTAMP(timezone=True), nullable=False,
                               server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "item_id", "log_date",
                         name="uq_checklist_user_item_date"),
    )