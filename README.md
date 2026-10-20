# CivicAI — Citizen Issue Intelligence Dashboard

CivicAI is a responsive **demo dashboard** for a bias-aware, multilingual, explainable, multichannel citizen-issue intelligence workflow.

> **Important:** This repository is a front-end/product preview. The dashboard uses simulated, non-identifying example records. It is not connected to a live civic-records system, and its displayed classifications, confidence values, fairness metrics, and actions are illustrative—not real model predictions or operational decisions.

## Features

- Overview dashboard with demo metrics and intake activity
- Issue triage table with search and filters
- Review queue with illustrative routing reasons and evidence signals
- Monitoring views for language/channel mix and demo fairness indicators
- Simulated intake interactions and preview-only export feedback
- Responsive layout and accessible navigation labels

## Requirements

- Node.js 18 or newer (Node.js 20+ recommended)
- npm (included with Node.js)

No third-party npm packages are required. The included preview server uses Node.js built-in modules only.

## Run locally

1. Download or clone this repository.
2. Open a terminal in the project root (the folder containing `package.json`).
3. Start the server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000).

For development, `npm run dev` starts the same local preview server.

To use another port:

**PowerShell**
```powershell
$env:PORT=3001
npm start
```

**macOS/Linux**
```bash
PORT=3001 npm start
```

Then open `http://localhost:3001`.

## Project structure

```text
civicai/
├── public/
│   ├── app.js
│   ├── civicai-mark.svg
│   ├── index.html
│   └── styles.css
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── server.js
```

## GitHub setup

If you are uploading this ZIP through GitHub's website, extract it first and upload the **contents** of the `civicai-github` folder—not the ZIP itself—into the root of a new repository.

If using Git from the project folder:

```bash
git init
git add .
git commit -m "Add CivicAI demo dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own GitHub repository URL.

## Scope and next steps

This dashboard is currently a UI demonstration. A production citizen-issue intelligence system would need a separately implemented and validated backend/model pipeline, real dataset documentation, privacy controls, human oversight, and rigorous multilingual and fairness evaluation before being used operationally.

## License

See [LICENSE](LICENSE).
