"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.default = [
    {
        method: 'post',
        path: '/validate',
        validate: {
            body: Joi.object().keys({
                username: Joi.string().min(2).required()
            })
        },
        handler(req, res) {
            res.json({ ok: true });
        }
    },
    {
        method: 'post',
        path: '/validate-ok',
        validate: {
            options: {
                allowUnknownBody: true
            },
            body: Joi.object().keys({
                username: Joi.string().min(2).required()
            })
        },
        handler(req, res) {
            res.json({ ok: true });
        }
    }
];
//# sourceMappingURL=validate.routes.js.map