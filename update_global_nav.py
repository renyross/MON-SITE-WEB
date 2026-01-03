
import os
import re

# Configuration
directory = "/Users/renelrosene/Desktop/SEO RENEL"
source_file = os.path.join(directory, "index.html")
nav_pattern = re.compile(r'<nav class="navbar">.*?</nav>', re.DOTALL)

def update_menus():
    # 1. Read the source menu from index.html
    try:
        with open(source_file, 'r', encoding='utf-8') as f:
            content = f.read()
            match = nav_pattern.search(content)
            if not match:
                print("Error: Could not find <nav class=\"navbar\">...</nav> in index.html")
                return
            new_nav = match.group(0)
            print("Extracted menu from index.html.")
    except Exception as e:
        print(f"Error reading index.html: {e}")
        return

    # 2. Iterate over all HTML files
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith(".html") and filename != "index.html":
            filepath = os.path.join(directory, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    file_content = f.read()
                
                # Check if file has a navbar
                if nav_pattern.search(file_content):
                    # Replace the navbar
                    new_content = nav_pattern.sub(new_nav, file_content)
                    
                    # Write changes only if different
                    if new_content != file_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {filename}")
                        count += 1
                    else:
                        print(f"Skipped (already up to date): {filename}")
                else:
                    print(f"Warning: No navbar found in {filename}")
                
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print(f"\nTotal files updated: {count}")

if __name__ == "__main__":
    update_menus()
