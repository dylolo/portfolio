# Portfolio — Khady Lo

Site statique (HTML / CSS / JS + GSAP), publié via GitHub Pages : https://dylolo.github.io/portfolio/

## Pages
- `index.html` — accueil
- `projet-*.html` — études de cas (PapsFret, BTC Change, MCN, BetSet, Wikilo)

## Accès protégé (PapsFret)
`projet-papsfret.html` demande un mot de passe avant d'afficher l'étude de cas.
Seule l'empreinte SHA-256 du mot de passe est présente dans la page (constante `GATE_HASH`).

- Partager l'accès : donner le mot de passe, ou envoyer un lien direct `projet-papsfret.html?acces=MOT_DE_PASSE`.
- Changer le mot de passe : générer la nouvelle empreinte puis remplacer la valeur de `GATE_HASH` dans `projet-papsfret.html`.

```bash
printf '%s' 'NOUVEAU_MOT_DE_PASSE' | shasum -a 256
```

Note : il s'agit d'une protection côté navigateur, adaptée à un portfolio (le contenu reste dans le code source de la page).
