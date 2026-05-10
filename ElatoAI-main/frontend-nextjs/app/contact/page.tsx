import { buildMetadata } from "@/app/lib/seo";
import LegalPageLayout from "@/app/components/legal/LegalPageLayout";

export const metadata = buildMetadata({
    title: "Contact",
    description:
        "Contact Smartmurti AI Private Limited for support, payments, legal, and product questions.",
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
                    For support, payment issues, policy questions, or business communication, please contact <strong>Smartmurti AI Private Limited</strong> using the details below.
                </p>
            }
            sections={[
                {
                    title: "1. Support",
                    body: (
                        <>
                            <p>Email: <a className="text-amber-700 underline underline-offset-4" href="mailto:support@smartmurti.com">support@smartmurti.com</a></p>
                            <p>Please include your registered email and any relevant transaction or session details if you need account help.</p>
                        </>
                    ),
                },
                {
                    title: "2. Business and Legal Communication",
                    body: (
                        <>
                            <p>Company Name: Smartmurti AI Private Limited</p>
                            <p>Remote-first support: Smart Murti serves NRI families through email, WhatsApp, and scheduled digital sessions across time zones.</p>
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
