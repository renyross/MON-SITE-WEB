import os
import re

def fix_malformed_links():
    count = 0
    files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file_path in files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for the specific malformed pattern <ahref= created by the previous script
        # This happened because `replace` on `attrs` which was from `match.group(1)` (attributes)
        # concatenated with `<a` + `attrs` without ensuring space if not present.
        # `<a` + `href=...` -> `<ahref=...`
        
        new_content = re.sub(r'<ahref=', '<a href=', content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {file_path}")
            count += 1
            
    print(f"Total files fixed: {count}")

if __name__ == "__main__":
    fix_malformed_links()
