import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { erc1155Abi, erc1155Bytecode } from "../../../constants/contract.json";
import { useCallback } from "react";
import { Hex, encodeDeployData } from "viem";
import { useSendTransaction, useTransactionReceipt } from "wagmi";

import ApprovalForAll from "./approvalForAll";
import RevokeApproval from "./revoke";
import BatchMint from "./batchMint";
import BatchTransfer from "./barchTransfer";

export default function ERC1155() {
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

  const handleDeploy = useCallback(() => {
    const data = encodeDeployData({
      abi: erc1155Abi,
      bytecode: erc1155Bytecode as Hex,
    });
    sendTransaction({
      to: undefined as any,
      data,
    });
  }, [sendTransaction]);

  const isDeployPending =
    isPending || isSuccess ? isReceiptPending || !isReceiptSuccess : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ERC 1155</CardTitle>
      </CardHeader>

      <CardContent className="flex  flex-col gap-5">
        {isSuccess && isReceiptSuccess && (
          <span className="break-all">{receipt.contractAddress}</span>
        )}

        <Button
          onClick={handleDeploy}
          disabled={isDeployPending}
          loading={isDeployPending}
        >
          DEPLOY
        </Button>

        {isReceiptSuccess && (
          <div className="flex  flex-col gap-5">
            <BatchMint to={receipt.contractAddress} />
            <BatchTransfer to={receipt.contractAddress} />
            <ApprovalForAll to={receipt.contractAddress} />
            <RevokeApproval to={receipt.contractAddress} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
