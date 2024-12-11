import { Metaplex } from '@metaplex-foundation/js';
import { log } from 'console';
import { createContext, useContext } from 'react';

const DEFAULT_CONTEXT = {
  metaplexKeypair: null as Metaplex,
};

export const MetaplexContextKeypair = createContext(DEFAULT_CONTEXT);

export function useMetaplexKeypair() {
  return useContext(MetaplexContextKeypair);
}
