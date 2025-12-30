#!/usr/bin/env python3
"""
Script pour uniformiser le footer sur toutes les pages HTML du site
"""

import os
import re
from pathlib import Path

# Footer de référence (depuis index.html)
REFERENCE_FOOTER = '''    <!-- Option 1 : Le "Status Bar" (Spécial Freelance) -->
    <footer class="status-footer">
        <div class="container footer-grid">
            <!-- Colonne 1 : Identité -->
            <div class="footer-col identite">
                <a href="index.html" class="logo">
                    <img src="assets/logos/logo.svg" alt="Renel Rosené" class="logo-icon" width="40" height="28">
                    <div class="logo-text-group">
                        <span class="logo-text">Renel Rosené</span>
                    </div>
                </a>
                <p class="footer-slogan">Consultant SEO & IA – Freelance pour B2B & E-commerce.</p>
                <div style="margin-top: 20px;">
                    <a href="zones-intervention.html"
                        style="color: #666; font-size: 0.8rem; text-decoration: none; opacity: 0.8; transition: opacity 0.3s;">Intervention
                        Partout en France</a>
                </div>
            </div>

            <!-- Colonne Expertises -->
            <div class="footer-col expertises">
                <span class="status-title">EXPERTISES :</span>
                <ul style="list-style:none; padding:0; margin-top:20px;">
                    <li style="margin-bottom:10px;"><a href="consultant-seo-local.html" class="contact-link">Consultant
                            SEO Local</a></li>
                    <li style="margin-bottom:10px;"><a href="consultant-seo-immobilier.html"
                            class="contact-link">Consultant SEO Immobilier</a></li>
                    <li style="margin-bottom:10px;"><a href="consultant-seo-ecommerce.html"
                            class="contact-link">Consultant SEO e-commerce</a></li>
                    <li style="margin-bottom:10px;"><a href="audit-seo-gratuit.html" class="contact-link">Audit SEO
                            Gratuit</a></li>
                    <li style="margin-bottom:10px;"><a href="consultant-seo-saas.html" class="contact-link">SEO SaaS
                            B2B</a></li>
                </ul>
            </div>
            <!-- Colonne 2 : Disponibilité -->
            <div class="footer-col status">
                <span class="status-title">STATUS ACTUEL :</span>
                <div class="status-indicator">
                    <span class="busy-dot"></span>
                    <span class="status-info" style="margin-left: 10px;">Prochain créneau disponible : Février
                        2026</span>
                </div>
            </div>

            <!-- Colonne 3 : Contact Rapide -->
            <div class="footer-col contact">
                <a href="mailto:contact@renelrosene.com" class="contact-link">contact@renelrosene.com</a>
                <div class="social-links">
                    <a href="https://www.linkedin.com/in/renel-rosene/?originalSubdomain=fr"
                        target="_blank">LinkedIn</a>
                    <a href="https://twitter.com/renelrosene" target="_blank">Twitter / X</a>
                    <a href="https://www.instagram.com/renelrosene/" target="_blank">Instagram</a>
                    <a href="https://www.youtube.com/@renelrosene" target="_blank">YouTube</a>
                </div>
            </div>


        </div>

        <div class="footer-bottom-full">
            <div class="container">
                <p style="margin-bottom: 10px;">Copyright © 2026. Tous droits réservés. Design by Renel.</p>
                <p>
                    <a href="mentions-legales.html" style="color: #666; font-size: 0.8rem;">Mentions Légales</a> |
                    <a href="plan-du-site.html" style="color: #666; font-size: 0.8rem;">Plan du Site</a>
                </p>
            </div>
        </div>
    </footer>'''

def replace_footer(file_path):
    """Remplace le footer dans un fichier HTML"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern pour trouver le footer (de <footer jusqu'à </footer>)
        pattern = r'<footer class="status-footer">.*?</footer>'
        
        # Vérifier si un footer existe
        if re.search(pattern, content, re.DOTALL):
            # Remplacer le footer
            new_content = re.sub(pattern, REFERENCE_FOOTER, content, flags=re.DOTALL)
            
            # Écrire le nouveau contenu
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return True
        else:
            print(f"⚠️  Pas de footer trouvé dans {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur avec {file_path}: {e}")
        return False

def main():
    """Fonction principale"""
    # Obtenir tous les fichiers HTML
    html_files = list(Path('.').glob('*.html'))
    
    print(f"🔍 {len(html_files)} fichiers HTML trouvés\n")
    
    updated_count = 0
    skipped_count = 0
    
    for html_file in html_files:
        file_name = html_file.name
        
        # Ignorer certains fichiers si nécessaire
        if file_name in ['404.html']:  # Ajouter d'autres fichiers à ignorer si besoin
            print(f"⏭️  Ignoré: {file_name}")
            skipped_count += 1
            continue
        
        if replace_footer(html_file):
            print(f"✅ Mis à jour: {file_name}")
            updated_count += 1
        else:
            skipped_count += 1
    
    print(f"\n📊 Résumé:")
    print(f"   ✅ {updated_count} fichiers mis à jour")
    print(f"   ⏭️  {skipped_count} fichiers ignorés/non modifiés")

if __name__ == "__main__":
    main()
