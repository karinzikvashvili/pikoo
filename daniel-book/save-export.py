"""Save a Canva export into art/. Canva sometimes adds an empty page to the design,
so every exported page is downloaded and the one with real content is kept.
Usage: python3 save-export.py <name.png> <url> [<url> ...]"""
import sys, urllib.request, io
from PIL import Image, ImageStat

name, urls = sys.argv[1], sys.argv[2:]
best = None
for u in urls:
    data = urllib.request.urlopen(u).read()
    im = Image.open(io.BytesIO(data)).convert('RGB')
    spread = sum(ImageStat.Stat(im).stddev)  # blank page ~ 0
    if best is None or spread > best[0]:
        best = (spread, data, im.size)
if best[0] < 5:
    sys.exit(f'{name}: every exported page is blank')
open(f'art/{name}', 'wb').write(best[1])
print(name, best[2], 'saved')
