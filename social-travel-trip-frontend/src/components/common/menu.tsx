"use client";
import { MENU_ITEMS } from "@/config/menu.config";
import { Menu, MenuProps } from "antd";
import { useRouter } from "next/navigation";

export default function MenuAntd() {
  const router = useRouter();
  const clickMenu: MenuProps["onClick"] = (e) => {
    router.push(`/${e.key}`);
  };
  return (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={MENU_ITEMS}
        onClick={clickMenu}
      />
    </>
  );
}
