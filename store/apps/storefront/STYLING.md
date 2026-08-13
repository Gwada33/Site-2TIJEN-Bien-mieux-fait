# Guide de Styling — Storefront 2TIJEN (Medusa + Next.js)

Fichier de référence à relire avant **toute** modification visuelle du front.
Il reflète la direction actuelle : **minimaliste, brute, produits MEDUSA mis en
avant**, sur une base noir profond avec des accents vifs façon
**Broken Planet / Corteiz / Amoses** (émeraude profond + or brass).

> ⚠️ La v1 « underground » (grain photo, palmes en filigrane, dégradés,
> textures béton) a été **abandonnée** — ne pas la réintroduire.

---

## 1. Stack technique

- **Next.js 15** (App Router, Server Components) — port 8000
- **React 19** · **Tailwind CSS 3** + preset **`@medusajs/ui-preset`**
- **`tailwindcss-radix`**, **`clsx`** (exporté en `clx`), Radix UI, Headless UI
- Monorepo : backend Medusa dans `store/apps/backend`, storefront dans
  `store/apps/storefront` (deps hoistées → utiliser
  `../../node_modules/.bin/next` depuis `apps/storefront`)

---

## 2. Direction visuelle (1 phrase à garder en tête)

> **Noir teinté vert profond + typo display massive + produits netteté maximale.
> L'émeraude est LE seul accent interactif, l'or/brass signale l'exclusivité
> (LIMITED, marquee). Le grain film est réservé au hero — analogique,
> pas IA. Palette luxueuse : vert émeraude profond + or brass + crème.**

| Principe | Application |
|---|---|
| Doux & luxueux | Noir teinté vert (`#0B0F0D`), crème ivoire, émeraude profond, or brass — pas de couleurs criardes |
| Vif (retenu) | Émeraude `#2E8B63` pour CTA, liens, états actifs + bandeau marquee **or** |
| Exclusivité | Or brass `#C9A24B` pour badges LIMITED, alertes stock, bandeau marquee |
| Produits au centre | Thumbnails 4:5 nets, grille propre, prix en mono, hover zoom subtil |

---

## 3. Tokens de design (`tailwind.config.js` → `theme.extend.colors`)

| Token | Valeur | Usage |
|---|---|---|
| `noir` / `noir-lift` | `#0B0F0D` / `#111712` | Fond de page / cartes, sections (noir teinté vert profond) |
| `ivoire` | `#F4EFE6` | Texte principal (blanc cassé crème) |
| **`emeraude` / `emeraude-fonce` / `emeraude-clair`** | `#2E8B63` / `#1F5C40` / `#4CBF8A` | **Accent n°1** : CTA, liens, hover, états actifs, kickers, astérisques marquee |
| **`or` / `or-fonce` / `or-clair`** | `#C9A24B` / `#A8853C` / `#E3C77E` | **Accent n°2 — exclusivité** : badges LIMITED, stock bas (« Plus que 3 »), **bandeau marquee** |
| `soleil` | `#F2C14E` | Réserve : astérisques marquee (or chaud) — **avec parcimonie** |
| `foret` / `foret-clair` | `#1F3B2C` / `#2E5D43` | Badge succès / stock dispo |
| `brique` | `#A93B2A` | Danger/erreurs uniquement |

### Règle d'or des accents

- **Un seul accent interactif** : `emeraude` partout (bouton primaire, liens,
  chip active, page active de pagination, kicker).
- `or` réservé à l'**exclusivité** (badges LIMITED / stock faible) **+ bandeau marquee** — jamais pour un CTA principal.
- `soleil` : pointe de chaleur uniquement (astérisques marquee).
- `foret` : badges succès / stock dispo uniquement.

---

## 4. Typographie

Chargées via `next/font` dans `src/app/layout.tsx`, exposées en variables
CSS (`--font-display`, `--font-body`, `--font-mono`) puis mappées dans
`tailwind.config.js` (`fontFamily.display/body/mono`).

| Rôle | Police | Classes |
|---|---|---|
| Titres / slogans | **Anton** (block/graffiti) | `font-display uppercase leading-[0.95]` |
| Corps de texte | **Space Grotesk** | par défaut via `font-body` sur `body` |
| Meta / labels / prix | **Space Mono** | `font-mono text-xs uppercase tracking-[0.2em]` |

### Conventions

- **Titres de section** : `font-display uppercase text-3xl small:text-5xl`
  en `text-ivoire`.
- **Kickers** (libellé au-dessus des titres) : classe `.kicker`
  (`font-mono text-xs uppercase tracking-[0.25em] text-emeraude`) — définie dans
  `globals.css`, à utiliser avec `{"// Le texte"}` (règle ESLint).
- **Meta lines** : mono uppercase avec tracking large, `text-ivoire/40-70`.
- Toujours en **majuscules** pour les titres et labels — l'énergie vient du
  display, pas du décor.

---

## 5. Composants UI partagés — `src/modules/common/components/ui/index.tsx`

| Composant | État actuel |
|---|---|
| `Button` | `primary` = `bg-emeraude text-white hover:bg-emeraude-fonce` (recoins `rounded-[2px]`, uppercase, tracking) · `secondary` ivoire · `transparent` `hover:text-emeraude` · `inverse` `hover:border-emeraude hover:text-emeraude` · `danger` brique |
| `Badge` | `limited` = **`bg-or text-noir`** · `drop` = `bg-soleil text-noir` · `stock`/`low` = bordure `or` · `island` = bordure ivoire · `success` = `bg-foret-clair` |
| `Heading` | `font-display uppercase` (h1/h2/h3) |
| `Container` | `bg-noir-lift border border-ivoire/10 rounded-[2px] p-4` |
| `Input` | `bg-noir-lift border-ivoire/20` → focus `border-emeraude`, texte `text-ivoire`, caret émeraude, label flottant `text-ivoire/50`, erreur `*` en `brique` |
| `Label`, `Checkbox`, `RadioGroup`, `Table` | utilitaires Medusa (à restyler au besoin avec les tokens ci-dessus) |

> Modifier **un seul endroit** (`ui/index.tsx`) pour changer tous les boutons
> et badges du site.

### 5.1 Modal panier — `src/modules/layout/components/cart-dropdown/index.tsx`

- Fond **`bg-noir-lift`** + bordure `border-ivoire/15` + ombre profonde (fini le `bg-white`).
- Titre « Panier » en `font-display`, en-tête séparé par `border-ivoire/10`.
- Textes : `text-ivoire` (titre, prix), `text-ivoire/50-70` (métas, Qté, sous-total hors taxes).
- CTA « Voir le panier » = `Button primary` (émeraude). État vide : pastille `bg-ivoire/15`, « Ton panier est vide. » + « Voir les drops ».
- **Contraste AA** : jamais de gris clair sur blanc — tout sur fond noir/ivoire.

### 5.2 Pages compte (login / register) — `src/modules/account/components/{login,register}/index.tsx`

- Titres « Bon retour » / « Rejoins le crew » en `font-display uppercase`.
- Sous-titres `text-ivoire/70`, liens légaux → **vraies pages** (`/confidentialite`, `/cgv`) en `text-emeraude underline`.
- Bannière de vérification : `border-emeraude/40 bg-emeraude/10 text-ivoire`.
- Boutons : « Se connecter » / « Créer mon compte » (primary).
- Layout compte (`account-layout.tsx`) : **`bg-noir-lift` + bordure `ivoire/10`** (plus de `bg-white`), nav séparée par `border-r`, section questions en français.
- **Contraste AA** : texte secondaire jamais en dessous de `text-ivoire/50` sur `noir` / `noir-lift`.

---

## 6. Fichiers clés à styler

| Élément | Fichier |
|---|---|
| Layout racine, polices, metadata | `src/app/layout.tsx` |
| CSS global (kicker, marquee-track, reveal, link-underline, autofill) | `src/styles/globals.css` |
| **Header** (logo SVG officiel, menu Shop/Drops, compte, panier) | `src/modules/layout/templates/nav/index.tsx` |
| **Footer** (newsletter, légal, « Made in Guadeloupe ») | `src/modules/layout/templates/footer/index.tsx` |
| **Hero** (logo officiel + vidéo fond + statut drop + CTA/chrono) | `src/modules/home/components/hero/index.tsx` + `countdown.tsx` |
| **État du drop** (actif ↔ chrono) | `src/lib/data/drop.ts` + `src/lib/config.ts` (`heroConfig`) |
| **Marquee** (bandeau **or** plein, texte noir display) | `src/modules/home/components/marquee/index.tsx` |
| **Section Drops** (rail produits par collection) | `src/modules/home/components/featured-products/product-rail/index.tsx` |
| **Catalogue `/store`** | `src/modules/store/templates/index.tsx` + `paginated-products.tsx` |
| **Filtres / tri** | `src/modules/store/components/refinement-list/**` + `src/modules/common/components/filter-radio-group/index.tsx` |
| **Pagination** | `src/modules/store/components/pagination/index.tsx` |
| **Carte produit** (badge limited, thumbnail, prix) | `src/modules/products/components/product-preview/index.tsx` (+ `thumbnail`, `price`) |
| **Page produit** (fiche — à restyler, cf. §9) | `src/modules/products/templates/**` |

---

## 7. Décisions de design déjà appliquées (état actuel)

1. **Hero** : plein écran, **logo officiel `public/2TIJEN.svg`** seul et centré
   (`h-[36vh] w-auto`, remplaçable via `NEXT_PUBLIC_HERO_LOGO_URL` — pas d'anneau
   ni de décor autour), **vidéo animée en fond**
   (`NEXT_PUBLIC_HERO_VIDEO_URL`, `object-cover`, masquée si
   reduced-motion, overlay noir/45 + fondu vers la page), **grain film subtil**
   (`.hero-grain`). Deux états pilotés par `getDropStatus()`
   (`src/lib/data/drop.ts`) :
   - **Drop actif** → chip « ● Drop — en cours » (or, dot `animate-ping`)
     + CTA émeraude « Voir le drop » (coin coupé `.clip-notch`, glow via
     `filter:drop-shadow`, hover lift + flèche).
   - **Pas de drop** → chip « ● Prochain drop » (soleil) + chrono
     « Prochain drop dans » (J/H/M/S, boîtes noir/70 bordées, secondes en
     émeraude, tick 1 s). Date via `NEXT_PUBLIC_NEXT_DROP_DATE` (ISO) ; vide →
     « Date à annoncer ».
   - Le status du drop est lu en **`no-store`** pour basculer sans rebuild ;
     quand l'utilisateur définira le stockage backend, basculer sur une
     revalidation par tag.
   - **Entrée** : CSS pur déterministe — logo (blur 8px → net, scale 1.06 → 1,
     montée douce), tagline, CTA « pop » élastique, nav légale en fade ;
     delays 0/200/400/600ms. animejs : glow émeraude « respirant » du CTA
     (non-critique).

### Config hero — à remplir (`store/apps/storefront/.env.local`)

| Variable | Rôle | Exemple |
|---|---|---|
| `NEXT_PUBLIC_HERO_VIDEO_URL` | Vidéo animée plein écran (MP4/WebM, hôte quelconque) | `https://cdn.example.com/hero.mp4` |
| `NEXT_PUBLIC_HERO_LOGO_URL` | Logo du hero (vide = logo officiel local `public/2TIJEN.svg`) | `/2TIJEN.svg` |
| `NEXT_PUBLIC_NEXT_DROP_DATE` | Date ISO du prochain drop (vide = « Date à annoncer ») | `2026-09-05T18:00:00Z` |

> Ces valeurs sont **inlinées au build** par Next.js : un changement de
> logo/vidéo/date nécessite un rebuild. Le stockage définitif (backend) est
> en attente — cf. `heroConfig` dans `src/lib/config.ts` et
> `getDropStatus()` dans `src/lib/data/drop.ts`.
2. **Marquee** : bandeau **`bg-or`** plein (brass luxueux), texte noir en
   **`font-display`**, séparateurs `*` alternés `text-noir/40` et
   `text-emeraude`.
3. **Kickers** : émeraude (`text-emeraude`).
4. **Catalogue** : titre « Le catalogue » en display + kicker « // La sélection »,
   sidebar filtres avec bordure droite (`small:border-r`), tri en français
   (« Trier » → Nouveautés / Prix), chips de filtres sombres avec état actif
   **rempli émeraude**, pagination avec page active **émeraude**.
5. **Badges produits** : `limited` → or sur noir (visible sur les
   cards via `product.metadata?.limited === "true"`).
6. **Metadata** : tous les titres SEO → « … | 2TIJEN », checkout rebrandé.
7. Le grain film a été **réintroduit sur le hero uniquement** (`.hero-grain` :
   bruit SVG `feTurbulence`, très subtil, désactivé si reduced-motion) pour
   casser le rendu « généré par IA ». Le reste de la page reste net. Les
   sections **Créateurs** et **À propos/Manifesto** ont été **supprimées**
   (home = Hero → Marquee → Drops → Footer).

---

## 8. Composants MEDUSA à mettre en avant (principe)

Le catalogue doit **présenter les données Medusa** (produits, collections,
prix par région, stock) sans fioritures :

- Thumbnail `aspect-[4/5]` avec bordure `ivoire/10`, zoom 105% au hover
  (déjà en place dans `thumbnail/index.tsx`).
- Prix via `getProductPrice` (mono) — la devise suit la région (`gf`/`gp`…).
- Ne pas cacher les informations : titre, prix, badge limited, collection.
- Filtres = vrais filtres Medusa (`option_value_id`, `sortBy`, catégories).

---

## 9. Roadmap de styling (prochaines étapes)

- [ ] **Fiche produit** (`src/modules/products/templates/index.tsx`) : galerie
      4-6 photos, sélecteur taille (chips émeraude), stock en temps réel
      (« Plus que 3 pièces » en or), CTA émeraude « Ajouter au panier ».
- [ ] **Filtres île / catégorie / taille** sur le catalogue (le tri et les
      options existent déjà ; ajouter les chips îles via metadata produit `island`).
- [ ] Panier / checkout : aligner sur les tokens (actuellement Medusa par
      défaut).
- [ ] Vérifier les pages compte / register (texte « Medusa Store » restant
      dans `modules/account/**` et `side-menu`).

---

## 10. Lancer le front

```bash
# depuis store/apps/storefront
npm run dev                       # turbopack, hot reload → http://localhost:8000
# ou build + prod (rebuild nécessaire après chaque modif source)
../../node_modules/.bin/next build
../../node_modules/.bin/next start -p 8000
```

Le backend Medusa tourne sur http://localhost:9000 (admin : /app).
⚠️ Le build nécessite le backend démarré (generateStaticParams des
collections). En prod (`next start`), **rebuild obligatoire** après toute
modification de source.
