# Project

npm init -y
npm install --force
npm install <package-name>
npm uninstall <package-name>
npm update
npm outdated

# Development

npm run dev
npm start
npm run build
npm run lint
npm test

# TypeScript

npx tsc
npx tsc --init
npx tsc --watch
npm run build

# ESLint

npm run lint
npx eslint .
npx eslint src
npx eslint . --fix

# Vite (React)

npm create vite@latest
npm run dev
npm run build
npm run preview

# React

npm install react
npm install react-dom

# Tailwind CSS

npm install tailwindcss @tailwindcss/vite

# shadcn/ui

npx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add form

# Dependencies

npm install axios
npm install bcryptjs
npm install jsonwebtoken
npm install mongoose
npm install express
npm install cors
npm install dotenv

# Dev Dependencies

npm install -D typescript
npm install -D tsx
npm install -D nodemon
npm install -D eslint
npm install -D prettier
npm install -D @types/node
npm install -D @types/express

# Package Information

npm list
npm list --depth=0
npm ls
npm view <package-name>
npm info <package-name>

# Cache

npm cache verify
npm cache clean --force

# Install from package.json

npm install
Remove node_modules

Windows (CMD):

# rmdir /s /q node_modules

del package-lock.json
npm install

# Git Bash:

rm -rf node_modules package-lock.json
npm install

# Check Versions

node -v
npm -v
npx -v
tsc -v

# Useful Debug Commands

npm run build
npm run dev
npm run lint
npm ls
npx tsc
npx eslint . --fix

# Vercel CLI Install

npm install -g vercel
vercel login

vercel --version
vercel --help

1. Production Deploy
   vercel --prod
   vercel link

2.Logout
vercel logout

# 1. root file vercel.json

```js
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

# 2. package.json ------------------

```js
 "scripts": {
    "start": "node ./dist/server.js",
    "dev": "tsx watch ./src/server.ts",
    "build": "npm install --force && tsc",
    "lint": "npx eslint ./src",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

# 3. Email sender app/template copy to past dist folder of app add -----

1. dist add copy to past --> app/template
2. dist add copy to past --> dist/app/template

# 4. Vercel website----------------

1. tour-management-project --> sitting --> build and deployment -->
   -> build command : npm run build
   -> npm install command --force

2. .env --> all copy to past --> .env.dev------

3. Conflicting peer dependency -------
   npm error Conflicting peer dependency: cloudinary@1.41.3
   npm error node_modules/cloudinary

   npm error peer cloudinary@"^1.21.0" from multer-storage-cloudinary@4.0.0
   "cloudinary": "^1.21.0",

   npm error node_modules/multer-storage-cloudinary
   npm error multer-storage-cloudinary@"^4.0.0" from the root project

4. All http://localhost:5000 Replace url --> https://phtourmanagment.vercel.app/

5. google cloud --- url add ------------
   https://phtourmanagment.vercel.apps

6. sslcommerz--website ---> IPN at HTTP Listener --url vercel live link : --------
   Enable HTTP Listener
   https://phtourmanagment.vercel.app/api/v1/payment/validate-payment

7. # cookie update code -----------------------

- secure: false, // local server use and test----

      secure: (envVars.NODE_ENV === "production"),
      sameSite: "none",

8. # app.set("trust proxy", 1);-----------

app.set("trust proxy", 1); হলো একটি Express.js সেটিং, যা বলে যে আপনার অ্যাপের সামনে ১টি proxy (যেমন Vercel, Nginx, Cloudflare, Heroku) আছে।

app.set("trust proxy", 1);
কেন ব্যবহার করা হয়?

যখন আপনার Express অ্যাপ কোনো reverse proxy-এর পিছনে চলে, তখন ক্লায়েন্টের আসল IP, HTTPS স্ট্যাটাস ইত্যাদি proxy-এর মাধ্যমে আসে। trust proxy সেট না করলে Express এগুলো সঠিকভাবে বুঝতে পারে না।

এটি কী কী কাজে লাগে?
req.ip থেকে ব্যবহারকারীর আসল IP পাওয়া।
req.protocol থেকে https সঠিকভাবে পাওয়া।
req.secure সঠিকভাবে true হওয়া।
express-session-এ cookie.secure: true ব্যবহার করলে ঠিকভাবে কাজ করা।

উদাহরণ:

app.set("trust proxy", 1);

9.  sslcommerz.service.ts---------------------

```js
      ipn_url: `${envVars.SSL_IPN_URL}`,
```

And ssl website url add -->
--> SSL_IPN_URL=http://localhost:5000/api/v1/payment/validate-payment

10. Red Hat Dependency Analytics
    Analyzing application dependencies... --> click to view --error solve

--> "cloudinary": "^1.41.3", ---install
--> npm i cloudinary

11. install cloudinary and multer-------------------
    npm install cloudinary@1.41.3
    multer-storage-cloudinary@4.0.0
    npm install --legacy-peer-deps

12.
