import { Card, CardContent } from "@/components/ui/card";
import { Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";

const stats = [
  {
    title: "Total Earnings",
    value: "₹1,24,000",
    icon: DollarSign,
  },
  {
    title: "Total Bookings",
    value: "320",
    icon: Calendar,
  },
  {
    title: "Completed Bookings",
    value: "280",
    icon: CheckCircle,
  },
  {
    title: "Upcoming Bookings",
    value: "40",
    icon: Clock,
  },
];

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Vendor Dashboard</h1>
        <p className="text-gray-500">Overview of your performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="rounded-2xl shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="text-2xl font-bold">{stat.value}</h2>
                </div>
                <Icon className="w-8 h-8 text-gray-400" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            <ul className="space-y-3">
              <li className="flex justify-between text-sm">
                <span>Bridal Makeup - Ananya</span>
                <span className="text-green-500">Completed</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Mehendi - Priya</span>
                <span className="text-yellow-500">Upcoming</span>
              </li>
              <li className="flex justify-between text-sm">
                <span>Party Makeup - Sneha</span>
                <span className="text-green-500">Completed</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>⭐ Average Rating: 4.8</li>
              <li>📈 Growth this month: +12%</li>
              <li>💬 Customer Reviews: 120</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
