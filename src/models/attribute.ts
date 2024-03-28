export const ATTRIBUTES = [
  {
    code: 'str',
    name: 'Strength'
  },
  {
    code: 'con',
    name: 'Constitution'
  },
  {
    code: 'dex',
    name: 'Dexterity'
  },
  {
    code: 'int',
    name: 'Intelligence'
  },
  {
    code: 'cha',
    name: 'Charisma'
  },
  {
    code: 'wis',
    name: 'Wisdom'
  }
] as const;

export type Attribute = (typeof ATTRIBUTES)[number];
export type AttributeCode = Attribute['code'];
export type AttributeName = Attribute['name'];
