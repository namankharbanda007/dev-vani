import { buildMetadata } from "@/app/lib/seo";
import LegalPageLayout from "@/app/components/legal/LegalPageLayout";

export const metadata = buildMetadata({
    title: "Terms of Service",
    description:
        "Terms of Service for Smartmurti AI Private Limited covering website, app, live pandit sessions, wallet use, and family puja experiences.",
    path: "/terms",
});

const lastUpdated = "April 17, 2026";

export default function TermsPage() {
    return (
        <LegalPageLayout
            title="Terms of Service"
            lastUpdated={lastUpdated}
            intro={
                <p>
                    These Terms of Service govern your use of SMART मूर्ति operated by <strong>Smartmurti AI Private Limited</strong>.
                    By using our website, app, chat, live calls, wallet, and family puja features, you agree to these terms.
                </p>
            }
            sections={[
                {
                    title: "1. Eligibility and Accounts",
                    body: (
                        <>
                            <p>You must use the platform lawfully and provide reasonably accurate information when creating an account or booking a session.</p>
                            <p>You are responsible for activity under your account and for keeping your login credentials secure.</p>
                        </>
                    ),
                },
                {
                    title: "2. Nature of the Service",
                    body: (
                        <>
                            <p>
                                SMART मूर्ति provides AI-enabled spiritual guidance, live AI pandit sessions, astrology-style flows, family coordination, and related devotional experiences.
                                These services are designed for spiritual, cultural, devotional, and informational use.
                            </p>
                        </>
                    ),
                },
                {
                    title: "3. Acceptable Use",
                    body: (
                        <>
                            <p>You agree not to misuse the platform. This includes not using SMART मूर्ति to:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>harass, threaten, impersonate, or abuse others,</li>
                                <li>attempt to disrupt, reverse engineer, scrape, or compromise the service,</li>
                                <li>engage in unlawful, fraudulent, or harmful conduct, or</li>
                                <li>upload or send content that violates applicable law or third-party rights.</li>
                            </ul>
                        </>
                    ),
                },
                {
                    title: "4. AI Outputs and Human Judgment",
                    body: (
                        <>
                            <p>
                                SMART मूर्ति uses AI systems to generate responses. Outputs may occasionally be incomplete, inaccurate, or imperfect.
                                You should use your own judgment and not rely on the platform as a substitute for professional medical, legal, financial, or emergency advice.
                            </p>
                        </>
                    ),
                },
                {
                    title: "5. Wallets, Payments, and Digital Sessions",
                    body: (
                        <>
                            <p>
                                Some features may require prepaid wallet balance, recharges, or session-based payments. Pricing, credits, and usage rules may change over time.
                            </p>
                            <p>
                                Digital sessions and spiritual guidance are treated as digital services. Refund rules are described in our Refund Policy.
                            </p>
                        </>
                    ),
                },
                {
                    title: "6. Family Sessions and Shared Rooms",
                    body: (
                        <>
                            <p>
                                If you invite family or guests into a room, you are responsible for sharing the session appropriately.
                                You should not share room access publicly or in a way that creates misuse or disruption.
                            </p>
                        </>
                    ),
                },
                {
                    title: "7. Intellectual Property",
                    body: (
                        <>
                            <p>
                                The SMART मूर्ति platform, brand, software, design, and service materials are owned by Smartmurti AI Private Limited or its licensors.
                                You may not copy, resell, or exploit them beyond normal use of the service without permission.
                            </p>
                        </>
                    ),
                },
                {
                    title: "8. Suspension and Termination",
                    body: (
                        <>
                            <p>
                                We may suspend or terminate access if we reasonably believe you violated these terms, created abuse or fraud risk,
                                or threatened the security or reliability of the platform.
                            </p>
                        </>
                    ),
                },
                {
                    title: "9. Limitation of Liability",
                    body: (
                        <>
                            <p>
                                To the maximum extent permitted by law, Smartmurti AI Private Limited is not liable for indirect, incidental,
                                special, or consequential damages arising from your use of the service.
                            </p>
                        </>
                    ),
                },
                {
                    title: "10. Contact",
                    body: (
                        <>
                            <p>Email: <a className="text-amber-700 underline underline-offset-4" href="mailto:support@smartmurti.com">support@smartmurti.com</a></p>
                            <p>Remote-first support: Smart Murti serves NRI families through email, WhatsApp, and scheduled digital sessions across time zones.</p>
                        </>
                    ),
                },
            ]}
        />
    );
}
