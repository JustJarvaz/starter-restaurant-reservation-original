# Deploy to Vercel

## Setup

- Install vercel cli `npm install -g vercel`
- `vercel login`

## Deploy the backend app from the command line.

- In the `./back-end` folder,
  - run `vercel env add secret DATABASE_URL development` and set the value of this variable to the development database url.
  - run `vercel env add secret DATABASE_URL preview` and set the value of this variable to the preview database url.
  - run `vercel env add secret DATABASE_URL production` and set the value of this variable to the production database url.
  - run `vercel` and follow the prompts. If this is your first deployment, the same code will be deployed to the preview and production environment.
  - note the preview and production URL's, you will need these to deploy the front-end.
  - to later deploy the current code to production, run `vercel --prod`

## Deploy the frontend app from the command line.

- In the `./back-end` folder,
  - run `vercel env add plain REACT_APP_API_BASE_URL preview` and set the value of this variable to the current preview deployment of the backend app. This url will change every time you deploy a new preview backend.
  - run `vercel env add secret REACT_APP_API_BASE_URL production` and set the value of this variable to the production backend url.
  - run `vercel` and follow the prompts. If this is your first deployment, the same code will be deployed to the preview and production environment.
  - to later deploy the current code to production, run `vercel --prod`
