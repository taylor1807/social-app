import { db } from "../utilities/db";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import TooltipLink from "@/components/TooltipLink";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export const metadata = {
  title: "Talkio | Profile",
  description: "Talkio Social Chat App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function ProfilePage() {
  //check user with clerk
  const { userId } = auth();

  let profile = null;

  //if ok get profile info
  if (userId) {
    const result = await db.query(
      `SELECT * FROM profiles_week09 WHERE clerk_id = $1`,
      [userId]
    );

    // console.log(result)

    if (result.rows.length > 0) {
      profile = result.rows[0];
    }
  }

  const posts = profile
    ? await db.query(`SELECT * FROM posts_week09 WHERE clerk_id = $1`, [
        profile.clerk_id,
      ])
    : [];
  // console.log(posts)

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen p-10">
      <h2 className="text-4xl mb-10">Profile</h2>
      <SignedIn>
        <div className="w-full max-w-2xl">
          <h3 className="text-2xl mb-5">Your Profile</h3>
          {profile ? (
            <div className="border p-6 mb-6 rounded w-full">
              <TooltipProvider>
                <TooltipLink
                  href="/profile/updateProfile"
                  linkText="Update Profile"
                  tooltipText="Click here to update your profile"
                  className="text-blue-500 underline"
                />
              </TooltipProvider>
              <div className="mt-4">
                <p className="text-xl mb-2">Username: {profile.username}</p>
                <p className="text-xl mb-2">Email: {profile.email}</p>
                <p className="text-xl mb-2">D.O.B: {profile.date_of_birth}</p>
                <p className="text-xl mb-2">
                  Phone Number: {profile.phone_number}
                </p>
                <p className="text-xl mb-2">Bio: {profile.bio}</p>
              </div>
            </div>
          ) : (
            <div className="border p-6 mb-6 rounded w-full">
              <TooltipProvider>
                <TooltipLink
                  href="/profile/updateProfile"
                  linkText="Update Profile"
                  tooltipText="Click here to view/update your profile"
                  className="text-blue-500 underline"
                />
              </TooltipProvider>
              <p className="mt-4">
                No profile found. Please update your profile.
              </p>
            </div>
          )}
        </div>

        <div className="w-full max-w-2xl">
          <h3 className="text-2xl mb-5">
            Posts by {profile?.username || "User"}
          </h3>
          {posts.length === 0 ? (
            <p className="text-xl">No posts yet</p>
          ) : (
            posts.rows.map((post) => (
              <div key={post.id} className="border p-4 mb-4 rounded">
                <p className="text-xl">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <div className="w-full max-w-2xl">
          <div className="border p-6 mb-6 rounded w-full">
            <h2 className="text-2xl mb-5">Profile</h2>
            <p className="text-xl">
              Please sign in to view or update your profile.
            </p>
          </div>
          <div className="text-center mt-10">
            <SignInButton className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
