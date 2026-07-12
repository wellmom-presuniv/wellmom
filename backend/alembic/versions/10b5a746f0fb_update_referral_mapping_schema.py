"""update referral mapping schema

Revision ID: 10b5a746f0fb
Revises: 6a45c81241a8
Create Date: 2026-06-28 22:09:26.395025

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "10b5a746f0fb"
down_revision: Union[str, Sequence[str], None] = "6a45c81241a8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "referral_mappings",
        sa.Column("facility_type", sa.String(length=100), nullable=True),
    )

    op.add_column(
        "referral_mappings",
        sa.Column("recommendation", sa.String(length=500), nullable=True),
    )

    op.add_column(
        "referral_mappings",
        sa.Column("urgency_label", sa.String(length=100), nullable=True),
    )

    op.add_column(
        "referral_mappings",
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )

    op.alter_column(
        "referral_mappings",
        "created_at",
        existing_type=postgresql.TIMESTAMP(timezone=True),
        nullable=False,
        existing_server_default=sa.text("now()"),
    )

    op.drop_column("referral_mappings", "recommendation_action")

    # Hapus default setelah semua row lama (jika ada) terisi TRUE
    op.alter_column(
        "referral_mappings",
        "is_active",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.add_column(
        "referral_mappings",
        sa.Column(
            "recommendation_action",
            sa.VARCHAR(),
            nullable=False,
        ),
    )

    op.alter_column(
        "referral_mappings",
        "created_at",
        existing_type=postgresql.TIMESTAMP(timezone=True),
        nullable=True,
        existing_server_default=sa.text("now()"),
    )

    op.drop_column("referral_mappings", "is_active")
    op.drop_column("referral_mappings", "urgency_label")
    op.drop_column("referral_mappings", "recommendation")
    op.drop_column("referral_mappings", "facility_type")