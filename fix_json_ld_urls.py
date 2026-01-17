import os
import re

directory = "/Users/renelrosene/Desktop/SEO RENEL"

def fix_json_ld_url(content):
    # Match "url": "https://www.renelrosene.com/somepage.html" inside script type="application/ld+json"
    def replacer(match):
        prefix = match.group(1)
        url = match.group(2)
        suffix = match.group(3)
        if url.endswith(".html"):
            return f'{prefix}{url[:-5]}{suffix}'
        return match.group(0)

    # Pattern: ("url"\s*:\s*") (https://www\.renelrosene\.com/.*?) (")
    pattern = r'("url"\s*:\s*")(https://www\.renelrosene\.com/.*?)(")'
    return re.sub(pattern, replacer, content)

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        new_content = fix_json_ld_url(content)
        
        if new_content != content:
            print(f"Updating JSON-LD URL in {filename}")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)

print("Finished updating JSON-LD URLs.")
