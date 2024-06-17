"use client";

import React from "react";
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
      hover: {
        backgroundColor: "#000",
        color: "#44596e",
        borderRadius: "200px",
      },
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
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
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

export const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const [rtl, setRtl] = React.useState(false);
  const [hasImage, setHasImage] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");

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
      "&:hover": {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.8 : 1,
        ),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <div
      style={{
        display: "flex",
        direction: rtl ? "rtl" : "ltr",
        position: "fixed",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {broken && (
        <button className="sb-button" onClick={() => setToggled(!toggled)}>
          Toggle
        </button>
      )}
      <Sidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.9 : 1,
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
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
            rtl={rtl}
            style={{ marginBottom: "24px", marginTop: "16px" }}
          />
          <div style={{ flex: 1, marginBottom: "32px", marginLeft: 5 }}>
            <div style={{ padding: "20px", marginBottom: "0px" }}>
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: collapsed ? 0 : 0.7,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                My Workspace
              </Typography>
            </div>
            <Menu menuItemStyles={menuItemStyles} style={{ marginLeft: -7 }}>
              {NavLinks.slice(0, 5).map((l, idx) => (
                <MenuItem
                  key={idx}
                  href={l.link}
                  style={{
                    fontSize: 18,
                    color: "#000",
                    fontWeight: "bold",
                    backgroundColor:
                      window.location.pathname === l.link ? "#F1F0F0" : "",
                  }}
                  icon={
                    <i
                      className={l.icon}
                      style={{ color: "#000", zoom: 1.6, marginRight: 0 }}
                    />
                  }
                >
                  {l.name}
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
              <Typography
                variant="body2"
                fontWeight={600}
                style={{
                  opacity: collapsed ? 0 : 0.7,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  color: "red",
                }}
              >
                Danger Zone
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles} style={{ marginLeft: -7 }}>
              {NavLinks.slice(5, 7).map((l, idx) => (
                <MenuItem
                  key={idx}
                  href={l.link}
                  style={{
                    fontSize: 18,
                    color: "#000",
                    fontWeight: "bold",
                  }}
                  icon={
                    <i
                      className={l.icon}
                      style={{ color: "#000", zoom: 1.6, marginRight: 0 }}
                    />
                  }
                >
                  {l.name}
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
