# JudgmentCalc Frontend

React, TypeScript, and Vite frontend for JudgmentCalc.

## Local development

Requirements:

- Node.js 20 or newer
- npm 10 or newer

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run build
```

The production build is written to `dist/`. The build also generates the sitemap and server-visible HTML metadata for public routes.

## DigitalOcean production deployment

Production details:

- Server source: `/home/Lawyer-Case-Management`
- Nginx document root: `/home/Lawyer-Case-Management/dist`
- Domains: `judgmentcalc.com` and `www.judgmentcalc.com`
- API: `api.judgmentcalc.com` (separate service; this procedure does not modify it)

Run these commands from the DigitalOcean Droplet console as an authorized administrator. Execute each stage separately and stop if a command reports an error.

### 1. Inspect the server before changing anything

```bash
systemctl status nginx --no-pager
git -C /home/Lawyer-Case-Management status -sb
git -C /home/Lawyer-Case-Management log -1 --oneline
df -h /
```

Do not pull when tracked application files contain unexpected modifications. Generated sitemap changes can be preserved recoverably with:

```bash
git -C /home/Lawyer-Case-Management stash push -m "pre-deploy generated sitemap backup" -- public/page-sitemap.xml public/sitemap_index.xml
```

### 2. Download the latest source safely

```bash
git -C /home/Lawyer-Case-Management fetch origin main
git -C /home/Lawyer-Case-Management status -sb
git -C /home/Lawyer-Case-Management pull --ff-only origin main
git -C /home/Lawyer-Case-Management log -1 --oneline
```

`--ff-only` refuses to create a merge commit when server history has diverged. Updating the source does not change the live `dist` directory.

### 3. Build away from the live website

Replace `COMMIT_SHA` below with the short commit shown by the previous `git log` command, for example `aadadfb`.

```bash
git clone --no-hardlinks /home/Lawyer-Case-Management /root/judgmentcalc-release-COMMIT_SHA
npm ci --prefix /root/judgmentcalc-release-COMMIT_SHA
npm run build --prefix /root/judgmentcalc-release-COMMIT_SHA
ls -lah /root/judgmentcalc-release-COMMIT_SHA/dist
```

Confirm that the build succeeds and that `dist/` contains `index.html`, `assets/`, sitemap files, and the generated public route directories.

### 4. Back up live files and stage the release

Use the same `COMMIT_SHA`. The two success messages must appear before continuing.

```bash
mkdir -p /root/judgmentcalc-deploy-backup
cp -a /home/Lawyer-Case-Management/dist /root/judgmentcalc-deploy-backup/dist-before-COMMIT_SHA
cp -a /root/judgmentcalc-release-COMMIT_SHA/dist /home/Lawyer-Case-Management/dist-next-COMMIT_SHA
test -f /root/judgmentcalc-deploy-backup/dist-before-COMMIT_SHA/index.html && echo "Live backup ready"
test -f /home/Lawyer-Case-Management/dist-next-COMMIT_SHA/index.html && echo "New release ready"
```

### 5. Activate the validated release

Only run this after both validation messages appear:

```bash
mv /home/Lawyer-Case-Management/dist /home/Lawyer-Case-Management/dist-previous-COMMIT_SHA && mv /home/Lawyer-Case-Management/dist-next-COMMIT_SHA /home/Lawyer-Case-Management/dist
```

Nginx continues running and immediately serves the new static files. No Nginx restart is normally required.

### 6. Verify production

```bash
nginx -t
curl -I https://judgmentcalc.com/
curl -I https://judgmentcalc.com/about-us/
curl -I https://judgmentcalc.com/contact-us/
curl -I https://judgmentcalc.com/privacy-policy/
curl -I https://judgmentcalc.com/terms-and-conditions/
curl -I https://judgmentcalc.com/sitemap_index.xml
```

Every public URL should return `200 OK`. Also verify the pages in a private browser window or with a hard refresh.

## Rollback

If production validation fails, preserve the failed release and restore the previous build. Replace `COMMIT_SHA` with the same identifier used for deployment:

```bash
mv /home/Lawyer-Case-Management/dist /home/Lawyer-Case-Management/dist-failed-COMMIT_SHA && mv /home/Lawyer-Case-Management/dist-previous-COMMIT_SHA /home/Lawyer-Case-Management/dist
nginx -t
curl -I https://judgmentcalc.com/
```

This rollback only changes static frontend files. It does not touch the API, database, SSL configuration, or Nginx service.

## Important safety notes

- Never use `git reset --hard`, recursively delete the project, or run an operating-system upgrade as part of a frontend deployment.
- Never build directly into the live `dist/`; Vite clears its output directory before writing new files.
- Keep the previous build and `/root/judgmentcalc-deploy-backup` until production has been visually verified.
- Do not restore the sitemap stash after a successful build unless those generated changes are intentionally needed.
- The large JavaScript chunk message from Vite is a performance warning, not a failed build.
