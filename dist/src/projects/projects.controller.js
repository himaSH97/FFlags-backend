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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const projects_service_1 = require("./projects.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const create_role_dto_1 = require("./dto/create-role.dto");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    create(request, createProjectDto) {
        return this.projectsService.create(createProjectDto, request.systemInfo.userId);
    }
    findAll(request) {
        return this.projectsService.findAll();
    }
    findFlags(id, search = '', pageSize = 10, pageNumber = 1) {
        return this.projectsService.findFlags(id, search, pageSize, pageNumber);
    }
    getFlag(id, flagId) {
        return this.projectsService.getFlagInfo(id, flagId);
    }
    createFlags(id, createFeatureFlagDto, request) {
        return this.projectsService.createFlags(id, createFeatureFlagDto, request.systemInfo.userId);
    }
    getProjectRoles(id) {
        return this.projectsService.getProjectRoles(id);
    }
    createProjectRole(id, createProjectRoleDto) {
        return this.projectsService.createProjectRole(id, createProjectRoleDto);
    }
    removeProjectRole(roleId) {
        return this.projectsService.removeProjectRole(roleId);
    }
    getProjectKeys(id, request) {
        return this.projectsService.getProjectKeys(id);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/flags'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findFlags", null);
__decorate([
    (0, common_1.Get)(':id/flags/:flagId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('flagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getFlag", null);
__decorate([
    (0, common_1.Post)(':id/flags'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createFlags", null);
__decorate([
    (0, common_1.Get)(':id/roles'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getProjectRoles", null);
__decorate([
    (0, common_1.Post)(':id/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createProjectRole", null);
__decorate([
    (0, common_1.Delete)(':id/roles/:roleId'),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "removeProjectRole", null);
__decorate([
    (0, common_1.Get)(':id/keys'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getProjectKeys", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map