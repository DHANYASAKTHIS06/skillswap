import { useState, useEffect } from "react";
import { Users, BookOpen, TrendingUp, AlertCircle, Activity, ArrowUpRight, Zap } from "lucide-react";

export default function AdminOverview() {
  // Animated counter state
  const [totalUsers, setTotalUsers] = useState(5240);
  const [activeCourses, setActiveCourses] = useState(342);
  const [growthRate, setGrowthRate] = useState(22);
  const [pendingReviews, setPendingReviews] = useState(12);

  // Simulate real-time stat updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalUsers((prev) => prev + Math.floor(Math.random() * 3));
      setActiveCourses((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
      setPendingReviews((prev) =>
        Math.max(0, prev + (Math.random() > 0.5 ? 1 : -1))
      );
      setGrowthRate(() => 20 + Math.floor(Math.random() * 8));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      bg: "bg-blue-100 dark:bg-blue-900/40",
      iconColor: "text-blue-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Active Courses",
      value: activeCourses.toString(),
      icon: BookOpen,
      bg: "bg-emerald-100 dark:bg-emerald-900/40",
      iconColor: "text-emerald-500",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Growth Rate",
      value: `+${growthRate}%`,
      icon: TrendingUp,
      bg: "bg-violet-100 dark:bg-violet-900/40",
      iconColor: "text-violet-500",
      trend: "+3%",
      trendUp: true,
    },
    {
      label: "Pending Reviews",
      value: pendingReviews.toString(),
      icon: AlertCircle,
      bg: "bg-amber-100 dark:bg-amber-900/40",
      iconColor: "text-amber-500",
      trend: pendingReviews > 10 ? "High" : "Normal",
      trendUp: false,
    },
  ];

  const [alerts] = useState([
    {
      title: "New Tutor Application",
      message: "Dr. Julian Smith submitted a new certificate for review.",
      time: "JUST NOW",
      color: "blue",
      icon: Zap,
    },
    {
      title: "Credit Dispute",
      message: "Dispute raised for TXN-8421 between Alex and Sarah.",
      time: "15M AGO",
      color: "amber",
      icon: AlertCircle,
    },
    {
      title: "System Health",
      message: "All services operational. Response time: 42ms avg.",
      time: "1H AGO",
      color: "emerald",
      icon: Activity,
    },
  ]);

  const colorMap: Record<string, { bg: string; border: string; iconBg: string }> = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/20",
      border: "border-blue-200/80 dark:border-blue-800/40",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/20",
      border: "border-amber-200/80 dark:border-amber-800/40",
      iconBg: "bg-amber-100 dark:bg-amber-900/40",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
      border: "border-emerald-200/80 dark:border-emerald-800/40",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Platform overview and real-time management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900/80 backdrop-blur rounded-xl p-5 border border-gray-200/80 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <span
                className={`
                  text-xs font-semibold px-2 py-0.5 rounded-full
                  ${
                    stat.trendUp
                      ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                      : stat.trend === "High"
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                  }
                `}
              >
                {stat.trendUp && <ArrowUpRight className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />}
                {stat.trend}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const colors = colorMap[alert.color] || colorMap.blue;
          return (
            <div
              key={alert.title}
              className={`${colors.bg} rounded-xl p-5 border ${colors.border} hover:scale-[1.01] transition-transform cursor-default`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <alert.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1">{alert.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {alert.message}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mt-2">
                    {alert.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
