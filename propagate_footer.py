import os
import re

# Source footer from index.html
source_file = 'index.html'
with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the footer block we want to copy
# It starts with <!-- Option 1 : Le "Status Bar" (Spécial Freelance) --> and ends with </footer>
# We also want to include the Newsletter popup which is usually after footer but let's stick to user request "mets le meme footer".
# The user request usually implies the visual footer.
# Let's check if the previous footer in other files is similar or if we need to replace a <footer>...</footer> block.

# Extract footer from index.html
footer_pattern = re.compile(r'(<footer class="status-footer">.*?</footer>)', re.DOTALL)
match = footer_pattern.search(content)

if not match:
    print("Could not find footer in index.html")
    exit(1)

new_footer = match.group(1)

# List of files to update (excluding index.html)
files_to_update = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html']

for file_name in files_to_update:
    try:
        with open(file_name, 'r', encoding='utf-8') as f:
            file_content = f.read()
        
        # Check if file has a footer
        if '<footer' in file_content:
            # Replace existing footer
            # We need a regex that captures any footer class/id
            new_file_content = re.sub(r'<footer.*?>.*?</footer>', new_footer, file_content, flags=re.DOTALL)
            
            if new_file_content != file_content:
                with open(file_name, 'w', encoding='utf-8') as f:
                    f.write(new_file_content)
                print(f"Updated footer in {file_name}")
            else:
                print(f"No changes made to {file_name} (regex might not have matched perfectly or content same)")
        else:
            print(f"No footer found in {file_name}")
            
    except Exception as e:
        print(f"Error processing {file_name}: {e}")

