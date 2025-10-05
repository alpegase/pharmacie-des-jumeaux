README - Pharmacie des Jumeaux (package)
----------------------------------------

Structure:
- pharmaciedesjumeaux.html  (main public filename requested)
- index.html                 (same content, accessible)
- inscription.html           (signup / login page)
- style.css
- script.js
- manifest.json
- sw.js
- images/ (logo.png, whatsapp.png, facebook.png, telegram.png) - placeholders included

Important notes:
1) WhatsApp number used: +237651202009 (links built with wa.me/237651202009)
2) Social login buttons redirect to the official Google / Facebook login pages.
3) User credentials (for classic signup) are stored locally in your browser localStorage under key 'pdj_users'. You can export them via the "Exporter utilisateurs" button which will download pdj_users_export.json.
4) For real authentication & secure storage you must implement a proper backend (Node.js, Firebase Auth, etc.). Do NOT use localStorage for production credentials.
5) To host on GitHub Pages with public filename pharmaciedesjumeaux.html:
   - rename or copy index.html to pharmaciedesjumeaux.html (already included)
   - push repository to GitHub and enable Pages from main branch root.
6) To access exported JSON from Termux: download the exported JSON file from the browser onto your device (it will appear in Downloads). In Termux, access via the path: /sdcard/Download/pdj_users_export.json or move it to Termux home.

Customization:
- Replace images/logo.png with your provided images (keep filenames or update paths in HTML).
- Replace OAuth flows with real providers by implementing server-side OAuth.

Enjoy!