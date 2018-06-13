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
const ava_1 = require("ava");
const stdMock = require("std-mocks");
const rp = require("request-promise-native");
const path_1 = require("path");
const src_1 = require("../src");
const closeServer = (server) => {
    return new Promise((resolve) => {
        server.close(resolve);
    });
};
const MICRO_AUTH = path_1.join(__dirname, 'fixtures/micro-auth-proxy/');
ava_1.default('Call session route (req.headers.session)', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { app, server } = yield src_1.default({
        hasProxy: true,
        path: MICRO_AUTH,
        http: { port: 6001 }
    });
    /*
    ** Fails with no `session` header
    */
    let err = yield t.throws(rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        resolveWithFullResponse: true,
        json: true
    }));
    t.is(err.statusCode, 401);
    t.is(err.response.body.code, 'session-required');
    /*
    ** Fails with bad `session` header
    */
    err = yield t.throws(rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        headers: {
            session: 'bad'
        },
        resolveWithFullResponse: true,
        json: true
    }));
    t.is(err.statusCode, 401);
    t.is(err.response.body.code, 'session-header-is-invalid');
    /*
    ** Fails with bad `session` header (no `userId`)
    */
    err = yield t.throws(rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        headers: {
            session: JSON.stringify({ noUserId: true })
        },
        resolveWithFullResponse: true,
        json: true
    }));
    t.is(err.statusCode, 401);
    t.is(err.response.body.code, 'session-header-has-no-userId');
    /*
    ** Good `session` header
    */
    const session = { userId: 1, name: 'Bruce Wayne' };
    let res = yield rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        headers: {
            session: JSON.stringify(session)
        },
        resolveWithFullResponse: true,
        json: true
    });
    t.is(res.statusCode, 200);
    t.deepEqual(res.body, session);
    /*
    ** No `session` header but session: { type: 'load' }
    */
    res = yield rp({
        method: 'GET',
        uri: 'http://localhost:6001/me-load',
        resolveWithFullResponse: true,
        json: true
    });
    t.is(res.statusCode, 200);
    t.deepEqual(res.body, { session: false });
    /*
    ** With `session` header and session: { type: 'load' }
    */
    res = yield rp({
        method: 'GET',
        uri: 'http://localhost:6001/me-load',
        resolveWithFullResponse: true,
        headers: {
            session: JSON.stringify(session)
        },
        json: true
    });
    t.is(res.statusCode, 200);
    t.deepEqual(res.body, session);
    // Clear stdout
    stdMock.restore();
    stdMock.flush();
    // Close server
    yield closeServer(server);
}));
//# sourceMappingURL=micro-auth-proxy.js.map