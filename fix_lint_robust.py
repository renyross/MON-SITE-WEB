
import os
import re

filepath = "/Users/renelrosene/Desktop/SEO RENEL/tarifs-consultant-seo-freelance.html"

def fix_background_clip():
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Standardize -webkit-background-clip: text;
        pattern = re.compile(r'-webkit-background-clip:\s*text;')
        
        # Check if background-clip: text; already exists near it
        parts = pattern.split(content)
        new_content = parts[0]
        for part in parts[1:]:
            if not part.lstrip().startswith('background-clip: text;'):
                new_content += '-webkit-background-clip: text; background-clip: text;' + part
            else:
                new_content += '-webkit-background-clip: text;' + part

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Fixed background-clip issues.")
        else:
            print("No background-clip issues found to fix.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_background_clip()
