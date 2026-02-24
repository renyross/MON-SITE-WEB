import os
import re

# Configuration
STYLE_FILE = "/Users/renelrosene/Desktop/SEO RENEL/style.css"
BASE_DIR = "/Users/renelrosene/Desktop/SEO RENEL"

def update_style():
    with open(STYLE_FILE, 'r') as f:
        content = f.read()
    
    # Remplacements ciblés pour les polices
    content = content.replace("'Outfit', var(--font-display)", "var(--font-headings)")
    content = content.replace("'Outfit', sans-serif", "var(--font-headings)")
    content = content.replace("'Poppins', sans-serif", "var(--font-body)")
    # Gérer les cas sans guillemets si besoin
    content = content.replace("font-family: Outfit", "font-family: var(--font-headings)")
    content = content.replace("font-family: Poppins", "font-family: var(--font-body)")
    
    with open(STYLE_FILE, 'w') as f:
        f.write(content)
    print("Style updated.")

def update_html_files():
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                # Supprimer le lien vers Poppins/Outfit
                content = re.sub(r'<link\s+href="https://fonts\.googleapis\.com/css2\?family=Poppins:.*?&amp;family=Outfit:.*?&amp;display=swap"\s+rel="stylesheet"\s*/>', '', content)
                content = re.sub(r'<link\s+href="https://fonts\.googleapis\.com/css2\?family=Poppins:.*?&family=Outfit:.*?&display=swap"\s+rel="stylesheet"\s*/>', '', content)
                
                # Mettre à jour la version du style v=12 -> v=13
                content = content.replace("style.css?v=12", "style.css?v=13")
                
                with open(path, 'w') as f:
                    f.write(content)
                print(f"Updated {file}")

if __name__ == "__main__":
    update_style()
    update_html_files()
