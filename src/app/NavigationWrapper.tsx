import { getCurrentUser } from "@/app/register/actions";
import { Navigation } from "./Navigation";

export async function NavigationWrapper() {
  const user = await getCurrentUser();

  return <Navigation userName={user?.name} userId={user?.id} />;
}
