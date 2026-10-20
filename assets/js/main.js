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
