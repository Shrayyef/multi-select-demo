# Multi select react component

## Installation

Install dependencies:

```bash
npm install
```

## Running the project

### Development mode

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Deployment

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

### Setup GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically deploy when you push to the `main` branch

### Manual Deployment

If you want to deploy manually:

1. Build the project: `npm run build`
2. The built files will be in the `dist` directory
3. Deploy the contents of the `dist` directory to your web server

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file contains the deployment configuration that:

- Builds the project on every push to `main`
- Deploys to GitHub Pages automatically
- Uses Node.js 18 and caches npm dependencies for faster builds
