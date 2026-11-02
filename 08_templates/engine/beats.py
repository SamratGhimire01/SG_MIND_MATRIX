"""where a video goes dead: per 0.1 s, how much the picture changes and whether a sound effect hits.
   python3 08_templates/engine/beats.py <build prefix>   (uses <prefix>_clean_1080x1920_60fps.mp4 and <prefix>_sfx.wav)"""
import subprocess, sys
import numpy as np
sys.path.insert(0, __file__.rsplit('/', 1)[0]); import sgmm

def motion(mp4, fps=10, w=108, h=192):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf', f'fps={fps},scale={w}:{h},format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
    f = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)
    return np.r_[0, np.mean(np.abs(np.diff(f, axis=0)), axis=(1, 2))]          # mean pixel change per 0.1 s (0-255)

def hits(wav, hop=4800):
    x = sgmm.load(wav); e = 10 * np.log10(np.mean(x[:len(x) // hop * hop].reshape(-1, hop) ** 2, 1) + 1e-12)
    return np.r_[False, (np.diff(e) > 6) & (e[1:] > -45)]                         # a sound effect starts (+6 dB jump)

def dead(prefix, still=0.35, longest=2.0):
    m, s = motion(prefix + '_clean_1080x1920_60fps.mp4'), hits(prefix + '_sfx.wav'); n = min(len(m), len(s))
    live = (m[:n] > still) | s[:n]
    out, i = [], 0
    while i < n:
        if live[i]: i += 1; continue
        j = i
        while j < n and not live[j]: j += 1
        if (j - i) / 10 >= longest: out.append((i / 10, j / 10))
        i = j
    return out, m, s

if __name__ == '__main__':
    out, m, s = dead(sys.argv[1])
    print(f'beats: {int(s.sum())} sound hits, picture moving {100 * np.mean(m > .35):.0f}% of the time')
    for a, b in out: print(f'dead {a:5.1f}-{b:5.1f} s ({b - a:.1f} s): no motion, no sound hit')
