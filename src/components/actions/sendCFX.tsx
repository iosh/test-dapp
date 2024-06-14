import { useAccount, useSendTransaction, useChainId } from "wagmi";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCallback } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isAddress, parseEther } from "viem";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";
type Inputs = {
  address: string;
  amount: string;
  gasPrice?: string;
  gasLimit?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  type?: "0" | "1" | "2";
};

const mapType = {
  "0": "legacy",
  "1": "eip2930",
  "2": "eip1559",
} as const;

const SendCFX = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { sendTransaction, data: hash, isPending } = useSendTransaction();
  const { toast } = useToast();

  const openExplorer = useOpenExplorer();
  const { register, handleSubmit } = useForm<Inputs>();
  const handleSendTransaction: SubmitHandler<Inputs> = useCallback(
    async ({
      address,
      amount,
      type,
      gasPrice,
      gasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
    }) => {
      if (isAddress(address)) {
        sendTransaction({
          to: address,
          value: parseEther(amount),
          type: type ? mapType[type] : undefined,
          gasPrice: gasPrice ? BigInt(gasPrice) : undefined,
          gas: gasLimit ? BigInt(gasLimit) : undefined,
          maxFeePerGas: maxFeePerGas ? BigInt(maxFeePerGas) : undefined,
          maxPriorityFeePerGas: maxPriorityFeePerGas
            ? BigInt(maxPriorityFeePerGas)
            : undefined,
        });
      } else {
        toast({ title: "error", description: '"invalid address"' });
      }
    },
    [sendTransaction, toast]
  );

  const handleOpenExplorer = useCallback(() => {
    openExplorer(chainId, hash);
  }, [chainId, hash, openExplorer]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>send cfx to</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className=" flex flex-col gap-5"
          onSubmit={handleSubmit(handleSendTransaction)}
        >
          <Label>
            Type 0 1 2 (optional)
            <Input {...register("type")} />
          </Label>
          <Label>
            GasPrice (optional)
            <Input {...register("gasPrice")} />
          </Label>
          <Label>
            gasLimit (optional)
            <Input {...register("gasLimit")} />
          </Label>
          <Label>
            maxFeePerGas (optional)
            <Input {...register("maxFeePerGas")} />
          </Label>
          <Label>
            maxPriorityFeePerGas (optional)
            <Input {...register("maxPriorityFeePerGas")} />
          </Label>
          <Label>
            Address
            <Input
              defaultValue={address}
              {...register("address", { required: true })}
            />
          </Label>
          <Label>
            Amount
            <Input
              defaultValue={"0.01"}
              {...register("amount", { required: true })}
            />
          </Label>

          {hash && (
            <div className="w-full">
              <p className="break-all"> tx hash:{hash} </p>
              <Button onClick={handleOpenExplorer}>open in explorer</Button>
            </div>
          )}
          <Button disabled={isPending} loading={isPending} type="submit">
            SEND
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendCFX;
