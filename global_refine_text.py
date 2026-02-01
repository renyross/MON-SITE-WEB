import os
import re

def global_replace():
    directory = "/Users/renelrosene/Desktop/SEO RENEL"
    pattern1 = re.compile(r"Choisir Renel Rosené,", re.IGNORECASE)
    pattern2 = re.compile(r"Choisir Renel Rosene,", re.IGNORECASE)
    
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            path = os.path.join(directory, filename)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = pattern1.sub("Me choisir,", content)
            new_content = pattern2.sub("Me choisir,", new_content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
                count += 1
    
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    global_replace()
