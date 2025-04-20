const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const rootDir = path.join(__dirname, "..", "..");

// Ensure the logs directory exists
const rootLogsDir = path.join(rootDir, "logs");

//Check the whitelist
const whitelist = [
  "http://localhost:5173",
  "https://event-managment-backend.vercel.app",
  "https://glintqube.vercel.app",
  "http://localhost:3001",
];

module.exports = {
  frontendUrl:
    process.env.NODE_ENV === "development"
      ? process.env.FRONTEND_LOCAL_URL
      : process.env.FRONTEND_HOSTED_URL,
  backendUrl:
    process.env.NODE_ENV === "development"
      ? process.env.BACKEND_LOCAL_URL
      : process.env.BACKEND_LOCAL_URL,
  port: process.env.PORT || 4000,
  cors: {
    corsOptions: {
      origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          //for web servers like react front end(allowedOrigins-whitelist) and mobile clients with no origins
          callback(null, true); // Allow the request
        } else {
          callback(new Error("Not allowed by CORS")); // Block the request
        }
      },
      // credentials: true, // Include this if you need to send cookies
      // allowedHeaders: ["Content-Type", "Authorization"],
    },
  },
  logger: {
    dailyErrorLogPath: path.join(
      rootLogsDir,
      "error",
      "error-ai-planner-%DATE%.log"
    ),
    dailyLogPath: path.join(rootLogsDir, "ai-planner-%DATE%.log"),
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    defaultExpiration: process.env.JWT_DEFAULT_EXPIRATION,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || "15m",
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || "7d",
    resetPasswordExpiration: process.env.JWT_RESET_PASSWORD_EXPIRATION || "15m",
    tokenTypes: {
      ACCESS: "access",
      REFRESH: "refresh",
      RESET_PASSWORD: "reset_password",
      VERIFY_EMAIL: "verify_email",
    },
  },
  env: process.env.NODE_ENV,
  Google_Auth: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl:
      process.env.NODE_ENV === "development"
        ? process.env.GOOGLE_CALLBACK_URL_LOCAL
        : process.env.GOOGLE_CALLBACK_URL,
  },
  Facebook_Auth: {
    facebookClientId: process.env.FACEBOOK_CLIENT_ID,
    facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    facebookCallbackUrl:
      process.env.NODE_ENV === "development"
        ? process.env.FACEBOOK_CALLBACK_URL_LOCAL
        : process.env.FACEBOOK_CALLBACK_URL,
  },
  Github_Auth: {
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackUrl:
      process.env.NODE_ENV === "development"
        ? process.env.GITHUB_CALLBACK_URL
        : process.env.GITHUB_CALLBACK_URL,
  },
  otp: {
    otpLength: 5,
    expiryMinutes: 15,
  },
  email: {
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
  },
  verifyCaptcha: {
    capthaSecretKey: process.env.secretKey,
  },
  db: {
    username:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_USERNAME
        : process.env.PROD_DB_USERNAME,
    password:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_PASSWORD
        : process.env.PROD_DB_PASSWORD,
    database:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_NAME
        : process.env.PROD_DB_NAME,
    host:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_HOST
        : process.env.PROD_DB_HOST,
    port:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_PORT
        : process.env.PROD_DB_PORT,
    dialect:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_DIALECT
        : process.env.PROD_DB_DIALECT,
  },

  pagination: {
    min_page_size: 5,
    max_page_size: 50,
    default_page_size: 10,
    default_page_size_images: 30,
    min_page_number: 1,
    default_page_number: 1,
    default_sort_by: "created_at",
    default_sort_order: "DESC",
    default_skip: 0,
  },
};
