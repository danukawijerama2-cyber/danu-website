# Danu — Personal Brand Website

A responsive, minimal personal website built with HTML, CSS, and JavaScript. No build tools or package installs are needed.

## Run on Windows

1. Download and extract `danu-personal-brand-custom.zip`.
2. Open the extracted folder.
3. Double-click `index.html` to open it in Chrome, Edge, or Firefox.

Google Fonts need an internet connection; the page and core interactions still work without it.

## Personalize before publishing

### 1. Add your photos
Put your own image files inside `assets/`. In `index.html`, replace the sample artwork inside each gallery card with:
```html
<div class="photo-art">
  <img src="assets/my-photo.jpg" alt="A favourite moment">
</div>
```
Then add this CSS at the end of `styles.css`:
```css
.photo-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
```
Update each gallery card's `data-title` and `data-caption` values. Only publish photos you have permission to share.

### 2. Add your social profile URLs
In `index.html`, find the `FIND ME ONLINE` section. Replace these placeholder URLs with your own:
- Instagram: `https://instagram.com/your-username`
- YouTube: `https://youtube.com/@your-channel`
- TikTok: `https://tiktok.com/@your-username`
- Facebook: `https://facebook.com/your-profile`

The links are intentionally placeholders and do not represent real profiles. Do not publish until you replace them or remove any profile link you do not want to use.

### 3. Set your contact email
Open `script.js` and replace:
```js
const YOUR_EMAIL = "your-email@example.com";
```
with your email address. The form opens the visitor's default email app with the message prepared. It does not send or store messages directly. For a form that submits on the site, use a form service or backend.

### 4. Update the copy
Edit `index.html` to add your real story, interests, and any public links you want to share. Avoid putting private information such as your home address or personal phone number on a public site.

## Publish free with GitHub Pages

1. Sign in or create an account at https://github.com/.
2. Create a new **public** repository, for example `danu-website`.
3. Upload the extracted project files to the repository root: `index.html`, `styles.css`, `script.js`, `README.md`, and the `assets` folder. Upload the extracted files, not just the ZIP.
4. Open **Settings → Pages** in the repository.
5. Select **Deploy from a branch**, choose the `main` branch and `/ (root)` folder, then save.
6. Wait a few minutes and check the URL shown under Settings → Pages.

Official guide: https://docs.github.com/en/pages/quickstart

## Important notes

- This is a static personal brand website and does not include a login system. A real public login needs a secure authentication provider or backend.
- The contact form uses `mailto:` and requires the visitor to have an email app configured.
- Social URLs are placeholders. Replace them before making the site public.
- A custom domain is optional; start with the free GitHub Pages address.
