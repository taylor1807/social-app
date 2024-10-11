import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { db } from "../utilities/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import TooltipLink from "@/components/TooltipLink";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import TooltipButton from "@/components/TooltipButton";
import Link from "next/link";
import DeletePostButton from "@/components/DeletePost";
import LikeButton from "@/components/LikeButton";
import { spaceMarine } from "../layout";

//adding metadat plus favicon to the page
export const metadata = {
  title: "Talkio | Post Feed",
  description: "Talkio Social Chat App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function PostsPage() {
  // check user with clerk
  const { userId } = auth();

  // get the current users profile from the db
  const profile = await db.query(
    `SELECT * FROM profiles_week09 WHERE clerk_id = $1`,
    [userId]
  );

  // check to see if the current user has a profile
  const userHasProfile = profile.rows.length > 0;
  const profileId = userHasProfile ? profile.rows[0].id : null;

  // get all posts from the db and check if user has liked them
  const posts = await db.query(
    `
    SELECT posts_week09.id, posts_week09.clerk_id, profiles_week09.id AS profile_id, profiles_week09.username, posts_week09.content, 
           EXISTS (SELECT 1 FROM likes_week09 WHERE likes_week09.post_id = posts_week09.id AND likes_week09.user_id = $1) AS is_liked
    FROM posts_week09 
    INNER JOIN profiles_week09 ON posts_week09.clerk_id = profiles_week09.clerk_id
  `,
    [profileId]
  );

  // console.log("profile: ", profile);
  // console.log("posts: ", posts);

  // function to create new post
  async function handleCreatePost(formData) {
    "use server";
    const content = formData.get("content");

    if (!content) {
      console.error("content cannot be empty.");
      return;
    }

    try {
      await db.query(
        `INSERT INTO posts_week09 (clerk_id, content) VALUES ($1, $2)`,
        [userId, content]
      );
      // console.log("success");
    } catch (error) {
      console.error(error);
    }

    // revalidate posts page
    revalidatePath("/posts");
    // redirect to posts page
    redirect("/posts");
  }

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen p-10">
      <h2 className="text-4xl mb-10">
        <span className="talkio">🗣️Talkio🗣️</span>{" "}
        <span className="title">Feed</span>
      </h2>

      <SignedIn>
        <div className="w-full max-w-2xl">
          {userHasProfile ? (
            <>
              <h3 className="text-2xl mb-5">
                <span className="title">Add New Post</span>
              </h3>
              <form action={handleCreatePost} className="mb-10">
                <textarea
                  name="content"
                  placeholder="Add a new post"
                  className="w-full border p-2 mb-4 rounded text-black"
                  required
                />
                <TooltipProvider>
                  <TooltipButton
                    buttonText="Add Post"
                    tooltipText="Click to add your post"
                  />
                </TooltipProvider>
              </form>
            </>
          ) : (
            // if user has not set up profile yet ask to create one
            <div className="text-center p-4 border rounded bg-red-100">
              <p className="text-black mb-4">
                <span className="title">
                  Please create a profile before posting.
                </span>
              </p>
              <Link
                href="/profile/updateProfile"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Create Profile
              </Link>
            </div>
          )}

          <h3 className="text-2xl mb-5">
            <span className="title">What we are talking about</span>
          </h3>
          {posts.rows.map((post) => (
            <div
              key={post.id}
              className="border p-4 mb-6 rounded w-full relative"
            >
              <h4 className="text-xl mb-2">
                <TooltipProvider>
                  <TooltipLink
                    href={`/profile/${post.profile_id}`}
                    className={spaceMarine.variable}
                    linkText={post.username}
                    tooltipText={`Click here to see ${post.username}'s profile`}
                  />
                </TooltipProvider>{" "}
                <span className="title">is saying:</span>
              </h4>
              <p>{post.content}</p>

              {userHasProfile && (
                <LikeButton
                  postId={post.id}
                  profileId={profileId}
                  isLiked={post.is_liked}
                />
              )}

              {post.clerk_id === userId && (
                <div className="absolute bottom-2 right-2">
                  <DeletePostButton postId={post.id} userId={userId} />
                </div>
              )}
            </div>
          ))}
        </div>
      </SignedIn>

      <SignedOut>
        <div className="w-full max-w-2xl">
          <h3 className="text-2xl mb-5">
            <span className="title">What we are talking about</span>
          </h3>
          {posts.rows.map((post) => (
            <div key={post.id} className="border p-4 mb-6 rounded w-full">
              <h4 className="text-xl mb-2">
                <TooltipProvider>
                  <TooltipLink
                    href={`/profile/${post.profile_id}`}
                    linkText={post.username}
                    tooltipText={`Click here to see ${post.username}'s profile`}
                  />
                </TooltipProvider>{" "}
                <span className="title">is saying:</span>
              </h4>
              <p>{post.content}</p>
            </div>
          ))}

          <p className="text-center mt-10">
            <span className="title">Please sign in to add a new post</span>
          </p>
          <div className="mt-4">
            <SignInButton className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
