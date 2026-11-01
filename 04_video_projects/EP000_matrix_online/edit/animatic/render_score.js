const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const html=fs.readFileSync('/home/user/SG_MIND_MATRIX/04_video_projects/EP000_matrix_online/storyboard/SGMM_EP000_storyboard_v007.html','utf8');
await p.setContent('<!doctype html><html><head><meta charset="utf-8"></head><body>'+html+'</body></html>');
await p.waitForFunction(()=>window.__ready===true,{timeout:60000});
const a=await p.evaluate(()=>window.__exp.audio());fs.writeFileSync(process.argv[2],Buffer.from(a.b64,'base64'));console.log('peak',a.peak,'errors',JSON.stringify(errs));await b.close()})();
