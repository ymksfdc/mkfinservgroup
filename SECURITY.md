# Security Policy

**Last Updated**: March 2026

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Mk FinServ's website, please **do not** open a public issue. Instead, contact us directly:

- **Email**: security@mkfinservgroup.com
- **Response Time**: We aim to respond within 48 hours

## Security Measures Implemented

### HTTP Security Headers

The following security headers should be configured on the server:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.tailwindcss.com https://unpkg.com https://cdnjs.cloudflare.com https://*.googletagmanager.com; style-src 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://formspree.io https://*.googletagmanager.com
```

### Subresource Integrity (SRI)

All external CDN resources are pinned with cryptographic hashes to prevent tampering:

- âœ… Tailwind CSS with SRI hash
- âœ… Phosphor Icons with SRI hash
- âœ… Chart.js with SRI hash
- âœ… html2canvas with SRI hash

### Data Security

- âœ… HTTPS/TLS enforced on all pages
- âœ… No sensitive data stored in local storage without user consent
- âœ… Form submissions use industry-standard Formspree service
- âœ… Third-party scripts loaded with `crossorigin="anonymous"`

### Content Security

- âœ… Safe DOM manipulation (textContent used instead of innerHTML)
- âœ… No inline event handlers (`oninput`, `onclick` being migrated)
- âœ… Google Analytics loaded with GTM for consent management
- âœ… No hardcoded secrets in client-side code

## Invoice Password Section

The `/invoice/` tool uses a front-end password gate intended only as a light access restriction layer for approved users. This is not a substitute for real server-side authentication.

### Current Implementation

- The invoice access gate validates the entered password in the browser
- The actual plain password is not stored directly in code
- The file [invoice-template.js](/c:/VS%20Code/Mk%20FinServ%20Group/mkfinservgroup/invoice/invoice-template.js) stores only a SHA-256 hash in `ACCESS_PASSWORD_HASH`

### How To Change The Invoice Password

1. Choose the new plain password you want to use
2. Generate its SHA-256 hash in PowerShell:

```powershell
$text = 'your-new-password-here'
$bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
$hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
-join ($hash | ForEach-Object { $_.ToString('x2') })
```

3. Copy the generated hash
4. Open [invoice-template.js](/c:/VS%20Code/Mk%20FinServ%20Group/mkfinservgroup/invoice/invoice-template.js)
5. Replace the value of:

```js
const ACCESS_PASSWORD_HASH = '...';
```

6. Refresh the `/invoice/` page after deployment

### Important Note

- Because this is a front-end gate, a technical user may still inspect or bypass it
- If stronger protection is needed later, move `/invoice/` behind real authentication such as Cloudflare Access or a private backend

## Third-Party Services

This site uses the following trusted services:

| Service              | Purpose                  | Privacy Policy                              |
| -------------------- | ------------------------ | ------------------------------------------- |
| **Formspree.io**     | Contact form submissions | https://formspree.io/privacy                |
| **Google Analytics** | Website traffic analysis | https://policies.google.com/privacy         |
| **Google Fonts**     | Typography               | https://fonts.google.com/metadata/fonts/... |
| **Cloudflare**       | Email obfuscation        | https://www.cloudflare.com/privacy/         |

## Data Protection

- Personal data collected through contact forms is processed by Formspree
- We do not sell or share user data with third parties
- Users can request data deletion by contacting support@mkfinservgroup.com
- Financial calculation data processed in net-worth calculator stays entirely client-side

## Compliance

- GDPR compliant contact practices
- ePrivacy Directive compliant (analytics with consent)
- No tracking pixels or advertisement networks
- Privacy policy available in footer

## Future Improvements

- [ ] Implement cookie consent banner
- [ ] Add GDPR/Privacy impact assessment
- [ ] Security audit by third-party penetration tester
- [ ] Implement rate limiting on contact forms
- [ ] Add Web Application Firewall (WAF)

## Version History

| Date     | Changes                                     |
| -------- | ------------------------------------------- |
| Mar 2026 | Initial security audit & SRI implementation |

