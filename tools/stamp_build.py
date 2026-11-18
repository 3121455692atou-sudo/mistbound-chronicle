#!/usr/bin/env python3
"""Stamp a published copy of dist/ with its build, so a browser can never mix old and new modules."""
import pathlib, re, sys
out, build = pathlib.Path(sys.argv[1]), sys.argv[2]
IMPORT = re.compile(r"""(from\s+|import\s+|import\()(['"])(\./[\w.-]+\.mjs)(?:\?v=[\w.-]+)?\2""")
for path in out.glob('*.mjs'):
    text = path.read_text(encoding='utf8')
    path.write_text(IMPORT.sub(lambda m: f"{m[1]}{m[2]}{m[3]}?v={build}{m[2]}", text), encoding='utf8')
style = out / 'style.css'
css = style.read_text(encoding='utf8')
style.write_text(re.sub(r'url\(assets/fonts/mist-display\.woff2(?:\?v=[\w.-]+)?\)', f'url(assets/fonts/mist-display.woff2?v={build})', css), encoding='utf8')
mp_css = out / 'multiplayer.css'
if mp_css.exists():
    mcss = mp_css.read_text(encoding='utf8')
    mp_css.write_text(re.sub(r'url\(multiplayer-font\.woff2(?:\?v=[\w.-]+)?\)', f'url(multiplayer-font.woff2?v={build})', mcss), encoding='utf8')
ASSET_RE = re.compile(r'((?:src|href)=")(app\.mjs|multiplayer-entry\.mjs|multiplayer\.mjs|style\.css|comic-ui\.css|saga\.css|campaign\.css|overhaul\.css|multiplayer\.css|battle\.css)(?:\?v=[\w.-]+)?"')
for html_name in ('index.html', 'multiplayer.html'):
    page = out / html_name
    if page.exists():
        html = page.read_text(encoding='utf8')
        page.write_text(ASSET_RE.sub(lambda m: f'{m[1]}{m[2]}?v={build}"', html), encoding='utf8')
(out / 'version.txt').write_text(build + '\n', encoding='utf8')
(out / '_headers').write_text('/\n  Cache-Control: no-store\n/index.html\n  Cache-Control: no-store\n/multiplayer.html\n  Cache-Control: no-store\n/version.txt\n  Cache-Control: no-store\n/assets/*\n  Cache-Control: public, max-age=86400\n', encoding='utf8')
