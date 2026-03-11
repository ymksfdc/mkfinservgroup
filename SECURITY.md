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

- ✅ Tailwind CSS with SRI hash
- ✅ Phosphor Icons with SRI hash
- ✅ Chart.js with SRI hash
- ✅ html2canvas with SRI hash

### Data Security

- ✅ HTTPS/TLS enforced on all pages
- ✅ No sensitive data stored in local storage without user consent
- ✅ Form submissions use industry-standard Formspree service
- ✅ Third-party scripts loaded with `crossorigin="anonymous"`

### Content Security

- ✅ Safe DOM manipulation (textContent used instead of innerHTML)
- ✅ No inline event handlers (`oninput`, `onclick` being migrated)
- ✅ Google Analytics loaded with GTM for consent management
- ✅ No hardcoded secrets in client-side code

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
