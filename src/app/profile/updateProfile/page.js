import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { db } from "@/app/utilities/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function UpdateProfilePage() {
  const { userId } = auth();

  const profile = await db.query(
    `SELECT * FROM profiles_week09 WHERE clerk_id = $1`,
    [userId]
  );

  const existingProfile = profile.rows[0] || {};

  async function handleUpdateProfile(formData) {
    "use server";
    const username = formData.get("username");
    const bio = formData.get("bio");
    const email = formData.get("email");
    const dob = formData.get("date_of_birth");
    const phone = formData.get("phone_number");

    const profiles = await db.query(
      `SELECT * FROM profiles_week09 WHERE clerk_id = $1`,
      [userId]
    );
    if (profiles.rowCount === 0) {
      await db.query(
        `INSERT INTO profiles_week09 (clerk_id, username, bio, email, date_of_birth, phone_number) VALUES ($1, $2, $3, $4, $5, $6)`,
        [userId, username, bio, email, dob, phone]
      );
    } else {
      await db.query(
        `UPDATE profiles_week09 SET username=$1, bio=$2, email=$3, date_of_birth=$4, phone_number=$5 WHERE clerk_id=$6`,
        [username, bio, email, dob, phone, userId]
      );
    }
    revalidatePath(`/profile`);
    redirect(`/profile`);
  }

  return (
    <div className="flex flex-col justify-evenly items-center min-h-screen p-10">
      <h2 className="text-4xl mb-10">Update Profile</h2>

      <SignedIn>
        <div className="w-full max-w-2xl">
          <form
            action={handleUpdateProfile}
            className="mb-10 border p-4 rounded"
          >
            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                type="text"
                name="username"
                placeholder="Enter a Username"
                defaultValue={existingProfile.username}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="bio">
                Biography
              </label>
              <textarea
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                name="bio"
                placeholder="Enter a Biography"
                defaultValue={existingProfile.bio}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xl mb-2" htmlFor="email">
                Email
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
                Date of Birth
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
                Phone Number
              </label>
              <input
                className="w-full border p-2 rounded text-black placeholder-gray-500"
                type="text"
                name="phone_number"
                placeholder="Enter Phone Number"
                defaultValue={existingProfile.phone_number}
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
            You must be signed in to update your profile.
          </p>
          <div className="text-center mt-4">
            <SignInButton className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" />
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
