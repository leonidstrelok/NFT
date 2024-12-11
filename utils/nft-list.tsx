import React, { useEffect, useState } from 'react';
import axios from 'axios';


export const useNftList = (collectionId: string) => {
    const [nftDataList, setNftDataList] = useState([]);

    useEffect(() => {
        async function loadNFTs() {
            const response = await axios.get(`/api/collections/${collectionId}/nfts`);
            setNftDataList(response.data);
        }

        if (collectionId) {
            loadNFTs();
        }
    }, [collectionId])

    return nftDataList;
}