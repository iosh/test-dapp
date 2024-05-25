import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
type Inputs = {
  toAddress: string;
  value: string;
};

import { erc20ABI } from "../../../constants/contract.json";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";
export default function Approve20({ to }: { to?: Address | null }) {
  const { chainId } = useAccount();
  const {
    sendTransaction,
    isPending,

    data: hash,
  } = useSendTransaction();

  const openExplorer = useOpenExplorer();

  const { register, handleSubmit } = useForm<Inputs>();

  const handleApproval: SubmitHandler<Inputs> = useCallback(
    ({ toAddress, value }) => {
      if (!to) return;
      const data = encodeFunctionData({
        abi: erc20ABI,
        functionName: "approve",
        args: [toAddress, value],
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
          <span>value</span>
          <Input
            {...register("value", { required: true })}
            defaultValue={"115792089237316195423570985008687907853269984665640564039457584007913129639935"}
          />
        </Label>

        <Button type="submit" disabled={isPending} loading={isPending}>
          Approve
        </Button>
      </form>
    </div>
  );
}
