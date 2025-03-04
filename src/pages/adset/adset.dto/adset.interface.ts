export interface AdSet {
  adset_id: number;
  modules: { type: string; name: string }[];
}

export interface Tree {
  root: {
    geo: {
      [key: string]: {
        probability: number;
        modules: {
          [key: string]: {
            probability: number;
            options: { name: string; probability: number }[];
          };
        };
      };
    };
  };
}
