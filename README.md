# Houssam Jardini — portfolio

Live: https://houssamjardini.github.io/Portfolio/

React + Vite, a three.js point-cloud hero (with a Canvas 2D fallback when WebGL
is unavailable), Lenis smooth scrolling and Framer Motion for the project drawer.

## Edit the content

- All text: `src/data/portfolioData.js`
- Project images / videos: drop files into `src/assets/projects/<slug>/`
  (`01-name.webp`, `02-demo.mp4`, ...). A `02-demo.poster.webp` next to a video
  becomes its poster. They are picked up automatically.
- CV downloads: `public/Houssam_Jardini_CV.pdf` and `public/Houssam_Jardini_CV_FR.pdf`

## Run

```bash
npm install
npm run dev
npm run build
```

Every push to `main` builds and publishes to the `gh-pages` branch
(`.github/workflows/deploy.yml`).
