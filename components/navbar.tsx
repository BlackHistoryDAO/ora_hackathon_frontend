'use client';

import Image from "next/image";
import { ThemeToggle } from "./theme-toggle"
import Background from "./background"
import ConnectWallect from "./connect";
import { MetaMaskProvider } from "@metamask/sdk-react";
import ConnectContract from "./connectContract";

const Navbar = () => {
  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: host,
    },
  };
  return (
    <Background image="images/bg-image.jpg">
      <div className="flex flex-col">
        <div className="flex items-center justify-between flex-row-reverse border border-white p-3 rounded-md bg-opacity-25 backdrop-blur-lg backdrop-filter m-8">
          <div className="flex gap-2 flex-row-reverse">
            <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
              <ConnectWallect />
            </MetaMaskProvider>
            <ThemeToggle />
          </div>
          <div>
            <Image
              src="/images/next.svg"
              alt="Next.js Logo"
              width={72}
              height={40}
            />
          </div>
        </div>
        <div className='flex gap-6'>
          <ConnectContract />
        </div>
      </div>
    </Background>

  )
}

export default Navbar