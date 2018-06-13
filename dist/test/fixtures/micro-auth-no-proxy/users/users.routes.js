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
const _1 = require("../../../../src/");
exports.default = [
    {
        method: 'post',
        path: '/session-fail',
        handler(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                res.json({
                    token: yield req.generateJWT()
                });
            });
        }
    },
    {
        method: ['POST', 'put'],
        path: '/session',
        handler(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                res.json({
                    token: yield _1.jwt.generateJWT(req.body)
                });
            });
        }
    },
    {
        method: 'get',
        path: '/me',
        session: true,
        handler(req, res) {
            res.json(req.session);
        }
    },
    {
        method: 'get',
        path: '/me/:token',
        session: {
            getToken: (req) => req.params.token
        },
        handler(req, res) {
            res.json(req.session);
        }
    },
    {
        method: 'get',
        path: '/me-load/:token',
        session: {
            type: 'load',
            getToken: (req) => req.params.token
        },
        handler(req, res) {
            res.json(req.session || { session: false });
        }
    }
];
//# sourceMappingURL=users.routes.js.map