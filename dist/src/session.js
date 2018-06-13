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
const n9_node_utils_1 = require("@neo9/n9-node-utils");
/*
** Parse `req.headers.session`
*/
function loadSession(req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.headers.session) {
            throw new n9_node_utils_1.N9Error('session-required', 401);
        }
        try {
            req.session = JSON.parse(req.headers.session);
        }
        catch (err) {
            throw new n9_node_utils_1.N9Error('session-header-is-invalid', 401);
        }
        if (req.session.sub && !req.session.userId)
            req.session.userId = req.session.sub;
        if (!req.session.userId) {
            throw new n9_node_utils_1.N9Error('session-header-has-no-userId', 401);
        }
    });
}
function default_1(options, app) {
    // Add first middleware to add JWT support
    app.use((req, res, next) => {
        req.loadSession = loadSession.bind(options, req);
        next();
    });
}
exports.default = default_1;
//# sourceMappingURL=session.js.map