import { useAccount, useSendTransaction, useChains, useChainId } from "wagmi";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCallback, useMemo } from "react";
import { keccak256 } from "viem";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isAddress, parseEther } from "viem";
type Inputs = {
  address: string;
  amount: string;
};

const SendCFX = () => {
  const { address } = useAccount();
  const chains = useChains();
  const chainId = useChainId();
  const { sendTransaction, data: hash, isPending } = useSendTransaction();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleSendTransaction: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      if (isAddress(data.address)) {
        const tx = sendTransaction({
          to: data.address,
          value: parseEther(data.amount),
        });
        console.log(tx);
      } else {
        toast({ title: "error", description: '"invalid address"' });
      }
    },
    [sendTransaction, toast]
  );
  const txHash = useMemo(() => {
    if (hash) {
      return keccak256(hash);
    }
    return "";
  }, [hash]);

  const openExplorer = useCallback(() => {
    const currentChain = chains.find((chain) => chain.id === chainId);
    if (currentChain) {
      window.open(
        `${currentChain.blockExplorers?.default.url}/tx/${txHash}`,
        "_blank"
      );
    }
  }, [chainId, chains, txHash]);

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
              <p className="break-all"> hash:{txHash} </p>
              <Button onClick={openExplorer}>open in explorer</Button>
            </div>
          )}
          <Button disabled={isPending} type="submit">
            SEND
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendCFX;
