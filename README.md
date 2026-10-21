# Photo Gallery

> Unsplash image viewer, originally a FrontEnd challenge for NUWE (2023) and modernized in 2026.

[![CI](https://github.com/wavesforweirdos/photo-gallery/actions/workflows/ci.yml/badge.svg)](https://github.com/wavesforweirdos/photo-gallery/actions/workflows/ci.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/wavesforweirdos/photo-gallery/badge)](https://www.codefactor.io/repository/github/wavesforweirdos/photo-gallery)

**Demo:** https://wavesforweirdos.github.io/photo-gallery/

![Photo Gallery: search results for "mountains"](docs/screenshot.jpg)

Gallery that browses photos from the [Unsplash API](https://unsplash.com/developers). Search by keyword, load more results and open any photo to see its detail.

## Features

- Search Unsplash photos by keyword, with the term kept in the URL so searches can be shared
- "Load more" pagination (30 photos per page)
- Mosaic grid with thumbnails and loading skeletons; the most liked photos of each batch are wider, and every row keeps the same height
- Photo detail view with description, location and author attribution; close it with the round button or `Esc`
- Clear messages for empty results, errors and Unsplash's rate limit (50 requests/hour in demo mode)

## Technologies

| | |
|---|---|
| **Framework** | [Vue 3](https://vuejs.org/) (Options API) |
| **Routing** | [Vue Router 5](https://router.vuejs.org/) with hash history, so it works on static hosting |
| **Build tool** | [Vite 8](https://vite.dev/) |
| **Data** | [Unsplash API](https://unsplash.com/developers) via `fetch` |
| **Styling** | Plain CSS (grid) |
| **Testing** | [Vitest](https://vitest.dev/) and [Vue Test Utils](https://test-utils.vuejs.org/) with jsdom |
| **Quality** | [ESLint 10](https://eslint.org/) (flat config) and [CodeFactor](https://www.codefactor.io/) |
| **CI/CD** | GitHub Actions and GitHub Pages |

## Getting started

```sh
git clone https://github.com/wavesforweirdos/photo-gallery
cd photo-gallery
npm install
cp .env.example .env   # add your Unsplash access key
npm run dev
```

| Script | Description |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with ESLint |
| `npm test` | Run the Vitest test suite |
