(function(){
const cv=document.getElementById('cv'),c=cv.getContext('2d');
const ME=window.ME={kinds:{},nv:{title:3,number:2,chart:2,list:2,quote:1},c:c,vw:1280,vh:720,u:1,st:null,scenes:[],TOT:0};
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const eo=x=>1-Math.pow(1-cl(x),4);
const eio=x=>{x=cl(x);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
const ob=x=>{x=cl(x);const k=ME.st?ME.st.k:1.9;return 1+(k+1)*Math.pow(x-1,3)+k*Math.pow(x-1,2)};
const seg=(t,a,d)=>cl((t-a)/d);
Object.assign(ME,{cl,eo,eio,ob,seg});
const FF='"Noto Sans Myanmar","Poppins",sans-serif';
ME.FF=FF;
const MY='၀၁၂၃၄၅၆၇၈၉';
const toEn=s=>String(s).replace(/[၀-၉]/g,x=>MY.indexOf(x));
const toMy=s=>String(s).replace(/[0-9]/g,x=>MY[+x]);
ME.parseNum=function(s){if(!s)return null;const raw=String(s),en=toEn(raw),m=en.match(/[0-9][0-9,]*\.?[0-9]*/);if(!m)return null;const ns=m[0].replace(/,/g,''),val=parseFloat(ns);if(isNaN(val))return null;return{val,dec:(ns.split('.')[1]||'').length,pre:en.slice(0,m.index),suf:en.slice(m.index+m[0].length),my:/[၀-၉]/.test(raw)}};
ME.fmtNum=function(n,x){let s=(n.val*x).toFixed(n.dec);if(n.my)s=toMy(s);return n.pre+s+n.suf};
function rng(seed){let a=seed>>>0;return function(){a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const PAL=[
{n:'sky',b1:'#f6f7fa',b2:'#e6e9ef',ink:'#14161c',ac:'#1f6fe5',ac2:'#0d3f9a',card:'#ffffff',dark:0},
{n:'night',b1:'#16181f',b2:'#07080b',ink:'#ffffff',ac:'#ff4d4d',ac2:'#ff9f1a',card:'#23262f',dark:1},
{n:'mint',b1:'#effaf5',b2:'#d5f0e4',ink:'#0f2a22',ac:'#12b886',ac2:'#0b7a5a',card:'#ffffff',dark:0},
{n:'sunset',b1:'#fff4ec',b2:'#ffd9c2',ink:'#2b1408',ac:'#ff6b35',ac2:'#c2410c',card:'#ffffff',dark:0},
{n:'violet',b1:'#1b1030',b2:'#0b0618',ink:'#ffffff',ac:'#a78bfa',ac2:'#f472b6',card:'#2a1b4a',dark:1},
{n:'gold',b1:'#141414',b2:'#050505',ink:'#ffffff',ac:'#fbbf24',ac2:'#f59e0b',card:'#1f1f1f',dark:1},
{n:'rose',b1:'#fff0f3',b2:'#ffd6df',ink:'#2a0a14',ac:'#e11d48',ac2:'#9f1239',card:'#ffffff',dark:0},
{n:'ocean',b1:'#06222f',b2:'#031219',ink:'#ffffff',ac:'#22d3ee',ac2:'#3b82f6',card:'#0e3445',dark:1}];
ME.makeStyle=function(seed){const r=rng(seed),pick=a=>a[Math.floor(r()*a.length)];
return{seed:seed,pal:pick(PAL),bg:pick(['grad','dots','grid','blobs','stripes']),rad:16+Math.floor(r()*30),fw:pick([700,800,900]),trans:pick(['blur','slide','zoom','wipe','flip']),k:.9+r()*2.2,cam:pick(['push','pull','drift']),hard:r()<.3}};
ME.rr=function(x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)};
ME.shadow=function(b,y,col){const s=ME.st;if(s.hard){c.shadowColor=s.pal.dark?'rgba(255,255,255,.2)':'rgba(0,0,0,.85)';c.shadowBlur=0;c.shadowOffsetX=8*ME.u;c.shadowOffsetY=8*ME.u}else{c.shadowColor=col||(s.pal.dark?'rgba(0,0,0,.5)':'rgba(20,30,60,.18)');c.shadowBlur=b;c.shadowOffsetX=0;c.shadowOffsetY=y}};
ME.noShadow=function(){c.shadowColor='transparent';c.shadowBlur=0;c.shadowOffsetX=0;c.shadowOffsetY=0};
ME.blur=function(px){c.filter=px>.3?'blur('+px.toFixed(1)+'px)':'none'};
ME.txt=function(s,x,y,size,col,w,al){c.font=(w||ME.st.fw)+' '+Math.round(size*ME.u)+'px '+FF;c.fillStyle=col;c.textAlign=al||'center';c.textBaseline='middle';c.fillText(s,x,y)};
function gr(s){try{return Array.from(new Intl.Segmenter('my',{granularity:'grapheme'}).segment(s),x=>x.segment)}catch(e){return Array.from(s)}}
ME.layout=function(text,size,maxW,w){c.font=(w||ME.st.fw)+' '+Math.round(size*ME.u)+'px '+FF;
const sp=c.measureText(' ').width,lines=[];let cur=[],cw=0;
const push=()=>{if(cur.length){lines.push({w:cur,width:cw});cur=[];cw=0}};
String(text).split(/\s+/).filter(Boolean).forEach(tok=>{const tw=c.measureText(tok).width;
if(tw>maxW){push();let part='';gr(tok).forEach(g=>{if(part&&c.measureText(part+g).width>maxW){const pw=c.measureText(part).width;lines.push({w:[{t:part,w:pw}],width:pw});part=g}else part+=g});
if(part){const pw=c.measureText(part).width;cur=[{t:part,w:pw}];cw=pw}return}
if(cur.length&&cw+sp+tw>maxW)push();
cur.push({t:tok,w:tw});cw+=(cur.length>1?sp:0)+tw});
push();return{lines:lines,sp:sp,lh:size*ME.u*1.55}};
ME.para=function(s,x,y,size,col,maxW,a,dy,w){const L=ME.layout(s,size,maxW,w),n=L.lines.length;c.save();c.globalAlpha=a;
L.lines.forEach((ln,i)=>ME.txt(ln.w.map(q=>q.t).join(' '),x,y-(n-1)*L.lh/2+i*L.lh+dy,size,col,w,'center'));c.restore();return L};
function bg(T){const s=ME.st,p=s.pal,vw=ME.vw,vh=ME.vh,u=ME.u;
const g=c.createLinearGradient(0,0,0,vh);g.addColorStop(0,p.b1);g.addColorStop(1,p.b2);c.fillStyle=g;c.fillRect(0,0,vw,vh);
c.save();c.fillStyle=p.ac;c.strokeStyle=p.ac;c.globalAlpha=p.dark?.14:.09;
if(s.bg==='dots'){for(let x=24;x<vw;x+=56*u)for(let y=24;y<vh;y+=56*u){c.beginPath();c.arc(x,y,3*u,0,7);c.fill()}}
else if(s.bg==='grid'){c.lineWidth=1.5;for(let x=0;x<vw;x+=72*u){c.beginPath();c.moveTo(x,0);c.lineTo(x,vh);c.stroke()}for(let y=0;y<vh;y+=72*u){c.beginPath();c.moveTo(0,y);c.lineTo(vw,y);c.stroke()}}
else if(s.bg==='stripes'){c.lineWidth=20*u;const o=(T*20)%(100*u);for(let x=-vh+o;x<vw;x+=100*u){c.beginPath();c.moveTo(x,vh);c.lineTo(x+vh,0);c.stroke()}}
else if(s.bg==='blobs'){c.globalAlpha=1;for(let i=0;i<3;i++){const bx=vw*(.2+.3*i)+Math.sin(T*.5+i*2)*60*u,by=vh*(.3+.25*(i%2))+Math.cos(T*.4+i)*50*u,r=Math.max(vw,vh)*.35;const rg=c.createRadialGradient(bx,by,0,bx,by,r);rg.addColorStop(0,i%2?p.ac2:p.ac);rg.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=p.dark?.3:.2;c.fillStyle=rg;c.fillRect(0,0,vw,vh)}}
c.restore()}
/* ---------- kinds ---------- */
ME.kinds.title=function(t,sc,v){
const s=ME.st,p=s.pal,u=ME.u,vw=ME.vw,vh=ME.vh,size=v===1?76:68,L=ME.layout(sc.headline,size,vw*.84),n=L.lines.length,y0=vh/2-(n-1)*L.lh/2;let k=0;
if(v===2){const ll=L.lines[n-1],lw=ll.width+60*u,hp=eio(seg(t,.5+n*.2,.6));ME.rr(vw/2-lw/2,y0+(n-1)*L.lh-L.lh*.42,lw*hp,L.lh*.84,s.rad*u*.5);c.fillStyle=sc.col;c.globalAlpha=.92;c.fill();c.globalAlpha=1}
L.lines.forEach((ln,li)=>{let x=v===1?vw*.1:vw/2-ln.width/2;
ln.w.forEach(w=>{const pp=seg(t,.1+k*.14,.7),e=ob(pp),last=li===n-1;k++;
const col=(v===2&&last)?(p.dark?'#000':'#fff'):(last&&n>1)?sc.col:p.ink;
c.save();ME.blur((1-eo(pp))*14*u);c.globalAlpha=eo(pp*1.6);
const cx=x+w.w/2,cy=y0+li*L.lh;
if(v===1)c.translate(cx-(1-e)*160*u,cy);else c.translate(cx,cy+(1-e)*50*u);
const q=.75+.25*e;c.scale(q,q);ME.txt(w.t,0,0,size,col,null,'center');c.restore();x+=w.w+L.sp})});
if(v===1){const bp=eio(seg(t,0,.6));ME.rr(vw*.1-34*u,y0-L.lh*.5,10*u,n*L.lh*bp,5);c.fillStyle=sc.col;c.fill()}
};
ME.kinds.number=function(t,sc,v){
const s=ME.st,p=s.pal,u=ME.u,vw=ME.vw,vh=ME.vh,num=sc.num;
if(!num)return ME.kinds.title(t,sc,0);
const pe=ob(seg(t,0,.7)),a=eo(seg(t,0,.4)),cnt=eo(seg(t,.3,Math.min(2.5,(sc.e-sc.s)*.7)));
if(v===0){const cy=vh*.55,r=Math.min(vw*.3,190*u*1.15);
ME.para(sc.headline,vw/2,vh*.14,52,p.ink,vw*.84,a,(1-pe)*30*u);
c.save();c.globalAlpha=a;c.lineWidth=18*u;c.lineCap='round';
c.strokeStyle=p.ink;c.globalAlpha=.12*a;c.beginPath();c.arc(vw/2,cy,r,0,7);c.stroke();
c.strokeStyle=sc.col;c.globalAlpha=a;c.beginPath();c.arc(vw/2,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*cnt*.85);c.stroke();c.restore();
c.save();c.globalAlpha=a;c.translate(vw/2,cy);c.scale(.8+.2*pe,.8+.2*pe);ME.txt(ME.fmtNum(num,cnt),0,0,num.suf.length>4?78:120,sc.col,900,'center');c.restore()}
else{const w=vw*.82,h=330*u,x=vw/2-w/2,y=vh/2-h/2;
c.save();c.globalAlpha=a;c.translate(vw/2,vh/2);c.scale(.85+.15*pe,.85+.15*pe);c.translate(-vw/2,-vh/2);
ME.shadow(50,18);ME.rr(x,y,w,h,s.rad*u);c.fillStyle=p.card;c.fill();ME.noShadow();
ME.rr(x,y,14*u,h,7);c.fillStyle=sc.col;c.fill();
ME.txt(ME.fmtNum(num,cnt),vw/2,y+h*.4,num.suf.length>4?84:130,sc.col,900,'center');
ME.para(sc.headline,vw/2,y+h*.78,40,p.ink,w*.88,1,0);c.restore()}
};
ME.kinds.chart=function(t,sc,v){
const s=ME.st,p=s.pal,u=ME.u,vw=ME.vw,vh=ME.vh,down=sc.dir==='down',col=sc.col,a=eo(seg(t,0,.4)),pe=ob(seg(t,0,.7)),d=Math.max(.5,sc.e-sc.s);
ME.para(sc.headline,vw/2,vh*.16,54,p.ink,vw*.86,a,(1-pe)*30*u);
if(sc.num)ME.txt(ME.fmtNum(sc.num,eo(seg(t,.3,1.8))),vw/2,vh*.34,92,col,900,'center');
const x0=vw*.1,x1=vw*.9,y0=vh*.47,y1=vh*.9,n=v===0?24:9,pts=[];
for(let i=0;i<n;i++){const b=down?1-i/(n-1):i/(n-1),nz=(i>0&&i<n-1)?(Math.sin(i*7.3)*.5+Math.sin(i*2.1+1)*.5)*.08:0;pts.push(cl(b*.9+.05+nz))}
c.save();c.globalAlpha=a*.15;c.strokeStyle=p.ink;c.lineWidth=2;for(let k=0;k<4;k++){const y=y0+(y1-y0)*k/3;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke()}c.restore();
if(v===0){const P=pts.map((q,i)=>[x0+(x1-x0)*i/(n-1),y0+(1-q)*(y1-y0)]),prog=eo(seg(t,.4,Math.min(3,d*.8)))*(n-1),k=Math.floor(prog),fr=prog-k,dr=P.slice(0,k+1);
if(k<n-1)dr.push([P[k][0]+(P[k+1][0]-P[k][0])*fr,P[k][1]+(P[k+1][1]-P[k][1])*fr]);
c.save();c.globalAlpha=.25*a;c.fillStyle=col;c.beginPath();c.moveTo(dr[0][0],y1);dr.forEach(q=>c.lineTo(q[0],q[1]));c.lineTo(dr[dr.length-1][0],y1);c.closePath();c.fill();
c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=12*u;c.lineJoin='round';c.lineCap='round';c.beginPath();dr.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();
const e=dr[dr.length-1];c.fillStyle=col;c.beginPath();c.arc(e[0],e[1],16*u,0,7);c.fill();c.restore()}
else{const bw=(x1-x0)/n*.66,gap=(x1-x0)/n;
pts.forEach((q,i)=>{const pp=eo(seg(t,.4+i*.12,.7)),h=(y1-y0)*q*pp,x=x0+gap*i+(gap-bw)/2;
c.save();c.globalAlpha=a*(i===(down?n-1:n-1)?1:.55);ME.rr(x,y1-h,bw,h,Math.min(bw/2,s.rad*u*.6));c.fillStyle=col;c.fill();c.restore()})}
};
ME.kinds.list=function(t,sc,v){
const s=ME.st,p=s.pal,u=ME.u,vw=ME.vw,vh=ME.vh,items=(sc.items.length?sc.items:[sc.headline]).slice(0,5),a=eo(seg(t,0,.4)),pe=ob(seg(t,0,.7));
ME.para(sc.headline,vw/2,vh*.15,54,p.ink,vw*.86,a,(1-pe)*30*u);
const gap=(v===0?112:100)*u,y0=vh*.32;
items.forEach((it,i)=>{const q=ob(seg(t,.5+i*.35,.6)),qa=eo(seg(t,.5+i*.35,.4));if(q<=0)return;const y=y0+i*gap;
c.save();c.globalAlpha=qa;
if(v===0){const w=vw*.78,x=vw/2-w/2+(1-q)*120*u;ME.shadow(30,10);ME.rr(x,y,w,88*u,s.rad*u*.7);c.fillStyle=p.card;c.fill();ME.noShadow();
c.beginPath();c.arc(x+56*u,y+44*u,30*u,0,7);c.fillStyle=sc.col;c.fill();ME.txt(String(i+1),x+56*u,y+46*u,34,p.dark?'#000':'#fff',900,'center');
ME.txt(it,x+110*u,y+46*u,42,p.ink,null,'left')}
else{const x=vw*.12;ME.txt(String(i+1).padStart(2,'0'),x,y+40*u+(1-q)*30*u,56,sc.col,900,'left');ME.txt(it,x+120*u,y+40*u+(1-q)*30*u,46,p.ink,null,'left');
c.fillStyle=sc.col;c.globalAlpha=qa*.5;c.fillRect(x,y+84*u,(vw*.76)*eo(seg(t,.7+i*.35,.7)),4*u)}
c.restore()})
};
ME.kinds.quote=function(t,sc){
const s=ME.st,p=s.pal,u=ME.u,vw=ME.vw,vh=ME.vh,a=eo(seg(t,0,.5)),pe=ob(seg(t,0,.8));
c.save();c.globalAlpha=a*.5;ME.txt('“',vw/2,vh*.25+(1-pe)*40*u,260,sc.col,900,'center');c.restore();
ME.para(sc.headline,vw/2,vh*.56,62,p.ink,vw*.8,a,(1-pe)*40*u);
ME.rr(vw/2-60*u,vh*.82,120*u*eio(seg(t,.6,.6)),8*u,4);c.fillStyle=sc.col;c.fill()
};
/* ---------- runner ---------- */
const MOODC={negative:'#ef4444',positive:'#22c55e',urgent:'#f59e0b'};
ME.setup=function(o){const r=o.ratio||'16:9';
if(r==='9:16'){ME.vw=720;ME.vh=1280;ME.u=.62}else if(r==='1:1'){ME.vw=1000;ME.vh=1000;ME.u=.8}else{ME.vw=1280;ME.vh=720;ME.u=1}
cv.width=ME.vw;cv.height=ME.vh;
const st=ME.st=ME.makeStyle(o.seed||1);let tt=0;
ME.scenes=o.scenes.map((s,i)=>{const nv=ME.nv[s.kind]||1,start=s.start!=null?s.start:tt,end=s.end!=null?s.end:start+(s.d||3.5);tt=end;
const dir=s.dir||'down';
return{s:start,e:end,kind:ME.kinds[s.kind]?s.kind:'title',headline:s.headline||'',items:Array.isArray(s.items)?s.items:[],num:ME.parseNum(s.big_number),dir:dir,
col:MOODC[s.mood]||(s.kind==='chart'?(dir==='down'?'#ef4444':'#22c55e'):st.pal.ac),v:(st.seed+i*7)%nv,raw:s}});
ME.TOT=tt;return st};
ME.frame=function(T){const st=ME.st;if(!st||!ME.scenes.length)return;const vw=ME.vw,vh=ME.vh,S=ME.scenes;
let i=S.length-1;for(let k=0;k<S.length;k++)if(T<S[k].e){i=k;break}
const sc=S[i],t=Math.max(0,T-sc.s),d=Math.max(.5,sc.e-sc.s),left=sc.e-T,prog=cl(t/d);
c.filter='none';c.globalAlpha=1;ME.noShadow();bg(T);
const out=i===S.length-1?0:seg(.4-left,0,.4);
c.save();let z=1,tx=0;
if(st.cam==='push')z=1+.06*prog;else if(st.cam==='pull')z=1.07-.06*prog;else{z=1.03;tx=(prog-.5)*40}
c.translate(vw/2+tx,vh/2);c.scale(z,z);c.translate(-vw/2,-vh/2);
const tr=st.trans;
if(out>0){if(tr==='blur'){ME.blur(out*18);c.globalAlpha=1-out}
else if(tr==='slide'){c.translate(-vw*.5*eio(out),0);c.globalAlpha=1-out}
else if(tr==='zoom'){c.translate(vw/2,vh/2);c.scale(1+out*.5,1+out*.5);c.translate(-vw/2,-vh/2);c.globalAlpha=1-out;ME.blur(out*6)}
else if(tr==='wipe'){c.beginPath();c.rect(0,0,vw*(1-eio(out)),vh);c.clip()}
else{c.translate(vw/2,0);c.scale(Math.max(.01,1-out),1);c.translate(-vw/2,0);c.globalAlpha=1-out*.8}}
(ME.kinds[sc.kind]||ME.kinds.title)(t,sc,sc.v);
c.restore();c.filter='none';c.globalAlpha=1;ME.noShadow()};
})();
