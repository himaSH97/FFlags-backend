"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyRequireAuthMiddleware = void 0;
const express_1 = require("@clerk/express");
const common_1 = require("@nestjs/common");
require("dotenv/config");
let LegacyRequireAuthMiddleware = class LegacyRequireAuthMiddleware {
    async use(req, res, next) {
        if (process.env.APP_ENV === 'LOCAL') {
            req.auth.sub = process.env.LOCAL_USER_ID;
        }
        else {
            const authToken = req.headers.authorization?.split(' ')[1] || '';
            const verifiedInfo = await (0, express_1.verifyToken)(authToken, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });
            req.auth = verifiedInfo;
            console.log('🚀 ~ LegacyRequireAuthMiddleware ~ use ~ req.auth.sub:', req.auth.sub);
            if (!req.auth.sub) {
                return next(new common_1.UnauthorizedException());
            }
        }
        next();
    }
};
exports.LegacyRequireAuthMiddleware = LegacyRequireAuthMiddleware;
exports.LegacyRequireAuthMiddleware = LegacyRequireAuthMiddleware = __decorate([
    (0, common_1.Injectable)()
], LegacyRequireAuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map