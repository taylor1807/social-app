import { db } from "@/app/utilities/db";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const user = (
    await db.query("SELECT * FROM profiles_week09 WHERE id = $1", [params.id])
  ).rows[0];
  return {
    title: `Talkio | ${user.username}'s profile`,
    description: `Profile Page for  ${user.username}`,
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function ProfilePage({ params }) {
  // console.log(params);
  const { id } = params;
  // console.log("ID:", id);

  //get the profile from the db
  let profile;
  try {
    profile = await db.query("SELECT * FROM profiles_week09 WHERE id = $1", [
      id,
    ]);
  } catch (error) {
    console.error(error);
    notFound();
  }

  //if the profile cannot be found redirect to notfound page
  if (profile.rows.length === 0) {
    console.error(`${id} not found.`);
    notFound();
  }

  const userProfile = profile.rows[0];

  // getting posts for specific user for the profile page
  let posts;
  try {
    posts = await db.query(`SELECT * FROM posts_week09 WHERE clerk_id = $1`, [
      userProfile.clerk_id,
    ]);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen p-10">
      <h2 className="text-4xl mb-10">{userProfile.username}&apos;s Profile</h2>

      <div className="w-full max-w-2xl border p-6 rounded mb-10">
        <h3 className="text-2xl mb-5">Profile Information</h3>
        <p className="text-xl mb-2">Email: {userProfile.email}</p>
        <p className="text-xl mb-2">D.O.B: {userProfile.date_of_birth}</p>
        <p className="text-xl mb-2">Phone Number: {userProfile.phone_number}</p>
        <p className="text-xl mb-2">Bio: {userProfile.bio}</p>
      </div>

      <div className="w-full max-w-2xl">
        <h3 className="text-2xl mb-5">Posts by {userProfile.username}</h3>
        {posts.rows.length === 0 ? (
          <p className="text-xl">No posts yet</p>
        ) : (
          posts.rows.map((post) => (
            <div key={post.id} className="border p-4 mb-4 rounded">
              <p className="text-xl">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
