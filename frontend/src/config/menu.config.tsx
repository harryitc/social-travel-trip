import {
  BookOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { POLICIES } from "./policy.config";

type MenuItem = Required<MenuProps>["items"][number] & {
  action_id?: string[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <DashboardOutlined />,
    danger: true,
  },
  {
    label: "Tài khoản",
    key: "profile",
    icon: <UserOutlined />,
  },
  {
    label: "Hội nhóm",
    key: "hoi-nhom",
    icon: <TeamOutlined />,
    action_id: [POLICIES.eduzaa.hoi_nhom.menu_hoi_nhom],
  },
  {
    label: "Khóa học",
    key: "courses",
    icon: <BookOutlined />,
    disabled: true,
  },
  {
    label: "Full Course Manager",
    key: "manage/full-course",
    icon: <BookOutlined />,
    disabled: false,
  },
];
