import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
type Inputs = {
  toAddress: string;
  amount: string;
};

import { erc20ABI } from "../../../constants/contract.json";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";
export default function Transfer20({ to }: { to?: Address | null }) {
  const { chainId } = useAccount();
  const {
    sendTransaction,
    isPending,

    data: hash,
  } = useSendTransaction();

  const openExplorer = useOpenExplorer();

  const { register, handleSubmit } = useForm<Inputs>();

  const handleApproval: SubmitHandler<Inputs> = useCallback(
    ({ toAddress, amount }) => {
      if (!to) return;
      const data = encodeFunctionData({
        abi: erc20ABI,
        functionName: "transfer",
        args: [toAddress, parseUnits(amount, 18)],
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
          <span>amount</span>
          <Input
            {...register("amount", { required: true })}
            defaultValue={"1"}
          />
        </Label>

        <Button type="submit" disabled={isPending} loading={isPending}>
          TRANSFER
        </Button>
      </form>
    </div>
  );
}
