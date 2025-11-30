import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    PencilIcon, 
    TrashIcon, 
    MagnifyingGlassIcon, 
    PlusIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    BanknotesIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function Index({ renewals, filters, stats = {}, needsRenewal = [] }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [paymentStatus, setPaymentStatus] = useState(filters?.payment_status || '');
    const [showNeedsRenewal, setShowNeedsRenewal] = useState(true);

    // Provide default values for stats
    const safeStats = {
        total_renewals: stats?.total_renewals || 0,
        active_renewals: stats?.active_renewals || 0,
        due_soon: stats?.due_soon || 0,
        overdue: stats?.overdue || 0,
        total_renewal_payments: stats?.total_renewal_payments || 0,
        total_renewal_amount: stats?.total_renewal_amount || 0,
        total_balance: stats?.total_balance || 0,
        fully_paid_renewals: stats?.fully_paid_renewals || 0,
        partial_payment_renewals: stats?.partial_payment_renewals || 0,
        pending_renewals: stats?.pending_renewals || 0,
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('renewals.index'), { search, status, payment_status: paymentStatus }, { preserveState: true });
    };

    const handleDelete = (id, deceasedName) => {
        if (confirm(`Are you sure you want to delete the renewal record for ${deceasedName}?`)) {
            router.delete(route('renewals.destroy', id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            expired: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        const badges = {
            paid: 'bg-green-100 text-green-800',
            partial: 'bg-yellow-100 text-yellow-800',
            pending: 'bg-gray-100 text-gray-800',
            overdue: 'bg-red-100 text-red-800',
        };
        return badges[paymentStatus] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusLabel = (paymentStatus) => {
        const labels = {
            paid: 'Paid',
            partial: 'Partial',
            pending: 'Pending',
            overdue: 'Overdue',
        };
        return labels[paymentStatus] || 'Unknown';
    };

    const isExpired = (nextRenewalDate) => {
        return new Date(nextRenewalDate) < new Date();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Renewal Records" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">RENEWAL RECORDS</h2>
                        <p className="text-gray-600 mt-1">Track renewals and upcoming due dates (₱5,000 for 5 years)</p>
                    </div>
                    <Link
                        href={route('payments.create')}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Record Renewal Payment
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-blue-700 uppercase">Total Renewals</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">{safeStats.total_renewals}</p>
                            </div>
                            <CheckCircleIcon className="h-10 w-10 text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-2 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-green-700 uppercase">Fully Paid Renewals</p>
                                <p className="text-2xl font-bold text-green-900 mt-1">{safeStats.fully_paid_renewals}</p>
                            </div>
                            <CheckCircleIcon className="h-10 w-10 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-2 border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-orange-700 uppercase">Due Soon (2 Months)</p>
                                <p className="text-2xl font-bold text-orange-900 mt-1">{safeStats.due_soon}</p>
                            </div>
                            <ClockIcon className="h-10 w-10 text-orange-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-2 border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-red-700 uppercase">Overdue</p>
                                <p className="text-2xl font-bold text-red-900 mt-1">{safeStats.overdue}</p>
                            </div>
                            <ExclamationTriangleIcon className="h-10 w-10 text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Financial Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Total Collected</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    ₱{safeStats.total_renewal_amount.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">From renewal payments</p>
                            </div>
                            <BanknotesIcon className="h-8 w-8 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Total Balance</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    ₱{safeStats.total_balance.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Outstanding amounts</p>
                            </div>
                            <ExclamationTriangleIcon className="h-8 w-8 text-orange-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Partial Payments</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">{safeStats.partial_payment_renewals}</p>
                                <p className="text-xs text-gray-500 mt-1">With balance remaining</p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-yellow-400" />
                        </div>
                    </div>
                </div>

                {/* Needs Renewal Section - Keep your existing code */}
                {needsRenewal && needsRenewal.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-300">
                        {/* ... your existing needs renewal code ... */}
                    </div>
                )}

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by deceased name or tomb number..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="pending">Pending</option>
                        </select>
                        <select
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Payment Status</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partial</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                        {(search || status || paymentStatus) && (
                            <Link
                                href={route('renewals.index')}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Clear
                            </Link>
                        )}
                    </form>
                </div>

                {/* All Renewal Records Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-200 to-cyan-200 px-6 py-4">
                        <h3 className="text-lg font-bold text-gray-800">All Renewal Records</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Deceased Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Tomb Number</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Renewal Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Next Renewal</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Payment Info</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Balance</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {renewals.data.length > 0 ? (
                                    renewals.data.map((renewal) => (
                                        <tr key={renewal.id} className={`hover:bg-blue-50 transition ${isExpired(renewal.next_renewal_date) ? 'bg-red-50' : ''}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {renewal.deceased_record.fullname}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {renewal.deceased_record.tomb_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {new Date(renewal.renewal_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <span className={isExpired(renewal.next_renewal_date) ? 'text-red-600 font-bold' : ''}>
                                                    {new Date(renewal.next_renewal_date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs">
                                                    <div className="text-gray-600">
                                                        Fee: <span className="font-semibold text-gray-900">
                                                            ₱{parseFloat(renewal.renewal_fee || 5000).toLocaleString('en-US', { 
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2 
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-600">
                                                        Paid: <span className="font-semibold text-green-600">
                                                            ₱{parseFloat(renewal.amount_paid || 0).toLocaleString('en-US', { 
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2 
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-bold ${(renewal.balance || 5000) === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                                    ₱{parseFloat(renewal.balance || 5000).toLocaleString('en-US', { 
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2 
                                                    })}
                                                </span>
                                                {(renewal.is_fully_paid || (renewal.balance || 5000) === 0) && (
                                                    <div className="text-xs text-green-600 font-bold mt-1">✓ FULLY PAID</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(renewal.status)}`}>
                                                    {renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1)}
                                                </span>
                                                {renewal.payment_status && (
                                                    <div className="mt-1">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getPaymentStatusBadge(renewal.payment_status)}`}>
                                                            {getPaymentStatusLabel(renewal.payment_status)}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => router.visit(route('renewals.edit', renewal.id))}
                                                        className="flex items-center px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(renewal.id, renewal.deceased_record.fullname)}
                                                        className="flex items-center px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-lg font-semibold">No renewal records found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {renewals.data.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}