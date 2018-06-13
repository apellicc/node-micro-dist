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
const n9_node_log_1 = require("@neo9/n9-node-log");
const stdMock = require("std-mocks");
const rp = require("request-promise-native");
const src_1 = require("../src");
const closeServer = (server) => {
    return new Promise((resolve) => {
        server.close(resolve);
    });
};
ava_1.default('Works with custom port', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { app, server } = yield src_1.default({ http: { port: 4002 } });
    stdMock.restore();
    const output = stdMock.flush();
    t.true(output.stdout[0].includes('Listening on port 4002'));
    // Close server
    yield closeServer(server);
}));
ava_1.default('Works with preventListen = true', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { app, server } = yield src_1.default({ http: { port: 4002, preventListen: true } });
    stdMock.restore();
    const output = stdMock.flush();
    t.is(output.stdout.length, 0);
    t.is(output.stderr.length, 0);
    const err = yield t.throws(rp('http://localhost:4200'));
    t.is(err.name, 'RequestError');
}));
ava_1.default('Works with custom log and should add a namespace', (t) => __awaiter(this, void 0, void 0, function* () {
    const log = n9_node_log_1.default('custom');
    stdMock.use();
    const { app, server } = yield src_1.default({ log });
    stdMock.restore();
    const output = stdMock.flush();
    t.true(output.stdout[0].includes('[custom:n9-node-micro] Listening on port 5000'));
    // Close server
    yield closeServer(server);
}));
ava_1.default('Works without params', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { app, server } = yield src_1.default();
    stdMock.restore();
    const output = stdMock.flush();
    t.true(output.stdout[0].includes('[n9-node-micro] Listening on port 5000'));
    // Close server
    yield closeServer(server);
}));
ava_1.default('Should not log the requests http.logLevel=false', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { server } = yield (src_1.default({
        http: { logLevel: false }
    }));
    yield rp('http://localhost:5000/');
    yield rp('http://localhost:5000/ping');
    yield rp('http://localhost:5000/routes');
    stdMock.restore();
    const output = stdMock.flush();
    t.is(output.stdout.length, 1);
    // Close server
    yield closeServer(server);
}));
ava_1.default('Should log the requests with custom level', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const { server } = yield (src_1.default({
        http: { logLevel: ':status :url' }
    }));
    yield rp('http://localhost:5000/');
    yield rp('http://localhost:5000/ping');
    yield rp('http://localhost:5000/routes');
    stdMock.restore();
    const output = stdMock.flush();
    t.is(output.stdout.length, 4);
    t.true(output.stdout[1].includes('200 /'));
    t.true(output.stdout[2].includes('200 /ping'));
    t.true(output.stdout[3].includes('200 /routes'));
    // Close server
    yield closeServer(server);
}));
ava_1.default('Fails with PORT without access', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const err = yield t.throws(src_1.default({ http: { port: 80 } }));
    stdMock.restore();
    stdMock.flush();
    t.true(err.message.includes('Port 80 requires elevated privileges'));
}));
ava_1.default('Fails with PORT already used', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    yield src_1.default({ http: { port: 6000 } });
    const err = yield t.throws(src_1.default({ http: { port: 6000 } }));
    stdMock.restore();
    const output = stdMock.flush();
    t.true(output.stdout[0].includes('Listening on port 6000'));
    t.true(err.message.includes('Port 6000 is already in use'));
}));
ava_1.default('Fails with PORT not in common range', (t) => __awaiter(this, void 0, void 0, function* () {
    stdMock.use();
    const err = yield t.throws(src_1.default({ http: { port: 10000000 } }));
    t.true(err.message.includes('port'));
    stdMock.restore();
    stdMock.flush();
}));
//# sourceMappingURL=index.js.map