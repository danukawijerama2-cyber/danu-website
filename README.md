# Danu — Personal Brand Website (GitHub Pages + Supabase)

## Included features
- Responsive personal website and gallery lightbox
- Visitor-controlled Dark / Light mode (preference saved in their browser)
- Email/password sign-up and login through Supabase Auth
- Direct message form that stores submissions in Supabase
- Private owner inbox: only the configured owner email can read all submissions (enforced by database RLS)

## 1. Upload to GitHub Pages
Upload all files and the `assets` folder to the root of your `danu-website` repository. Ensure `index.html` is at the repository root. In **Settings → Pages**, choose **Deploy from a branch**, `main`, and `/ (root)`, then Save.

## 2. Configure Supabase (required for login and messages)
1. Create a project at https://supabase.com/ and wait for it to finish provisioning.
2. In the project dashboard, open **Project Settings → API** (or **Connect**) and copy the Project URL and the publishable/anon browser key.
3. Open `supabase-config.js` and replace the example values:
   - `url`: your Supabase Project URL
   - `anonKey`: your public publishable/anon key only
   - `adminEmail`: the exact email address you will use to sign in as the website owner
4. In Supabase, open **SQL Editor → New query**, paste all of `supabase-setup.sql`, and run it.
5. In **Authentication → URL Configuration**, add your published GitHub Pages URL to **Site URL** and **Redirect URLs** (for example `https://YOUR-USERNAME.github.io/danu-website/**`). Use your actual URL.
6. In **Authentication → Providers → Email**, keep email confirmation enabled for better account security. Create an account with the owner email and confirm it from your email before logging in.
7. Wait for GitHub Pages to redeploy, then test sign-up/login and the contact form.

## Security notes
- `supabase-config.js` must contain only the public project URL and publishable/anon key. **Never put a `service_role` key, database password, or other secret in website files.**
- The database uses Row Level Security (RLS). Anonymous visitors can submit a message but cannot read messages. Signed-in users can read their own user-associated submissions. The owner inbox policy allows the exact configured owner email to read the inbox.
- Set the owner email in BOTH `supabase-config.js` and the owner-email policy in `supabase-setup.sql` before running the SQL. In `supabase-setup.sql`, replace `your-email@example.com` with your exact owner login email. If you already ran the SQL, edit that policy in SQL Editor and run the updated SQL again.
- Public signup is enabled by default. If you want only yourself to have an account, disable public signups in Supabase Auth settings after creating and confirming your owner account.
- GitHub Pages is a static host; Supabase provides the authentication and database service. A hosted site will not be able to submit/read messages until Supabase is configured correctly.

## Personalize the website
- Replace social profile placeholders in `index.html` with your real links.
- Replace sample gallery artwork with your own photos, and update titles/captions.
- Update the wording in `index.html` to reflect your real interests.
- Only publish information and photos you are comfortable sharing publicly.
