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
const validate = require("express-validation");
const joiToJson = require("joi-to-json-schema");
const glob = require("glob-promise");
const appRootDir = require("app-root-dir");
const express_1 = require("express");
const n9_node_utils_1 = require("@neo9/n9-node-utils");
const METHODS = ['get', 'post', 'put', 'delete', 'head', 'patch', 'all'];
// Force allowUnkown as false
validate.options({
    allowUnknownHeaders: true,
    allowUnknownBody: false,
    allowUnknownQuery: false,
    allowUnknownParams: true,
    allowUnknownCookies: true
});
function default_1({ path, log }, app) {
    return __awaiter(this, void 0, void 0, function* () {
        // Fetch application name
        const name = require(path_1.join(appRootDir.get(), 'package.json')).name;
        // Create the routes list
        let routes = [];
        // Send back its name for discovery
        app.get('/', (req, res) => {
            res.status(200).send(name);
        });
        // Monitoring route
        app.get('/ping', (req, res) => {
            res.status(200).send('pong');
        });
        // List all routes
        app.get('/routes', (req, res) => {
            res.status(200).send(routes);
        });
        // Find every module which export .routes.ts file
        const routeFiles = yield glob('**/*.routes.+(ts|js)', { cwd: path });
        // Add routes for every module
        routeFiles.forEach((routeFile) => {
            const moduleName = routeFile.split('/').slice(-2)[0];
            log.info(`Adding ${moduleName} routes`);
            // Create Express Router
            const moduleRouter = express_1.Router();
            // Fetch exported routes by the module
            let moduleRoutes = require(path_1.join(path, routeFile));
            moduleRoutes = moduleRoutes.default ? moduleRoutes.default : moduleRoutes;
            // Create route handle for the exported routes
            moduleRoutes = moduleRoutes.filter((r, index) => {
                // Validate required params
                if (!r.path) {
                    log.error(`Module [${moduleName}]: Route with index [${index}] must have a \`path\` defined.`);
                    return false;
                }
                if (!r.method) {
                    log.error(`Module [${moduleName}]: Route ${r.path} must have a valid \`method\` (${METHODS.join(', ')})`);
                    return false;
                }
                r.method = (!Array.isArray(r.method) ? [r.method] : r.method).map((method) => String(method).toLowerCase());
                let validMethod = true;
                r.method.forEach((method) => {
                    if (METHODS.indexOf(String(method).toLowerCase()) === -1)
                        validMethod = false;
                });
                if (!validMethod) {
                    log.error(`Module [${moduleName}]: Route ${r.path} must have a valid \`method\` (${METHODS.join(', ')})`);
                    return false;
                }
                if (!r.handler) {
                    log.error(`Module [${moduleName}]: Route ${r.method.join('/').toUpperCase()} - ${r.path} must have a \`handler\` attached`);
                    return false;
                }
                // Create real handler
                const handler = [];
                // Make sure r.handler is an array
                r.handler = (!Array.isArray(r.handler) ? [r.handler] : r.handler);
                // Overwrite r.name before overwritting the handler
                r.name = r.name || r.handler[r.handler.length - 1].name;
                // Make sure there is a try/catch for each controller to avoid crashing the server
                r.handler = r.handler.map((fn) => {
                    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield fn(req, res, next);
                        }
                        catch (err) {
                            next(err);
                        }
                    });
                });
                // Handle authentication (2nd)
                if (r.session) {
                    handler.push(authentication(r.session));
                }
                // Add validation middleware validate schema defined (3rd)
                if (r.validate) {
                    handler.push(validate(r.validate));
                }
                r.handler = [...handler, ...r.handler];
                // Add route in express app, see http://expressjs.com/fr/4x/api.html#router.route
                r.method.forEach((method) => {
                    let optionalApplication = '';
                    let application = Array.isArray(r.application) ? r.application.join('|') : r.application;
                    if (application === '*') {
                        application = '[^/]*';
                        optionalApplication = '?';
                    }
                    let optional = '';
                    let v = Array.isArray(r.version) ? r.version.join('|') : (r.version || '*');
                    // If no version defined or accept any version
                    if (v === '*') {
                        v = 'v\\d+';
                        optional = '?';
                    }
                    if (!application) {
                        moduleRouter.route(`/:version(${v})${optional}${r.path}`)[method](r.handler);
                    }
                    else {
                        moduleRouter.route(`/:version(${v})${optional}\/:application(${application})${optionalApplication}${r.path}`)[method](r.handler);
                    }
                });
                return true;
            });
            // Add module routes to the app
            app.use(moduleRouter);
            // Add routes definitions to /routes
            routes = routes.concat(...moduleRoutes.map((r) => {
                // Force application to be an array
                const applications = (!Array.isArray(r.application) ? [r.application || '*'] : r.application);
                // Force version to be an array
                const versions = (!Array.isArray(r.version) ? [r.version || '*'] : r.version);
                // Force documentation key to be defined
                r.documentation = r.documentation || {};
                // Return a route definition for each version
                return [].concat(...applications.map((application) => {
                    return [].concat(...versions.map((version) => {
                        return r.method.map((method) => {
                            const module = routeFile.split('/')[0];
                            let pathWithParams;
                            if (application !== '*' && version !== '*')
                                pathWithParams = `/${application}/${version}${r.path}`;
                            else if (application !== '*' && version === '*')
                                pathWithParams = `/${application}${r.path}`;
                            else if (application === '*' && version !== '*')
                                pathWithParams = `/${version}${r.path}`;
                            else
                                pathWithParams = `${r.path}`;
                            return {
                                module,
                                name: r.name || `${r.method}${module[0].toUpperCase()}${module.slice(1)}`,
                                description: r.documentation.description || '',
                                application,
                                version,
                                method,
                                path: pathWithParams,
                                session: r.session || false,
                                can: r.can || false,
                                is: r.is || false,
                                withAcl: r.withAcl || false,
                                validate: {
                                    headers: r.validate && r.validate.headers ? joiToJson(r.validate.headers) : undefined,
                                    cookies: r.validate && r.validate.headers ? joiToJson(r.validate.cookies) : undefined,
                                    params: r.validate && r.validate.params ? joiToJson(r.validate.params) : undefined,
                                    query: r.validate && r.validate.query ? joiToJson(r.validate.query) : undefined,
                                    body: r.validate && r.validate.body ? joiToJson(r.validate.body) : undefined
                                },
                                response: r.documentation.response
                            };
                        });
                    }));
                }));
            }));
        });
        // Handle 404 errors
        app.use((req, res, next) => {
            return next(new n9_node_utils_1.N9Error('not-found', 404, { url: req.url }));
        });
        // Development error handler will print stacktrace
        /* istanbul ignore else */
        if (app.get('env') === 'development') {
            app.use((err, req, res, next) => {
                const status = err.status || 500;
                const code = err.message || 'unspecified-error';
                const context = err.context || {};
                if (status < 500) {
                    log.warn(err);
                }
                else {
                    log.error(err);
                }
                res.status(status);
                res.json({
                    code,
                    status,
                    context,
                    error: err
                });
            });
        }
        // Production error handler: no stacktraces leaked to user
        app.use((err, req, res, next) => {
            const status = err.status || 500;
            const code = err.message || 'unspecified-error';
            const context = err.context || {};
            if (status >= 500) {
                log.error(err);
            }
            res.status(status);
            res.json({
                code,
                status,
                context
            });
        });
    });
}
exports.default = default_1;
function authentication(options) {
    let getToken;
    let type = 'require';
    if (typeof options === 'object') {
        if (['load', 'require'].indexOf(options.type) !== -1) {
            type = options.type;
        }
        getToken = options.getToken;
    }
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield req.loadSession(getToken);
        }
        catch (err) {
            if (type === 'require') {
                return next(err);
            }
        }
        next();
    });
}
//# sourceMappingURL=routes.js.map