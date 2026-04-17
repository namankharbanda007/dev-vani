import { buildMetadata } from "@/app/lib/seo";
import LegalPageLayout from "@/app/components/legal/LegalPageLayout";

export const metadata = buildMetadata({
    title: "Disclaimer",
    description:
        "Service disclaimer for Smartmurti AI Private Limited covering spiritual guidance, AI outputs, and non-professional advice boundaries.",
    path: "/disclaimer",
});

const lastUpdated = "April 17, 2026";

export default function DisclaimerPage() {
    return (
        <LegalPageLayout
            title="Disclaimer"
            lastUpdated={lastUpdated}
            intro={
                <p>
                    SMART मूर्ति is a spiritual technology platform operated by <strong>Smartmurti AI Private Limited</strong>. This page explains the limits of the service.
                </p>
            }
            sections={[
                {
                    title: "1. Spiritual and Informational Use",
                    body: (
                        <>
                            <p>
                                SMART मूर्ति is intended for devotional, cultural, spiritual, and informational use. It is not guaranteed to be factually perfect,
                                religiously universal, or suitable for every tradition, family practice, or personal belief.
                            </p>
                        </>
                    ),
                },
                {
                    title: "2. No Medical, Legal, or Financial Advice",
                    body: (
                        <>
                            <p>
                                Nothing on the platform is medical, psychiatric, legal, tax, investment, or financial advice.
                                If you are facing health, legal, or financial risk, consult an appropriately licensed professional.
                            </p>
                        </>
                    ),
                },
                {
                    title: "3. AI Limitations",
                    body: (
                        <>
                            <p>
                                Responses generated through AI may occasionally be incomplete, mistaken, culturally imperfect, or unsuitable for your exact situation.
                                You should use judgment before acting on any output.
                            </p>
                        </>
                    ),
                },
                {
                    title: "4. Ritual Outcomes",
                    body: (
                        <>
                            <p>
                                We do not guarantee spiritual outcomes, personal results, healing, relationship changes, business success, or any other specific result from use of the platform.
                            </p>
                        </>
                    ),
                },
                {
                    title: "5. Family and Child Use",
                    body: (
                        <>
                            <p>
                                Children should use the service only under the supervision of a parent or guardian. Family sessions are your responsibility to manage appropriately.
                            </p>
                        </>
                    ),
                },
                {
                    title: "6. Contact",
                    body: (
                        <>
                            <p>Email: <a className="text-amber-700 underline underline-offset-4" href="mailto:support@smartmurti.com">support@smartmurti.com</a></p>
                        </>
                    ),
                },
            ]}
        />
    );
}
