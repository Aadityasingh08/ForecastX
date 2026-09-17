import os
import subprocess
import sys
import time


def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    print("=" * 60)
    print("  FORECASTX: Conversational Weather Intelligence for India")
    print("  Starting Dual Local Development Environment...")
    print("=" * 60)

    # Path to virtualenv python
    venv_python = os.path.join(root_dir, "apps", "api", ".venv", "Scripts", "python.exe")
    if not os.path.exists(venv_python):
        venv_python = sys.executable

    api_dir = os.path.join(root_dir, "apps", "api")
    web_dir = os.path.join(root_dir, "apps", "web")

    print(f"[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [
        venv_python, "-m", "uvicorn", "app.main:app",
        "--host", "127.0.0.1", "--port", "8000", "--reload"
    ]
    backend_proc = subprocess.Popen(backend_cmd, cwd=api_dir)

    time.sleep(2)

    print(f"[2/2] Launching Vite Frontend on http://127.0.0.1:5173 ...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen([npm_cmd, "run", "dev"], cwd=web_dir)

    time.sleep(2)
    import webbrowser
    webbrowser.open("http://localhost:5173")

    print("\n" + "=" * 60)
    print("  ForecastX is now live!")
    print("  Frontend UI:  http://localhost:5173")
    print("  Backend API:  http://127.0.0.1:8000")
    print("  API Docs:     http://127.0.0.1:8000/docs")
    print("  Press Ctrl+C to terminate both servers.")
    print("=" * 60 + "\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down ForecastX services...")
        backend_proc.terminate()
        frontend_proc.terminate()


if __name__ == "__main__":
    main()
