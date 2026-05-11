import { buildMetadata } from "@/app/lib/seo";
import LegalPageLayout from "@/app/components/legal/LegalPageLayout";
import { companyInfo } from "@/app/lib/company";

export const metadata = buildMetadata({
    title: "Privacy Policy",
    description:
        `Privacy Policy for ${companyInfo.legalName} covering account data, voice interactions, spiritual session history, and payments.`,
    path: "/privacy",
});

const lastUpdated = "April 17, 2026";

export default function PrivacyPage() {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            lastUpdated={lastUpdated}
            intro={
                <p>
                    This Privacy Policy explains how <strong>{companyInfo.legalName}</strong> collects, uses, stores,
                    and protects information when you use {companyInfo.brandName} through our website, mobile application,
                    chat, live call, WhatsApp experiences, and family puja sessions.
                </p>
            }
            sections={[
                {
                    title: "1. Information We Collect",
                    body: (
                        <>
                            <p>We may collect the following categories of information:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>Account details such as your name, email address, phone number, and sign-in information.</li>
                                <li>Profile and spiritual context such as language preference, date of birth, birth time, birth place, zodiac details, and family member information you choose to provide.</li>
                                <li>Conversation data from chat, voice, and live puja sessions, including family coordination messages and spiritual guidance history.</li>
                                <li>Usage, device, and technical data such as IP address, browser type, device type, crash logs, and session analytics.</li>
                                <li>Transaction and wallet information related to recharges, purchases, and payment verification.</li>
                            </ul>
                        </>
                    ),
                },
                {
                    title: "2. How We Use Information",
                    body: (
                        <>
                            <p>We use information to operate and improve {companyInfo.brandName}, including to:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>Provide live multilingual AI pandit guidance, astrology flows, family puja sessions, and support.</li>
                                <li>Remember spiritual preferences and prior context so future sessions are more relevant and continuous.</li>
                                <li>Process payments, wallet credits, failed transaction recovery, and fraud checks.</li>
                                <li>Monitor service quality, reliability, safety, and abuse prevention.</li>
                                <li>Communicate service updates, support responses, policy changes, and operational notifications.</li>
                            </ul>
                        </>
                    ),
                },
                {
                    title: "3. Voice, Chat, and Session Data",
                    body: (
                        <>
                            <p>
                                {companyInfo.brandName} may process voice and chat content to deliver real-time spiritual guidance, family live sessions,
                                follow-up reminders, and conversation continuity. We may store meaningful parts of these interactions to
                                improve session quality and maintain spiritual memory across visits.
                            </p>
                            <p>
                                You should not share highly sensitive personal information unless it is necessary for the service you want.
                            </p>
                        </>
                    ),
                },
                {
                    title: "4. Sharing of Information",
                    body: (
                        <>
                            <p>We do not sell your personal data. We may share limited information with trusted service providers that help us:</p>
                            <ul className="list-disc space-y-2 pl-6">
                                <li>host the platform and infrastructure,</li>
                                <li>process payments,</li>
                                <li>support authentication, notifications, analytics, and customer support, and</li>
                                <li>operate voice or AI systems necessary to provide the service.</li>
                            </ul>
                            <p>We may also disclose information if required by law, legal process, or to protect our users, platform, or business.</p>
                        </>
                    ),
                },
                {
                    title: "5. Data Retention and Security",
                    body: (
                        <>
                            <p>
                                We retain data for as long as reasonably necessary to provide the service, comply with legal obligations,
                                resolve disputes, and maintain product continuity. We use reasonable technical and organizational safeguards,
                                but no system can guarantee absolute security.
                            </p>
                        </>
                    ),
                },
                {
                    title: "6. Children and Family Use",
                    body: (
                        <>
                            <p>
                                {companyInfo.brandName} may be used in family settings, but children should use the service only under the supervision of a parent or guardian.
                                We do not knowingly collect personal information from children in violation of applicable law.
                            </p>
                        </>
                    ),
                },
                {
                    title: "7. Your Choices",
                    body: (
                        <>
                            <p>You may contact us to request account support, correction of obvious inaccuracies, or deletion requests where applicable.</p>
                            <p>
                                Some data may still be retained where necessary for security, fraud prevention, payment reconciliation, or legal compliance.
                            </p>
                        </>
                    ),
                },
                {
                    title: "8. Contact",
                    body: (
                        <>
                            <p>Email: <a className="text-amber-700 underline underline-offset-4" href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a></p>
                            <p>Registered Office: {companyInfo.registeredOffice}</p>
                            <p>CIN: {companyInfo.cin}</p>
                        </>
                    ),
                },
            ]}
        />
    );
}
