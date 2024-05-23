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
  address: string;
};

export default function BatchTransfer({ to }: { to?: Address | null }) {
  const openExplorer = useOpenExplorer();
  const { isPending, data: hash, sendTransaction } = useSendTransaction();
  const { register, handleSubmit } = useForm<Inputs>();
  const { chainId, address } = useAccount();

  const _handleSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ ids, amounts, address: addr }) => {
      if (!to) return;

      const idsArray = ids.split(",").map((id) => Number(id));
      const amountsArray = amounts.split(",").map((amount) => Number(amount));

      const data = encodeFunctionData({
        abi: erc1155Abi,
        functionName: "safeBatchTransferFrom",
        args: [address, addr, idsArray, amountsArray, "0x"],
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
            <Input
              defaultValue={"0x85eDbA5fada66f3D58bC7920Eff3F90BD69dB9FB"}
              {...register("address", { required: true })}
            />
          </Label>
        </div>
        <div>
          <Label>
            Batch Transfer Token IDs
            <Input
              {...register("ids", { required: true })}
              defaultValue="1,3,4,5"
            />
          </Label>
        </div>
        <div>
          <Label>
            Batch Transfer Token ID Amounts
            <Input
              {...register("amounts", { required: true })}
              defaultValue="1000,500,9999,1333"
            />
          </Label>
        </div>

        <Button type="submit" loading={isPending} disabled={isPending}>
          BATCH TRANSFER
        </Button>
      </form>
    </div>
  );
}
