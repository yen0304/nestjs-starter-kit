export const NODE_ENV = ['development', 'production', 'test'] as const;

export type NodeEnv = (typeof NODE_ENV)[number];
