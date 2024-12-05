"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyRequireAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
require("dotenv/config");
let LegacyRequireAuthMiddleware = class LegacyRequireAuthMiddleware {
    use(req, res, next) {
        console.error('req.auth cookie', req.headers.cookie);
        if (process.env.APP_ENV === 'LOCAL') {
            req.auth.userId = process.env.LOCAL_USER_ID;
        }
        else {
            if (!req.auth.userId) {
                console.error('Auth', req.auth);
                return next(new common_1.UnauthorizedException());
            }
        }
        console.log('req.auth.userId', req.auth.userId);
        next();
    }
};
exports.LegacyRequireAuthMiddleware = LegacyRequireAuthMiddleware;
exports.LegacyRequireAuthMiddleware = LegacyRequireAuthMiddleware = __decorate([
    (0, common_1.Injectable)()
], LegacyRequireAuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map