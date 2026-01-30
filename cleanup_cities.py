import os
import re

directory = "/Users/renelrosene/Desktop/SEO RENEL"
city_files = [f for f in os.listdir(directory) if f.startswith("consultant-seo-") and f.endswith(".html")]

def cleanup_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Detect city name from filename
    city_match = re.search(r'consultant-seo-(.*?)\.html', os.path.basename(filepath))
    if not city_match:
        return
    city_slug = city_match.group(1)
    city_name = city_slug.replace("-", " ").title()
    if city_slug == "ivry": city_name = "Ivry-sur-Seine"
    if city_slug == "boulogne-billancourt": city_name = "Boulogne-Billancourt"
    if city_slug == "clermont-ferrand": city_name = "Clermont-Ferrand"
    if city_slug == "le-mans": city_name = "Le Mans"

    # 2. Remove Trust Badges Bar
    # Matches the div containing Google/LinkedIn badges
    content = re.sub(r'<!-- Trust Badges Bar -->\s*<div.*?★★★★★.*?LinkedIn.*?</div>', '', content, flags=re.DOTALL)
    
    # 3. Remove Monochrome Logo Bar
    # Matches the div containing monochrome logos
    content = re.sub(r'<!-- Monochrome Logo Bar -->\s*<div.*?assets/logos/amundi\.png.*?</div>', '', content, flags=re.DOTALL)

    # 4. Remove Structural Duplication and Rogue Tags
    # Specific fix for the </div></div></section> mess and double CTAs
    # This pattern targets the corrupted transition between Section 5 and 6
    content = re.sub(r'RÉSERVER MON AUDIT ROI\s*À PARIS</a>\s*</div>\s*</div>\s*</section>\s*</div>\s*<div style="text-align: center; margin-top: 40px;">\s*<a href="https://calendly.com/rosenerenel/30min" class="hero-btn-primary" target="_blank">APPEL DÉCOUVERTE –.*?</a>\s*</div>\s*</div>\s*</section>',
                     f'RÉSERVER MON AUDIT ROI À {city_name.upper()}</a>\n      </div>\n    </div>\n  </section>', 
                     content, flags=re.DOTALL | re.IGNORECASE)

    # 5. Generic Localization Fix for "À PARIS" in Section 5 CTA (if not already fixed by duplication sub)
    content = re.sub(r'RÉSERVER MON AUDIT ROI\s*À PARIS', f'RÉSERVER MON AUDIT ROI À {city_name.upper()}', content, flags=re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed: {os.path.basename(filepath)} (City: {city_name})")

for filename in city_files:
    cleanup_file(os.path.join(directory, filename))
