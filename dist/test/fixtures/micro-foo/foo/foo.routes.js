"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const foo_controller_1 = require("./foo.controller");
exports.default = [
    {
        method: 'post',
        path: '/foo',
        handler: foo_controller_1.createFoo,
        documentation: {
            description: 'Foo route',
            response: { fake: true }
        }
    },
    {
        version: 'v1',
        method: 'post',
        path: '/fou',
        handler: foo_controller_1.createFoo
    },
    {
        method: 'post'
        // Should log error because no path defined
    },
    {
        // Should log error because not method defined
        path: '/foo'
    },
    {
        method: 'bad',
        path: '/foo'
    },
    {
        method: 'put',
        path: '/foo'
        // Should log error because bad handler defined
    }
];
//# sourceMappingURL=foo.routes.js.map