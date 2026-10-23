# Security Policy

## Supported Versions

Security updates are provided for the latest version of this project.

| Version | Supported |
| ------- | ---------- |
| Latest  | Yes        |
| Older versions | No |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Please do not publicly disclose security vulnerabilities through GitHub Issues.**

When reporting a vulnerability, include:

- A clear description of the vulnerability.
- Steps to reproduce the issue.
- The potential impact.
- Any relevant screenshots or logs, if available.

Please allow reasonable time for the issue to be investigated and addressed before publicly disclosing it.

## Security Measures

This project uses GitHub Pages for hosting and Supabase for backend services and authentication.

The following security practices should be followed:

- Enable Row Level Security (RLS) on all Supabase tables containing private or user-specific data.
- Create appropriate RLS policies to restrict users to their authorized data.
- Never expose Supabase service-role keys, secret API keys, or private credentials in frontend code.
- Use Supabase authentication to manage user sessions and access.
- Validate and authorize sensitive operations on the server side.
- Restrict administrative privileges to authorized administrators.
- Never rely on frontend checks alone to protect admin pages or sensitive data.
- Keep dependencies and third-party libraries up to date.
- Avoid storing passwords or sensitive personal information unnecessarily.
- Do not commit `.env` files, access tokens, or other secrets to the repository.

## Admin Access

Administrative access must be restricted to explicitly authorized accounts.

Admin privileges must be verified using trusted backend authorization rules, not merely by hiding dashboard elements or checking a role stored in browser-controlled data.

## Disclosure Policy

We appreciate responsible security research and the reporting of vulnerabilities that help protect users and their data.

Thank you for helping keep this project secure.
