(function () {
  'use strict';

  // Menu mobile
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Extrait : « Lire la suite »
  var moreBtn = document.getElementById('extrait-btn');
  var more = document.getElementById('extrait-suite');
  moreBtn.addEventListener('click', function () {
    var open = moreBtn.getAttribute('aria-expanded') === 'true';
    more.hidden = open;
    moreBtn.setAttribute('aria-expanded', String(!open));
    moreBtn.textContent = open ? 'Lire la suite' : 'Replier';
  });

  // Animations liées au défilement (désactivées si l'utilisateur préfère moins de mouvement)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };
  var hero = document.querySelector('[data-hero]');
  var heroText = document.querySelector('[data-hero-text]');
  var book = document.querySelector('[data-book]');
  var voix = document.querySelector('[data-voix]');
  var bar = document.querySelector('.progress');

  function onScroll() {
    var vh = window.innerHeight;
    var doc = document.documentElement;
    bar.style.setProperty('--sp', clamp(window.scrollY / (doc.scrollHeight - vh)));
    if (reduce) return;
    var r = hero.getBoundingClientRect();
    var p = clamp(-r.top / (r.height - vh));
    hero.style.setProperty('--p', p);
    // le texte masqué n'est plus focalisable
    if (p > 0.4) heroText.setAttribute('inert', ''); else heroText.removeAttribute('inert');
    var b = book.getBoundingClientRect();
    book.style.setProperty('--bq', clamp((vh - b.top) / (vh + b.height)) );
    var v = voix.getBoundingClientRect();
    voix.style.setProperty('--vq', clamp((vh - v.top) / (v.height + vh * 0.4)));
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { onScroll(); ticking = false; }); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Apparition des éléments .rv
  var rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add('in'); });
  }

  // Formulaire de précommande
  var form = document.getElementById('form');
  var status = document.getElementById('form-status');
  var wa = document.getElementById('wa');
  var waBase = wa.getAttribute('href').split('?')[0];

  var rules = {
    nom: function (v) { return v.trim().length >= 2 ? '' : 'Veuillez indiquer votre nom.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Veuillez saisir une adresse e-mail valide.'; },
    tel: function (v) { return /^[+\d][\d\s().-]{7,}$/.test(v.trim()) ? '' : 'Veuillez saisir un numéro de téléphone valide.'; },
    ville: function (v) { return v.trim().length >= 2 ? '' : 'Veuillez indiquer votre ville.'; },
    qte: function (v) { var n = Number(v); return Number.isInteger(n) && n >= 1 && n <= 20 ? '' : 'Indiquez un nombre entre 1 et 20.'; }
  };

  function check(id) {
    var input = document.getElementById(id);
    var msg = rules[id](input.value);
    document.getElementById(id + '-err').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  Object.keys(rules).forEach(function (id) {
    document.getElementById(id).addEventListener('blur', function () { check(id); });
  });

  // Message WhatsApp pré-rempli avec la quantité et le nom saisis
  function updateWa() {
    var qte = document.getElementById('qte').value || '1';
    var nom = document.getElementById('nom').value.trim();
    var txt = 'Bonjour, je souhaite précommander ' + qte + ' exemplaire' + (Number(qte) > 1 ? 's' : '') +
      ' de « Entre deux rives »' + (nom ? '. Nom : ' + nom : '') + '.';
    wa.href = waBase + '?text=' + encodeURIComponent(txt);
  }
  form.addEventListener('input', updateWa);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) {
      status.textContent = 'Merci de corriger les champs signalés.';
      var bad = form.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
      return;
    }
    if (form.action.indexOf('[ID_FORMSPREE]') !== -1) {
      status.textContent = 'Formulaire non configuré : renseignez l\'identifiant Formspree.';
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.textContent = 'Envoi en cours…';
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('http ' + res.status);
      form.reset();
      updateWa();
      status.textContent = 'Merci ! Votre précommande est bien enregistrée. Vous recevrez un e-mail de confirmation.';
    }).catch(function () {
      status.textContent = 'L\'envoi a échoué. Réessayez, ou commandez via WhatsApp.';
    }).then(function () {
      btn.disabled = false;
    });
  });
})();
