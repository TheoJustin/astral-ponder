import { createConfig } from "ponder";

import { WorldListAbi } from "./abis/WorldListAbi";
import { ERC721Abi } from "./abis/ERC721Abi";

export default createConfig({
  chains: {
    liskSepolia: {
      id: 4202,
      rpc: 'https://rpc.sepolia-api.lisk.com',
      ethGetLogsBlockRange: 2000,
    },
  },
  contracts: {
    WorldList: {
      chain: 'liskSepolia',
      abi: WorldListAbi,
      address: '0x962A73Eb2D74CDdDf2222659D26Cea7Be438101A',
      startBlock: 29441618, // Start closer to deployment
    },
    ERC721Contract: {
      chain: 'liskSepolia',
      abi: ERC721Abi,
      address: '0x3B933C7502Ff45e0706E410B36E3CEE24D7c5271',
      startBlock: 29458308,
    },
  },
});
