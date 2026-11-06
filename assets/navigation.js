/* One navigation controller shared across all cottage pages. */
(()=>{
 'use strict';
 const root=document.documentElement;
 root.classList.add('has-paper-nav-js');
 const header=document.querySelector('.paper-topbar');
 if(!header)return;
 const menu=header.querySelector('#paper-menu');
 const nav=header.querySelector('#paper-main-nav');
 const more=header.querySelector('#paper-more');
 if(!menu||!nav)return;
 const mobile=()=>window.matchMedia('(max-width: 1160px)').matches;
 const closeMore=()=>{if(more)more.open=false;};
 function setMenu(open,{returnFocus=false}={}){
   const showing=Boolean(open)&&mobile();
   nav.classList.toggle('is-open',showing);
   menu.setAttribute('aria-expanded',String(showing));
   menu.setAttribute('aria-label',showing?'收起纸雕导航目录':'展开纸雕导航目录');
   if(!showing)closeMore();
   if(returnFocus&&mobile())menu.focus();
 }
 menu.addEventListener('click',()=>setMenu(!nav.classList.contains('is-open')));
 nav.addEventListener('click',event=>{
   const link=event.target.closest('a[href]');
   if(link&&nav.contains(link))setMenu(false);
 });
 document.addEventListener('pointerdown',event=>{
   if(!header.contains(event.target)){setMenu(false);return;}
   if(more?.open&&!more.contains(event.target))closeMore();
 });
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'){
     const menuOpen=nav.classList.contains('is-open');
     const moreOpen=Boolean(more?.open);
     if(menuOpen){event.preventDefault();setMenu(false,{returnFocus:true});}
     else if(moreOpen){event.preventDefault();closeMore();more.querySelector('summary')?.focus();}
   }
 });
 window.addEventListener('resize',()=>{if(!mobile()&&nav.classList.contains('is-open'))setMenu(false);});
 // Keep on-page anchors in sync when visitors browse the long homepage.
 if(header.dataset.home==='true'){
   const homeTab=header.querySelector('.paper-tab[data-section="home"]');
   const projectTab=header.querySelector('.paper-tab[data-section="projects"]');
   const playTab=header.querySelector('.paper-tab[data-section="playground"]');
   function updateActive(){
     const hash=window.location.hash;
     const selected=hash==='#projects'?projectTab:hash==='#playground'?playTab:homeTab;
     [homeTab,projectTab,playTab].forEach(link=>{
       if(!link)return;
       if(link===selected)link.setAttribute('aria-current','page');
       else link.removeAttribute('aria-current');
     });
   }
   window.addEventListener('hashchange',updateActive);
   updateActive();
 }
})();