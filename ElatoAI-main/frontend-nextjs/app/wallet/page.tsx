"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

const WALLET_TIERS = [101, 251, 501, 1000];

export default function WalletPage() {
    const router = useRouter();
    const supabase = createClient();

    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number>(101);
    const [customAmount, setCustomAmount] = useState<string>('');

    useEffect(() => {
        fetchBalance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBalance = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('users')
                .select('wallet_balance')
                .eq('user_id', user.id)
                .single();

            if (data?.wallet_balance !== undefined) {
                setBalance(Number(data.wallet_balance));
            }
        } else {
            router.push('/login');
        }
        setLoading(false);
    };

    const handleTopUp = async () => {
        const amountToRecharge = customAmount ? Number(customAmount) : selectedAmount;
        if (amountToRecharge <= 0) return alert("Please enter a valid amount.");

        setProcessing(true);
        try {
            // 1. Create Order
            const orderRes = await fetch('/api/wallet/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountToRecharge }),
            });
            const orderData = await orderRes.json();

            if (!orderData.success) throw new Error(orderData.error || "Failed to create order");

            // --- MOCK PAYMENT GATEWAY SDK BEHAVIOR ---
            // Simulating user typing card details and pressing "Pay Now" successfully
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 2. Verify Payment
            const verifyRes = await fetch('/api/wallet/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderData.orderId,
                    amount: orderData.amount,
                    paymentId: `pay_mock_${Date.now()}`,
                    signature: `mock_sig_123`
                }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
                setBalance(verifyData.newBalance);
                alert(`Successfully recharged ₹${amountToRecharge}!`);
                setCustomAmount('');
            } else {
                throw new Error(verifyData.error || "Payment verification failed");
            }
        } catch (error: any) {
            alert(error.message || "An error occurred during top-up.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8 border border-amber-100">

                {/* Header & Balance */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart Murti Wallet</h1>
                    <p className="text-sm text-gray-500 mb-6">100% Secure & Prepaid</p>

                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                        <p className="text-sm uppercase tracking-wider font-semibold opacity-90 mb-1">Current Balance</p>
                        <p className="text-5xl font-bold">₹{balance.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Top-up Selection */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recharge Wallet</h2>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {WALLET_TIERS.map((tier) => (
                            <button
                                key={tier}
                                onClick={() => { setSelectedAmount(tier); setCustomAmount(''); }}
                                className={`py-3 px-4 rounded-xl border-2 transition-all font-semibold ${selectedAmount === tier && !customAmount
                                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                                        : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50'
                                    }`}
                            >
                                ₹{tier}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                        <input
                            type="number"
                            placeholder="Enter custom amount"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(0);
                            }}
                            className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-0 outline-none transition-colors text-gray-800 font-medium"
                        />
                    </div>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={handleTopUp}
                    disabled={processing || (!selectedAmount && !customAmount)}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                        </span>
                    ) : (
                        `Pay ₹${customAmount || selectedAmount}`
                    )}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                    🔒 Secured Mock Payment Gateway
                </p>
            </div>
        </div>
    );
}
