'use client';

import React from 'react'
import { useSDK } from '@metamask/sdk-react';
import { formatAddress } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Button } from './ui/button';

const ConnectWallect = () => {
  const { sdk, connecting, connected, account } = useSDK();
  const [signedMessage, setSignedMessage] = React.useState<string>("");

  const handleConnect = async () => {
    try {
      const message = "Connect to this Ora hackacton winner Dapp";
      const signature = await sdk?.connectAndSign({msg: message});
      setSignedMessage(signature);
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  }

  const handleDisconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  }

  return (
    <div className="relative">
      {connected ? (
        <Popover>
          <PopoverTrigger>
            <Button>{formatAddress(account)}</Button>
          </PopoverTrigger>
          <PopoverContent className="mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
            <Button
              onClick={handleDisconnect}
              className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
            >
              Disconnect
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <div className='flex flex-col gap-y-3'>
          <Button disabled={connecting} onClick={handleConnect}>
            Connect Wallet
          </Button>
          {signedMessage && <p>Signed Message: {signedMessage}</p>}
        </div>

      )}
    </div>
  )
}

export default ConnectWallect;