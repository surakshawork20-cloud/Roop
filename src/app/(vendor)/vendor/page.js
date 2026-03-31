import { Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";

const stats = [
  { title: "Total Bookings", value: "320", icon: Calendar },
  { title: "Completed Bookings", value: "280", icon: CheckCircle },
  { title: "Upcoming Bookings", value: "40", icon: Clock },
];

function Card({ children }) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/30 w-full">
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return <div className="p-4 sm:p-5">{children}</div>;
}

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Vendor Dashboard (Coming Soon...)
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Overview of your performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {stat.title}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-bold">
                        {stat.value}
                      </h2>
                    </div>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardContent>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Recent Bookings
              </h2>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span>Bridal Makeup - Ananya</span>
                  <span className="text-green-500">Completed</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span>Mehendi - Priya</span>
                  <span className="text-yellow-500">Upcoming</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span>Party Makeup - Sneha</span>
                  <span className="text-green-500">Completed</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardContent>
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                Quick Insights
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>⭐ Average Rating: 4.8</li>
                <li>📈 Growth this month: +12%</li>
                <li>💬 Customer Reviews: 120</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
