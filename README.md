# Visual Design Studio — Netlify

Experimental graphic-design platform for comparing **Human Design** and **AI Design** conditions.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Iris91577/visual-design-studio-netlify)

## Study conditions

- **Human Design:** participants arrange the controlled shape library and colour palette themselves.
- **AI Design:** participants enter a design brief and receive a generated image. A Netlify Function appends the study constraints on the server before calling `gemini-2.5-flash-image` through Netlify AI Gateway.

The hidden AI instructions are stored only in `netlify/functions/generate.mjs`. They are not included in the browser bundle or returned to participants. Keep this repository private if participants must not inspect those rules.

## Deploy on Netlify

1. In Netlify, choose **Add new project → Import an existing project → GitHub**.
2. Select `Iris91577/visual-design-studio-netlify`.
3. Netlify reads the checked-in settings automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Deploy the production site once. Netlify AI Gateway activates only after the first production deploy.
5. Open `/demo/ai` and run one controlled test generation.

No OpenAI API key needs to be added manually when Netlify AI Gateway is enabled. AI generations consume the Netlify team's AI Gateway credits, so configure usage/rate limits before participant recruitment.

## Routes

| Route | Purpose |
|---|---|
| `/` | Researcher landing page |
| `/demo/human` | Human-condition preview |
| `/demo/ai` | AI-condition preview |
| `/s/:code?pid=...` | Participant study link |
| `/admin` | Researcher console preview |

Sample study links: `/s/h7k2m9` (Human) and `/s/a3p8x4` (AI).

## Local development

```bash
npm install
npm run dev
```

The frontend can be developed with Vite alone. Testing the live generation Function locally requires Netlify CLI and a Netlify-linked project:

```bash
npx netlify dev
```

## Current storage limitations

The editor and real AI image call are implemented. Experiment fixtures, participant drafts, submissions and researcher sign-in are still browser-based preview implementations; production study data storage and researcher authentication remain future work described in `PLAN.md`.
