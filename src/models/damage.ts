export const DAMAGE_TYPES = [
  {
    name: 'acid',
    code: 'A'
  },
  {
    name: 'bludgeoning',
    code: 'B'
  },
  {
    name: 'cold',
    code: 'C'
  },
  {
    name: 'fire',
    code: 'F'
  },
  {
    name: 'force',
    code: 'O'
  },
  {
    name: 'lightning',
    code: 'L'
  },
  {
    name: 'necrotic',
    code: 'N'
  },
  {
    name: 'piercing',
    code: 'P'
  },
  {
    name: 'poison',
    code: 'I'
  },
  {
    name: 'psychic',
    code: 'Y'
  },
  {
    name: 'radiant',
    code: 'R'
  },
  {
    name: 'slashing',
    code: 'S'
  },
  {
    name: 'thunder',
    code: 'T'
  }
] as const;

export type DamageType = (typeof DAMAGE_TYPES)[number];
export type DamageTypeCode = DamageType['code'];
export type DamageTypeName = DamageType['name'];
