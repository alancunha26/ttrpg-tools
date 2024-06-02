export const systems = [
  { code: 'dnd5e', label: 'Dungeons & Dragons 5e' },
  { code: 'pf2e', label: 'Pathfinder 2e' }
] as const;

export type System = (typeof systems)[number]['code'];
