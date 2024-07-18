export const colors = [
  {
    color: "default",
  },

  {
    color: "instagram",
  },
  {
    color: "gemini",
  },
  {
    color: "steel",
  },
  {
    color: "lakers",
  },
  {
    color: "twitter",
  },
  {
    color: "white",
  },
  {
    color: "black",
  },
];

export const themes = [
  {
    name: "Light",
    backgroundColor: "#fff",
    textColor: "#000",
    className: "",
  },
  {
    name: "Slate Black",
    backgroundColor: "#202020",
    textColor: "#fff",
    className: "",
  },

  {
    name: "Night",
    backgroundColor: "#14202B",
    textColor: "#fff",
    className: "",
  },

  {
    name: "Lights Out",
    backgroundColor: "#000",
    textColor: "#fff",
    className: "",
  },

  {
    name: "Silver Coin",
    backgroundColor: "",
    textColor: "#fff",
    className: "silvercointheme",
  },

  {
    name: "Ash",
    backgroundColor: "",
    textColor: "#fff",
    className: "ashtheme",
  },

  {
    name: "Vibrant",
    backgroundColor: "",
    textColor: "#fff",
    className: "vibranttheme",
  },
  {
    name: "Lightning",
    backgroundColor: "",
    textColor: "#fff",
    className: "lightningtheme",
  },

  {
    name: "Frost",
    backgroundColor: "",
    textColor: "#fff",
    className: "frosttheme",
  },

  {
    name: "Moonlight",
    backgroundColor: "",
    textColor: "#fff",
    className: "moonlight",
  },
];
export const getTheme = (
  setTheme: (i: any) => void,
  setColor: (i: string) => void,
) => {
  if (localStorage) {
    const theme = localStorage.getItem("vertextheme");
    const color = localStorage.getItem("vertexcolor");

    if (!theme) localStorage.setItem("vertextheme", JSON.stringify(themes[0]));
    if (!color) localStorage.setItem("vertexcolor", colors[0].color);

    setTheme(JSON.parse(theme!));
    setColor(color!);
  }
};
