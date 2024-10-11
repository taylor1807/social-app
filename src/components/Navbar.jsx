import Link from "next/link";
import TooltipLink from "./TooltipLink";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Londrina } from "@/app/layout";

export default function Navbar() {
  return (
    <div className="p-10 ">
      <nav className="flex justify-evenly text-5xl fixed top-0 w-full p-5 z-50 bg-black">
        <TooltipProvider>
          <TooltipLink
            href="/"
            className={Londrina.className}
            linkText="Home"
            tooltipText={"Click here to visit the HomePage"}
          />
          <TooltipLink
            href="/posts"
            className={Londrina.className}
            linkText="Feed"
            tooltipText="Click here to view the posts feed"
          />
          <TooltipLink
            href="/profile"
            className={Londrina.className}
            linkText="Profile"
            tooltipText="Click here to view/update your profile"
          />
        </TooltipProvider>

        <SignedOut>
          <SignInButton className="px-4 py-2 bg-blue-500 text-white rounded  hover:bg-blue-600 transition-colors" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </div>
  );
}
