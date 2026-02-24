import os
import ftplib
from ftplib import FTP

# Configuration
FTP_HOST = "147.93.93.243"
FTP_USER = "u302743555.renelrosene.com"
# Le mot de passe sera demandé ou injecté au moment de l'exécution
FTP_PASS = "@Reny509@Reny509"
LOCAL_DIR = "/Users/renelrosene/Desktop/SEO RENEL"
REMOTE_DIR = "public_html"

def upload_files(ftp, local_path, remote_path):
    for item in os.listdir(local_path):
        # Exclure les fichiers inutiles pour le serveur
        if item in ['.git', '.github', '.DS_Store', 'CNAME']:
            continue
            
        l_path = os.path.join(local_path, item)
        r_path = f"{remote_path}/{item}"
        
        if os.path.isfile(l_path):
            print(f"Uploading {item}...")
            with open(l_path, 'rb') as f:
                ftp.storbinary(f'STOR {item}', f)
        elif os.path.isdir(l_path):
            print(f"Entering directory {item}...")
            try:
                ftp.mkd(item)
            except ftplib.error_perm:
                # Le dossier existe déjà
                pass
            ftp.cwd(item)
            upload_files(ftp, l_path, f"{remote_path}/{item}")
            ftp.cwd('..')

try:
    print(f"Connecting to {FTP_HOST}...")
    ftp = FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    
    # Lister pour voir où on est
    dirs = []
    ftp.retrlines('LIST', dirs.append)
    print("Files on server:", dirs)
    
    try:
        ftp.cwd(REMOTE_DIR)
        print(f"Entered {REMOTE_DIR}")
    except ftplib.error_perm:
        print(f"Could not enter {REMOTE_DIR}, checking if already there or if it exists...")
        # Si on ne peut pas entrer dans public_html, on reste là où on est
        pass
    
    print(f"Starting upload from {LOCAL_DIR}...")
    upload_files(ftp, LOCAL_DIR, REMOTE_DIR)
    
    ftp.quit()
    print("Deployment successful!")
except Exception as e:
    print(f"Error: {e}")
