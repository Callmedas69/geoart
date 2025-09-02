import { siteMenu } from "@/utils/siteMenu";
import Link from "next/link";

const MenuBar = () => {
  return (
    <nav className="flex gap-6">
      {siteMenu.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium transition-colors !text-slate-700 hover:text-blue-900"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MenuBar;
