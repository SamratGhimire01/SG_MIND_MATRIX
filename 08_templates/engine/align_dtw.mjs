/* DTW between two feature files (float32, F per frame), cosine distance, symmetric steps; writes the path as JSON. Used by sgmm.py align_lines. */
import fs from 'node:fs';
const [A, B, nA, nB, F] = [process.argv[2], process.argv[3], +process.argv[4], +process.argv[5], +process.argv[6]];
const a = new Float32Array(fs.readFileSync(A).buffer.slice(0)), b = new Float32Array(fs.readFileSync(B).buffer.slice(0));
const d = (i, j) => { let s = 0, na = 0, nb = 0; for (let k = 0; k < F; k++) { const x = a[i * F + k], y = b[j * F + k]; s += x * y; na += x * x; nb += y * y; } return 1 - s / Math.sqrt(na * nb + 1e-9); };
const INF = 1e30, D = new Float64Array((nA + 1) * (nB + 1)).fill(INF), W = nB + 1; D[0] = 0;
for (let i = 1; i <= nA; i++) for (let j = 1; j <= nB; j++) { const c = d(i - 1, j - 1); D[i * W + j] = Math.min(D[(i - 1) * W + j - 1] + 2 * c, D[(i - 1) * W + j] + c, D[i * W + j - 1] + c); }
let i = nA, j = nB; const path = [];
while (i > 0 && j > 0) { path.push([i - 1, j - 1]); const m = Math.min(D[(i - 1) * W + j - 1], D[(i - 1) * W + j], D[i * W + j - 1]); if (m === D[(i - 1) * W + j - 1]) { i--; j--; } else if (m === D[(i - 1) * W + j]) i--; else j--; }
fs.writeFileSync(process.argv[7], JSON.stringify(path.reverse()));
