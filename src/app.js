const http = require("http");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
// const { authLimiter } = require("./middlewares/rateLimit.middlewares");
// const session = require("express-session");
// const { Server } = require("socket.io");
require("./services/auth/googlePassport");
require("./services/auth/facebookPassport");
require("./services/auth/githubPassport");
const Routes = require("./routes");
const swaggerUI = require("swagger-ui-express");
const {
  notFound,
  badJSONHandler,
  errorConverter,
  errorHandler,
} = require("./middlewares/error.middlewares");
const YAML = require("yamljs");
const config = require("./config");
const { responseStatuses } = require("./config/constants.config");
const swaggerDocument = YAML.load("openapi.yml");
// const runDatabase = require("./db/models");
const { logger, logRequest } = require("./middlewares/logger.middlewares");
const statusCodes = require("./utils/httpStatus");

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
// Connect to the database
// runDatabase();

// Set security HTTP headers
app.use(helmet());

// Parse cookies
app.use(cookieParser());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Log each request
app.use(logRequest);

// Handle bad JSON errors
app.use(badJSONHandler);

// Compress responses
app.use(compression());

// Enable CORS with specified options
app.use(cors(config.cors.corsOptions));

// app.use(
//   session({
//     secret: process.env.GOOGLE_CLIENT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.session());

app.use(passport.initialize());
require("./services/auth/googlePassport");
require("./services/auth/githubPassport");
require("./services/auth/facebookPassport");

// for IP
app.set("trust proxy", 1);

// Limit repeated failed requests to auth endpoints in production
if (config.env === "production") {
  app.use("/", Routes);
}

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", (req, res) => {
  const statusCode = statusCodes.OK;
  return res.status(statusCode).json({
    status: responseStatuses.SUCCESS,
    code: statusCode,
    message: "Server is running.",
  });
});

app.use("/", Routes);

// 404 handler
app.use(notFound);

// Convert errors to ApiError if needed
app.use(errorConverter);

// Central error handler
app.use(errorHandler);

//For Socket
// require("./utils/socket")(io);

// For local development, you might still want to call app.listen()
server.listen(config.port, () => {
  logger.info(`Listening on port ${config.port}`);
});
