"""add maternal_lila_cm to monitoring_records

Revision ID: f7b2d4e81c35
Revises: e5a1c7d93b20
Create Date: 2026-10-03 00:05:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f7b2d4e81c35'
down_revision: Union[str, Sequence[str], None] = 'e5a1c7d93b20'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "monitoring_records",
        sa.Column("maternal_lila_cm", sa.Float(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("monitoring_records", "maternal_lila_cm")
