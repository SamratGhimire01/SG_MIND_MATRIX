/* SGMM scene library v001 — extracted from EP000 storyboard v008 (Samrat-approved look).
   Every scene type is a pure function of time. Each type keeps its EP000 choreography on its own
   canonical clock (`at` = where it started in EP000); a plan places it anywhere on the timeline.
   Text on screen comes from the plan (scene.text); defaults are EP000's words.
   Usage (browser): const ep = SGMM.load(plan); ep.render(ctx,W,H,t,caps); ep.frame(t); await ep.audio();
   Needs <path id="markpath" d="..."> from 01_brand/logo/svg/SGMM_mark_green.svg in the page. */
window.SGMM=(()=>{
const C={green:'#00E676',void:'#050807',white:'#F2F5F3',forest:'#0B3D2E',amber:'#FFB547',fog:'#7C8A84',
  paper:'#F0E9D9',card:'#F5F1E7',news:'#E9E1CB',ink:'#1A1816',skin:'#5B3E2E',skinHi:'#7A5541',skinLo:'#3A281E'};
/* EP000 canonical clock: scene choreography is written against these times */
const PRESS=1.15, BLACKOUT=43.4, O3=6.35;
/* text of the scene being drawn (set by render from scene.text); every read falls back to EP000's words */
// ponytail: one module-level slot, fine while scenes draw one at a time
let TX={};
const MARK=new Path2D(document.getElementById('markpath').getAttribute('d'));
const MONO='"JetBrains Mono", ui-monospace, monospace', TITLE='"Space Grotesk", system-ui, sans-serif';
const ANTON='"Anton", Impact, "Arial Narrow", sans-serif', SERIF='"Libre Baskerville", Georgia, serif', OSW='"Oswald", "Arial Narrow", sans-serif';


/* ================= helpers ================= */
const TAU=Math.PI*2;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const io=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const oc=t=>{t=clamp(t);return 1-Math.pow(1-t,3)};
const ic=t=>{t=clamp(t);return t*t*t};
const ss=t=>{t=clamp(t);return t*t*t*(t*(t*6-15)+10)};
const seg=(t,a,b)=>clamp((t-a)/(b-a));
const zlerp=(a,b,t)=>a*Math.pow(b/a,t);
const q12=t=>Math.floor(t*12+1e-6)/12;
const spring=x=>x<=0?0:1-Math.exp(-6.5*x)*Math.cos(11*x);
function rng(seed){let a=(seed>>>0)||1;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function makeNoise(seed){const r=rng(seed),p=[...Array(256).keys()];for(let i=255;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]]}
  const P=new Uint8Array(512);for(let i=0;i<512;i++)P[i]=p[i&255];const G=[...Array(256)].map(()=>{const a=r()*TAU;return[Math.cos(a),Math.sin(a)]});
  const f=t=>t*t*t*(t*(t*6-15)+10);
  const n2=(x,y)=>{const X=Math.floor(x),Y=Math.floor(y);x-=X;y-=Y;const d=(i,j)=>{const q=G[P[(P[(X+i)&255]+Y+j)&255]];return q[0]*(x-i)+q[1]*(y-j)};const u=f(x),v=f(y);return lerp(lerp(d(0,0),d(1,0),u),lerp(d(0,1),d(1,1),u),v)*1.4};
  const fbm=(x,y,o=4)=>{let s=0,a=.5,q=1,n=0;for(let i=0;i<o;i++){s+=a*n2(x*q,y*q);n+=a;a*=.5;q*=2}return s/n};return{n2,fbm}}
const NZ=makeNoise(4242);
const R0=rng(7);
const hasFilter=(()=>{try{return 'filter' in document.createElement('canvas').getContext('2d')}catch(e){return false}})();
const layer=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c};
function rr(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
const ell=(c,x,y,rx,ry,rot=0)=>{c.beginPath();c.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,0,TAU)};
const gs=(v,a=1)=>{const k=Math.round(clamp(v)*255);return `rgba(${k},${k},${k},${a})`};
function drawMark(ctx,cx,cy,size,col){ctx.save();ctx.translate(cx-size/2,cy-size/2);ctx.scale(size/984,size/984);ctx.translate(0,18);ctx.fillStyle=col;ctx.fill(MARK,'evenodd');ctx.restore()}

/* ================= collage kit (ideas from the Editorial Collage reference, re-cut for SGMM) ================= */
const K={};
const pathPoly=(c,p)=>{c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.closePath()};
function edgePoly(w,h,torn,seed,amp=5){const r=rng(seed);const cs=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([x,y])=>[x+(r()-.5)*4,y+(r()-.5)*4]);const out=[];
  for(let e=0;e<4;e++){const [ax,ay]=cs[e],[bx,by]=cs[(e+1)%4],len=Math.hypot(bx-ax,by-ay),dx=(bx-ax)/len,dy=(by-ay)/len;if(!torn[e]){out.push([ax,ay]);continue}
    const o=seed*.37+e*11.3;for(let d=0;d<len;d+=3){const fade=Math.min(1,d/10,(len-d)/10);const off=(NZ.fbm(o+d*.021,o*.5,4)*amp*1.7+(r()-.5)*amp*.3-amp*.25)*fade;out.push([ax+dx*d+dy*off,ay+dy*d-dx*off])}}return out}
function sprite(w,h,pad,paint){const cv=layer(w+pad*2,h+pad*2),c=cv.getContext('2d');c.translate(cv.width/2,cv.height/2);paint(c);return{cv,ox:cv.width/2,oy:cv.height/2,w,h}}
const drawSpr=(c,s)=>c.drawImage(s.cv,-s.ox,-s.oy);
function shadowFill(c,poly,col,sh=1){c.save();c.shadowColor=`rgba(40,28,15,${.4*sh})`;c.shadowBlur=15*sh;c.shadowOffsetX=4*sh;c.shadowOffsetY=8*sh;pathPoly(c,poly);c.fillStyle=col;c.fill();c.restore();
  c.save();c.shadowColor='rgba(40,28,15,.25)';c.shadowBlur=2;c.shadowOffsetY=1;pathPoly(c,poly);c.fillStyle=col;c.fill();c.restore()}
function fibre(){if(K.fib)return K.fib;const W=1400,Hh=1400,cv=layer(W,Hh),c=cv.getContext('2d'),r=rng(31);c.fillStyle='#fff';c.fillRect(0,0,W,Hh);
  const lo=layer(175,175),lc=lo.getContext('2d'),im=lc.createImageData(175,175);
  for(let y=0;y<175;y++)for(let x=0;x<175;x++){const v=NZ.fbm(x*.05,y*.05,4)*.6+NZ.n2(x*.3,y*.3)*.4,k=(y*175+x)*4,g=244+v*22;im.data[k]=g;im.data[k+1]=g-2;im.data[k+2]=g-6;im.data[k+3]=255}
  lc.putImageData(im,0,0);c.imageSmoothingQuality='high';c.drawImage(lo,0,0,W,Hh);c.lineCap='round';
  for(let i=0;i<2400;i++){const x=r()*W,y=r()*Hh,a=r()*TAU,l=4+r()*16,dark=r()<.55;c.strokeStyle=dark?`rgba(120,100,70,${.05+r()*.08})`:`rgba(255,255,255,${.2+r()*.3})`;c.lineWidth=.6+r()*.7;
    c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a+.4)*l*.5,y+Math.sin(a+.4)*l*.5,x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke()}
  for(let i=0;i<800;i++){c.fillStyle=`rgba(80,60,40,${.08+r()*.2})`;c.fillRect(r()*W,r()*Hh,.8+r()*1.4,.8+r()*1.2)}return(K.fib=cv)}
function texture(c,poly,alpha,ox=0,oy=0){c.save();pathPoly(c,poly);c.clip();c.globalCompositeOperation='multiply';c.globalAlpha=alpha;c.drawImage(fibre(),-700+ox,-700+oy);c.restore()}
function grainTiles(){if(K.gr)return K.gr;K.gr=[0,1,2,3].map(s=>{const cv=layer(256,256),c=cv.getContext('2d'),im=c.createImageData(256,256),r=rng(900+s);
  for(let i=0;i<im.data.length;i+=4){const v=128+(r()+r()+r()-1.5)*150;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}c.putImageData(im,0,0);return c.createPattern(cv,'repeat')});return K.gr}
/* halftone "archival print" treatment: grey painting -> blur, grain, contrast, rotated dot screen, warm ink on paper */
function treat(w,h,seed,paint,o={}){const cell=o.cell||4,mix=o.mix==null?.38:o.mix,con=o.con||1.25;
  const a=layer(w,h),ac=a.getContext('2d');paint(ac,w,h);
  const b=layer(w,h),bc=b.getContext('2d');bc.filter=`blur(${o.blur||1}px)`;bc.drawImage(a,0,0);bc.filter='none';
  const img=bc.getImageData(0,0,w,h),d=img.data,r=rng(seed),ink=o.ink||[30,27,25],pap=o.pap||[238,231,214],ca=Math.cos(.785),sa=Math.sin(.785);
  for(let py=0;py<h;py++)for(let px=0;px<w;px++){const k=(py*w+px)*4;if(d[k+3]<8)continue;const u=px/w-.5,v=py/h-.5;let L=d[k]/255;L*=1-(u*u+v*v)*(o.vig==null?1.1:o.vig);L+=(r()+r()+r()-1.5)*.11;L=clamp((L-.5)*con+.5+(o.lift||0));
    const D=1-L,rx=px*ca+py*sa,ry=-px*sa+py*ca,gx=(Math.floor(rx/cell)+.5)*cell,gy=(Math.floor(ry/cell)+.5)*cell,dot=clamp(cell*.74*Math.sqrt(D)-Math.hypot(rx-gx,ry-gy)+.6),cov=dot*(1-mix)+D*mix;
    d[k]=pap[0]+(ink[0]-pap[0])*cov;d[k+1]=pap[1]+(ink[1]-pap[1])*cov;d[k+2]=pap[2]+(ink[2]-pap[2])*cov}
  bc.putImageData(img,0,0);for(let i=0;i<w*h/2500;i++){bc.fillStyle=r()<.6?'rgba(245,240,228,.8)':'rgba(20,18,16,.5)';ell(bc,r()*w,r()*h,.5+r()*1.2,.5+r()*1);bc.fill()}return b}
function makePrint(img,seed,torn=[0,1,1,0],border=12,amp=7){const w=img.width+border*2,h=img.height+border*2;return sprite(w,h,34,c=>{const outer=edgePoly(w,h,torn,seed,amp);shadowFill(c,outer,'#F8F5EE');texture(c,outer,.35,seed*13%400,seed*7%200);
  const inner=edgePoly(w-7,h-7,torn,seed,amp);c.save();pathPoly(c,inner);c.clip();c.drawImage(img,-img.width/2,-img.height/2);c.restore()})}
/* a halftone cut-out along a silhouette (hand, person) with a white scissor-cut border */
function makeCut(img,shape,border=9){return sprite(img.width,img.height,40,c=>{c.translate(-img.width/2,-img.height/2);
  c.save();c.shadowColor='rgba(40,28,15,.42)';c.shadowBlur=16;c.shadowOffsetX=4;c.shadowOffsetY=9;shape(c);c.lineJoin='round';c.lineWidth=border*2;c.strokeStyle='#F8F5EE';c.stroke();c.fillStyle='#F8F5EE';c.fill();c.restore();
  c.save();shape(c);c.clip();c.drawImage(img,0,0);c.restore()})}
const wrap=(s,n)=>s.split(' ').reduce((L,w)=>{const l=L[L.length-1];if(l&&(l+' '+w).length<=n)L[L.length-1]=l+' '+w;else L.push(w);return L},[]);
const measure=(font,s)=>{const m=K.m||(K.m=layer(8,8).getContext('2d'));m.font=font;return m.measureText(s)};
function makeStrip(text,font,o={}){const m=measure(font,text),tw=m.width,asc=m.actualBoundingBoxAscent||40,desc=Math.max(1,m.actualBoundingBoxDescent||4),px=asc/.72,padX=o.padX==null?px*.2:o.padX,padY=o.padY==null?px*.15:o.padY,w=tw+padX*2,h=asc+desc+padY*2,base=-h/2+padY+asc;
  const s=sprite(w,h,30,c=>{const poly=edgePoly(w,h,o.torn||[0,0,0,0],o.seed||1,o.amp||4);shadowFill(c,poly,o.bg||C.card,o.sh||1);texture(c,poly,o.bg===C.ink?.12:.45,(o.seed||1)*31%600,0);c.fillStyle=o.fg||C.ink;c.font=font;c.fillText(text,-tw/2,base)});
  s.hl=[-tw/2-px*.07,base-asc*.9,tw+px*.14,asc];return s}
function greek(c,x,y,w,lines,lh,seed,font=`400 11px ${SERIF}`){const r=rng(seed);c.font=font;c.fillStyle='rgba(52,47,41,.85)';
  for(let l=0;l<lines;l++){let cx=x+(l===0?10:0);const end=l===lines-1?x+w*(.3+r()*.5):x+w;while(cx<end-12){let s='';const n=1+Math.floor(r()*8);for(let i=0;i<n;i++)s+='etaoinshrdlucmfwypvbg'[Math.floor(Math.pow(r(),1.6)*21)];const ww=c.measureText(s).width;if(cx+ww>end)break;c.fillText(s,cx,y+l*lh);cx+=ww+3.4}}}
function hilite(c,rect,prog,seed){if(!rect||prog<=0)return;const [x,y,w,h]=rect,L=w*clamp(prog),o=seed*1.7,tilt=(rng(seed)()-.5)*h*.12,top=[],bot=[];
  for(let d=0;d<=L;d+=6){top.push([x+d,y+NZ.n2(o+d*.02,1)*h*.07+tilt*d/w]);bot.push([x+d,y+h+NZ.n2(o+d*.02,5)*h*.08+tilt*d/w])}
  top.push([x+L+h*.08,y+tilt*L/w]);bot.push([x+L-h*.08,y+h+tilt*L/w]);
  c.save();c.globalCompositeOperation='multiply';c.beginPath();c.moveTo(x-h*.06,y+h*.05);top.forEach(p=>c.lineTo(p[0],p[1]));for(let i=bot.length-1;i>=0;i--)c.lineTo(bot[i][0],bot[i][1]);c.closePath();
  c.fillStyle='rgba(255,181,71,.82)';c.fill();c.clip();for(let k=0;k<4;k++){c.fillStyle=k%2?'rgba(230,150,40,.22)':'rgba(255,215,150,.3)';c.fillRect(x-10,y+h*(.12+k*.22)+NZ.n2(o+k,3)*3,L+20,h*(.05+(k%3)*.03))}
  c.fillStyle='rgba(225,140,30,.3)';ell(c,x+h*.08,y+h*.5,h*.18,h*.55);c.fill();if(prog>=1){ell(c,x+L-h*.05,y+h*.5,h*.14,h*.55);c.fill()}c.restore()}
function tape(c,x,y,w,h,rot,seed){const r=rng(seed);c.save();c.translate(x,y);c.rotate(rot);const p=[[-w/2,-h/2],[w/2,-h/2]],n=7;
  for(let i=1;i<n;i++)p.push([w/2+(i%2?3:-2)+(r()-.5)*3,-h/2+h*i/n]);p.push([w/2,h/2],[-w/2,h/2]);for(let i=n-1;i>0;i--)p.push([-w/2+(i%2?-3:2)+(r()-.5)*3,-h/2+h*i/n]);
  c.shadowColor='rgba(40,28,15,.22)';c.shadowBlur=3;c.shadowOffsetY=1.5;pathPoly(c,p);c.fillStyle='rgba(228,216,186,.82)';c.fill();c.shadowColor='transparent';c.clip();c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1;
  for(let i=0;i<5;i++){const yy=-h/2+r()*h;c.beginPath();c.moveTo(-w/2,yy);c.lineTo(w/2,yy+(r()-.5)*2);c.stroke()}c.restore()}
function partial(c,pts,prog){const n=pts.length-1,f=clamp(prog)*n,k=Math.floor(f);c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<=Math.min(k,n);i++)c.lineTo(pts[i][0],pts[i][1]);if(k<n){const a=pts[k],b=pts[k+1],u=f-k;c.lineTo(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u)}}
function marker(c,pts,prog,col=C.green,lw=8){if(prog<=0)return;c.save();c.lineCap='round';c.lineJoin='round';c.strokeStyle=col;c.globalAlpha=.92;c.lineWidth=lw;partial(c,pts,prog);c.stroke();c.globalAlpha=.35;c.lineWidth=lw*.4;c.translate(lw*.18,-lw*.15);partial(c,pts,prog);c.stroke();c.restore()}
function loopPts(cx,cy,rx,ry,seed){const pts=[],a0=-2.3;for(let i=0;i<=70;i++){const u=i/70,a=a0+u*TAU*1.12,k=1+NZ.n2(seed+u*3,2)*.06+u*.07;pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k])}return pts}
const POP={drop:{s:[1.16,1.05,.985,1],r:[.05,.015,-.006,0]},slideD:{dy:[-320,-120,-28,0],r:[-.03,-.01,.003,0]},slideU:{dy:[320,120,28,0],r:[.03,.01,-.003,0]},slideR:{dx:[300,110,26,0],r:[.04,.015,-.004,0]}};
function arrive(tq,a,kind='drop'){if(tq<a-1e-6)return null;const f=Math.min(3,Math.round((tq-a)*12)),P=POP[kind];return{s:P.s?P.s[f]:1,r:P.r[f],dx:P.dx?P.dx[f]:0,dy:P.dy?P.dy[f]:0}}

/* --- grey paintings for the halftone prints (stand-ins for Samrat's own photos) --- */
const SEL={row:0,x:520,w:46,h:150};
function shelfGray(c,w,h){let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,gs(.32));g.addColorStop(1,gs(.16));c.fillStyle=g;c.fillRect(0,0,w,h);const r=rng(55);
  for(let row=0;row<3;row++){const base=28+row*178+160;let x=20;
    while(x<w-30){const bw=24+r()*26,bh=110+r()*40,v=.25+r()*.6;if(row===SEL.row&&Math.abs(x-SEL.x)<30){x=SEL.x+SEL.w+3;continue}
      const gg=c.createLinearGradient(x,0,x+bw,0);gg.addColorStop(0,gs(v-.15));gg.addColorStop(.4,gs(v+.08));gg.addColorStop(1,gs(v-.2));c.fillStyle=gg;c.fillRect(x,base-bh,bw,bh);
      c.fillStyle=gs(v+.25,.8);c.fillRect(x+3,base-bh+18+r()*20,bw-6,8);if(r()<.5){c.fillRect(x+3,base-28,bw-6,5)}x+=bw+2+(r()<.1?14:0)}
    if(row===SEL.row){c.fillStyle=gs(.06);c.fillRect(SEL.x-1,base-SEL.h-2,SEL.w+2,SEL.h+2)}
    c.fillStyle=gs(.62);c.fillRect(0,base,w,16);c.fillStyle=gs(.8);c.fillRect(0,base,w,3);c.fillStyle=gs(.08,.6);c.fillRect(0,base+16,w,10)}
  g=c.createRadialGradient(w*.2,0,0,w*.3,h*.2,w*.8);g.addColorStop(0,'rgba(255,255,255,.3)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h)}
function readerGray(c,w,h,pose){let g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,gs(.5));g.addColorStop(1,gs(.78));c.fillStyle=g;c.fillRect(0,0,w,h);
  g=c.createRadialGradient(w*.95,h*.2,0,w*.9,h*.25,w*.7);g.addColorStop(0,'rgba(255,255,255,.45)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h);
  const cx=w*.48;c.fillStyle=gs(.14);rr(c,cx-120,h*.62,240,h*.5,40);c.fill();
  g=c.createLinearGradient(cx-170,0,cx+170,0);g.addColorStop(0,gs(.22));g.addColorStop(1,gs(.5));c.fillStyle=g;c.beginPath();c.moveTo(cx-175,h);c.bezierCurveTo(cx-185,h*.62,cx-120,h*.47,cx,h*.45);c.bezierCurveTo(cx+120,h*.47,cx+185,h*.62,cx+175,h);c.fill();
  if(pose===0){c.strokeStyle=gs(.42);c.lineWidth=58;c.lineCap='round';c.beginPath();c.moveTo(cx+140,h*.6);c.quadraticCurveTo(cx+200,h*.85,cx+250,h*.92);c.stroke()}
  const hx=pose?cx+30:cx,hy=pose?h*.33:h*.32,rot=pose?.32:0;c.save();c.translate(hx,hy);c.rotate(rot);
  c.fillStyle=gs(.55);c.fillRect(-28,30,56,70);ell(c,0,0,70,84);c.fillStyle=gs(.58);c.fill();ell(c,-68,8,12,20);c.fill();ell(c,68,8,12,20);c.fill();
  c.fillStyle=gs(.1);c.beginPath();c.ellipse(0,-10,74,80,0,Math.PI*.93,Math.PI*2.07);c.fill();ell(c,0,-6,72,66);c.fill();c.restore();
  if(pose===1){c.strokeStyle=gs(.45);c.lineWidth=56;c.lineCap='round';c.beginPath();c.moveTo(cx+150,h*.62);c.quadraticCurveTo(cx+190,h*.5,cx+118,h*.37);c.stroke();ell(c,cx+108,h*.36,30,34);c.fillStyle=gs(.6);c.fill()}}
function handGray(c,w,h){c.fillStyle=gs(.55);c.fillRect(0,0,w,h);handShape(c);c.save();c.clip();
  let g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,gs(.16));g.addColorStop(1,gs(.34));c.fillStyle=g;c.fillRect(0,0,w,330);c.fillStyle=gs(.3);c.fillRect(0,300,w,36);
  g=c.createLinearGradient(40,0,w-40,0);g.addColorStop(0,gs(.48));g.addColorStop(.5,gs(.72));g.addColorStop(1,gs(.52));c.fillStyle=g;c.fillRect(0,332,w,h);
  c.strokeStyle=gs(.35,.8);c.lineWidth=3;for(let i=0;i<4;i++){c.beginPath();c.moveTo(70+i*36,452);c.lineTo(70+i*36,470);c.stroke()}c.restore()}
function handShape(c){c.beginPath();c.moveTo(55,0);c.lineTo(205,0);c.lineTo(210,330);c.quadraticCurveTo(232,360,226,420);c.lineTo(222,505);c.quadraticCurveTo(205,525,188,505);c.lineTo(186,470);c.lineTo(178,515);c.quadraticCurveTo(160,532,144,512);
  c.lineTo(142,474);c.lineTo(134,520);c.quadraticCurveTo(116,536,100,516);c.lineTo(98,474);c.lineTo(90,508);c.quadraticCurveTo(72,522,58,502);c.lineTo(52,420);c.quadraticCurveTo(22,400,30,350);c.lineTo(50,330);c.closePath()}
function coverGray(c,w,h){let g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,gs(.36));g.addColorStop(1,gs(.18));c.fillStyle=g;c.fillRect(0,0,w,h);
  c.fillStyle=gs(.1);c.fillRect(0,0,26,h);c.strokeStyle=gs(.6,.7);c.lineWidth=3;c.strokeRect(46,40,w-80,h-80);c.fillStyle=gs(.85);c.fillRect(70,h*.28,w-128,96);
  c.fillStyle=gs(.15);c.font=`700 34px ${SERIF}`;c.textAlign='center';c.fillText('FIELD',w/2+12,h*.28+44);c.font=`italic 400 20px ${SERIF}`;c.fillText('notes & sources',w/2+12,h*.28+78);c.textAlign='left'}
function spineGray(c,w,h){const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,gs(.15));g.addColorStop(.45,gs(.42));g.addColorStop(1,gs(.12));c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle=gs(.8);c.fillRect(5,30,w-10,14);c.fillRect(5,h-36,w-10,6)}
function initCollage(){if(K.ready)return;K.ready=true;fibre();grainTiles();
  K.shelf=makePrint(treat(900,560,7,shelfGray,{cell:4.4,blur:1.1,con:1.3}),21,[0,1,1,0],15,9);
  K.reader=[0,1].map(p=>makeCut(treat(460,560,40+p,(c,w,h)=>readerGray(c,w,h,p),{cell:4,blur:1,con:1.25,vig:.6}),c=>{c.beginPath();c.moveTo(30,560);c.bezierCurveTo(20,330,90,250,150,236);c.lineTo(150,90);c.quadraticCurveTo(230,-6,320,90);c.lineTo(352,236);c.bezierCurveTo(440,270,460,360,456,560);c.closePath()}));
  K.hand=makeCut(treat(260,540,12,handGray,{cell:3.6,blur:.9,con:1.2,mix:.45,vig:.2}),handShape);
  K.spine=makePrint(treat(46,150,14,spineGray,{cell:3,blur:.6,vig:.1}),22,[0,0,0,0],4,3);
  K.cover=makePrint(treat(300,420,15,coverGray,{cell:3.4,blur:.7,con:1.3,vig:.3}),23,[0,0,0,0],6,3);
  K.page=[0,1].map(i=>sprite(300,420,20,c=>{const p=edgePoly(300,420,[0,0,0,0],60+i,2);shadowFill(c,p,C.news,.6);texture(c,p,.6,i*90,40);greek(c,-122,-160,244,24,14,70+i);c.fillStyle=C.ink;c.font=`700 15px ${SERIF}`;c.fillText(i?'II.':'I.',-122,-180)}));
  K.index=sprite(380,240,30,c=>{const p=edgePoly(380,240,[0,1,0,0],81,4);shadowFill(c,p,C.card);texture(c,p,.45,120,60);c.strokeStyle='rgba(184,72,58,.4)';c.lineWidth=1.5;c.beginPath();c.moveTo(-190,-70);c.lineTo(190,-70);c.stroke();
    c.strokeStyle='rgba(70,90,110,.18)';c.lineWidth=1;for(let y=-40;y<=100;y+=22){c.beginPath();c.moveTo(-190,y);c.lineTo(190,y);c.stroke()}c.fillStyle=C.ink;c.font=`700 22px ${OSW}`;c.fillText('CARD CATALOGUE',-170,-84);greek(c,-170,-46,340,6,22,83,`400 14px ${SERIF}`);ell(c,0,96,9,9);c.fillStyle='#d8cfb8';c.fill()});
}
/* collage: drawn in a 1080x1920 frame, fitted into any rect (screen or full frame) */
function collage(ctx,R,tc){
  initCollage();
  const strip=(txt,font,o)=>K['strip'+o.seed+txt]||(K['strip'+o.seed+txt]=makeStrip(txt,font,o));
  K.kTHEN=strip(TX.then_label||'THEN','400 120px '+ANTON,{bg:C.ink,fg:C.paper,seed:3});
  K.kLib=strip(TX.then_kicker||'THE LIBRARY',`700 34px ${OSW}`,{seed:5,padX:12,padY:7});
  K.sSEARCH=strip(TX.then_word1||'SEARCHED','400 132px '+ANTON,{seed:6});
  K.sWAIT=strip(TX.then_word2||'WAITED','400 120px '+ANTON,{seed:8,bg:C.news});
  const sc=R.h/1920, extra=(R.w/sc-1080)/2, tq=q12(tc);
  ctx.save();ctx.beginPath();ctx.rect(R.x,R.y,R.w,R.h);ctx.clip();ctx.translate(R.x,R.y);ctx.scale(sc,sc);ctx.translate(extra,0);
  const cam={x:-10+tc*6,y:-tc*5,z:1+.12*oc(clamp(tc/6.6))};
  const place=(p,x,y,rot,s,fn)=>{ctx.save();ctx.translate(540,960);const k=Math.pow(cam.z,p);ctx.scale(k,k);ctx.translate(-cam.x*p-540,-cam.y*p-960);ctx.translate(x,y);if(rot)ctx.rotate(rot);if(s!==1)ctx.scale(s,s);fn(ctx);ctx.restore()};
  const block=(p,x,y,w,h,rot,col,seed,torn,amp=7)=>place(p,x,y,rot,1,c=>{const poly=edgePoly(w,h,torn,seed,amp);c.save();c.shadowColor='rgba(40,28,15,.25)';c.shadowBlur=10;c.shadowOffsetY=4;pathPoly(c,poly);c.fillStyle=col;c.fill();c.restore();texture(c,poly,.55,seed*40%300,0)});
  ctx.fillStyle=C.paper;ctx.fillRect(-extra-20,-20,1080+extra*2+40,1960);
  place(.2,540,960,0,1,c=>{c.globalCompositeOperation='multiply';c.drawImage(fibre(),-700-extra,-1000,1400+extra*2,1400);c.drawImage(fibre(),-700-extra,400,1400+extra*2,1400)});
  block(.45,540,250,1500,560,0,C.amber,12,[0,0,1,0],9);
  place(.55,880,600,.08,.9,c=>{drawSpr(c,K.index);tape(c,0,-122,96,28,-.1,41)});
  block(.7,540,1720,1500,520,-.01,C.forest,14,[1,0,0,0],8);
  place(1,540,880,0,1,c=>{drawSpr(c,K.shelf);tape(c,-420,-290,120,34,-.5,1);tape(c,420,-292,116,32,.45,2)});
  /* the selected book: in its slot, then tilted, pulled, turned, set down, opened */
  const slot={x:540-465+15+SEL.x+SEL.w/2,y:880-295+15+28+160-SEL.h/2};
  const grip=tq>=.95, pullP=io(seg(tq,1.45,2.05)), turnP=seg(tq,2.1,2.5), downP=io(seg(tq,2.5,2.9)), openP=seg(tq,3.0,3.35);
  const tilt=-.22*io(seg(tq,1.1,1.45))*(1-pullP);
  let bx=slot.x,by=slot.y+(grip?6:0),bs=1;
  if(tq>=1.45){bx=lerp(slot.x,540,pullP);by=lerp(slot.y+6,1120,pullP);bs=lerp(1,2.8,pullP)}
  if(tq>=2.5){bx=540;by=lerp(1120,1670,downP)}
  const handY=tq<.25?-500:(()=>{const A=arrive(tq,.25,'slideD');return A?A.dy:0})();
  place(1,0,0,0,1,c=>{
    if(tq<2.1){c.save();c.translate(bx,by+SEL.h/2*bs);c.rotate(tilt);c.scale(bs,bs);c.translate(0,-SEL.h/2);drawSpr(c,K.spine);c.restore()}
    else if(tq<3.0){const cs=tq<2.5?1:lerp(1,.9,downP);c.save();c.translate(bx,by);
      if(turnP<.5){c.scale(2.8*(1-ss(turnP*2))+.001,2.8*cs);drawSpr(c,K.spine)}else{c.scale(cs*ss((turnP-.5)*2)+.001,cs);drawSpr(c,K.cover)}c.restore()}
    else{c.save();c.translate(lerp(405,590,ss(openP)),1670);c.scale(.9,.9);
      c.save();c.translate(150,0);drawSpr(c,K.page[1]);c.restore();
      const flips=[3.6,4.0,4.4];
      if(openP<1){const k=Math.cos(openP*Math.PI);c.save();c.translate(0,0);c.scale(k,1);c.translate(150,0);drawSpr(c,k>0?K.cover:K.page[0]);c.restore()}
      else{c.save();c.translate(-150,0);drawSpr(c,K.page[0]);c.restore()}
      for(const f of flips){const p=seg(tq,f,f+.33);if(p>0&&p<1){const k=Math.cos(p*Math.PI);c.save();c.scale(k,1);c.translate(150,0);drawSpr(c,k>0?K.page[1]:K.page[0]);c.restore()}}
      c.restore()}
  });
  /* the hand: comes down over the shelf, hooks the book, pulls it out, lets go */
  if(tq>=.25&&tq<2.6){let hx=slot.x-8,hy=slot.y-SEL.h/2-232+handY+(grip?14:0);
    if(tq>=1.1&&tq<2.05){hx=bx-8+Math.sin(tilt)*SEL.h*bs*.5;hy=by-SEL.h*bs/2-218}
    if(tq>=2.05){const u=io(seg(tq,2.05,2.5));hx=lerp(540-8,700,u);hy=lerp(1120-SEL.h*2.8/2-218,-700,u)}
    place(1,hx,hy,-.04,1,c=>{c.translate(0,0);drawSpr(c,K.hand)})}
  /* the reader at the library table (pose swaps to "waiting" on 4.4, an image sequence on steps) */
  place(1.25,170,1640,0,1.05,c=>drawSpr(c,K.reader[tq>=4.4?1:0]));
  /* lamp */
  place(1.2,930,1540,0,1,c=>{c.fillStyle=C.ink;c.fillRect(-6,-10,12,120);ell(c,0,112,60,14);c.fill();const p=edgePoly(190,90,[0,0,1,0],91,5).map(([x,y])=>[x*(1-(y+45)/180*.5),y-40]);shadowFill(c,p,C.amber,.8);texture(c,p,.5,30,30)});
  /* headline strips */
  place(1.3,250,150,-.03,1,c=>drawSpr(c,K.kTHEN));
  place(1.3,330,252,.02,1,c=>drawSpr(c,K.kLib));
  {const A=arrive(tq,3.0,'drop');if(A)place(1.35,470,1280,-.025+A.r,A.s,c=>{drawSpr(c,K.sSEARCH);hilite(c,K.sSEARCH.hl,seg(tc,3.15,3.6),5)})}
  /* the clock + WAITED + the one green marker ring */
  {const A=arrive(tq,4.4,'drop');if(A)place(1.3,850,330,A.r,A.s,c=>{const p=edgePoly(260,260,[0,0,0,0],97,3);c.save();c.beginPath();c.arc(0,0,124,0,TAU);c.shadowColor='rgba(40,28,15,.4)';c.shadowBlur=14;c.shadowOffsetY=8;c.fillStyle=C.card;c.fill();c.restore();
      c.strokeStyle=C.ink;c.lineWidth=5;c.beginPath();c.arc(0,0,108,0,TAU);c.stroke();for(let i=0;i<12;i++){const a=i/12*TAU;c.lineWidth=i%3?3:6;c.beginPath();c.moveTo(Math.cos(a)*86,Math.sin(a)*86);c.lineTo(Math.cos(a)*100,Math.sin(a)*100);c.stroke()}
      const ma=-Math.PI/2+Math.max(0,q12(tc)-4.4)*4.2,ha=-Math.PI/2+1.2+Math.max(0,q12(tc)-4.4)*.35;c.lineCap='round';c.lineWidth=7;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(ma)*84,Math.sin(ma)*84);c.stroke();c.lineWidth=10;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(ha)*54,Math.sin(ha)*54);c.stroke();ell(c,0,0,9,9);c.fillStyle=C.ink;c.fill();
      marker(c,loopPts(0,0,160,152,4.4),seg(tc,4.95,5.7),C.green,9)})}
  {const A=arrive(tq,4.6,'drop');if(A)place(1.35,720,560,.03+A.r,A.s,c=>drawSpr(c,K.sWAIT))}
  /* finishing: 12 fps grain + warm vignette, every frame */
  const pats=grainTiles(),f=Math.floor(tc*12),r=rng(5000+f);
  ctx.save();ctx.globalCompositeOperation='overlay';ctx.globalAlpha=.24;ctx.fillStyle=pats[f%4];ctx.translate(-extra-r()*256,-r()*256);ctx.fillRect(0,0,1080+extra*2+512,1920+256);ctx.restore();
  ctx.save();ctx.globalCompositeOperation='multiply';const g=ctx.createRadialGradient(540,960,420,540,960,1250);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(232,218,196,1)');ctx.fillStyle=g;ctx.fillRect(-extra,0,1080+extra*2,1920);ctx.restore();
  ctx.restore();
}

/* ================= NEXT: field + volumetric forms ================= */
const SEEDS=Array.from({length:240},()=>({u:R0(),v:R0(),c:Math.floor(R0()*5),w:.6+R0()*1.2}));
const FLOWPAL=['#0B3D2E','#116B4A','#1FA86B','#00E676','#7DF2B5'];
function flow(ctx,R,t,conv=0,extra=0,thin=0){
  ctx.save();ctx.beginPath();ctx.rect(R.x,R.y,R.w,R.h);ctx.clip();ctx.fillStyle=C.void;ctx.fillRect(R.x,R.y,R.w,R.h);ctx.globalCompositeOperation='lighter';
  const N=120+Math.round(120*extra),steps=44,sl=R.w/55,u=R.h/325;
  const field=(nx,ny)=>{let a=Math.sin(nx*3.1+t*.35)*1.1+Math.cos(ny*2.7-t*.28)*.9+Math.sin((nx+ny)*5.3+t*.45)*.4;const dx=nx-.5,dy=(ny-.55)*(R.h/R.w),w=Math.exp(-(dx*dx+dy*dy)/.03);a=a*(1-w)+(Math.atan2(dy,dx)+Math.PI/2)*w;const ta=Math.atan2((.52-ny)*2.5,1);return a*(1-conv*.75)+ta*conv*.75};
  for(let i=0;i<N;i++){const sd=SEEDS[i],ph=(sd.u+t*.012)%1;let x=R.x+ph*R.w*1.1-R.w*.05,y=R.y+sd.v*R.h;ctx.beginPath();ctx.moveTo(x,y);for(let k=0;k<steps;k++){const a=field((x-R.x)/R.w,(y-R.y)/R.h);x+=Math.cos(a)*sl;y+=Math.sin(a)*sl;ctx.lineTo(x,y)}
    ctx.strokeStyle=FLOWPAL[sd.c];ctx.globalAlpha=(.34+conv*.3)*Math.pow(Math.sin(Math.PI*ph),.6)*(i>=120?extra:1);ctx.lineWidth=sd.w*(1+conv*1.2)*u*lerp(1,.3,thin);ctx.stroke()}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.95;let x=R.x+R.w*.02,y=R.y+R.h*.62;ctx.beginPath();ctx.moveTo(x,y);for(let k=0;k<70;k++){const a=field((x-R.x)/R.w,(y-R.y)/R.h);x+=Math.cos(a)*sl;y+=Math.sin(a)*sl;ctx.lineTo(x,y)}
  ctx.strokeStyle=C.white;ctx.lineWidth=1.6*u*lerp(1,.4,thin);ctx.stroke();ctx.restore()}
const R3=rng(42);
const FORMS=Array.from({length:24},()=>({x:(R3()*2-1)*5.5,y:(R3()*2-1)*8.5,z:6+R3()*34,r:.35+R3()*.9,type:R3()<.3?'ring':'sphere',tone:R3()<.25?'white':'forest',tilt:R3()*3,spin:(R3()-.5)*.6}));
FORMS.push({x:.15,y:.3,z:16,r:1.15,type:'sphere',tone:'green',tilt:0,spin:0});
const TONES={forest:['#3F8F6E','#0B3D2E','#010302'],white:['#F2F5F3','#AEB8B3','#1E2624'],green:['#B9F8D8','#00E676','#063A22']};
function forms3d(ctx,t,conv,alpha){if(alpha<=0)return;const tt=t-27.6,cz=tt*4.2,camX=Math.sin(tt*.5)*.7,camY=-Math.sin(tt*.35)*.4,roll=Math.sin(tt*.4)*.04,items=[];
  for(const f of FORMS){const dz=f.z-cz;if(dz<.9)continue;const k=f.tone==='green'?0:conv*.55;items.push({f,dz,x:lerp(f.x,f.x*.25,k)-camX,y:lerp(f.y,f.y*.12+.3,k)-camY})}items.sort((a,b)=>b.dz-a.dz);
  ctx.save();ctx.translate(540,960);ctx.rotate(roll);ctx.translate(-540,-960);
  for(const {f,dz,x,y} of items){const F=950/dz,sx=540+x*F,sy=960+y*F,r2=f.r*F;if(sx<-r2*2||sx>1080+r2*2||sy<-r2*2||sy>1920+r2*2)continue;
    const a=alpha*Math.pow(clamp(1-(dz-6)/34),.8)*clamp((dz-.9)/1.6);if(a<=.01)continue;const blur=Math.min(9,Math.abs(dz-9)*.28);
    ctx.save();ctx.globalAlpha=a;if(hasFilter&&blur>1.2)ctx.filter=`blur(${blur.toFixed(1)}px)`;const [li,ba,da]=TONES[f.tone];
    if(f.type==='sphere'){const g=ctx.createRadialGradient(sx-r2*.38,sy-r2*.42,r2*.05,sx,sy,r2);g.addColorStop(0,li);g.addColorStop(.55,ba);g.addColorStop(1,da);ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,r2,0,TAU);ctx.fill();
      ctx.strokeStyle=f.tone==='green'?'rgba(242,245,243,.35)':'rgba(0,230,118,.28)';ctx.lineWidth=Math.max(1,r2*.05);ctx.beginPath();ctx.arc(sx,sy,r2*.97,.15,1.35);ctx.stroke()}
    else{const ang=f.tilt+t*f.spin,sq=Math.abs(Math.cos(f.tilt*1.3+t*f.spin*.7))*.8+.2;ctx.translate(sx,sy);ctx.rotate(ang);ctx.lineWidth=r2*.32;ctx.strokeStyle=da;ctx.beginPath();ctx.ellipse(0,r2*.04,r2,r2*sq,0,0,TAU);ctx.stroke();
      ctx.lineWidth=r2*.22;ctx.strokeStyle=ba;ctx.beginPath();ctx.ellipse(0,0,r2,r2*sq,0,0,TAU);ctx.stroke();ctx.lineWidth=r2*.07;ctx.strokeStyle=li;ctx.globalAlpha=a*.7;ctx.beginPath();ctx.ellipse(0,-r2*.05,r2,r2*sq,0,Math.PI*1.1,Math.PI*1.75);ctx.stroke()}
    ctx.restore()}ctx.restore()}

/* ================= screens ================= */
const Q0='How did people find a book in a library before computers?';
function chat(ctx,R,t){ctx.fillStyle='#141716';ctx.fillRect(R.x,R.y,R.w,R.h);const s=R.w/740;const Q=TX.question||Q0,typed=Q.slice(0,Math.floor(Q.length*seg(t,15.6,18.6))),sent=t>=18.9;
  ctx.fillStyle='#202523';rr(ctx,R.x+90*s,R.y+R.h-74*s,R.w-180*s,50*s,12*s);ctx.fill();ctx.font=`500 ${15*s}px ${TITLE}`;ctx.fillStyle=C.white;
  if(!sent){ctx.fillText(typed,R.x+108*s,R.y+R.h-43*s);if(Math.floor(t*2.5)%2){ctx.fillRect(R.x+110*s+ctx.measureText(typed).width,R.y+R.h-58*s,2*s,20*s)}}
  else{ctx.fillStyle='#2A302D';rr(ctx,R.x+R.w-470*s,R.y+40*s,400*s,58*s,12*s);ctx.fill();ctx.fillStyle=C.white;wrap(Q,39).slice(0,2).forEach((ln,i)=>ctx.fillText(ln,R.x+R.w-452*s,R.y+(64+22*i)*s));
    const p=seg(t,19.5,22.5);let lx=0,ly=0;ctx.fillStyle='rgba(242,245,243,.55)';for(let i=0;i<12;i++){const q=clamp(p*12-i);if(q<=0)break;const w=(i%4===3?260:520-((i*37)%90))*s*q;ctx.fillRect(R.x+90*s,R.y+(130+i*20)*s,w,7*s);lx=R.x+90*s+w;ly=R.y+(130+i*20)*s}
    if(p>0&&p<1){ctx.fillStyle=C.green;ctx.fillRect(lx+4*s,ly-3*s,8*s,13*s)}}
  ctx.fillStyle=C.fog;ctx.font=`500 ${11*s}px ${MONO}`;ctx.fillText('real Claude chat · filmed live',R.x+14*s,R.y+R.h-8*s)}
function word(ctx,R,txt,col){ctx.fillStyle=C.void;ctx.fillRect(R.x,R.y,R.w,R.h);ctx.fillStyle=col;ctx.font=`700 ${R.h*.26}px ${MONO}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,R.x+R.w/2,R.y+R.h/2);ctx.textAlign='left';ctx.textBaseline='alphabetic'}

/* ================= the studio (2D illustration) ================= */
const MON={top:{x:700,y:372,w:600,h:338},left:{x:140,y:836,w:760,h:428},right:{x:1100,y:836,w:760,h:428}};
const BZ=8,inner=m=>({x:m.x+BZ,y:m.y+BZ,w:m.w-2*BZ,h:m.h-2*BZ-6});
const icen=k=>{const R=inner(MON[k]);return{x:R.x+R.w/2,y:R.y+R.h/2,h:R.h,w:R.w}};
function paint(ctx,R,m,t,o){if(m==='then')collage(ctx,R,o.tc||0);else if(m==='next')flow(ctx,R,t);else if(m==='chat')chat(ctx,R,t);else if(m==='word')word(ctx,R,o.txt,o.col);
  else if(m==='mark'){ctx.fillStyle=C.void;ctx.fillRect(R.x,R.y,R.w,R.h);drawMark(ctx,R.x+R.w/2,R.y+R.h/2,R.h*.62,C.green)}else{ctx.fillStyle='#030504';ctx.fillRect(R.x,R.y,R.w,R.h)}}
function screen(ctx,k,st,t){const R=inner(MON[k]),sc=st[k]||{m:'off',a:0};ctx.save();ctx.beginPath();ctx.rect(R.x,R.y,R.w,R.h);ctx.clip();ctx.fillStyle='#030504';ctx.fillRect(R.x,R.y,R.w,R.h);
  ctx.globalAlpha=sc.a;paint(ctx,R,sc.m,t,sc);if(sc.m2&&sc.a2>0){ctx.globalAlpha=sc.a*sc.a2;paint(ctx,R,sc.m2,t,sc.o2||{})}ctx.globalAlpha=1;
  const sg=ctx.createLinearGradient(R.x,R.y,R.x+R.w*.7,R.y+R.h);sg.addColorStop(0,'rgba(255,255,255,.06)');sg.addColorStop(.32,'rgba(255,255,255,0)');ctx.fillStyle=sg;ctx.fillRect(R.x,R.y,R.w,R.h);ctx.restore()}
function spill(ctx,k,col,a){if(a<=0)return;const m=MON[k],g=ctx.createRadialGradient(m.x+m.w/2,m.y+m.h/2,m.w*.2,m.x+m.w/2,m.y+m.h/2,m.w*.95);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=a*.16;ctx.fillStyle=g;ctx.fillRect(m.x-m.w,m.y-m.h,m.w*3,m.h*3);ctx.globalAlpha=1}
function monitor(ctx,k,st,t,lv){const m=MON[k];
  ctx.fillStyle='rgba(0,0,0,.4)';rr(ctx,m.x+12,m.y+16,m.w,m.h,14);ctx.fill();
  const g=ctx.createLinearGradient(m.x,m.y,m.x,m.y+m.h);g.addColorStop(0,'#1B2321');g.addColorStop(1,'#0A0F0D');ctx.fillStyle=g;rr(ctx,m.x,m.y,m.w,m.h,12);ctx.fill();
  ctx.strokeStyle='#26302D';ctx.lineWidth=1.5;rr(ctx,m.x+.75,m.y+.75,m.w-1.5,m.h-1.5,12);ctx.stroke();
  ctx.strokeStyle=`rgba(0,230,118,${.4*lv})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(m.x+16,m.y+1.5);ctx.lineTo(m.x+m.w-16,m.y+1.5);ctx.stroke();
  screen(ctx,k,st,t);ctx.fillStyle='rgba(242,245,243,.3)';ctx.fillRect(m.x+m.w-44,m.y+m.h-6,12,2)}
function stand(ctx,k){const m=MON[k],cx=m.x+m.w/2,top=m.y+m.h-30;const g=ctx.createLinearGradient(cx-22,0,cx+22,0);g.addColorStop(0,'#0E1311');g.addColorStop(.5,'#1E2724');g.addColorStop(1,'#0C110F');ctx.fillStyle=g;rr(ctx,cx-20,top,40,1408-top,8);ctx.fill();
  ctx.fillStyle='#121816';ell(ctx,cx,1410,150,15);ctx.fill();ctx.fillStyle='#202926';ell(ctx,cx,1406,148,11);ctx.fill()}
function person(ctx,st,t){const lv=Math.min(1,(st.room??1)*(st.led??1)),dy=st.headDy||0,ht=st.ht||0,hx=1000+ht*14,hy=1150+dy;
  const ty=st.typing?1:0,j1=ty*Math.sin(t*11)*7,j2=ty*Math.sin(t*13+1.3)*7,sh=ty*Math.sin(t*5.5)*3;ctx.lineCap='round';ctx.strokeStyle='#0B110E';ctx.lineWidth=92;ctx.beginPath();ctx.moveTo(745,1395+sh);ctx.quadraticCurveTo(735,1495,850+j2*.6,1496+j1);ctx.stroke();ctx.beginPath();ctx.moveTo(1255,1395-sh);ctx.quadraticCurveTo(1265,1495,1150+j1*.6,1496+j2);ctx.stroke();
  const tg=ctx.createLinearGradient(700,0,1300,0);tg.addColorStop(0,'#0B120F');tg.addColorStop(.55,'#121B17');tg.addColorStop(1,'#0A100D');ctx.fillStyle=tg;
  ctx.beginPath();ctx.moveTo(705,1900);ctx.bezierCurveTo(690,1560,760,1330,880,1296);ctx.lineTo(1120,1296);ctx.bezierCurveTo(1240,1330,1310,1560,1295,1900);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.035)';ctx.lineWidth=4;for(const [a,b,c2] of [[820,1420,860],[1180,1430,1140],[1000,1360,1000]]){ctx.beginPath();ctx.moveTo(a,b);ctx.quadraticCurveTo(c2,b+80,a+(a<1000?30:-30),b+200);ctx.stroke()}
  ctx.fillStyle='#16201C';ell(ctx,1000,1300,150,52);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(1000,1300,110,30,0,0,Math.PI);ctx.stroke();
  ctx.fillStyle='#2A1D16';rr(ctx,964,hy+60,72,110,20);ctx.fill();
  ctx.strokeStyle='#151B19';ctx.lineWidth=16;ctx.beginPath();ctx.arc(1000,1262,92,Math.PI*.12,Math.PI*.88);ctx.stroke();ctx.fillStyle='#121816';ell(ctx,912,1290,26,36,.2);ctx.fill();ell(ctx,1088,1290,26,36,-.2);ctx.fill();
  ctx.fillStyle='rgba(0,230,118,.7)';ctx.fillRect(1100,1284,3,8);
  const earL=14-ht*6,earR=14+ht*8;ctx.fillStyle='#3A271D';ell(ctx,hx-90,hy+12,Math.max(4,earL),24);ctx.fill();ell(ctx,hx+90,hy+12,earR,24);ctx.fill();
  if(ht>0){ctx.fillStyle='#3A271D';ell(ctx,hx+70*ht,hy+52,26*ht,38,-.3);ctx.fill()}
  ctx.fillStyle='#080B0A';ctx.beginPath();ctx.ellipse(hx,hy-6,94,102,0,0,TAU);ctx.fill();
  ctx.fillStyle='#0C100E';for(let i=0;i<9;i++){const a=Math.PI*(1.05+i*.1);ell(ctx,hx+Math.cos(a)*86,hy-10+Math.sin(a)*92,22,16,a);ctx.fill()}
  ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=2;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(hx-60+i*20,hy-80);ctx.quadraticCurveTo(hx-50+i*20,hy-20,hx-56+i*20,hy+40);ctx.stroke()}
  ctx.strokeStyle=`rgba(0,230,118,${.55*lv})`;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(hx,hy-6,94,102,0,Math.PI*1.1,Math.PI*1.9);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(760,1420);ctx.bezierCurveTo(800,1330,860,1300,900,1298);ctx.stroke();ctx.beginPath();ctx.moveTo(1240,1420);ctx.bezierCurveTo(1200,1330,1140,1300,1100,1298);ctx.stroke();
  ctx.fillStyle='#090D0B';rr(ctx,800,1575,400,360,70);ctx.fill();ctx.strokeStyle='#1A2420';ctx.lineWidth=3;rr(ctx,800,1575,400,360,70);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.03)';ctx.lineWidth=2;for(let x=830;x<1180;x+=14){ctx.beginPath();ctx.moveTo(x,1590);ctx.lineTo(x,1920);ctx.stroke()}
  ctx.strokeStyle=`rgba(0,230,118,${.25*lv})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(840,1577);ctx.lineTo(1160,1577);ctx.stroke();
  ctx.fillStyle='#0D1210';rr(ctx,690,1655,120,28,12);ctx.fill();rr(ctx,1190,1655,120,28,12);ctx.fill()}
function studio(ctx,cam,st,t){
  ctx.save();ctx.translate(540,960);ctx.scale(cam.z,cam.z);ctx.translate(-cam.x,-cam.y);
  ctx.fillStyle=C.void;ctx.fillRect(-2000,-2000,6000,6600);
  const lv=st.led??1,room=st.room??1,L=Math.min(1,lv*room);
  if(L>0){const g=ctx.createRadialGradient(1000,340,50,1000,600,1500);g.addColorStop(0,`rgba(11,61,46,${Math.min(1,.85*lv*room)})`);g.addColorStop(1,'rgba(11,61,46,0)');ctx.fillStyle=g;ctx.fillRect(-500,-400,3000,2600);ctx.fillStyle=`rgba(0,230,118,${.045*lv*room})`;ctx.fillRect(-500,-400,3000,2600)}
  ctx.lineCap='round';ctx.strokeStyle='#0D1512';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(110,300);ctx.lineTo(1890,300);ctx.moveTo(110,300);ctx.lineTo(110,1390);ctx.moveTo(1890,300);ctx.lineTo(1890,1390);ctx.stroke();
  if(L>0){ctx.strokeStyle=`rgba(0,230,118,${Math.min(1,.18*lv*room)})`;ctx.lineWidth=60;ctx.beginPath();ctx.moveTo(110,300);ctx.lineTo(1890,300);ctx.stroke();ctx.strokeStyle=C.green;ctx.globalAlpha=Math.min(1,(.35+.65*lv)*room);ctx.lineWidth=10;
    ctx.beginPath();ctx.moveTo(110,300);ctx.lineTo(1890,300);ctx.moveTo(110,300);ctx.lineTo(110,1390);ctx.moveTo(1890,300);ctx.lineTo(1890,1390);ctx.stroke();ctx.globalAlpha=1}
  ctx.lineCap='butt';
  const sp=k=>(st[k]?.a||0)*(st[k]?.m==='off'?0:1);
  spill(ctx,'left',C.amber,sp('left')*(st.left?.m==='then'||st.left?.m==='word'?1:.4));spill(ctx,'top','#F2F5F3',sp('top'));spill(ctx,'right',C.green,sp('right'));
  ctx.fillStyle='#121816';rr(ctx,990,640,20,770,8);ctx.fill();ctx.fillStyle='#1A2220';rr(ctx,960,690,80,26,10);ctx.fill();ctx.fillStyle='#0E1311';rr(ctx,975,1380,50,40,6);ctx.fill();
  monitor(ctx,'top',st,t,L);stand(ctx,'left');stand(ctx,'right');monitor(ctx,'left',st,t,L);monitor(ctx,'right',st,t,L);
  ctx.strokeStyle='#0B100E';ctx.lineWidth=6;for(const x of [520,1480]){ctx.beginPath();ctx.moveTo(x+16,1300);ctx.bezierCurveTo(x+30,1360,x-10,1380,x+12,1412);ctx.stroke()}
  const dg=ctx.createLinearGradient(0,1400,0,1575);dg.addColorStop(0,'#111816');dg.addColorStop(1,'#090D0C');ctx.fillStyle=dg;ctx.fillRect(-500,1400,3000,175);
  ctx.fillStyle=`rgba(0,230,118,${.22*L})`;ctx.fillRect(-500,1400,3000,2);ctx.fillStyle='#050807';ctx.fillRect(-500,1575,3000,40);ctx.fillStyle='#1A2421';ctx.fillRect(-500,1575,3000,3);
  ctx.fillStyle='#0C2A20';rr(ctx,540,1426,920,132,16);ctx.fill();ctx.strokeStyle='#123A2C';ctx.lineWidth=2;rr(ctx,540,1426,920,132,16);ctx.stroke();
  if(!st.kbHide){ctx.fillStyle=`rgba(0,230,118,${.14*(st.kb??1)})`;rr(ctx,620,1528,640,14,7);ctx.fill();
  ctx.fillStyle='#0A0E0D';rr(ctx,630,1444,620,90,12);ctx.fill();ctx.strokeStyle='#1C2623';ctx.lineWidth=2;rr(ctx,630,1444,620,90,12);ctx.stroke();
  for(let r=0;r<4;r++)for(let c=0;c<16;c++){const kx=642+c*37.5,ky=1454+r*19.5,hit=st.typing&&((Math.floor(t*9)+c*7+r*3)%23===0);ctx.fillStyle=hit?'#1F3A2E':'#161D1A';rr(ctx,kx,ky,33,15,3);ctx.fill();ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(kx+2,ky+1,29,2)}
  ctx.fillStyle=`rgba(0,230,118,${.6*(st.kb??1)})`;ctx.fillRect(640,1532,600,2);}
  ctx.fillStyle='#121816';ell(ctx,1330,1490,28,40);ctx.fill();ctx.fillStyle='rgba(255,255,255,.06)';ell(ctx,1322,1474,10,14);ctx.fill();
  const mg=ctx.createLinearGradient(0,1440,0,1508);mg.addColorStop(0,'#3A423F');mg.addColorStop(.12,'#2B3230');mg.addColorStop(1,'#151A18');ctx.fillStyle=mg;rr(ctx,1500,1440,220,66,16);ctx.fill();ctx.fillStyle='rgba(242,245,243,.85)';ell(ctx,1522,1480,3.5,3.5);ctx.fill();
  ctx.fillStyle='#141A18';rr(ctx,260,1330,96,82,12);ctx.fill();
  for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.32,l=110+((i*37)%50);ctx.save();ctx.translate(308,1332);ctx.rotate(a+Math.PI/2);ctx.fillStyle=i%2?'#0B3D2E':'#0E4A37';ell(ctx,0,-l/2,18,l/2);ctx.fill();ctx.strokeStyle=`rgba(0,230,118,${.2*L})`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(0,-l+8);ctx.stroke();ctx.restore()}
  if(st.char!==false)person(ctx,st,t);
  ctx.restore();
}
const BLURC=layer(8,8);
function blurLayer(ctx,px,fn){if(px<.6){fn(ctx);return}const q=Math.max(1.5,Math.min(10,px*.75)),w=Math.round(1080/q),h=Math.round(1920/q);if(BLURC.width!==w||BLURC.height!==h){BLURC.width=w;BLURC.height=h}
  const b=BLURC.getContext('2d');b.setTransform(1,0,0,1,0,0);b.clearRect(0,0,w,h);b.setTransform(w/1080,0,0,h/1920,0,0);b.filter='none';fn(b);
  if(hasFilter&&px>3){b.setTransform(1,0,0,1,0,0);b.filter='blur(1px)';b.drawImage(BLURC,0,0);b.filter='none'}ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(BLURC,0,0,1080,1920);ctx.restore()}
const studioBlur=(ctx,cam,st,t,px)=>blurLayer(ctx,px,c=>studio(c,cam,st,t));

/* ================= hands (2D) ================= */
function pressHand(ctx,tx,ty,light){ctx.save();ctx.translate(tx,ty);ctx.rotate(.4);
  const skin=(a,b)=>{const g=ctx.createLinearGradient(-60,0,260,0);g.addColorStop(0,a);g.addColorStop(1,b);return g};
  ctx.fillStyle='#0C1210';rr(ctx,20,-1800,300,1440,80);ctx.fill();ctx.fillStyle='#131B18';rr(ctx,10,-420,320,80,34);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.06)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(30,-380);ctx.lineTo(310,-380);ctx.stroke();
  ctx.fillStyle=skin(C.skinLo,C.skin);rr(ctx,10,-360,270,210,90);ctx.fill();
  for(let i=0;i<3;i++){ctx.fillStyle=skin(C.skin,C.skinLo);rr(ctx,100+i*56,-200,58,96,28);ctx.fill();ctx.fillStyle='rgba(255,220,190,.10)';ell(ctx,129+i*56,-180,14,8);ctx.fill()}
  ctx.fillStyle=skin(C.skinLo,C.skin);rr(ctx,-24,-300,72,140,36);ctx.fill();
  ctx.fillStyle=skin(C.skin,C.skinHi);rr(ctx,-30,-270,62,282,31);ctx.fill();
  ctx.strokeStyle='rgba(20,10,5,.35)';ctx.lineWidth=2.5;for(const y of [-150,-82]){ctx.beginPath();ctx.moveTo(-18,y);ctx.quadraticCurveTo(0,y+5,20,y);ctx.stroke()}
  ctx.fillStyle='rgba(225,190,170,.55)';rr(ctx,-17,-46,34,40,15);ctx.fill();ctx.fillStyle='rgba(255,255,255,.18)';rr(ctx,-11,-42,10,24,5);ctx.fill();
  ctx.strokeStyle=`rgba(0,230,118,${.18+.42*light})`;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-30,-230);ctx.lineTo(-30,-10);ctx.quadraticCurveTo(-28,12,0,12);ctx.stroke();ctx.beginPath();ctx.moveTo(10,-320);ctx.quadraticCurveTo(14,-358,60,-360);ctx.stroke();
  ctx.restore()}
function typeHand(ctx,x,y,s,t,ph,mir){ctx.save();ctx.translate(x,y);ctx.scale(mir?-s:s,s);
  ctx.fillStyle='#0C1210';rr(ctx,-120,-1500,250,1300,70);ctx.fill();ctx.fillStyle='#131B18';rr(ctx,-128,-230,266,64,28);ctx.fill();
  const g=ctx.createLinearGradient(-110,0,120,0);g.addColorStop(0,C.skinLo);g.addColorStop(.6,C.skin);g.addColorStop(1,C.skinLo);ctx.fillStyle=g;rr(ctx,-112,-190,226,150,70);ctx.fill();
  for(let i=0;i<4;i++){const pr=Math.max(0,Math.sin(t*9+i*1.9+ph))*16;ctx.fillStyle=i%2?C.skin:'#53392A';rr(ctx,-96+i*50,-70+pr,44,118,22);ctx.fill();ctx.fillStyle='rgba(225,190,170,.35)';rr(ctx,-88+i*50,22+pr,28,20,9);ctx.fill()}
  ctx.fillStyle=C.skinLo;rr(ctx,96,-120,48,110,24);ctx.fill();
  ctx.strokeStyle='rgba(0,230,118,.35)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-112,-120);ctx.quadraticCurveTo(-110,-190,-40,-190);ctx.stroke();ctx.restore()}
function bigKeys(ctx,off,lit,enterPress,hl){
  for(let r=0;r<4;r++)for(let c=-1;c<7;c++){const x=c*250+off+(r%2)*90,y=1060+r*250,isE=(r===0&&c===2),dy=isE?enterPress*16:0;
    ctx.fillStyle='rgba(0,230,118,'+(lit*(isE?.55:.18)+(hl&&hl(r,c)?.45:0))+')';rr(ctx,x-6,y+dy+10,232,214,30);ctx.fill();
    const g=ctx.createLinearGradient(0,y,0,y+206);g.addColorStop(0,isE?'#1A2420':'#141B18');g.addColorStop(1,'#090D0B');ctx.fillStyle=g;rr(ctx,x,y+dy,220,206,26);ctx.fill();
    ctx.fillStyle=isE?'#1C2622':'#121916';rr(ctx,x+16,y+dy+14,188,160,20);ctx.fill();ctx.fillStyle='rgba(255,255,255,.05)';rr(ctx,x+22,y+dy+18,176,8,4);ctx.fill();
    if(isE){ctx.fillStyle=lit>0?C.white:'rgba(242,245,243,.38)';ctx.font=`500 34px ${MONO}`;ctx.fillText('ENTER',x+56,y+dy+105)}}}

/*KB*/
/* ===== compact keyboard + soft stylised hands, redrawn after Samrat's reference image, in SGMM colours ===== */
const KL=[];{const add=(u,v,w,l,kind)=>KL.push({u,v,w,h:1,l,kind});
  add(0,0,1,'Esc','esc');'1234567890-='.split('').forEach((l,i)=>add(1+i,0,1,l));add(13,0,2,'Back','mod');
  add(0,1,1.5,'Tab','mod');'QWERTYUIOP[]'.split('').forEach((l,i)=>add(1.5+i,1,1,l));add(13.5,1,1.5,'\\','mod');
  add(0,2,1.75,'Caps','mod');"ASDFGHJKL;'".split('').forEach((l,i)=>add(1.75+i,2,1,l));add(12.75,2,2.25,'Enter','enter');
  add(0,3,2.25,'Shift','mod');'ZXCVBNM,./'.split('').forEach((l,i)=>add(2.25+i,3,1,l));add(12.25,3,2.75,'Shift','mod');
  [['Ctrl',0],['Win',1.25],['Alt',2.5]].forEach(([l,u])=>add(u,4,1.25,l,'mod'));add(3.75,4,6.25,'','space');[['Alt',10],['Fn',11.25],['Menu',12.5],['Ctrl',13.75]].forEach(([l,u])=>add(u,4,1.25,l,'mod'))}
const KBW=15,KBH=5,ENTER_C=[13.875,2.5];
const keyAt=(u,v)=>KL.findIndex(k=>u>=k.u&&u<k.u+k.w&&v>=k.v&&v<k.v+k.h);
function kproj(P,u,v,lift=0){const t=v/KBH,w=lerp(P.wb,P.wf,t),s=w/KBW;return{x:P.cx+(u-KBW/2)*s,y:lerp(P.yb,P.yf,t)-lift*s,s}}
const KCOL={key:['#2B3431','#1B2220','#0C110F'],mod:['#16523F','#0B3D2E','#06231B'],esc:['#FFD08A','#FFB547','#B87A22'],enter:['#7DF7BA','#00E676','#00924A'],space:['#2B3431','#1B2220','#0C110F']};
function keyboard(ctx,P,lit,press){
  const a=kproj(P,-.35,-.35),b=kproj(P,KBW+.35,KBH+.35);
  ctx.save();ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=40;ctx.shadowOffsetY=26;const cg=ctx.createLinearGradient(0,a.y,0,b.y);cg.addColorStop(0,'#1E2624');cg.addColorStop(1,'#0E1311');ctx.fillStyle=cg;rr(ctx,a.x,a.y,b.x-a.x,b.y-a.y,.55*a.s);ctx.fill();ctx.restore();
  ctx.fillStyle='#0A0E0D';rr(ctx,a.x,b.y-.25*b.s,b.x-a.x,.42*b.s,.3*b.s);ctx.fill();
  if(lit>0){ctx.fillStyle=`rgba(0,230,118,${.55*lit})`;ctx.fillRect(a.x+.6*a.s,b.y+.12*b.s,b.x-a.x-1.2*a.s,3)}
  KL.forEach((k,i)=>{const pr=press[i]||0,p0=kproj(P,k.u,k.v),p1=kproj(P,k.u+k.w,k.v+1),s=p0.s,g=.07*s,x=p0.x+g,y=p0.y+g,w=p1.x-p0.x-2*g,h=p1.y-p0.y-2*g,dep=.2*s*(1-pr*.7),col=KCOL[k.kind||'key'],r=.2*s;
    if(lit>0){ctx.fillStyle=`rgba(0,230,118,${.22*lit})`;rr(ctx,x-2,y-2+dep,w+4,h+4,r);ctx.fill()}
    ctx.fillStyle=col[2];rr(ctx,x,y+dep*.15,w,h,r);ctx.fill();
    const ty=y-dep+.2*s*.3;const tg=ctx.createLinearGradient(x,ty,x+w*.4,ty+h);tg.addColorStop(0,col[0]);tg.addColorStop(1,col[1]);ctx.fillStyle=tg;rr(ctx,x+.06*s,ty,w-.12*s,h-.14*s,r*.85);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.08)';rr(ctx,x+.14*s,ty+.06*s,w-.28*s,.14*s,.07*s);ctx.fill();
    if(k.l){const dark=k.kind==='enter'||k.kind==='esc';ctx.fillStyle=dark?'rgba(5,8,7,.85)':`rgba(242,245,243,${.55+.35*lit})`;ctx.font=`600 ${(k.l.length>2?.25:.34)*s}px ${MONO}`;ctx.textBaseline='middle';ctx.textAlign=k.l.length>2?'left':'center';
      ctx.fillText(k.l,k.l.length>2?x+.2*s:x+w/2,ty+(h-.14*s)/2);ctx.textAlign='left';ctx.textBaseline='alphabetic'}});
}
/* the hand: short soft fingers held together, rounded palm, white cuff, Deep Forest sleeve (like the reference) */
const SK={hi:'#E2AE84',mid:'#C48A60',lo:'#9A6440',deep:'#7A4C2E'};
function softPart(ctx,x,y,w,h,r,rot,c0,c1){ctx.save();ctx.translate(x,y);ctx.rotate(rot);const g=ctx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;rr(ctx,-w/2,-h/2,w,h,r);ctx.fill();ctx.restore()}
function hand(ctx,x,y,s,o){const side=o.side||1,ext=o.ext||[0,0,0,0],curl=o.curl||[0,0,0,0],ph=o.ph||[0,0,0,0],L=o.light||0;
  ctx.save();ctx.translate(x,y);ctx.scale(side,1);ctx.rotate(o.rot||0);
  ctx.fillStyle='rgba(0,0,0,.32)';ell(ctx,.1*s,-.2*s,1.9*s,.9*s);ctx.fill();
  softPart(ctx,.2*s,3.6*s,3.3*s,3.6*s,1.2*s,0,'#0F4A37','#05201A');
  ctx.fillStyle='rgba(255,255,255,.06)';rr(ctx,-1.2*s,2.1*s,.5*s,3*s,.25*s);ctx.fill();
  const cg=ctx.createLinearGradient(0,1.55*s,0,2.3*s);cg.addColorStop(0,'#FFFFFF');cg.addColorStop(1,'#BFC8C3');ctx.fillStyle=cg;rr(ctx,-1.5*s,1.55*s,3.45*s,.8*s,.4*s);ctx.fill();
  softPart(ctx,-1.45*s,.75*s,.72*s,1.25*s,.36*s,-.55,SK.hi,SK.lo);
  softPart(ctx,.2*s,.65*s,2.7*s,2.2*s,1.0*s,0,SK.hi,SK.lo);
  const fx=[-.78,-.12,.52,1.12],len=[1.05,1.12,1.04,.82],wd=[.66,.68,.66,.58];
  for(let i=3;i>=0;i--){const L0=curl[i]?.55:len[i]+ext[i]*.35,lift=ph[i]*.12;const cx=fx[i]*s,top=-.25*s-L0*s+lift*s,h=(L0+.55)*s;
    const g=ctx.createLinearGradient(cx-wd[i]*s/2,0,cx+wd[i]*s/2,0);g.addColorStop(0,SK.hi);g.addColorStop(.6,SK.mid);g.addColorStop(1,SK.lo);ctx.fillStyle=g;rr(ctx,cx-wd[i]*s/2,top,wd[i]*s,h,wd[i]*s/2);ctx.fill();
    ctx.fillStyle='rgba(255,240,225,.28)';ell(ctx,cx-.1*s,top+.22*s,.13*s,.1*s);ctx.fill();
    if(curl[i]){ctx.fillStyle='rgba(122,76,46,.35)';ell(ctx,cx,top+.12*s,.24*s,.08*s);ctx.fill()}}
  ctx.fillStyle='rgba(122,76,46,.22)';for(let i=0;i<3;i++){ctx.fillRect((fx[i]+.33)*s,-.4*s,.035*s,.5*s)}
  ctx.strokeStyle=`rgba(0,230,118,${.1+.4*L})`;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1.85*s,2.4*s);ctx.lineTo(1.85*s,5*s);ctx.stroke();
  ctx.restore()}
/* where to put a hand so its index fingertip sits on a key (u,v) */
function handAt(P,u,v,side){const p=kproj(P,u,v+.5,.2);const s=p.s;return{x:p.x-side*(-.78*s),y:p.y+1.45*s,s}}
const KB_HOOK={cx:480,yb:1040,yf:1370,wb:840,wf:890};

/* ================= builder overlay (SHIFT · TOOL · BUILD) ================= */
const CARDS=[[33.8,'SHIFT'],[34.7,'TOOL'],[36.0,'BUILD']];
function pict(ctx,kind,cx,cy){ctx.save();ctx.translate(cx,cy);ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';
  if(kind==='SHIFT'){ctx.fillStyle=C.amber;ell(ctx,-70,24,18,18);ctx.fill();ctx.fillStyle=C.white;ell(ctx,74,-24,18,18);ctx.fill();ctx.strokeStyle=C.white;ctx.beginPath();ctx.moveTo(-46,10);ctx.quadraticCurveTo(0,-56,50,-28);ctx.stroke();ctx.beginPath();ctx.moveTo(40,-50);ctx.lineTo(52,-27);ctx.lineTo(28,-17);ctx.stroke()}
  if(kind==='TOOL'){ctx.strokeStyle=C.white;rr(ctx,-80,-56,130,86,18);ctx.stroke();ctx.beginPath();ctx.moveTo(-50,30);ctx.lineTo(-62,56);ctx.lineTo(-24,30);ctx.stroke();ctx.fillStyle=C.white;for(let i=0;i<3;i++){ell(ctx,-46+i*28,-13,6,6);ctx.fill()}
    ctx.beginPath();ctx.moveTo(40,-6);ctx.lineTo(40,60);ctx.lineTo(56,46);ctx.lineTo(68,72);ctx.lineTo(78,67);ctx.lineTo(66,42);ctx.lineTo(88,40);ctx.closePath();ctx.fill()}
  if(kind==='BUILD'){ctx.strokeStyle=C.white;ctx.strokeRect(-70,10,64,52);ctx.strokeRect(4,10,64,52);ctx.strokeRect(-33,-50,64,52)}
  ctx.restore()}
function builder(ctx,t){const A=ss(seg(t,30.3,30.8));if(A<=0)return;ctx.save();
  ctx.fillStyle=`rgba(5,8,7,${.4*A})`;ctx.fillRect(0,0,1080,930);const gd=ctx.createLinearGradient(0,930,0,1060);gd.addColorStop(0,`rgba(5,8,7,${.4*A})`);gd.addColorStop(1,'rgba(5,8,7,0)');ctx.fillStyle=gd;ctx.fillRect(0,930,1080,130);ctx.globalAlpha=A;
  ctx.fillStyle='rgba(5,8,7,.75)';rr(ctx,64,166,330,68,10);ctx.fill();ctx.fillStyle=Math.floor(t*2)%2?C.white:'rgba(242,245,243,.25)';ell(ctx,100,200,12,12);ctx.fill();
  ctx.fillStyle=C.white;ctx.font=`700 30px ${MONO}`;ctx.textBaseline='middle';ctx.fillText(TX.log_rec||'REC',126,201);ctx.fillStyle=C.fog;ctx.font=`500 26px ${MONO}`;ctx.fillText(TX.log_day||'DAY 001',212,202);
  const la=spring(seg(t,30.9,31.7));if(t>=30.9){const up=ss(seg(t,33.4,34.0)),y=lerp(560,380,up),s=lerp(1,.8,up);ctx.save();ctx.translate(540,y+(1-la)*120);ctx.scale(s,s);ctx.globalAlpha=A*clamp(la*1.4);
    ctx.fillStyle='rgba(5,8,7,.94)';rr(ctx,-440,-120,880,240,14);ctx.fill();ctx.strokeStyle='#1E2D27';ctx.lineWidth=2;rr(ctx,-440,-120,880,240,14);ctx.stroke();
    ctx.fillStyle=C.fog;ctx.font=`500 26px ${MONO}`;ctx.fillText(TX.log_kicker||'SGMM / BUILD LOG',-400,-72);ctx.fillStyle='#1E2D27';ctx.fillRect(-400,-44,800,2);
    const txt=TX.log_title||'001 · THE MATRIX IS ONLINE',n=Math.floor(txt.length*seg(t,31.2,32.8));ctx.fillStyle=C.white;ctx.font=`700 40px ${MONO}`;ctx.fillText(txt.slice(0,n),-400,20);
    const cw=ctx.measureText(txt.slice(0,n)).width;if(t<33.8||Math.floor(t*2.4)%2){ctx.fillStyle=t<33.8?C.green:C.white;ctx.fillRect(-396+cw,-4,20,46)}
    ctx.fillStyle=C.fog;ctx.font=`500 24px ${MONO}`;ctx.fillText(TX.log_sub||'THEN → NOW → NEXT',-400,78);ctx.restore()}
  let active=-1;CARDS.forEach(([a],i)=>{if(t>=a)active=i});
  CARDS.forEach(([a,w0],i)=>{if(t<a)return;const w=(TX.log_cards||[])[i]||w0;const p=spring(seg(t,a,a+.9)),x=70+i*322,y=530+(1-p)*160+(t>37.0?-10*ss(seg(t,37.0,37.4)):0);ctx.save();ctx.globalAlpha=A*clamp(seg(t,a,a+.18));ctx.translate(x+150,y+150);ctx.rotate((1-p)*(i-1)*.06);ctx.translate(-150,-150);
    ctx.fillStyle='rgba(5,8,7,.94)';rr(ctx,0,0,300,300,14);ctx.fill();ctx.strokeStyle=i===active?'#2E4A3E':'#1E2D27';ctx.lineWidth=2;rr(ctx,0,0,300,300,14);ctx.stroke();
    ctx.strokeStyle='rgba(124,138,132,.12)';ctx.lineWidth=1;for(let gx=50;gx<300;gx+=50){ctx.beginPath();ctx.moveTo(gx,14);ctx.lineTo(gx,286);ctx.stroke()}
    ctx.fillStyle=C.fog;ctx.font=`500 26px ${MONO}`;ctx.fillText('0'+(i+1),26,42);if(i===active){ctx.fillStyle=C.green;ell(ctx,266,40,13,13);ctx.fill()}
    pict(ctx,w,150,128);ctx.fillStyle=C.white;ctx.font=`700 54px ${TITLE}`;ctx.fillText(w+'.',26,256);ctx.restore()});
  if(t>=37.0){const p=ss(seg(t,37.0,37.5));ctx.globalAlpha=A*p;ctx.fillStyle=C.white;ctx.font=`700 34px ${MONO}`;ctx.fillText(TX.log_tagline||'→ BUILT IN PUBLIC',96,880+(1-p)*30)}
  ctx.restore();ctx.textBaseline='alphabetic'}

/* ================= logo from the dark ================= */
const GRAIN=Array.from({length:1400},()=>[R0()*1080,R0()*1920,R0()]);
function logoScene(ctx,t){ctx.fillStyle=C.void;ctx.fillRect(0,0,1080,1920);
  const bk=ss(seg(t,40.9,41.8));if(bk>0){const g=ctx.createRadialGradient(540,900,40,540,900,820);g.addColorStop(0,`rgba(11,61,46,${.55*bk})`);g.addColorStop(1,'rgba(11,61,46,0)');ctx.fillStyle=g;ctx.fillRect(0,0,1080,1920)}
  const f=Math.floor(t*24);ctx.fillStyle='rgba(242,245,243,.05)';for(let i=0;i<GRAIN.length;i++){const q=GRAIN[(i+f*37)%GRAIN.length];ctx.fillRect(q[0],q[1],1.6,1.6)}
  const lw=ss(seg(t,40.65,40.95)),la=1-ss(seg(t,41.25,41.6));if(lw>0&&la>0){ctx.fillStyle=`rgba(242,245,243,${la})`;ctx.fillRect(540-330*lw,899,660*lw,2)}
  const op=io(seg(t,40.9,41.4));if(op>0){const x=seg(t,40.95,42.3),sc=(.9+.1*spring(x))*(1+.03*seg(t,41.6,43.4)),yo=-46*Math.exp(-6.5*x)*Math.cos(11*x)*(x>0?1:0);
    ctx.save();ctx.beginPath();ctx.rect(0,900-560*op,1080,1120*op);ctx.clip();drawMark(ctx,540,900+yo,520*sc,C.green);ctx.restore()}
  const k=ss(seg(t,41.7,42.2));if(k>0){ctx.save();ctx.globalAlpha=k;ctx.font=`700 36px ${MONO}`;ctx.textBaseline='middle';const parts=[['THEN',C.amber],['  ·  ',C.fog],['NOW',C.white],['  ·  ',C.fog],['NEXT',C.green]];
    const w=parts.reduce((s,[x])=>s+ctx.measureText(x).width,0);let x=540-w/2;for(const [s,c] of parts){ctx.fillStyle=c;ctx.fillText(s,x,1250+(1-k)*16);x+=ctx.measureText(s).width}ctx.restore()}}

/* ================= scenes ================= */
function roomState(t){const flood=ss(seg(t,PRESS,PRESS+.22)),bump=Math.exp(-Math.pow((t-(PRESS+.24))/.07,2))*.22,on=a=>ss(seg(t,a,a+.12)),lw=ss(seg(t,4.3,5.0));
  return{room:flood,led:flood*(1+bump),kb:flood,left:{m:'word',txt:'THEN',col:C.amber,a:on(1.35),m2:'then',a2:lw,o2:{tc:0}},top:{m:'word',txt:'NOW',col:C.white,a:on(1.5)},right:{m:'word',txt:'NEXT',col:C.green,a:on(1.65)}}}
const S_LIT={room:1,led:1,kb:1,left:{m:'then',a:1,tc:0},top:{m:'chat',a:1},right:{m:'next',a:1}};
const REV0={x:1150,y:1480,z:2.6},REV1={x:990,y:1050,z:.6};
const revealCam=t=>{const e=oc(seg(t,1.95,5.0));return{x:lerp(REV0.x,REV1.x,e),y:lerp(REV0.y,REV1.y,e),z:zlerp(REV0.z,REV1.z,e)}};
const pushCam=t=>{const L=icen('left'),e=ic(seg(t,5.0,6.35)),p=ss(seg(t,5.0,6.2));return{x:lerp(REV1.x,L.x,p),y:lerp(REV1.y,L.y,p),z:zlerp(REV1.z,1920/L.h,e)*(1+.12*oc(Math.max(0,t-6.35)/6.6))}};
const otsCam=t=>({x:1000,y:760-6*(t-15.4),z:1.36+.06*ss(seg(t,15.4,22))});
const nextCam=t=>{const a=otsCam(22),Rr=icen('right'),p=ss(seg(t,22,25));let c={x:lerp(a.x,Rr.x,p),y:lerp(a.y,Rr.y+40,p),z:lerp(a.z,1.28,p)+.05*seg(t,25,26.6)};
  const q=ic(seg(t,26.6,27.95));if(q>0)c={x:Rr.x,y:lerp(Rr.y+40,Rr.y,ss(seg(t,26.6,27.7))),z:zlerp(c.z,1920/Rr.h,q)};return c};
const endCam=t=>{const T=icen('top'),p=io(seg(t,39.3,40.0)),q=ic(seg(t,40.0,40.75));let c={x:lerp(1000,1000,p),y:lerp(1020,900,p),z:lerp(.56,.66,p)};if(q>0)c={x:1000,y:lerp(900,T.y,ss(seg(t,40.0,40.6))),z:zlerp(.66,1920/T.h,q)};return c};
const FULLFLOW=()=>{const R=icen('right'),w=1920*R.w/R.h;return{x:540-w/2,y:0,w,h:1920}};
const OFF=new Map();const offFor=(W,H)=>{const k=W+'x'+H;if(!OFF.has(k))OFF.set(k,layer(W,H));return OFF.get(k)};

/* ================= sound: a compact kit (ideas from the reference kit: buses, compressor, room reverb, seeded noise, paper/stroke/key primitives) ================= */
function makeKit(ctx,start,mute,warp){let useW=true;const T0=start||0,base=ctx.currentTime+.03,SR=ctx.sampleRate,TINY=1e-4,W0=warp||(t=>t),W=t=>useW?W0(t):t,at=t=>(Math.round((base+(W(t)-T0))*SR)+.25)/SR;
  const master=ctx.createGain();master.gain.value=.9;const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=8;comp.ratio.value=3;comp.attack.value=.004;comp.release.value=.18;comp.connect(master);master.connect(ctx.destination);
  const bus={};for(const [n,g] of Object.entries({sfx:.85,amb:.5,music:.5})){bus[n]=ctx.createGain();bus[n].gain.value=g;const z=ctx.createGain();z.gain.value=(mute==='music'&&n==='music')||(mute==='sfx'&&n!=='music')?0:1;bus[n].connect(z);z.connect(comp)}
  const verb=ctx.createConvolver();{const n=Math.floor(1.6*SR),ir=ctx.createBuffer(2,n,SR);for(let c=0;c<2;c++){const r=rng(77+c),d=ir.getChannelData(c);let lp=0;for(let i=0;i<n;i++){const u=i/n;lp+=(.6-.45*u)*((r()*2-1)-lp);d[i]=lp*Math.pow(1-u,3)}}verb.buffer=ir}
  const vin=ctx.createGain();vin.gain.value=.9;vin.connect(verb);verb.connect(comp);
  const verbM=ctx.createConvolver();verbM.buffer=verb.buffer;const vinM=ctx.createGain();vinM.gain.value=1;const voutM=ctx.createGain();voutM.gain.value=1;vinM.connect(verbM);verbM.connect(voutM);const zm=ctx.createGain();zm.gain.value=mute==='music'?0:1;voutM.connect(zm);zm.connect(comp);vin.gain.value=mute==='sfx'?0:.9;
  const NB={};{const n=Math.floor(2.5*SR);for(const kind of ['white','pink','brown']){const b=ctx.createBuffer(1,n,SR),d=b.getChannelData(0),r=rng(kind.length*97);let p0=0,p1=0,p2=0,br=0;
    for(let i=0;i<n;i++){const w=r()*2-1;if(kind==='white')d[i]=w;else if(kind==='pink'){p0=.997*p0+.029*w;p1=.985*p1+.032*w;p2=.95*p2+.048*w;d[i]=(p0+p1+p2+w*.05)*2.2}else{br=(br+.02*w)/1.02;d[i]=br*3.2}}NB[kind]=b}}
  const sweep=(param,v,t)=>{if(!Array.isArray(v)){param.setValueAtTime(v,t);return}param.setValueAtTime(v[0][1],t+v[0][0]);for(let i=1;i<v.length;i++)param.exponentialRampToValueAtTime(Math.max(v[i][1],1),t+v[i][0])};
  const shape=(p,t,g,dur,a,hold)=>{a=Math.min(a==null?.004:a,dur*.9);hold=Math.min(hold||0,dur-a);p.setValueAtTime(0,t);p.linearRampToValueAtTime(g,t+a);if(hold>0)p.setValueAtTime(g,t+a+hold);p.exponentialRampToValueAtTime(TINY,t+dur);p.setValueAtTime(0,t+dur+.001)};
  const out=(node,p)=>{const pan=ctx.createStereoPanner();pan.pan.value=clamp(p.pan||0,-1,1);node.connect(pan);pan.connect(bus[p.bus||'sfx']);if(p.verb){const s=ctx.createGain();s.gain.value=p.verb;pan.connect(s);s.connect(p.bus==='music'?vinM:vin)}};
  const skip=(time,dur)=>at(time)+dur<ctx.currentTime||(time<T0-.001&&dur<1.5);
  function tone(time,p){const t=at(time),dur=p.dur||.2;if(skip(time,dur))return;const o=ctx.createOscillator();o.type=p.type||'sine';sweep(o.frequency,p.f||440,t);const g=ctx.createGain();shape(g.gain,t,p.gain==null?.3:p.gain,dur,p.a,p.hold);
    let node=o;if(p.filter){const f=ctx.createBiquadFilter();f.type=p.filter;f.Q.value=p.q==null?.8:p.q;sweep(f.frequency,p.f2||2000,t);o.connect(f);node=f}node.connect(g);out(g,p);o.start(t);o.stop(t+dur+.02)}
  function noise(time,p){const t=at(time),dur=p.dur||.2;if(skip(time,dur))return;const s=ctx.createBufferSource();s.buffer=NB[p.color||'white'];s.loop=true;const g=ctx.createGain();shape(g.gain,t,p.gain==null?.3:p.gain,dur,p.a,p.hold);
    if(p.filter){const f=ctx.createBiquadFilter();f.type=p.filter;f.Q.value=p.q==null?1:p.q;sweep(f.frequency,p.f==null?1000:p.f,t);s.connect(f);f.connect(g)}else s.connect(g);out(g,p);s.start(t,(time*7.31)%2);s.stop(t+dur+.02)}
  const S={
    key:(t,o={})=>{const r=rng(Math.round(t*1000));noise(t,{dur:.025,filter:'bandpass',f:2600+r()*1200,q:2,gain:.25*(o.g||1),a:.001,pan:o.pan});tone(t,{f:160+r()*40,dur:.04,gain:.12*(o.g||1),pan:o.pan})},
    tick:(t,o={})=>noise(t,{dur:.018,filter:'bandpass',f:o.f||4200,q:2.5,gain:.3*(o.g||1),pan:o.pan}),
    click:(t,o={})=>{tone(t,{f:o.f||1900,type:'square',dur:.02,gain:.07*(o.g||1),filter:'lowpass',f2:3000});noise(t,{dur:.01,filter:'highpass',f:2500,gain:.14*(o.g||1)})},
    thud:(t,o={})=>{tone(t,{f:[[0,o.f||130],[.16,42]],dur:.26,gain:.55*(o.g||1),pan:o.pan});noise(t,{dur:.09,color:'brown',filter:'lowpass',f:500,gain:.35*(o.g||1),pan:o.pan})},
    impact:(t,o={})=>{S.thud(t,o);noise(t,{dur:.9,color:'pink',filter:'lowpass',f:[[0,2400],[.7,260]],gain:.3*(o.g||1),verb:.4})},
    whoosh:(t,o={})=>{const d=o.dur||.45;noise(t,{dur:d,color:'pink',filter:'bandpass',f:[[0,350],[d*.55,o.top||2600],[d,700]],q:.9,gain:.32*(o.g||1),a:d*.5,pan:o.pan,verb:.15})},
    riser:(t,o={})=>{const d=o.dur||.8;noise(t,{dur:d,color:'pink',filter:'bandpass',f:[[0,300],[d,4000]],q:1.2,gain:.25*(o.g||1),a:d*.95,hold:0,verb:.2});tone(t,{f:[[0,180],[d,720]],type:'triangle',dur:d,gain:.05*(o.g||1),a:d*.9})},
    /* paper: a page turning or a sheet picked up: a run of short band-passed grains with a soft swell underneath (not a tick) */
    paper:(t,o={})=>{const d=o.dur||.38,r=rng(Math.round(t*997));for(let x=0;x<d;x+=.022+r()*.028)noise(t+x,{dur:.05,filter:'bandpass',f:1100+r()*2800,q:.9,gain:.12*(o.g||1)*(1-x/d*.5),pan:o.pan});
      noise(t,{dur:d*1.1,color:'pink',filter:'bandpass',f:[[0,700],[d*.6,1900]],q:.7,gain:.14*(o.g||1),a:d*.35,pan:o.pan})},
    slide:(t,o={})=>{const d=o.dur||.25;noise(t,{dur:d,color:'pink',filter:'lowpass',f:[[0,420],[d,1100]],q:.7,gain:.22*(o.g||1),a:d*.35,pan:o.pan})},
    put:(t,o={})=>{noise(t,{dur:.07,color:'brown',filter:'lowpass',f:650,gain:.32*(o.g||1),a:.002,pan:o.pan});tone(t,{f:[[0,150],[.07,70]],dur:.09,gain:.1*(o.g||1),pan:o.pan});noise(t+.004,{dur:.018,filter:'bandpass',f:1700,q:.9,gain:.07*(o.g||1),pan:o.pan})},
    tear:(t,o={})=>{noise(t,{dur:.03,filter:'bandpass',f:1500,q:1,gain:.2*(o.g||1),a:.001,pan:o.pan});noise(t,{dur:.22,filter:'bandpass',f:[[0,900],[.22,2200]],q:1.8,gain:.22*(o.g||1),a:.02,pan:o.pan})},
    stroke:(t,o={})=>{const d=o.dur||.4,r=rng(Math.round(t*991)),M={marker:[2900,2.2,.16,.05],sharpie:[2400,1.4,.2,.045],pen:[4200,1.6,.08,.06]}[o.material||'marker'];
      noise(t,{dur:.024,filter:'bandpass',f:1400,q:1.2,gain:.22*(o.g||1),a:.001,pan:o.pan});for(let x=0;x<d;x+=M[3]*(.7+r()*.6)){const gd=M[3]*(.8+r()*.9);noise(t+x,{dur:gd,filter:'bandpass',f:M[0]*(.8+r()*.4),q:M[1],gain:M[2]*(o.g||1)*(.6+r()*.5),a:gd*.3,pan:o.pan})}},
    ding:(t,o={})=>{tone(t,{f:o.f||1318.5,dur:1.3,gain:.2*(o.g||1),verb:.3,pan:o.pan});tone(t,{f:(o.f||1318.5)*2.76,dur:.5,gain:.05*(o.g||1),verb:.3})},
  };
  /* ney: breathy reed flute: triangle+sine body, pitched breath noise, glides between notes, vibrato that arrives late */
  function ney(ph,o={}){const tEnd=ph[ph.length-1][0]+ph[ph.length-1][2];if(tEnd<T0||at(tEnd)<ctx.currentTime)return;const G0=o.gain||.08;
    const os=ctx.createOscillator();os.type='triangle';const o2=ctx.createOscillator();o2.type='sine';const lfo=ctx.createOscillator();lfo.frequency.value=5.2;const lg=ctx.createGain();lg.gain.value=0;lfo.connect(lg);lg.connect(os.frequency);lg.connect(o2.frequency);
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=o.bright||2400;const g=ctx.createGain();g.gain.value=0;os.connect(lp);o2.connect(lp);lp.connect(g);
    const nz=ctx.createBufferSource();nz.buffer=NB.pink;nz.loop=true;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=6;const gb=ctx.createGain();gb.gain.value=0;nz.connect(bp);bp.connect(gb);
    out(g,{bus:'music',verb:o.verb??.6,pan:o.pan});out(gb,{bus:'music',verb:.5,pan:o.pan});
    ph.forEach(([t,f,d,gn],i)=>{const a=at(t),G=G0*(gn||1);
      if(i===0){[os.frequency,o2.frequency,bp.frequency].forEach(p=>p.setValueAtTime(f,a))}else{const gl=Math.min(.16,d*.3);[os.frequency,o2.frequency,bp.frequency].forEach(p=>{p.setValueAtTime(ph[i-1][1],a);p.exponentialRampToValueAtTime(f,a+gl)})}
      g.gain.setTargetAtTime(G,a,.1);gb.gain.setTargetAtTime(G*.7,a,.03);gb.gain.setTargetAtTime(G*.2,a+.16,.18);lg.gain.setTargetAtTime(0,a,.02);lg.gain.setTargetAtTime(f*.011,a+d*.4,.25)});
    const e=at(tEnd);g.gain.setTargetAtTime(0,e,o.hard?.008:.22);gb.gain.setTargetAtTime(0,e,o.hard?.008:.14);[os,o2,lfo,nz].forEach(x=>{x.start(at(ph[0][0]));x.stop(e+1.6)})}
  /* daf: the Sufi frame drum, a deep 'dum', a dry 'tek' and its ring of jingles */
  function jingles(t,g){const r=rng(Math.round(t*1013));for(let i=0;i<6;i++)noise(t+i*.006+r()*.01,{dur:.05+r()*.06,filter:'highpass',f:6500+r()*3500,gain:.05*g,bus:'music',pan:(r()-.5)*.6})}
  function daf(t,kind,g=1,pan=0){if(kind==='dum'){tone(t,{f:[[0,94],[.2,50]],dur:.5,gain:.6*g,bus:'music',verb:.22,pan});noise(t,{dur:.12,color:'brown',filter:'lowpass',f:380,gain:.45*g,bus:'music',pan});noise(t,{dur:.04,filter:'bandpass',f:900,q:1,gain:.14*g,bus:'music',pan});jingles(t,g*.6)}
    else{noise(t,{dur:.05,filter:'bandpass',f:2800,q:1.4,gain:.28*g,bus:'music',verb:.15,pan});jingles(t,g)}}
  /* tanpura-like drone: detuned saws through a slowly breathing low-pass */
  function drone(t0,t1,fs,cut,g=1){const d=t1-t0;fs.forEach((f,i)=>[-4,4].forEach(dt=>tone(t0,{f:f*Math.pow(2,dt/1200),type:'sawtooth',dur:d,gain:(i?.022:.034)*g,a:Math.min(1.2,d*.3),hold:d-Math.min(1.2,d*.3)-.02,filter:'lowpass',f2:cut,q:1.3,bus:'music',verb:.25,pan:(i-1)*.3+dt/20})))}
  /* breath choir: saw voices through 'ah' formants */
  function choir(t0,t1,fs,g=1,hard){if(t1<T0)return;const d=t1-t0,a0=at(t0);fs.forEach((f,i)=>{const os=ctx.createOscillator();os.type='sawtooth';os.frequency.value=f;os.detune.value=(i%2?6:-6);
    const f1=ctx.createBiquadFilter();f1.type='bandpass';f1.frequency.value=730;f1.Q.value=5;const f2=ctx.createBiquadFilter();f2.type='bandpass';f2.frequency.value=1100;f2.Q.value=7;const gg=ctx.createGain();gg.gain.value=0;
    os.connect(f1);os.connect(f2);f1.connect(gg);f2.connect(gg);gg.gain.setValueAtTime(0,a0);gg.gain.linearRampToValueAtTime(.05*g,a0+Math.min(1.6,d*.45));gg.gain.setValueAtTime(.05*g,at(t1)-(hard?.02:.5));gg.gain.linearRampToValueAtTime(0,at(t1));
    out(gg,{bus:'music',verb:.65,pan:(i-(fs.length-1)/2)*.35});os.start(a0);os.stop(at(t1)+.05)})}
  /* cut every musical sound dead (bus and its reverb tail), then reopen */
  function cut(t,reopen){const a=at(t);for(const p of [bus.music.gain,voutM.gain,vinM.gain]){const v=p===bus.music.gain?.5:1;p.setValueAtTime(v,a-.012);p.linearRampToValueAtTime(0,a);if(reopen){p.setValueAtTime(0,at(reopen));p.linearRampToValueAtTime(v,at(reopen)+.02)}}}
  /* setWarp(false): times are already in the re-timed plan (the scene-built score); hand-written cue sheets and plan cues keep the warp */
  return{tone,noise,play:(n,t,o)=>S[n](t,o||{}),bus,ney,daf,drone,choir,cut,setWarp:on=>{useW=on}}}
/* the score: same times as the picture */
const KEYT=Array.from({length:60},()=>13+R0()*5.5).sort((a,b)=>a-b);
function score(k){const P=(n,t,o)=>k.play(n,t,o);
  /* --- SG MIND MATRIX theme: a Sufi tension score. Ney in Hijaz on D (D Eb F# G A Bb C), daf trance rhythm, tanpura drone,
     breath choir, a D/Eb dissonance that never resolves, and silence used as an instrument. Original, owned, reusable. --- */
  const D2=73.42,A2=110,D3=146.83,Eb3=155.56,A3=220,D4=293.66,Eb4=311.13,Fs4=369.99,G4=392,A4=440,Bb4=466.16,C5=523.25,D5=587.33,Eb5=622.25,A5=880,Bb5=932.33;
  /* 0 · the dark: room tone, a heartbeat, someone breathing into the ney */
  k.noise(0,{dur:PRESS+.05,color:'brown',filter:'lowpass',f:260,gain:.1,a:.2,hold:PRESS-.3,bus:'amb'});
  [.18,.46,.86].forEach((x,i)=>k.tone(x,{f:[[0,60],[.2,40]],dur:.3,gain:i===1?.42:.6,bus:'music'}));
  k.noise(.5,{dur:.62,color:'pink',filter:'bandpass',f:[[0,700],[.6,1700]],q:.8,gain:.12,a:.58,hold:0,bus:'music'});
  /* ENTER: the room wakes, drone opens, the drum answers */
  P('key',PRESS,{g:1.6});P('impact',PRESS,{f:70,g:1});k.daf(PRESS+.02,'dum',1.1);
  [1.35,1.5,1.65].forEach((x,i)=>P('click',x,{f:2200+i*200,g:.7}));
  k.drone(PRESS,27.48,[D2,A2,D3],520,1);
  k.choir(1.3,5.2,[D3,A3],.8);
  k.ney([[1.75,A4,1.5,1],[3.25,G4,1.5,.9]],{gain:.075,pan:.15});
  P('whoosh',1.95,{dur:.95,top:1400,g:.45});
  /* THEN · a descending Hijaz line under the paper sounds */
  P('whoosh',5.5,{dur:.9,top:1800,g:.4});P('put',O3+.02,{g:.7});
  k.ney([[6.6,C5,.55,.9],[7.15,Bb4,.5,.85],[7.65,A4,1.15,1],[8.85,G4,.5,.8],[9.35,Fs4,.6,.95],[9.95,Eb4,1.25,1.1],[11.25,D4,1.6,1]],{gain:.06,pan:-.15});
  const c=x=>O3+x;
  P('tear',c(.05),{g:.6,pan:-.5});P('tear',c(.12),{g:.55,pan:.5});P('slide',c(.25),{dur:.3,g:.9,pan:.2});P('put',c(.25+3/12),{g:.5,pan:.2});P('paper',c(1.1),{dur:.25,g:.6,pan:.1});
  k.noise(c(1.45),{dur:.6,color:'brown',filter:'bandpass',f:[[0,300],[.6,700]],q:1.4,gain:.3,a:.06,pan:.1});P('slide',c(1.5),{dur:.5,g:.8});
  P('paper',c(2.1),{dur:.4,g:.7});P('put',c(2.9),{g:1.1});P('paper',c(3.0),{dur:.42,g:.9});P('put',c(3.0+1/12),{g:.9,pan:-.2});P('stroke',c(3.15),{material:'sharpie',dur:.45,g:.5,pan:-.2});
  [3.6,4.0,4.4].forEach(x=>P('paper',c(x),{dur:.4,g:1}));P('put',c(4.4+1/12),{g:.8,pan:.4});P('put',c(4.6+1/12),{g:.9,pan:.4});P('stroke',c(4.95),{material:'marker',dur:.75,g:1.1,pan:.4});
  for(let x=c(5.0);x<12.95;x+=.5)P('tick',x,{f:2800,g:.45,pan:.4});
  /* NOW · the daf enters (6/8: dum . tek dum tek .) and builds */
  P('key',13.0,{g:1.3});k.daf(13.0,'dum',.5);KEYT.filter(x=>x<18.6).forEach(x=>P('key',x,{g:.75}));P('key',18.9,{g:1.4});P('ding',19.5,{f:1046.5,g:.3});
  const E8=.2,PAT=['dum',0,'tek','dum','tek',0];
  for(let t=13.6,i=0;t<27.45;t+=E8,i++){const kind=PAT[i%6];if(!kind)continue;const u=(t-13.6)/13.8;k.daf(t,kind,.28+.62*u*u,(i%2?.15:-.15))}
  /* NEXT · rising dissonance, then silence, then the cry */
  P('whoosh',22.2,{dur:1.1,top:1200,g:.3});P('whoosh',26.7,{dur:1.2,top:2200,g:.4});
  [[D3,0],[Eb3,0],[A2,0]].forEach(([f])=>k.tone(23.4,{f,type:'triangle',dur:4.08,gain:.05,a:3.9,hold:.15,bus:'music',verb:.3,filter:'lowpass',f2:1800}));
  k.choir(24.4,27.48,[D4,Eb4],.9,true);
  k.cut(27.48,28.0);
  P('impact',28.0,{f:80,g:1.2});k.daf(28.0,'dum',1.3);
  k.drone(28.0,43.38,[D2,A2,D3],900,1);
  k.choir(28.0,31.0,[D3,A3,D4,Fs4],1);
  k.ney([[28.1,A4,.4,1],[28.5,Bb4,.5,1.2],[29.0,A4,1.3,1]],{gain:.09,bright:3200});
  /* DOCUMENT · a steady pulse under the build log, ney answers each card */
  P('click',30.6,{g:.8});for(let i=0;i<24;i++)P('key',31.2+i*.066,{g:.45});
  for(let t=30.4,i=0;t<39.2;t+=E8,i++){const kind=PAT[i%6];if(kind)k.daf(t,kind,.42,(i%2?.15:-.15))}
  k.ney([[33.0,D5,.75,.9],[33.75,C5,.5,.8],[34.25,A4,1.4,1],[36.0,Fs4,.55,.9],[36.55,G4,.55,.9],[37.1,A4,1.7,1]],{gain:.06});
  CARDS.forEach(([a],i)=>{P('slide',a-.05,{dur:.2,g:.55,pan:-.4+i*.4});P('put',a+.12,{g:.85,pan:-.4+i*.4})});P('put',37.05,{g:.6});
  P('whoosh',38.4,{dur:1.0,top:900,g:.55});
  /* THE DARK BEFORE THE MARK · heartbeat, a breath, the line */
  [39.6,39.9,40.25].forEach((x,i)=>k.tone(x,{f:[[0,60],[.2,40]],dur:.3,gain:i===1?.4:.55,bus:'music'}));
  k.noise(40.1,{dur:.55,color:'pink',filter:'bandpass',f:[[0,700],[.5,1700]],q:.8,gain:.1,a:.5,hold:0,bus:'music'});
  k.tone(40.65,{f:[[0,2400],[.3,2000]],dur:.35,gain:.03,verb:.3});
  /* THE MARK · boom, drum, choir in Hijaz colour */
  P('impact',41.0,{f:65,g:1.35});k.daf(41.0,'dum',1.3);P('thud',41.25,{f:60,g:.35});
  k.choir(41.0,43.4,[D3,A3,D4,Eb4],1.1,true);
  /* THE WORLD IS BEING REWRITTEN · the drum accelerates, the ney climbs, the cluster tightens, then nothing */
  P('riser',41.9,{dur:1.5,g:.8});
  {let t=41.9,step=.22;while(t<43.36){k.daf(t,'tek',.4+.8*(t-41.9)/1.5);t+=step;step=Math.max(.045,step*.86)}}
  k.ney([[41.9,D5,.9,.8],[42.8,Eb5,.6,1.15]],{gain:.08,bright:3600,hard:true});
  [[D3],[Eb3]].forEach(([f])=>k.tone(41.9,{f,type:'sawtooth',dur:1.5,gain:.03,a:1.45,hold:.03,bus:'music',filter:'lowpass',f2:2400}));
  k.cut(BLACKOUT,44.9);
  P('key',BLACKOUT,{g:1.8});P('thud',BLACKOUT,{f:90,g:.5});
  P('click',44.0,{f:3000,g:.5});P('click',44.1,{f:3200,g:.4});for(let i=0;i<28;i++)P('key',44.15+i*.8/28,{g:.45});
  /* the whisper: one last breath on the ney */
  k.tone(45.0,{f:[[0,60],[1,38]],dur:1.6,gain:.18,verb:.2});
  k.ney([[45.0,D4,.95,1]],{gain:.05});
}

/* ================= the Sufi tension score for any plan ("score": "sufi_tension") =================
   Same palette as EP000 (ney in Hijaz on D, daf 6/8, tanpura drone, breath choir, D/Eb dissonance, silence as the hit).
   Each scene type brings its EP000 sounds on its own clock (c = EP000 clock -> plan time), kept to the scene's window;
   the beds (drones, opening choir + ney, the daf pulse that builds through NOW, the dead stops) follow the plan's anchors. */
const HZ={D2:73.42,A2:110,D3:146.83,Eb3:155.56,A3:220,D4:293.66,Eb4:311.13,Fs4:369.99,G4:392,A4:440,Bb4:466.16,C5:523.25,D5:587.33,Eb5:622.25};
const PAT6=['dum',0,'tek','dum','tek',0],EIGHTH=.2;
const N=(c,ph)=>ph.map(([t,f,d,g])=>[c(t),f,d,g]);
const SCENE_SOUND={
  enter_in_dark:(k,P,c)=>{k.noise(c(0),{dur:PRESS+.05,color:'brown',filter:'lowpass',f:260,gain:.1,a:.2,hold:PRESS-.3,bus:'amb'});
    [.18,.46,.86].forEach((x,i)=>k.tone(c(x),{f:[[0,60],[.2,40]],dur:.3,gain:i===1?.42:.6,bus:'music'}));
    k.noise(c(.5),{dur:.62,color:'pink',filter:'bandpass',f:[[0,700],[.6,1700]],q:.8,gain:.12,a:.58,hold:0,bus:'music'});
    P('key',c(PRESS),{g:1.6});P('impact',c(PRESS),{f:70,g:1});k.daf(c(PRESS+.02),'dum',1.1);[1.35,1.5,1.65].forEach((x,i)=>P('click',c(x),{f:2200+i*200,g:.7}))},
  studio_reveal:(k,P,c)=>P('whoosh',c(1.95),{dur:.95,top:1400,g:.45}),
  push_screen:(k,P,c)=>{P('whoosh',c(5.5),{dur:.9,top:1800,g:.4});P('put',c(O3+.02),{g:.7})},
  collage_library:(k,P,c,end)=>{const o=x=>c(O3+x);
    k.ney(N(c,[[6.6,HZ.C5,.55,.9],[7.15,HZ.Bb4,.5,.85],[7.65,HZ.A4,1.15,1],[8.85,HZ.G4,.5,.8],[9.35,HZ.Fs4,.6,.95],[9.95,HZ.Eb4,1.25,1.1],[11.25,HZ.D4,1.6,1]]).filter(n=>n[0]<end-.3),{gain:.06,pan:-.15});
    P('tear',o(.05),{g:.6,pan:-.5});P('tear',o(.12),{g:.55,pan:.5});P('slide',o(.25),{dur:.3,g:.9,pan:.2});P('put',o(.25+3/12),{g:.5,pan:.2});P('paper',o(1.1),{dur:.25,g:.6,pan:.1});
    k.noise(o(1.45),{dur:.6,color:'brown',filter:'bandpass',f:[[0,300],[.6,700]],q:1.4,gain:.3,a:.06,pan:.1});P('slide',o(1.5),{dur:.5,g:.8});
    P('paper',o(2.1),{dur:.4,g:.7});P('put',o(2.9),{g:1.1});P('paper',o(3.0),{dur:.42,g:.9});P('put',o(3.0+1/12),{g:.9,pan:-.2});P('stroke',o(3.15),{material:'sharpie',dur:.45,g:.5,pan:-.2});
    [3.6,4.0,4.4].forEach(x=>P('paper',o(x),{dur:.4,g:1}));P('put',o(4.4+1/12),{g:.8,pan:.4});P('put',o(4.6+1/12),{g:.9,pan:.4});P('stroke',o(4.95),{material:'marker',dur:.75,g:1.1,pan:.4});
    for(let x=o(5.0);x<end-.05;x+=.5)P('tick',x,{f:2800,g:.45,pan:.4})},
  type_hands:(k,P,c,end)=>{P('key',c(13.0),{g:1.3});k.daf(c(13.0),'dum',.5);KEYT.forEach(x=>{if(c(x)<end)P('key',c(x),{g:.75})})},
  ots_screen:(k,P,c,end,start)=>{KEYT.filter(x=>x<18.6).forEach(x=>{if(c(x)>=start)P('key',c(x),{g:.75})});P('key',c(18.9),{g:1.4});P('ding',c(19.5),{f:1046.5,g:.3})},
  /* the turn to NEXT: whoosh, then a rising D/Eb/A cluster and the D-Eb choir that run until the dead stop before the hit */
  look_right:(k,P,c,end,start,A)=>{P('whoosh',c(22.2),{dur:1.1,top:1200,g:.3});const t1=A.cut??end;
    const t0=Math.min(c(23.4),t1-1.2);[[HZ.D3],[HZ.Eb3],[HZ.A2]].forEach(([f])=>k.tone(t0,{f,type:'triangle',dur:t1-t0,gain:.05,a:(t1-t0)*.95,hold:.05,bus:'music',verb:.3,filter:'lowpass',f2:1800}));
    k.choir(Math.min(c(24.4),t1-.9),t1,[HZ.D4,HZ.Eb4],.9,true)},
  /* NEXT: silence, then the hit (cut 0.52 s before it, as in EP000) */
  field_push:(k,P,c,end)=>{P('whoosh',c(27.6)-.9,{dur:1.0,top:2200,g:.4});k.cut(c(27.48),c(28.0));
    P('impact',c(28.0),{f:80,g:1.2});k.daf(c(28.0),'dum',1.3);k.choir(c(28.0),Math.min(c(31.0),end+.5),[HZ.D3,HZ.A3,HZ.D4,HZ.Fs4],1);
    k.ney(N(c,[[28.1,HZ.A4,.4,1],[28.5,HZ.Bb4,.5,1.2],[29.0,HZ.A4,1.3,1]]),{gain:.09,bright:3200})},
  build_log:(k,P,c,end)=>{P('click',c(30.6),{g:.8});for(let i=0;i<24;i++)P('key',c(31.2+i*.066),{g:.45});
    for(let t=c(30.4),i=0;t<Math.min(c(39.2),end);t+=EIGHTH,i++){const kind=PAT6[i%6];if(kind)k.daf(t,kind,.42,(i%2?.15:-.15))}
    k.ney(N(c,[[33.0,HZ.D5,.75,.9],[33.75,HZ.C5,.5,.8],[34.25,HZ.A4,1.4,1],[36.0,HZ.Fs4,.55,.9],[36.55,HZ.G4,.55,.9],[37.1,HZ.A4,1.7,1]]).filter(n=>n[0]<end-.3),{gain:.06});
    CARDS.forEach(([a],i)=>{P('slide',c(a-.05),{dur:.2,g:.55,pan:-.4+i*.4});P('put',c(a+.12),{g:.85,pan:-.4+i*.4})});P('put',c(37.05),{g:.6});P('whoosh',c(38.4),{dur:1.0,top:900,g:.55})},
  end_push_dark:(k,P,c)=>{[39.6,39.9,40.25].forEach((x,i)=>k.tone(c(x),{f:[[0,60],[.2,40]],dur:.3,gain:i===1?.4:.55,bus:'music'}));
    k.noise(c(40.1),{dur:.55,color:'pink',filter:'bandpass',f:[[0,700],[.5,1700]],q:.8,gain:.1,a:.5,hold:0,bus:'music'})},
  /* the mark: boom, drum, choir; then the drum accelerates and the cluster tightens until the blackout cuts everything */
  logo_from_dark:(k,P,c,end,start,A)=>{const B=A.blackout;k.tone(c(40.65),{f:[[0,2400],[.3,2000]],dur:.35,gain:.03,verb:.3});
    P('impact',c(41.0),{f:65,g:1.35});k.daf(c(41.0),'dum',1.3);P('thud',c(41.25),{f:60,g:.35});k.choir(c(41.0),B,[HZ.D3,HZ.A3,HZ.D4,HZ.Eb4],1.1,true);
    const r0=Math.min(c(41.9),B-.8),rd=B-r0;P('riser',r0,{dur:rd,g:.8});
    {let t=r0,step=.22;while(t<B-.04){k.daf(t,'tek',.4+.8*(t-r0)/rd);t+=step;step=Math.max(.045,step*.86)}}
    k.ney([[r0,HZ.D5,rd*.6,.8],[r0+rd*.6,HZ.Eb5,rd*.4,1.15]],{gain:.08,bright:3600,hard:true});
    [[HZ.D3],[HZ.Eb3]].forEach(([f])=>k.tone(r0,{f,type:'sawtooth',dur:rd,gain:.03,a:rd*.97,hold:.03,bus:'music',filter:'lowpass',f2:2400}))},
  blackout_tease:(k,P,c,end,start)=>{k.cut(start,c(44.9));P('key',start,{g:1.8});P('thud',start,{f:90,g:.5});
    P('click',c(44.0),{f:3000,g:.5});P('click',c(44.1),{f:3200,g:.4});for(let i=0;i<28;i++)P('key',c(44.15)+i*.8/28,{g:.45});
    k.tone(c(45.0),{f:[[0,60],[1,38]],dur:1.6,gain:.18,verb:.2});k.ney([[c(45.0),HZ.D4,.95,1]],{gain:.05})},
};
/* a kit that only plays what starts inside [a, b) (cuts always pass) */
const inWindow=(k,a,b)=>{const ok=t=>t>=a-.05&&t<b;return{...k,play:(n,t,o)=>{if(ok(t))k.play(n,t,o)},tone:(t,p)=>{if(ok(t))k.tone(t,p)},noise:(t,p)=>{if(ok(t))k.noise(t,p)},
  daf:(t,...r)=>{if(ok(t))k.daf(t,...r)},ney:(ph,o)=>{if(ph.length&&ok(ph[0][0]))k.ney(ph,o)},choir:(t0,...r)=>{if(ok(t0))k.choir(t0,...r)},drone:(t0,...r)=>{if(ok(t0))k.drone(t0,...r)}}};
function sufiTension(k,plan,scenes){
  const D=plan.duration,find=ty=>scenes.find(s=>s.type===ty),clock=s=>x=>{if(!s.map)return x-s.off;const {P,S,K}=s.map;let i=S.length-1;while(i>0&&x<S[i])i--;return P[i]+(x-S[i])/K[i]};   // scene time -> plan time (inverse of the stretch)
  const hook=find('enter_in_dark'),field=find('field_push'),logo=find('logo_from_dark'),tease=find('blackout_tease');
  const press=hook?clock(hook)(PRESS):0,hit=field?clock(field)(28.0):null;
  const A={press,hit,cut:hit!=null?hit-.52:null,logoHit:logo?clock(logo)(41.0):null,blackout:tease?tease.a:logo?clock(logo)(BLACKOUT):D};
  for(const s of scenes){const f=SCENE_SOUND[s.type]||(TYPES[s.type]||{}).sound;if(!f)continue;const kk=inWindow(k,s.a,s.b);f(kk,(n,t,o)=>kk.play(n,t,o),clock(s),s.b,s.a,A)}
  /* beds: drone from the Enter press to the dead stop (or the mark), a brighter drone from the hit to the blackout */
  /* "bed": "light" (talking formats: the voice runs most of the video): two steady pure drone notes (no detuned saws = no wobble), daf without the deep dum */
  const light=plan.bed==='light';
  const drone=(t0,t1,cut)=>{if(t1-t0<.3)return;if(!light){k.drone(t0,t1,[HZ.D2,HZ.A2,HZ.D3],cut,1);return}
    const d=t1-t0,a=Math.min(1.5,d*.3);[[HZ.D3,.05],[HZ.A3,.03]].forEach(([f,g])=>k.tone(t0,{f,type:'sine',dur:d,gain:g,a,hold:d-a-.4,bus:'music',verb:.35}))};
  const d1=A.cut??(A.logoHit!=null?A.logoHit-.4:A.blackout);drone(press,d1,520);
  if(hit!=null)drone(hit,A.blackout-.02,900);
  /* opening: breath choir and two ney notes, until the first act (THEN) takes over */
  const then=find('collage_library')||find('build_log')||find('ots_screen')||scenes[1],open=then?Math.min(then.a,press+4.05):press+4.05;
  if(open-press>1.2){k.choir(press+.15,open,[HZ.D3,HZ.A3],.8);k.ney([[press+.6,HZ.A4,Math.min(1.5,open-press-.7),1]].concat(open-press>3.6?[[press+2.1,HZ.G4,1.5,.9]]:[]),{gain:.075,pan:.15})}
  /* NOW: the daf enters (dum . tek dum tek .) and builds until the dead stop / the mark */
  const now=scenes.find(s=>['type_hands','ots_screen'].includes(s.type)||/^manim_|_now_/.test(s.type)),end=A.cut??(A.logoHit!=null?A.logoHit-.5:A.blackout-.5);
  if(now&&end-now.a>1.5){const t0=now.a+.6,span=end-t0;for(let t=t0,i=0;t<end-.02;t+=EIGHTH,i++){const kind=PAT6[i%6];if(!kind||(light&&kind==='dum'))continue;const u=(t-t0)/span;k.daf(t,kind,.28+.62*u*u,(i%2?.15:-.15))}}
}

/* ================= scene types =================
   at    = the type's canonical start (its EP000 time); the scene clock is at + (t - plan start)
   trail = motion-blur windows on that clock (used by frame()) */
const TYPES={};
const ST=(name,at,trail,fn)=>TYPES[name]={at,trail,fn};
ST('enter_in_dark',0,[],(ctx,t)=>{const st=roomState(t),pull=seg(t,1.95,2.25);studioBlur(ctx,{x:1000,y:1500,z:.52},st,t,16);
   const lit=ss(seg(t,PRESS,PRESS+.22)),k=(1+.08*ss(seg(t,0,2.2)))*(1-.12*oc(pull)),P=KB_HOOK,E=kproj(P,ENTER_C[0],ENTER_C[1],.34);
   const reach=ss(seg(t,.55,.95)),pr=t<PRESS-.08?0:t<PRESS?(t-(PRESS-.08))/.08:t<1.45?1:Math.max(0,1-(t-1.45)/.12);
   const press={};press[keyAt(13.6,2.5)]=pr;const dy=900*(1-oc(seg(t,0,.75)))+1100*ic(seg(t,1.55,2.1));
   ctx.save();ctx.translate(E.x,E.y);ctx.scale(k,k);ctx.translate(-E.x,-E.y);keyboard(ctx,P,lit,press);
   const H0=handAt(P,lerp(9.5,13.6,reach),2.0,1);hand(ctx,H0.x,H0.y+dy+pr*.12*H0.s,H0.s*1.05,{side:1,ext:[1,0,0,0],curl:[0,1,1,1],rot:-.06,light:lit});ctx.restore();
   const dark=t<PRESS?.8:.8*(1-ss(seg(t,PRESS,PRESS+.2)));ctx.fillStyle=`rgba(0,0,0,${dark})`;ctx.fillRect(0,0,1080,1920);
   if(t<PRESS){ctx.save();ctx.translate(E.x,E.y);ctx.scale(k,k);ctx.translate(-E.x,-E.y);const p=kproj(P,12.75+.25,2.5,.2);ctx.fillStyle='rgba(0,230,118,.6)';ctx.font=`600 ${.25*p.s}px ${MONO}`;ctx.textBaseline='middle';ctx.fillText('Enter',p.x,p.y);ctx.textBaseline='alphabetic';ctx.restore()}});
ST('studio_reveal',1.95,[[1.95,3.3,.42]],(ctx,t)=>studioBlur(ctx,revealCam(t),roomState(t),t,10*(1-ss(seg(t,1.95,2.8)))));
ST('push_screen',5.0,[[5.5,6.6,.42]],(ctx,t)=>studio(ctx,pushCam(t),{...roomState(9),left:{m:'then',a:1,tc:0}},t));
ST('collage_library',6.35,[],(ctx,t)=>collage(ctx,{x:0,y:0,w:1080,h:1920},Math.max(0,t-O3)));
ST('type_hands',13,[[15.1,15.8,.3]],(ctx,t)=>{studioBlur(ctx,{x:1000,y:900,z:.8},{...S_LIT,typing:true},t,14);const lift=ss(seg(t,15.0,15.7));
   ctx.save();ctx.translate(540,1920);ctx.scale(1-.15*lift,1-.15*lift);ctx.translate(-540,-1920+lift*260);
   const P={cx:540,yb:1020,yf:1370,wb:960,wf:1020},phs=(o)=>[0,1,2,3].map(i=>Math.pow(Math.max(0,Math.sin(t*7+i*1.9+o)),6));const pl=phs(2.3),pr2=phs(0);
   const press={};"FDSA".split('').forEach((c,i)=>{const k=KL.findIndex(q=>q.l===c);if(pl[i]>.05)press[k]=pl[i]});"JKL;".split('').forEach((c,i)=>{const k=KL.findIndex(q=>q.l===c);if(pr2[i]>.05)press[k]=pr2[i]});
   keyboard(ctx,P,1,press);const A=handAt(P,5.25,2,-1),B=handAt(P,8.25,2,1);hand(ctx,A.x,A.y,A.s*1.05,{side:-1,ph:pl.map(v=>-v),rot:.08,light:1});hand(ctx,B.x,B.y,B.s*1.05,{side:1,ph:pr2.map(v=>-v),rot:-.08,light:1});ctx.restore()});
ST('ots_screen',15.4,[],(ctx,t)=>studio(ctx,otsCam(t),{...S_LIT,typing:t<18.8},t));
ST('look_right',22,[[22,25,.25],[26.6,28.1,.45]],(ctx,t)=>studio(ctx,nextCam(t),{...S_LIT,typing:t<23.0,ht:ss(seg(t,22.8,24.6)),headDy:-12*ss(seg(t,24.4,26))},t));
ST('field_push',27.6,[],(ctx,t)=>{const cv2=io(seg(t,28.0,29.6));flow(ctx,FULLFLOW(),t,cv2,ss(seg(t,27.9,28.6)),ss(seg(t,27.9,28.5)));forms3d(ctx,t,cv2,ss(seg(t,27.8,28.5)));
   if(t>27.5&&t<28.05){ctx.fillStyle=`rgba(5,8,7,${.18*Math.sin(Math.PI*seg(t,27.5,28.05))})`;ctx.fillRect(0,0,1080,1920)}});
ST('build_log',29.9,[[29.9,39.3,.22]],(ctx,t)=>{const p=(t-29.9)/9.4;studio(ctx,{x:lerp(860,1140,ss(p)),y:1080,z:1.0+.05*p},{...S_LIT,typing:true,kbHide:true},t);
   builder(ctx,t);
   const mm=seg(t,37.4,39.3);if(mm>0){const e=ss(mm),mx=lerp(1200,-60,e),my=lerp(1000,-80,e*e),mh=lerp(1100,2100,e*e);const g=ctx.createLinearGradient(0,my,0,my+mh);g.addColorStop(0,'#3A423F');g.addColorStop(.06,'#262D2B');g.addColorStop(1,'#121715');ctx.fillStyle=g;rr(ctx,mx,my,1500,mh,70);ctx.fill();ctx.fillStyle='rgba(242,245,243,.85)';ell(ctx,mx+120,my+300,9,9);ctx.fill()}});
ST('end_push_dark',39.3,[[39.3,39.6,.3],[40.0,40.75,.4]],(ctx,t)=>{const off=ss(seg(t,39.9,40.3));const st={room:1,led:1-.6*off,kb:1-.6*off,left:{m:'word',txt:'THEN',col:C.amber,a:1,m2:'off',a2:off},top:{m:'word',txt:'NOW',col:C.white,a:1,m2:'off',a2:off},right:{m:'word',txt:'NEXT',col:C.green,a:1,m2:'off',a2:off}};
   studio(ctx,endCam(t),st,t);const w=seg(t,39.3,39.6);if(w<1){const mx=lerp(-60,-1700,oc(w));ctx.fillStyle='#1E2523';rr(ctx,mx,-80,1500,2100,70);ctx.fill()}
   const dk=ss(seg(t,40.3,40.7));if(dk>0){ctx.fillStyle=`rgba(5,8,7,${dk})`;ctx.fillRect(0,0,1080,1920)}});
ST('logo_from_dark',40.6,[],(ctx,t)=>logoScene(ctx,t));
ST('blackout_tease',BLACKOUT,[],(ctx,t)=>{ctx.fillStyle='#000';ctx.fillRect(0,0,1080,1920);
   const fl=t<44.0?0:t<44.06?.6:t<44.1?.15:t<44.2?.8:1;if(fl>0){ctx.globalAlpha=fl;const txt=TX.tease||'NEW EPISODE · EVERY SATURDAY',n=Math.floor(txt.length*seg(t,44.15,44.95));ctx.font=`700 44px ${MONO}`;ctx.textBaseline='middle';
     const full=ctx.measureText(txt).width,x0=540-full/2;ctx.fillStyle=C.white;ctx.fillText(txt.slice(0,n),x0,900);const cw=ctx.measureText(txt.slice(0,n)).width;
     if(t<45.0||Math.floor(t*2.2)%2===0){ctx.fillStyle=C.green;ctx.fillRect(x0+cw+6,876,22,48)}ctx.textBaseline='alphabetic';ctx.globalAlpha=1}
   if(t>45.85){ctx.fillStyle=`rgba(0,0,0,${seg(t,45.85,46)})`;ctx.fillRect(0,0,1080,1920)}});

/* scene types from style modules (08_templates/styles/<style>/*.js, loaded before this file): {name: {at, trail, draw(ctx, t, text)}} */
for(const [name,s] of Object.entries(window.SGMM_STYLE_SCENES||{})){ST(name,s.at||0,s.trail||[],(ctx,t)=>s.draw(ctx,t,TX));TYPES[name].sound=s.sound}

/* ================= captions + act tags (from the plan) ================= */
const ACTCOL={THEN:C.amber,NOW:C.white,NEXT:C.green};
/* "is already [being written.]" -> brackets are the one green element; \n breaks the line */
const capParts=s=>s.split(/(\[[^\]]*\])/).filter(Boolean).map(x=>x[0]==='['?[x.slice(1,-1),C.green]:[x,C.white]);
function drawActTag(ctx,t,TAGS){for(const [a,b,num,lab,col] of TAGS){if(t<a||t>b)continue;const inn=ss(seg(t,a,a+.45)),al=Math.min(inn,1-ss(seg(t,b-.35,b)));ctx.save();ctx.globalAlpha=al;const x=72,y=330;
  ctx.fillStyle=col;ell(ctx,x+18,y,18*inn,18*inn);ctx.fill();ctx.beginPath();ctx.rect(x+48,y-34,360*inn,68);ctx.clip();ctx.fillStyle='rgba(5,8,7,.55)';ctx.fillRect(x+48,y-30,360,60);
  ctx.font=`500 26px ${MONO}`;ctx.fillStyle=C.fog;ctx.textBaseline='middle';ctx.fillText(num,x+62,y+1);ctx.font=`700 38px ${MONO}`;ctx.fillStyle=col;ctx.fillText(lab,x+112,y+2);ctx.restore()}}
function drawCaps(ctx,t,CAPS){for(const [a,b,parts] of CAPS){if(t<a||t>b)continue;const inn=ss(seg(t,a,a+.2)),al=Math.min(inn,1-ss(seg(t,b-.2,b)));ctx.save();ctx.globalAlpha=al;ctx.font=`500 44px ${MONO}`;ctx.textBaseline='middle';
  const lines=[[]];for(const [txt,col] of parts){txt.split('\n').forEach((sg,i)=>{if(i>0)lines.push([]);if(sg)lines[lines.length-1].push([sg,col])})}
  lines.forEach((ln,li)=>{const w=ln.reduce((s,[x])=>s+ctx.measureText(x).width,0);let x=540-w/2;const y=1440+li*60+(1-inn)*14;ctx.fillStyle='rgba(5,8,7,.62)';ctx.fillRect(x-16,y-30,w+32,60);for(const [txt,col] of ln){ctx.fillStyle=col;ctx.fillText(txt,x,y);x+=ctx.measureText(txt).width}});ctx.restore()}}

/* ================= a plan -> a playable episode ================= */
function load(plan){
  const scenes=plan.scenes.map(s=>{const ty=TYPES[s.type];if(!ty)throw new Error(`unknown scene type "${s.type}" (have: ${Object.keys(TYPES).join(', ')})`);
    const [a,b]=s.t,off=ty.at-a;return{type:s.type,a,b,off,hold:s.hold||[],fn:ty.fn,tx:{...plan.text,...s.text},trail:ty.trail.map(([x,y,k])=>[x-off,y-off,k])}});
  const CAPS=(plan.captions||[]).map(c=>[c.t[0],c.t[1],capParts(c.text)]);
  const TAGS=(plan.act_tags||[]).map(g=>[g.t[0],g.t[1],g.num,g.label,ACTCOL[g.label]||C.white]);
  const TRAIL=scenes.flatMap(s=>s.trail),DUR=plan.duration;
  const trailK=t=>{for(const [a,b,k] of TRAIL){if(t>=a&&t<b)return k*Math.min(seg(t,a,a+.15),1-seg(t,b-.15,b))}return 0};
  /* hold: [[T, dt]] from sgmm build (time inserted for a long voice line). The scene never freezes: from T to the next hold (or its end)
     its own animation runs slower so it fills the extra dt — every move, and its sound, stays on the picture (Samrat: no dead stretches) */
  scenes.forEach(s=>{const H=[...s.hold].sort((x,y)=>x[0]-y[0]),P=[s.a],S=[s.a+s.off],K=[1];
    H.forEach(([T,dt],i)=>{P.push(T);S.push(S[S.length-1]+(T-P[P.length-2])*K[K.length-1]);const nx=i+1<H.length?H[i+1][0]:s.b,Lp=nx-T,Ls=Math.max(.1,Lp-dt);K.push(Ls/Lp)});s.map={P,S,K}});
  const local=(s,t)=>{const {P,S,K}=s.map;let i=P.length-1;while(i>0&&t<P[i])i--;return S[i]+(t-P[i])*K[i]};
  /* a held picture never freezes: a slow push-in while the hold runs, kept afterwards (no jump) */
  const draw=(c,s,t)=>{TX=s.tx;c.save();s.fn(c,local(s,t));c.restore()};
  function render(ctx,W,H,t,caps=true){const S=W/1080;ctx.setTransform(S,0,0,H/1920,0,0);ctx.globalAlpha=1;ctx.filter='none';ctx.globalCompositeOperation='source-over';ctx.fillStyle=C.void;ctx.fillRect(0,0,1080,1920);
    const act=scenes.filter(s=>t>=s.a&&t<s.b);
    act.forEach((s,i)=>{if(i===0){draw(ctx,s,t);return}const al=ss(seg(t,s.a,act[i-1].b));const oc2=offFor(W,H),o=oc2.getContext('2d');o.setTransform(S,0,0,H/1920,0,0);o.globalAlpha=1;o.filter='none';o.fillStyle=C.void;o.fillRect(0,0,1080,1920);draw(o,s,t);
      ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=al;ctx.drawImage(oc2,0,0);ctx.restore()});
    ctx.setTransform(S,0,0,H/1920,0,0);if(caps){drawActTag(ctx,t,TAGS);drawCaps(ctx,t,CAPS)}}
  const cv=layer(1080,1920),ctx=cv.getContext('2d');
  return{render,trailK,
    /* one 1080x1920 frame as JPEG data-URL, with EP000's 4-sample motion blur inside trail windows */
    frame:(t,caps=true,type='image/jpeg')=>{const k=trailK(t),n=k>0?4:1,sh=1/120;
      if(n===1)render(ctx,1080,1920,t,caps);else{const tmp=offFor(1080,1921),tc=tmp.getContext('2d');ctx.setTransform(1,0,0,1,0,0);
        for(let i=0;i<n;i++){const ti=Math.max(0,t-sh*(i/(n-1))*(k/.45));render(tc,1080,1920,ti,false);ctx.globalAlpha=1/(i+1);ctx.drawImage(tmp,0,0)}ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);if(caps){drawActTag(ctx,t,TAGS);drawCaps(ctx,t,CAPS)}}
      return cv.toDataURL(type,.96)},
    /* the score as 16-bit stereo 48 kHz WAV (base64); mute = 'music' | 'sfx' for stems */
    audio:async(mute)=>{const sc=plan.score==null?()=>{}:SCORES[plan.score];if(!sc)throw new Error(`unknown score "${plan.score}"`);const sr=48000,off=new OfflineAudioContext(2,sr*DUR,sr);
    /* warp: [[t, +seconds],...] from sgmm build when the real voice needed more time; the cue sheet's times move with the picture */
    const WP=plan.warp||[],warp=t=>{let d=0;for(const [p,dt] of WP)if(t>=p)d+=dt;return t+d};
    const kk=makeKit(off,0,mute,WP.length?warp:null);if(sc===sufiTension)kk.setWarp(false);sc(kk,plan,scenes);kk.setWarp(true);
    /* cues from the plan: {"t":28,"cue":"impact","g":1.2} (one-shots: key tick click thud impact whoosh riser paper slide put tear stroke ding) | {"cue":"daf","kind":"dum"} | {"cue":"cut","reopen":28} */
    for(const {t,cue,...o} of plan.cues||[]){if(cue==='daf')kk.daf(t,o.kind||'dum',o.g??1,o.pan||0);else if(cue==='cut')kk.cut(t,o.reopen);else kk.play(cue,t,o)}const buf=await off.startRendering();
    const L=buf.getChannelData(0),R=buf.getChannelData(1),N=L.length;let pk=0;for(let i=0;i<N;i++)pk=Math.max(pk,Math.abs(L[i]),Math.abs(R[i]));const g=mute?1:(pk>0?.891/pk:1);
    const ab=new ArrayBuffer(44+N*4),v=new DataView(ab),ws=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
    ws(0,'RIFF');v.setUint32(4,36+N*4,true);ws(8,'WAVE');ws(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,sr,true);v.setUint32(28,sr*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);ws(36,'data');v.setUint32(40,N*4,true);
    let o=44;for(let i=0;i<N;i++){v.setInt16(o,Math.round(clamp(L[i]*g,-1,1)*32767),true);v.setInt16(o+2,Math.round(clamp(R[i]*g,-1,1)*32767),true);o+=4}
    const u=new Uint8Array(ab);let bin='';for(let i=0;i<u.length;i+=32768)bin+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return{b64:btoa(bin),peak:pk}}};
}
/* named scores (hand-written cue sheets); a plan adds its own `cues` on top, or uses "score": null for cues only */
const SCORES={sufi_tension_ep000:score,sufi_tension:sufiTension};
return{load,types:Object.keys(TYPES)};
})();
