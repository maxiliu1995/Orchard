import { useGetDashboardStatsQuery, useGetSystemHealthQuery } from '@/store/api/admin';
import { Card } from '@/components/ui/Card';
import { RevenueChart } from './RevenueChart';

export const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: health } = useGetSystemHealthQuery();

  if (statsLoading) return <div>Loading dashboard...</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-semibold">{stats.totalUsers}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Active Pods</h3>
            <p className="text-2xl font-semibold">{stats.totalPods}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Current Bookings</h3>
            <p className="text-2xl font-semibold">{stats.activeBookings}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
            <p className="text-2xl font-semibold">{stats.occupancyRate}%</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
            <RevenueChart data={stats.revenue} />
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">System Health</h3>
            <div className="space-y-2">
              {health?.services.map(service => (
                <div key={service.name} className="flex justify-between items-center">
                  <span>{service.name}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    service.status === 'healthy' ? 'bg-green-100 text-green-800' :
                    service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 