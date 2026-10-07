import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Bot,
  History
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/progress",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "History",
          icon: History,
          submenus: [
            {
              href: "/medical-history",
              label: "Medical History"
            },
            {
              href: "/diet-history",
              label: "Diet Plan History"
            },
            {
              href: "/order-history",
              label: "Diet Order History"
            },
            {
              href: "/payment-history",
              label: "Payment History"
            }
          ]
        },
        {
          href: "/createDiet",
          label: "Generate Diet Plan",
          icon: Bot
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/profile",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
