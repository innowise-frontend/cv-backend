## Local Setup

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
   To manage Docker containers directly from a WSL terminal, enable built-in integration:
   `Settings` -> `Resources` -> `WSL Integration` -> enable `Enable integration with my default WSL distro`.
   This allows `docker` and `docker compose` commands launched in WSL to communicate with the Docker Desktop engine.

2. Install one database client:
   - [pgAdmin](https://www.pgadmin.org/)
   - [DBeaver](https://dbeaver.io/)

3. Clone this repo:

```sh
git clone https://github.com/innowise-frontend/cv-backend.git
```

4. Install `pnpm`:

```sh
npm install -g pnpm
```

5. Add the following files to the `docker` folder.

`docker/.env.cv_backend`

```sh
PORT="3001"
DATABASE_URL="postgres://user:pass@cv_postgres:5432/db"
DATABASE_SSL=""
JWT_SECRET="jwtsecret"
JWT_SECRET_2="jwtrotationsecret"
CLOUDINARY_URL=""
CHROME_WS=""
MAIL_FROM=""
SMTP_URL=""
```

`docker/.env.cv_postgres`

```sh
POSTGRES_DB="db"
POSTGRES_USER="user"
POSTGRES_PASSWORD="pass"
```

6. Pull the latest Docker image locally:

```sh
pnpm run image:up
```

7. In pgAdmin or DBeaver, create a new server:
   - Name: any
   - Host name: `localhost`
   - Port: `5432`
   - Maintenance database: `db`
   - Username: `user`
   - Password: `pass`

8. Restore the database backup:

```sh
pnpm run backup
```

After that, all tables should appear in the database and be accessible via pgAdmin or DBeaver.

9. On the frontend, set the GraphQL URL in `.env`:

```sh
VITE_GRAPHQL_URL="http://localhost:3001/api/graphql"
```

10. Configure Cloudinary in `.env` (image upload/storage):
   - Sign up at [Cloudinary](https://cloudinary.com/) (Use your own email address, not the Innowise email address)
   - Open your Dashboard and copy:
     - Cloud Name
     - API Key
     - API Secret
   - Build and set `CLOUDINARY_URL` in this format:

```sh
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

Example:

```sh
CLOUDINARY_URL=cloudinary://123456789012345:abcdef123456@my-cloud
```

Important:
   - Never share your API Secret.
   - Do not commit `.env` files to Git. Make sure `.env` is listed in `.gitignore`.

11. Configure Browserless in `.env` (PDF generation via Puppeteer):
    - Sign up at [Browserless](https://www.browserless.io/) (Use your own email address, not the Innowise email address)
    - In your dashboard, copy the WebSocket endpoint (usually in this format):

```sh
wss://chrome.browserless.io?token=YOUR_TOKEN
```

Set `CHROME_WS`:

```sh
CHROME_WS=wss://chrome.browserless.io?token=YOUR_TOKEN
```

Important:
   - `token` is a secret; do not share it.
   - If the token is leaked, rotate/regenerate it in the Browserless dashboard.

12. Configure SMTP in `.env` (email sending):
   - Enable 2FA (two-factor authentication) on your Google account (use your own email address, not the Innowise email address).
   - Create an app password in [Google App Passwords](https://myaccount.google.com/apppasswords).
     You will get a 16-character password (often shown in four groups), for example:
     `abcd efgh ijkl mnop`.
   - Use that password without spaces in `SMTP_URL` instead of `APP_PASSWORD`.
   - Set:

```sh
SMTP_URL=smtp://YOUR_EMAIL@gmail.com:APP_PASSWORD@smtp.gmail.com:587
MAIL_FROM="anything you like"
```

Important:
   - Gmail free accounts are limited to roughly 500 emails per day; messages may occasionally land in spam.

13. Example `.env.cv_backend` values:

```sh
PORT="3001"
DATABASE_URL="postgres://user:pass@cv_postgres:5432/db"
DATABASE_SSL=""
JWT_SECRET="jwtsecret"
JWT_SECRET_2="jwtrotationsecret"
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
CHROME_WS="wss://chrome.browserless.io?token=YOUR_TOKEN"
MAIL_FROM="cv-builder@mail.com"
SMTP_URL="smtp://YOUR_EMAIL@gmail.com:APP_PASSWORD@smtp.gmail.com:587"
```

Validation checklist:
   - Image upload should work.
   - PDF export (`exportPdf`) should return a base64 string.
   - After `forgotPassword`, the reset-link email should arrive.
   - After signup, the verification email with the OTP should arrive, and `verifyMail` should succeed with that code.
   - Check spam if messages do not appear in the inbox.

Note:
   - Free plans from all services are usually enough for internship projects.

