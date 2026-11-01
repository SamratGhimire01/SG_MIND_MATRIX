const {chromium}=require('playwright');const fs=require('fs');const D=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+D+'/thumbs.html');await p.evaluate(()=>document.fonts.ready);
await p.evaluate(async()=>{await document.fonts.load('700 100px "Space Grotesk"');await document.fonts.load('700 30px "JetBrains Mono"')});
await p.evaluate(m=>{window.IMG=m},{'wide.jpg':'data:image/jpeg;base64,'+fs.readFileSync(D+'/wide.jpg').toString('base64'),'next.jpg':'data:image/jpeg;base64,'+fs.readFileSync(D+'/next.jpg').toString('base64')});for(const k of ['A','B','C','vertical']){const u=await p.evaluate(k=>window.draw(k),k);fs.writeFileSync(D+'/hi_'+k+'.png',Buffer.from(u.split(',')[1],'base64'))}await b.close()})();
