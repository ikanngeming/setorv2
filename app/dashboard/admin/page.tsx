'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Deposit {
  id: number;
  amount: number;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Broadcast {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    content: '',
    targetRole: 'all',
  });

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      router.push('/dashboard');
    } else {
      fetchData();
    }
  }, [session, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [depositsRes] = await Promise.all([
        fetch('/api/admin/deposits/pending'),
      ]);

      const depositsData = await depositsRes.json();
      if (depositsData.success) {
        setDeposits(depositsData.deposits);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (depositId: number) => {
    try {
      const response = await fetch('/api/admin/deposits/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId }),
      });

      if (response.ok) {
        setDeposits(deposits.filter((d) => d.id !== depositId));
      }
    } catch (error) {
      console.error('Failed to approve deposit:', error);
    }
  };

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/broadcasts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastForm),
      });

      if (response.ok) {
        setBroadcastForm({ title: '', content: '', targetRole: 'all' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create broadcast:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-600 mt-2">
          Manage deposits, broadcasts, and user approvals
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="deposits" className="w-full">
          <TabsList className="border-b border-gray-200 w-full justify-start rounded-none">
            <TabsTrigger value="deposits">Pending Deposits</TabsTrigger>
            <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          </TabsList>

          {/* Deposits Tab */}
          <TabsContent value="deposits" className="p-6">
            {deposits.length === 0 ? (
              <p className="text-gray-600">No pending deposits</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.map((deposit) => (
                      <tr key={deposit.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{deposit.user.name}</p>
                            <p className="text-sm text-gray-600">{deposit.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          Rp {deposit.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(deposit.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleApproveDeposit(deposit.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Broadcasts Tab */}
          <TabsContent value="broadcasts" className="p-6 space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Create Broadcast</h3>
              <form onSubmit={handleCreateBroadcast} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={broadcastForm.title}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, title: e.target.value })
                    }
                    placeholder="Broadcast title"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={broadcastForm.content}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, content: e.target.value })
                    }
                    placeholder="Broadcast content"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Role
                  </label>
                  <select
                    value={broadcastForm.targetRole}
                    onChange={(e) =>
                      setBroadcastForm({ ...broadcastForm, targetRole: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Users</option>
                    <option value="user">Regular Users</option>
                    <option value="admin">Admins Only</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Create Broadcast
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Recent Broadcasts</h3>
              <p className="text-gray-600">No broadcasts yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
