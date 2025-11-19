import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Index({ deceased, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [viewModal, setViewModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [expiringRecordIds, setExpiringRecordIds] = useState(new Set());
    const [expiringDetailsModal, setExpiringDetailsModal] = useState(false);
    const [selectedExpiringRecord, setSelectedExpiringRecord] = useState(null);

    // Fetch expiring records on component mount
    useEffect(() => {
        const fetchExpiringRecords = async () => {
            try {
                const csrfToken = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';
                
                const response = await fetch('/api/expiring-records-list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    const allExpiring = [...(data.expiring_soon || []), ...(data.overdue || [])];
                    const ids = new Set();
                    
                    allExpiring.forEach(record => {
                        ids.add(record.id);
                    });
                    
                    setExpiringRecordIds(ids);
                }
            } catch (error) {
                console.error('Failed to fetch expiring records:', error);
            }
        };

        fetchExpiringRecords();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('deceased.index'), { search, status }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the record for ${name}?`)) {
            router.delete(route('deceased.destroy', id));
        }
    };

    const handleView = (record, index) => {
        setSelectedRecord({ ...record, recordNumber: index + 1 });
        setViewModal(true);
    };

    const closeModal = () => {
        setViewModal(false);
        setSelectedRecord(null);
    };

    const handleExpiringRecordClick = (record) => {
        setSelectedExpiringRecord(record);
        setExpiringDetailsModal(true);
    };

    const closeExpiringModal = () => {
        setExpiringDetailsModal(false);
        setSelectedExpiringRecord(null);
    };

    const getStatusBadge = (status) => {
        const badges = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            overdue: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const isRecordExpiring = (recordId) => {
        return expiringRecordIds.has(recordId);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Deceased Records" />

            <div className="space-y-6">
                {/* Header with Add Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">DECEASED RECORDS</h2>
                        <p className="text-gray-600 mt-1">View and manage all deceased records</p>
                    </div>
                    <Link
                        href={route('deceased.create')}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                    >
                        + Add New Record
                    </Link>
                </div>

                {/* Search and Filter Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, tomb number, or location..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                        {(search || status) && (
                            <Link
                                href={route('deceased.index')}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Clear
                            </Link>
                        )}
                    </form>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-pink-200 to-purple-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Payor
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Birthday
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Date of Death
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Tomb Number
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Tomb Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {deceased.data.length > 0 ? (
                                    deceased.data.map((record, index) => {
                                        const isExpiring = isRecordExpiring(record.id);
                                        return (
                                            <tr 
                                                key={record.id} 
                                                onClick={() => {
                                                    if (isExpiring) {
                                                        handleExpiringRecordClick(record);
                                                    }
                                                }}
                                                className={`transition-all ${
                                                    isExpiring 
                                                        ? 'bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-red-500 shadow-md hover:shadow-lg cursor-pointer' 
                                                        : 'hover:bg-pink-50 cursor-default'
                                                }`}
                                            >
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${isExpiring ? 'text-red-600' : 'text-purple-600'}`}>
                                                    {isExpiring && <span className="mr-1">⚠️</span>}
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">{record.fullname}</div>
                                                        <div className="text-sm text-gray-500">{record.next_of_kin_name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {new Date(record.birthday).toLocaleDateString('en-US', {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {new Date(record.date_of_death).toLocaleDateString('en-US', {
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {record.tomb_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {record.tomb_location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(record.payment_status)}`}>
                                                        {record.payment_status.charAt(0).toUpperCase() + record.payment_status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <div className="flex justify-center space-x-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleView(record, index);
                                                            }}
                                                            className="flex items-center px-3 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                                                            title="View Details"
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                        </button>
                                                        <Link
                                                            href={route('deceased.edit', record.id)}
                                                            className="flex items-center px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                                                            title="Edit"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(record.id, record.fullname);
                                                            }}
                                                            className="flex items-center px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                                                            title="Delete"
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-lg font-semibold">No records found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {deceased.data.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-semibold">{deceased.from}</span> to{' '}
                                    <span className="font-semibold">{deceased.to}</span> of{' '}
                                    <span className="font-semibold">{deceased.total}</span> results
                                </div>
                                <div className="flex space-x-2">
                                    {deceased.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                                                link.active
                                                    ? 'bg-purple-600 text-white'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-300'
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

            {/* Expiring Record Modal */}
            {expiringDetailsModal && selectedExpiringRecord && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-bold">⚠️ Payment Renewal Required</h3>
                                <p className="text-orange-100 mt-1">Action needed for cemetery plot</p>
                            </div>
                            <button
                                onClick={closeExpiringModal}
                                className="p-2 hover:bg-white/20 rounded-lg transition"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Alert Section */}
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                                <p className="text-orange-900 font-semibold">
                                    ⏱️ This record expires soon and requires payment renewal
                                </p>
                                <p className="text-orange-800 mt-2 text-sm">
                                    The cemetery plot lease requires immediate renewal to maintain active status.
                                </p>
                            </div>

                            {/* Deceased Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-3">Deceased Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-xs text-gray-600 font-semibold">Full Name</p>
                                        <p className="text-gray-900 font-medium mt-1">{selectedExpiringRecord.fullname}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-xs text-gray-600 font-semibold">Tomb Number</p>
                                        <p className="text-gray-900 font-medium mt-1">{selectedExpiringRecord.tomb_number}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded md:col-span-2">
                                        <p className="text-xs text-gray-600 font-semibold">Payment Due Date</p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {new Date(selectedExpiringRecord.payment_due_date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Required */}
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                                <p className="text-blue-900 text-sm">
                                    <span className="font-semibold">Next Step:</span> Send a notice to the payor requesting payment renewal. The renewal fee is ₱5,000 for 5 years.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                            <button
                                onClick={closeExpiringModal}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                            <Link
                                href={route('notices.create', { deceased_id: selectedExpiringRecord.id })}
                                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
                            >
                                📧 Send Notice
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewModal && selectedRecord && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                            <h3 className="text-2xl font-bold">Record #<span className="text-pink-200">{selectedRecord.recordNumber}</span> Details</h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-white/20 rounded-lg transition"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Deceased Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-purple-200 pb-2">
                                    Deceased Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                        <p className="text-gray-900 mt-1">{selectedRecord.fullname}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Birthday</label>
                                        <p className="text-gray-900 mt-1">
                                            {new Date(selectedRecord.birthday).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Date of Death</label>
                                        <p className="text-gray-900 mt-1">
                                            {new Date(selectedRecord.date_of_death).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Payment Status</label>
                                        <p className="mt-1">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedRecord.payment_status)}`}>
                                                {selectedRecord.payment_status.charAt(0).toUpperCase() + selectedRecord.payment_status.slice(1)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tomb Information */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-purple-200 pb-2">
                                    Tomb Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Tomb Number</label>
                                        <p className="text-gray-900 mt-1 font-medium">{selectedRecord.tomb_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Tomb Location</label>
                                        <p className="text-gray-900 mt-1">{selectedRecord.tomb_location}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payor */}
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-purple-200 pb-2">
                                    Payor
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Name</label>
                                        <p className="text-gray-900 mt-1">{selectedRecord.next_of_kin_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Relationship</label>
                                        <p className="text-gray-900 mt-1">{selectedRecord.next_of_kin_relationship || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Contact Number</label>
                                        <p className="text-gray-900 mt-1">{selectedRecord.contact_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Email</label>
                                        <p className="text-gray-900 mt-1">{selectedRecord.email || 'N/A'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-600">Address</label>
                                        <p className="text-gray-900 mt-1">{selectedRecord.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            {selectedRecord.payment_due_date && (
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-purple-200 pb-2">
                                        Payment Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Payment Due Date</label>
                                            <p className="text-gray-900 mt-1">
                                                {new Date(selectedRecord.payment_due_date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 sticky bottom-0">
                            <button
                                onClick={closeModal}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Close
                            </button>
                            <Link
                                href={route('deceased.edit', selectedRecord.id)}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                Edit Record
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}