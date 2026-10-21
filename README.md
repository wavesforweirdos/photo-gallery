# PHOTO-GALLERY

> Unsplash image viewer app for FrontEnd NUWE Challenge

**[![CodeFactor](https://www.codefactor.io/repository/github/wavesforweirdos/photo-gallery/badge)](https://www.codefactor.io/repository/github/wavesforweirdos/photo-gallery)**

**Demo:** https://wavesforweirdos.github.io/photo-gallery/

Gallery built with Vue 3, Vue Router and Vite that browses photos from the [Unsplash API](https://unsplash.com/developers). Click a photo to see its detail.

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
| `npm run lint` | Lint with [ESLint](https://eslint.org/) |

## Deployment

Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`. The Unsplash key is read from the `VITE_UNSPLASH_ACCESS_KEY` repository secret. Note that any key used in a client-side app ends up in the bundle, so use a key restricted to the demo rate limit.

## License 
Copyright 2023 wavesforweirdos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
