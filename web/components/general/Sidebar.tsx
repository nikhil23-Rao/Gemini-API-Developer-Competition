"use client";

import React from "react";
import { useMediaQuery } from "react-responsive";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  menuClasses,
  MenuItemStyles,
} from "react-pro-sidebar";
import { SidebarHeader } from "../sidebar/SidebarHeader";
import { Typography } from "../sidebar/Typography";
import { Badge } from "../sidebar/Badge";
import { SidebarFooter } from "../sidebar/SidebarFooter";
import { PackageBadges } from "../sidebar/PackageBadges";
import { Switch } from "../sidebar/Switch";
import "font-awesome/css/font-awesome.min.css";
import { NavLinks } from "@/data/navLinks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/utils/signInWithGoogle";

type Theme = "light" | "dark";

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
      borderRadius: "200px",
      overflow: "hidden",
    },
    menu: {
      menuContent: "#fbfcfd",
      borderRadius: "200px",
      icon: "#0098e5",

      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#0b2948",
      color: "#8ba1b7",
    },
    menu: {
      menuContent: "#082440",
      icon: "#59d0ff",

      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const AppSidebar: React.FC<{ modals; bg; color }> = ({
  modals,
  bg,
  color,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");
  const router = useRouter();

  // handle on RTL change event
  const handleRTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRtl(e.target.checked);
  };

  // handle on theme change event
  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  // handle on image change event
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasImage(e.target.checked);
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.4 : 1,
            )
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

  return (
    <div
      style={{
        display: "flex",
        direction: rtl ? "rtl" : "ltr",
        position: "fixed",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        zIndex: modals ? "" : 100000000000,
        marginLeft: !isTabletOrMobile && !broken ? "" : -70,
      }}
    >
      {broken && (
        <button
          className="sb-button ml-10"
          style={{
            marginLeft: 90,
            marginTop: 40,
            backgroundColor: "transparent",
            position: "fixed",
          }}
          onClick={() => setToggled(!toggled)}
        >
          <i className="fa fa-bars fa-2x"></i>
        </button>
      )}
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        rtl={rtl}
        breakPoint="md"
        backgroundColor={bg}
        style={{ borderRight: "none" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            marginLeft: 0,
          }}
        >
          <SidebarHeader
            white={bg !== "#fff"}
            rtl={rtl}
            style={{ marginBottom: "24px", marginTop: "16px" }}
          />
          <div style={{ flex: 1, marginBottom: "32px", marginLeft: 5 }}>
            <div style={{ padding: "20px", marginBottom: "0px" }}>
              {!isTabletOrMobile && !broken && (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  style={{
                    opacity: collapsed ? 0 : 0.7,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color,
                  }}
                >
                  My Workspace
                </Typography>
              )}
            </div>
            <Menu
              menuItemStyles={menuItemStyles}
              style={{ marginLeft: !isTabletOrMobile && !broken ? -7 : 70 }}
            >
              {NavLinks.slice(0, 6).map((l, idx) => (
                <MenuItem
                  key={idx}
                  href={l.link}
                  id="hover"
                  style={{
                    backgroundColor: "transparent",
                    fontSize: 18,
                    color,
                    fontWeight:
                      typeof window !== "undefined" &&
                      window.location.pathname === l.link
                        ? "bold"
                        : "",
                  }}
                  icon={
                    <i
                      className={l.icon}
                      style={{ color, zoom: 1.6, marginRight: 0 }}
                    />
                  }
                >
                  {!isTabletOrMobile && !broken ? l.name : ""}
                </MenuItem>
              ))}
            </Menu>

            <div
              style={{
                padding: "20px",
                marginBottom: "-10px",
                marginTop: "32px",
              }}
            >
              {!isTabletOrMobile && !broken && (
                <Typography
                  variant="body2"
                  fontWeight={600}
                  style={{
                    opacity: collapsed ? 0 : 0.7,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    color: "#F9444A",
                    fontWeight: "bold",
                  }}
                >
                  Danger Zone
                </Typography>
              )}
            </div>

            <Menu
              menuItemStyles={menuItemStyles}
              style={{ marginLeft: !isTabletOrMobile && !broken ? -7 : 70 }}
            >
              {NavLinks.slice(6, 8).map((l, idx) => (
                <MenuItem
                  key={idx}
                  id="hover"
                  onClick={(e) => {
                    if (l.name === "Bug Report") {
                      window.location.href =
                        "https://docs.google.com/forms/d/e/1FAIpQLScXU1zvmWD-ImatHaej5PzzeBVMUGXec7Lyn8dviV9xbp6hfQ/viewform?usp=sf_link";
                    }
                    if (l.name === "Sign Out") {
                      logout();
                    }
                    e.preventDefault();
                    router.push(l.link);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    fontSize: 18,
                    color,
                    fontWeight:
                      typeof window !== "undefined" &&
                      window.location.pathname === l.link
                        ? "bold"
                        : "",
                  }}
                  icon={
                    <i
                      className={l.icon}
                      style={{ color, zoom: 1.6, marginRight: 0 }}
                    />
                  }
                >
                  {!isTabletOrMobile && !broken ? l.name : ""}
                </MenuItem>
              ))}
            </Menu>
          </div>
          {/* <SidebarFooter collapsed={collapsed} /> */}
        </div>
      </Sidebar>
    </div>
  );
};
