import os
import re

directory = "/Users/renelrosene/Desktop/SEO RENEL"

def clean_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Clean newsletter-title inline styles
    content = re.sub(r'<h2 class="newsletter-title" style=".*?">', '<h2 class="newsletter-title">', content)
    
    # 2. Clean newsletter-byline inline styles
    content = re.sub(r'<div class="newsletter-byline" style=".*?">', '<div class="newsletter-byline">', content)
    
    # 3. Clean newsletter-subtitle inline styles
    content = re.sub(r'<p class="newsletter-subtitle" style=".*?">', '<p class="newsletter-subtitle">', content)

    # 4. Ensure popup-card has centered text-align in index.html and others
    # (The CSS already does this, but keeping HTML clean is better)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        clean_html(os.path.join(directory, filename))

print("Cleaned inline styles in newsletter popups.")
