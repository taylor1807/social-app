import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { db } from "@/app/utilities/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Talkio | Update Profile",
  description: "Talkio Social Chat App",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function UpdateProfilePage() {
  //check user with clerk
  const { userId } = auth();

  //get user profile from db
  const profile = await db.query(
    `SELECT * FROM profiles_week09 WHERE clerk_id = $1`,
    [userId]
  );

  //check to see if user has a profile
  const existingProfile = profile.rows[0] || {};

  //function to update/create profile
  async function handleUpdateProfile(formData) {
    "use server";

    const username = formData.get("username");
    const bio = formData.get("bio");
    const email = formData.get("email");
    const dob = formData.get("date_of_birth");
    const phone = formData.get("phone_number");

    try {
      const profiles = await db.query(
        `SELECT * FROM profiles_week09 WHERE clerk_id = $1`,
        [userId]
      );
      if (profiles.rowCount === 0) {
        //if no profile add one
        await db.query(
          `INSERT INTO profiles_week09 (clerk_id, username, bio, email, date_of_birth, phone_number) VALUES ($1, $2, $3, $4, $5, $6)`,
          [userId, username, bio, email, dob, phone]
        );
      } else {
        //if has a profile update it
        await db.query(
          `UPDATE profiles_week09 SET username=$1, bio=$2, email=$3, date_of_birth=$4, phone_number=$5 WHERE clerk_id=$6`,
          [username, bio, email, dob, phone, userId]
        );
      }
      // console.log("redirecting");
      revalidatePath(`/profile`);
      redirect(`/profile`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen p-10">
      <h2 className="text-4xl mb-10">
        <span className="title">Update Profile</span>
      </h2>

      <SignedIn>
        <div className="w-full max-w-2xl">
          <form
            action={handleUpdateProfile}
            method="post"
            className="mb-10 border p-4 rounded"
          >
            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="username">
                <span className="title">Username</span>
              </label>
              <input
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                type="text"
                name="username"
                placeholder="Enter a Username"
                defaultValue={existingProfile.username}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="email">
                <span className="title">Email</span>
              </label>
              <input
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                type="email"
                name="email"
                placeholder="Enter email"
                defaultValue={existingProfile.email}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="date_of_birth">
                <span className="title">Date of Birth</span>
              </label>
              <input
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                type="date"
                name="date_of_birth"
                placeholder="Enter Date of Birth"
                defaultValue={existingProfile.date_of_birth}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="phone_number">
                <span className="title">Phone Number</span>
              </label>
              <input
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                type="text"
                name="phone_number"
                placeholder="Enter Phone Number"
                defaultValue={existingProfile.phone_number}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="bio">
                <span className="title">Biography</span>
              </label>
              <textarea
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                name="bio"
                placeholder="Enter a Biography"
                defaultValue={existingProfile.bio}
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Update Profile
            </button>
          </form>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="w-full max-w-2xl">
          <p className="text-center text-xl mb-4">
            <span className="title">
              You must be signed in to update your profile.
            </span>
          </p>
          <div className="text-center mt-4">
            <SignInButton className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
