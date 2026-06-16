'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Deposit {
  id: number;
  amount: number;
  status: string;
  createdAt: string;
  approvedAt?: string;
}

interface EmailAccount {
  id: number;
  email: string;
  provider: string;
  status: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [emails, setEmails] = useState<EmailAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const [depositsRes] = await Promise.all([
        fetch('/api/deposits/list'),
      ]);

      const depositsData = await depositsRes.json();
      if (depositsData.success) {
        setDeposits(depositsData.deposits);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      verified: 'bg-green-100 text-green-800',
      expired: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-gray-600 mt-2">
          View your deposit and email account history
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Tabs defaultValue="deposits" className="w-full">
          <TabsList className="border-b border-gray-200 w-full justify-start rounded-none">
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="emails">Email Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="deposits" className="p-6">
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : deposits.length === 0 ? (
              <p className="text-gray-600">No deposits yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Created</th>
                      <th className="text-left py-3 px-4 font-semibold">Approved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.map((deposit) => (
                      <tr key={deposit.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">
                          Rp {deposit.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(deposit.status)}`}>
                            {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(deposit.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {deposit.approvedAt
                            ? new Date(deposit.approvedAt).toLocaleDateString('id-ID')
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="emails" className="p-6">
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : emails.length === 0 ? (
              <p className="text-gray-600">No email accounts yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Provider</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((email) => (
                      <tr key={email.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{email.email}</td>
                        <td className="py-3 px-4 text-sm capitalize">
                          {email.provider}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(email.status)}`}>
                            {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(email.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
