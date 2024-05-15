import { createWeb3Modal } from "@web3modal/wagmi/react";

import { http, createConfig, WagmiProvider } from "wagmi";
import { confluxESpaceTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ConnectWalletAction from "./components/connect";
import SendCFX from "./components/actions/sendCFX";
import { Toaster } from "@/components/ui/toaster";
import PersonalSign from "./components/actions/PersonalSign";
import SignTypedDataV4 from "./components/actions/SignTypedDataV4";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "test-dapp",
  description: "Wallet connect demo",
  url: "https://vercel.app", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const config = createConfig({
  chains: [confluxESpaceTestnet],
  transports: {
    [confluxESpaceTestnet.id]: http(import.meta.env.VITE_RPC_TESTNET || ""),
  },
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
});

function ContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default function App() {
  return (
    <ContextProvider>
      <div className="w-full h-full">
        <ConnectWalletAction />
        <div className="flex flex-wrap">
          <div className="w-1/2">
            <SendCFX />
          </div>

          <div className="w-1/2">
            <PersonalSign />
          </div>

          <div className="w-1/2">
            <SignTypedDataV4 />
          </div>
        </div>
        <Toaster />
      </div>
    </ContextProvider>
  );
}
