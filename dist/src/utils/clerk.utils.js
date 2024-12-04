"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFields = getUserFields;
function getUserFields(clerkUsers) {
    return clerkUsers.reduce((acc, user) => {
        acc[user.id] = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            imageUrl: user.imageUrl || '',
        };
        return acc;
    }, {});
}
//# sourceMappingURL=clerk.utils.js.map