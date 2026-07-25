"""extend monitoring records for persistent monitoring

Revision ID: bf257bacb6fc
Revises: df8393adf00d
Create Date: 2026-07-24 21:54:43.728027

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'bf257bacb6fc'
down_revision: Union[str, Sequence[str], None] = 'df8393adf00d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "monitoring_records",
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            nullable=True,
        ),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("record_type", sa.String(length=32), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("maternal_weight_kg", sa.Float(), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("maternal_height_cm", sa.Float(), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("growth_indicator", sa.String(length=32), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("measurement_value", sa.Float(), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("age_months", sa.Integer(), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("sex", sa.String(length=10), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("evaluation_status", sa.String(length=32), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("evaluation_message", sa.Text(), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("z_score", sa.Float(), nullable=True),
    )
    op.add_column(
        "monitoring_records",
        sa.Column("reference_month_used", sa.Integer(), nullable=True),
    )

    # Backfill user_id dari pregnancy profile milik record lama.
    op.execute(
        """
        UPDATE monitoring_records AS mr
        SET user_id = pp.user_id
        FROM pregnancy_profiles AS pp
        WHERE mr.pregnancy_profile_id = pp.profile_id
        """
    )

    # Tandai jenis record lama berdasarkan isi kolom yang tersedia.
    op.execute(
        """
        UPDATE monitoring_records
        SET record_type = CASE
            WHEN fetal_weight_grams IS NOT NULL THEN 'FETAL_WEIGHT'
            WHEN head_circumference_cm IS NOT NULL THEN 'HEAD_CIRC'
            ELSE 'LEGACY'
        END
        """
    )

    op.alter_column(
        "monitoring_records",
        "user_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=False,
    )
    op.alter_column(
        "monitoring_records",
        "record_type",
        existing_type=sa.String(length=32),
        nullable=False,
    )

    # Growth bayi dapat disimpan tanpa profil kehamilan aktif.
    op.alter_column(
        "monitoring_records",
        "pregnancy_profile_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=True,
    )

    op.create_foreign_key(
        "fk_monitoring_records_user_id_users",
        "monitoring_records",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_index(
        "ix_monitoring_records_user_type_date",
        "monitoring_records",
        ["user_id", "record_type", "check_date"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_monitoring_records_user_type_date",
        table_name="monitoring_records",
    )

    op.drop_constraint(
        "fk_monitoring_records_user_id_users",
        "monitoring_records",
        type_="foreignkey",
    )

    # Record growth tanpa pregnancy profile tidak kompatibel dengan schema lama.
    op.execute(
        """
        DELETE FROM monitoring_records
        WHERE pregnancy_profile_id IS NULL
        """
    )

    op.alter_column(
        "monitoring_records",
        "pregnancy_profile_id",
        existing_type=postgresql.UUID(as_uuid=True),
        nullable=False,
    )

    op.drop_column("monitoring_records", "reference_month_used")
    op.drop_column("monitoring_records", "z_score")
    op.drop_column("monitoring_records", "evaluation_message")
    op.drop_column("monitoring_records", "evaluation_status")
    op.drop_column("monitoring_records", "sex")
    op.drop_column("monitoring_records", "age_months")
    op.drop_column("monitoring_records", "measurement_value")
    op.drop_column("monitoring_records", "growth_indicator")
    op.drop_column("monitoring_records", "maternal_height_cm")
    op.drop_column("monitoring_records", "maternal_weight_kg")
    op.drop_column("monitoring_records", "record_type")
    op.drop_column("monitoring_records", "user_id")
