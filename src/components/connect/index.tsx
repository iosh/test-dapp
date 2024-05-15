import { Button } from "../ui/button";
import { useAccount, useDisconnect } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const ConnectWalletAction = () => {
  const { isConnected, address, chainId } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    open();
  };
  console.log(chainId);
  return (
    <div className="flex justify-center">
      {isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connected</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <span>Address: {address}</span>
            <span>ChainId: {chainId}</span>

            <Button onClick={() => disconnect()}>disconnect</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connect to Wallet </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleConnect}>
              confluxESpaceTestnet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConnectWalletAction;
