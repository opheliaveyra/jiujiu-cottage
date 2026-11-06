/* Atelier III: composited motion, no scroll-time layout writes, zero parallax on touch. */
(()=>{'use strict';
 const root=document.documentElement;
 if(!root.classList.contains('atelier-v3'))return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const fine=matchMedia('(pointer: fine)').matches;
 const scene=document.querySelector('.v3-theater');
 // Low-frequency interpolation stops after settling; RAF never runs perpetually in a background tab.
 if(scene&&fine&&!reduce){
  const layers=[...scene.querySelectorAll('.v3-diorama .v3-layer')];
  const depths=[.15,.31,.48,.64,.86,1];
  let targetX=0,targetY=0,x=0,y=0,frame=0;
  function animate(){
   frame=0;
   x+=(targetX-x)*.09;y+=(targetY-y)*.09;
   layers.forEach((el,i)=>{
    const d=depths[Math.min(i,depths.length-1)];
    el.style.transform='translate3d('+((x*d).toFixed(2))+'px,'+((y*d).toFixed(2))+'px,0)';
   });
   if(Math.abs(x-targetX)+Math.abs(y-targetY)>.15)frame=requestAnimationFrame(animate);
  }
  const enqueue=()=>{if(!frame)frame=requestAnimationFrame(animate)};
  scene.addEventListener('pointermove',event=>{
   const box=scene.getBoundingClientRect();
   targetX=((event.clientX-box.left)/box.width-.5)*16;
   targetY=((event.clientY-box.top)/box.height-.5)*13;enqueue();
  },{passive:true});
  scene.addEventListener('pointerleave',()=>{targetX=targetY=0;enqueue()});
  document.addEventListener('visibilitychange',()=>{
   if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;targetX=targetY=x=y=0;layers.forEach(el=>el.style.transform='')}
  });
 }
 // Make paper sections feel composed, not shuffled or delayed into invisible placeholders.
 if(!reduce&&'IntersectionObserver'in window){
  const elements=[...document.querySelectorAll('.v3-hero-copy > *,.v3-hero-art')];
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('v3-entered');reveal.unobserve(entry.target)}
  }),{threshold:.1});
  elements.forEach((element,i)=>{
   element.style.setProperty('--v3-delay',Math.min(i*75,380)+'ms');
   element.classList.add('v3-reveal-once');reveal.observe(element);
  });
 }
 // Theme may be changed by the existing shared controller. Reuse its data-state, never double-toggle.
 const theme=document.querySelector('#tone');
 function syncTheme(){if(!scene)return;scene.dataset.time=root.dataset.tone==='night'?'night':'day'}
 syncTheme();
 const observer=new MutationObserver(syncTheme);observer.observe(root,{attributes:true,attributeFilter:['data-tone']});
 // The extra pressable art button follows the site's existing day/night handler.
 const daynight=document.querySelector('#pc-daynight');
 if(daynight){
  const setLabel=()=>daynight.setAttribute('aria-label',root.dataset.tone==='night'?'切换到白天':'切换到夜晚');
  setLabel();new MutationObserver(setLabel).observe(root,{attributes:true,attributeFilter:['data-tone']});
 }
})();