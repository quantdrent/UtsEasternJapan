const MUSIC_TRACKS = {
  leiheng: 'assets/Audio/Music/leiheng.mp3',
  sukuna: 'assets/Audio/Music/Hiroaki Tsutsumi - Ryomen Sukuna.mp3',
  risingSun: 'assets/Audio/Music/Onimusha Warlords OST - (01) Rising Sun - 1st Movement.mp3',
  emma: 'assets/Audio/Music/Original Soundtrack - Emma the Physician  Sekiro™ Shadows Die Twice OST.mp3'
};
const periods = [
  {
    id:'jomon',music:MUSIC_TRACKS.leiheng,volume:0.40,name:'Jōmon',short:'JOMON',type:'DOGU FIGURINE',years:'Prehistoric, ending c. 300 BCE',
    sub:'Foraging and pottery',color:'#004de6',ink:[0.16,0.28,0.52],
    intro:[
      "Long before Emperors and written records, people lived in small tribal groups they relied on hunting, fishing and gathering. They made weapons such as bows and arrows to hunt safely with distance and fishing gears to catch fish and shellfishes. They’ve also developed some of the world's earliest known pottery to cook and boil foods, to store resources, and to do rituals, with the early signs of fertility rituals reflected in clay figurines called Dogu."
    ],
    image:'assets/artifacts/jomon-dogu.png',
    caption:'A goggle-eyed Shakōki Dogū figurine',
    outro:[
      "Dogū (土偶) are small clay figurines that were created during Japan’s Jōmon period, they usually depict human-like forms with unique shapes, detailed decorations, and sometimes large eyes. Made by shaping and firing clay, some were decorated with patterns and pigments. Although their exact purpose remains unknown, archaeologists believe that they may have been used in rituals related to fertility, childbirth, healing, prayer, and protection, as well as burial practices. One of the most famous examples is the Shakōki Dogū, known for its enormous, snow-goggle-like eyes. Their unusual appearance has led to many theories, that they represent extraterrestrials. However, there is no reliable evidence that Dogū depict aliens. Their actual meaning remains uncertain.",
      "This era is marked as the earliest known culture of Japan and the creation of the earliest pottery. This period continued on until the beginning of the Yaoi period when rice cultivation began."
    ],
    sources:[
      'https://jomon-japan.jp/en/learn/jomon-culture',
      'https://en.japantravel.com/guide/japan-history/71636',
      'https://www.daiyokai.com/en/post/dogu-jomon-figurines-mystery/'
    ]
  },
  {
    id:'yayoi',music:MUSIC_TRACKS.leiheng,volume:0.40,name:'Yayoi',short:'YAYOI',type:'BRONZE BELL',years:'c. 300 BCE – 250 CE',
    sub:'Rice farming and new hierarchies',color:'#00a63e',ink:[0.18,0.42,0.30],
    intro:[
      "The Yayoi period was a major transitional phase between the Jômon period that preceded it and the Kofun period that followed. Marked by profound changes and decisive advances, this era saw ancient Japan enter the metal age and adopt rice cultivation, paving the way for the emergence of classical Japanese civilization. Let's delve into the heart of this fascinating period to discover its key moments and main characteristics.",
      "Influences from southeastern China and Korea brought dotaku (bronze bells), iron weapons, and new agricultural techniques. The period is named after the Yayoi district in Tokyo, where its distinctive pottery style was first discovered in the 19th century."
    ],
    image:'assets/artifacts/yayoi-dotaku.png',
    caption:'Dôtaku (Bronze Bell)',
    outro:[
      "Produced during the late Yayoi period, the distinctive clapperless Japanese bronze bells known as dōtaku are thought to derive from earlier, smaller Korean examples that adorned horses and other domesticated animals. Dōtaku were buried, singly, in pairs, and in large groups occasionally with bronze mirrors and weapons in isolated locations, often on hilltops, perhaps to ensure a community’s agricultural fertility. Later dōtaku had relatively thin walls and would not have resonated, so it assumed their purpose was primarily ritual.",
      "The joint introduction of agriculture, metallurgy, a stratified society and the first states during the Yayoi period laid the foundations for classical Japanese civilization, which would flourish over the following centuries. Japanese history would never be the same after this decisive turning point. Thus, through the successful synthesis of continental influences and indigenous substratum, the Yayoi men laid the foundations of an original culture destined for tremendous influence. In many ways, the foundations of Japanese identity are rooted in the fertile crucible of this pivotal period. To return to Yayoi is to go back to the very roots of what makes Japanese civilization so unique and great."
    ],
    sources:[
      'https://en.japantravel.com/guide/japan-history/71636',
      'https://www.worldhistory.org/Yayoi_Period/',
      'https://www.metmuseum.org/art/collection/search/44831'
    ]
  },
  {
    id:'kofun',music:MUSIC_TRACKS.leiheng,volume:0.40,name:'Kofun',short:'KOFUN',type:'HANIWA FIGURE',years:'c. 250 – 538 CE',
    sub:'Tombs and Yamato authority',color:'#009fe8',ink:[0.17,0.38,0.50],
    intro:[
      "The Kofun period was known for its massive tomb mounds and the rise of the Yamato clan, this period is named after the style of burial mounds used durning this time. The tombs were filled with various objects such as wooden coffins, bronze mirrors and weapons reflecting the wealth and status of the deceased. Clay figures called haniwa, that depicts people, animals, and buildings, were placed around the tombs, possibly for protection or ritual purposes.",
      "During this period agriculture, ironworking, and pottery production also developed, while an increased contact with China and Korea brought new technologies, skilled immigrants, and cultural influences to Japan. Meanwhile, Shinto beliefs, centered on the worship of kami (gods or spirits), continued to develop from earlier Japanese traditions."
    ],
    image:'assets/artifacts/kofun-haniwa.png',
    caption:'Haniwa, from the kofun period',
    outro:[
      "Haniwa are hollow clay tomb sculptures produced between the third and sixth century. They were made to be plaed on the tombs to honor the life and achievements of the deceased. Haniwa represents various figures such as people, animals and buildings/houses.",
      "Dogū and Haniwa are both Japanese clay figures, but they belong to different periods and they served a different purpose. Dogū were created durning the Jōmon period, they’re usually small and they’re exact purpose remained uncertain, while Haniwa were produced durning the Kofun period and were placed on burial mounts as the status of the deceased. Although they both depicted people, animals and buildings, their different dates and forms shows their distinct roles in Japanese history.",
      "This era marked as a time of monumental tomb construction, technological progress, and growing political unity."
    ],
    sources:[
      'https://www.worldhistory.org/Kofun_Period/',
      'https://en.japantravel.com/guide/japan-history/71636',
      'https://www.daiyokai.com/en/post/dogu-jomon-figurines-mystery/'
    ]
  },
  {
    id:'heian',music:MUSIC_TRACKS.sukuna,volume:0.60,name:'Heian',short:'HEIAN',type:'WOOD STATUE',years:'794 – 1185 CE',
    sub:'Courtly literature and art',color:'#a30093',ink:[0.48,0.18,0.40],
    intro:[
      "The Heian era is known as the golden age of Japanese culture, it all began in 794 where Emperor Kanmu moved the capital from Nara to Heian-kyo (which would be known today as Kyoto) thus beginning the Heian Era. This movement was caused by the emperor wanting to distance himself from the influence of Nara’s Buddhist monestaries. Durning this period the Fujiwara family gained political influence while the imperial court developed an elegant aristocratic culture that valued poetry, calligraphy, music and art.",
      "Japanese literature flourished with the development of kana writing, producing famous works such as The Tale of Genji by Murasaki Shikibu. Art also developed through Yamato-e, a traditional Japanese painting style that depicted Japanese landscapes, seasonal scenery, court life, and stories from literature."
    ],
    image:'assets/artifacts/heian-fudo-myoo.jpg',
    caption:'Fudō Myōō (Achala Vidyaraja)',
    outro:[
      "Durning this period Buddhism also expanded through schools influencing Japanese art and spirituality. This is the wooden statue of Fudō Myōō, a fierce Buddhist protector also known as the “Immovable One.” He is depicted to be holding a sword to cut through ignorance and a lasso to restrain those who obstruct the path to enlightenment. Standing statues of Fudō Myōō began appearing in the eleventh century. This particular statue was carved from six hollowed-out wooden pieces and once served as the central sacred image at Kuhonji Temple, northwest of Kyoto.",
      "Toward the end of the period, imperial authority weakened and powerful warrior clans, especially the Taira and Minamoto, rose to prominence. The Minamoto victory in 1185 marked the end of the Heian period and the transition toward a samurai-led government period."
    ],
    sources:[
      'https://en.japantravel.com/guide/japan-history/71636',
      'https://www.japan-experience.com/plan-your-trip/to-know/japanese-history/heian-period',
      'https://www.metmuseum.org/essays/heian-period-794-1185'
    ]
  },
  {
    id:'kamakura',music:MUSIC_TRACKS.leiheng,volume:0.40,name:'Kamakura',short:'KAMAKURA',type:'SAMURAI ARMOR',years:'1185 – 1333 CE',
    sub:'Warrior government',color:'#1828d9',ink:[0.15,0.21,0.48],
    intro:[
      "The Kamakura period marked the beginning of military rule in Japan, as power shifted from the imperial court to the shogunate. After the Taira clan was defeated in the Genpei war (Battle of Dan-no-ura), Minamoto no Yoritomo established a new base of power and became Japan’s first warrior government (Shogun) in 1192.",
      "During this period, agriculture, trade, and local administration developed, while samurai became the dominant political and military class. Samurai culture emphasized loyalty, discipline, and martial skill, buddhism also expanded, with new forms such as Pure Land Buddhism, which focused on faith and salvation, and Zen Buddhism, which emphasized meditation and self-discipline. These beliefs influenced Japanese art, such as realistic Buddhist sculptures, ink painting, and the early development of aesthetics associated with wabi, a spiritual concept which values simplicity and restraint."
    ],
    image:'assets/artifacts/kamakura-yoroi.jpg',
    caption:'Armor (Yoroi) of Ashikaga Takauji (1305–1358)',
    outro:[
      "This rare medieval Japanese Yoroi (samurai armor) was designed mainly for warriors fighting on horseback and was used from around the 10th to the 14th century. Featuring a protective cuirass, a separate side panel, and a deep skirt, originally decorated with white silk and colorful lacings symbolizing the rainbow, good fortune, and the fleeting beauty of life. The breastplate displayed Fudō Myō-ō, a fierce Buddhist deity representing inner strength, calmness, and determination—qualities highly valued by samurai. Its associated helmet dates to the mid-14th century. According to tradition, the armor was donated to the Shinomura Hachimangū Shrine by Ashikaga Takauji, the founder of the Ashikaga shogunate. This armor illustrates the connection between samurai warfare, Buddhist beliefs, and Japanese craftsmanship during the medieval period.",
      "The Kamakura period was a major turning point in Japanese history, establishing warrior government and shaping the country’s military, religious, and cultural tradition. The decline of the Kamakura shogunate was caused partly by growing dissatisfaction among samurai, who were burdened by the costs of defending Japan against Mongol invasions and received little reward for their service. Emperor Go-Daigo took advantage of this discontent and attempted to restore imperial authority in 1324 and 1331 but failed and was exiled. Ashikaga Takauji turned against the emperor and established the Ashikaga Shogunate in 1338, marking the transition to the Muromachi period (1336–1573)."
    ],
    sources:[
      'https://www.metmuseum.org/essays/kamakura-and-nanbokucho-periods-1185-1392',
      'https://www.worldhistory.org/Kamakura_Period/',
      'https://en.japantravel.com/guide/japan-history/71636'
    ]
  },
  {
    id:'muromachi',music:MUSIC_TRACKS.leiheng,volume:0.40,name:'Muromachi',short:'MUROMACHI',type:'SWORD BLADE',years:'1392 – 1573 CE',
    sub:'Ashikaga rule and civil conflict',color:'#008a65',ink:[0.16,0.38,0.33],
    intro:[
      "The Muromachi period was an era of samurai ruled under the Ashikaga shogunate, spanned for nearly 2 centuries. Despite political rivalries and the devastating Onin War (1467) where regional warlords known as daimyo gained significant power, Japan had experienced economic growth and cultural development.",
      "Trade with Ming China began in 1401, and Zen Buddhism influenced education, government, and the arts. The Ashikaga shoguns supported traditional cultural practices such as the chanoyu tea ceremony, calligraphy, food presentations, renga poetry, and Noh theatre. Japanese ink painting also flourished, often combining Chinese-inspired landscapes with Zen-influenced simplicity. In 1549, Jesuit missionaries, including Francis Xavier, introduced Christianity and new Western influences to Japan."
    ],
    image:'assets/artifacts/muromachi-masazane.png',
    caption:'Swordsmith Blade inscribed by Masazane, dated 1526',
    outro:[
      "Masazane was one of the most important swordsmiths of the Sengo Muramasa School, active in the late Muromachi period in Ise (Mie prefecture in present day). Masazane was best known for creating Tonbogiri, a famous spear known as the “Dragonfly Cutter.” Made in 1526, this sword has a rare grain pattern called the ayasugihada pattern, a distinctive concentric grain traditionally associated with the Gasan School, it is the only known example of this pattern made by a swordsmith outside that school. The tang is inscribed on the front, FUJIWARA MASAZANE SAKU (Masazane made this), and on the reverse, DAIEI ROKUNEN HACHIGATSU JŪNINICHI (August 12, 1526). Preserved in excellent condition and bearing Masazane’s signature and date, the sword is an important artifact demonstrating the craftsmanship of the Muromachi period.",
      "Thisi period was an era of Japanese history ruled by the Ashikaga shogunate, characterized by political instability, regional warfare, and significant cultural development. It ended in 1573 when Oda Nobunaga (a powerful Japanese military leader who played a major role in the unification of Japan during the 16th century) captured Kyoto in 1568 and expelled the last Ashikaga shogun in 1573, ending the Muromachi period."
    ],
    sources:[
      'https://www.metmuseum.org/essays/muromachi-period-1392-1573',
      'https://en.japantravel.com/guide/japan-history/71636',
      'https://www.worldhistory.org/Oda_Nobunaga/',
      'https://www.worldhistory.org/Muromachi_Period/'
    ]
  },
  {
    id:'momoyama',music:MUSIC_TRACKS.risingSun,volume:0.70,name:'Azuchi-Momoyama',short:'MOMOYAMA',type:'SAMURAI HELMET',years:'1573 – 1603 CE',
    sub:'Political reunification',color:'#ff4400',ink:[0.62,0.27,0.14],
    intro:[
      "The Azuchi-Momoyama period was an era of military conflict and political unification in Japan. After the last Ashikaga shogunate was expelled, three major leaders helped bring the country together: Oda Nobunaga who captured Kyoto and ended Ashikaga rule, Toyotomi Hideyoshi who continued the unification process and Tokugawa Ieyasu who won the Battle of Sekigahara in 1600 and later established the Tokugawa shogunate. This period was named after the area near Kyoto where Hideyoshi built Fushimi Castle.",
      "Important events included the construction of Azuchi Castle in 1579 and the Battle of Nagashino in 1575. The period also saw cultural growth, known for its grand castles, lavish gold decorations, and bold paintings that reflected the wealth and power of the ruling warlords. In contrast, the tea ceremony promoted simplicity and natural beauty. International trade with China and Korea continued, while Portuguese and Dutch merchants and Catholic missionaries introduced new technologies, goods, and religious ideas. Hideyoshi also launched military invasions of Korea."
    ],
    image:'assets/artifacts/momoyama-kabuto.jpg',
    caption:'Helmet (Zukinnari Kabuto), Japanese 16th century',
    outro:[
      "A uniquely designed samurai helmet shaped like a sumi-zukin (角頭巾), a square hat commonly worn by elderly men, physicians, and priests. Its gold lacquer uses the tataki-nuri technique to imitate fabric, with red-and-gold decorations and brown-lacquered neck plates. The front crest depicts Fudō Myō-ō, a Buddhist protective deity surrounded by flames. The crest combines wooden and iron elements decorated with colorful lacquer. Dating to the Momoyama period (1573–1615), the helmet reflects the era’s luxurious artistic style, combining samurai armor, Buddhist symbolism, and elaborate craftsmanship.",
      "The Momoyama period was a turning point in Japanese history, with warfares and political unifications with significant developments in art, architecture, and culture. The period ended following a struggle for power after Toyotomi Hideyoshi died in 1598, leaving his young son, Hideyori, as his heir. In 1600, Tokugawa Ieyasu defeated forces supporting the Toyotomi family at the Battle of Sekigahara, becoming Japan’s dominant political and military leader. In 1603, he was appointed shogun and established the Tokugawa shogunate, marking the beginning of the Edo period (1603–1868)."
    ],
    sources:[
      'https://en.japantravel.com/guide/japan-history/71636',
      'https://www.metmuseum.org/essays/momoyama-period-1573-1615',
      'https://www.worldhistory.org/Azuchi-Momoyama_Period/'
    ]
  },
  {
    id:'edo',music:MUSIC_TRACKS.emma,volume:0.70,name:'Edo',short:'EDO',type:'BUNRAKU PUPPET',years:'1603 – 1868 CE',
    sub:'Tokugawa government',color:'#e60012',ink:[0.58,0.17,0.16],
    intro:[
      "The Edo period was a time of relative peace and cultural blossoming in Japan under the rule of the Tokugawa shogunate. Centered in Edo (modern-day Tokyo), this era saw the country largely closed off to the outside world, which encouraged the development of a unique and richly layered Japanese culture. A rigid social order was established, with samurai at the top, followed by farmers, artisans, and merchants. Despite these divisions, towns and cities grew rapidly, becoming centers of trade, administration, and the arts.",
      "Closely associated with this was the rise of two new forms of theatre: bunraku, which was a form of puppet theatre, and kabuki, which used actors. At this time the most famous playwright was a man called Chikamatsu Monzaemon (1653-1724), and through his plays we can gain an insight into what Japanese society was like at the time. Ihara Saikaku (1642-1693) wrote novels about the lives of the new urban class, and Matsuo Basho (1644-1694) developed haiku poetry into a refined art form. Hishikawa Moronobu (1618-94) vividly portrayed scenes from the 'floating world' in a new art form called ukiyo-e (pictures of the floating world)."
    ],
    image:'assets/artifacts/edo-bunraku.png',
    caption:'Bunraku puppet, Early 17th Century',
    outro:[
      "Bunraku is a traditional Japanese puppet theatre featuring large, intricately designed puppets operated by three puppeteers. It combines expressive puppet movements, narration by a tayū, and music played on a three-stringed shamisen. The puppeteers are often visible on stage. Bunraku portrays stories about love, sacrifice, loyalty, honor, and tragedy. Its plays often depict the struggles between personal feelings and social obligations, using detailed puppet expressions, narration, and music to communicate emotions. Originating in Japan, Bunraku flourished during the Edo period (1603–1868). It reflects Japanese cultural values, including duty, family loyalty, and the conflict between social responsibilities and personal desires. It remains an important part of Japan's traditional performing arts.",
      "The end of the Edo period is often described by Westerners in these terms: US Commodore Matthew Perry’s black ships forcibly opened Japan to the outside world, Japanese found themselves unprepared to compete technologically with Western powers, so they rushed to modernize, ultimately becoming one of the world’s most technologically advanced countries in only about 100 years. While true to a point, the major changes that happened in Japan from around 1850–1920 had their impetus from within the country as well as from with-out."
    ],
    sources:[
      'https://en.japantravel.com/guide/japan-history/71636',
      'https://www.worldhistory.org/Edo_Period/',
      'https://ich.unesco.org/en/RL/ningyo-johruri-bunraku-puppet-theatre-00064',
      'https://education.asianart.org/resources/historical-background-of-the-edo-period/'
    ]
  }
];
const $ = s => document.querySelector(s);
const grid = $('#period-grid');
// Landing-only palette sampled from the dense, colorful early Rakuten reference.
// Period pages keep their original era colors through period.color.
const landingPalette=['#bf0000','#e56600','#b87900','#3d982f','#0082bd','#008d87','#6751a2','#d51f63'];
periods.forEach((period,index)=>{
  const a=document.createElement('a'); a.className='era'; a.href=`#period/${period.id}`;
  a.style.setProperty('--tile',landingPalette[index]);
  a.setAttribute('aria-label',`Explore ${period.name} — ${period.type.toLowerCase()}`);
  a.innerHTML=`<span class="era-meta"><span class="era-number">${String(index+1).padStart(2,'0')}</span>${period.type}</span><span class="era-title">${period.short}</span><span class="era-cta">OPEN <b aria-hidden="true">›</b></span>`;
  grid.append(a);
});

const media=matchMedia('(prefers-reduced-motion: reduce)');
let motion=!media.matches, tx=0,ty=0,tz=0,px=0,py=0,pz=0,frame=0;

function renderMotion(){
  px+=(tx-px)*.075; py+=(ty-py)*.075; pz+=(tz-pz)*.085;
  document.documentElement.style.setProperty('--px',px.toFixed(4));
  document.documentElement.style.setProperty('--py',py.toFixed(4));
  document.documentElement.style.setProperty('--pz',pz.toFixed(4));
  if(Math.abs(tx-px)+Math.abs(ty-py)+Math.abs(tz-pz)>.001) frame=requestAnimationFrame(renderMotion); else frame=0;
}
function setTarget(x,y,z=0){tx=x;ty=y;tz=z;if(!frame) frame=requestAnimationFrame(renderMotion);}
$('#room').addEventListener('pointermove',e=>{
  if(!motion||media.matches||e.pointerType!=='mouse'||active||busy||looking||lookFrame)return;
  if(!e.target.closest('#screen')){setTarget(0,0,0);return;}
  setTarget((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2,1);
});
$('#screen').addEventListener('pointerleave',()=>{if(!active&&!looking&&!lookFrame&&!busy)setTarget(0,0,0);});
$('#room').addEventListener('pointerleave',()=>{if(!active&&!looking&&!lookFrame&&!busy)setTarget(0,0,0);});
media.addEventListener('change',()=>{motion=!media.matches;if(!motion)setTarget(0,0,0);});

const effects=Object.fromEntries(['mouse','loading'].map(name=>[name,$(`#sfx-${name}`)]));
const effectBuffers={}, effectSources={mouse:new Set(),loading:new Set()};
let soundContext=null;
try{soundContext=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});}catch{}
effects.loading.loop=true;
// preload sfx and skip the silent start
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
  }catch{ /* falls back to <audio> */ }
});
function unlockEffects(){
  if(soundContext?.state==='suspended')soundContext.resume().catch(()=>{});
}
function playEffect(name){
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
  if(!onLanding()||busy||e.button!==0||!e.target.closest('#screen'))return;
  playEffect('mouse');
},true);
document.addEventListener('keydown',unlockEffects,true);
document.addEventListener('click',e=>{
  if(e.detail===0&&onLanding()&&!busy&&e.target.closest('#screen'))playEffect('mouse');
},true);
function onLanding(){return !location.hash.startsWith('#period/')&&!document.body.classList.contains('zoom-active');}

const landingMusic = $('#landing-audio');
landingMusic.volume = 0;
const articleMusic = $('#article-audio') || document.createElement('audio');
articleMusic.id = 'article-audio';
articleMusic.loop = true;
articleMusic.volume = 0;
if (!articleMusic.isConnected) document.body.append(articleMusic);

let userInteracted = false;

function fadeAudio(audio, target, duration = 650, onDone = null){
  cancelAnimationFrame(audio._fadeAnim || 0);
  const from = audio.volume;
  const start = performance.now();
  const step = now => {
    const progress = duration ? Math.min(1, (now - start) / duration) : 1;
    const eased = progress * progress * (3 - 2 * progress);
    audio.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
    if (progress < 1) {
      audio._fadeAnim = requestAnimationFrame(step);
    } else {
      audio._fadeAnim = 0;
      if (target === 0) {
        audio.pause();
        try { audio.currentTime = 0; } catch {}
      }
      if (onDone) onDone();
    }
  };
  audio._fadeAnim = requestAnimationFrame(step);
}

function getTrackVolume(src) {
  if (!src) return 0.70;
  if (src.includes('leiheng')) return 0.40;
  if (src.includes('Sukuna') || src.includes('sukuna')) return 0.60;
  return 0.70;
}

async function syncMusic(immediate = false){
  const onLanding = !active && !document.body.classList.contains('zoom-active');
  const dur = immediate ? 0 : 700;

  if (onLanding) {
    if (!articleMusic.paused) {
      fadeAudio(articleMusic, 0, Math.min(dur, 450), () => {
        articleMusic.pause();
        articleMusic.removeAttribute('src');
        articleMusic.load();
      });
    } else {
      articleMusic.pause();
      articleMusic.removeAttribute('src');
    }
    if (userInteracted) {
      if (landingMusic.paused) {
        try { await landingMusic.play(); } catch {}
      }
      fadeAudio(landingMusic, 0.70, dur);
    }
  } else if (active && active.music) {
    if (!landingMusic.paused) fadeAudio(landingMusic, 0, dur);
    const targetSrc = active.music;
    const targetVol = active.volume || getTrackVolume(targetSrc);
    const isSame = articleMusic.src.endsWith(encodeURI(targetSrc)) || articleMusic.src.endsWith(targetSrc);
    if (isSame && !articleMusic.paused) {
      fadeAudio(articleMusic, targetVol, dur);
      return;
    }
    const startTrack = async () => {
      articleMusic.src = targetSrc;
      if (userInteracted) {
        try {
          await articleMusic.play();
          fadeAudio(articleMusic, targetVol, dur);
        } catch {}
      }
    };
    if (!articleMusic.paused) {
      fadeAudio(articleMusic, 0, Math.min(dur, 400), startTrack);
    } else {
      await startTrack();
    }
  }
}

function onUserGesture(){
  if (!userInteracted) {
    userInteracted = true;
    unlockEffects();
    syncMusic(false);
  }
}
document.addEventListener('pointerdown', onUserGesture);
document.addEventListener('click', onUserGesture);
document.addEventListener('keydown', onUserGesture);

const screen=$('#screen'),socket=$('#socket'),stage=$('#zoom-stage'),selection=$('#selection'),portal=$('#portal');
const room=$('#room'),computer=$('.computer');
let active=null, busy=false, lastTrigger=null;
let looking=false, lookFrame=0, aimX=.5, aimY=.5, curAimX=.5, curAimY=.5, lookX=0, lookY=0;
const lookScale=2, minLookScale=1.1, maxLookScale=2.8;
let currentScale=1, targetScale=1, lookTween=null, lastLookTime=0;
function renderLook(now){
  const elapsed=lastLookTime?Math.min(64,now-lastLookTime):16;
  lastLookTime=now;
  if(lookTween){
    const progress=media.matches?1:Math.min(1,(now-lookTween.start)/lookTween.duration);
    const eased=progress*progress*(3-2*progress);
    currentScale=lookTween.from+(lookTween.to-lookTween.from)*eased;
    if(progress===1)lookTween=null;
  }else{
    const scaleEase=media.matches?1:1-Math.exp(-elapsed/95);
    currentScale+=(targetScale-currentScale)*scaleEase;
    if(Math.abs(targetScale-currentScale)<.0004)currentScale=targetScale;
  }
  const aimEase=media.matches?1:1-Math.exp(-elapsed/80);
  curAimX+=(aimX-curAimX)*aimEase;curAimY+=(aimY-curAimY)*aimEase;
  if(Math.abs(aimX-curAimX)<.0002)curAimX=aimX;
  if(Math.abs(aimY-curAimY)<.0002)curAimY=aimY;
  lookX=-(currentScale-1)*curAimX*innerWidth;
  lookY=-(currentScale-1)*curAimY*innerHeight;
  room.style.transform=`translate(${lookX}px,${lookY}px) scale(${currentScale})`;
  const settling=lookTween||Math.abs(targetScale-currentScale)>.0004||Math.abs(aimX-curAimX)+Math.abs(aimY-curAimY)>.0004;
  lookFrame=settling?requestAnimationFrame(renderLook):0;
  if(!lookFrame){lastLookTime=0;if(!looking){currentScale=1;targetScale=1;lookX=0;lookY=0;room.style.transform='';room.classList.remove('camera-active');}}
}
function easeLookTo(scale,duration=900){
  room.classList.add('camera-active');
  targetScale=scale;
  lookTween={from:currentScale,to:scale,start:performance.now(),duration};
  if(!lookFrame)lookFrame=requestAnimationFrame(renderLook);
}
function stopLook(immediate=false){
  looking=false;targetScale=1;
  if(!immediate){easeLookTo(1,850);return;}
  cancelAnimationFrame(lookFrame);lookFrame=0;lookTween=null;lastLookTime=0;
  currentScale=1;lookX=0;lookY=0;room.style.transform='';room.classList.remove('camera-active');
}
function startLook(clientX,clientY,scale=lookScale,duration=900){
  aimX=Math.max(0,Math.min(1,clientX/innerWidth));aimY=Math.max(0,Math.min(1,clientY/innerHeight));
  if(!looking&&currentScale<=1.001){curAimX=aimX;curAimY=aimY;}
  looking=true;
  if(frame)cancelAnimationFrame(frame);frame=0;tx=px;ty=py;tz=pz;
  easeLookTo(scale,duration);
}
room.addEventListener('mousedown',e=>{
  if(e.button!==1)return;
  e.preventDefault();
  if(active||busy)return;
  if(looking){stopLook();return;}
  startLook(e.clientX,e.clientY,lookScale,900);
});
room.addEventListener('wheel',e=>{
  if(!looking||active||busy)return;
  e.preventDefault();
  aimX=Math.max(0,Math.min(1,e.clientX/innerWidth));aimY=Math.max(0,Math.min(1,e.clientY/innerHeight));
  const rawDelta=e.deltaMode===1?e.deltaY*33:e.deltaY;
  const delta=Math.max(-.28,Math.min(.28,-rawDelta*.0016||(-Math.sign(rawDelta)*.14)));
  targetScale=Math.max(minLookScale,Math.min(maxLookScale,targetScale+delta));
  lookTween=null;
  if(!lookFrame)lookFrame=requestAnimationFrame(renderLook);
},{passive:false});
// stop middle click from autoscrolling or opening new tabs
room.addEventListener('auxclick',e=>{if(e.button===1)e.preventDefault();});
window.addEventListener('pointermove',e=>{
  if(!looking||active||busy||e.pointerType!=='mouse')return;
  aimX=Math.max(0,Math.min(1,e.clientX/innerWidth));aimY=Math.max(0,Math.min(1,e.clientY/innerHeight));
  if(!lookFrame)lookFrame=requestAnimationFrame(renderLook);
});
window.addEventListener('resize',()=>{if(looking&&!lookFrame)lookFrame=requestAnimationFrame(renderLook);});
async function openingDocument(period,customDuration=0){
  const connection=$('#connection'),progress=$('#connection-progress'),percent=$('#connection-percent');
  $('#connection-name').textContent=`Opening ${period.name}...`;
  connection.hidden=false;percent.textContent='0%';
  playEffect('loading');
  const loadingClip=effectBuffers.loading;
  const clipDuration=loadingClip?loadingClip.buffer.duration-loadingClip.offset:effects.loading.duration;
  const duration=customDuration||(Number.isFinite(clipDuration)?Math.max(680,clipDuration*1000):2800);
  const animation=progress.animate([{width:'0%'},{width:'100%'}],{duration,easing:'steps(14,end)',fill:'forwards'});
  let progressFrame;
  const update=()=>{percent.textContent=`${Math.min(100,Math.round((animation.currentTime||0)/duration*100))}%`;if(animation.playState==='running')progressFrame=requestAnimationFrame(update);};
  update();await animation.finished;cancelAnimationFrame(progressFrame);percent.textContent='100%';
  stopEffect('loading');
  return ()=>{connection.hidden=true;animation.cancel();};
}
function fitComputer(){
  if(active||busy)return;
  // scale the computer to fit the window
  const fit=Math.min(1,(innerHeight*.80)/computer.offsetHeight,(innerWidth-38)/computer.offsetWidth);
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
  const wasLooking=looking||lookFrame||currentScale>1.001;
  const lookTransform=room.style.transform||'translate(0,0) scale(1)';
  stopLook(true);
  // stop parallax before zooming in
  if(frame)cancelAnimationFrame(frame);frame=0;tx=px;ty=py;tz=pz;
  document.body.classList.add('zoom-active');
  document.body.style.overflow='hidden';
  if(animate&&!media.matches&&wasLooking){
    await room.animate([{transform:lookTransform},{transform:'translate(0,0) scale(1)'}],{duration:900,easing:'cubic-bezier(.4,0,.2,1)'}).finished;
  }
  const fromCamera=room.style.transform||'translate(0,0) scale(1)';
  const camera=cameraTarget();
  if(animate&&!media.matches){
    const finishOpening=await openingDocument(period);
    // zoom into the screen
    finishOpening();
    fadeAudio(landingMusic,0,650);
    await room.animate([{transform:fromCamera},{transform:camera}],{duration:1350,easing:'cubic-bezier(.7,.03,.2,1)',fill:'forwards'}).finished;
    if(screen.classList.contains('crt-enabled'))await screen.animate([{filter:'brightness(1)'},{filter:'brightness(1.12) saturate(.7)'},{filter:'brightness(1)'}],{duration:180}).finished;
  }
  fadeAudio(landingMusic,0,0);
  socket.style.height=`${socket.offsetHeight}px`;
  portal.hidden=true;selection.hidden=false;updateSelection(period);
  stage.append(screen);stage.hidden=false;room.inert=true;
  if(animate&&!media.matches)await stage.animate([{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],{duration:380,easing:'steps(20,end)'}).finished;
  stopEffects();
  selection.focus({preventScroll:true});busy=false;
  syncRoute();
}
function updateSelection(period){
  active=period;
  const [r,g,b]=(period.ink||[0.5,0.2,0.18]).map(v=>Math.round(v*255));
  syncMusic();
  selection.setAttribute('aria-label',`${period.name} page`);
  selection.style.setProperty('--era',`rgb(${r},${g},${b})`);
  $('#period-kicker').textContent=`${period.type} · ${period.years}`;
  $('#period-title').textContent=period.name;
  $('#period-sub').textContent=period.sub||'';
  const body=$('#period-body');
  body.innerHTML='';
  (period.intro||[]).forEach(text=>{
    const p=document.createElement('p');
    p.textContent=text;
    body.append(p);
  });
  if(period.image){
    const fig=document.createElement('figure');
    fig.className='period-figure';
    const img=document.createElement('img');
    img.src=period.image;
    img.alt=period.caption||period.name;
    const cap=document.createElement('figcaption');
    cap.textContent=period.caption||'';
    fig.append(img,cap);
    body.append(fig);
  }
  (period.outro||[]).forEach(text=>{
    const p=document.createElement('p');
    p.textContent=text;
    body.append(p);
  });
  if(period.unfinished){
    const note=document.createElement('p');
    note.className='period-unfinished';
    note.textContent='Unfinished';
    body.append(note);
  }
  if(period.sources?.length){
    const srcWrap=document.createElement('div');
    srcWrap.className='period-sources';
    period.sources.forEach(url=>{
      const p=document.createElement('p');
      p.textContent='Source: ';
      const a=document.createElement('a');
      a.href=url;
      a.target='_blank';
      a.rel='noopener noreferrer';
      a.textContent=url;
      p.append(a);
      srcWrap.append(p);
    });
    body.append(srcWrap);
  }
  screen.scrollTop=0;
  setScrollTint(period.ink||[0.5,0.2,0.18]);
}
async function leave(){
  if(busy||!active)return;busy=true;
  active=null;
  document.body.classList.remove('zoom-active');document.body.style.overflow='';
  syncMusic();
  room.getAnimations().forEach(a=>a.cancel());
  selection.hidden=true;portal.hidden=false;socket.append(screen);socket.style.height='';
  const camera=cameraTarget();stage.hidden=true;room.inert=false;
  if(!media.matches){await room.animate([{transform:camera},{transform:'translate(0,0) scale(1)'}],{duration:850,easing:'cubic-bezier(.64,0,.24,1)'}).finished;}
  busy=false;
  fitComputer();if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});
  syncRoute();
}
function syncRoute(initial=false){if(busy)return;const period=periods.find(p=>location.hash===`#period/${p.id}`);if(period){if(active?.id!==period.id)enter(period,!initial);}else if(active)leave();}
window.addEventListener('hashchange',()=>syncRoute());
function returnToRoom(){if(busy)return;const home=new URL(location.href);home.hash='';history.replaceState(null,'',home.href);leave();}
$('#return').addEventListener('click',returnToRoom);
const info=$('#info-window'),infoButton=$('#info-button');
async function showInfo(show,animate=true){
  if(busy||info.hidden===!show)return;
  if(animate&&!media.matches){
    busy=true;document.body.classList.add('zoom-active');
    const finishOpening=await openingDocument({name:show?'Credits':'Home'},1050);
    finishOpening();
    document.body.classList.remove('zoom-active');busy=false;
  }
  info.hidden=!show;grid.hidden=show;infoButton.setAttribute('aria-expanded',String(show));
  $('#home-link').classList.toggle('current',!show);infoButton.classList.toggle('current',show);
  if(show)$('#info-title').focus({preventScroll:true});
}
infoButton.addEventListener('click',()=>showInfo(info.hidden));
$('#info-close').addEventListener('click',async()=>{await showInfo(false);infoButton.focus();});
$('#home-link').addEventListener('click',()=>showInfo(false));
$('.wordmark').addEventListener('click',()=>showInfo(false));
$('.skip').addEventListener('click',()=>showInfo(false,false));
window.addEventListener('keydown',async e=>{if(e.key==='Escape'){if(active)returnToRoom();else if(!info.hidden){await showInfo(false,false);infoButton.focus();}else if(looking)stopLook();}});
// Cached washi paper surface for the period page
let setScrollTint=()=>{};
(()=>{
  const canvas=$('#scroll-bg');
  if(!canvas)return;
  // Rasterize a small grain tile once; reuse it across every article.
  const grain=document.createElement('canvas');
  grain.width=grain.height=128;
  const ctx=grain.getContext('2d');
  if(ctx){
    const pixels=ctx.createImageData(128,128);
    let seed=9;
    for(let i=0;i<pixels.data.length;i+=4){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const light=(seed>>>16&1)===0;
      pixels.data[i]=light?255:87;
      pixels.data[i+1]=light?246:65;
      pixels.data[i+2]=light?226:40;
      pixels.data[i+3]=(seed>>>24)%24;
    }
    ctx.putImageData(pixels,0,0);
    selection.style.setProperty('--paper-grain',`url("${grain.toDataURL('image/png')}")`);
    // Reuse the same fibers as gaps in the printed ink; cache once per load.
    for(let i=0;i<pixels.data.length;i+=4){
      const coverage=pixels.data[i+3];
      pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;
      pixels.data[i+3]=coverage>20?194:232+coverage;
    }
    ctx.putImageData(pixels,0,0);
    selection.style.setProperty('--ink-wear',`url("${grain.toDataURL('image/png')}")`);
  }
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
  if(!gl)return;
  const vert='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const frag=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTint;


float hash(vec2 p){
  vec3 p3=fract(vec3(p.xyx)*.1031);
  p3+=dot(p3,p3.yzx+33.33);
  return fract((p3.x+p3.y)*p3.z);
}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.,a=.5;
  mat2 m=mat2(.8,-.6,.6,.8);
  for(int i=0;i<5;i++){v+=a*noise(p);p=m*p*2.03+vec2(7.1,3.7);a*=.5;}
  return v;
}
// handmade washi paper tooth, fine curved kozo strands & bark flecks (no sharp creases)
float washiPulp(vec2 p){
  float v=0.,a=.5;
  mat2 m=mat2(.8,-.6,.6,.8);
  for(int i=0;i<4;i++){
    v+=a*noise(p);
    p=m*p*2.35+vec2(13.1,7.7);
    a*=.52;
  }
  return v;
}
float washiStrands(vec2 p,vec2 flow){
  vec2 w=p+flow*.06+vec2(noise(p*9.5),noise(p*9.5+vec2(5.2,1.3)))*.035;
  mat2 r1=mat2(.94,.34,-.34,.94);
  mat2 r2=mat2(.52,.85,-.85,.52);
  mat2 r3=mat2(-.45,.89,-.89,-.45);
  float s1=noise((r1*w)*vec2(28.,145.));
  float s2=noise((r2*w+vec2(3.7,8.1))*vec2(32.,160.));
  float s3=noise((r3*w+vec2(7.3,2.4))*vec2(26.,135.));
  float sugeta=sin((w.y*260.+noise(w*18.)*2.2))*0.5+0.5;
  return (s1+s2+s3)*.28+sugeta*.16;
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec2 p=(gl_FragCoord.xy-.5*uRes)/max(uRes.x,1.)*1.6;

  vec2 wp=p;
  vec2 slope=vec2(0.);
  float dent=0.,rimCrease=0.;
  // flowing sumi-e ink wash
  vec2 q=wp*2.1;
  float w1=fbm(q+vec2(uTime*.038,-uTime*.024));
  float w2=fbm(q*1.5+vec2(-uTime*.028,uTime*.032)+w1*1.3);
  vec2 flow=vec2(w1,w2);

  // multi-scale handmade washi paper tooth, fine kozo strands & micro-relief
  float p0=washiPulp(wp*22.);
  float px=washiPulp((wp+vec2(.0014,0.))*22.)-p0;
  float py=washiPulp((wp+vec2(0.,.0014))*22.)-p0;
  float strands=washiStrands(wp,flow)-.5;
  float micro=noise(wp*165.+flow*.5)*0.62+noise(wp*320.)*0.38-.5;
  float grain=(p0-.5)*.78+strands*.52+micro*.36;

  // sparse, warm mulberry bark fibers (chiri) embedded in the handmade paper
  float fleckNoise=noise(wp*125.+vec2(strands*1.4));
  float chiri=smoothstep(.885,.935,fleckNoise)*smoothstep(.58,.82,noise(wp*26.+vec2(4.1,2.9)));

  // ink wash warped slightly by paper fibers so edges bleed into the grain (nijimi)
  float wash=fbm(q*1.9+flow*1.4+grain*.13);

  // soft pooled ink edges (tarashikomi)
  float edge=smoothstep(.46,.52,wash)-smoothstep(.52,.60,wash);
  float edge2=smoothstep(.61,.65,wash)-smoothstep(.65,.71,wash);
  float inkCloud=smoothstep(.38,.80,wash)+edge*.28+edge2*.16;

  // aged Japanese washi paper with subtle tea-stain tide rings, foxing & warm sun-aged edges
  float paperCloud=fbm(wp*1.25+vec2(2.3,5.1));
  float mottling=fbm(wp*4.5+vec2(8.4,3.2))-.5;
  float stain=fbm(wp*2.2+vec2(6.1,1.8)+grain*.07);
  float stainRim=smoothstep(.57,.61,stain)-smoothstep(.61,.66,stain);
  float foxing=smoothstep(.76,.84,fbm(wp*14.+vec2(3.7,9.1)))*smoothstep(.48,.72,paperCloud);
  float vig=smoothstep(.20,.98,length((uv-.5)*vec2(1.06,1.)));

  vec3 washi=vec3(.922,.868,.768);
  washi+=(paperCloud-.5)*vec3(.052,.045,.034);
  washi+=mottling*vec3(.036,.031,.024);
  washi+=grain*vec3(.082,.073,.058);
  washi-=chiri*vec3(.048,.056,.064);
  washi-=stainRim*vec3(.042,.048,.054);
  washi-=foxing*vec3(.038,.048,.056);
  washi-=vig*vec3(.125,.140,.160);

  // aged ukiyo-e bokashi color wash with woodblock baren grain (goma-zuri)
  float barenSkip=clamp(1.+grain*.68,0.56,1.34);
  float topWash=smoothstep(.40,1.,uv.y)*(.30+.18*w1);
  float bottomWash=smoothstep(.36,0.,uv.y)*(.14+.10*w2);
  float bokashi=clamp((topWash+bottomWash)*barenSkip,0.,1.);

  // aged sumi-e ink wash settling into paper valleys (kasure)
  float inkGrain=clamp(1.-grain*.62,0.50,1.40);
  float sumi=clamp(inkCloud*.22*inkGrain,0.,1.);
  vec3 agedTint=mix(uTint,vec3(.48,.35,.22),.22);
  vec3 pigment=mix(washi,mix(washi*agedTint*1.2,agedTint,.62),bokashi);
  vec3 col=mix(pigment,vec3(.15,.13,.10),sumi);

  // 3D pressed-paper dimple + tactile paper tooth relief under raking top-left light
  vec2 fiberSlope=vec2(px,py)*(2.3+dent*2.2)+vec2(strands,micro)*.09;
  vec3 norm=normalize(vec3(-(slope+fiberSlope),1.));
  vec3 lightDir=normalize(vec3(-.65,.65,.52));
  float diff=dot(norm,lightDir)-.52;
  col+=diff*vec3(.18,.16,.13);
  col-=dent*vec3(.038,.042,.046);
  col-=rimCrease*vec3(.018,.020,.022);

  gl_FragColor=vec4(col,1.);
}`;
  const compile=(type,src)=>{
    const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog=gl.createProgram();
  try{
    gl.attachShader(prog,compile(gl.VERTEX_SHADER,vert));
    gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,frag));
    gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
  }catch(e){console.warn('Scroll shader disabled:',e);return;}
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const pos=gl.getAttribLocation(prog,'p');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const uRes=gl.getUniformLocation(prog,'uRes');
  const uTime=gl.getUniformLocation(prog,'uTime');
  const uTint=gl.getUniformLocation(prog,'uTint');


  // Bake a repeating paper surface once per era, independent of article length.
  // Reflect the second half so both repeat boundaries meet without a hard edge.
  const paperTile=document.createElement('canvas');
  const paperContext=paperTile.getContext('2d');
  if(!paperContext)return;
  let tint=[0.16,0.28,0.52],raf=0,lastKey='',lost=false;
  function visible(){return !document.hidden&&!stage.hidden;}
  function draw(){
    raf=0;
    if(!visible()||lost)return;
    const w=640,h=640;
    const key=tint.join(',');
    if(key===lastKey)return;
    if(canvas.width!==w||canvas.height!==h){
      canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);
    }
    gl.uniform2f(uRes,w,h);
    gl.uniform1f(uTime,0);
    gl.uniform3f(uTint,...tint);
    gl.drawArrays(gl.TRIANGLES,0,3);
    paperTile.width=w;paperTile.height=h*2;
    paperContext.drawImage(canvas,0,0);
    paperContext.save();
    paperContext.translate(0,h*2);
    paperContext.scale(1,-1);
    paperContext.drawImage(canvas,0,0);
    paperContext.restore();
    selection.style.setProperty('--paper-surface',`url("${paperTile.toDataURL('image/png')}")`);
    lastKey=key;
  }
  function schedule(){if(!raf&&visible()&&!lost)raf=requestAnimationFrame(draw);}
  setScrollTint=rgb=>{tint=rgb.slice();schedule();};
  function refresh(){
    cancelAnimationFrame(raf);raf=0;
    schedule();
  }
  document.addEventListener('visibilitychange',refresh);
  new MutationObserver(refresh).observe(stage,{attributes:true,attributeFilter:['hidden']});
  canvas.addEventListener('webglcontextlost',event=>{
    event.preventDefault();lost=true;
    cancelAnimationFrame(raf);raf=0;
    canvas.hidden=true;
  });

})();
syncRoute(true);
