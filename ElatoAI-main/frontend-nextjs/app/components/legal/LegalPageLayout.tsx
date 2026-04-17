import React from "react";

type LegalSection = {
    title: string;
    body: React.ReactNode;
};

type LegalPageLayoutProps = {
    title: string;
    lastUpdated: string;
    intro: React.ReactNode;
    sections: LegalSection[];
};

export default function LegalPageLayout({ title, lastUpdated, intro, sections }: LegalPageLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fff8ef] to-white px-4 py-12 font-karla sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[#eadfcf] bg-white shadow-[0_20px_60px_rgba(77,55,24,0.08)]">
                <div className="border-b border-[#f0e5d6] bg-[radial-gradient(circle_at_top,_rgba(252,211,77,0.18),_transparent_55%),linear-gradient(135deg,#fff9ef_0%,#fff4df_100%)] px-8 py-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Smartmurti AI Private Limited</p>
                    <h1 className="mt-3 font-lora text-4xl font-bold text-[#24170f] md:text-5xl">{title}</h1>
                    <p className="mt-4 text-sm text-[#7b664f]">Last updated: {lastUpdated}</p>
                    <div className="mt-6 max-w-3xl text-base leading-7 text-[#5d4836]">{intro}</div>
                </div>

                <div className="space-y-10 px-8 py-10">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <h2 className="mb-3 text-2xl font-bold text-[#24170f]">{section.title}</h2>
                            <div className="space-y-4 text-[15px] leading-7 text-[#5d4836]">{section.body}</div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
