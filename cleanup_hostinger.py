from ftplib import FTP

FTP_HOST = "147.93.93.243"
FTP_USER = "u302743555.renelrosene.com"
FTP_PASS = "@Reny509@Reny509"

def remove_dir_recursive(ftp, path):
    ftp.cwd(path)
    files = []
    ftp.retrlines('LIST', files.append)
    for line in files:
        parts = line.split()
        if len(parts) < 9: continue
        name = parts[-1]
        if name in ['.', '..']: continue
        if parts[0].startswith('d'):
            remove_dir_recursive(ftp, name)
        else:
            ftp.delete(name)
    ftp.cwd('..')
    ftp.rmd(path)

try:
    ftp = FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    
    # Supprimer default.php
    try:
        ftp.delete("default.php")
        print("Deleted default.php")
    except:
        print("Could not delete default.php (maybe already gone)")
        
    # Supprimer le dossier SEO RENEL redondant
    try:
        remove_dir_recursive(ftp, "SEO RENEL")
        print("Deleted redundant SEO RENEL folder")
    except Exception as e:
        print(f"Could not delete SEO RENEL folder: {e}")
        
    ftp.quit()
    print("Cleanup complete!")
except Exception as e:
    print(f"Error: {e}")
