# rukav-swiss.ch

Website of **RuKAV** — the Russian-speaking Cultural and Academic Association
(*Russischsprechender Kultureller und Akademischer Verein*) in Zurich, Switzerland.

Built with [Hugo](https://gohugo.io/), based on the
[Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) theme (MIT), and
deployed to GitHub Pages.

Live site: <https://rukav-swiss.ch/>

## Requirements

- Hugo **extended**, version `0.164.0` (the version CI builds with — see
  [.github/workflows/hugo.yaml](.github/workflows/hugo.yaml))

No Node.js toolchain is needed: CSS is assembled by Hugo from `assets/ananke/css/`.

## Local development

```bash
git clone --recurse-submodules git@github.com:rukav-swiss/website-rukav.git
cd website-rukav
hugo server
```

Then open <http://localhost:1313/>.

To produce a production build into `public/`:

```bash
hugo --gc --minify
```

## Layout

| Path | Contents |
|---|---|
| `content/en/`, `content/ru/` | Page content, one directory per language |
| `config.toml` | Site config: languages, menus, params |
| `config/_default/params.toml` | Ananke theme params (social networks, layout) — load-bearing |
| `layouts/` | Templates; these override the theme |
| `assets/images/` | Photos, processed by Hugo (resized to WebP + `srcset`) |
| `static/` | Files served verbatim: logos, favicon, PDFs |
| `i18n/` | UI string translations |

## Adding content

### A new event

Create `content/en/events/YYYY-MM-DD_slug.md` (and the Russian counterpart in
`content/ru/events/`):

```yaml
---
date: 2026-09-01T00:00:00+02:00
title: "Event title"
description: "One sentence — used for SEO and link previews."
featured_image: "images/your-photo.jpg"
tags: []
---
```

Always fill in `description`: it becomes the page's meta description and the
text shown when the link is shared.

### Images

Put photos in **`assets/images/`**, not `static/`. Hugo resizes them to WebP at
several widths and emits a `srcset`, so a 6 MB camera JPEG is served as ~100 KB.
Reference them from Markdown with a normal image link and meaningful alt text:

```markdown
![Description of the photo](images/your-photo.jpg)
```

Files in `static/images/` (the logos) are served untouched.

If an image must **not** be recompressed — a QR code, or anything where
artifacts would matter — add its path to `params.verbatim_images` in
`config.toml`. It is then published byte-for-byte, but still gets `width` and
`height` so it does not shift the layout. The bank QR code is handled this way:
it has to stay scannable, and Hugo cannot produce truly lossless WebP.

### Link previews

`featured_image` doubles as the Open Graph / Twitter card image, cropped to
1200x630. Pages without one fall back to `params.social_image` in `config.toml`.

## Deployment

Pushing to `main` triggers [.github/workflows/hugo.yaml](.github/workflows/hugo.yaml),
which builds the site and deploys it to GitHub Pages. The custom domain is pinned
by [static/CNAME](static/CNAME).

## Licence

Theme code derived from Ananke is MIT licensed — see [LICENSE.md](LICENSE.md).
Site content and photographs belong to the RuKAV association.
