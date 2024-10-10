import { db } from "@/app/utilities/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default function DeletePostButton({ postId, userId }) {
  async function handleDelete(formData) {
    "use server";

    const postId = formData.get("postId");
    const userId = formData.get("userId");

    try {
      // Ensure that only posts created by the user are deleted
      await db.query(
        "DELETE FROM posts_week09 WHERE id = $1 AND clerk_id = $2",
        [postId, userId]
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }

    revalidatePath("/posts");
    redirect("/posts");
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="text-red-500 bg-black-700 hover:bg-green-600 px-4 py-2 border border-green-500 rounded "
      >
        X
      </button>
    </form>
  );
}
