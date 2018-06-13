"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
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
        path: '/me-load',
        session: {
            type: 'load'
        },
        handler(req, res) {
            res.json(req.session || { session: false });
        }
    }
];
//# sourceMappingURL=users.routes.js.map