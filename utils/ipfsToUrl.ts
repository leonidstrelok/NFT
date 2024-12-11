const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;


export const ipfsToUrl = (ipfsUrl): string | null => ipfsUrl ? `${gateway}/ipfs/${ipfsUrl}` : null;
