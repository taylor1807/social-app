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
      <h2 className="text-4xl mb-10">
        <span className="title">Profile</span>
      </h2>
      <SignedIn>
        <div className="w-full max-w-2xl">
          <h3 className="text-2xl mb-5">
            <span className="title">Your Profile</span>
          </h3>
          {profile ? (
            <div className="border p-6 mb-6 rounded w-full">
              <TooltipProvider>
                <TooltipLink
                  href="/profile/updateProfile"
                  linkText="Update Profile"
                  tooltipText="Click here to update your profile"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                />
              </TooltipProvider>
              <div className="mt-4">
                <p className="text-xl mb-2">
                  <span className="title">Username: </span>
                  {profile.username}
                </p>
                <p className="text-xl mb-2">
                  <span className="title">Email: </span>
                  {profile.email}
                </p>
                <p className="text-xl mb-2">
                  <span className="title">D.O.B: </span>
                  {profile.date_of_birth}
                </p>
                <p className="text-xl mb-2">
                  <span className="title">Phone Number: </span>
                  {profile.phone_number}
                </p>
                <p className="text-xl mb-2">
                  <span className="title">Bio: </span>
                  {profile.bio}
                </p>
              </div>
            </div>
          ) : (
            <div className="border p-6 mb-6 rounded w-full">
              <TooltipProvider>
                <TooltipLink
                  href="/profile/updateProfile"
                  linkText="Update Profile"
                  tooltipText="Click here to view/update your profile"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                />
              </TooltipProvider>
              <p className="mt-4">
                <span className="title">
                  No profile found. Please update your profile.
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="w-full max-w-2xl">
          <h3 className="text-2xl mb-5">
            <span className="title">
              Posts by {profile?.username || "User"}
            </span>
          </h3>
          {posts.length === 0 ? (
            <p className="text-xl">
              <span className="title">No posts yet</span>
            </p>
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
            <h2 className="text-2xl mb-5">
              <span className="title">Profile</span>
            </h2>
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
