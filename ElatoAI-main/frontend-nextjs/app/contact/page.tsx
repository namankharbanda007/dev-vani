import { buildMetadata } from "@/app/lib/seo";
import LegalPageLayout from "@/app/components/legal/LegalPageLayout";
import { companyInfo } from "@/app/lib/company";

export const metadata = buildMetadata({
    title: "Contact",
    description:
        `Contact ${companyInfo.legalName} for support, payments, legal, and product questions.`,
    path: "/contact",
});

const lastUpdated = "April 17, 2026";

export default function ContactPage() {
    return (
        <LegalPageLayout
            title="Contact"
            lastUpdated={lastUpdated}
            intro={
                <p>
                    For support, payment issues, policy questions, or business communication, please contact <strong>{companyInfo.legalName}</strong> using the details below.
                </p>
            }
            sections={[
                {
                    title: "1. Support",
                    body: (
                        <>
                            <p>Email: <a className="text-amber-700 underline underline-offset-4" href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></p>
                            <p>Please include your registered email and any relevant transaction or session details if you need account help.</p>
                        </>
                    ),
                },
                {
                    title: "2. Business and Legal Communication",
                    body: (
                        <>
                            <p>Company Name: {companyInfo.legalName}</p>
                            <p>Website: <a className="text-amber-700 underline underline-offset-4" href={companyInfo.websiteUrl} target="_blank" rel="noreferrer">{companyInfo.website}</a></p>
                            <p>Registered Office: {companyInfo.registeredOffice}</p>
                            <p>CIN: {companyInfo.cin}</p>
                        </>
                    ),
                },
                {
                    title: "3. Typical Response Scope",
                    body: (
                        <>
                            <p>We can help with account access, recharge issues, failed session delivery, policy questions, and general support requests.</p>
                        </>
                    ),
                },
            ]}
        />
    );
}
