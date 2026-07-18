"""rework checklist logs to per item toggle

Revision ID: c0d3396fb44f
Revises: f0e18ee1fd4f
Create Date: 2026-06-29 17:04:40.013917

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'c0d3396fb44f'
down_revision: Union[str, Sequence[str], None] = '10b5a746f0fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Hapus semua data test yang ada — aman di development
    op.execute("DELETE FROM checklist_logs")

    # Hapus kolom lama
    op.drop_column('checklist_logs', 'date')
    op.drop_column('checklist_logs', 'consumed_iron_pill')
    op.drop_column('checklist_logs', 'consumed_folic_acid')
    op.drop_column('checklist_logs', 'water_intake_glasses')

    # Tambah kolom baru
    op.add_column('checklist_logs',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False))
    op.add_column('checklist_logs',
        sa.Column('item_id', postgresql.UUID(as_uuid=True), nullable=False))
    op.add_column('checklist_logs',
        sa.Column('log_date', sa.Date(), nullable=False))
    op.add_column('checklist_logs',
        sa.Column('is_completed', sa.Boolean(), nullable=False,
                  server_default=sa.text('true')))

    # Tambah FK constraints
    op.create_foreign_key(
        'fk_checklist_logs_user_id',
        'checklist_logs', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )
    op.create_foreign_key(
        'fk_checklist_logs_item_id',
        'checklist_logs', 'checklist_items',
        ['item_id'], ['item_id'],
        ondelete='CASCADE'
    )

    # Tambah unique constraint
    op.create_unique_constraint(
        'uq_checklist_user_item_date',
        'checklist_logs',
        ['user_id', 'item_id', 'log_date']
    )


def downgrade() -> None:
    op.drop_constraint('uq_checklist_user_item_date', 'checklist_logs', type_='unique')
    op.drop_constraint('fk_checklist_logs_item_id', 'checklist_logs', type_='foreignkey')
    op.drop_constraint('fk_checklist_logs_user_id', 'checklist_logs', type_='foreignkey')
    op.drop_column('checklist_logs', 'is_completed')
    op.drop_column('checklist_logs', 'log_date')
    op.drop_column('checklist_logs', 'item_id')
    op.drop_column('checklist_logs', 'user_id')
    op.add_column('checklist_logs',
        sa.Column('date', sa.Date(), nullable=True))
    op.add_column('checklist_logs',
        sa.Column('consumed_iron_pill', sa.Boolean(), nullable=True))
    op.add_column('checklist_logs',
        sa.Column('consumed_folic_acid', sa.Boolean(), nullable=True))
    op.add_column('checklist_logs',
        sa.Column('water_intake_glasses', sa.Integer(), nullable=True))
