import type ar from "./ar";

/**
 * Arabic is the source of truth for the translation shape.
 * Every English file is annotated with `Translation["<section>"]`, so a key
 * that exists in one language but not the other fails type-checking.
 */
export type Translation = typeof ar;

type Paths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string
        ? K
        : `${K}.${Paths<T[K]> & string}`;
    }[keyof T & string];

/** Union of every valid dotted key, e.g. "navbar.home" | "auth.login". */
export type TranslationKey = Paths<Translation>;
