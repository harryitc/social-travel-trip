import { getMenuActive } from "@/features/auth/services/auth.service";

export default function ViewPermissionHelper({
  children,
  policies,
}: {
  children: React.ReactNode;
  policies: string[];
}) {
  const checkPermission = getMenuActive().some((item: string) => {
    return policies.includes(item);
  });
  if (!checkPermission) {
    return null;
  }

  return <>{children}</>;
}
