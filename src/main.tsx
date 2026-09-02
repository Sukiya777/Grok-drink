import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "@/components/app-shell";
import { BrandSplash } from "@/components/brand-splash";
import "@/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrandSplash />
    <AppShell />
  </StrictMode>,
);
