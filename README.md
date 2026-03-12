# TechCorp — Internal Tools Management Dashboard

Application de gestion d'outils SaaS internes, construite autour de 3 pages principales : `Dashboard`, `Tools` et `Analytics`.

**Stack principale :** `React 19` `Vite 7` `React Router 7` `TanStack Query 5` `Axios` `Tailwind CSS 4` `Recharts` `Lucide React` `Vitest` `Testing Library`

## **🚀 Quick Start**

Installation et lancement en une commande :

```bash
yarn && yarn dev
```

L'application est disponible sur `http://localhost:5173`.

Scripts utiles :

| Commande        | Usage                     |
| --------------- | ------------------------- |
| `yarn dev`      | Lancer en développement   |
| `yarn build`    | Build de production       |
| `yarn preview`  | Prévisualiser le build    |
| `yarn lint`     | Vérifier le code          |
| `yarn test`     | Tests en mode watch       |
| `yarn test:run` | Tests en une passe (CI)   |
| `yarn test:ui`  | Interface visuelle Vitest |

## **🏗️ Architecture**

Le projet est structuré pour séparer clairement pages, logique métier, composants réutilisables et accès API.

```
src/
├── components/
│   ├── layout/
│   │   └── Header.jsx
│   ├── tools/
│   │   ├── ToolsTable.jsx
│   │   ├── ToolsSidebar.jsx
│   │   ├── ToolModal.jsx
│   │   ├── ToolDetailModal.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── Checkbox.jsx
│   └── ui/
│       ├── KPICard.jsx
│       ├── StatusBadge.jsx
│       └── SkeletonCard.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── ToolsPage.jsx
│   └── AnalyticsPage.jsx
├── hooks/
│   ├── useAnalytics.js
│   ├── useRecentTools.js
│   ├── useTools.js
│   └── useAnalyticsPage.js
├── utils/
│   ├── formatters.js
│   └── toolIcons.js
├── styles/
│   └── index.css
├── lib/
│   └── api.js
└── test/
    ├── setup.js
    ├── KPICard.test.jsx
    ├── StatusBadge.test.jsx
    ├── ConfirmModal.test.jsx
    ├── formatters.test.js
    └── useAnalyticsPage.test.jsx
```

Organisation par responsabilité :

- `src/pages` : composition des 3 pages métier.
- `src/components/ui` : briques réutilisables comme `KPICard`, `StatusBadge`, `SkeletonCard`.
- `src/components/tools` : tableau, filtres, modales et interactions CRUD du catalogue.
- `src/hooks` : récupération et dérivation des données par page.
- `src/lib/api.js` : client Axios et appels au JSON server.
- `src/test` : tests unitaires ciblés sur les composants et hooks critiques.

Les 3 pages :

- `Dashboard` : vue synthétique avec KPIs globaux et liste des outils récents.
- `Tools` : catalogue complet avec recherche, filtres, sélection multiple et CRUD.
- `Analytics` : vue de lecture orientée coûts, tendances et visualisations.

## 🎨 Design System Evolution

Le design system s’est structuré en deux phases : une base visuelle définie à partir du mockup initial, puis une extension cohérente sur les pages ajoutées ensuite.

### Foundation

À partir du mockup fourni :

- **Thème dark** : background `#0f1117`, surface `#1a1d27`, bordures `#2a2d3e`
- **Palette d’accent** : purple `#8b5cf6`, blue `#3b82f6`, pink `#ec4899`, green `#10b981`
- **Statuts métier** : Active (vert), Expiring (amber), Unused (rouge)
- **Composants fondateurs** : `KPICard`, `StatusBadge`, `SkeletonCard`, réutilisés sur les 3 pages

### Consistency

En l’absence de nouveaux mockups, la cohérence a été maintenue par :

- la réutilisation des tokens visuels existants ;
- l’extension des composants existants plutôt que l’ajout de nouveaux patterns isolés ;
- des interactions homogènes : hover states, transitions, focus rings ;
- le partage de composants communs comme `StatusBadge` entre `Dashboard`, `Tools` et `Analytics`.

## **🔗 Navigation & User Journey**

```text
Dashboard (/)
  -> "Recent Tools" ouvre Tools (/tools)

Tools (/tools)
  -> Filtres sidebar : statut, département, catégorie, coût
  -> Recherche : filtrage en temps réel
  -> Actions : voir, modifier, supprimer, suppression groupée

Analytics (/analytics)
  -> Insight "Unused tools"    -> /tools?status=unused
  -> Insight "Expiring soon"   -> /tools?status=expiring
  -> Sélection barre top tools -> /tools?search=<nom-outil>
  -> Insight budget            -> /
  -> Outils les plus utilisés  -> /tools?search=<nom-outil>
  -> Usage Analytics           -> /user_tools
```

Les liens depuis Analytics pré-appliquent les filtres de la page Tools via les paramètres d'URL, lus au montage du composant via `useLocation`.

## **📊 Data Integration Strategy**

| Page      | Endpoint                               | Usage                                                                                           |
| --------- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Dashboard | `GET /analytics`                       | KPIs budget, tendances                                                                          |
| Dashboard | `GET /tools?_sort=updated_at&_limit=8` | Outils récemment mis à jour                                                                     |
| Tools     | `GET /tools`                           | Catalogue complet                                                                               |
| Tools     | `POST/PUT/DELETE /tools/:id`           | CRUD                                                                                            |
| Analytics | `GET /analytics`                       | KPIs globaux + points d’ancrage pour la courbe                                                  |
| Analytics | `GET /tools`                           | Répartition par département, insights                                                           |
| Analytics | `GET /user_tools`                      | Relations utilisateur↔outil pour les métriques d’usage (`usage_frequency`, `proficiency_level`) |

**Données dérivées vs réelles :** le JSON server ne fournit pas d’historique mensuel. La courbe d’évolution est donc reconstruite à partir de `current_month_total` et `previous_month_total`, avec une variation déterministe plutôt qu’aléatoire. Ce choix est indiqué dans le sous-titre du graphique.

### Usage Analytics

Deux graphiques sont construits à partir de l’endpoint `/user_tools` :

- **Outils les plus utilisés** : score pondéré par fréquence d’usage (`daily×4`, `weekly×3`, `monthly×2`, `rarely×1`), top 8, cliquable vers le catalogue
- **Activité par département** : score agrégé par `owner_department` de l’outil, trié par score décroissant

Les outils sans correspondance dans le catalogue (`tool_id` introuvable dans `/tools`) sont exclus du classement.

## **📱 Progressive Responsive Design**

| Breakpoint   | Layout                                           |
| ------------ | ------------------------------------------------ |
| `< 640px`    | Colonne unique, hamburger menu, cards empilées   |
| `640–1024px` | Grilles 2 colonnes, sidebar collapsible          |
| `> 1024px`   | Layout complet, sidebar fixe, grilles 4 colonnes |

Recharts `ResponsiveContainer` gère l'adaptation des charts sans configuration supplémentaire.

**Par page :**

- **Dashboard** : grille KPI `grid-cols-2 lg:grid-cols-4`, table scrollable horizontalement sur mobile
- **Tools** : sidebar masquée sur mobile avec toggle, table adaptée
- **Analytics** : `ResponsiveContainer` Recharts adaptatif, grille charts `grid-cols-1 lg:grid-cols-2`, insights `grid-cols-1 sm:grid-cols-3`

Les skeleton screens évitent les layout shifts (CLS) pendant le chargement sur les 3 pages.

## **🧪 Testing Strategy**

```
All files  |  98.86% Stmts  |  94.5% Branch  |  100% Funcs  |  100% Lines
```

| Fichier                     | Ce qui est testé                               |
| --------------------------- | ---------------------------------------------- |
| `KPICard.test.jsx`          | Rendu des variantes, valeurs, trend badge      |
| `StatusBadge.test.jsx`      | Les 3 statuts + fallback                       |
| `ConfirmModal.test.jsx`     | Singular/plural, état loading, callbacks       |
| `formatters.test.js`        | Formatage monétaire, edge cases null/undefined |
| `useAnalyticsPage.test.jsx` | Logique métier complète du hook                |

**Focus `useAnalyticsPage` :** le hook concentre la majorité de la logique dérivée. Les tests couvrent :

- Calcul `utilizationPct` et guard division par zéro
- Agrégation coûts par département avec coercition `Number()`
- Exclusion outils à coût zéro de `topTools`
- Troncature noms > 20 caractères
- Fallback `name: null` → `"Unnamed tool"`
- Comportement avec tableau d'outils vide
- Changement de plage temporelle (`setTimeRange`)
- État d'erreur API

**Branches non couvertes (5.5%) :** guards défensifs (`?? {}`, `?? 0`) qui ne peuvent pas se déclencher avec des données API valides. Couvrir ces cas n'apporterait pas de valeur métier réelle.

## **⚡ Performance Optimizations**

- **Cache TanStack Query** — query keys `["analytics"]` et `["tools"]` partagées entre pages, réduit les double fetch lors des navigations
- **`useMemo` dans `useAnalyticsPage`** — agrégation département, tri topTools et calcul insights recalculés uniquement si les données ou `timeRange` changent
- **Variation déterministe** — seeds fixes dans `buildMonthlySpend`, courbe stable entre re-renders et refetches
- **Skeleton screens** — une `SkeletonCard` par section, évitent les layout shifts sur les 3 pages
- **`staleTime: 5min`** — évite les requêtes réseau lors des navigations retour vers une page déjà visitée

## **🎯 Design Consistency Approach**

Sans mockup pour J7 et J8, la cohérence a été maintenue par cinq principes :

1. **Tokens CSS comme contrat** — toute couleur, espacement ou typographie passe par les variables définies en J6, les valeurs hardcodées sont limitées dans les composants
2. **Composants comme référence** — vérification systématique si `KPICard`, `StatusBadge` ou `SkeletonCard` couvrait le besoin avant tout nouveau markup
3. **Patterns d'interaction identiques** — `hover:bg-white/5`, `transition-colors`, `rounded-xl`, `border border-border` sur l'ensemble des composants
4. **Gradients cohérents** — ordre purple → blue → pink → green → amber → cyan utilisé dans les charts et les icônes KPI
5. **Peu de nouveaux styles introduits en J8** — Recharts configuré avec les variables CSS existantes, tooltips dans le même style que les cards (`bg-surface border border-border rounded-lg`)

## **📈 Data Visualization Philosophy**

Recharts choisi pour son intégration React native déclarative, `ResponsiveContainer` adaptatif sans configuration, personnalisation fine des tooltips et sans dépendance D3 à gérer séparément.

**Intégration design system :**

- **Tooltips custom** (`ChartTooltip`, `PieTooltip`) — même style que les cards
- **`PIE_COLORS`** = palette d'accents dans l'ordre défini en J6
- **Gradient SVG `spendGradient`** = `#8b5cf6` (accent-purple) avec opacité décroissante
- **Axes** = `#94a3b8` (`--color-text-secondary`), grid = `#2a2d3e` (`--color-border`)

| Chart                   | Type                | Justification                                   |
| ----------------------- | ------------------- | ----------------------------------------------- |
| Évolution mensuelle     | Area chart          | Tendance + surface sous la courbe vs budget     |
| Répartition département | Donut               | Proportions relatives, légende intégrée         |
| Top outils coûteux      | Barres horizontales | Comparaison directe de valeurs, labels lisibles |

## **🔮 Next Steps / Complete App Vision**

**Court terme**

- Page Settings : gestion utilisateurs, alertes budget configurables, intégrations tierces
- Authentification : login, rôles Admin / Viewer, permissions par département
- Notifications : centre avec historique, alertes budget en temps réel

**Moyen terme**

- Historique réel : endpoint dédié données mensuelles — supprimer l'interpolation dérivée
- Export : rapports PDF/Excel avec charts et insights
- Bulk import CSV avec validation et preview

**Long terme**

- Prédictions de coûts basées sur les tendances d'adoption
- Intégrations SSO : sync automatique depuis LDAP / Okta
- Benchmarking : comparaison coûts avec données marché anonymisées

En l'état, le projet constitue une base propre pour une application interne de suivi et d'optimisation d'outils SaaS.
