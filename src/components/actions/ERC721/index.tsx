import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback } from "react";
import { Hex, encodeDeployData } from "viem";
import { useSendTransaction, useTransactionReceipt } from "wagmi";
import { nftsAbi, nftsBytecode } from "../../../constants/contract.json";
import { Button } from "@/components/ui/button";
import Mint721 from "./mint";
import ApproveNFT from "./approve";
import RevokeNFT from "./revokeNFT";
import TransferNFT from "./tansferNFT";

import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Inputs {
  name: string;
  symbol: string;
}
export default function ERC721() {
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
        abi: nftsAbi,
        bytecode: nftsBytecode as Hex,
        args: [name, symbol, ""],
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
        <CardTitle>ERC721</CardTitle>
      </CardHeader>

      <CardContent className="flex  flex-col gap-5">
        {isSuccess && isReceiptSuccess && (
          <span className="break-all">{receipt.contractAddress}</span>
        )}
        <form onSubmit={handleSubmit(handleDeploy)}>
          <Label>
            <span>Name</span>
            <Input
              type="text"
              {...register("name", { required: true })}
              defaultValue={"test"}
            />
          </Label>

          <Label>
            <span>Symbol</span>
            <Input
              type="text"
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
            <Mint721 to={receipt?.contractAddress} />
            <ApproveNFT to={receipt?.contractAddress} />
            <RevokeNFT to={receipt?.contractAddress} />
            <TransferNFT to={receipt?.contractAddress} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
