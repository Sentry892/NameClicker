# Name Clicker

A small browser clicker game where you "discover" names by clicking.

- Theme: collect names.
- Simple upgrades that increase names-per-second (CPS).

**Features**

- Click to discover a name and earn points.
- Multiple upgrades: +3, +10, +100 CPS and a Kirill chance upgrade.
- Progress is saved to `localStorage` so you can continue later.
- Minimal, easy-to-read UI.

**Play (Quick)**

1. Open [index.html](index.html) in your browser (double-click or serve with a simple static server).
2. Click the large `Click` button to discover names and increase your score.
3. Buy upgrades from the right panel to boost CPS and progression.
4. Use the `Reset` button to clear progress.

Controls

- Left-click the main button to collect names.
- Click upgrade buttons on the right to purchase them when you have enough points.

Files of interest

- [index.html](index.html) — main page.
- [index.css](index.css) — styles.
- [app.js](app.js) — game logic (click handling, upgrades, persistence).

Notes for developers

- Game state is stored in `localStorage` under the `nameClickerGame` key.
- To reset stored progress manually, open devtools → Application → Local Storage and remove `nameClickerGame`.
- The `names` list and weights are defined in `app.js` near the top — edit there to add/remove names or change rarity.

Running locally

- Easiest: open [index.html](index.html) directly in a modern browser.
- For a local server (recommended for consistent behavior):

	- Python 3:

		```bash
		python -m http.server 8000
		# then open http://localhost:8000 in your browser
		```

	- Node (http-server):

		```bash
		npm install -g http-server
		http-server . -p 8000
		```

Contributing

- Keep changes minimal and preserve existing public behavior unless explicitly improving UX.
- If you add features, update this README with usage notes and any new localStorage keys.

License

- No license file is included. Add a LICENSE if you plan to publish or share widely.

---

If you want, I can:
- Add a short changelog section.
- Add badges or a screenshot.
- Commit the README for you.
