import TooltipLink from "@/components/TooltipLink";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export const metadata = {
  title: "Talkio | Home",
  description: "Talkio Social Chat App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col justify-evenly items-center h-screen p-10">
      <h1 className="text-6xl">🗣️Talkio🗣️</h1>
      <p className="text-3xl text-center">
        Welcome to Talkio, come sign in and chat about whatever you want.
      </p>
      <div className="text-5xl">
        <TooltipProvider>
          <TooltipLink
            href="/posts"
            linkText="Get Started"
            tooltipText="Click here to see what's happening"
          />
        </TooltipProvider>
      </div>
    </div>
  );
}
