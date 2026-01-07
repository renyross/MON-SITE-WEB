import os
import glob
import json
from bs4 import BeautifulSoup

TARGET_DIR = "/Users/renelrosene/Desktop/SEO RENEL"

def validate_json_ld(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    scripts = soup.find_all('script', type='application/ld+json')
    
    for i, script in enumerate(scripts):
        json_text = script.string
        if json_text:
            try:
                json.loads(json_text)
            except json.JSONDecodeError as e:
                print(f"ERROR in {os.path.basename(filepath)} (script #{i+1}):")
                print(f"  {e}")
                # Print a snippet around the error
                lines = json_text.splitlines()
                if e.lineno <= len(lines):
                    print(f"  Line {e.lineno}: {lines[e.lineno-1].strip()}")
                return False
    return True

def main():
    print("Scanning for JSON-LD syntax errors...")
    files = glob.glob(os.path.join(TARGET_DIR, "*.html"))
    error_count = 0
    for file in files:
        if not validate_json_ld(file):
            error_count += 1
    
    if error_count == 0:
        print("No JSON-LD syntax errors found.")
    else:
        print(f"Found errors in {error_count} file(s).")

if __name__ == "__main__":
    main()
