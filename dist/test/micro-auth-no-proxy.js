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
const MICRO_AUTH = path_1.join(__dirname, 'fixtures/micro-auth-no-proxy/');
ava_1.default('Call session routes (JWT)', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { app, server } = yield src_1.default({
        hasProxy: false,
        path: MICRO_AUTH,
        http: { port: 6001 },
    });
    /*
    ** Fails with `session` empty
    */
    let err = yield t.throws(rp({
        method: 'POST',
        uri: 'http://localhost:6001/session-fail',
        resolveWithFullResponse: true,
        json: true
    }));
    t.is(err.statusCode, 400);
    t.is(err.response.body.code, 'session-is-empty');
    /*
    ** Fails with no `session.userId`
    */
    err = yield t.throws(rp({
        method: 'PUT',
        uri: 'http://localhost:6001/session',
        resolveWithFullResponse: true,
        body: {
            noUserId: true
        },
        json: true
    }));
    t.is(err.statusCode, 400);
    t.is(err.response.body.code, 'session-has-no-userId');
    /*
    ** Get token
    */
    const session = { userId: 1, name: 'Bruce Wayne' };
    let token;
    let res = yield rp({
        method: 'POST',
        uri: 'http://localhost:6001/session',
        resolveWithFullResponse: true,
        body: session,
        json: true
    });
    t.is(res.statusCode, 200);
    t.true(res.body.token.length > 100);
    token = res.body.token;
    /*
    ** Fails with bad `Authorization` header
    */
    err = yield t.throws(rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        headers: {
            Authorization: 'bad'
        },
        resolveWithFullResponse: true,
        json: true
    }));
    t.is(err.statusCode, 401);
    t.is(err.response.body.code, 'credentials-bad-schema');
    /*
    ** Fails with no `Authorization` header
    */
    err = yield t.throws(rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        resolveWithFullResponse: true,
        json: true
    }));
    t.is(err.statusCode, 401);
    t.is(err.response.body.code, 'credentials-required');
    /*
    ** Fails with `Authorization` bad token
    */
    err = yield t.throws(rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        resolveWithFullResponse: true,
        headers: {
            Authorization: 'Bearer bad'
        },
        json: true
    }));
    t.is(err.statusCode, 401);
    t.is(err.response.body.code, 'invalid-token');
    /*
    ** Good `Authorization` header
    */
    res = yield rp({
        method: 'GET',
        uri: 'http://localhost:6001/me',
        headers: {
            Authorization: `Bearer ${token}`
        },
        resolveWithFullResponse: true,
        json: true
    });
    t.is(res.statusCode, 200);
    t.is(res.body.userId, session.userId);
    t.is(res.body.name, session.name);
    t.is(typeof res.body.exp, 'number');
    t.is(typeof res.body.iat, 'number');
    /*
    ** Good `token` params (use getToken())
    */
    res = yield rp({
        method: 'GET',
        uri: `http://localhost:6001/me/${token}`,
        resolveWithFullResponse: true,
        json: true
    });
    t.is(res.statusCode, 200);
    t.is(res.body.userId, session.userId);
    t.is(res.body.name, session.name);
    t.is(typeof res.body.exp, 'number');
    t.is(typeof res.body.iat, 'number');
    /*
    ** Good `token` params (type load & use getToken())
    */
    res = yield rp({
        method: 'GET',
        uri: `http://localhost:6001/me-load/${token}`,
        resolveWithFullResponse: true,
        json: true
    });
    t.is(res.statusCode, 200);
    t.is(res.body.userId, session.userId);
    t.is(res.body.name, session.name);
    t.is(typeof res.body.exp, 'number');
    t.is(typeof res.body.iat, 'number');
    /*
    ** Good `token` params (type load & use getToken())
    */
    res = yield rp({
        method: 'GET',
        uri: `http://localhost:6001/me-load/Bearer%20${token}`,
        resolveWithFullResponse: true,
        json: true
    });
    t.is(res.statusCode, 200);
    t.is(res.body.userId, session.userId);
    t.is(res.body.name, session.name);
    t.is(typeof res.body.exp, 'number');
    t.is(typeof res.body.iat, 'number');
    /*
    ** type: 'load' with getToken()
    */
    res = yield rp({
        method: 'GET',
        uri: 'http://localhost:6001/me-load/bad',
        resolveWithFullResponse: true,
        json: true
    });
    t.is(res.statusCode, 200);
    t.is(res.body.session, false);
    // Clear stdout
    stdMock.restore();
    stdMock.flush();
    // Close server
    yield closeServer(server);
}));
//# sourceMappingURL=micro-auth-no-proxy.js.map