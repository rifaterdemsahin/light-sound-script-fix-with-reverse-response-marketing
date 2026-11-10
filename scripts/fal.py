"""Tiny fal.ai queue client. Key comes from the FAL_KEY env var only (never a file)."""
import json, os, sys, time, urllib.request, pathlib

def _req(url, data=None, method=None):
    key = os.environ.get("FAL_KEY")
    if not key:
        sys.exit("FAL_KEY not set")
    r = urllib.request.Request(url, method=method or ("POST" if data else "GET"),
        data=json.dumps(data).encode() if data is not None else None,
        headers={"Authorization": f"Key {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(r, timeout=120) as f:
            return json.load(f)
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} on {url}: {e.read().decode()[:400]}")

def run(model, args, timeout=600):
    job = _req(f"https://queue.fal.run/{model}", args)
    t0 = time.time()
    while True:
        st = _req(job["status_url"])
        if st["status"] == "COMPLETED":
            return _req(job["response_url"])
        if time.time() - t0 > timeout:
            sys.exit(f"timeout on {model}")
        time.sleep(2)

def download(url, path):
    path = pathlib.Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(url, path)
    return path
