const {chromium}=require('playwright');const fs=require('fs');
const OUT='/tmp/claude-0/-home-user-SG-MIND-MATRIX/9d454135-dd67-5327-bbbe-99a8ba935677/scratchpad/frames';
const from=+(process.argv[2]||0), to=+(process.argv[3]||1380);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:600,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
const html=fs.readFileSync('/home/user/SG_MIND_MATRIX/04_video_projects/EP000_matrix_online/storyboard/SGMM_EP000_storyboard_v003.html','utf8');
await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>');
await p.waitForFunction(()=>window.__ready===true,{timeout:60000});await p.waitForTimeout(800);
if(process.argv[4]==='audio'){const a=await p.evaluate(()=>window.__exp.audio());fs.writeFileSync(OUT+'/../score.wav',Buffer.from(a.b64,'base64'));console.log('audio peak',a.peak)}
for(let f=from;f<to;f++){const d=await p.evaluate(t=>window.__exp.frame(t),f/60);fs.writeFileSync(`${OUT}/f${String(f).padStart(5,'0')}.jpg`,Buffer.from(d.split(',')[1],'base64'));}
console.log('done',from,to,'errors',JSON.stringify(errs));await b.close();})();
