"""add medical_history to assessment_responses

Revision ID: e5a1c7d93b20
Revises: bf257bacb6fc
Create Date: 2026-10-03 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'e5a1c7d93b20'
down_revision: Union[str, Sequence[str], None] = 'bf257bacb6fc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "assessment_responses",
        sa.Column("medical_history", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("assessment_responses", "medical_history")
