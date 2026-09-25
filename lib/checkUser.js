import { currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "./get-or-create-user.js";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    return await getOrCreateUser(user.id);
  } catch (error) {
    console.log(error.message);
  }
};
