import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Link, useLocation } from "wouter";
import svgPaths from "../../imports/HomePageNavOff1/svg-1yo7sszy22";

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

const titleStyle: CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 17, color: "#000", marginBottom: 8 };
const paraStyle: CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 12, lineHeight: "18px", opacity: 0.88 };

function MegaMenu({ isOpen, onMouseEnter, onMouseLeave }: {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  const colStyle = (delay: number): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  });

  const subLinkStyle: CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontWeight: 400,
    fontSize: 13,
    color: "#000f29",
    display: "block",
    padding: "6px 0",
    opacity: 0.8,
  };

  return (
    <div
      className="fixed left-0 right-0 top-0 z-40 bg-[rgba(249,249,249,0.97)] backdrop-blur-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-30px)",
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-4 md:px-8 pt-[127px] pb-8">
        <div className="max-w-[1280px] mx-auto flex gap-6">

          {/* Col 1 (65%) — Automotive, Industrial, Agriculture in 2-sub-column grid */}
          <div className="grid grid-cols-2 gap-3" style={{ width: "65%", ...colStyle(0.18) }}>
            {[
              { label: "Automotive", href: "/solutions/industries/automotive", desc: "Rubber and rubber-to-metal components engineered for OEM automotive platforms — vibration isolation, sealing, and structural damping." },
              { label: "Industrial", href: "/solutions/industries/industrial", desc: "Heavy-duty rubber parts designed for machinery, conveyors, and industrial equipment operating under high load and temperature extremes." },
              { label: "Agriculture", href: "/solutions/industries/agriculture", desc: "Rugged rubber components for agricultural vehicles and machinery, built to withstand harsh field conditions and extended service cycles." },
            ].map(({ label, href, desc }, i) => (
              <Link key={label} href={href}>
                <div
                  className="bg-[#202429]/[0.02] hover:bg-[#202429]/[0.08] rounded-[15px] p-4 h-full cursor-pointer transition-colors duration-200"
                  style={colStyle(0.18 + i * 0.06)}
                >
                  <p style={titleStyle}>{label}</p>
                  <p style={{ ...paraStyle, color: "#000f29" }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Col 2 (35%) — Certification, Laboratory & Testing */}
          <div className="flex flex-col gap-3" style={{ flex: 1, ...colStyle(0.30) }}>
            {[
              { label: "Certification", href: "/quality/certification", desc: "Our facilities and processes hold internationally recognized quality certifications, ensuring compliance with the most demanding industry standards." },
              { label: "Laboratory & Testing", href: "/quality/laboratory-testing", desc: "In-house laboratory capabilities covering material testing, dimensional inspection, and performance validation across all product lines." },
            ].map(({ label, href, desc }, i) => (
              <Link key={label} href={href}>
                <div
                  className="bg-[#202429]/[0.02] hover:bg-[#202429]/[0.08] rounded-[15px] p-4 cursor-pointer transition-colors duration-200"
                  style={colStyle(0.30 + i * 0.06)}
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

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
      setOpenSection(null);
    }
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
              {/* Top-level row */}
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

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="pb-3 pl-2 flex flex-col gap-0">
                  {item.children!.map((child) => (
                    <div key={child.label}>
                      <Link href={child.href} onClick={onClose}>
                        <span
                          className="block py-2.5 hover:opacity-60 transition-opacity"
                          style={childStyle}
                        >
                          {child.label}
                        </span>
                      </Link>
                      {child.children?.map((gc) => (
                        <Link key={gc.label} href={gc.href} onClick={onClose}>
                          <span
                            className="block py-2 pl-4 hover:opacity-60 transition-opacity"
                            style={grandChildStyle}
                          >
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

        {/* Language selector */}
        <div
          className="mt-8 px-1"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.45s cubic-bezier(0.16,1,0.3,1) 0.40s",
          }}
        >
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }, [location]);

  const openMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsMegaMenuOpen(true);
  };
  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setIsMegaMenuOpen(false), 80);
  };
  const closeMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setIsMegaMenuOpen(false);
  };

  const navBtnBase = "flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-[14px] text-black tracking-[0.35px] uppercase cursor-pointer transition-colors duration-200";

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
            <button
              className={navBtnBase}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                background: isMegaMenuOpen ? "rgba(249,249,249,0.97)" : "transparent",
              }}
              onMouseEnter={openMenu}
              onClick={() => setIsMegaMenuOpen((v) => !v)}
            >
              SOLUTIONS <ChevronIcon color={isMegaMenuOpen ? "#000" : "#898C90"} rotate={isMegaMenuOpen} />
            </button>
            {[
              { label: "QUALITY", href: "/quality" },
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

      <MegaMenu isOpen={isMegaMenuOpen} onMouseEnter={openMenu} onMouseLeave={closeMenu} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
