import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";
import { Address, encodeFunctionData } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  toAddress: string;
  tokenId: string;
};

import { nftsAbi } from "../../../constants/contract.json";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";
export default function ApproveNFT({ to }: { to?: Address | null }) {
  const { chainId } = useAccount();
  const {
    sendTransaction,
    isPending,

    data: hash,
  } = useSendTransaction();

  const openExplorer = useOpenExplorer();

  const { register, handleSubmit } = useForm<Inputs>();

  const handleApproval: SubmitHandler<Inputs> = useCallback(
    ({ toAddress, tokenId }) => {
      if (!to) return;
      const data = encodeFunctionData({
        abi: nftsAbi,
        functionName: "approve",
        args: [toAddress, tokenId],
      });

      sendTransaction({
        to,
        data,
      });
    },
    [sendTransaction, to]
  );

  return (
    <div>
      {hash && (
        <Button onClick={() => openExplorer(chainId, hash)}>
          View in explorer
        </Button>
      )}
      <form onSubmit={handleSubmit(handleApproval)}>
        <Label>
          <span>To</span>
          <Input
            {...register("toAddress", { required: true })}
            defaultValue={"0x85eDbA5fada66f3D58bC7920Eff3F90BD69dB9FB"}
          />
        </Label>
        <Label>
          <span>id</span>
          <Input
            {...register("tokenId", { required: true })}
            defaultValue={"0"}
          />
        </Label>

        <Button type="submit" disabled={isPending} loading={isPending}>
          APPROVAL
        </Button>
      </form>
    </div>
  );
}
