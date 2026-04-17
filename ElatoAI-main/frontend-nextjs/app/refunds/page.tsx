import { buildMetadata } from "@/app/lib/seo";
import LegalPageLayout from "@/app/components/legal/LegalPageLayout";

export const metadata = buildMetadata({
    title: "Refund Policy",
    description:
        "Refund Policy for Smartmurti AI Private Limited covering live sessions, wallet recharges, duplicate payments, and failed transactions.",
    path: "/refunds",
});

const lastUpdated = "April 17, 2026";

export default function RefundsPage() {
    return (
        <LegalPageLayout
            title="Refund Policy"
            lastUpdated={lastUpdated}
            intro={
                <p>
                    This Refund Policy explains how refunds are handled for SMART मूर्ति digital services provided by <strong>Smartmurti AI Private Limited</strong>.
                </p>
            }
            sections={[
                {
                    title: "1. Digital Sessions",
                    body: (
                        <>
                            <p>
                                Once a live session, call, chat, or guided puja has started, it is treated as a consumed digital service and is generally <strong>non-refundable</strong>.
                            </p>
                        </>
                    ),
                },
                {
                    title: "2. Wallet Recharges",
                    body: (
                        <>
                            <p>
                                Wallet or recharge balances are generally <strong>non-refundable</strong> after successful credit to your account, except in clear cases of failed, duplicate, or unauthorized payment verified by us.
                            </p>
                        </>
                    ),
                },
                {
                    title: "3. Failed or Duplicate Payments",
                    body: (
                        <>
                            <p>
                                If you were charged but did not receive the wallet credit or session entitlement, or if the same payment was charged more than once,
                                please contact us with transaction details. Verified failures or duplicates may be reversed or refunded.
                            </p>
                        </>
                    ),
                },
                {
                    title: "4. Session Access Issues",
                    body: (
                        <>
                            <p>
                                If a technical failure on our side prevents a booked session from being delivered at all, we may choose to provide a replacement session,
                                restore wallet balance, or issue a refund at our discretion after review.
                            </p>
                        </>
                    ),
                },
                {
                    title: "5. How to Request Review",
                    body: (
                        <>
                            <p>
                                For payment or refund review, contact <a className="text-amber-700 underline underline-offset-4" href="mailto:support@smartmurti.com">support@smartmurti.com</a> with your registered email,
                                payment reference, approximate date and time, and a short explanation of the issue.
                            </p>
                        </>
                    ),
                },
            ]}
        />
    );
}
