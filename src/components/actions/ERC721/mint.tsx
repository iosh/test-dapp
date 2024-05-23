import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { Address, encodeFunctionData } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { nftsAbi } from "../../../constants/contract.json";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";

export default function Mint721({ to }: { to?: Address | null }) {
  const { address, chainId } = useAccount();
  const { sendTransaction, isPending, data } = useSendTransaction();
  const openExplorer = useOpenExplorer();

  const handleMint = useCallback(() => {
    if (!to) return;
    const data = encodeFunctionData({
      abi: nftsAbi,
      functionName: "mint",
      args: [address],
    });
    sendTransaction({
      to: to,
      data: data,
    });
  }, [address, to, sendTransaction]);

  return (
    <div className="flex  flex-col gap-5">
      {data && (
        <div>
          <Button onClick={() => openExplorer(chainId, data)}>
            view in explorer
          </Button>
        </div>
      )}
      <Button onClick={handleMint} disabled={isPending} loading={isPending}>
        MINT
      </Button>
    </div>
  );
}
