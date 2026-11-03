"""Storyboard options page (3+ drafts per scene) for Samrat's picks: one self-contained HTML + the key-frame PNG.

    python3 08_templates/engine/options_page.py <x###_options.js> <VAR> <out.html> --kick "SGMM · X004 · …" [--lede "…"]

<x###_options.js> defines window.<VAR> = {CAPS, scenes: [{id, label, act, lines, dur, options: [{name, draw(ctx,t), keys, note}]}]}.
Inlines the Manim style, the collage/voxel kit (x001_options.js), the engine, the Pop kit, then the options file.
Then renders <out>.png (a row per scene) with render.mjs --canvas. Same page as X001–X003's options sheets.
"""
import argparse, os, subprocess, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LIBS = ['08_templates/styles/manim/sgmm_manim.js', '04_video_projects/X001_shift_end_of_the_click/storyboard/x001_options.js',
        '08_templates/engine/sgmm_scenes.js', '08_templates/styles/pop/sgmm_pop.js']

ap = argparse.ArgumentParser()
ap.add_argument('opts'); ap.add_argument('var'); ap.add_argument('out')
ap.add_argument('--kick', required=True); ap.add_argument('--title', default='Scene Options')
ap.add_argument('--lede', default='Each scene has 3 drafts with the real captions, recoloured to SGMM. Silent; sound comes with the build. Reply like: hook A, THEN B, NOW A, NEXT C.')
ap.add_argument('--status', default='Waiting for your picks · no MP4 rendered')
a = ap.parse_args()

page = open(os.path.join(ROOT, '08_templates/engine/options_page.html')).read()
libs = '\n'.join(open(os.path.join(ROOT, f)).read() for f in LIBS) + '\n' + open(a.opts).read() + f'\nwindow.__OPT__ = window.{a.var};'
libs = libs.replace('</script', '<\\/script')
for k, v in (('__TITLE__', a.title), ('__KICK__', a.kick), ('__LEDE__', a.lede), ('__STATUS__', a.status)):
    page = page.replace(k, v)
page = page.replace('__LIBS__', libs)
open(a.out, 'w').write(page)
tmp = a.out + '.png.d'; os.makedirs(tmp, exist_ok=True)
subprocess.run(['node', os.path.join(ROOT, '08_templates/engine/render.mjs'), a.out, '--canvas', tmp], check=True)
shutil.move(os.path.join(tmp, 'options.png'), a.out[:-5] + '.png'); shutil.rmtree(tmp)
print(a.out, a.out[:-5] + '.png')
