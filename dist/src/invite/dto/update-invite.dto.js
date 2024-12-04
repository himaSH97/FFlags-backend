"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInviteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_invite_dto_1 = require("./create-invite.dto");
class UpdateInviteDto extends (0, swagger_1.PartialType)(create_invite_dto_1.CreateInviteDto) {
}
exports.UpdateInviteDto = UpdateInviteDto;
//# sourceMappingURL=update-invite.dto.js.map