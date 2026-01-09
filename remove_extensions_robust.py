import os
import re

directory = "/Users/renelrosene/Desktop/SEO RENEL"

def process_content(content, filename):
    original_content = content
    
    # 1. Replace "index.html" specific cases first
    # Replace relative index.html with /
    content = re.sub(r'href="index\.html"', 'href="/"', content)
    content = re.sub(r"href='index\.html'", "href='/'", content)
    
    # Replace absolute index.html with /
    content = re.sub(r'href="https://www\.renelrosene\.com/index\.html"', 'href="https://www.renelrosene.com/"', content)
    
    # 2. General .html removal for internal links
    # Pattern: href="filename.html" -> href="filename"
    # We must exclude http/https starts to avoid external links, UNLESS it is renelrosene.com
    
    # Relative links: href="something.html" (not starting with http, mailto, tel, #, etc)
    # capturing group 1: the filename
    def replace_relative(match):
        url = match.group(1)
        if url == "index.html": return 'href="/"'
        return f'href="{url[:-5]}"' # remove .html

    # Look for href="[word].html"
    # We use a negative lookbehind to ensure it doesn't start with http, //, etc. if possible, 
    # but regex lookbehinds are fixed width. simpler to match valid relative paths.
    
    # Strategy: Find all href="..." and parse them.
    
    def replacer(match):
        full_match = match.group(0)
        quote = match.group(1)
        url = match.group(2)
        
        # Skip anchors, mailto, etc
        if url.startswith(('#', 'mailto:', 'tel:', 'javascript:')):
            return full_match
            
        # Check if external
        if '://' in url:
            if 'renelrosene.com' in url:
                # It is our site, clean it
                if url.endswith('index.html'):
                    return f'href={quote}{url[:-10]}{quote}' # remove index.html
                if url.endswith('.html'):
                    return f'href={quote}{url[:-5]}{quote}' # remove .html
            return full_match # External site, leave alone
            
        # Relative link
        if url == 'index.html':
            return f'href={quote}/{quote}'
        if url.endswith('.html'):
            return f'href={quote}{url[:-5]}{quote}'
            
        return full_match

    # Regex for href attributes
    # matches href="Val" or href='Val'
    content = re.sub(r'href=(["\'])(.*?)\1', replacer, content)
    
    # 3. Canonical and OG tags
    # <link rel="canonical" href="...">
    # <meta property="og:url" content="...">
    
    def meta_replacer(match):
        full_match = match.group(0)
        url = match.group(2)
        
        if 'renelrosene.com' in url and url.endswith('.html'):
            new_url = url[:-5]
            if new_url.endswith('/index'):
                new_url = new_url[:-5] # remove /index
            return full_match.replace(url, new_url)
        return full_match

    content = re.sub(r'(rel="canonical" href=|property="og:url" content=)(["\'])(.*?)\2', meta_replacer, content)
    
    # 4. Sitemap.xml specifically (loc tags)
    if filename == 'sitemap.xml':
        content = re.sub(r'<loc>(.*?)\.html</loc>', r'<loc>\1</loc>', content)
        content = re.sub(r'<loc>(.*?)/index</loc>', r'<loc>\1/</loc>', content)

    return content

for filename in os.listdir(directory):
    if filename.endswith(".html") or filename == "sitemap.xml":
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        new_content = process_content(content, filename)
        
        if new_content != content:
            print(f"Updating {filename}")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)

print("Finished removing .html extensions.")
