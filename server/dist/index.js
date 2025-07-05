"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const server_1 = require("@apollo/server");
const express4_1 = require("@as-integrations/express4");
const DB_1 = __importDefault(require("./utils/DB"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const ResturentRoutes_1 = require("./routes/ResturentRoutes");
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const MenuRoute_1 = __importDefault(require("./routes/MenuRoute"));
const typeDefs_1 = require("./Graphql/schema/typeDefs");
const Resolvers_1 = require("./Graphql/resolvers/Resolvers");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, DB_1.default)();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = process.env.PORT || 5200;
    const app = (0, express_1.default)();
    // Middleware setup
    app.use(body_parser_1.default.json({ limit: "10mb" }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // CORS setup
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }));
    // Allow credentials on all responses
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    });
    // GraphQL server setup
    const apolloServer = new server_1.ApolloServer({
        typeDefs: typeDefs_1.typeDefs,
        resolvers: Resolvers_1.Resolver,
    });
    yield apolloServer.start();
    app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(apolloServer, {
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) { return ({ token: req.headers.token }); }),
    }));
    // REST API routes
    app.use("/api/v1/auth", UserRoute_1.default);
    app.use("/api/v1/resturent", ResturentRoutes_1.resturentRoute);
    app.use("/api/v1/menu", MenuRoute_1.default);
    app.use("/api/v1/order", orderRoute_1.default);
    // Serve frontend static files
    const staticPath = path_1.default.resolve(__dirname, "../../front/dist");
    app.use(express_1.default.static(staticPath));
    // Serve React app for all other routes
    app.get("*", (_, res) => {
        res.sendFile(path_1.default.join(staticPath, "index.html"), (err) => {
            if (err) {
                res.status(500).send("Failed to load the frontend files.");
            }
        });
    });
    // Start the server
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}`);
    });
});
startServer();
//# sourceMappingURL=index.js.map