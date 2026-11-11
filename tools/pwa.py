"""Genera manifest, íconos y service worker para que el sistema funcione sin internet e instalable.
Uso: python3 tools/pwa.py <raíz del repo> "<Nombre>" "<Nombre corto>" <logo.png|svg>
"""
import sys, os, json, hashlib, io, base64
root, name, short, logo = sys.argv[1:5]
here = os.path.dirname(os.path.abspath(__file__))
from PIL import Image
def icon(size):
    if logo.endswith('.svg'):
        import subprocess
        png = f'/tmp/_logo_{size}.png'
        subprocess.run(['python3', os.path.join(here, 'svg2png.py'), logo, png, str(size)], check=True)
        im = Image.open(png).convert('RGBA')
    else:
        im = Image.open(logo).convert('RGBA')
    bg = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    pad = int(size * 0.1); im.thumbnail((size - 2 * pad, size - 2 * pad))
    bg.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    bg.convert('RGB').save(os.path.join(root, f'icon-{size}.png'), optimize=True)
icon(192); icon(512)
man = {"name": name, "short_name": short, "description": "Sistema de gestión del taller (Sistema VB · Vincular Business)", "lang": "es-AR",
       "start_url": "./", "scope": "./", "display": "standalone", "background_color": "#ffffff", "theme_color": "#23262b",
       "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
                 {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]}
open(os.path.join(root, 'manifest.webmanifest'), 'w', encoding='utf-8').write(json.dumps(man, ensure_ascii=False, indent=1))
ver = hashlib.sha256(open(os.path.join(root, 'index.html'), 'rb').read()).hexdigest()[:12]
sw = open(os.path.join(here, 'sw.template.js'), encoding='utf-8').read().replace('__VERSION__', ver)
open(os.path.join(root, 'sw.js'), 'w', encoding='utf-8').write(sw)
print('pwa ok', ver)
