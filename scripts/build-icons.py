"""Export site icons from the existing logo without redrawing the brand mark.

Run with Python + Pillow. Keep the droplet crop separate from the wordmark so
the mark remains legible in browser tabs and Google's small circular display.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
source = Image.open(ROOT / 'assets/images/neutraph-logo.png').convert('RGBA')
# Original 1536 x 1024 logo: retain the droplet, omit the wordmark and waves.
droplet = source.crop((532, 65, 994, 684))
droplet.thumbnail((320, 384), Image.Resampling.LANCZOS)
master = Image.new('RGBA', (512, 512), 'white')
master.alpha_composite(droplet, ((512 - droplet.width) // 2, (512 - droplet.height) // 2))
master = master.convert('RGB')
master.resize((192, 192), Image.Resampling.LANCZOS).save(ROOT / 'favicon.png', optimize=True)
master.resize((180, 180), Image.Resampling.LANCZOS).save(ROOT / 'apple-touch-icon.png', optimize=True)
master.save(ROOT / 'favicon.ico', sizes=[(16,16), (32,32), (48,48), (64,64), (128,128), (256,256)])
