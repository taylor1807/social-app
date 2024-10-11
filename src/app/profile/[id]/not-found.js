export const metadata = {
  title: "Talkio | 404-User Not Found",
  description: "Talkio Social Chat App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function NotFoundPage() {
  return (
    <div>
      <h1>User Profile Not Found</h1>
      <p>
        Sorry, the user profile you&apos;re trying to view doesn&apos;t exist.
      </p>
      <a href="/posts">Go back to the feed</a>
    </div>
  );
}
