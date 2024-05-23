import { useCallback } from "react";
import { Hash } from "viem";
import { useChains } from "wagmi";

export const useOpenExplorer = () => {
  const chains = useChains();

  const open = useCallback(
    (chainId?: number, hash?: Hash) => {
      if (!chainId) return;
      const currentChain = chains.find((chain) => chain.id === chainId);
      if (currentChain) {
        window.open(
          `${currentChain.blockExplorers?.default.url}/tx/${hash}`,
          "_blank"
        );
      }
    },
    [chains]
  );

  return open;
};
