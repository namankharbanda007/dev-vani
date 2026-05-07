"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const WALLET_TIERS = [101, 251, 501, 1000];

export default function WalletPage() {
    const router = useRouter();
    const supabase = createClient();

    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number>(101);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        fetchBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBalance = async () => {
        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        const { data } = await supabase
            .from("users")
            .select("wallet_balance")
            .eq("user_id", user.id)
            .single();

        if (data?.wallet_balance !== undefined) {
            setBalance(Number(data.wallet_balance));
        }

        setLoading(false);
    };

    const handleTopUp = async () => {
        const amountToRecharge = customAmount ? Number(customAmount) : selectedAmount;
        if (!Number.isFinite(amountToRecharge) || amountToRecharge <= 0) {
            setMessage({ type: "error", text: "Please enter a valid amount." });
            return;
        }

        setProcessing(true);
        setMessage(null);

        try {
            const orderRes = await fetch("/api/wallet/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountToRecharge }),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok || !orderData.success) {
                throw new Error(orderData.error || "Could not start wallet recharge");
            }

            const verifyRes = await fetch("/api/wallet/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: orderData.orderId,
                    amount: orderData.amount,
                    paymentId: orderData.paymentId,
                    signature: orderData.signature,
                }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || "Payment verification failed");
            }

            setBalance(Number(verifyData.newBalance));
            setCustomAmount("");
            setMessage({ type: "success", text: `Wallet recharged with Rs ${amountToRecharge}.` });
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "An error occurred during top-up.",
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FBF5EA]">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#C86B1F]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF5EA] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-[#E8D6B8] bg-[#FFFDF8] p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-[#1F1711]">Smart Murti Wallet</h1>
                    <p className="mb-6 text-sm text-[#6A4A2C]">Prepaid balance for Smart Pandit sessions</p>

                    <div className="rounded-2xl bg-gradient-to-r from-[#C86B1F] to-[#8f5d23] p-6 text-white shadow-lg">
                        <p className="mb-1 text-sm font-semibold uppercase tracking-wider opacity-90">Current Balance</p>
                        <p className="text-5xl font-bold">Rs {balance.toLocaleString("en-IN")}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="mb-4 text-lg font-semibold text-[#1F1711]">Recharge Wallet</h2>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                        {WALLET_TIERS.map((tier) => (
                            <button
                                key={tier}
                                type="button"
                                onClick={() => {
                                    setSelectedAmount(tier);
                                    setCustomAmount("");
                                }}
                                className={`rounded-xl border-2 px-4 py-3 font-semibold transition-all ${
                                    selectedAmount === tier && !customAmount
                                        ? "border-[#C86B1F] bg-orange-50 text-[#8f5d23] shadow-sm"
                                        : "border-[#E8D6B8] text-[#6A4A2C] hover:border-[#C86B1F]/40 hover:bg-orange-50/50"
                                }`}
                            >
                                Rs {tier}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[#6A4A2C]">Rs</span>
                        <input
                            type="number"
                            placeholder="Enter custom amount"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(0);
                            }}
                            className="w-full rounded-xl border-2 border-[#E8D6B8] py-3 pl-12 pr-4 font-medium text-[#1F1711] outline-none transition-colors focus:border-[#C86B1F]"
                        />
                    </div>
                </div>

                {message ? (
                    <div
                        className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
                            message.type === "success"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-red-200 bg-red-50 text-red-700"
                        }`}
                    >
                        {message.text}
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={handleTopUp}
                    disabled={processing || (!selectedAmount && !customAmount)}
                    className="w-full rounded-xl bg-[#1F1711] py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    {processing ? "Processing..." : `Recharge Rs ${customAmount || selectedAmount}`}
                </button>

                <p className="mt-4 text-center text-xs text-[#8a7763]">
                    Payments must be verified before balance updates. If online recharge is unavailable, contact support.
                </p>
            </div>
        </div>
    );
}
