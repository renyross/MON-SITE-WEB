import re

file_path = 'consultant-seo-bordeaux.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define markers (using the exact comments found in the file)
markers = {
    'Hero': '<!-- 1️⃣ Hero Section -->',
    'Contexte': '<!-- 2️⃣ Contexte SEO Bordeaux -->',
    'PAS': '<!-- 3️⃣ Problème / Solution (PAS) -->',
    'Freelance': '<!-- 4️⃣ Pourquoi moi : Freelance vs Agence -->',
    'Piliers': '<!-- 3️⃣ Approche / Piliers -->',
    'Diff': '<!-- 6️⃣ Différenciation -->',
    'Prestations': '<!-- 7️⃣ Prestations (Bloc 7) -->',
    'Profils': '<!-- 8️⃣ Profils accompagnés (Bloc 8) -->',
    'Methodo': '<!-- 9️⃣ Méthodologie (Bloc 9) -->',
    'Tarifs': '<!-- 10 Tarifs & Offres (Bloc 10) -->',
    'Outils': '<!-- 11 Stack d\'outils (Bloc 11) -->',
    'Expert': '<!-- 12 Expert de proximité (Bloc 12) -->',
    'FAQ': '<!-- 13 FAQ (Bloc 13) -->',
    'Temoignages': '<!-- 7️⃣ Témoignages (Mockup based on brief) -->',
    'Footer': '<!-- Footer -->'
}

# Helper to extract block content
def extract_block(full_text, start_marker, end_marker=None):
    start_idx = full_text.find(start_marker)
    if start_idx == -1:
        print(f"Warning: Marker '{start_marker}' not found")
        return ""
    
    if end_marker:
        end_idx = full_text.find(end_marker)
        if end_idx == -1:
             # Fallback if end marker not found (should not happen if logic is correct)
            return full_text[start_idx:]
        return full_text[start_idx:end_idx]
    else:
        # For the last block (Footer), read until end
        return full_text[start_idx:]

# Split content
# We need the header (everything before Hero)
header = content[:content.find(markers['Hero'])]

# Extract blocks
blocks = {}
# The order in the file is crucial to find the end of each block
# Original order: Hero, Contexte, PAS, Freelance, Piliers, Diff, Prestations, Profils, Methodo, Tarifs, Outils, Expert, FAQ, Temoignages, Footer

original_order = [
    'Hero', 'Contexte', 'PAS', 'Freelance', 'Piliers', 'Diff', 
    'Prestations', 'Profils', 'Methodo', 'Tarifs', 'Outils', 
    'Expert', 'FAQ', 'Temoignages', 'Footer'
]

for i, key in enumerate(original_order):
    start_marker = markers[key]
    if i < len(original_order) - 1:
        next_key = original_order[i+1]
        end_marker = markers[next_key]
        blocks[key] = extract_block(content, start_marker, end_marker)
    else:
        # Footer
        blocks[key] = extract_block(content, start_marker)

# Define New Order
# 1. Hero
# 2. PAS (Hook)
# 3. Contexte
# 4. Profils
# 5. Prestations
# 6. Piliers
# 7. Methodo
# 8. Outils
# 9. Freelance
# 10. Diff
# 11. Expert
# 12. Temoignages
# 13. Tarifs
# 14. FAQ
# 15. Footer

new_order = [
    'Hero',
    'PAS',
    'Contexte',
    'Profils',
    'Prestations',
    'Piliers',
    'Methodo',
    'Outils',
    'Freelance',
    'Diff',
    'Expert',
    'Temoignages',
    'Tarifs',
    'FAQ',
    'Footer'
]

# Update comments to reflect new numbering (Optional, but clean)
# We can do simple replacement on the block strings
def renumber_block(block_content, old_num_str, new_num_str, label):
    # Regex to replace <!-- X Label --> with <!-- Y Label -->
    # But simplicity: just replace the first line which is the marker
    lines = block_content.split('\n')
    if lines:
        lines[0] = f"  <!-- {new_num_str} {label} -->"
    return '\n'.join(lines)

# Reassemble
new_content = header
for i, key in enumerate(new_order[:-1]): # Exclude Footer from numbering logic for now
    block = blocks[key]
    # Keep numbering update simple or skip it to avoid breaking things?
    # Let's just append the block. The comments will be out of order (e.g. "3 PAS" appearing before "2 Contexte"), 
    # but the content will be correct. The user won't see the comments.
    new_content += block

new_content += blocks['Footer']

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Reorganization complete.")
