'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalEmails: number;
  totalBalance: number;
  pendingDeposits: number;
  approvedDeposits: number;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmails: 0,
    totalBalance: 0,
    pendingDeposits: 0,
    approvedDeposits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a dedicated stats endpoint
      // For now, we'll fetch from individual endpoints
      const [depositsRes] = await Promise.all([
        fetch('/api/deposits/list'),
      ]);

      const depositsData = await depositsRes.json();

      if (depositsData.success) {
        const pending = depositsData.deposits.filter(
          (d: any) => d.status === 'pending'
        ).length;
        const approved = depositsData.deposits.filter(
          (d: any) => d.status === 'approved'
        ).length;

        setStats({
          totalEmails: 0, // Would need separate endpoint
          totalBalance: 0, // Would need separate endpoint
          pendingDeposits: pending,
          approvedDeposits: approved,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your dashboard overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Emails"
          value={stats.totalEmails}
          icon="✉️"
          color="blue"
        />
        <StatCard
          title="Balance"
          value={`Rp ${stats.totalBalance.toLocaleString('id-ID')}`}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Pending Deposits"
          value={stats.pendingDeposits}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Approved Deposits"
          value={stats.approvedDeposits}
          icon="✅"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/emails"
            className="p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-center"
          >
            <div className="text-3xl mb-2">✉️</div>
            <div className="font-semibold text-blue-600">Generate Email</div>
            <div className="text-sm text-gray-600">Create new email account</div>
          </Link>

          <Link
            href="/dashboard/deposits"
            className="p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors text-center"
          >
            <div className="text-3xl mb-2">💰</div>
            <div className="font-semibold text-green-600">Make Deposit</div>
            <div className="text-sm text-gray-600">Request new deposit</div>
          </Link>

          <Link
            href="/dashboard/history"
            className="p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition-colors text-center"
          >
            <div className="text-3xl mb-2">📜</div>
            <div className="font-semibold text-purple-600">View History</div>
            <div className="text-sm text-gray-600">Check your transactions</div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="p-4 border-2 border-gray-500 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <div className="font-semibold text-gray-600">Settings</div>
            <div className="text-sm text-gray-600">Manage your profile</div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-600">
          No recent activity. Start by generating an email or making a deposit!
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
