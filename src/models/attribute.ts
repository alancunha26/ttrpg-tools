export const ATTRIBUTES = [
  {
    code: 'str',
    name: 'strength'
  },
  {
    code: 'con',
    name: 'constitution'
  },
  {
    code: 'dex',
    name: 'dexterity'
  },
  {
    code: 'int',
    name: 'intelligence'
  },
  {
    code: 'cha',
    name: 'charisma'
  },
  {
    code: 'wis',
    name: 'wisdom'
  }
] as const;

export type Attribute = (typeof ATTRIBUTES)[number];
export type AttributeCode = Attribute['code'];
export type AttributeName = Attribute['name'];

export const SKILLS = [
  {
    skill: 'athletics',
    attr: 'str'
  },
  {
    skill: 'acrobatics',
    attr: 'dex'
  },
  {
    skill: 'sleight of hand',
    attr: 'dex'
  },
  {
    skill: 'stealth',
    attr: 'dex'
  },
  {
    skill: 'arcana',
    attr: 'int'
  },
  {
    skill: 'history',
    attr: 'int'
  },
  {
    skill: 'investigation',
    attr: 'int'
  },
  {
    skill: 'nature',
    attr: 'int'
  },
  {
    skill: 'religion',
    attr: 'int'
  },
  {
    skill: 'animal handling',
    attr: 'wis'
  },
  {
    skill: 'insight',
    attr: 'wis'
  },
  {
    skill: 'medicine',
    attr: 'wis'
  },
  {
    skill: 'perception',
    attr: 'wis'
  },
  {
    skill: 'survival',
    attr: 'wis'
  },
  {
    skill: 'deception',
    attr: 'cha'
  },
  {
    skill: 'intimidation',
    attr: 'cha'
  },
  {
    skill: 'performance',
    attr: 'cha'
  },
  {
    skill: 'persuasion',
    attr: 'cha'
  }
] as const;

export type Skill = (typeof ATTRIBUTES)[number];
export type SkillCode = Skill['code'];
export type SkillName = Skill['name'];
