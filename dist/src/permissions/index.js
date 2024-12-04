"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FFPermissions = void 0;
const FFPermissions = {
    owner: {
        members: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
        projects: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
        featureFlags: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
        featureFlagValues: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
    },
    admin: {
        members: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
        projects: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
        featureFlags: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
        featureFlagValues: {
            create: true,
            read: true,
            update: true,
            delete: true,
        },
    },
    viewer: {
        members: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
        projects: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
        featureFlags: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
        featureFlagValues: {
            create: false,
            read: true,
            update: false,
            delete: false,
        },
    },
};
exports.FFPermissions = FFPermissions;
//# sourceMappingURL=index.js.map