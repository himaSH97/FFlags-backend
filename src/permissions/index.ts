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

const FFPermissions: TFFPermissions = {
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

export {
  Role,
  Action,
  Feature,
  FeaturePermissions,
  TFFPermissions,
  TUserPermissions,
  FFPermissions,
};
