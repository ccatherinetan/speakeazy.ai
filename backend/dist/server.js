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
function safeStringify(obj) {
    const cache = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (cache.has(value)) {
                return; // Discard key if circular reference found
            }
            cache.add(value);
        }
        return value;
    });
}
wsServer.on("connection", (ws) => {
    console.log("Client connected to /video WebSocket endpoint");
    ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Received frame from client");
        try {
            // Convert buffer to base64 string; necessary if the model expects image data in this format
            const base64data = message.toString("base64");
            console.log(message);
            // Process the data for emotion prediction
            const stream = yield hume.start({
                models: {
                    face: {},
                },
                rawInput: true,
                streamWindowMs: 1000, // Adjust as needed
            });
            stream.on("message", (message) => {
                console.log("Prediction result from Hume:", JSON.stringify(message, null, 2));
                ws.send(JSON.stringify(message));
            });
            stream.on("error", (error) => {
                console.error("Stream error:", error);
                ws.send(JSON.stringify({ error: "Stream error" }));
            });
            stream.write(base64data);
        }
        catch (error) {
            console.error("Error processing frame:", error);
            if (error instanceof Error) {
                console.error(error.message);
                console.error(error.stack);
            }
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
