@echo off
echo 🚀 Setting up Runway Backend...

echo 📦 Installing dependencies...
npm install

echo 🗃️ Setting up database...
npx prisma generate
npx prisma migrate dev --name init

echo 🌱 Seeding database...
npx prisma db seed

echo ✅ Setup completed! Run 'npm run start:dev' to start the server.
pause

