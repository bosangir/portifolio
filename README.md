# Bernard Isekah Osang'ir · Portfolio

Personal portfolio of Bernard Isekah Osang'ir, biostatistician, data scientist and PhD researcher (SCK CEN & Hasselt University).

The site includes an interactive **Stats Lab** with six in-browser simulations:

- Central limit theorem sampler
- Kaplan–Meier curves with a log-rank test
- Bayesian vaccine efficacy (Beta–binomial)
- Two-proportion trial sample size and power curve
- k-means clustering with silhouette and adjusted Rand index
- Cluster-survey coverage with design effects and CI coverage

## Structure

```
index.html        page layout and text
assets/style.css  styling
assets/data.js    editable content: expertise, timeline, publications, skills
assets/main.js    interactions and simulations (plain JavaScript, no dependencies)
```

To update experience, publications or skills, edit `assets/data.js`.

## Run locally

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Publish

The site is static and served with GitHub Pages from the `main` branch root.
