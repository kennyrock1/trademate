# TradeMate v0.2 prototype

TradeMate is an independent, worker-owned organizer for apprentices and journey workers across union construction trades.

## What's included
- Worker profile: apprentice / journey worker, trade, local, classification
- Manual shift records with date, contractor, project, site address, break and hours category
- Work history across contractors and job sites
- Personal benefit statement / contribution records
- Certifications and expiration dates
- Optional PDF/image document attachments (local browser storage)
- Private-by-default sharing controls and selected-category JSON export
- Full local backup and delete controls
- Responsive PWA shell and basic offline caching

## Important limits
- **No live Apple, Google, or email authentication yet.** These require a secure authentication provider, app identifiers, server configuration, account recovery, and security review. The buttons are intentionally shown as planned, not functional.
- **No cloud sync or cross-device account storage.** Data stays in this browser on this device. Export a backup before changing devices or clearing browser data.
- Document scanning / OCR is not implemented. You can attach an existing PDF or image and enter its details manually.
- Attachments are limited to 8 MB each in this prototype and are stored in browser local storage as data URLs. Large or numerous attachments may exceed browser storage limits; use a small test file only.
- This is not official payroll, timekeeping, pension, annuity, health eligibility, or union records. Verify balances and rules with the relevant employer, local, or benefit fund.
- Pay calculations and collective bargaining rules are not yet included in this release.

## Run on Qubes OS
1. Extract the ZIP inside a work qube (not dom0).
2. Open a terminal in the extracted folder.
3. Run: `python3 -m http.server 8000`
4. In Firefox in that same qube, visit `http://127.0.0.1:8000`.
5. Stop the server with Ctrl+C when finished.

The service worker requires localhost or HTTPS. You can also open `index.html` directly for a basic local test, but offline PWA caching will not be enabled.

## Privacy model in this prototype
- No analytics or third-party trackers are included.
- Records are stored locally in the browser.
- Nothing is transmitted to an employer, union, contractor, or benefit fund.
- Sharing is an explicit user-created JSON export. Review the export before sending it.
- Browser storage is not a substitute for encrypted secure storage. Do not enter Social Security numbers, bank credentials, or other highly sensitive information.

## Next engineering steps
1. Choose a backend and threat model for encrypted account storage.
2. Implement Apple, Google, and email sign-in with verified redirect flows and account recovery.
3. Add encrypted sync, export/import, and conflict handling across devices.
4. Add document OCR only with clear consent and local/server processing choices.
5. Build trade/local-specific rule packs from verified agreements and plan documents; never assume universal rules.
