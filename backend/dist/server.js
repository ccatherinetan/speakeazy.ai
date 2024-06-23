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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const hume_1 = require("hume");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wsServer = new ws_1.Server({ server, path: "/video" });
const hume = new hume_1.HumeClient({
    apiKey: process.env.HUME_API_KEY,
    secretKey: process.env.HUME_SECRET_KEY,
});
// Function to safely stringify objects with circular references
function safeStringify(obj) {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (cache.has(value)) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our set
            cache.add(value);
        }
        return value;
    });
}
wsServer.on("connection", (ws) => {
    console.log("Client connected to /video WebSocket endpoint");
    ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("Received frame from client");
            // Assuming this method initializes the connection and processes the data
            const result = yield hume.expressionMeasurement.stream.connect(
            //#data: message.toString("base64"),
            message);
            console.log("Prediction result from Hume:", safeStringify(result));
            ws.send(safeStringify(result));
        }
        catch (error) {
            console.error("Error processing frame:", error);
            ws.send(JSON.stringify({ error: "Error processing frame" }));
        }
    }));
    ws.on("close", () => {
        console.log("Client disconnected from /video WebSocket endpoint");
    });
});
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
