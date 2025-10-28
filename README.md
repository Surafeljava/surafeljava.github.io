## Surafel Portfolio (GitHub Pages)

All site files are under this `surafel` folder.

### Local preview
Open `surafel/index.html` directly in your browser.

### Update your content
- Edit `index.html` to update name, roles, experience, and projects.
- Replace project links in the Projects section.
- CV buttons and embed point to `./Surafel%20Resume.pdf`.

### Deploy to GitHub Pages
1. Create a new public repo (e.g., `surafel-portfolio`).
2. Commit the entire project with this `surafel` folder at the repo root.
3. Enable GitHub Pages from the repository Settings → Pages with Source: `Deploy from a branch` and Folder: `/ (root)`.
4. Your site will be served from the subpath `.../<repo>/surafel/` (open that URL to view).

#### Custom domain (optional)
- If you use a custom domain, configure redirects or set the site root to `/surafel/`.

### Theming
- Dark by default with a selector for Dark, Light, or System. Preference stored in `localStorage`.

### Structure
- `index.html`: Markup and sections
- `styles.css`: Theme and layout
- `script.js`: Theme persistence and small enhancements
- `Surafel Resume.pdf`: Your CV


