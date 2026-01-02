const requiredEnvs = [
  "MONGODB_URI",
  "JWT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "GEMINI_API_KEY",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
];

export function validateEnv() {
  for (const key of requiredEnvs) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}
