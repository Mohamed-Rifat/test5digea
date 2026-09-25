"use client";

import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useLanguage } from "@/context/LanguageContext";

/**
 * Gives every MUI component the site's font, brand colours and the current
 * text direction, so MUI widgets match the Tailwind UI around them.
 */
export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dir } = useLanguage();

  const theme = useMemo(
    () =>
      createTheme({
        direction: dir,
        palette: {
          primary: { main: "#a47e43", dark: "#8a6934", light: "#cdb28a", contrastText: "#ffffff" },
          secondary: { main: "#30251f", contrastText: "#ffffff" },
          text: { primary: "#30251f", secondary: "#766d67" },
          background: { default: "#faf8f6", paper: "#ffffff" },
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily: "inherit",
          button: { textTransform: "none", fontWeight: 600 },
        },
      }),
    [dir],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
