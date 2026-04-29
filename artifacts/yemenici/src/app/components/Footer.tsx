import { Link } from "wouter";
import svgPaths from "../../imports/HomePageNavOff1/svg-1yo7sszy22";

function LinkedinIcon() {
  return (
    <a href="#" aria-label="LinkedIn" className="text-black hover:opacity-60 transition-opacity">
      <svg width="21" height="20" fill="none" viewBox="0 0 20.9219 20">
        <g clipPath="url(#li-footer)">
          <path d={svgPaths.pbd79500} fill="currentColor" />
        </g>
        <defs>
          <clipPath id="li-footer">
            <rect width="20.9219" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </a>
  );
}

const FOOTER_TREE = [
  {
    title: "Solutions",
    links: [
      { label: "Production", href: "/solutions/production" },
      { label: "Industries", href: "/solutions/industries" },
      { label: "Automotive", href: "/solutions/industries/automotive" },
      { label: "Industrial", href: "/solutions/industries/industrial" },
      { label: "Agriculture", href: "/solutions/industries/agriculture" },
    ],
  },
  {
    title: "Quality",
    links: [
      { label: "Certification", href: "/quality/certification" },
      { label: "Laboratory & Testing", href: "/quality/laboratory-testing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/company/about-us" },
      { label: "Our Values", href: "/company/our-values" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const headStyle: React.CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 14, color: "#000", marginBottom: 14 };
const linkStyle: React.CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 13, color: "#444", lineHeight: "30px" };
const smallStyle: React.CSSProperties = { fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 12, color: "#888" };

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/[0.06]">
      <div className="max-w-[1280px] mx-auto px-8 pt-14 pb-8">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-10 mb-10">

          {/* Company info */}
          <div>
            <p style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#000", marginBottom: 10 }}>
              Yemenici Rubber
            </p>
            <p style={{ ...smallStyle, lineHeight: "22px" }}>
              Organize Sanayi Bölgesi<br />
              1. Cadde No:12<br />
              Bursa, Türkiye<br />
              info@yemenici.com
            </p>
          </div>

          {/* Website tree */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {FOOTER_TREE.map((col) => (
              <div key={col.title}>
                <p style={headStyle}>{col.title}</p>
                {col.links.map(({ label, href }) => (
                  <Link key={label} href={href}>
                    <span
                      className="block hover:opacity-60 transition-opacity cursor-pointer"
                      style={linkStyle}
                    >
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Social media */}
          <div className="flex md:flex-col items-start gap-3">
            <p style={{ ...headStyle, marginBottom: 10 }}>Follow Us</p>
            <LinkedinIcon />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-black/[0.06] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p style={smallStyle}>© {new Date().getFullYear()} Yemenici Rubber. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" style={{ ...smallStyle, color: "#555" }} className="hover:opacity-60 transition-opacity">
              Terms & Conditions
            </a>
            <a href="#" style={{ ...smallStyle, color: "#555" }} className="hover:opacity-60 transition-opacity">
              Privacy Policy
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
