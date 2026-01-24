import os
import re

CALENDLY_URL = "https://calendly.com/rosenerenel/30min"
# Match "Appel Découverte" with optional accents or case variations if needed, but strict based on user content is safer
# User request: "POUSSE TOUS LES BOUTONS APPEL DECOUVERTE"
TARGET_REGEX = re.compile(r"APPEL DÉCOUVERTE|APPEL DECOUVERTE", re.IGNORECASE)

def process_files():
    count = 0
    files = [f for f in os.listdir('.') if f.endswith('.html')]
    for file_path in files:
        changed = False
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We need to match <a ...> content </a>
        # We will use a regex that captures the open tag, content, and close tag
        # We can't rely on simple string replace because href might vary or be absent
        
        def replace_link(match):
            nonlocal changed
            full_match = match.group(0)
            attrs = match.group(1)
            inner_text = match.group(2)
            
            # Check if this is an "Appel Découverte" button
            if TARGET_REGEX.search(inner_text):
                # Check if it's linking to contact page to avoid overwriting existing external links if any
                # (Though user said ALL buttons, usually internal ones are the target)
                if 'href="contact"' in attrs or 'href="contact.html"' in attrs:
                    # Create new attributes by replacing href
                    new_attrs = attrs.replace('href="contact"', f'href="{CALENDLY_URL}"')
                    new_attrs = new_attrs.replace('href="contact.html"', f'href="{CALENDLY_URL}"')
                    
                    # Ensure target="_blank" is present for external link nice-to-have, but maybe keep simple
                    # Adding target="_blank" is good practice for Calendly
                    if 'target="_blank"' not in new_attrs:
                        new_attrs += ' target="_blank"'
                        
                    changed = True
                    return f'<a{new_attrs}>{inner_text}</a>'
            
            return full_match

        # Regex: <a (attributes)>(inner content)</a>
        # [^>]* matches attributes
        # (.*?) matches inner content non-greedy
        # re.DOTALL to match across lines
        new_content = re.sub(r'<a\s+([^>]*)>(.*?)</a>', replace_link, content, flags=re.DOTALL)
        
        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
            count += 1
            
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    process_files()
