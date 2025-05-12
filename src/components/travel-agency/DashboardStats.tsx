
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type StatItem = {
  name: string;
  value: number;
};

type DashboardStatsProps = {
  stats: StatItem[];
  isLoading?: boolean;
};

export const DashboardStats = ({ stats, isLoading = false }: DashboardStatsProps) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-display font-bold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array(5).fill(0).map((_, index) => (
            <Card key={index} className="border-gray-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-5 w-24 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
