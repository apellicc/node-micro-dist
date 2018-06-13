"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
function default_1(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Default options
        options.http = options.http || {};
        options.http.port = options.http.port || process.env.PORT || 5000;
        options.http.logLevel = (typeof options.http.logLevel !== 'undefined' ? options.http.logLevel : 'dev');
        // Create server & helpers
        const app = express();
        const server = http_1.createServer(app);
        // Listeners
        const analyzeError = (error) => {
            /* istanbul ignore if */
            if (error.syscall !== 'listen') {
                return error;
            }
            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    return new Error(`Port ${options.http.port} requires elevated privileges`);
                case 'EADDRINUSE':
                    return new Error(`Port ${options.http.port} is already in use`);
                /* istanbul ignore next */
                default:
                    return error;
            }
        };
        const onListening = () => {
            const addr = server.address();
            options.log.info('Listening on port ' + addr.port);
        };
        // Listen method
        const listen = () => {
            return new Promise((resolve, reject) => {
                server.listen(options.http.port);
                server.on('error', (error) => {
                    reject(analyzeError(error));
                });
                server.on('listening', () => {
                    onListening();
                    resolve();
                });
            });
        };
        // Middleware
        app.use(helmet());
        options.http.bodyParser = options.http.bodyParser || {};
        app.use(bodyParser.urlencoded(Object.assign({ extended: false }, options.http.bodyParser.urlencoded)));
        app.use(bodyParser.json(options.http.bodyParser.json));
        // Logger middleware
        if (typeof options.http.logLevel === 'string') {
            app.use(morgan(options.http.logLevel, { stream: options.log.stream }));
        }
        // Return app & server
        return { app, server, listen };
    });
}
exports.default = default_1;
//# sourceMappingURL=http.js.map