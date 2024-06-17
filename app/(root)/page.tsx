import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-full">
      <div className="flex items-center justify-between flex-row-reverse w-full border border-white p-3 rounded-md bg-opacity-25 backdrop-blur-lg backdrop-filter">
        <div className="flex gap-2 flex-row-reverse">
          <Button className="border border-white p-4 rounded">Connect wallet</Button>
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
    </main>
  );
}
