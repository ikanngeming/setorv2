'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: '',
    emailAccountId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/deposits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(formData.amount),
          emailAccountId: formData.emailAccountId ? parseInt(formData.emailAccountId) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create deposit');
      } else {
        setSuccess('Deposit request created! Waiting for admin approval...');
        setFormData({
          amount: '',
          emailAccountId: '',
        });
        setTimeout(() => {
          router.push('/dashboard/history');
        }, 2000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-2">Make a Deposit</h1>
        <p className="text-gray-600 mb-8">
          Request a deposit to add balance to your account
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount (Rp)
            </label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="100000"
              required
              min="10000"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum deposit: Rp 10.000
            </p>
          </div>

          <div>
            <label htmlFor="emailAccountId" className="block text-sm font-medium text-gray-700 mb-2">
              Email Account (Optional)
            </label>
            <select
              id="emailAccountId"
              name="emailAccountId"
              value={formData.emailAccountId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">-- Select Email Account --</option>
              <option value="">No specific email</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Link this deposit to a specific email account (optional)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : 'Request Deposit'}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Submit your deposit request</li>
              <li>Wait for admin approval (usually within 24 hours)</li>
              <li>Balance will be added to your account</li>
              <li>Use balance to activate email accounts</li>
            </ol>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Payment Methods:</h3>
            <p className="text-sm text-yellow-800">
              Admin will contact you with payment instructions after you submit the deposit request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
