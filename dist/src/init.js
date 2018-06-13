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
const path_1 = require("path");
const glob = require("glob-promise");
function default_1({ path, log }, { app, server }) {
    return __awaiter(this, void 0, void 0, function* () {
        const initFiles = yield glob('**/*.init.+(ts|js)', { cwd: path });
        yield Promise.all(initFiles.map((file) => {
            const moduleName = file.split('/').slice(-2)[0];
            log.info(`Init module ${moduleName}`);
            let module = require(path_1.join(path, file));
            module = module.default ? module.default : module;
            return module({ log, app, server });
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=init.js.map