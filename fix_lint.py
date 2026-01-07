
import os
import re

filepath = "/Users/renelrosene/Desktop/SEO RENEL/tarifs-consultant-seo-freelance.html"

def fix_background_clip():
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to find -webkit-background-clip: text; without background-clip: text;
        # We look for places where -webkit-background-clip: text; exists but background-clip: text; doesn't follow closely
        
        def replacement(match):
            full_match = match.group(0)
            if 'background-clip: text;' in full_match:
                return full_match
            return full_match.replace('-webkit-background-clip: text;', '-webkit-background-clip: text; background-clip: text;')

        # Find all style attributes or style tags containing -webkit-background-clip: text;
        new_content = re.sub(r'-webkit-background-clip:\s*text;', '-webkit-background-clip: text; background-clip: text;', content)
        
        # Remove duplicates if some already had it
        new_content = new_content.replace('background-clip: text; background-clip: text;', 'background-clip: text;')

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
