import { createWeb3Modal } from "@web3modal/wagmi/react";

import { http, createConfig, WagmiProvider } from "wagmi";
import { confluxESpaceTestnet } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ConnectWalletAction from "./components/connect";
import SendCFX from "./components/actions/sendCFX";
import { defineChain } from "viem";

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

        <div>
          <SendCFX />
        </div>
      </div>
    </ContextProvider>
  );
}
