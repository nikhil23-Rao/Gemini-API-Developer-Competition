import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab, { TabTypeMap } from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { ExtendButtonBase } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabProps {
  t: string;
  idx: number;
  props?: ExtendButtonBase<TabTypeMap<{}, "div">>;
}

// export const handleChange = (
//   event: React.SyntheticEvent,
//   newValue: number,
// ) => {
//   setValue(newValue);
//   console.log(newValue);
// };

export default function ComponentTab({ t, idx, ...props }: TabProps) {
  return <Tab label={t} {...a11yProps(idx)} value={t} {...props} />;
}
