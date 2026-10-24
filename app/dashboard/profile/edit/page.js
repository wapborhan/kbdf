import EditProfile from "@/components/dashboard/EditProfile";
import { getServerUser } from "@/lib/auth";
import { serializeUser } from "@/lib/serialize";
export default async function EditProfilePage() {
  const u = await getServerUser();
  return u ? <EditProfile profile={serializeUser(u)} /> : null;
}
