import { UserCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

const useRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const routes = useMemo(
    () => [
      {
        label: "Home",
        active: pathname === "/",
        href: "/",
      },
      {
        label: "Packages",
        active: pathname === "/packages",
        href: "/packages",
      },
      {
        label: "2026 Holidays",
        active: pathname === "/holiday-hack",
        href: "/holiday-hack",
      },
      {
        label: "Wishlists",
        active: pathname === "/wishlists",
        href: "/wishlists",
      },
      {
        label: "Rewards",
        active: pathname === "/rewards",
        href: "/rewards",
      },
    ],
    [pathname]
  );
  return routes;
};

export default useRoutes;
