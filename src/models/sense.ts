export const SENSES = ['blindsight', 'darkvision', 'tremorsense', 'truesight'] as const;
export type Sense = (typeof SENSES)[number];
