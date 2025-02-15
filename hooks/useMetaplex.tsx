import { Metaplex } from '@metaplex-foundation/js';
import { createContext, useContext } from 'react';

const DEFAULT_CONTEXT = {
  metaplex: null as Metaplex,
};

export const MetaplexContext = createContext(DEFAULT_CONTEXT);

export function useMetaplex() {
  return useContext(MetaplexContext);
}
