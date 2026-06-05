# Martiqaad Aroos

Mashruuc martiqaad aroos — 3 naqshadood, admin, QR code scan → website.

## Bilow (ugu horeysa)

Fur **`index.html`** ama **`start.html`** (waxay u wareegtaa index).

| # | Fayl | Waxa |
|---|------|------|
| 1 | `index.html` | Hub — dooro waxa aad samaynayso |
| 2 | `edit.html` | Beddel magacyo, qoraal, sawirro, muusig, goobta |
| 3 | `classic.html` | Martiqaad **Index** |
| | `naqsho2.html` | Naqsho 2 — Jardiino |
| | `naqsho3.html` | Naqsho 3 — Habeen Casri |
| 4 | `qr.html` | QR Code — daabac / scan |

## Marti (martiqaad)

- **Ma muuqdaan:** Bogagga, Beddel, QR Code, WhatsApp
- **Waa la arkaa:** Martiqaad qurux badan + magac footer

## QR + internet

1. Ku shub **GitHub Pages** (ama Netlify)
2. `edit.html` → geli **Link internet** → Kaydi
3. `qr.html` → samee QR → daabac
4. Scan telefoon → furaa `https://.../classic.html`

`file://` (folder desktop) **ma shaqeeyo** scan telefoon.

## Kaydin

- Waxaad beddesho → **Kaydi Hadda** (`edit.html`)
- Kaydinta: browser `localStorage` + muusig `IndexedDB`
- Soo daji JSON backup haddii aad rabto

## GitHub Pages

```bash
cd wedding
git init
git add .
git commit -m "Martiqaad aroos"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

Settings → Pages → `main` / root → link: `https://USER.github.io/REPO/`

## Faylasha muhiimka ah

| Fayl | Waxa |
|------|------|
| `wedding-base.js` | Config asalka |
| `config-loader.js` | Ku dar kaydinta browser |
| `app.js` | Martiqaad + muusig + scan |
| `qr-lib.js` | QR offline |
| `wedding-editor.js` | Admin |
