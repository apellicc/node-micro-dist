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
const MICRO_VALIDATE = path_1.join(__dirname, 'fixtures/micro-validate/');
ava_1.default('Check allowUnkown', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { app, server } = yield src_1.default({
        path: MICRO_VALIDATE,
        http: { port: 5585 }
    });
    // Should not allow others keys
    const err = yield t.throws(rp({
        method: 'POST',
        uri: 'http://localhost:5585/validate',
        resolveWithFullResponse: true,
        body: {
            bad: true,
            username: 'ok'
        },
        json: true
    }));
    t.is(err.statusCode, 400);
    t.true(err.response.body.error.errors[0].messages.join(' ').includes('is not allowed'));
    // Should allow others keys
    let res = yield rp({
        method: 'POST',
        uri: 'http://localhost:5585/validate',
        resolveWithFullResponse: true,
        body: {
            username: 'ok'
        },
        json: true
    });
    t.is(res.statusCode, 200);
    t.true(res.body.ok);
    // Should allow others keys
    res = yield rp({
        method: 'POST',
        uri: 'http://localhost:5585/validate-ok',
        resolveWithFullResponse: true,
        body: {
            bad: true,
            username: 'ok'
        },
        json: true
    });
    t.is(res.statusCode, 200);
    t.true(res.body.ok);
    // Check logs
    stdMock.restore();
    const output = stdMock.flush();
    // Close server
    yield closeServer(server);
}));
//# sourceMappingURL=micro-validate.js.map