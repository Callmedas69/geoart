import { siteMenu } from "@/utils/siteMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuBar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6">
      {siteMenu.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? "!text-black font-semibold"
                : "!text-slate-700 hover:!text-black"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MenuBar;
