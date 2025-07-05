// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { createClient } from "redis";

import connectDB from "./utils/DB";
import userRoute from "./routes/UserRoute";
import { resturentRoute } from "./routes/ResturentRoutes";
import orderRoute from "./routes/orderRoute";
import menuRoute from "./routes/MenuRoute";
import { typeDefs } from "./Graphql/schema/typeDefs";
import { Resolver } from "./Graphql/resolvers/Resolvers";
import path from "path";

dotenv.config();
connectDB();

const startServer = async () => {
  const PORT = process.env.PORT || 5200;
  const app = express();

  // Middleware setup
  app.use(bodyParser.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  // CORS setup
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // Allow credentials on all responses
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  // GraphQL server setup
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers: Resolver,
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // REST API routes
  app.use("/api/v1/auth", userRoute);
  app.use("/api/v1/resturent", resturentRoute);
  app.use("/api/v1/menu", menuRoute);
  app.use("/api/v1/order", orderRoute);

  // Serve frontend static files
  const staticPath = path.resolve(__dirname, "../../front/dist");
  app.use(express.static(staticPath));

  // Serve React app for all other routes
  app.get("*", (_: Request, res: Response) => {
    res.sendFile(path.join(staticPath, "index.html"), (err) => {
      if (err) {
        res.status(500).send("Failed to load the frontend files.");
      }
    });
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
};

startServer();
