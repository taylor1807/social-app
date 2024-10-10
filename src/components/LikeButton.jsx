import { db } from "@/app/utilities/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function LikeButton({ postId, profileId, isLiked }) {
  async function handleLike(formData) {
    "use server";

    const action = formData.get("action");

    if (action === "like") {
      // Add like
      await db.query(
        `INSERT INTO likes_week09 (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [profileId, postId]
      );
    } else if (action === "unlike") {
      // Remove like
      await db.query(
        `DELETE FROM likes_week09 WHERE user_id = $1 AND post_id = $2`,
        [profileId, postId]
      );
    }
    revalidatePath("/posts");
    redirect("/posts");
  }

  return (
    <form action={handleLike} method="post">
      <input type="hidden" name="action" value={isLiked ? "unlike" : "like"} />
      <button
        type="submit"
        className={`text-sm ${isLiked ? "text-red-500" : "text-blue-500"}`}
      >
        {isLiked ? "Unlike" : "Like"}
      </button>
    </form>
  );
}
