type Role = 'owner' | 'admin' | 'viewer';
type Action = 'create' | 'read' | 'update' | 'delete';
type Feature = 'members' | 'projects' | 'featureFlags' | 'featureFlagValues';
type FeaturePermissions = {
    [action in Action]: boolean;
};
type TFFPermissions = {
    [role in Role]: {
        [feature in Feature]: FeaturePermissions;
    };
};
type TUserPermissions = {
    [feature in Feature]: FeaturePermissions;
};
declare const FFPermissions: TFFPermissions;
export { Role, Action, Feature, FeaturePermissions, TFFPermissions, TUserPermissions, FFPermissions, };
