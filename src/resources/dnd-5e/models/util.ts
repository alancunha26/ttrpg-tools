export interface MediaHrefInternal {
  type: 'internal';
  path: string;
}

export interface MediaHrefExternal {
  type: 'external';
  url: string;
}

export type MediaHref = MediaHrefInternal | MediaHrefExternal;
