import { useState, useEffect } from "react";
import Layout from "../components/Layout";

type ContentRow = { section: string; key: string; value: string };

function usePageContent(sectionKey: string) {
  const [content, setContent] = useState<ContentRow[]>([]);
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => {});
  }, []);
  return (key: string) =>
    content.find((c) => c.section === sectionKey && c.key === key)?.value ?? "";
}

export default function PlaceholderPage({
  title,
  subtitle,
  sectionKey,
}: {
  title: string;
  subtitle?: string;
  sectionKey?: string;
}) {
  const get = usePageContent(sectionKey ?? "");

  const heroTitle = sectionKey ? get("hero_title") || title : title;
  const heroSubtitle = sectionKey ? get("hero_subtitle") || subtitle : subtitle;
  const heroBgColor = sectionKey ? get("hero_bg_color") || "#1e3a5f" : "#1e3a5f";

  return (
    <Layout>
      {/* Hero — starts at page top; fixed navbar (107px) naturally overlaps it */}
      <section
        style={{
          width: "100%",
          height: 380,
          backgroundColor: heroBgColor,
          display: "flex",
          alignItems: "flex-end",
          paddingBottom: 56,
          paddingLeft: 32,
          paddingRight: 32,
          boxSizing: "border-box",
          transition: "background-color 0.4s ease",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          {heroSubtitle && (
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                marginBottom: 14,
                marginTop: 0,
              }}
            >
              {heroSubtitle}
            </p>
          )}
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 200,
              fontSize: 60,
              lineHeight: 1.1,
              color: "#ffffff",
              margin: 0,
            }}
          >
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* Page body */}
      <div className="max-w-[1280px] mx-auto px-8 py-16 min-h-[50vh] aos">
        <p
          className="text-[16px] text-[#555] max-w-[560px] leading-[28px]"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
        >
          This page is coming soon. We are currently building out this section.
        </p>
      </div>
    </Layout>
  );
}
