// ===== Shared behaviour , Shenal Perera portfolio =====
(function(){
  // theme: persisted light/dark toggle
  var root = document.documentElement;
  var saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  function wireThemeBtn(){
    var btn = document.getElementById('themeBtn');
    if (!btn) return;
    btn.addEventListener('click', function(){
      var cur = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = cur === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // simple mode: turns 3D/motion off, remembered across pages
  function wireMotionBtn(){
    var btn = document.getElementById('motionBtn');
    if (!btn) return;
    var off = root.getAttribute('data-motion') === 'off';
    btn.setAttribute('aria-pressed', off ? 'true' : 'false');
    btn.addEventListener('click', function(){
      try { localStorage.setItem('motion', off ? 'on' : 'off'); } catch(e){}
      location.reload();
    });
  }

  // page-open intro: one short effect per tab (skipped in simple mode / reduced motion)
  function runIntro(){
    var type = document.body.getAttribute('data-intro');
    if (!type || !root.classList.contains('intro-run')) { root.classList.remove('intro-run'); return; }
    var h1 = document.querySelector('.hero h1');
    var title = h1 ? h1.textContent.trim() : '';
    var ov = document.createElement('div');
    ov.className = 'intro-fx fx-' + type;
    ov.setAttribute('aria-hidden', 'true');
    var dur = 1300;

    function splitLetters(el, cls){
      var out = [];
      var txt = el.textContent; el.textContent = '';
      for (var i = 0; i < txt.length; i++){
        var ch = txt[i];
        if (ch === ' '){ el.appendChild(document.createTextNode(' ')); continue; }
        var s = document.createElement('span'); s.className = cls; s.textContent = ch;
        el.appendChild(s); out.push(s);
      }
      return out;
    }

    if (type === 'scan'){
      ov.innerHTML = '<div class="cover"></div><div class="line"><span class="fx-label">ID SCAN · SHENAL PERERA</span></div>';
      dur = 1150;
    } else if (type === 'blueprint'){
      var word = (document.querySelector('.hero .eyebrow') || {}).textContent || 'ENGINEERING';
      word = word.split('/').pop().trim().toUpperCase() || 'ENGINEERING';
      ov.innerHTML = '<div class="cover"><svg viewBox="0 0 1000 160"><text x="500" y="125" text-anchor="middle">' + word + '</text></svg>' +
        '<span class="fx-label">DWG 02 · MECHATRONICS</span><span class="fx-label">SCALE 1:1 · TMU</span></div>';
      dur = 1800;
    } else if (type === 'aperture'){
      var blades = '';
      for (var i = 0; i < 6; i++) blades += '<div class="blade" style="--a:' + (i * 60) + 'deg"></div>';
      ov.innerHTML = '<div class="cover">' + blades + '<span class="fx-label">f/1.8 · 1/250</span><div class="flash"></div></div>';
      dur = 1050;
    } else if (type === 'guides'){
      var g = '';
      [[18,'v'],[50,'v'],[82,'v'],[30,'h'],[62,'h']].forEach(function(p, i){
        var pos = p[1] === 'v' ? 'left:' + p[0] + '%' : 'top:' + p[0] + '%';
        g += '<div class="g ' + p[1] + '" style="' + pos + ';animation-delay:' + (i * 60) + 'ms"><span>' + (p[1] === 'v' ? 'X ' : 'Y ') + p[0] + '%</span></div>';
      });
      ov.innerHTML = '<div class="cover"></div>' + g;
      if (h1){
        splitLetters(h1, 'snap-ch').forEach(function(s, i){
          s.style.setProperty('--sx', Math.round((Math.random() - .5) * 120) + 'px');
          s.style.setProperty('--sy', Math.round((Math.random() - .5) * 90) + 'px');
          s.style.setProperty('--sr', Math.round((Math.random() - .5) * 50) + 'deg');
          s.style.animationDelay = (380 + i * 28) + 'ms';
        });
      }
      dur = 1150;
    } else if (type === 'transmit'){
      ov.innerHTML = '<div class="cover"><div class="bars"><i></i><i></i><i></i><i></i></div><span class="fx-label">CONNECTING</span></div>';
      setTimeout(function(){ ov.classList.add('ok'); ov.querySelector('.fx-label').textContent = 'CONNECTED'; }, 280);
      if (h1){
        var chars = splitLetters(h1, 'type-ch');
        var caret = document.createElement('span'); caret.className = 'type-caret'; h1.appendChild(caret);
        chars.forEach(function(s, i){ setTimeout(function(){ s.classList.add('on'); }, 420 + i * 40); });
        setTimeout(function(){ caret.remove(); }, 420 + chars.length * 40 + 800);
      }
      dur = 420;
    }

    document.body.appendChild(ov);
    root.classList.remove('intro-run');
    setTimeout(function(){ ov.classList.add('out'); }, dur);
    setTimeout(function(){ ov.remove(); }, dur + 450);
  }

  // scroll-reveal
  function wireReveal(){
    var els = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!('IntersectionObserver' in window) || !els.length){
      els.forEach(function(el){ el.classList.add('show'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function(el){ io.observe(el); });
  }

  function wireYear(){
    var y = document.getElementById('yr');
    if (y) y.textContent = new Date().getFullYear();
  }

  // expandable rows: click (or Enter/Space) to reveal a detail panel
  function wireExpandRows(){
    document.querySelectorAll('.exp-row').forEach(function(row){
      row.setAttribute('tabindex', '0');
      row.setAttribute('role', 'button');
      row.setAttribute('aria-expanded', 'false');
      function toggle(){
        var open = row.classList.toggle('open');
        row.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      row.addEventListener('click', function(e){
        if (e.target.closest('a')) return;
        toggle();
      });
      row.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    runIntro();
    wireThemeBtn();
    wireMotionBtn();
    wireReveal();
    wireYear();
    wireExpandRows();
  });
})();
