import { useAccount, useSendTransaction, useTransaction } from "wagmi";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const SendCFX = () => {
  const { address } = useAccount();

  const { sendTransaction } = useSendTransaction();

  const handleSendTransaction = useCallback(() => {}, []);
  const [receiver, setReviver] = useState<string>(address as string);

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>send cfx to</CardTitle>
      </CardHeader>
      <CardContent className=" flex flex-col gap-5">
        <Label>
            Address
          <Input
            placeholder={address}
            value={receiver}
            onChange={(e) => setReviver(e.target.value)}
          />
        </Label>
        <Input />
        <Button>send</Button>
      </CardContent>
    </Card>
  );
};

export default SendCFX;
