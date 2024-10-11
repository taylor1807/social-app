import { db } from "@/app/utilities/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import TooltipButton from "./TooltipButton";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export default function DeletePostButton({ postId, userId }) {
  //function to delete post by current user
  async function handleDelete(formData) {
    "use server";

    const postId = formData.get("postId");
    const userId = formData.get("userId");

    try {
      await db.query(
        "DELETE FROM posts_week09 WHERE id = $1 AND clerk_id = $2",
        [postId, userId]
      );
      // console.log(`${postId} deleted succesfully`}
    } catch (error) {
      console.error(error);
    }
    // update page after deletion
    revalidatePath("/posts");
    //redirect after deletion
    redirect("/posts");
  }

  return (
    <form action={handleDelete}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="userId" value={userId} />
      <TooltipProvider>
        <TooltipButton
          buttonText={<CrossCircledIcon />}
          tooltipText="Delete this post"
        />
      </TooltipProvider>
    </form>
  );
}
