import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { erc1155Abi } from "../../../constants/contract.json";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";
import { Label } from "@radix-ui/react-label";
import { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Address, encodeFunctionData } from "viem";
import { useAccount, useSendTransaction } from "wagmi";

type Inputs = {
  ids: string;
  amounts: string;
};

export default function BatchMint({ to }: { to?: Address | null }) {
  const openExplorer = useOpenExplorer();
  const {
    isPending,

    data: hash,

    sendTransaction,
  } = useSendTransaction();
  const { register, handleSubmit } = useForm<Inputs>();
  const { chainId, address } = useAccount();

  const _handleSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ ids, amounts }) => {
      if (!to) return;

      const idsArray = ids.split(",").map((id) => Number(id));
      const amountsArray = amounts.split(",").map((amount) => Number(amount));
      console.log("is mint batch", idsArray, amountsArray);
      const data = encodeFunctionData({
        abi: erc1155Abi,
        functionName: "mintBatch",
        args: [address, idsArray, amountsArray, "0x"],
      });
      sendTransaction({
        to: to,
        data,
      });
    },
    [sendTransaction, to, address]
  );
  const handleOpenExplorer = useCallback(() => {
    openExplorer(chainId, hash);
  }, [chainId, hash, openExplorer]);

  return (
    <div>
      {hash && (
        <Button onClick={handleOpenExplorer}>view tx in explorer</Button>
      )}
      <form onSubmit={handleSubmit(_handleSubmit)}>
        <div>
          <Label>
            Batch Mint Token IDs
            <Input
              {...register("ids", { required: true })}
              defaultValue="1,3,4,5"
            />
          </Label>
        </div>
        <div>
          <Label>
            Batch Mint Token ID Amounts
            <Input
              {...register("amounts", { required: true })}
              defaultValue="1000,500,9999,1333"
            />
          </Label>
        </div>

        <Button type="submit" loading={isPending} disabled={isPending}>
          BATCH MINT
        </Button>
      </form>
    </div>
  );
}
