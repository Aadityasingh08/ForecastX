import sys
import os
from pathlib import Path

# Add search paths for local and Vercel serverless environments
curr_dir = Path(__file__).resolve().parent
if str(curr_dir) not in sys.path:
    sys.path.insert(0, str(curr_dir))

root_dir = curr_dir.parent
api_dir = root_dir / "apps" / "api"
if str(api_dir) not in sys.path:
    sys.path.insert(0, str(api_dir))

import app.main

# Top-level assignment required by @vercel/python AST scanner
app = app.main.app
handler = app
