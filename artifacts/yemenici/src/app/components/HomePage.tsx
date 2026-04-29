import { useState, useEffect } from "react";
import svgPaths from "../../imports/HomePageNavOff1/svg-1yo7sszy22";
import imgHero from "../../imports/HomePageNavOff1/153966913a29b3daaa643feeaa3babb72214688a.png";
import imgQuality from "../../imports/HomePageNavOff1/10c8093b458c8e44f1487f7e76048706f449e5cf.png";
import Layout from "./Layout";

type ContentRow = { section: string; key: string; value: string };

function useContent() {
  const [content, setContent] = useState<ContentRow[]>([]);
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => {});
  }, []);
  return (section: string, key: string) =>
    content.find((c) => c.section === section && c.key === key)?.value ?? "";
}

function IndustryCard({
  title,
  paragraph,
  imageUrl,
  linkUrl,
  hoverTextColor,
}: {
  title: string;
  paragraph: string;
  imageUrl?: string;
  linkUrl?: string;
  hoverTextColor?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const hasImage = !!imageUrl;
  const showImage = hovered && hasImage;
  const hoverColor = hoverTextColor === "dark" ? "#202429" : "#ffffff";

  const bgColor = hovered && !hasImage ? "#202429" : "#ffffff";
  const titleColor = showImage ? hoverColor : hovered && !hasImage ? "#ffffff" : "#969696";
  const arrowColor = showImage ? hoverColor : hovered && !hasImage ? "#ffffff" : "#000000";
  const paraOpacity = showImage || (hovered && !hasImage) ? 0 : 1;
  const paraColor = hovered && !hasImage ? "#ffffff" : "#000000";

  return (
    <div
      className="rounded-[15px] overflow-hidden cursor-pointer relative"
      style={{ height: 306, backgroundColor: bgColor, transition: "background-color 0.55s ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (linkUrl && linkUrl !== "#") window.open(linkUrl, "_blank"); }}
    >
      {imageUrl && (
        <img
          alt=""
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover rounded-[15px] pointer-events-none"
          style={{ opacity: showImage ? 1 : 0, transition: "opacity 0.55s ease" }}
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-between p-[38px] pt-[35px] pb-[35px]">
        <div>
          <p
            className="text-[40px] leading-normal"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 200, color: titleColor, transition: "color 0.55s ease" }}
          >
            {title}
          </p>
          <p
            className="text-[16px] mt-4 max-w-[357px]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, lineHeight: "22px", color: paraColor, opacity: paraOpacity, transition: "opacity 0.35s ease, color 0.55s ease" }}
          >
            {paragraph}
          </p>
        </div>
        <div>
          <svg width="31" height="21" fill="none" viewBox="0 0 30.5624 20.9637">
            <path d={svgPaths.pef3cc00} fill={arrowColor} style={{ transition: "fill 0.55s ease" }} />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const getContent = useContent();

  return (
    <Layout>
      {/* ─── Hero ──────────────────────────────────────── */}
      <section className="relative w-full h-[780px] overflow-hidden">
        <img
          src={imgHero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#fafbfb]/80 via-transparent to-transparent" />

        <div className="relative h-full max-w-[1280px] mx-auto px-8 flex flex-col justify-center">
          <div
            className="text-[78px] text-white leading-[82px] max-w-[1000px] mt-24"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, textShadow: "0px 3px 6px rgba(0,0,0,0.16)" }}
          >
            <p className="leading-[82px] mb-0">Leading Software for </p>
            <p className="leading-[82px]">AR Remote Assistance &amp; Digital Work Instructions </p>
          </div>
          <button
            className="mt-12 bg-black text-white text-[12px] tracking-wide rounded-full px-8 py-2 w-fit"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 300 }}
          >
            LEARN MORE
          </button>
        </div>
      </section>

      {/* ─── Industries Intro + Cards ──────────────────── */}
      <section className="bg-[#f2f3f5] pt-20 pb-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <p
            className="text-[30px] text-black leading-[42px] max-w-[873px]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 200 }}
          >
            We design and manufacture high-performance rubber and rubber-to-metal components tailored to the technical needs of mobility, industrial, and agricultural sectors.
          </p>

          <div className="mt-8">
            <button
              className="bg-white text-black text-[12px] tracking-wide rounded-full px-8 py-2"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 300 }}
            >
              DISCOVER INDUSTRIES
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <IndustryCard
              title={getContent("cards", "mobility_title") || "Mobility"}
              paragraph={getContent("cards", "mobility_desc") || "We supply rubber and rubber-to-metal components for a wide range of mobility platforms, with proven performance in demanding OEM applications."}
              imageUrl={getContent("cards", "mobility_image") || undefined}
              linkUrl={getContent("cards", "mobility_link") || undefined}
              hoverTextColor={getContent("cards", "mobility_hover_text") || "white"}
            />
            <IndustryCard
              title={getContent("cards", "industries_title") || "Industries"}
              paragraph={getContent("cards", "industries_desc") || "We supply rubber and rubber-to-metal components for a wide range of mobility platforms, with proven performance in demanding OEM applications."}
              imageUrl={getContent("cards", "industries_image") || undefined}
              linkUrl={getContent("cards", "industries_link") || undefined}
              hoverTextColor={getContent("cards", "industries_hover_text") || "white"}
            />
            <IndustryCard
              title={getContent("cards", "agriculture_title") || "Agriculture"}
              paragraph={getContent("cards", "agriculture_desc") || "We support agricultural manufacturers with rugged rubber and rubber-to-metal components that perform reliably in harsh field conditions."}
              imageUrl={getContent("cards", "agriculture_image") || undefined}
              linkUrl={getContent("cards", "agriculture_link") || undefined}
              hoverTextColor={getContent("cards", "agriculture_hover_text") || "white"}
            />
          </div>
        </div>
      </section>

      {/* ─── Quality ───────────────────────────────────── */}
      <section className="bg-[#f2f3f5] pb-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="rounded-[25px] overflow-hidden">
            <img
              src={imgQuality}
              alt=""
              className="w-full h-[580px] object-cover rounded-t-[25px]"
            />
            <div className="bg-[#202429] rounded-b-[25px] px-16 py-16">
              <p
                className="text-[30px] text-white leading-[42px] max-w-[806px]"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 200 }}
              >
                We see quality as a system of relationships, not just between parts and processes, but between people, teams, and shared goals.
              </p>
              <button
                className="mt-10 bg-white text-black text-[12px] tracking-wide rounded-full px-8 py-2"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 300 }}
              >
                QUALITY AS A CULTURE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ─────────────────────────────────── */}
      <section className="bg-[#f2f3f5] pb-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="border-t border-[#9AA4B7] pt-16">
            <p
              className="text-[40px] text-black leading-normal max-w-[593px]"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
            >
              Learn more about Yemenici
            </p>
            <p
              className="text-[16px] text-black leading-[26px] max-w-[703px] mt-6"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
            >
              Learn how Yemenici can streamline your field service, maintenance, onboarding, and training operations. Boost efficiency, reduce downtime, and empower your workforce with innovative tools designed for digital transformation.
            </p>
            <button
              className="mt-10 bg-black text-white text-[12px] tracking-wide rounded-full px-8 py-2"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 300 }}
            >
              CONTACT US
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
