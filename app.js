const periods = [
  {id:'jomon',name:'Jōmon',short:'JOMON',type:'POTTERY',color:'#1b5ec9'},
  {id:'yayoi',name:'Yayoi',short:'YAYOI',type:'BRONZE',color:'#24634b'},
  {id:'kofun',name:'Kofun',short:'KOFUN',type:'TOMB FIGURES',color:'#087d8c'},
  {id:'heian',name:'Heian',short:'HEIAN',type:'SCULPTURE',color:'#7c2682'},
  {id:'kamakura',name:'Kamakura',short:'KAMAKURA',type:'HANDSCROLL',color:'#24388f'},
  {id:'muromachi',name:'Muromachi',short:'MUROMACHI',type:'INK PAINTING',color:'#1d6b52'},
  {id:'momoyama',name:'Azuchi-Momoyama',short:'MOMOYAMA',type:'GOLD SCREENS',color:'#b84b14'},
  {id:'edo',name:'Edo',short:'EDO',type:'WOODBLOCK PRINT',color:'#b5182b'}
];
const $ = s => document.querySelector(s);
const grid = $('#period-grid');
periods.forEach((period,index)=>{
  const a=document.createElement('a'); a.className='era'; a.href=`#period/${period.id}`;
  a.style.setProperty('--tile',period.color);
  a.setAttribute('aria-label',`Explore ${period.name} — ${period.type.toLowerCase()}`);
  a.innerHTML=`<span class="era-meta"><span class="era-number">${String(index+1).padStart(2,'0')}</span>${period.type}</span><span class="era-title">${period.short}</span><span class="era-cta">OPEN <b aria-hidden="true">›</b></span>`;
  grid.append(a);
});

const media=matchMedia('(prefers-reduced-motion: reduce)');
let motion=!media.matches, tx=0,ty=0,px=0,py=0,frame=0;

function renderMotion(){
  px+=(tx-px)*.075; py+=(ty-py)*.075;
  document.documentElement.style.setProperty('--px',px.toFixed(4));
  document.documentElement.style.setProperty('--py',py.toFixed(4));
  if(Math.abs(tx-px)+Math.abs(ty-py)>.001) frame=requestAnimationFrame(renderMotion); else frame=0;
}
function setTarget(x,y){tx=x;ty=y;if(!frame) frame=requestAnimationFrame(renderMotion);}
$('#room').addEventListener('pointermove',e=>{
  if(!motion||media.matches||e.pointerType!=='mouse'||active||busy||looking||lookFrame)return;
  setTarget((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2);
});
$('#room').addEventListener('pointerleave',()=>{if(!active&&!looking&&!lookFrame&&!busy)setTarget(0,0);});
media.addEventListener('change',()=>{motion=!media.matches;if(!motion)setTarget(0,0);});

const music=$('#landing-audio');
music.volume=0;
let musicFade=0, musicStarting=false;
let musicWanted=!location.hash.startsWith('#period/');
const effects=Object.fromEntries(['mouse','loading'].map(name=>[name,$(`#sfx-${name}`)]));
const effectBuffers={}, effectSources={mouse:new Set(),loading:new Set()};
let soundContext=null;
try{soundContext=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});}catch{}
effects.loading.loop=true;
// Decode ahead of input, and skip quiet lead-in so the audible attack is immediate.
function soundStart(buffer){
  const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
  let peak=0;
  for(const channel of channels)for(let i=0;i<channel.length;i++)peak=Math.max(peak,Math.abs(channel[i]));
  const threshold=Math.max(.001,peak*.025);
  for(let i=0;i<buffer.length;i++){
    if(channels.some(channel=>Math.abs(channel[i])>=threshold))return Math.max(0,i/buffer.sampleRate-.003);
  }
  return 0;
}
if(soundContext)Object.entries(effects).forEach(async([name,audio])=>{
  try{
    const response=await fetch(audio.src);
    if(!response.ok)return;
    const buffer=await soundContext.decodeAudioData(await response.arrayBuffer());
    effectBuffers[name]={buffer,offset:soundStart(buffer)};
  }catch{ /* Local file URLs retain the preloaded HTML audio fallback. */ }
});
function unlockEffects(){
  if(soundContext?.state==='suspended')soundContext.resume().catch(()=>{});
}
function playEffect(name){
  // Each mouse press gets its own voice; never restart a click already playing.
  if(name==='loading')stopEffect(name);
  const clip=effectBuffers[name];
  if(soundContext&&clip){
    unlockEffects();
    const source=soundContext.createBufferSource();
    source.buffer=clip.buffer;source.loop=name==='loading';
    source.loopStart=clip.offset;source.loopEnd=clip.buffer.duration;
    source.connect(soundContext.destination);effectSources[name].add(source);
    source.onended=()=>{source.disconnect();effectSources[name].delete(source);};
    source.start(0,clip.offset);
    return;
  }
  const audio=effects[name].cloneNode();
  audio.loop=name==='loading';effectSources[name].add(audio);
  audio.onended=()=>effectSources[name].delete(audio);
  audio.play().then(()=>{if(!effectSources[name].has(audio))audio.pause();}).catch(()=>effectSources[name].delete(audio));
}
function stopEffect(name){
  for(const voice of effectSources[name]){
    if(typeof voice.stop==='function')voice.stop();else voice.pause();
  }
  effectSources[name].clear();
}
function stopEffects(){Object.keys(effects).forEach(stopEffect);}
document.addEventListener('pointerdown',e=>{
  unlockEffects();
  if(!onLanding()||busy||![0,1].includes(e.button))return;
  playEffect('mouse');
},true);
document.addEventListener('keydown',unlockEffects,true);
// Keyboard and assistive activation have no pointer-down event.
document.addEventListener('click',e=>{
  if(e.detail===0&&onLanding()&&!busy)playEffect('mouse');
},true);
function onLanding(){return !location.hash.startsWith('#period/')&&!document.body.classList.contains('zoom-active');}
function fadeMusicTo(target,duration){
  cancelAnimationFrame(musicFade);
  const from=music.volume,start=performance.now();
  const step=now=>{
    const progress=duration?Math.min(1,(now-start)/duration):1;
    const eased=progress*progress*(3-2*progress);
    music.volume=from+(target-from)*eased;
    if(progress<1)musicFade=requestAnimationFrame(step);
    else{musicFade=0;if(target===0)music.pause();}
  };
  step(start);
}
async function playMusic(){
  if(!musicWanted||musicStarting||!music.paused)return;
  musicStarting=true;
  try{
    await music.play();
    fadeMusicTo(musicWanted?1:0,650);
  }catch{ /* Retry on the next user gesture if autoplay was blocked. */ }
  finally{musicStarting=false;}
}
document.addEventListener('pointerdown',playMusic);
document.addEventListener('click',playMusic);
document.addEventListener('keydown',playMusic);
playMusic();

const screen=$('#screen'),socket=$('#socket'),stage=$('#zoom-stage'),selection=$('#selection'),portal=$('#portal');
const room=$('#room'),computer=$('.computer');
let active=null, busy=false, lastTrigger=null;
let looking=false, lookFrame=0, aimX=.5, aimY=.5, lookX=0, lookY=0;
const lookScale=2;
let currentScale=1, lookTween=null, lastLookTime=0;
function renderLook(now){
  const elapsed=lastLookTime?Math.min(64,now-lastLookTime):16;
  lastLookTime=now;
  if(lookTween){
    const progress=media.matches?1:Math.min(1,(now-lookTween.start)/1000);
    const eased=progress*progress*(3-2*progress);
    currentScale=lookTween.from+(lookTween.to-lookTween.from)*eased;
    if(progress===1)lookTween=null;
  }
  const targetX=-(currentScale-1)*aimX*innerWidth;
  const targetY=-(currentScale-1)*aimY*innerHeight;
  const ease=media.matches?1:1-Math.exp(-elapsed/80);
  lookX+=(targetX-lookX)*ease;lookY+=(targetY-lookY)*ease;
  room.style.transform=`translate(${lookX}px,${lookY}px) scale(${currentScale})`;
  lookFrame=lookTween||Math.abs(targetX-lookX)+Math.abs(targetY-lookY)>.1?requestAnimationFrame(renderLook):0;
  if(!lookFrame){lastLookTime=0;if(!looking)room.style.transform='';}
}
function easeLookTo(scale){
  lookTween={from:currentScale,to:scale,start:performance.now()};
  if(!lookFrame)lookFrame=requestAnimationFrame(renderLook);
}
function stopLook(immediate=false){
  looking=false;
  if(!immediate){easeLookTo(1);return;}
  cancelAnimationFrame(lookFrame);lookFrame=0;lookTween=null;lastLookTime=0;
  currentScale=1;lookX=0;lookY=0;room.style.transform='';
}
room.addEventListener('mousedown',e=>{
  if(e.button!==1)return;
  e.preventDefault();
  if(active||busy)return;
  if(looking){stopLook();return;}
  looking=true;aimX=e.clientX/innerWidth;aimY=e.clientY/innerHeight;
  if(frame)cancelAnimationFrame(frame);frame=0;tx=px;ty=py;
  easeLookTo(lookScale);
});
// Suppress both autoscroll and opening era links in another tab on middle-click.
room.addEventListener('auxclick',e=>{if(e.button===1)e.preventDefault();});
window.addEventListener('pointermove',e=>{
  if(!looking||active||busy||e.pointerType!=='mouse')return;
  aimX=Math.max(0,Math.min(1,e.clientX/innerWidth));aimY=Math.max(0,Math.min(1,e.clientY/innerHeight));
  if(!lookFrame)lookFrame=requestAnimationFrame(renderLook);
});
window.addEventListener('resize',()=>{if(looking&&!lookFrame)lookFrame=requestAnimationFrame(renderLook);});
async function openingDocument(period){
  const connection=$('#connection'),progress=$('#connection-progress'),percent=$('#connection-percent');
  $('#connection-name').textContent=`Opening ${period.name}...`;
  connection.hidden=false;percent.textContent='0%';
  playEffect('loading');
  const loadingClip=effectBuffers.loading;
  const clipDuration=loadingClip?loadingClip.buffer.duration-loadingClip.offset:effects.loading.duration;
  const duration=Number.isFinite(clipDuration)?Math.max(680,clipDuration*1000):2800;
  const animation=progress.animate([{width:'0%'},{width:'100%'}],{duration,easing:'steps(14,end)',fill:'forwards'});
  let progressFrame;
  const update=()=>{percent.textContent=`${Math.min(100,Math.round((animation.currentTime||0)/duration*100))}%`;if(animation.playState==='running')progressFrame=requestAnimationFrame(update);};
  update();await animation.finished;cancelAnimationFrame(progressFrame);percent.textContent='100%';
  stopEffect('loading');
  return ()=>{connection.hidden=true;animation.cancel();};
}
function fitComputer(){
  if(active||busy)return;
  // The base stays on the table; scale from there to fit the available viewport.
  const fit=Math.min(1,(innerHeight*.73)/computer.offsetHeight,(innerWidth-38)/computer.offsetWidth);
  computer.style.setProperty('--fit',String(fit));
}
new ResizeObserver(fitComputer).observe(computer);
window.addEventListener('resize',fitComputer);
fitComputer();
function cameraTarget(){
  const r=screen.getBoundingClientRect();
  const scale=Math.max(innerWidth/r.width,innerHeight/r.height)*1.04;
  const x=innerWidth/2-(r.x+r.width/2)*scale;
  const y=innerHeight/2-(r.y+r.height/2)*scale;
  return `translate(${x}px,${y}px) scale(${scale})`;
}
async function enter(period,animate=true){
  if(busy)return;
  if(active){updateSelection(period);return;}
  busy=true;lastTrigger=document.activeElement;active=period;
  const fromCamera=room.style.transform||'translate(0,0) scale(1)';
  stopLook(true);
  // Freeze parallax at its current position so the camera has a stable target.
  if(frame)cancelAnimationFrame(frame);frame=0;tx=px;ty=py;
  const camera=cameraTarget();
  document.body.classList.add('zoom-active');
  document.body.style.overflow='hidden';
  if(animate&&!media.matches){
    const finishOpening=await openingDocument(period);
    // Move the entire scene past the viewer. The webpage stays inside the CRT.
    finishOpening();
    musicWanted=false;fadeMusicTo(0,650);
    await room.animate([{transform:fromCamera},{transform:camera}],{duration:1350,easing:'cubic-bezier(.7,.03,.2,1)',fill:'forwards'}).finished;
    if(screen.classList.contains('crt-enabled'))await screen.animate([{filter:'brightness(1)'},{filter:'brightness(1.12) saturate(.7)'},{filter:'brightness(1)'}],{duration:180}).finished;
  }
  musicWanted=false;fadeMusicTo(0,0);
  socket.style.height=`${socket.offsetHeight}px`;
  portal.hidden=true;selection.hidden=false;updateSelection(period);
  stage.append(screen);stage.hidden=false;room.inert=true;
  if(animate&&!media.matches)await stage.animate([{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],{duration:380,easing:'steps(20,end)'}).finished;
  stopEffects();
  $('#return').focus({preventScroll:true});busy=false;
  syncRoute();
}
function updateSelection(period){active=period;selection.setAttribute('aria-label',`${period.name} page`);}
async function leave(){
  if(busy||!active)return;busy=true;
  room.getAnimations().forEach(a=>a.cancel());
  selection.hidden=true;portal.hidden=false;socket.append(screen);socket.style.height='';
  const camera=cameraTarget();stage.hidden=true;room.inert=false;
  musicWanted=true;playMusic();
  if(!media.matches){await room.animate([{transform:camera},{transform:'translate(0,0) scale(1)'}],{duration:850,easing:'cubic-bezier(.64,0,.24,1)'}).finished;}
  document.body.classList.remove('zoom-active');document.body.style.overflow='';active=null;busy=false;
  fitComputer();if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});
  syncRoute();
}
function syncRoute(initial=false){if(busy)return;const period=periods.find(p=>location.hash===`#period/${p.id}`);if(period){if(active?.id!==period.id)enter(period,!initial);}else if(active)leave();}
window.addEventListener('hashchange',()=>syncRoute());
function returnToRoom(){if(busy)return;const home=new URL(location.href);home.hash='';history.replaceState(null,'',home.href);leave();}
$('#return').addEventListener('click',returnToRoom);
const info=$('#info-window'),infoButton=$('#info-button');
function showInfo(show){info.hidden=!show;grid.hidden=show;infoButton.setAttribute('aria-expanded',String(show));$('#home-link').classList.toggle('current',!show);infoButton.classList.toggle('current',show);if(show)$('#info-title').focus({preventScroll:true});}
infoButton.addEventListener('click',()=>showInfo(info.hidden));
$('#info-close').addEventListener('click',()=>{showInfo(false);infoButton.focus();});
$('#home-link').addEventListener('click',()=>showInfo(false));
$('.wordmark').addEventListener('click',()=>showInfo(false));
$('.skip').addEventListener('click',()=>showInfo(false));
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(active)returnToRoom();else if(!info.hidden){showInfo(false);infoButton.focus();}else if(looking)stopLook();}});
syncRoute(true);
