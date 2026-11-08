/* Centralised visuals and accessible artwork viewer. Keeps the original CSS art as fallback. */
(()=>{
  'use strict';
  const sources=window.JIUJIU_VISUALS||{};
  const selectors={
    'project-miorune':'.project-art.cleos-bg',
    'project-cistella':'.project-art.cistella-bg',
    'project-ai-room':'.project-art.room-bg',
    'studio-sunset':'.studio-art.illustration-one',
    'studio-moon':'.studio-art.illustration-two',
    'studio-sketch':'.studio-art.illustration-three',
    'scrapbook-miorune':'.scrapbook-entry-art.art-a',
    'scrapbook-cistella':'.scrapbook-entry-art.art-b',
    'scrapbook-ai':'.scrapbook-entry-art.art-c',
    'scrapbook-cottage':'.scrapbook-entry-art.art-d'
  };
  for(const [key,selector] of Object.entries(selectors)){
    const art=document.querySelector(selector);
    if(!art)continue;
    art.dataset.artSlot=key;
    const setting=sources[key];
    const src=typeof setting==='string'?setting:setting?.src;
    if(!src||typeof src!=='string')continue;
    const img=new Image();
    img.className='jj-art-image';
    img.alt='';
    img.decoding='async';
    img.loading='lazy';
    img.onload=()=>art.classList.add('jj-art-ready');
    img.onerror=()=>img.remove(); // Leave the original illustration visible when a file is missing.
    img.src=src.trim();
    if(img.src)art.append(img);
  }
  const cards=[...document.querySelectorAll('#studio .studio-card')];
  if(!cards.length||typeof HTMLDialogElement==='undefined')return;
  const dialog=document.createElement('dialog');
  dialog.className='jj-lightbox';
  dialog.setAttribute('aria-label','灵感插画浏览');
  dialog.innerHTML=`<div class="jj-lightbox-inner">
    <div class="jj-lightbox-art" id="jj-lightbox-art"></div>
    <div class="jj-lightbox-info">
      <div class="jj-lightbox-kicker" id="jj-lightbox-index">JIUJIU / ARTWORK 01</div>
      <h2 id="jj-lightbox-title"></h2>
      <p id="jj-lightbox-copy"></p>
      <div class="jj-lightbox-controls">
        <button type="button" data-step="-1" aria-label="上一幅插画">←</button>
        <button type="button" data-step="1" aria-label="下一幅插画">→</button>
      </div>
    </div>
  </div><button type="button" class="jj-lightbox-close" aria-label="关闭画廊">×</button>`;
  document.body.append(dialog);
  const stage=dialog.querySelector('#jj-lightbox-art');
  let active=0,lastTrigger=null;
  function show(n){
    active=(n+cards.length)%cards.length;
    const card=cards[active],art=card.querySelector('.studio-art');
    if(!art)return;
    const title=card.querySelector('h3')?.textContent?.trim()||'无题';
    const note=card.querySelector('.text p')?.textContent?.trim()||'';
    stage.replaceChildren();
    const cover=art.querySelector('.jj-art-image');
    if(cover&&art.classList.contains('jj-art-ready')){
      const image=cover.cloneNode(true);
      image.removeAttribute('loading');image.alt=title;image.style.opacity='1';
      stage.append(image);
    }else{
      const wrapper=document.createElement('div');
      wrapper.className='studio-card';
      const artClone=art.cloneNode(true);
      artClone.removeAttribute('id');
      artClone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      wrapper.append(artClone);
      stage.append(wrapper);
    }
    dialog.querySelector('#jj-lightbox-index').textContent='ATELIER / ARTWORK '+String(active+1).padStart(2,'0')+' OF '+String(cards.length).padStart(2,'0');
    dialog.querySelector('#jj-lightbox-title').textContent=title;
    dialog.querySelector('#jj-lightbox-copy').textContent=note;
  }
  cards.forEach((card,index)=>{
    const b=document.createElement('button');
    b.className='jj-view-art';b.type='button';
    b.textContent='查看作品 ↗';
    b.setAttribute('aria-label','放大查看'+(card.querySelector('h3')?.textContent||'插画'));
    b.addEventListener('click',()=>{
      lastTrigger=b;show(index);
      try{dialog.showModal()}catch(e){return}
      dialog.querySelector('.jj-lightbox-close').focus();
    });
    card.append(b);
  });
  dialog.querySelector('.jj-lightbox-close').addEventListener('click',()=>dialog.close());
  dialog.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>show(active+Number(button.dataset.step))));
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
  dialog.addEventListener('close',()=>lastTrigger?.focus());
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();show(active-1)}
    if(event.key==='ArrowRight'){event.preventDefault();show(active+1)}
  });
  let touchX=null;
  stage.addEventListener('touchstart',event=>{touchX=event.changedTouches[0]?.clientX??null},{passive:true});
  stage.addEventListener('touchend',event=>{
    if(touchX===null)return;
    const delta=(event.changedTouches[0]?.clientX??touchX)-touchX;touchX=null;
    if(Math.abs(delta)>60)show(active+(delta<0?1:-1));
  },{passive:true});
})();
