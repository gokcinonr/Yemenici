import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Link, useLocation } from "wouter";
import svgPaths from "../../imports/HomePageNavOff1/svg-1yo7sszy22";

/* ─── Logo ──────────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href="/" className="flex-shrink-0">
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
    </Link>
  );
}

/* ─── ChevronIcon ────────────────────────────────────────────────────────── */
function ChevronIcon({ color = "#898C90", rotate }: { color?: string; rotate?: boolean }) {
  return (
    <svg
      width="11" height="7" fill="none" viewBox="0 0 11 6.00098"
      style={{ transform: rotate ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
    >
      <path d={svgPaths.p24717480} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── LanguageSelector ───────────────────────────────────────────────────── */
function LanguageSelector() {
  const [active, setActive] = useState("EN");
  return (
    <div className="flex items-center gap-1">
      {["TR", "DE", "EN"].map((code) => (
        <button
          key={code}
          onClick={() => setActive(code)}
          className={`rounded-[7px] px-2 py-0.5 text-[11px] font-medium text-white uppercase tracking-[0.275px] transition-colors ${
            active === code ? "bg-[#151619]" : "bg-[#D1D5DB] hover:bg-[#B0B7C3]"
          }`}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/* ─── Dynamic content hook ───────────────────────────────────────────────── */
type ContentRow = { section: string; key: string; value: string };
type GetFn = (section: string, key: string, fallback?: string) => string;

function useNavContent(): GetFn {
  const [content, setContent] = useState<ContentRow[]>([]);
  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setContent).catch(() => {});
  }, []);
  return (section: string, key: string, fallback = "") =>
    content.find((c) => c.section === section && c.key === key)?.value || fallback;
}

/* ─── Shared animation hook ──────────────────────────────────────────────── */
function useMenuVisible(isOpen: boolean) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      return undefined;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [isOpen]);
  return visible;
}

function animStyle(visible: boolean, delay: number): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  };
}

/* ─── Shared text styles ─────────────────────────────────────────────────── */
const titleStyle: CSSProperties = {
  fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 17, color: "#000", marginBottom: 8,
};
const paraStyle: CSSProperties = {
  fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "18px", opacity: 0.88,
};
const sectionLabelStyle: CSSProperties = {
  fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: "0.12em",
  color: "#000", opacity: 0.35, textTransform: "uppercase", marginBottom: 10,
};
const menuBaseStyle = {
  opacity_on: 1, opacity_off: 0,
  transform_on: "translateY(0)", transform_off: "translateY(-30px)",
  transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
};

/* ─── Solutions Mega Menu ────────────────────────────────────────────────── */
function SolutionsMegaMenu({ isOpen, onMouseEnter, onMouseLeave, get }: {
  isOpen: boolean; onMouseEnter: () => void; onMouseLeave: () => void; get: GetFn;
}) {
  const visible = useMenuVisible(isOpen);

  const industries = [
    {
      label: get("nav_box_automotive", "title", "Automotive"),
      href: get("nav_box_automotive", "href", "/solutions/industries/automotive"),
      desc: get("nav_box_automotive", "desc", "Rubber and rubber-to-metal components engineered for OEM automotive platforms — vibration isolation, sealing, and structural damping."),
    },
    {
      label: get("nav_box_industrial", "title", "Industrial"),
      href: get("nav_box_industrial", "href", "/solutions/industries/industrial"),
      desc: get("nav_box_industrial", "desc", "Heavy-duty rubber parts designed for machinery, conveyors, and industrial equipment operating under high load and temperature extremes."),
    },
    {
      label: get("nav_box_agriculture", "title", "Agriculture"),
      href: get("nav_box_agriculture", "href", "/solutions/industries/agriculture"),
      desc: get("nav_box_agriculture", "desc", "Rugged rubber components for agricultural vehicles and machinery, built to withstand harsh field conditions and extended service cycles."),
    },
  ];

  const production = {
    title: get("nav_box_production", "title", "Production"),
    desc: get("nav_box_production", "desc", "From compound mixing to precision moulding, our end-to-end production capabilities deliver consistent quality at scale."),
    href: get("nav_box_production", "href", "/solutions/production"),
    image: get("nav_box_production", "image", ""),
  };

  return (
    <div
      className="fixed left-0 right-0 top-0 z-40 bg-[rgba(249,249,249,0.97)] backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      style={{
        opacity: visible ? menuBaseStyle.opacity_on : menuBaseStyle.opacity_off,
        transform: visible ? menuBaseStyle.transform_on : menuBaseStyle.transform_off,
        transition: menuBaseStyle.transition,
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-4 md:px-8 pt-[127px] pb-8">
        <div className="max-w-[1280px] mx-auto flex gap-6">

          {/* Col 1 (35%) — Production double-height box */}
          <div style={{ flex: 1, ...animStyle(visible, 0.18) }}>
            <p style={sectionLabelStyle}>Production</p>
            <Link href={production.href}>
              <div
                className="hover:opacity-90 transition-opacity duration-200"
                style={{
                  borderRadius: 15,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  minHeight: 260,
                }}
              >
                {/* Image — top half */}
                <div style={{ flex: 1, backgroundColor: "#e2e5ea", position: "relative", overflow: "hidden", minHeight: 130 }}>
                  {production.image ? (
                    <img
                      src={production.image}
                      alt={production.title}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.17)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content — bottom half */}
                <div
                  className="bg-[#202429]/[0.02]"
                  style={{ flex: 1, padding: 16, minHeight: 130 }}
                >
                  <p style={titleStyle}>{production.title}</p>
                  <p style={{ ...paraStyle, color: "#000f29" }}>{production.desc}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Vertical separator */}
          <div style={{ width: 1, backgroundColor: "rgba(0,0,0,0.08)", alignSelf: "stretch", flexShrink: 0 }} />

          {/* Col 2 (65%) — Industries */}
          <div style={{ width: "65%", ...animStyle(visible, 0.30) }}>
            <p style={sectionLabelStyle}>Industries</p>
            <div className="grid grid-cols-2 gap-3">
              {industries.map(({ label, href, desc }, i) => (
                <Link key={label} href={href}>
                  <div
                    className="bg-[#202429]/[0.02] hover:bg-[#202429]/[0.08] rounded-[15px] p-4 h-full cursor-pointer transition-colors duration-200"
                    style={animStyle(visible, 0.30 + i * 0.06)}
                  >
                    <p style={titleStyle}>{label}</p>
                    <p style={{ ...paraStyle, color: "#000f29" }}>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── Quality Mega Menu ──────────────────────────────────────────────────── */
function QualityMegaMenu({ isOpen, onMouseEnter, onMouseLeave, get }: {
  isOpen: boolean; onMouseEnter: () => void; onMouseLeave: () => void; get: GetFn;
}) {
  const visible = useMenuVisible(isOpen);

  const boxes = [
    {
      label: get("nav_box_certification", "title", "Certification"),
      href: get("nav_box_certification", "href", "/quality/certification"),
      desc: get("nav_box_certification", "desc", "Our facilities and processes hold internationally recognized quality certifications, ensuring compliance with the most demanding industry standards."),
    },
    {
      label: get("nav_box_laboratory", "title", "Laboratory & Testing"),
      href: get("nav_box_laboratory", "href", "/quality/laboratory-testing"),
      desc: get("nav_box_laboratory", "desc", "In-house laboratory capabilities covering material testing, dimensional inspection, and performance validation across all product lines."),
    },
  ];

  return (
    <div
      className="fixed left-0 right-0 top-0 z-40 bg-[rgba(249,249,249,0.97)] backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      style={{
        opacity: visible ? menuBaseStyle.opacity_on : menuBaseStyle.opacity_off,
        transform: visible ? menuBaseStyle.transform_on : menuBaseStyle.transform_off,
        transition: menuBaseStyle.transition,
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-4 md:px-8 pt-[127px] pb-8">
        <div className="max-w-[1280px] mx-auto">
          <div style={animStyle(visible, 0.18)} className="flex gap-3">
            {boxes.map(({ label, href, desc }, i) => (
              <Link key={label} href={href} style={{ flex: 1 }}>
                <div
                  className="bg-[#202429]/[0.02] hover:bg-[#202429]/[0.08] rounded-[15px] p-4 h-full cursor-pointer transition-colors duration-200"
                  style={animStyle(visible, 0.18 + i * 0.06)}
                >
                  <p style={titleStyle}>{label}</p>
                  <p style={{ ...paraStyle, color: "#000f29" }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HamburgerButton ────────────────────────────────────────────────────── */
function HamburgerButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex flex-col items-center justify-center cursor-pointer gap-[5px]"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <span className="block h-px bg-black origin-center transition-all duration-300"
        style={{ width: 22, transform: isOpen ? "translateY(6px) rotate(45deg)" : "none" }} />
      <span className="block h-px bg-black transition-all duration-300"
        style={{ width: 22, opacity: isOpen ? 0 : 1 }} />
      <span className="block h-px bg-black origin-center transition-all duration-300"
        style={{ width: 22, transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none" }} />
    </button>
  );
}

/* ─── NAV_STRUCTURE (for mobile menu) ───────────────────────────────────── */
type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; children?: { label: string; href: string }[] }[];
};

const NAV_STRUCTURE: NavItem[] = [
  {
    label: "SOLUTIONS", href: "/solutions",
    children: [
      { label: "Production", href: "/solutions/production" },
      {
        label: "Industries", href: "/solutions/industries",
        children: [
          { label: "Automotive", href: "/solutions/industries/automotive" },
          { label: "Industrial", href: "/solutions/industries/industrial" },
          { label: "Agriculture", href: "/solutions/industries/agriculture" },
        ],
      },
    ],
  },
  {
    label: "QUALITY", href: "/quality",
    children: [
      { label: "Certification", href: "/quality/certification" },
      { label: "Laboratory & Testing", href: "/quality/laboratory-testing" },
    ],
  },
  {
    label: "COMPANY", href: "/company",
    children: [
      { label: "About Us", href: "/company/about-us" },
      { label: "Our Values", href: "/company/our-values" },
    ],
  },
  { label: "CONTACT", href: "/contact" },
];

/* ─── Mobile Menu ────────────────────────────────────────────────────────── */
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      setOpenSection(null);
      return undefined;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  const labelStyle: CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 18 };
  const childStyle: CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 15, color: "#333" };
  const grandChildStyle: CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 14, color: "#666" };

  return (
    <div
      className="fixed left-0 right-0 top-0 bottom-0 z-40 bg-[rgba(249,249,249,0.97)] backdrop-blur-[30px] overflow-y-auto"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-16px)",
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="px-6 pt-[127px] pb-16 flex flex-col">
        {NAV_STRUCTURE.map((item, i) => {
          const hasChildren = !!item.children?.length;
          const isExpanded = openSection === item.label;

          return (
            <div
              key={item.label}
              className="border-b border-black/[0.07] last:border-0"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s`,
              }}
            >
              <div className="flex items-center justify-between py-4">
                <Link href={item.href} onClick={onClose}>
                  <span className="text-black hover:opacity-60 transition-opacity" style={labelStyle}>
                    {item.label}
                  </span>
                </Link>
                {hasChildren && (
                  <button
                    onClick={() => setOpenSection(isExpanded ? null : item.label)}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <ChevronIcon color="#898C90" rotate={isExpanded} />
                  </button>
                )}
              </div>

              {hasChildren && isExpanded && (
                <div className="pb-3 pl-2 flex flex-col gap-0">
                  {item.children!.map((child) => (
                    <div key={child.label}>
                      <Link href={child.href} onClick={onClose}>
                        <span className="block py-2.5 hover:opacity-60 transition-opacity" style={childStyle}>
                          {child.label}
                        </span>
                      </Link>
                      {child.children?.map((gc) => (
                        <Link key={gc.label} href={gc.href} onClick={onClose}>
                          <span className="block py-2 pl-4 hover:opacity-60 transition-opacity" style={grandChildStyle}>
                            — {gc.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div
          className="mt-8 px-1"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1) 0.40s" }}
        >
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [activeMegaMenu, setActiveMegaMenu] = useState<"solutions" | "quality" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [location] = useLocation();
  const get = useNavContent();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location]);

  const openMenu = (key: "solutions" | "quality") => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMegaMenu(key);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setActiveMegaMenu(null), 80);
  };

  const navBtnBase =
    "flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-[14px] text-black tracking-[0.35px] uppercase cursor-pointer transition-colors duration-200";

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[28px] px-4 md:px-8"
        onMouseLeave={scheduleClose}
      >
        <div className="relative bg-white rounded-[20px] h-[79px] flex items-center justify-between px-6 w-full max-w-[1280px]">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* SOLUTIONS — has mega menu */}
            <button
              className={navBtnBase}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                background: activeMegaMenu === "solutions" ? "rgba(249,249,249,0.97)" : "transparent",
              }}
              onMouseEnter={() => openMenu("solutions")}
              onClick={() => setActiveMegaMenu((v) => (v === "solutions" ? null : "solutions"))}
            >
              SOLUTIONS <ChevronIcon color={activeMegaMenu === "solutions" ? "#000" : "#898C90"} rotate={activeMegaMenu === "solutions"} />
            </button>

            {/* QUALITY — has mega menu */}
            <button
              className={`${navBtnBase} hover:bg-black/[0.04]`}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                background: activeMegaMenu === "quality" ? "rgba(249,249,249,0.97)" : "transparent",
              }}
              onMouseEnter={() => openMenu("quality")}
              onClick={() => setActiveMegaMenu((v) => (v === "quality" ? null : "quality"))}
            >
              QUALITY <ChevronIcon color={activeMegaMenu === "quality" ? "#000" : "#898C90"} rotate={activeMegaMenu === "quality"} />
            </button>

            {/* COMPANY, CONTACT — plain links */}
            {[
              { label: "COMPANY", href: "/company" },
              { label: "CONTACT", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href}>
                <span
                  className={`${navBtnBase} hover:bg-black/[0.04]`}
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                >
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop language selector */}
          <div className="hidden md:flex">
            <LanguageSelector />
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <HamburgerButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((v) => !v)}
            />
          </div>
        </div>
      </div>

      <SolutionsMegaMenu
        isOpen={activeMegaMenu === "solutions"}
        onMouseEnter={() => openMenu("solutions")}
        onMouseLeave={scheduleClose}
        get={get}
      />
      <QualityMegaMenu
        isOpen={activeMegaMenu === "quality"}
        onMouseEnter={() => openMenu("quality")}
        onMouseLeave={scheduleClose}
        get={get}
      />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
