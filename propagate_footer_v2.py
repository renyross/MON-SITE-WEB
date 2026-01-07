import os
import re

# Source footer from index.html
source_file = 'index.html'
with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract footer from index.html
# We want the comment <!-- Option 1 ... --> if present, or just the footer tag.
# In index.html step 544:
# 1183:   <!-- Option 1 : Le "Status Bar" (Spécial Freelance) -->
# 1184:   <footer class="status-footer">
# ...
# 1277:   </footer>

footer_block_match = re.search(r'(<!-- Option 1 : Le "Status Bar" \(Spécial Freelance\) -->\s*<footer class="status-footer">.*?</footer>)', content, re.DOTALL)
if not footer_block_match:
    # Try just footer tag
    footer_block_match = re.search(r'(<footer class="status-footer">.*?</footer>)', content, re.DOTALL)

if not footer_block_match:
    print("Could not find source footer in index.html")
    exit(1)

new_footer = footer_block_match.group(1)

files_to_update = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html']

for file_name in files_to_update:
    try:
        with open(file_name, 'r', encoding='utf-8') as f:
            file_content = f.read()
        
        # 1. Check if footer exists
        if '<footer' in file_content:
            # Replace existing footer
            # Capture from <footer... to </footer>
            updated_content = re.sub(r'<footer.*?</footer>', new_footer, file_content, flags=re.DOTALL)
            if updated_content != file_content:
                with open(file_name, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Replaced footer in {file_name}")
            else:
                print(f"Footer already up to date in {file_name}")
        else:
            # 2. Insert footer if missing
            # Look for insertion point.
            # Priority 1: Before <!-- Newsletter Popup -->
            # Priority 2: Before <div class="popup-overlay"
            # Priority 3: After last </section>
            # Priority 4: Before <script src="script.js"> or similar
            # Priority 5: Before </body>
            
            inserted = False
            
            if '<!-- Newsletter Popup -->' in file_content:
                parts = file_content.split('<!-- Newsletter Popup -->')
                updated_content = parts[0] + new_footer + '\n  <!-- Newsletter Popup -->' + parts[1]
                inserted = True
            elif '<div class="popup-overlay"' in file_content:
                # Insert before popup overlay
                target = '<div class="popup-overlay"'
                parts = file_content.split(target)
                updated_content = parts[0] + new_footer + '\n  ' + target + parts[1]
                inserted = True
            elif '</body>' in file_content:
                # Insert starting from end, before script tags if possible
                # Simple approach: before </body>
                parts = file_content.split('</body>')
                updated_content = parts[0] + new_footer + '\n</body>' + parts[1]
                inserted = True
            
            if inserted:
                with open(file_name, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Inserted footer in {file_name}")
            else:
                print(f"Could not find insertion point for {file_name}")

    except Exception as e:
        print(f"Error processing {file_name}: {e}")

