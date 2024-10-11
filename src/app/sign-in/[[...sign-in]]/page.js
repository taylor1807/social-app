import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Talkio | Sign-In",
  description: "Talkio Social Chat App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function SignInPage() {
  return (
    <div className="flex justify-center content-center">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#1E3A8A",
            colorBackground: "#ADD8E6",
          },
          elements: {
            card: "shadow-lg rounded-lg bg-blue-100",
            headerTitle: "text-4xl text-indigo-700",
            inputField: "border-gray-300",
            button: "bg-indigo-700 text-white hover:bg-indigo-800",
          },
        }}
      />
    </div>
  );
}
