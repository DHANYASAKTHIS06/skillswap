import { useApp } from "../../context/AppContext";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

export default function StudentCredits() {
  const { studentCredits } = useApp();

  const transactions = [
    { id: 1, type: "earned", amount: 50, desc: "Completed Advanced React", date: "2 days ago" },
    { id: 2, type: "spent", amount: 2, desc: "Started UI/UX Course", date: "3 days ago" },
    { id: 3, type: "earned", amount: 30, desc: "Weekly Bonus", date: "1 week ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Credits</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your learning credits</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white">
        <p className="text-sm opacity-80 mb-2">Total Balance</p>
        <p className="text-5xl font-bold mb-4">{studentCredits}</p>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">+15% this month</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "earned"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  {tx.type === "earned" ? (
                    <ArrowUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{tx.desc}</p>
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
              </div>
              <p
                className={`text-lg font-semibold ${
                  tx.type === "earned" ? "text-green-500" : "text-red-500"
                }`}
              >
                {tx.type === "earned" ? "+" : "-"}
                {tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
