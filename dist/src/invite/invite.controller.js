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
exports.InviteController = void 0;
const common_1 = require("@nestjs/common");
const invite_service_1 = require("./invite.service");
const create_invite_dto_1 = require("./dto/create-invite.dto");
const update_invite_dto_1 = require("./dto/update-invite.dto");
let InviteController = class InviteController {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    create(createInviteDto) {
        return this.inviteService.create(createInviteDto);
    }
    findAll(request) {
        return this.inviteService.findAll(request.systemInfo.userId);
    }
    findOne(id) {
        return this.inviteService.findOne(+id);
    }
    update(id, updateInviteDto) {
        return this.inviteService.update(+id, updateInviteDto);
    }
    remove(id) {
        return this.inviteService.remove(+id);
    }
};
exports.InviteController = InviteController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invite_dto_1.CreateInviteDto]),
    __metadata("design:returntype", void 0)
], InviteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InviteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InviteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_invite_dto_1.UpdateInviteDto]),
    __metadata("design:returntype", void 0)
], InviteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InviteController.prototype, "remove", null);
exports.InviteController = InviteController = __decorate([
    (0, common_1.Controller)('invite'),
    __metadata("design:paramtypes", [invite_service_1.InviteService])
], InviteController);
//# sourceMappingURL=invite.controller.js.map