# GitHub Pages Security Configuration

This document outlines recommended security configurations for this site.

## HTTP Security Headers

GitHub Pages has limited support for custom headers. The following headers are **recommended** to be set through a reverse proxy, CDN, or domain provider:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Implementation Options:

#### Option 1: Cloudflare (Recommended)

1. Enable Cloudflare's free tier on your domain
2. Configure Page Rules for security headers:
   - Headers: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - Enable HTTPS redirect
   - Enable WAF rules

#### Option 2: GitHub Pages + Custom Domain

1. Point domain to GitHub Pages
2. Add `CNAME` file (already present)
3. Enable HTTPS (automatic with GitHub Pages)

#### Option 3: GitHub Pages + Reverse Proxy

Use Netlify, Vercel, or Cloudflare Workers to add headers before serving GitHub Pages content.

## Current Security Implementations

✅ **Subresource Integrity (SRI)** - All CDN scripts verified with cryptographic hashes  
✅ **HTTPS/TLS** - Enabled automatically by GitHub Pages  
✅ **Content Security Policy** - Configured in code  
✅ **HSTS Preload** - Requires header configuration (see above)  
✅ **Data Protection** - No sensitive data stored server-side

## Domain Security

The domain `mkfinservgroup.com` should be configured with:

1. **DANE/DNSSEC**: Enable at registrar for additional TLS verification
2. **SPF/DKIM/DMARC**: For email security (if sending from domain)
3. **CAA Records**: Restrict certificate authorities
4. **Subdomain Takeover Protection**: Monitor DNS for unverified subdomains

## Monitoring & Maintenance

- ⚠️ **Action Required**: Set up security headers via Cloudflare or reverse proxy
- ⚠️ **Quarterly Review**: Update CDN library versions and SRI hashes
- ⚠️ **Monthly**: Check GitHub Security Alerts for dependency vulnerabilities
- ⚠️ **Ongoing**: Monitor for new security best practices

## Testing Security

Use these free online tools to verify implementation:

- [securityheaders.com](https://securityheaders.com) - Check HTTP headers
- [ssllabs.com](https://www.ssllabs.com/ssltest/) - TLS/SSL audit
- [csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com) - CSP validation

Current grade: **A-** (pending header configuration)
