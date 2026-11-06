(()=>{'use strict';
const $=(q,root=document)=>root.querySelector(q),$$=(q,root=document)=>Array.from(root.querySelectorAll(q));
const root=document.documentElement,tone=$('#tone'),nav=$('.topbar'),bar=$('.progress');
let lastScroll=0;
try{if(localStorage.getItem('jiujiu-tone')==='night')root.dataset.tone='night'}catch(e){}
function syncTone(){if(tone){const dark=root.dataset.tone==='night';tone.textContent=dark?'☀':'☾';tone.setAttribute('aria-label',dark?'切换日间模式':'切换夜间模式');tone.setAttribute('aria-pressed',String(dark));tone.title=dark?'日间模式':'夜间模式'}}
syncTone();tone?.addEventListener('click',()=>applyTone(root.dataset.tone==='night'?'day':'night'));
function onScroll(){const h=document.documentElement.scrollHeight-innerHeight;const pct=h>0?Math.max(0,Math.min(100,scrollY/h*100)):0;if(bar)bar.style.width=pct+'%';nav?.classList.toggle('scrolled',scrollY>8);lastScroll=scrollY}window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce&&'IntersectionObserver'in window){root.classList.add('motion');const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}})},{threshold:.1,rootMargin:'0px 0px -20px 0px'});$$('.reveal').forEach(el=>io.observe(el))}else{$$('.reveal').forEach(el=>el.classList.add('visible'))}
const stage=$('.stage');if(stage&&!reduce&&window.matchMedia('(pointer:fine)').matches){stage.addEventListener('pointermove',ev=>{const r=stage.getBoundingClientRect(),x=(ev.clientX-r.left-r.width/2)/r.width*30,y=(ev.clientY-r.top-r.height/2)/r.height*30;stage.style.setProperty('--px',x+'px');stage.style.setProperty('--py',y+'px')});stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--px','0px');stage.style.setProperty('--py','0px')})}
document.querySelectorAll('.board-tags .filter').forEach(button=>button.addEventListener('click',()=>{const val=button.dataset.filter;document.querySelectorAll('.board-tags .filter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$$('.mini-note').forEach(item=>{item.hidden=val!=='all'&&item.dataset.cat!==val});const text=$('#filter-status');if(text)text.textContent=val==='all'?'已显示全部灵感卡片':('已筛选'+button.textContent.trim()+'卡片')}));
const ideas=['为一个平常的按钮，设计一点不平常的快乐。','给喜欢的角色留一扇能看到月亮的窗。','把“以后再说”的想法，变成今天的一小步。','让两种完全不同的界面风格，在同一张纸上和解。','做一个只有懂你的人才会发现的小机关。','给一个旧项目写一封新的介绍信。','试着让颜色比文字先讲完故事。','把今天脑子里闪过的一秒钟，存成一张便签。'];
let previous=-1;const ticket=$('#ticket-text'),draw=$('#draw-ticket');draw?.addEventListener('click',()=>{let i=Math.floor(Math.random()*ideas.length);if(i===previous)i=(i+1)%ideas.length;previous=i;if(ticket){ticket.textContent=ideas[i];const sheet=ticket.closest('.ticket');sheet?.classList.remove('reprint');void sheet?.offsetWidth;sheet?.classList.add('reprint')}draw.textContent='再抽一张 ↻'});
const toast=$('#toast');let timer=null;function showToast(message){if(!toast)return;toast.textContent=message;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2900)}$('#knock')?.addEventListener('click',()=>showToast('叩叩！门开啦，欢迎光临玖玖的小屋 ♡'));$('#surprise')?.addEventListener('click',()=>showToast('小屋的彩蛋正在慢慢长大。先送你一颗小星星 ✦'));

/* Room explorer: a proper accessible tab interface, no remote requests. */
const roomData={
 desk:{index:'01 / 04',label:'ROOM 01 / WELCOME IN',title:'把脑海里的小世界，一点点做出来。',copy:'从米洛恩的纸感界面到各种小机关，这张工作台上永远有新的草图。',link:'projects/cleos.html',action:'看看米洛恩的设计笔记'},
 library:{index:'02 / 04',label:'ROOM 02 / KEEP THE STORIES',title:'角色的故事，也该有属于自己的书架。',copy:'Cistella 收藏角色、记忆与世界书，让灵感有地方慢慢生长。',link:'projects/cistella.html',action:'走进 Cistella 档案室'},
 chat:{index:'03 / 04',label:'ROOM 03 / TALK TOGETHER',title:'把不同的声音，请进同一间屋子。',copy:'AI 群聊实验室正在研究多人对话、提及和邀请机制。现在还在做实验。',link:'projects/ai-room.html',action:'看看 AI 群聊实验室'},
 garden:{index:'04 / 04',label:'ROOM 04 / GATHER IDEAS',title:'不成熟的点子，也可以先晒晒太阳。',copy:'那些配色、纸片、角色和故事，暂时没想好用途也没关系。',link:'#studio',action:'去灵感橱窗逛逛'}
};
const roomScene=$('#room-scene'),tourDetail=$('#tour-detail'),roomButtons=$$('.tour-door');
function activateRoom(room,focus){const info=roomData[room];if(!info||!roomScene)return;roomScene.dataset.room=room;
 const fields={'#tour-index':info.index,'#tour-label':info.label,'#tour-title':info.title,'#tour-copy':info.copy};
 Object.entries(fields).forEach(([selector,value])=>{const el=$(selector);if(el)el.textContent=value});
 const link=$('#tour-link');if(link){link.setAttribute('href',info.link);link.innerHTML='';link.append(document.createTextNode(info.action+' '));const arrow=document.createElement('span');arrow.textContent='↗';link.append(arrow)}
 roomButtons.forEach(button=>{const active=button.dataset.room===room;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus()});
 const activeButton=roomButtons.find(button=>button.dataset.room===room);if(activeButton&&tourDetail)tourDetail.setAttribute('aria-labelledby',activeButton.id)
}
roomButtons.forEach((button,index)=>{button.addEventListener('click',()=>activateRoom(button.dataset.room,false));button.addEventListener('keydown',ev=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(ev.key))return;ev.preventDefault();let target=index;if(ev.key==='Home')target=0;else if(ev.key==='End')target=roomButtons.length-1;else target=(index+(ev.key==='ArrowLeft'||ev.key==='ArrowUp'?-1:1)+roomButtons.length)%roomButtons.length;activateRoom(roomButtons[target].dataset.room,true)})});
/* Visitor's private note: stored only in the browser. */
const letterInput=$('#letter-input'),letterSave=$('#letter-save'),letterClear=$('#letter-clear'),letterFeedback=$('#letter-feedback'),letterCount=$('#letter-count'),letterDate=$('#letter-date');
const letterKey='jiujiu-local-letter-v1';
if(letterDate){try{letterDate.textContent='A LITTLE NOTE · '+new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long',day:'numeric'}).format(new Date())}catch(e){}}
if(letterInput){try{letterInput.value=localStorage.getItem(letterKey)||''}catch(e){}
 const count=()=>{if(letterCount)letterCount.textContent=letterInput.value.length+' / 140'};count();letterInput.addEventListener('input',count);
 letterSave?.addEventListener('click',()=>{try{localStorage.setItem(letterKey,letterInput.value);if(letterFeedback)letterFeedback.textContent=letterInput.value.trim()?'收好啦。这张纸条只在你自己的浏览器里。♡':'已经保存空白纸条。'}catch(e){if(letterFeedback)letterFeedback.textContent='浏览器不允许保存，文字还留在页面上，可以先复制。'}});
 letterClear?.addEventListener('click',()=>{letterInput.value='';count();try{localStorage.removeItem(letterKey)}catch(e){}if(letterFeedback)letterFeedback.textContent='纸条清空了。今天也可以重新开始。';letterInput.focus()})
}


// Paper-cut house controls are keyboard accessible and do not require a server.
const pcTheater=$('#pc-theater'),pcDoor=$('#pc-door'),pcLetter=$('#pc-letter'),pcDaynight=$('#pc-daynight');
pcDoor?.addEventListener('click',()=>{
 const open=pcDoor.getAttribute('aria-expanded')==='true';
 pcDoor.setAttribute('aria-expanded',String(!open));
 pcDoor.setAttribute('aria-label',open?'敲开小屋的纸门':'合上纸雕信封');
 if(pcLetter)pcLetter.hidden=open;
});

const mapScene=$('#map-scene'),mapTime=$('#map-time');
// A single source of truth for header theme, home paper sky and paper-town night mode.
function applyTone(mode,persist=true){
 const night=mode==='night';
 root.dataset.tone=night?'night':'day';
 if(persist){try{localStorage.setItem('jiujiu-tone',root.dataset.tone)}catch(e){}}
 syncTone();
 if(pcTheater)pcTheater.dataset.time=night?'night':'day';
 if(pcDaynight){
  pcDaynight.setAttribute('aria-pressed',String(night));
  pcDaynight.setAttribute('aria-label',night?'切换到白天':'切换到夜晚');
  pcDaynight.textContent=night?'☼ 切到白天':'☾ 切到夜晚';
 }
 if(mapScene)mapScene.dataset.night=String(night);
 if(mapTime){
  mapTime.setAttribute('aria-pressed',String(night));
  mapTime.setAttribute('aria-label',night?'切换到白天':'切换到夜游模式');
  mapTime.textContent=night?'☼ 返回白天':'☾ 夜游模式';
 }
}
pcDaynight?.addEventListener('click',()=>applyTone(root.dataset.tone==='night'?'day':'night'));
mapTime?.addEventListener('click',()=>applyTone(root.dataset.tone==='night'?'day':'night'));
applyTone(root.dataset.tone==='night'?'night':'day',false);

})();