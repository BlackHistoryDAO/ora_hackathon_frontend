'use client';

import React from 'react'
import { useSDK } from '@metamask/sdk-react';
import { formatAddress } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Button } from './ui/button';

const ConnectWallect = () => {
  const { sdk, connecting, connected, account } = useSDK();

  const handleConnect = async () => {
    try {
      await sdk?.connect();
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
        <Button disabled={connecting} onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
    </div>
  )
}

export default ConnectWallect;