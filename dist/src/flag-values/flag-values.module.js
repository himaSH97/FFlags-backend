"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlagValuesModule = void 0;
const common_1 = require("@nestjs/common");
const flag_values_service_1 = require("./flag-values.service");
const flag_values_controller_1 = require("./flag-values.controller");
let FlagValuesModule = class FlagValuesModule {
};
exports.FlagValuesModule = FlagValuesModule;
exports.FlagValuesModule = FlagValuesModule = __decorate([
    (0, common_1.Module)({
        controllers: [flag_values_controller_1.FlagValuesController],
        providers: [flag_values_service_1.FlagValuesService],
    })
], FlagValuesModule);
//# sourceMappingURL=flag-values.module.js.map