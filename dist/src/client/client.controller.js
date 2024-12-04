"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const common_1 = require("@nestjs/common");
const forge = require("node-forge");
const client_service_1 = require("./client.service");
const get_flag_dto_1 = require("./dto/get-flag.dto");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    async encryptContent(projectId, jsonData) {
        return this.clientService.encryptContent(projectId, jsonData);
    }
    async decryptContent(projectId, encryptedContent, signature) {
        return this.clientService.decryptContent(projectId, encryptedContent, signature);
    }
    getFlagq(body, req) {
        const projectIdBase64 = req.headers['x-fflags-project-key'];
        if (!projectIdBase64) {
            throw new Error('Project key is missing');
        }
        const projectId = forge.util.decode64(projectIdBase64);
        return this.clientService.getFlagsInfo(projectId, body);
    }
    getFlag(body, req) {
        const projectIdBase64 = req.headers['x-fflags-project-key'];
        if (!projectIdBase64) {
            throw new Error('Project key is missing');
        }
        const projectId = forge.util.decode64(projectIdBase64);
        return this.clientService.getFlagInfo(projectId, body);
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Post)('encrypt/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "encryptContent", null);
__decorate([
    (0, common_1.Post)('decrypt/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)('encryptedContent')),
    __param(2, (0, common_1.Body)('signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "decryptContent", null);
__decorate([
    (0, common_1.Post)('flags'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_flag_dto_1.GetFlagDto, Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getFlagq", null);
__decorate([
    (0, common_1.Post)('flag'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_flag_dto_1.GetFlagDto, Object]),
    __metadata("design:returntype", void 0)
], ClientController.prototype, "getFlag", null);
exports.ClientController = ClientController = __decorate([
    (0, common_1.Controller)('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);
//# sourceMappingURL=client.controller.js.map