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
    BanknotesIcon
} from '@heroicons/react/24/outline';

export default function Index({ renewals, filters, stats = {}, needsRenewal = [] }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [showNeedsRenewal, setShowNeedsRenewal] = useState(true);

    // Provide default values for stats
    const safeStats = {
        total_renewals: stats?.total_renewals || 0,
        active_renewals: stats?.active_renewals || 0,
        due_soon: stats?.due_soon || 0,
        overdue: stats?.overdue || 0,
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('renewals.index'), { search, status }, { preserveState: true });
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
                                <p className="text-2xl font-bold text-blue-900 mt-1">{stats.total_renewals}</p>
                            </div>
                            <CheckCircleIcon className="h-10 w-10 text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-2 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-green-700 uppercase">Active Renewals</p>
                                <p className="text-2xl font-bold text-green-900 mt-1">{stats.active_renewals}</p>
                            </div>
                            <CheckCircleIcon className="h-10 w-10 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-2 border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-orange-700 uppercase">Due Soon (2 Months)</p>
                                <p className="text-2xl font-bold text-orange-900 mt-1">{stats.due_soon}</p>
                            </div>
                            <ClockIcon className="h-10 w-10 text-orange-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-2 border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-red-700 uppercase">Overdue</p>
                                <p className="text-2xl font-bold text-red-900 mt-1">{stats.overdue}</p>
                            </div>
                            <ExclamationTriangleIcon className="h-10 w-10 text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Needs Renewal Section */}
                {needsRenewal && needsRenewal.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-300">
                        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-3" />
                                <h3 className="text-lg font-bold text-orange-900">
                                    Requires Renewal - Due or Nearly Due (Within 2 Months)
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowNeedsRenewal(!showNeedsRenewal)}
                                className="text-sm font-semibold text-orange-700 hover:text-orange-900"
                            >
                                {showNeedsRenewal ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        
                        {showNeedsRenewal && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-orange-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Deceased Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tomb</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Payor</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Due Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {needsRenewal.map((record) => (
                                            <tr 
                                                key={record.id} 
                                                className={`hover:bg-orange-50 transition ${record.is_overdue ? 'bg-red-50' : ''}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">{record.fullname}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <div>{record.tomb_number}</div>
                                                    <div className="text-xs text-gray-500">{record.tomb_location}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {record.next_of_kin_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {record.contact_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className={record.is_overdue ? 'text-red-600 font-bold' : 'text-gray-700'}>
                                                        {new Date(record.payment_due_date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Last payment: {record.last_payment_date ? new Date(record.last_payment_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {record.is_overdue ? (
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Overdue ({Math.abs(record.days_until_due)} days)
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                            Due in {record.days_until_due} days
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Link
                                                        href={`/payments/create?deceased_id=${record.id}`}
                                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        <BanknotesIcon className="h-4 w-4 mr-1" />
                                                        Pay Now
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                        {(search || status) && (
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Renewal Fee</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Processor</th>
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
                                                <span className="text-sm font-bold text-gray-900">₱{parseFloat(renewal.renewal_fee).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(renewal.status)}`}>
                                                    {renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {renewal.processor?.name || 'N/A'}
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
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
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

                    {/* Pagination */}
                    {renewals.data.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-semibold">{renewals.from}</span> to{' '}
                                    <span className="font-semibold">{renewals.to}</span> of{' '}
                                    <span className="font-semibold">{renewals.total}</span> results
                                </div>
                                <div className="flex space-x-2">
                                    {renewals.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            preserveState
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}