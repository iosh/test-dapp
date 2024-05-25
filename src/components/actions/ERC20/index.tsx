import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback } from "react";
import { Hex, encodeDeployData } from "viem";
import { useSendTransaction, useTransactionReceipt } from "wagmi";
import { erc20ABI, erc20Bytecode } from "../../../constants/contract.json";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Mint20 from "./mint20";
import Transfer20 from "./transfer20";
import Approve20 from "./approve20";

interface Inputs {
  name: string;
  symbol: string;
}

export default function ERC20() {
  const { register, handleSubmit } = useForm<Inputs>();
  const {
    data: hash,
    sendTransaction,
    isSuccess,
    isPending,
  } = useSendTransaction();

  const {
    data: receipt,
    isPaused: isReceiptPending,
    isSuccess: isReceiptSuccess,
  } = useTransactionReceipt({ hash });

  const handleDeploy: SubmitHandler<Inputs> = useCallback(
    ({ name, symbol }) => {
      const data = encodeDeployData({
        abi: erc20ABI,
        bytecode: erc20Bytecode as Hex,
        args: [name, symbol],
      });
      sendTransaction({
        to: undefined as any,
        data,
      });
    },
    [sendTransaction]
  );
  const isDeployPending =
    isPending || isSuccess ? isReceiptPending || !isReceiptSuccess : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ERC20</CardTitle>
      </CardHeader>

      <CardContent className="flex  flex-col gap-5">
        {isSuccess && isReceiptSuccess && (
          <span className="break-all">{receipt.contractAddress}</span>
        )}
        <form onSubmit={handleSubmit(handleDeploy)}>
          <Label>
            <span>Name</span>
            <Input
              {...register("name", { required: true })}
              defaultValue={"test"}
            />
          </Label>
          <Label>
            <span>Symbol</span>
            <Input
              {...register("symbol", { required: true })}
              defaultValue={"test"}
            />
          </Label>
          <Button
            disabled={isDeployPending}
            loading={isDeployPending}
            type="submit"
          >
            DEPLOY
          </Button>
        </form>
        {receipt && (
          <div className="flex  flex-col gap-5">
            <Mint20 to={receipt.contractAddress} />
            <Transfer20 to={receipt.contractAddress} />
            <Approve20 to={receipt.contractAddress}/>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
