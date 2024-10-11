import { db } from "@/app/utilities/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import TooltipButton from "./TooltipButton";

export default async function LikeButton({ postId, profileId, isLiked }) {
  //function for liking/unliking
  async function handleLike(formData) {
    "use server";

    const action = formData.get("action");

    //liking a post
    if (action === "like") {
      try {
        await db.query(
          `INSERT INTO likes_week09 (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [profileId, postId]
        );
        // console.log(`${postId} like by ${profileId}`)
      } catch (error) {
        console.error(error);
      }
    }
    //unlike post
    else if (action === "unlike") {
      try {
        await db.query(
          `DELETE FROM likes_week09 WHERE user_id = $1 AND post_id = $2`,
          [profileId, postId]
        );
        // console.log(`${postId} unliked by ${profileId}`)
      } catch (error) {
        console.error(error);
      }
    }
    //update after like/unlike
    revalidatePath("/posts");
    //redirect after like/unlike
    redirect("/posts");
  }

  return (
    <form action={handleLike} method="post">
      <input type="hidden" name="action" value={isLiked ? "unlike" : "like"} />
      <TooltipProvider>
        <TooltipButton
          buttonText={isLiked ? <StarFilledIcon /> : <StarIcon />}
          tooltipText={
            isLiked ? "Click to unlike this post" : "Click to like this post"
          }
        />
      </TooltipProvider>
    </form>
  );
}
