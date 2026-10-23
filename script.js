const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

// Theme switcher: remembers the visitor's preference in this browser.
const themeToggle = $("#themeToggle");
const themeColorMeta = $("#themeColorMeta");
const savedTheme = localStorage.getItem("danu-theme");
if (savedTheme === "dark") document.body.classList.add("dark-theme");
function updateThemeControl() {
  const dark = document.body.classList.contains("dark-theme");
  themeToggle.innerHTML = dark ? '☀ <span>Light mode</span>' : '☾ <span>Dark mode</span>';
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  themeColorMeta.setAttribute("content", dark ? "#171a16" : "#f8f8f5");
}
updateThemeControl();
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("danu-theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
  updateThemeControl();
});

// Mobile navigation
const nav = $("#nav");
const menuToggle = $("#menuToggle");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Scroll reveal animation with an accessible fallback
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => observer.observe(el));
} else { $$(".reveal").forEach(el => el.classList.add("visible")); }

// Supabase authentication + database-backed contact submissions.
const config = window.SUPABASE_CONFIG || {};
const configReady = config.url && config.anonKey && !config.url.includes("YOUR-PROJECT-ID") && !config.anonKey.includes("YOUR_SUPABASE");
const adminEmail = String(config.adminEmail || "").trim().toLowerCase();
let supabaseClient = null;
if (configReady && window.supabase?.createClient) {
  supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
} else {
  $("#authStatus").textContent = "Setup needed: add your Supabase Project URL and publishable/anon key in supabase-config.js.";
  $("#formStatus").textContent = "Setup needed: connect Supabase using supabase-config.js and run the SQL setup in supabase-setup.sql.";
}

let authMode = "login";
function setAuthMode(mode) {
  authMode = mode;
  $("#showLogin").classList.toggle("active", mode === "login");
  $("#showSignup").classList.toggle("active", mode === "signup");
  $("#authSubmit").innerHTML = mode === "login" ? 'Log in <span>↗</span>' : 'Create account <span>↗</span>';
  $("#authPassword").setAttribute("autocomplete", mode === "login" ? "current-password" : "new-password");
  $("#authStatus").textContent = mode === "login" ? "Enter your email and password to sign in." : "Use a valid email and a strong password (8+ characters).";
}
$("#showLogin").addEventListener("click", () => setAuthMode("login"));
$("#showSignup").addEventListener("click", () => setAuthMode("signup"));

$("#authForm").addEventListener("submit", async event => {
  event.preventDefault();
  const status = $("#authStatus");
  if (!supabaseClient) { status.textContent = "Supabase is not configured yet. Follow the setup guide in README.md."; return; }
  const email = $("#authEmail").value.trim();
  const password = $("#authPassword").value;
  const submit = $("#authSubmit"); submit.disabled = true;
  status.textContent = authMode === "login" ? "Signing in…" : "Creating your account…";
  try {
    const result = authMode === "login"
      ? await supabaseClient.auth.signInWithPassword({ email, password })
      : await supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + window.location.pathname + "#account" } });
    if (result.error) throw result.error;
    if (authMode === "signup" && !result.data.session) {
      status.textContent = "Account created. Check your email for the confirmation link, then log in.";
    } else {
      status.textContent = "Success.";
      await renderAuthState(result.data.session);
    }
  } catch (error) {
    status.textContent = friendlyAuthError(error.message);
  } finally { submit.disabled = false; }
});

function friendlyAuthError(message) {
  const m = String(message || "");
  if (/invalid login credentials/i.test(m)) return "Email or password is incorrect.";
  if (/email not confirmed/i.test(m)) return "Please confirm your email using the link we sent you.";
  if (/password should be at least/i.test(m)) return "Choose a password with at least 8 characters.";
  if (/user already registered/i.test(m)) return "This email already has an account. Try logging in.";
  return m || "Something went wrong. Please try again.";
}

$("#logoutButton").addEventListener("click", async () => {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  $("#authStatus").textContent = error ? error.message : "You have been signed out.";
  await renderAuthState(null);
});

async function renderAuthState(session) {
  const forms = $("#authForms"), signedIn = $("#signedInPanel"), inbox = $("#inboxPanel");
  if (!session?.user) {
    forms.hidden = false; signedIn.hidden = true; inbox.hidden = true; return;
  }
  forms.hidden = true; signedIn.hidden = false;
  $("#signedInEmail").textContent = session.user.email || "Signed-in user";
  const isAdmin = Boolean(adminEmail) && (session.user.email || "").toLowerCase() === adminEmail;
  $("#signedInNote").textContent = isAdmin ? "Owner account detected. Your private message inbox is available below." : "You are signed in. Messages sent while signed in can be associated with your account.";
  inbox.hidden = !isAdmin;
  if (isAdmin) await loadInbox();
}

async function loadInbox() {
  const status = $("#inboxStatus"), list = $("#inboxList");
  if (!supabaseClient) return;
  status.textContent = "Loading messages…"; list.replaceChildren();
  const { data, error } = await supabaseClient.from("messages").select("id,sender_name,sender_email,message,created_at").order("created_at", { ascending: false }).limit(100);
  if (error) { status.textContent = "Could not load inbox. Check the SQL policies and admin email in the setup guide."; return; }
  status.textContent = data.length ? `${data.length} recent message(s).` : "No messages yet.";
  data.forEach(item => {
    const card = document.createElement("article"); card.className = "inbox-message";
    const heading = document.createElement("div"); heading.className = "inbox-message-heading";
    const name = document.createElement("strong"); name.textContent = item.sender_name;
    const date = document.createElement("time"); date.dateTime = item.created_at; date.textContent = new Date(item.created_at).toLocaleString();
    const email = document.createElement("a"); email.href = `mailto:${encodeURIComponent(item.sender_email)}`; email.textContent = item.sender_email;
    const body = document.createElement("p"); body.textContent = item.message;
    heading.append(name, date); card.append(heading, email, body); list.append(card);
  });
}
$("#refreshInbox").addEventListener("click", loadInbox);

if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => renderAuthState(data.session));
  supabaseClient.auth.onAuthStateChange((_event, session) => { renderAuthState(session); });
}

// Public contact form: inserts a message. RLS allows insert only; the public cannot read submissions.
$("#contactForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget, status = $("#formStatus"), submit = form.querySelector("button[type='submit']");
  const data = new FormData(form);
  const payload = {
    sender_name: String(data.get("name") || "").trim(),
    sender_email: String(data.get("email") || "").trim(),
    message: String(data.get("message") || "").trim()
  };
  if (payload.sender_name.length < 1 || payload.sender_name.length > 100 || payload.sender_email.length > 254 || payload.message.length < 1 || payload.message.length > 5000) {
    status.textContent = "Please check your details. Name must be 1–100 characters and message 1–5000 characters."; return;
  }
  if (!supabaseClient) { status.textContent = "Setup needed: connect Supabase using supabase-config.js and run supabase-setup.sql."; return; }
  submit.disabled = true; status.textContent = "Sending your message securely…";
  try {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const userId = sessionData.session?.user?.id || null;
    const { error } = await supabaseClient.from("messages").insert({ ...payload, user_id: userId });
    if (error) throw error;
    form.reset(); status.textContent = "Thanks — your message has been submitted.";
  } catch (error) {
    status.textContent = "We couldn't submit your message. Please try again later.";
    console.error("Message submission failed:", error.message);
  } finally { submit.disabled = false; }
});

// Gallery lightbox
const lightbox = $("#lightbox");
$$(".gallery-card").forEach(card => card.addEventListener("click", () => {
  $("#lightboxTitle").textContent = card.dataset.title;
  $("#lightboxCaption").textContent = card.dataset.caption;
  const art = $("#lightboxArt"); const scene = card.querySelector(".photo-art");
  art.className = `lightbox-art ${scene.className}`; art.innerHTML = scene.innerHTML;
  lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
}));
function closeLightbox() { lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
