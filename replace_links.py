
import os
import re

directory = "/Users/renelrosene/Desktop/SEO RENEL"

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace href="offres.html" with href="tarifs-seo.html"
        new_content = content.replace('href="offres.html"', 'href="tarifs-seo.html"')
        
        if new_content != content:
            print(f"Updating {filename}")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
        else:
            print(f"No changes in {filename}")
