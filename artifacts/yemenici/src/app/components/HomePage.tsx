import { useState, useEffect } from "react";
import svgPaths from "../../imports/HomePageNavOff1/svg-1yo7sszy22";
import imgHero from "../../imports/HomePageNavOff1/153966913a29b3daaa643feeaa3babb72214688a.png";
import imgQuality from "../../imports/HomePageNavOff1/10c8093b458c8e44f1487f7e76048706f449e5cf.png";
import imgMegaMenu from "../../imports/HomePageNavOff1/2f9bdbc3609d8ce423367872caa5663ab4809774.png";

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

function Logo() {
  return (
    <div className="flex-shrink-0">
      <svg fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 73.1252 59.4171" width="62" height="50">
        <g>
          <path d={svgPaths.p37316a20} fill="#ED1C24" />
          <path d={svgPaths.p31385980} fill="#ED1C24" />
          <path d={svgPaths.p3ac7f580} fill="#ED1C24" />
          <path d={svgPaths.p16f0f780} fill="#004FA3" />
          <path d={svgPaths.p2103e00} fill="#ED1C24" />
          <path d={svgPaths.p24ba1980} fill="#004FA3" />
          <g>
            <path d={svgPaths.p7462380} fill="#ED1C24" />
            <path d={svgPaths.p8d24a80} fill="#ED1C24" />
            <path d={svgPaths.p17b4a0f0} fill="#ED1C24" />
            <path d={svgPaths.pe2feb80} fill="#ED1C24" />
            <path d={svgPaths.p313b00} fill="#ED1C24" />
            <path d={svgPaths.pef51d00} fill="#ED1C24" />
            <path d={svgPaths.p25acb700} fill="#ED1C24" />
            <path d={svgPaths.p6d8f2c0} fill="#ED1C24" />
          </g>
          <path d={svgPaths.p3615a6a0} fill="#004FA3" />
          <path d={svgPaths.p1f194e00} fill="#004FA3" />
          <path d={svgPaths.pa919000} fill="#004FA3" />
          <path d={svgPaths.p1b5ac300} fill="#004FA3" />
          <path d={svgPaths.paf57780} fill="#004FA3" />
          <path d={svgPaths.p3c5ad00} fill="white" />
          <path d={svgPaths.p1758cb00} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function ChevronIcon({ color = "#898C90" }: { color?: string }) {
  return (
    <svg width="11" height="7" fill="none" viewBox="0 0 11 6.00098">
      <path d={svgPaths.p24717480} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LanguageSelector() {
  const [active, setActive] = useState("EN");
  return (
    <div className="flex items-center gap-1">
      {["TR", "DE", "EN"].map((code) => (
        <button
          key={code}
          onClick={() => setActive(code)}
          className={`rounded-[7px] px-2 py-0.5 text-[11px] font-['Poppins:Medium',sans-serif] font-medium text-white uppercase tracking-[0.275px] transition-colors ${
            active === code ? "bg-[#151619]" : "bg-[#9AA4B7] hover:bg-[#6B7280]"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

function MegaMenu() {
  return (
    <div className="absolute left-0 right-0 top-[79px] z-40 bg-[rgba(249,249,249,0.95)] backdrop-blur-[30px] rounded-b-[20px] shadow-lg">
      <div className="px-8 py-8 grid grid-cols-3 gap-6">
        <div className="bg-[#202429]/5 rounded-[15px] overflow-hidden">
          <img src={imgMegaMenu} alt="" className="w-full h-[105px] object-cover" />
          <div className="p-4">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-black mb-2">INDUSTRIES</p>
            <p className="text-[12px] text-black leading-[18px] opacity-88">
              We support the mobility industry with custom-engineered rubber and rubber-to-metal components developed to meet the complex demands of OEM and Tier-1 customers.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-[#202429]/[0.02] rounded-[15px] p-4 flex-1">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-black mb-2">Mobility</p>
            <p className="text-[12px] text-[#000f29] leading-[18px] opacity-88">
              We supply rubber and rubber-to-metal components for a wide range of mobility platforms, with proven performance in demanding OEM applications.
            </p>
          </div>
          <div className="bg-[#202429]/[0.01] rounded-[15px] p-4 flex-1">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-black mb-2">Industrial</p>
            <p className="text-[12px] text-[#000f29] leading-[18px] opacity-88">
              We support a wide range of industrial applications with components engineered for durability, sealing performance, and mechanical integrity.
            </p>
          </div>
        </div>
        <div>
          <div className="bg-[#202429]/[0.02] rounded-[15px] p-4">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-black mb-2">Agriculture</p>
            <p className="text-[12px] text-[#000f29] leading-[18px] opacity-88">
              We support agricultural manufacturers with rugged rubber and rubber-to-metal components that perform reliably in harsh field conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
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
      style={{ height: 306, backgroundColor: bgColor, transition: "background-color 0.35s ease" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (linkUrl && linkUrl !== "#") window.open(linkUrl, "_blank"); }}
    >
      {imageUrl && (
        <img
          alt=""
          src={imageUrl}
          className="absolute inset-0 w-full h-full object-cover rounded-[15px] pointer-events-none"
          style={{ opacity: showImage ? 1 : 0, transition: "opacity 0.35s ease" }}
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-between p-[38px] pt-[35px] pb-[35px]">
        <div>
          <p
            className="text-[40px] leading-normal"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 200, color: titleColor, transition: "color 0.35s ease" }}
          >
            {title}
          </p>
          <p
            className="text-[16px] mt-4 max-w-[357px]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, lineHeight: "22px", color: paraColor, opacity: paraOpacity, transition: "opacity 0.2s ease, color 0.35s ease" }}
          >
            {paragraph}
          </p>
        </div>
        <div>
          <svg width="31" height="21" fill="none" viewBox="0 0 30.5624 20.9637">
            <path d={svgPaths.pef3cc00} fill={arrowColor} style={{ transition: "fill 0.35s ease" }} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LinkedinIcon() {
  return (
    <a href="#" className="text-black hover:opacity-70 transition-opacity">
      <svg width="21" height="20" fill="none" viewBox="0 0 20.9219 20">
        <g clipPath="url(#li)">
          <path d={svgPaths.pbd79500} fill="currentColor" />
        </g>
        <defs>
          <clipPath id="li">
            <rect width="20.9219" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </a>
  );
}

export default function HomePage() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const getContent = useContent();

  return (
    <div className="min-h-screen bg-[#fafbfb]">

      {/* ─── Navbar ─────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[14px] px-4 md:px-8"
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        <div className="relative bg-white rounded-[20px] h-[79px] flex items-center justify-between px-6 w-full max-w-[1280px]">
          <Logo />

          <nav className="flex items-center gap-6 md:gap-8">
            <button
              className="flex items-center gap-1.5 font-['Poppins:SemiBold',sans-serif] text-[14px] text-black tracking-[0.35px] uppercase cursor-pointer hover:opacity-70 transition-opacity"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onClick={() => setIsMegaMenuOpen((v) => !v)}
            >
              SOLUTIONS <ChevronIcon color={isMegaMenuOpen ? "#000" : "#898C90"} />
            </button>
            <button className="flex items-center gap-1.5 font-['Poppins:SemiBold',sans-serif] text-[14px] text-black tracking-[0.35px] uppercase cursor-pointer hover:opacity-70 transition-opacity">
              QUALITY <ChevronIcon />
            </button>
            <button className="flex items-center gap-1.5 font-['Poppins:SemiBold',sans-serif] text-[14px] text-black tracking-[0.35px] uppercase cursor-pointer hover:opacity-70 transition-opacity">
              COMPANY <ChevronIcon />
            </button>
            <button className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-black tracking-[0.35px] uppercase cursor-pointer hover:opacity-70 transition-opacity">
              CONTACT
            </button>
          </nav>

          <LanguageSelector />

          {isMegaMenuOpen && <MegaMenu />}
        </div>
      </div>

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
            className="font-['Poppins:Bold',sans-serif] text-[78px] text-white leading-[82px] max-w-[1000px] mt-24"
            style={{ textShadow: "0px 3px 6px rgba(0,0,0,0.16)" }}
          >
            <p className="leading-[82px] mb-0">Leading Software for </p>
            <p className="leading-[82px]">AR Remote Assistance &amp; Digital Work Instructions </p>
          </div>
          <button className="mt-12 bg-black text-white font-['Poppins:Light',sans-serif] text-[12px] tracking-wide rounded-full px-8 py-2 w-fit">
            LEARN MORE
          </button>
        </div>
      </section>

      {/* ─── Industries Intro + Cards ──────────────────── */}
      <section className="bg-[#f2f3f5] pt-20 pb-20">
        <div className="max-w-[1280px] mx-auto px-8">
          <p className="font-['Poppins:ExtraLight',sans-serif] text-[30px] text-black leading-[42px] max-w-[873px]">
            We design and manufacture high-performance rubber and rubber-to-metal components tailored to the technical needs of mobility, industrial, and agricultural sectors.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
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

          <div className="mt-8">
            <button className="bg-white text-black font-['Poppins:Light',sans-serif] text-[12px] tracking-wide rounded-full px-8 py-2">
              DISCOVER INDUSTRIES
            </button>
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
              <p className="font-['Poppins:ExtraLight',sans-serif] text-[30px] text-white leading-[42px] max-w-[806px]">
                We see quality as a system of relationships, not just between parts and processes, but between people, teams, and shared goals.
              </p>
              <button className="mt-10 bg-white text-black font-['Poppins:Light',sans-serif] text-[12px] tracking-wide rounded-full px-8 py-2">
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
            <p className="font-['Poppins:Medium',sans-serif] text-[40px] text-black leading-normal max-w-[593px]">
              Learn more about Yemenici
            </p>
            <p className="font-['Poppins:Regular',sans-serif] text-[16px] text-black leading-[26px] max-w-[703px] mt-6">
              Learn how Yemenici can streamline your field service, maintenance, onboarding, and training operations. Boost efficiency, reduce downtime, and empower your workforce with innovative tools designed for digital transformation.
            </p>
            <button className="mt-10 bg-black text-white font-['Poppins:Light',sans-serif] text-[12px] tracking-wide rounded-full px-8 py-2">
              CONTACT US
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer Links ───────────────────────────────── */}
      <footer className="bg-white">
        <div className="max-w-[1280px] mx-auto px-8 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-black mb-4">Solutions</p>
              {["Industries", "Mobility", "Agriculture", "Industry"].map((l) => (
                <p key={l} className="font-['Poppins:Regular',sans-serif] text-[14px] text-black leading-[32px] cursor-pointer hover:opacity-60 transition-opacity">{l}</p>
              ))}
            </div>
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-black mb-4">Quality</p>
              {["Certification", "Laboratory Testing"].map((l) => (
                <p key={l} className="font-['Poppins:Regular',sans-serif] text-[14px] text-black leading-[32px] cursor-pointer hover:opacity-60 transition-opacity">{l}</p>
              ))}
            </div>
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-black mb-4">Company</p>
              {["About Us", "Our Values", "Mining", "Healthcare", "Construction"].map((l) => (
                <p key={l} className="font-['Poppins:Regular',sans-serif] text-[14px] text-black leading-[32px] cursor-pointer hover:opacity-60 transition-opacity">{l}</p>
              ))}
            </div>
            <div>
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-black mb-4">Contact</p>
              {["Contact Us", "Career"].map((l) => (
                <p key={l} className="font-['Poppins:Regular',sans-serif] text-[14px] text-black leading-[32px] cursor-pointer hover:opacity-60 transition-opacity">{l}</p>
              ))}
              <p className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-black mb-4 mt-6">Policies</p>
              {["Privacy Policy", "Terms of Use", "Security & GDPR", "Imprint"].map((l) => (
                <p key={l} className="font-['Poppins:Regular',sans-serif] text-[14px] text-black leading-[32px] cursor-pointer hover:opacity-60 transition-opacity">{l}</p>
              ))}
            </div>
          </div>

          <div className="border-t border-[#9AA4B7] pt-6 flex items-center justify-between">
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-black">Copyright © 2025 Yemenici</p>
            <LinkedinIcon />
          </div>
        </div>
      </footer>
    </div>
  );
}
