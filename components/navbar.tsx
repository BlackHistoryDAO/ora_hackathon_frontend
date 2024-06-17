import Image from "next/image";
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import Background from "./background"

const Navbar = () => {
  return (
    <Background image="images/bg-image.jpg">
      <div className="flex flex-col">
        <div className="flex items-center justify-between flex-row-reverse border border-white p-3 rounded-md bg-gradient-to-tr from-white via-transparent to-black opacity-25 backdrop-blur-lg backdrop-filter m-8">
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
      </div>

    </Background>

  )
}

export default Navbar