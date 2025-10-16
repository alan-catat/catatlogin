import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RootRedirect() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (host === "admin.catatin.ai") {
    redirect("/dashboard-admin");
  }

  if (host === "app.catatin.ai") {
    redirect("/dashboard-user");
  }

  redirect("/landing");
}
