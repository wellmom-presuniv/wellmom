"""add symptom tracking and assessment result details

Revision ID: df8393adf00d
Revises: 670f6e576791
Create Date: 2026-07-15 10:43:42.430621

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'df8393adf00d'
down_revision: Union[str, Sequence[str], None] = '670f6e576791'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "assessment_results",
        sa.Column("duration_triggered_symptoms", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.add_column(
        "assessment_results",
        sa.Column("bp_category", sa.String(length=30), nullable=True),
    )

    op.create_table(
        "symptom_onset_tracking",
        sa.Column("tracking_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("pregnancy_profile_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("symptom_type", sa.String(length=50), nullable=False),
        sa.Column("onset_date", sa.Date(), nullable=False),
        sa.Column("last_reported_date", sa.Date(), nullable=False),
        sa.Column("resolved", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(
            ["pregnancy_profile_id"],
            ["pregnancy_profiles.profile_id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("tracking_id"),
    )

    op.create_index(
        "ix_symptom_onset_tracking_profile_symptom_resolved",
        "symptom_onset_tracking",
        ["pregnancy_profile_id", "symptom_type", "resolved"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_symptom_onset_tracking_profile_symptom_resolved",
        table_name="symptom_onset_tracking",
    )
    op.drop_table("symptom_onset_tracking")

    op.drop_column("assessment_results", "bp_category")
    op.drop_column("assessment_results", "duration_triggered_symptoms")
