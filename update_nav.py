
import os
import re

directory = "/Users/renelrosene/Desktop/SEO RENEL"
new_navbar = """  <nav class="navbar">
    <div class="container nav-container">
      <a class="logo" href="/">
        <img alt="Renel Rosené" class="logo-icon" height="35" src="assets/logos/logo.svg" width="50" />
        <div class="logo-text-group">
          <span class="logo-text">Renel Rosené</span>
        </div>
      </a>
      <ul class="nav-links">
        <li><a href="services-seo.html">Services</a></li>
        <li><a href="tarifs-consultant-seo-freelance.html">Prestation SEO</a></li>
        <li><a href="portfolio.html">Ressources</a></li>
        <li><a href="blog-seo-ia.html">Blog</a></li>
      </ul>
      <div class="menu-toggle" id="mobile-menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
      <div class="nav-cta">
        <a class="nav-btn-premium" href="contact.html">AUDIT SEO GRATUIT</a>
      </div>
    </div>
  </nav>"""

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace the navbar
        new_content = re.sub(r'<nav class="navbar">.*?</nav>', new_navbar, content, flags=re.DOTALL)
        
        if new_content != content:
            print(f"Updating {filename}")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
        else:
            print(f"No changes (or navbar not found) in {filename}")
