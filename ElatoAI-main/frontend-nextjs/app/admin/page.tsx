import Link from "next/link";
import { redirect } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { Activity, CreditCard, IndianRupee, LockKeyhole, Users, WalletCards } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/utils/supabase/service";
import { getAdminEmails, isAdminEmail } from "@/lib/admin";

export const dynamic = "force-dynamic";

type AdminUser = {
    user_id: string;
    email: string | null;
    created_at: string | null;
    is_premium: boolean | null;
    session_time: number | null;
    wallet_balance?: number | string | null;
    supervisee_name?: string | null;
    language_code?: string | null;
};

type WalletTransaction = {
    transaction_id?: string;
    user_id?: string | null;
    type?: string | null;
    amount?: number | string | null;
    service_name?: string | null;
    status?: string | null;
    created_at?: string | null;
};

type InboundLead = {
    inbound_id?: string;
    name?: string | null;
    email?: string | null;
    type?: string | null;
    created_at?: string | null;
};

type ConversationRow = {
    conversation_id?: string;
    user_id?: string | null;
    personality_key?: string | null;
    role?: string | null;
    created_at?: string | null;
};

function formatDate(value?: string | null) {
    if (!value) return "Unknown";
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function money(value: number | string | null | undefined) {
    const amount = Number(value || 0);
    return `Rs ${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

async function loadUsers(service: ReturnType<typeof createServiceClient>) {
    const withWallet = await service
        .from("users")
        .select("user_id,email,created_at,is_premium,session_time,wallet_balance,supervisee_name,language_code")
        .order("created_at", { ascending: false })
        .limit(500);

    if (!withWallet.error) {
        return { users: (withWallet.data || []) as AdminUser[], error: null as string | null };
    }

    const fallback = await service
        .from("users")
        .select("user_id,email,created_at,is_premium,session_time,supervisee_name,language_code")
        .order("created_at", { ascending: false })
        .limit(500);

    return {
        users: (fallback.data || []) as AdminUser[],
        error: fallback.error?.message || withWallet.error.message,
    };
}

async function loadAdminData() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return {
            configured: false,
            users: [] as AdminUser[],
            transactions: [] as WalletTransaction[],
            inbound: [] as InboundLead[],
            conversations: [] as ConversationRow[],
            errors: ["SUPABASE_SERVICE_ROLE_KEY is required for owner-wide admin analytics."],
        };
    }

    const service = createServiceClient();
    const errors: string[] = [];

    const [userResult, transactionsResult, inboundResult, conversationsResult] = await Promise.all([
        loadUsers(service),
        service
            .from("wallet_transactions")
            .select("transaction_id,user_id,type,amount,service_name,status,created_at")
            .order("created_at", { ascending: false })
            .limit(200),
        service
            .from("inbound")
            .select("inbound_id,name,email,type,created_at")
            .order("created_at", { ascending: false })
            .limit(100),
        service
            .from("conversations")
            .select("conversation_id,user_id,personality_key,role,created_at")
            .order("created_at", { ascending: false })
            .limit(100),
    ]);

    if (userResult.error) errors.push(`Users: ${userResult.error}`);
    if (transactionsResult.error) errors.push(`Wallet transactions: ${transactionsResult.error.message}`);
    if (inboundResult.error) errors.push(`Inbound leads: ${inboundResult.error.message}`);
    if (conversationsResult.error) errors.push(`Conversations: ${conversationsResult.error.message}`);

    return {
        configured: true,
        users: userResult.users,
        transactions: (transactionsResult.data || []) as WalletTransaction[],
        inbound: (inboundResult.data || []) as InboundLead[],
        conversations: (conversationsResult.data || []) as ConversationRow[],
        errors,
    };
}

export default async function AdminPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin-login");
    }

    if (!isAdminEmail(user.email)) {
        return (
            <AdminShell>
                <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-red-800">
                    <LockKeyhole className="mb-4 h-8 w-8" />
                    <h1 className="text-2xl font-bold">Admin access denied</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6">
                        This account is signed in, but its email is not listed in ADMIN_EMAILS. Current configured admin emails: {getAdminEmails().length || "none"}.
                    </p>
                    <Link href="/admin-login" className="mt-5 inline-flex rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white">
                        Back to admin login
                    </Link>
                </div>
            </AdminShell>
        );
    }

    const data = await loadAdminData();
    const totalUsers = data.users.length;
    const premiumUsers = data.users.filter((row) => row.is_premium).length;
    const activeUsers = data.users.filter((row) => Number(row.session_time || 0) > 0).length;
    const walletBalance = data.users.reduce((sum, row) => sum + Number(row.wallet_balance || 0), 0);
    const rechargeTotal = data.transactions
        .filter((row) => row.type === "credit" && row.service_name !== "Welcome Bonus")
        .reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const spendTotal = data.transactions
        .filter((row) => row.type === "debit")
        .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    return (
        <AdminShell>
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#C86B1F]">Owner dashboard</p>
                    <h1 className="font-lora text-4xl font-bold text-[#1F1711] md:text-5xl">Users, wallet, and service health</h1>
                    <p className="mt-3 max-w-3xl text-[#6A4A2C]">
                        Private view for Smart Murti operations. Data is read server-side with service-role Supabase access after admin email verification.
                    </p>
                </div>
                <Link href="/home" className="inline-flex rounded-xl border border-[#E8D6B8] bg-[#FFFDF8] px-5 py-3 text-sm font-bold text-[#1F1711]">
                    Open app
                </Link>
            </div>

            {data.errors.length ? (
                <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
                    {data.errors.join(" ")}
                </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard icon={Users} label="Users loaded" value={totalUsers.toLocaleString("en-IN")} detail={`${premiumUsers} premium`} />
                <MetricCard icon={Activity} label="Active accounts" value={activeUsers.toLocaleString("en-IN")} detail="Session time above zero" />
                <MetricCard icon={WalletCards} label="Wallet balance" value={money(walletBalance)} detail="Across loaded users" />
                <MetricCard icon={IndianRupee} label="Recharge signal" value={money(rechargeTotal)} detail={`${money(spendTotal)} service spend`} />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <Panel title="Recent wallet movement">
                    <div className="space-y-3">
                        {data.transactions.slice(0, 10).map((row, index) => (
                            <div key={row.transaction_id || index} className="flex items-center justify-between rounded-2xl border border-[#EFE3D2] bg-white px-4 py-3">
                                <div>
                                    <p className="font-semibold text-[#1F1711]">{row.service_name || "Wallet activity"}</p>
                                    <p className="text-xs text-[#7a6651]">{formatDate(row.created_at)} · {row.status || "unknown"}</p>
                                </div>
                                <span className={`text-sm font-bold ${row.type === "debit" ? "text-red-700" : "text-green-700"}`}>
                                    {row.type === "debit" ? "-" : "+"}{money(row.amount)}
                                </span>
                            </div>
                        ))}
                        {!data.transactions.length ? <EmptyLine text="No wallet transactions loaded yet." /> : null}
                    </div>
                </Panel>

                <Panel title="Inbound interest">
                    <div className="space-y-3">
                        {data.inbound.slice(0, 8).map((row, index) => (
                            <div key={row.inbound_id || index} className="rounded-2xl border border-[#EFE3D2] bg-white px-4 py-3">
                                <p className="font-semibold text-[#1F1711]">{row.name || "Unnamed lead"}</p>
                                <p className="text-xs text-[#7a6651]">{row.email || "No email"} · {row.type || "lead"} · {formatDate(row.created_at)}</p>
                            </div>
                        ))}
                        {!data.inbound.length ? <EmptyLine text="No inbound leads loaded yet." /> : null}
                    </div>
                </Panel>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <Panel title="Recent users">
                    <div className="overflow-hidden rounded-2xl border border-[#EFE3D2]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#FBF5EA] text-xs uppercase tracking-[0.16em] text-[#7a6651]">
                                <tr>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Wallet</th>
                                    <th className="px-4 py-3">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EFE3D2] bg-white">
                                {data.users.slice(0, 10).map((row) => (
                                    <tr key={row.user_id}>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-[#1F1711]">{row.supervisee_name || row.email || "User"}</p>
                                            <p className="text-xs text-[#7a6651]">{row.email || row.user_id}</p>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">{money(row.wallet_balance)}</td>
                                        <td className="px-4 py-3 text-[#7a6651]">{formatDate(row.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>

                <Panel title="Recent conversation events">
                    <div className="space-y-3">
                        {data.conversations.slice(0, 10).map((row, index) => (
                            <div key={row.conversation_id || index} className="flex items-center justify-between rounded-2xl border border-[#EFE3D2] bg-white px-4 py-3">
                                <div>
                                    <p className="font-semibold text-[#1F1711]">{row.personality_key || "Smart Pandit"}</p>
                                    <p className="text-xs text-[#7a6651]">{row.role || "message"} · {formatDate(row.created_at)}</p>
                                </div>
                                <CreditCard className="h-4 w-4 text-[#C86B1F]" />
                            </div>
                        ))}
                        {!data.conversations.length ? <EmptyLine text="No conversation rows loaded yet." /> : null}
                    </div>
                </Panel>
            </div>
        </AdminShell>
    );
}

function AdminShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FBF5EA] px-4 py-8 text-[#1F1711] md:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
        </div>
    );
}

function MetricCard({
    icon: Icon,
    label,
    value,
    detail,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string;
    detail: string;
}) {
    return (
        <div className="rounded-[24px] border border-[#E8D6B8] bg-[#FFFDF8] p-5 shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5E8CF] text-[#8f5d23]">
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7a6651]">{label}</p>
            <p className="mt-2 text-3xl font-bold text-[#1F1711]">{value}</p>
            <p className="mt-1 text-sm text-[#6A4A2C]">{detail}</p>
        </div>
    );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="rounded-[28px] border border-[#E8D6B8] bg-[#FFFDF8] p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-[#1F1711]">{title}</h2>
            {children}
        </section>
    );
}

function EmptyLine({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-[#E8D6B8] bg-[#FBF5EA] px-4 py-5 text-sm font-medium text-[#7a6651]">
            {text}
        </div>
    );
}
