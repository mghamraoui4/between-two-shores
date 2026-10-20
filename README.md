# Entre deux rives — landing page

Page de précommande du livre « Entre deux rives — D'un juriste à un homme des réseaux » (Mohamed Ghamraoui).
Site 100 % statique : HTML, CSS, JavaScript vanilla. Aucun build.

## Arborescence

```
index.html            page unique
404.html              page d'erreur GitHub Pages
robots.txt, sitemap.xml
assets/css/style.css  charte en variables CSS (:root) — à modifier en premier
assets/js/main.js     menu mobile, extrait dépliable, validation et envoi du formulaire
assets/img/           couverture (JPG + WebP, 480/800 px), image Open Graph, favicons
```

## Tester en local

```
python3 -m http.server 8000
```
puis ouvrir http://localhost:8000/

## Déploiement

1. **Dépôt.** Le brief prévoit `mghamraoui4/entre-deux-rives`. Le travail est fait dans `between-two-shores` : renommer ce dépôt (Settings → Repository name) ou en créer un nouveau et y pousser le contenu. Les chemins sont relatifs ; seules les URLs absolues de `index.html` (canonical, Open Graph, JSON-LD), `sitemap.xml`, `robots.txt` et `404.html` mentionnent `/entre-deux-rives/`.
2. **GitHub Pages.** Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)`. L'URL sera https://mghamraoui4.github.io/entre-deux-rives/ après une minute ou deux.
3. **Formspree.**
   - Créer un compte sur formspree.io, puis un nouveau formulaire.
   - Copier son identifiant (la fin de l'URL `https://formspree.io/f/xxxxxxxx`).
   - Remplacer `[ID_FORMSPREE]` dans l'attribut `action` du `<form id="form">` de `index.html`.
   - Dans Formspree, onglet Settings, ajouter `mghamraoui4.github.io` aux domaines autorisés si l'option existe.
   - Envoyer un test et vérifier la réception.

## Éléments à compléter

Chaque élément est repéré dans le code par un commentaire `<!-- À COMPLÉTER -->`. Pour tous les lister : `grep -n "À COMPLÉTER" index.html`.

- Mois et année de parution (hero, fiche technique, FAQ).
- Prix en DH (fiche technique).
- ISBN (fiche technique et JSON-LD `isbn`).
- Extrait du prologue (début et suite).
- Deux phrases réelles pour l'illustration « Deux voix » (Mohamed / Célia).
- URL du profil LinkedIn (section auteur et pied de page).
- Identifiant Formspree.
- Numéro WhatsApp au format `212XXXXXXXXX` (remplacer `[NUMERO]` dans le lien `wa.me`).
- Réponses de la FAQ : livraison au Maroc (zones, délais, frais), paiement, version numérique.
- Facultatif : portrait de l'auteur, et `datePublished` / `offers` dans le JSON-LD une fois le prix et la date connus.

## Notes

- Le mockup 3D du livre est en CSS pur (voir `.book` dans `style.css`).
- Sans JavaScript, le formulaire reste un envoi classique vers Formspree.
- Un champ piège `_gotcha` limite le spam.
- Aucun avis, chiffre de vente ni citation de presse n'est inclus.
