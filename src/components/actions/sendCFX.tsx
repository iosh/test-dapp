import { useAccount, useSendTransaction, useChains, useChainId } from "wagmi";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCallback, useMemo } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isAddress, parseEther } from "viem";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";
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

  const openExplorer = useOpenExplorer();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const handleSendTransaction: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      if (isAddress(data.address)) {
        sendTransaction({
          to: data.address,
          value: parseEther(data.amount),
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
