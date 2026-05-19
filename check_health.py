import requests

BASE = "https://digitchat.fanruan.com"
for path in ["/health", "/status", "/info", "/version"]:
    url = f"{BASE}{path}"
    try:
        resp = requests.get(url, timeout=10)
        print(f"=== {path} ===")
        print(f"Status: {resp.status_code}")
        ct = resp.headers.get("Content-Type")
        print(f"Content-Type: {ct}")
        try:
            print(resp.json())
        except:
            print(resp.text[:500])
        print()
    except Exception as e:
        print(f"{path}: Error - {e}")
