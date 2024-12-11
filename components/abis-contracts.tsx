import { createContext, useContext, useEffect } from "react";
import { useWeb3 } from './web3';

const errorMsg = {
  wrongNetwork: 'Wrong network, connect goerli network',
  walletDenied: 'Unlock your wallet or install any provider wallet like MetaMask',
}

interface abisContractI {
  url: String,
  contract?: any,
}

const abisContracts = {
  nft: {
    url: '/abis/NFT.json',
  } as abisContractI,
  market: {
    url: '/abis/NFTMarketPlace.json',
  } as abisContractI,
  auction: {
    url: '/abis/Auction.json'
  } as abisContractI,
}

export const AbisContractsContext = createContext(abisContracts);

export default function AbisContractsProvider({ children }) {
  const web3Api = useWeb3();
  const account = web3Api.account;

  async function getContract(link) {
    const netWorkId = await web3Api.web3.eth.net.getId();

    const contractFile = await fetch(link);
    const convertContractFileToJson = await contractFile.json();
    const abi = convertContractFileToJson.abi;
    const workObject = convertContractFileToJson.networks[netWorkId];

    if (workObject) {
      const address = workObject.address;

      const deployedContract = await new web3Api.web3.eth.Contract(
        abi,
        address,
      );

      // // Might check right here if bad account and throw an exception
      // if (!account)
      //   throw errorMsg.walletDenied;

      // Return contract successfully
      return deployedContract;
    } else {
      throw errorMsg.wrongNetwork;
    }
  }

  useEffect(() => {
    const loadContracts = async () => {
      for (let [key, value] of Object.entries(abisContracts)) {
        if (abisContracts.hasOwnProperty(key)) {
          try {
            getContract(value.url).then(
              res => {
                abisContracts[key].contract = res;
              },
              err => {
                console.error(err);
              }
            )
          } catch (error) {
            console.error(error);
          }
        }
      }
    }

    web3Api.web3 && loadContracts();
  }, [web3Api.web3]);

  return (
    <AbisContractsContext.Provider value={abisContracts}>
      {children}
    </AbisContractsContext.Provider>
  )
}

export function useAbisContracts() {
  return useContext(AbisContractsContext);
}