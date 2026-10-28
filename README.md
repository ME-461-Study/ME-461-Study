# ME 461 Study Lab

A self-contained study site for ME 461/561 Gas Dynamics (Oregon State, Fall 2026), covering Chapters 1–6 of
J. A. Rodríguez's course reader *A First Course in Compressible Flow* and Homeworks 1–4.

- `index.html`: the Study Lab (practice questions, flashcards, homework-style problems, timed mock exam, equation sheet)
- `flow-lab.html`: the Flow Lab (isentropic / normal-shock / oblique-shock / Prandtl–Meyer calculator and interactive nozzle, oblique-shock, Mach cone, corner, jet and wind-tunnel tools)
- `gd.js`: the gas-dynamics relations both pages use
- `bank.js`: questions, flashcards, equation sheet and single-answer exam problems
- `problems.js`: randomized multi-part homework-style problems

It's plain static HTML and JavaScript with no build step and no server code. MathJax and Google Fonts load from public CDNs.

## Put it on GitHub Pages

1. Create a repository (for example `me461-study-lab`) and upload every file in this folder to the top level of the
   default branch, including the empty `.nojekyll` file.
2. In the repository, go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**,
   pick your default branch and the `/ (root)` folder, and save.
3. After a minute or two the site is live at `https://<your-username>.github.io/<repository-name>/`.

Direct links to a tab work with a hash, for example `…/index.html#problems`, `…/index.html#equations`,
`…/flow-lab.html#nozzle`, `…/flow-lab.html#tunnel` or `…/flow-lab.html#calc-ns`.

## Notes

- Progress, flags and notes are saved in each visitor's own browser (`localStorage`), per device. Nothing is sent anywhere,
  except chat questions (below).
- **Ask Claude** (the button on every question, problem, card and equation, plus the floating chat button) sends the item
  you're looking at, your answer and your question to Claude. On GitHub Pages this needs your own Anthropic API key
  (from console.anthropic.com, billed to your account). The key is stored only in your browser and sent only to
  `api.anthropic.com`. Don't save it on a shared computer. Without a key, **Copy as prompt** copies the item and your
  question so you can paste them into a normal Claude chat. To change the model, edit `API_MODEL` in `index.html`.
- **Print crib sheet** on the Equation sheet tab prints the selected equations in two compact columns.
  **Copy as LaTeX** copies a complete three-column `.tex` document you can compile yourself.
- If the repository is public, anyone with the link can see the site. Course materials are summarized, not reproduced,
  but check your course's policy before sharing it widely.
