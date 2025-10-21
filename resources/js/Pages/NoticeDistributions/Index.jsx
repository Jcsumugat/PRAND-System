import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, EyeIcon, TrashIcon, MagnifyingGlassIcon, PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Index({ notices, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [type, setType] = useState(filters.type || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('notices.index'), { search, status, type }, { preserveState: true });
    };

    const handleDelete = (id, recipientName) => {
        if (confirm(`Are you sure you want to delete the notice for ${recipientName}?`)) {
            router.delete(route('notices.destroy', id));
        }
    };

    const handleResend = (id) => {
        if (confirm('Are you sure you want to resend this notice?')) {
            router.post(route('notices.resend', id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            sent: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
            delivered: 'bg-blue-100 text-blue-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getTypeBadge = (type) => {
        const badges = {
            payment_reminder: 'bg-purple-100 text-purple-800',
            renewal_notice: 'bg-indigo-100 text-indigo-800',
            overdue_notice: 'bg-orange-100 text-orange-800',
            general: 'bg-gray-100 text-gray-800',
        };
        return badges[type] || 'bg-gray-100 text-gray-800';
    };

    const getTypeLabel = (type) => {
        const labels = {
            payment_reminder: 'Payment Reminder',
            renewal_notice: 'Renewal Notice',
            overdue_notice: 'Overdue Notice',
            general: 'General',
        };
        return labels[type] || type;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notice Distribution" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">NOTICE DISTRIBUTION</h2>
                        <p className="text-gray-600 mt-1">Manage SMS and notification campaigns</p>
                    </div>
                    <Link
                        href={route('notices.create')}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Send Notice
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by recipient name or deceased..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="sent">Sent</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="payment_reminder">Payment Reminder</option>
                            <option value="renewal_notice">Renewal Notice</option>
                            <option value="overdue_notice">Overdue Notice</option>
                            <option value="general">General</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                        {(search || status || type) && (
                            <Link
                                href={route('notices.index')}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Clear
                            </Link>
                        )}
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-purple-200 to-pink-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Recipient</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Deceased</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Sent Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Attempts</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Sent By</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {notices.data.length > 0 ? (
                                    notices.data.map((notice) => (
                                        <tr key={notice.id} className="hover:bg-purple-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{notice.recipient_name}</div>
                                                <div className="text-sm text-gray-500">{notice.recipient_number}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {notice.deceased_record?.fullname || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(notice.notice_type)}`}>
                                                    {getTypeLabel(notice.notice_type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(notice.status)}`}>
                                                    {notice.status.charAt(0).toUpperCase() + notice.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {notice.sent_at ? new Date(notice.sent_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) : 'Not sent'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                <span className="font-semibold">{notice.retry_count || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {notice.sender?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        href={route('notices.show', notice.id)}
                                                        className="flex items-center px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                                        title="View"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Link>
                                                    {notice.status === 'failed' && (
                                                        <button
                                                            onClick={() => handleResend(notice.id)}
                                                            className="flex items-center px-3 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                                                            title="Resend"
                                                        >
                                                            <ArrowPathIcon className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(notice.id, notice.recipient_name)}
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                <p className="text-lg font-semibold">No notices found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {notices.data.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-semibold">{notices.from}</span> to{' '}
                                    <span className="font-semibold">{notices.to}</span> of{' '}
                                    <span className="font-semibold">{notices.total}</span> results
                                </div>
                                <div className="flex space-x-2">
                                    {notices.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition text-white ${
                                                link.active
                                                    ? 'bg-purple-600 hover:bg-purple-700'
                                                    : link.url
                                                    ? 'bg-purple-600 hover:bg-purple-700'
                                                    : 'bg-gray-400 cursor-not-allowed'
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
