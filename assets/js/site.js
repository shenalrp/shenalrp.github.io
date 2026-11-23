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
    wireThemeBtn();
    wireReveal();
    wireYear();
    wireExpandRows();
  });
})();
