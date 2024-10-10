import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { db } from "../utilities/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import TooltipLink from "@/components/TooltipLink";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Link from "next/link";
import DeletePostButton from "@/components/DeletePost";
import LikeButton from "@/components/LikeButton";

export default async function PostsPage() {
  const { userId } = auth();

  const profile = await db.query(
    `SELECT * FROM profiles_week09 WHERE clerk_id = $1`,
    [userId]
  );

  const userHasProfile = profile.rows.length > 0;
  const profileId = userHasProfile ? profile.rows[0].id : null;

  const posts = await db.query(
    `
    SELECT posts_week09.id, posts_week09.clerk_id, profiles_week09.username, posts_week09.content, 
           EXISTS (SELECT 1 FROM likes_week09 WHERE likes_week09.post_id = posts_week09.id AND likes_week09.user_id = $1) AS is_liked
    FROM posts_week09 
    INNER JOIN profiles_week09 ON posts_week09.clerk_id = profiles_week09.clerk_id
  `,
    [profileId]
  );

  async function handleCreatePost(formData) {
    "use server";
    const content = formData.get("content");

    await db.query(
      `INSERT INTO posts_week09 (clerk_id, content) VALUES ($1, $2)`,
      [userId, content]
    );

    revalidatePath("/posts");
    redirect("/posts");
  }

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen p-10">
      <h2 className="text-4xl mb-10">Talkio Feed</h2>

      <SignedIn>
        <div className="w-full max-w-2xl">
          {userHasProfile ? (
            <>
              <h3 className="text-2xl mb-5">Add New Post</h3>
              <form action={handleCreatePost} className="mb-10">
                <textarea
                  name="content"
                  placeholder="Add a new post"
                  className="w-full border p-2 mb-4 rounded text-black"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Post
                </button>
              </form>
            </>
          ) : (
            <div className="text-center p-4 border rounded bg-red-100">
              <p className="text-black mb-4">
                Please create a profile before posting.
              </p>
              <Link
                href="/profile/updateProfile"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Create Profile
              </Link>
            </div>
          )}

          <h3 className="text-2xl mb-5">What we are talking about</h3>
          {posts.rows.map((post) => (
            <div
              key={post.id}
              className="border p-4 mb-6 rounded w-full relative"
            >
              <h4 className="text-xl mb-2">
                <TooltipProvider>
                  <TooltipLink
                    href={`/profile/${post.profile_id}`}
                    linkText={post.username}
                    tooltipText={`Click here to see ${post.username}'s profile`}
                  />
                </TooltipProvider>{" "}
                is saying:
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
          <h3 className="text-2xl mb-5">What we are talking about</h3>
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
                is saying:
              </h4>{" "}
              <p>{post.content}</p>
            </div>
          ))}

          <p className="text-center mt-10">Please sign in to add a new post</p>
          <div className="mt-4">
            <SignInButton className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
