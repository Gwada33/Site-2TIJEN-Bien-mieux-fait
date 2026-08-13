# WIREFRAME — 2TIJEN · Marketplace streetwear underground (Guadeloupe / Antilles)

Maquette textuelle détaillée + design system + composants UI + micro-animations.
Ce document est le **blueprint d'implémentation** du storefront Medusa/Next.js.
Complémentaire de `STYLING.md` (qui documente l'existant).

---

## 0. Concept

> **2TIJEN** — la marketplace streetwear underground antillaise.
> Drops limités, sérigraphie locale, ambiances urbaines et tropicales.
> 100% Guadeloupe / Antilles : les pièces naissent dans les ateliers de la 971,
> le reste du monde commande.

- One-page vitrine (home) + pages internes : `/shop`, `/products/[handle]`,
  panier (drawer). Les sections Créateurs et À propos ont été **supprimées**
  (home = Hero → Marquee → Drops).
- Ton : direct, jeune, authentique. Références locales : **971**, **Gwada**,
  **Kreyòl**. Urgence et exclusivité partout.

---

## 1. Identité visuelle

> Direction actuelle : **minimaliste + vif** (Broken Planet / Corteiz / Amoses).
> Noir profond, produits MEDUSA au centre, **bleu électrique** comme accent
> interactif unique, **vert acide** pour l'urgence. Pas de textures lourdes.

### 1.1 Palette (tokens en place)

| Token | Hex | Usage |
|---|---|---|
| `noir` | `#0A0A0B` | Fond principal (brut, profond) — dominance ~70% |
| `noir-lift` | `#101011` | Cartes, surfaces surélevées |
| `ivoire` | `#F4EFE6` | Texte principal (blanc cassé) |
| **`bleu`** | `#2E4BFF` | **Accent n°1** : CTA, liens, hovers, états actifs, kickers, astérisques marquee |
| `bleu-fonce` | `#1F36C9` | Hover du bleu |
| **`acide`** | `#A6E22E` | **Accent n°2 — urgence + punch** : badges LIMITED, stock bas, **bandeau marquee** |
| `soleil` | `#F2C14E` | Chip statut hero « Prochain drop », astérisques marquee (avec parcimonie) |
| `foret` | `#1F3B2C` | Badges succès / stock dispo (la section Manifesto/ADN a été **supprimée**) |
| `foret-clair` | `#2E5D43` | Succès, stock dispo |
| `brique` | `#A93B2A` | Danger / erreurs uniquement |

Règles :
- Dominance **noir**, **ivoire** pour le texte, **bleu** pour toute action.
- **Un seul accent interactif** : ne pas multiplier les couleurs de CTA.
- Opacités : texte secondaire = ivoire 60%, tertiaire = ivoire 40%.
- Bordures : `border-ivoire/10` sur fond noir.

### 1.2 Typographies

| Rôle | Police | Notes |
|---|---|---|
| Display (titres) | **Anton** (ou Unbounded pour le logo) | Block/condensé, très streetwear. Toujours en MAJUSCULES |
| Body / UI | **Space Grotesk** (400/500) | Épurée, techy, lisible |
| Mono (codes, stock, urgence) | **Space Mono** | Compteurs, "971", "Plus que 3 pièces", prix secondaires |

Échelle type :

```
h1 display  clamp(2.5rem → 6rem)   Anton, uppercase, letter-spacing -0.01em
h2 display  clamp(2rem → 3.75rem)  Anton, uppercase
h3 display  1.5rem → 2.25rem       Anton, uppercase
kicker     0.75rem, Space Mono, uppercase, tracking 0.2em   (ex. "// LE DROP")
body       1rem / 1.6             Space Grotesk 400
small      0.875rem               Space Grotesk 400
micro      0.75rem, Space Mono, uppercase, tracking 0.15em  (badges, labels)
```

Chargement via `next/font` (Anton, Space Grotesk, Space Mono) + variables CSS
`--font-display`, `--font-body`, `--font-mono`.

### 1.3 Textures & ambiances

| Principe | Implémentation | Usage |
|---|---|---|
| **Netteté** | Pas de palmes, pas de dégradés décoratifs | Partout sauf hero |
| **Grain film** | `.hero-grain` (bruit SVG `feTurbulence`, `mix-blend-mode: overlay`, animé `grain-flicker`) | **Hero uniquement** — casse le rendu « généré par IA » |
| **Plein acide** | Bandeau marquee `bg-acide` texte noir, typo display | Le point de couleur vif de la page |
| **Éclats** | Fine bordure `border-ivoire/10` | Cartes, images, sections |

Géométrie : coins **quasi droits** (`rounded-[2px]`), **coins coupés**
(`.clip-notch`, clip-path 12px) sur CTA hero et boutons « Tout voir »,
badges en **pill** (rounded-full).

---

## 2. Wireframe — Home (one-page)

```
┌────────────────────────────────────────────────────────────────┐
│ [logo SVG]                SHOP DROPS              [compte] ⊞ │  header sticky 64px
│────────────────────────────────────────────────────────────────│  noir, backdrop-blur au scroll
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HERO · plein écran · vidéo animée en fond + grain film  │  │
│  │  cadre viewfinder (coins coupés, desktop) · scroll hint  │  │
│  │                                                          │  │
│  │  DROP ACTIF → chip [● Drop 971 — en cours] (acide)       │  │
│  │  PAS DE DROP → chip [● Prochain drop — 971] (soleil)     │  │
│  │  [ LOGO OFFICIEL 2TIJEN.svg — très grand ]               │  │
│  │  Tagline : L'UNDERGROUND ANTILLAIS (ANTILLAIS en bleu)   │  │
│  │                                                          │  │
│  │  DROP ACTIF → [ Voir le drop ] (bleu, coin coupé, glow)  │  │
│  │  PAS DE DROP → chrono J/H/M/S (secondes en bleu)         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MARQUEE — bandeau ACIDE plein, texte noir display       │  │
│  │  DROP 971 * ÉDITION LIMITÉE * KREYÒL UP * (défilement)   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  // LE DROP — "Drops en cours"           [ Tout voir → ]       │
│  ┌───────────┬───────────┬───────────┬───────────┐             │
│  │ 4:5 photo │ 4:5 photo │ 4:5 photo │ 4:5 photo │  grille 4   │
│  │ [LIMITED] │ [LIMITED] │ [LIMITED] │ [LIMITED] │  col → 2 col │
│  │ Hoodie    │ Tee       │ Casquette │ Hoodie    │  mobile     │
│  │ "Gwo La"  │ "Solèy"   │ "Karayib" │ "Jungle"  │             │
│  │ 89€ · +3  │ 45€ · +7  │ 35€ · +3  │ 99€ · +2  │             │
│  │ [Ajouter] │ [Ajouter] │ [Ajouter] │ [Ajouter] │             │
│  └───────────┴───────────┴───────────┴───────────┘             │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NEWSLETTER — "Rejoins le crew" [email] [Rejoindre]       │  │
│  │  + FOOTER : liens · réseaux · legal · Made in Gwada       │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Ordre de lecture / z-index

1. Header sticky (`z-50`) → 2. Hero → 3. Marquee
4. Drops → 5. Newsletter/Footer.
Overlay fixe : uniquement le grain du hero (`.hero-grain`, très subtil).

---

## 3. Wireframes — pages internes

### 3.1 `/shop` — catalogue avec filtres rapides

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER (identique)                                           │
│ // LE CATALOGUE — "971 / Sélection"  [tri: Populaire ↓]      │
│                                                              │
│ FILTRES RAPIDES (chips, scroll horizontal sur mobile)        │
│  ÎLE        [Gwada][Martinique][St-Martin][Haïti][Toutes]    │
│  CATÉGORIE  [T-shirt][Hoodie][Casquette][Bags][Tout]         │
│  TAILLE     [XS][S][M][L][XL][XXL]                           │
│  (filtres actifs = fond soleil, texte noir)                  │
│                                                              │
│ grille produits 3–4 col (même carte que home)                │
│ [pagination infinie / "Charger plus"]                        │
└──────────────────────────────────────────────────────────────┘
```

> Implémentation : module `refinement-list` existant à adapter
> (filtre île = métadonnée produit `island`, catégorie = catégories Medusa,
> taille = options variantes).

### 3.2 `/products/[handle]` — fiche produit

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER (identique)                                           │
│ ┌──────────────────────────┬───────────────────────────────┐ │
│ │ GALERIE 4–6 photos       │  // LE DROP 07 · [LIMITED]    │ │
│ │ - main 4:5 (aspect-ratio)│  Titre (Anton, 2xl-4xl)       │ │
│ │ - miniatures dessous     │  Sous-titre créateur          │ │
│ │ - pinch/zoom mobile      │  → "par K.Vega · Gwada"       │ │
│ │ - compteur "3/6" (mono)  │                               │ │
│ │                          │  PRIX 89€ (mono, large)       │ │
│ │                          │  - stock temps réel :         │ │
│ │                          │   "Plus que 3 pièces" (brique)│ │
│ │                          │  - ou "Backorder dispo"       │ │
│ │                          │                               │ │
│ │                          │  TAILLE  [S][M][L][XL]        │ │
│ │                          │  (sélection = bordure soleil) │ │
│ │                          │                               │ │
│ │                          │  [Ajouter au panier →]        │ │
│ │                          │  livraison "Expédié depuis    │ │
│ │                          │   la 971 · 48h" (micro)       │ │
│ ├──────────────────────────┴───────────────────────────────┤ │
│ │ DESCRIPTION courte (Space Grotesk) + accordéon : matières,│ │
│ │ entretien, sérigraphie, "le saviez-vous ?"               │ │
│ └──────────────────────────────────────────────────────────┘ │
│ [Produits liés du même créateur / même drop]                 │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 `/creators/[handle]` — profil créateur ~~(supprimé)~~

> Section retirée de la maquette (demande utilisateur) — réactivable plus tard
> avec un vrai module Medusa `creator` si besoin.

### 3.4 `/about` — l'ADN ~~(supprimé)~~

> Page retirée avec la section Manifesto (demande utilisateur).

### 3.5 Panier — drawer latéral

```
┌────────────────┐
│ ⊞ PANIER (3)   │  drawer droit, 420px, slide-in + overlay
│ ─────────────── │  fond noir-lift, bordure gauche ivoire/10
│ [img] Hoodie    │  lignes : image 64px, nom, taille, qty,
│      "Gwo La"   │  prix, [×]
│      M · ×1     │
│      89€   [×]  │
│ ─────────────── │
│ Sous-total 89€  │  (mono)
│ Livraison      │  "Offerte dès 120€" ou "8€ — 971 express"
│ TOTAL     89€   │
│ [Checkout →]    │  CTA soleil plein
│ "Plus que 3 pièces sur 50 — drop bientôt terminé" (brique) │
└────────────────┘
```

---

## 4. Composants UI (specs)

### 4.1 Boutons

| Variante | Style | États |
|---|---|---|
| `primary` (CTA) | bg **`bleu`** `#2E4BFF`, texte **blanc**, Space Grotesk 600, uppercase, px-7 py-3 (h-12), radius 2px | hover bg `bleu-fonce` + flèche `→` glisse ; active scale 0.98 ; focus ring 2px offset noir |
| `secondary` | bg `ivoire`, texte `noir` | hover bg blanc pur |
| `inverse` (outline) | transparent, bordure 1px ivoire/25, texte ivoire | hover bordure+texte **`bleu`** |
| `transparent` (ghost) | transparent, texte ivoire/70 | hover texte **`bleu`** |
| `danger` | bg `brique`, texte ivoire | hover brique foncé (`#8C2F21`) |

Tailles : `sm` h-8 px-3 · `md` h-10 px-4 · `lg` h-12 px-6 + texte 1rem.
Tous : uppercase, tracking 0.08em, radius 2px (jamais pill).

### 4.2 Badges & chips

| Badge | Style |
|---|---|
| **LIMITED** | bg **`acide`** `#A6E22E`, texte `noir`, Space Mono 0.7rem uppercase, pill, pulse lent (échelle 1 ↔ 1.04) |
| **DROP EN COURS** | bg `soleil`, texte noir, pill |
| **Plus que X pièces** | transparent, bordure `acide`/60, texte `acide`, mono |
| **Île** (Gwada / Mart. / St-M.) | pill, bordure ivoire/25, mono, texte ivoire/80 |
| **Sérigraphie locale** | pill `foret-clair`, texte ivoire |

### 4.3 Carte produit (drop card)

```
┌─────────────────────────┐
│ ▣▣▣ photo 4:5 (net)     │  top-left : badge LIMITED (acide)
│                         │  hover : image scale 1.05, 500ms — pas de glow
│─────────────────────────│
│ Nom (ivoire, 400)       │  bottom : prix (mono, ivoire) + stock
│ [Ajouter] (bleu)        │  bouton apparaît en hover desktop,
└─────────────────────────┘  toujours visible mobile
```

### 4.4 Carte créateur ~~(supprimé)~~

> Composant retiré avec la section Créateurs — réactivable avec un module
> Medusa `creator` (profil, île, boutique vendeur) si besoin.

### 4.5 Filtres rapides (chips groupées)

- Groupe actif : fond **`bleu`**, texte blanc, border bleu.
- Inactif : transparent, bordure ivoire/15, texte ivoire/60 → hover ivoire.
- Ligne 1 Île · ligne 2 Catégorie · ligne 3 Taille (scroll horizontal mobile).

### 4.6 Formulaire newsletter

Champ : fond `noir-lift`, bordure basse ivoire/30, focus bordure **`bleu`**,
placeholder ivoire/40. Bouton : `inverse` → hover `bleu`. Validation :
"Bienvenu dans le crew 👊" (foret-clair) / erreur (brique).

---

## 5. Micro-animations

| # | Animation | Spec |
|---|---|---|
| 1 | **Hero vidéo / ken-burns** | Vidéo fond `object-cover` (autoplay muted loop) + grain film animé (`grain-flicker`, 7s steps) |
| 2 | **Révélation titre** | `clip-path: inset(0 0 100% 0)` → `inset(0)`, 700ms, stagger 120ms |
| 3 | **Marquee** | Bandeau **acide plein** : `translateX(0 → -50%)`, 30s linear infinite, pause au hover |
| 4 | **Hover carte** | Image scale 1.05 (500ms ease) + bouton slide-up — **pas de glow** (minimal) |
| 5 | **Badge LIMITED pulse** | scale 1 ↔ 1.04, 2.4s ease-in-out infinite |
| 6 | **Compteur de drop** | Space Mono, boîtes J/H/M/S, update 1s, chiffres tabular, secondes en bleu |
| 7 | **Reveal au scroll** | IntersectionObserver : translateY(24px)+opacity 0 → 1, 500ms, stagger 60ms par carte |
| 8 | **Soulignement liens** | `::after` scaleX 0 → 1, 250ms, couleur **`bleu`** |
| 9 | **Header au scroll** | 64px + `backdrop-blur` + bordure basse ivoire/10 (déjà en place, sticky) |
| 10 | **Bouton flèche** | `→` translateX(0 → 4px) au hover |
| 11 | **Dot de statut hero** | `animate-ping` sur la pastille du chip (acide ou soleil) |
| 12 | **Skeleton** | pulse ivoire/10 sur images, pulse sur textes |
| 13 | **Stock : dernier recours** | compteur "Plus que 1" : couleur `acide` + légère pulsation |
| 14 | **Drawer panier** | slide-in right 300ms cubic-bezier(.2,.8,.2,1) + overlay fade |

Reduced motion : respecter `prefers-reduced-motion` (désactiver ken-burns,
marquee, pulse ; garder les fades courts).

---

## 6. Ton & copy — banque de textes

| Zone | Copy |
|---|---|
| Hero (slogan) | **"L'underground antillais"** (ANTILLAIS en bleu) — tagline affichée sous le logo |
| Statuts hero | "● Drop 971 — en cours" (acide) · "● Prochain drop — 971" (soleil) |
| CTA hero | "Voir le drop" (drop actif) — microcopy : "Édition limitée · Sérigraphie locale · Zéro stock fantôme" |
| Chrono | "// Prochain drop dans" + "La 971 ne prévient pas. Sois prêt." |
| Kickers | `// LE DROP` · `// LE CATALOGUE` |
| Section drops | "Drops en cours" — sous-titre : "Éditions limitées. Sérigraphie locale. Zéro stock fantôme." |
| Urgence | "Drop en cours" · "Plus que 3 pièces" · "Édition limitée — 50 pièces" · "Fin du drop dans 02:14:33" |
| Newsletter | "Rejoins le crew. Première sur les drops, zéro spam." · bouton "Rejoindre" |
| Footer | "Made in Guadeloupe / Antilles" · "Fait en Gwada, pensé pour le monde." · réseaux : Instagram, TikTok, YouTube |
| Panier | "Expédié depuis la 971 · 48h" · "Livraison offerte dès 120€" |
| Erreur | "Péyi pa ka réponn" (hors-ligne) — message friendly 404/erreur |

---

## 7. Mapping vers le code existant

| Élément à créer/modifier | Fichier |
|---|---|
| Palette + fonts + animations | `store/apps/storefront/tailwind.config.js` (extend `colors`, `fontFamily`, `keyframes`) |
| Chargement fonts (Anton, Space Grotesk, Space Mono) | `store/apps/storefront/src/app/layout.tsx` + `next/font` |
| CSS global (kicker bleu, marquee, reveal, link-underline, `hero-grain`, `clip-notch`) | `store/apps/storefront/src/styles/globals.css` |
| Variantes boutons (primary→**bleu**, inverse, danger) | `src/modules/common/components/ui/index.tsx` (Button) |
| Badges (Limited→**acide**, Drop en cours, Île) | `src/modules/common/components/ui/index.tsx` (Badge) + composants dédiés |
| Header (logo SVG officiel, menu Shop/Drops, icônes) | `src/modules/layout/templates/nav/index.tsx` |
| Footer (newsletter + "Made in Gwada") | `src/modules/layout/templates/footer/index.tsx` |
| Hero (logo officiel, statut drop, CTA/chrono, grain) | `src/modules/home/components/hero/index.tsx` + `countdown.tsx` |
| Marquee (bandeau acide plein) | `src/modules/home/components/marquee/` |
| Section Drops (grille) | `src/modules/home/components/featured-products/` + carte `product-preview` |
| Carte produit (badge limited acide, zoom, prix) | `src/modules/products/components/product-preview/index.tsx` |
| Filtres (tri FR, chips bleues, pagination bleue) | `src/modules/store/components/refinement-list/` + `pagination/` |
| Fiche produit (galerie, taille, stock temps réel) | `src/modules/products/templates/index.tsx` + `product-actions` |
| Panier drawer | `src/modules/layout/components/cart-dropdown/` |

> Données île (filtres) : métadonnée produit `island` à ajouter sur les
> produits Medusa. Sections Créateurs/Manifesto : supprimées — ne pas
> réintroduire sans module Medusa dédié.

---

## 8. Checklist de validation (avant mise en ligne)

- [ ] Mobile-first : header + grille 2 col + chips scrollables OK
- [ ] Contraste AA sur texte ivoire/noir, accents bleu/acide
- [ ] `prefers-reduced-motion` respecté
- [ ] États focus visibles (accessibilité clavier)
- [ ] Stock temps réel reflète l'inventaire Medusa (variante)
- [ ] Copie sans jargon corporate, accents locaux cohérents
- [ ] Images produit 4:5, nettes, poids optimisé (WebP/AVIF)
- [ ] Un seul accent interactif (bleu) — pas de retour du jaune sur les CTA
