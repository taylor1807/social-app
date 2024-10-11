import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Talkio | Sign-Up",
  description: "Talkio Social Chat App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function SignUpPage() {
  return (
    <div className="flex justify-center content-center">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#B22222",
            colorBackground: "#FFC0CB",
          },
          elements: {
            card: "shadow-lg rounded-lg bg-red-100",
            headerTitle: "text-4xl text-red-700",
            inputField: "border-gray-300",
            button: "bg-red-700 text-white hover:bg-red-800",
          },
        }}
      />
    </div>
  );
}
