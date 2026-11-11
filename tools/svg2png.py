"""Convierte un SVG a PNG con Chrome (Playwright). Uso: python3 svg2png.py in.svg out.png tamaño"""
import sys, asyncio, pathlib
from playwright.async_api import async_playwright
src, out, size = sys.argv[1], sys.argv[2], int(sys.argv[3])
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': size, 'height': size})
        svg = pathlib.Path(src).read_text(encoding='utf-8')
        await pg.set_content(f'<html><body style="margin:0;background:transparent">{svg.replace("<svg ", f"<svg width=\"{size}\" height=\"{size}\" ",1)}</body></html>')
        await pg.screenshot(path=out, omit_background=True, clip={'x': 0, 'y': 0, 'width': size, 'height': size})
        await b.close()
asyncio.run(main())
