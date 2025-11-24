import { createConfig } from "ponder";

import { WorldListAbi } from "./abis/WorldListAbi";

export default createConfig({
  chains: {
    liskSepolia: {
      id: 4202,
      rpc: "https://rpc.sepolia-api.lisk.com",
    },
  },
  contracts: {
    WorldList: {
      chain: "liskSepolia",
      abi: WorldListAbi,
      address: "0x962A73Eb2D74CDdDf2222659D26Cea7Be438101A",
      startBlock: 29341618,
    },
  },
});
