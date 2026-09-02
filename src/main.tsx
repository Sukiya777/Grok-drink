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

// PWA：上线即具备离线秒开能力。file:// 预览与开发模式不注册；
// 老内核没有 serviceWorker 时静默跳过（Render 是 https，正式环境必过守卫）。
if (
  typeof window !== "undefined" &&
  window.location.protocol === "https:" &&
  "serviceWorker" in navigator
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* 注册失败不影响使用，下次再试 */
    });
  });
}
