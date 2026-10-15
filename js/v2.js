(function(){
  var d=document, html=d.documentElement, rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero=d.querySelector('.h7');
  if(hero){ if(rm) hero.classList.add('go'); else requestAnimationFrame(function(){hero.classList.add('go')}); }
  /* pause effects when the tab is hidden */
  d.addEventListener('visibilitychange',function(){ html.classList.toggle('paused',d.hidden); });
  /* pointer slightly shifts the photo (precise pointer only) */
  if(hero&&!rm&&matchMedia('(pointer: fine)').matches){
    var img=hero.querySelector('.h7__img'), pend=false, y=50;
    hero.addEventListener('pointermove',function(e){
      var r=hero.getBoundingClientRect(); y=40+20*((e.clientY-r.top)/r.height);
      if(!pend&&!d.hidden){ pend=true; requestAnimationFrame(function(){ pend=false; img.style.setProperty('--py',y.toFixed(1)+'%'); }); }
    });
  }
  /* carousel: swipe, buttons, keyboard */
  [].forEach.call(d.querySelectorAll('.car'),function(c){
    var track=c.querySelector('.car__track'), slides=c.querySelectorAll('.car__slide'), n=slides.length, i=0,
        count=c.querySelector('.car__count'), dots=c.querySelectorAll('.car__dot'), view=c.querySelector('.car__view');
    function go(k,anim){ i=(k+n)%n; track.style.transition=anim===false?'none':''; track.style.transform='translateX('+(-100*i)+'%)';
      count.textContent=(i+1)+' / '+n;
      [].forEach.call(dots,function(b,j){ b.setAttribute('aria-current',j===i?'true':'false'); });
      [].forEach.call(slides,function(s,j){ s.setAttribute('aria-hidden',j===i?'false':'true'); }); }
    c.querySelector('.car__prev').addEventListener('click',function(){go(i-1)});
    c.querySelector('.car__next').addEventListener('click',function(){go(i+1)});
    [].forEach.call(dots,function(b,j){ b.addEventListener('click',function(){go(j)}); });
    c.addEventListener('keydown',function(e){
      if(e.key==='ArrowLeft'){e.preventDefault();go(i-1)} else if(e.key==='ArrowRight'){e.preventDefault();go(i+1)}
      else if(e.key==='Home'){e.preventDefault();go(0)} else if(e.key==='End'){e.preventDefault();go(n-1)} });
    var sx=null, sy=0, dx=0, horiz=null, pid=null;
    function start(x,y){ sx=x; sy=y; dx=0; horiz=null; }
    function move(x,y,ev){ if(sx===null) return; dx=x-sx; var dy=y-sy;
      if(horiz===null&&(Math.abs(dx)>6||Math.abs(dy)>6)) horiz=Math.abs(dx)>Math.abs(dy);
      if(horiz){ if(ev&&ev.cancelable) ev.preventDefault(); track.style.transition='none'; track.style.transform='translateX(calc('+(-100*i)+'% + '+dx+'px))'; } }
    function end(){ if(sx===null) return; var w=view.clientWidth; sx=null;
      if(horiz&&Math.abs(dx)>Math.min(60,w*.15)) go(dx<0?i+1:i-1); else go(i); }
    view.addEventListener('touchstart',function(e){ var t=e.touches[0]; start(t.clientX,t.clientY); },{passive:true});
    view.addEventListener('touchmove',function(e){ var t=e.touches[0]; move(t.clientX,t.clientY,e); },{passive:false});
    view.addEventListener('touchend',end); view.addEventListener('touchcancel',end);
    view.addEventListener('mousedown',function(e){ if(e.button!==0) return; e.preventDefault(); start(e.clientX,e.clientY);
      function mm(ev){ move(ev.clientX,ev.clientY,null) } function mu(){ d.removeEventListener('mousemove',mm); d.removeEventListener('mouseup',mu); end(); }
      d.addEventListener('mousemove',mm); d.addEventListener('mouseup',mu); });
    go(0,false);
    view.addEventListener('transitionend',function(e){ if(e.propertyName==='clip-path'&&e.target===view) view.classList.add('opened'); });
  });
})();
