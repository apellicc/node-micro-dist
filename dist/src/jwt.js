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
const jsonwebtoken = require("jsonwebtoken");
const n9_node_utils_1 = require("@neo9/n9-node-utils");
function generateJWT(session) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!session) {
            throw new n9_node_utils_1.N9Error('session-is-empty', 400);
        }
        if (session.sub && !session.userId)
            session.userId = session.sub;
        if (!session.userId) {
            throw new n9_node_utils_1.N9Error('session-has-no-userId', 400);
        }
        return yield n9_node_utils_1.cb(jsonwebtoken.sign, session, this.jwt.secret, { expiresIn: this.jwt.expiresIn });
    });
}
/*
** Load the session into req.session
*/
function loadSession(req, getToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const headerKey = this.jwt.headerKey.toLowerCase();
        // Get token
        let token;
        if (typeof getToken === 'function') {
            token = getToken(req);
        }
        else if (req.headers && req.headers[headerKey]) {
            const parts = req.headers[headerKey].split(' ');
            if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
                token = parts[1];
            }
            else {
                throw new n9_node_utils_1.N9Error('credentials-bad-schema', 401, { message: `Format is ${headerKey}: Bearer [token]` });
            }
        }
        token = sanitizeToken(token);
        // if no token, answer directly
        if (!token) {
            throw new n9_node_utils_1.N9Error('credentials-required', 401);
        }
        // Verify token
        let session;
        try {
            session = yield n9_node_utils_1.cb(jsonwebtoken.verify, token, this.jwt.secret);
        }
        catch (err) {
            throw new n9_node_utils_1.N9Error('invalid-token', 401);
        }
        if (session.sub && !session.userId)
            session.userId = session.sub;
        // Verify session.userId
        /* istanbul ignore if */
        if (!session.userId) {
            throw new n9_node_utils_1.N9Error('session-has-no-userId', 401);
        }
        req.session = session;
    });
}
exports.jwt = {
    generateJWT,
    loadSession
};
function sanitizeToken(token) {
    token = token || '';
    if (token.split(' ')[0].toLowerCase() === 'bearer') {
        token = token.split(' ')[1];
    }
    return token;
}
function default_1(options, app) {
    exports.jwt.generateJWT = generateJWT.bind(options);
    exports.jwt.loadSession = loadSession.bind(options);
    // Add first middleware to add JWT support
    app.use((req, res, next) => {
        req.generateJWT = generateJWT.bind(options);
        req.loadSession = loadSession.bind(options, req);
        next();
    });
}
exports.default = default_1;
//# sourceMappingURL=jwt.js.map