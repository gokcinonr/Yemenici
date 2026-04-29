import Layout from "../components/Layout";

export default function PlaceholderPage({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center px-8 pt-[107px]">
        <div className="max-w-[1280px] w-full">
          <p
            className="text-[12px] uppercase tracking-[3px] text-[#898C90] mb-4"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
          >
            {subtitle ?? "Yemenici Rubber"}
          </p>
          <h1
            className="text-[60px] leading-tight text-black max-w-[700px]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 200 }}
          >
            {title}
          </h1>
          <p
            className="mt-6 text-[16px] text-[#555] max-w-[560px] leading-[28px]"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400 }}
          >
            This page is coming soon. We are currently building out this section.
          </p>
        </div>
      </div>
    </Layout>
  );
}
