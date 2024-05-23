import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { erc20ABI } from "../../../constants/contract.json";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";

export default function Mint20({ to }: { to?: Address | null }) {
  const [value, setValue] = useState("1");
  const { address, chainId } = useAccount();
  const { sendTransaction, isPending, data } = useSendTransaction();
  const openExplorer = useOpenExplorer();
  const handleMint = useCallback(() => {
    if (!to) return;
    const data = encodeFunctionData({
      abi: erc20ABI,
      functionName: "mint",
      args: [address, parseUnits(value, 18)],
    });
    sendTransaction({
      to: to,
      data: data,
    });
  }, [address, value, sendTransaction, to]);

  return (
    <div className="flex  flex-col gap-5">
      {data && (
        <div>
          <Button onClick={() => openExplorer(chainId, data)}>
            view in explorer
          </Button>
        </div>
      )}
      <Label>
        <span>Amount</span>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </Label>
      <Button onClick={handleMint} disabled={isPending} loading={isPending}>
        MINT
      </Button>
    </div>
  );
}
