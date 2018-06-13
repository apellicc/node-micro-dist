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
const path_1 = require("path");
const n9_node_log_1 = require("@neo9/n9-node-log");
const appRootDir = require("app-root-dir");
const http_1 = require("./http");
const init_1 = require("./init");
const routes_1 = require("./routes");
const jwt_1 = require("./jwt");
var jwt_2 = require("./jwt");
exports.jwt = jwt_2.jwt;
const session_1 = require("./session");
function default_1(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Provides a stack trace for unhandled rejections instead of the default message string.
        process.on('unhandledRejection', handleThrow);
        // Options default
        options = options || {};
        options.path = options.path || path_1.join(appRootDir.get(), 'modules');
        options.log = options.log || global.log;
        options.hasProxy = (typeof options.hasProxy === 'boolean' ? options.hasProxy : true);
        options.jwt = options.jwt || {};
        options.jwt.headerKey = options.jwt.headerKey || 'Authorization';
        options.jwt.secret = options.jwt.secret || 'secret';
        options.jwt.expiresIn = options.jwt.expiresIn || '7d';
        // If log if given, add a namespace
        if (options.log)
            options.log = options.log.module('n9-node-micro');
        else
            options.log = n9_node_log_1.default('n9-node-micro');
        // Create HTTP server
        const { app, server, listen } = yield http_1.default(options);
        if (options.hasProxy) {
            // Add req.headers.session middleware (add req.loadSession)
            session_1.default(options, app);
        }
        else {
            // Add JWT middleware (add req.generateJWT & req.loadSession)
            jwt_1.default(options, app);
        }
        // Init every modules
        yield init_1.default(options, { app, server });
        // Load routes
        yield routes_1.default(options, app);
        // Make the server listen
        if (!options.http.preventListen)
            yield listen();
        // Return app & server
        return { app, server };
    });
}
exports.default = default_1;
/* istanbul ignore next */
function handleThrow(err) {
    throw err;
}
//# sourceMappingURL=index.js.map