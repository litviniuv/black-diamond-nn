(function(){
  var d=document, html=d.documentElement; html.classList.add('js');
  /* header: position fixed under the demo strip (no sticky) */
  var hd=d.querySelector('.hdr'), demo=d.querySelector('.demo'), hTicking=false;
  function place(){ hTicking=false; var t=demo?Math.max(0,demo.getBoundingClientRect().bottom):0; hd.style.transform=t?'translateY('+t+'px)':''; var m=d.getElementById('menu'); if(m) m.style.top=(t+hd.offsetHeight)+'px'; }
  function req(){ if(!hTicking){ hTicking=true; requestAnimationFrame(place); } }
  if(hd){ place(); window.addEventListener('scroll',place,{passive:true}); window.addEventListener('resize',req); window.addEventListener('load',req);
    if(window.ResizeObserver&&demo) new ResizeObserver(req).observe(demo); if(d.fonts&&d.fonts.ready) d.fonts.ready.then(req); }
  /* mobile menu: lock without shift, exact restore */
  var btn=d.querySelector('.burger'), menu=d.getElementById('menu'), savedY=0, open=false;
  function raf(f){requestAnimationFrame(f)}
  function setY(y){html.style.scrollBehavior='auto';window.scrollTo({top:y,left:0,behavior:'instant'})}
  function lock(){
    savedY=window.scrollY;
    var b=d.body; b.style.position='fixed'; b.style.top=(-savedY)+'px'; b.style.left='0'; b.style.right='0'; b.style.width='100%';
    html.classList.add('menu-open');
  }
  function unlock(after){
    var b=d.body; html.classList.remove('menu-open');
    b.style.position=''; b.style.top=''; b.style.left=''; b.style.right=''; b.style.width='';
    var y=savedY; setY(y);
    raf(function(){ setY(y); raf(function(){ setY(y); raf(function(){ html.style.scrollBehavior=''; if(after) after(); }); }); });
  }
  function setOpen(v,after){
    if(!btn||v===open) {if(after)after(); return;}
    open=v; btn.setAttribute('aria-expanded',String(v)); btn.setAttribute('aria-label',v?'Закрыть меню':'Меню');
    if(v){ lock(); menu.hidden=false; var f=menu.querySelector('a'); if(f) f.focus({preventScroll:true}); }
    else { menu.hidden=true; unlock(after); btn.focus({preventScroll:true}); }
  }
  if(btn&&menu){
    btn.addEventListener('click',function(){ setOpen(!open); });
    d.addEventListener('keydown',function(e){
      if(!open) return;
      if(e.key==='Escape'){ setOpen(false); }
      if(e.key==='Tab'){ var f=[btn].concat([].slice.call(menu.querySelectorAll('a'))), i=f.indexOf(d.activeElement);
        if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()} else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()} }
    });
    [].forEach.call(menu.querySelectorAll('a'),function(a){
      a.addEventListener('click',function(e){
        var href=a.getAttribute('href'), hash=href.slice(href.indexOf('#'));
        var t=hash.length>1&&d.getElementById(hash.slice(1));
        if(!t||a.pathname!==location.pathname){ setOpen(false); return; }
        e.preventDefault();
        setOpen(false,function(){ history.pushState(null,'',hash); t.scrollIntoView({behavior:'smooth',block:'start'}); });
      });
    });
    window.addEventListener('resize',function(){ if(open&&window.innerWidth>=960) setOpen(false); });
  }
  /* reveal: observe parent sections, with fallback */
  var secs=[].slice.call(d.querySelectorAll('.sec'));
  function showAll(){ secs.forEach(function(s){s.classList.add('in')}); }
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){ showAll(); }
  else{
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:0,rootMargin:'0px 0px -8% 0px'});
    secs.forEach(function(s){io.observe(s)});
    function sweep(){ var h=window.innerHeight; secs.forEach(function(s){ var r=s.getBoundingClientRect(); if(r.top<h&&r.bottom>0) s.classList.add('in'); }); }
    window.addEventListener('scroll',sweep,{passive:true}); window.addEventListener('load',sweep); setTimeout(sweep,800);
  }
  /* map on click */
  [].forEach.call(d.querySelectorAll('.map'),function(m){
    var b=m.querySelector('.map__btn'); if(!b) return;
    b.addEventListener('click',function(){
      var f=d.createElement('iframe'); f.src=m.getAttribute('data-src').replace(/&amp;/g,'&'); f.title='Карта: Black diamond, ул. Гоголя, 12г'; f.loading='lazy'; f.allowFullscreen=true;
      m.innerHTML=''; m.classList.add('is-on'); m.appendChild(f);
    });
  });
})();
