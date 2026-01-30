import os
import re

# Configuration
MASTER_FILE = "/Users/renelrosene/Desktop/SEO RENEL/consultant-seo-paris.html"
PROJECT_DIR = "/Users/renelrosene/Desktop/SEO RENEL"

# Mapping: name, slug (masc), slug_f (fem), keywords, region
CITY_DATA = {
    "toulouse": {"name": "Toulouse", "slug": "toulousain", "slug_f": "Toulousaine", "keywords": "Aéronautique, Airbus, le Capitole", "region": "Occitanie"},
    "grenoble": {"name": "Grenoble", "slug": "grenoblois", "slug_f": "Grenobloise", "keywords": "Microélectronique, Innovation, massif de la Chartreuse", "region": "Isère"},
    "caen": {"name": "Caen", "slug": "caennais", "slug_f": "Caennaise", "keywords": "Histoire, Mémorial, Normandie", "region": "Calvados"},
    "angers": {"name": "Angers", "slug": "angevin", "slug_f": "Angevine", "keywords": "Pôle Végétal, Électronique, Maine-et-Loire", "region": "Pays de la Loire"},
    "strasbourg": {"name": "Strasbourg", "slug": "strasbourgeois", "slug_f": "Strasbourgeoise", "keywords": "Parlement Européen, Alsace, Institutions internationales", "region": "Bas-Rhin"},
    "rennes": {"name": "Rennes", "slug": "rennais", "slug_f": "Rennaise", "keywords": "Numérique, Cybersecurity, Bretagne", "region": "Ille-et-Vilaine"},
    "montpellier": {"name": "Montpellier", "slug": "montpelliérain", "slug_f": "Montpelliéraine", "keywords": "Santé, Tech, Méditerranée", "region": "Hérault"},
    "lyon-presqu-ile": {"name": "Lyon Presqu'île", "slug": "lyonnais", "slug_f": "Lyonnaise", "keywords": "Place Bellecour, Vieux Lyon, Gastronomie", "region": "Rhône"},
    "lyon": {"name": "Lyon", "slug": "lyonnais", "slug_f": "Lyonnaise", "keywords": "Place Bellecour, Vieux Lyon, Gastronomie", "region": "Rhône"},
    "le-mans": {"name": "Le Mans", "slug": "manceau", "slug_f": "Mancelle", "keywords": "Automobile, 24h du Mans, Sarthe", "region": "Pays de la Loire"},
    "tours": {"name": "Tours", "slug": "tourangeau", "slug_f": "Tourangelle", "keywords": "Châteaux de la Loire, Centre-Val de Loire, Gastronomie", "region": "Indre-et-Loire"},
    "dijon": {"name": "Dijon", "slug": "dijonnais", "slug_f": "Dijonnaise", "keywords": "Gastronomie, Vin, Bourgogne, Palais des Ducs", "region": "Côte-d'Or"},
    "reims": {"name": "Reims", "slug": "rémois", "slug_f": "Rémoise", "keywords": "Champagne, Cathédrale, Patrimoine mondial de l'UNESCO", "region": "Marne"},
    "clermont-ferrand": {"name": "Clermont-Ferrand", "slug": "clermontois", "slug_f": "Clermontoise", "keywords": "Michelin, Volcans d'Auvergne, Puy-de-Dôme", "region": "Auvergne-Rhône-Alpes"},
    "brest": {"name": "Brest", "slug": "brestois", "slug_f": "Brestoise", "keywords": "Naval, Océanographie, Finistère", "region": "Bretagne"},
    "amiens": {"name": "Amiens", "slug": "amienois", "slug_f": "Amiénoise", "keywords": "Cathédrale, Jules Verne, Somme", "region": "Hauts-de-France"},
    "limoges": {"name": "Limoges", "slug": "limougeaud", "slug_f": "Limougeaude", "keywords": "Porcelaine, Céramique, Haute-Vienne", "region": "Nouvelle-Aquitaine"},
    "metz": {"name": "Metz", "slug": "messin", "slug_f": "Messine", "keywords": "Logistique, Industrie, Moselle", "region": "Grand Est"},
    "orleans": {"name": "Orléans", "slug": "orléanais", "slug_f": "Orléanaise", "keywords": "Logistique, Histoire, Loiret", "region": "Centre-Val de Loire"},
    "boulogne-billancourt": {"name": "Boulogne-Billancourt", "slug": "boulonnais", "slug_f": "Boulonnaise", "keywords": "Média, Digital, Renault", "region": "Hauts-de-Seine"},
    "montreuil": {"name": "Montreuil", "slug": "montreuillois", "slug_f": "Montreuilloise", "keywords": "Cinéma, Design, Seine-Saint-Denis", "region": "Île-de-France"},
    "argenteuil": {"name": "Argenteuil", "slug": "argenteuillais", "slug_f": "Argenteuillaise", "keywords": "Industrie, Impressionnisme, Val-d'Oise", "region": "Île-de-France"},
    "saint-denis": {"name": "Saint-Denis", "slug": "dionysien", "slug_f": "Dionysienne", "keywords": "Stade de France, Tertiaire, Seine-Saint-Denis", "region": "Île-de-France"},
    "nanterre": {"name": "Nanterre", "slug": "nanterrien", "slug_f": "Nanterrienne", "keywords": "La Défense, Business, Hauts-de-Seine", "region": "Hauts-de-Seine"},
    "ivry": {"name": "Ivry", "slug": "ivryen", "slug_f": "Ivryenne", "keywords": "Recherche, Innovation, Val-de-Marne", "region": "Val-de-Marne"},
    "levallois": {"name": "Levallois", "slug": "levalloisien", "slug_f": "Levalloisienne", "keywords": "Sièges sociaux, Luxe, Media, Hauts-de-Seine", "region": "Hauts-de-Seine"},
    "lille": {"name": "Lille", "slug": "lillois", "slug_f": "Lilloise", "keywords": "EuraTechnologies, Vieux-Lille, HUB Euralille", "region": "Hauts-de-France"},
    "nantes": {"name": "Nantes", "slug": "nantais", "slug_f": "Nantaise", "keywords": "Machines de l'Île, Château des Ducs, Innovation numérique", "region": "Pays de la Loire"},
    "bordeaux": {"name": "Bordeaux", "slug": "bordelais", "slug_f": "Bordelaise", "keywords": "Place de la Bourse, Cité du Vin, Vin de Bordeaux", "region": "Nouvelle-Aquitaine"},
}

def propagate():
    with open(MASTER_FILE, "r") as f:
        master_content = f.read()
    
    # Capture complete premium block
    master_body_match = re.search(r'(<!-- \[SECTION 2 : CONTEXTE & OPPORTUNITÉ\].*?<!-- \[SECTION 11 : LOCAL\].*?</section>)', master_content, re.DOTALL)
    if not master_body_match: return
    master_body_raw = master_body_match.group(1)

    for city_id, info in CITY_DATA.items():
        file_path = os.path.join(PROJECT_DIR, f"consultant-seo-{city_id}.html")
        if not os.path.exists(file_path): continue

        with open(file_path, "r") as f:
            content = f.read()

        localized_body = master_body_raw
        
        # 1. Broad replacements for common markers
        localized_body = localized_body.replace("Parisienne", info["slug_f"])
        localized_body = localized_body.replace("parisien", info["slug"])
        localized_body = localized_body.replace("parisiens", info["slug"] + "s")
        localized_body = localized_body.replace("Paris", info["name"])
        localized_body = localized_body.replace("Île-de-France", info["region"])
        localized_body = localized_body.replace("Huitième, Seizième, Sentier, La Défense", info["keywords"])
        
        # 2. Nuclear Regex for the context paragraph (Targets the first <p> in Section 2)
        city_context_p = f"{info['name']} n'est pas seulement un pôle économique majeur de sa région ; c'est un bassin dynamique porté par {info['keywords']}. Dans ce marché où la compétition digitale s'intensifie, la visibilité organique est devenue une nécessité stratégique. Que vous soyez une PME locale ou un acteur industriel, vos futurs clients utilisent Google pour comparer les solutions avant de vous solliciter."
        
        localized_body = re.sub(
            r'(<!-- \[SECTION 2 : CONTEXTE & OPPORTUNITÉ\].*?<p[^>]*>).*?(</p>)',
            r'\1' + city_context_p + r'\2',
            localized_body,
            1,
            flags=re.DOTALL
        )

        # 3. CTA fixes
        localized_body = re.sub(r"AUDIT À\s+PARIS", f"AUDIT À {info['name'].upper()}", localized_body)
        localized_body = re.sub(r"RÉSERVER MON AUDIT À\s+PARIS", f"RÉSERVER MON AUDIT À {info['name'].upper()}", localized_body)

        # 4. Global Injection
        start_tokens = ["hero", "Hero Section", "1️⃣ Hero Section"]
        start_index = -1
        for token in start_tokens:
            token_match = list(re.finditer(re.escape(token), content, re.IGNORECASE))
            if token_match:
                section_end_match = re.search(r'</section>', content[token_match[0].end():], re.IGNORECASE)
                if section_end_match:
                    start_index = token_match[0].end() + section_end_match.end()
                    break
        
        end_tokens = ["Stack Outils", "outils", "FAQ", "Footer", "cta-final"]
        end_index = -1
        for token in end_tokens:
            token_match = list(re.finditer(re.escape(token), content, re.IGNORECASE))
            if token_match:
                comment_match = re.search(r'<!--', content[:token_match[0].start()][::-1])
                if comment_match:
                     end_index = token_match[0].start() - comment_match.end()
                else:
                     end_index = token_match[0].start()
                break

        if start_index != -1 and end_index != -1:
            new_content = content[:start_index] + "\n\n" + localized_body + "\n\n" + content[end_index:]
            with open(file_path, "w") as f:
                f.write(new_content)
            print(f"Updated {info['name']} with 100% localized context.")

if __name__ == "__main__":
    propagate()
