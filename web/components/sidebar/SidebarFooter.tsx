import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { Typography } from "./Typography";
import packageJson from "../../package.json";
import { User } from "@/types/auth/User";
import { setUser } from "@/utils/getCurrentUser";
import { Splash } from "../general/Splash";

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  collapsed?: boolean;
}

const StyledButton = styled.a`
  padding: 5px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: inline-block;
  background-color: #fff;
  color: #484848;
  text-decoration: none;
`;

const StyledSidebarFooter = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 8px;
  color: white;
  background: linear-gradient(to right, #000000, #434343);
  /* background: #0098e5; */
`;

const StyledCollapsedSidebarFooter = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  color: white;
  background: linear-gradient(to right, #000000, #434343);
  /* background: #0098e5; */
`;

const codeUrl =
  "https://github.com/azouaoui-med/react-pro-sidebar/blob/master/storybook/Playground.tsx";

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  collapsed,
  ...rest
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    setUser(setCurrentUser);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingBottom: "20px",
      }}
    >
      {collapsed ? (
        <StyledCollapsedSidebarFooter href={codeUrl} target="_blank">
          <img
            src={currentUser?.pfp}
            style={{ borderRadius: 200, width: 70, height: 70 }}
            alt=""
          />
        </StyledCollapsedSidebarFooter>
      ) : (
        <StyledSidebarFooter {...rest}>
          <div style={{ marginBottom: "12px" }}>
            <img
              src={currentUser?.pfp}
              style={{ borderRadius: 200, width: 70, height: 70 }}
              alt=""
            />
          </div>
          <Typography fontWeight={600}>{currentUser?.username}</Typography>
        </StyledSidebarFooter>
      )}
    </div>
  );
};
