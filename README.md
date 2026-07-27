# Road to 12% v3.1.1 Cache Hotfix

This build fixes the situation where the new HTML loaded but Safari continued using the old broken `app.js`.

The JavaScript and stylesheet have unique filenames:
- `app-3.1.1.js`
- `styles-3.1.1.css`

That forces Safari to download the working files rather than reuse Version 3.0's cached JavaScript.

## Deployment
1. Upload everything inside `road_to_12_v3_1_hotfix` to the repository root.
2. Replace existing files and commit to `main`.
3. Wait for the green deployment check.
4. Open:
   https://harrison0550.github.io/road-to-12/?v=3.1.1
5. Confirm the header says `VERSION 3.1.1`.

You may leave the older `app.js` and `styles.css` files in GitHub; Version 3.1.1 no longer references them.
