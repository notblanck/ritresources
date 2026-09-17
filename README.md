# ritresources — Academic Resource Sharing Platform

ritresources is a centralized academic resource-sharing platform built for RIT Chennai, replacing scattered WhatsApp forwards of notes, assignments, question papers, and coding resources with one organized, searchable hub.

## Live Demo

Open `index.html` directly in a browser, or enable **GitHub Pages** for this repo (Settings → Pages → Deploy from branch `main` / root) to get a shareable link.

## What's included

This is a front-end demo (no backend) built as a single self-contained HTML file — `index.html` — covering:

- **Home** — animated hero with a real-time 3D orbit scene around the RIT emblem (continuous rotation, pointer parallax, reduced-motion support)
- **Browse Resources** — live search, category tabs, department/semester/subject filters, resource-type checkboxes, sorting, and pagination across sample resources
- **Upload Resource** — a 3-step wizard (Resource Details → Upload File → Review & Submit) with drag-and-drop file upload
- **Departments** — dropdown covering CSBS, CSE, AI & DS, AI & ML, and VLSI Design, linking into...
- **About** — department overview cards and platform stats

`ritresources-hero-only.html` contains just the landing/hero section on its own, if you want to reuse it separately.

## Tech

Plain HTML, CSS, and vanilla JavaScript — no build step, no dependencies. Everything (routing between pages, filtering, the upload wizard, the orbit animation) runs client-side.

## Status

Demo / prototype stage. Uploads and login are UI-only (no backend yet) — actions surface a confirmation toast rather than persisting data.
