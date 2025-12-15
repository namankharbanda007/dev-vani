import React from "react";
import { Progress } from "@/components/ui/progress";
import { FREE_LIMIT_SECONDS, PREMIUM_LIMIT_SECONDS } from "@/lib/data";
import { Zap } from "lucide-react";

interface UsageStatsProps {
    user: IUser;
}

const UsageStats: React.FC<UsageStatsProps> = ({ user }) => {
    const limit = user.is_premium ? PREMIUM_LIMIT_SECONDS : FREE_LIMIT_SECONDS;
    const usage = user.session_time || 0;
    const remaining = Math.max(0, limit - usage);
    const percent = Math.min(100, (usage / limit) * 100);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 mb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Zap size={18} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Monthly Usage</h3>
                        <p className="text-sm text-gray-500">
                            {user.is_premium ? "Premium Plan" : "Free Plan"}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-indigo-700">
                        {formatTime(remaining)} left
                    </p>
                    <p className="text-xs text-gray-500">
                        of {formatTime(limit)} monthly limit
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Progress value={percent} className="h-3 rounded-full bg-indigo-100" />
                <p className="text-xs text-right text-gray-500">
                    Resets on {user.last_session_reset ? new Date(new Date(user.last_session_reset).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : "next cycle"}
                </p>
            </div>
        </div>
    );
};

export default UsageStats;
