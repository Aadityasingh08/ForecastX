import sys
import os
from pathlib import Path

# Add current dir (for api/app bundled on Vercel) and apps/api
curr_dir = Path(__file__).resolve().parent
if str(curr_dir) not in sys.path:
    sys.path.insert(0, str(curr_dir))

root_dir = curr_dir.parent
api_dir = root_dir / "apps" / "api"
if str(api_dir) not in sys.path:
    sys.path.insert(0, str(api_dir))

from app.main import app

