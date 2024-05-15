import { useAccount, useSignTypedData, useVerifyTypedData } from "wagmi";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useCallback, useMemo, useState } from "react";
import { Hex, verifyTypedData } from "viem";

const typedData = (chainId: number) => {
  return {
    domain: {
      chainId: chainId,
      name: "Ether Mail",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC" as Hex,
      version: "1",
    },
    message: {
      contents: "Hello, Bob!",
      from: {
        name: "Cow",
        wallets: [
          "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
          "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
        ],
      },
      to: [
        {
          name: "Bob",
          wallets: [
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
            "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
            "0xB0B0b0b0b0b0B000000000000000000000000000",
          ],
        },
      ],
      attachment: "0x",
    },
    primaryType: "Mail" as const,
    types: {
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person[]" },
        { name: "contents", type: "string" },
        { name: "attachment", type: "bytes" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallets", type: "address[]" },
      ],
    },
  };
};

const VerifyTypeData = ({
  hash,
  data,
  address,
}: {
  hash: Hex;
  data: ReturnType<typeof typedData>;
  address: Hex;
}) => {
  const {
    isError,
    error,
    isSuccess,
    data: isVerified,
  } = useVerifyTypedData({
    types: data.types,
    message: data.message,
    primaryType: data.primaryType,
    address: address,
    signature: hash,
  });
  return (
    <div>
      {isError && <div>{error.message}</div>}
      {isSuccess && (
        <span>Sign typed data is Verify {isVerified ? "success" : "fail"}</span>
      )}
    </div>
  );
};

const SignTypedDataV4 = () => {
  const {
    signTypedData,
    isPending,
    isSuccess,
    data: hash,
  } = useSignTypedData({});
  const { chainId, address } = useAccount();

  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const data = useMemo(() => {
    return chainId ? typedData(chainId) : null;
  }, [chainId]);
  const sign = useCallback(() => {
    if (data) {
      signTypedData({
        types: data.types,
        primaryType: data.primaryType,
        message: data.message,
      });
    }
  }, [signTypedData, data]);

  const verify = useCallback(async () => {
    if (address && data && hash) {
      setVerifying(true);
      const res = await verifyTypedData({
        address,
        types: data.types,
        primaryType: data.primaryType,
        message: data.message,
        signature: hash,
      });
      console.log(res);
      setIsVerified(res);
      setVerifying(false);
    }
  }, [address, data, hash]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>SignTypedDataV4</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button disabled={isPending} onClick={sign}>
          SIGN TYPED DATA
        </Button>

        {isSuccess && address && hash && data && (
          <VerifyTypeData address={address} data={data} hash={hash} />
        )}
      </CardContent>
    </Card>
  );
};

export default SignTypedDataV4;
