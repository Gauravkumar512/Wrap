import "dotenv/config";
import app from './app';

const REQUIRED_ENV = [
    'DATABASE_URL', 'REDIS_URL',
    'CLERK_SECRET_KEY', 'FRONTEND_URL',
];
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})