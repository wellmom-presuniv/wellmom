import asyncio
from logging.config import fileConfig

from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context

# ── Baca config & ambil Base dari project ────────────────────────────────
from app.config import settings
from app.database import Base

# ── Import SEMUA model di sini ───────────────────────────────────────────
# Kalau model tidak di-import, Alembic tidak tahu tabel apa yang harus
# dibuat saat --autogenerate dijalankan. Tambah baris baru setiap ada
# model baru yang dibuat.
from app.models import user, pregnancy, assessment, content, checklist, referral, monitoring, risk_threshold  # noqa: F401

# ── Setup logging (dari template default, biarkan) ────────────────────────
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ── Ini yang membuat --autogenerate bisa "melihat" tabel-tabelmu ─────────
target_metadata = Base.metadata


# ── Dua fungsi di bawah: jangan ubah strukturnya ─────────────────────────

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online():
    connectable = create_async_engine(settings.DATABASE_URL)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


# ── Entry point ───────────────────────────────────────────────────────────
if context.is_offline_mode():
    raise NotImplementedError("Offline mode tidak dikonfigurasi untuk proyek ini.")
else:
    asyncio.run(run_migrations_online())