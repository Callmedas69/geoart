import { siteMenu } from "@/utils/siteMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuBar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 md:gap-6 justify-center md:justify-center">
      {siteMenu.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
              isActive
                ? "!text-black font-semibold bg-gray-100"
                : "!text-slate-700 hover:!text-black hover:bg-gray-50"
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
