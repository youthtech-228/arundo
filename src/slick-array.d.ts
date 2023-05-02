declare module 'slick-array' {
  export class SlickArray<T = unknown> extends Array<T> {
    constructor(config, ...args: Array<T>);

    add(...items: Array<T>): Array<T> | T;
    remove(...items: Array<T>): Array<T> | T;

    by: {
      [path: string]: {
        [key: string]: T;
      };
    };

    // All properties need to be a subtype of the index signature
    [groups: string]: T[] | unknown;
  }
}
