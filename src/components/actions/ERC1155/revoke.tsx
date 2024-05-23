import { Button } from "../../ui/button";
import { erc1155Abi } from "../../../constants/contract.json";
import { useCallback, useState } from "react";
import { Address, encodeFunctionData } from "viem";
import { useAccount, useSendTransaction } from "wagmi";
import { useOpenExplorer } from "@/hooks/useOpenExplorer";
import { Input } from "@/components/ui/input";

function RevokeApproval({ to }: { to?: Address | null }) {
  const {
    data: hash,
    sendTransaction,
    isSuccess,
    isPending,
  } = useSendTransaction();

  const { chainId } = useAccount();
  const openExplorer = useOpenExplorer();
  const [value, setValue] = useState(
    "0x85eDbA5fada66f3D58bC7920Eff3F90BD69dB9FB"
  );

  const handleApprovalForAll = useCallback(() => {
    const data = encodeFunctionData({
      abi: erc1155Abi,
      functionName: "setApprovalForAll",
      args: [value, false],
    });
    sendTransaction({ to: to as any, data });
  }, [to, sendTransaction, value]);

  return (
    <div className="flex flex-col gap-5">
      {isSuccess && (
        <div className="w-full">
          <div>
            <p>
              ERC 1155 Revoke Approval to
              {value} is success
            </p>

            <Button onClick={() => openExplorer(chainId, hash)}>
              open in explorer
            </Button>
          </div>
        </div>
      )}
      <div className="w-full">
        <Input value={value} onChange={(v) => setValue(v.target.value)} />
        <Button
          disabled={isPending}
          loading={isPending}
          onClick={handleApprovalForAll}
        >
          REVOKE
        </Button>
      </div>
    </div>
  );
}

export default RevokeApproval;
