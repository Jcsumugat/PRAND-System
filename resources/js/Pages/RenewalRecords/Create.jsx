import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Create({ deceasedRecords = [], selectedDeceased = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        deceased_record_id: selectedDeceased?.id || '',
        renewal_date: new Date().toISOString().split('T')[0],
        next_renewal_date: '',
        renewal_fee: '',
        status: 'active',
        remarks: '',
    });

    const [searchQuery, setSearchQuery] = useState(selectedDeceased?.fullname || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(selectedDeceased || null);

    // Filter deceased records based on search query
    const filteredRecords = deceasedRecords.filter(record => {
        const query = searchQuery.toLowerCase();
        return (
            record.fullname?.toLowerCase().includes(query) ||
            record.tomb_number?.toLowerCase().includes(query) ||
            record.payment_status?.toLowerCase().includes(query)
        );
    });

    const handleSelectRecord = (record) => {
        setSelectedRecord(record);
        setData('deceased_record_id', record.id);
        setSearchQuery(record.fullname);
        setShowDropdown(false);
    };

    const handleClearSelection = () => {
        setSelectedRecord(null);
        setData('deceased_record_id', '');
        setSearchQuery('');
        setShowDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.search-dropdown-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('renewals.store'), {
            onSuccess: () => reset(),
        });
    };

    const calculateNextRenewalDate = () => {
        if (data.renewal_date) {
            const date = new Date(data.renewal_date);
            date.setFullYear(date.getFullYear() + 1);
            return date.toISOString().split('T')[0];
        }
        return '';
    };

    const handleRenewalDateChange = (value) => {
        setData('renewal_date', value);
        const date = new Date(value);
        date.setFullYear(date.getFullYear() + 1);
        setData('next_renewal_date', date.toISOString().split('T')[0]);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Process Renewal" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">PROCESS RENEWAL</h2>
                    <p className="text-gray-600 mt-1">Record a renewal transaction for deceased</p>
                </div>

                {/* Form Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Deceased Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
                                DECEASED INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Deceased Record Search */}
                                <div className="md:col-span-2 search-dropdown-container">
                                    <InputLabel htmlFor="deceased_search" value="Search Deceased *" className="text-gray-700 font-semibold" />
                                    <div className="relative mt-1">
                                        <div className="relative">
                                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                id="deceased_search"
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setShowDropdown(true);
                                                }}
                                                onFocus={() => setShowDropdown(true)}
                                                className="block w-full pl-10 pr-10 py-2 bg-blue-50 border border-blue-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Search by name, tomb number, or status..."
                                                autoComplete="off"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearSelection}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Dropdown Results */}
                                        {showDropdown && searchQuery && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                                {filteredRecords.length > 0 ? (
                                                    filteredRecords.map((record) => (
                                                        <button
                                                            key={record.id}
                                                            type="button"
                                                            onClick={() => handleSelectRecord(record)}
                                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">{record.fullname}</p>
                                                                    <p className="text-sm text-gray-600">Tomb: {record.tomb_number}</p>
                                                                </div>
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    record.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                                    record.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {record.payment_status}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-gray-500 text-center">
                                                        No records found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <InputError message={errors.deceased_record_id} className="mt-2" />
                                    <p className="mt-1 text-xs text-gray-600">
                                        Start typing to search for deceased records
                                    </p>
                                </div>

                                {/* Display Selected Deceased Info */}
                                {selectedRecord && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Deceased Name
                                            </label>
                                            <p className="text-gray-900 font-medium">{selectedRecord.fullname}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tomb Number
                                            </label>
                                            <p className="text-gray-900 font-medium">{selectedRecord.tomb_number}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tomb Location
                                            </label>
                                            <p className="text-gray-900 font-medium">{selectedRecord.tomb_location || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Payor
                                            </label>
                                            <p className="text-gray-900 font-medium">{selectedRecord.next_of_kin_name || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Renewal Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
                                RENEWAL DETAILS
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Renewal Date */}
                                <div>
                                    <InputLabel htmlFor="renewal_date" value="Renewal Date *" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="renewal_date"
                                        type="date"
                                        value={data.renewal_date}
                                        className="mt-1 block w-full bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => handleRenewalDateChange(e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.renewal_date} className="mt-2" />
                                </div>

                                {/* Next Renewal Date (Auto-calculated) */}
                                <div>
                                    <InputLabel htmlFor="next_renewal_date" value="Next Renewal Date *" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="next_renewal_date"
                                        type="date"
                                        value={data.next_renewal_date}
                                        className="mt-1 block w-full bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('next_renewal_date', e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-blue-600 mt-1">Auto-calculated to 1 year from renewal date</p>
                                    <InputError message={errors.next_renewal_date} className="mt-2" />
                                </div>

                                {/* Renewal Fee */}
                                <div>
                                    <InputLabel htmlFor="renewal_fee" value="Renewal Fee (₱) *" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="renewal_fee"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.renewal_fee}
                                        className="mt-1 block w-full bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                        onChange={(e) => setData('renewal_fee', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    <InputError message={errors.renewal_fee} className="mt-2" />
                                </div>

                                {/* Status */}
                                <div>
                                    <InputLabel htmlFor="status" value="Renewal Status *" className="text-gray-700 font-semibold" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        className="mt-1 block w-full bg-blue-50 border border-blue-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                {/* Remarks */}
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="remarks" value="Remarks (Optional)" className="text-gray-700 font-semibold" />
                                    <textarea
                                        id="remarks"
                                        value={data.remarks}
                                        className="mt-1 block w-full bg-blue-50 border border-blue-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        rows="3"
                                        placeholder="Add any additional notes or remarks..."
                                    />
                                    <InputError message={errors.remarks} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Renewal Summary */}
                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-6 border-2 border-blue-300">
                            <h4 className="text-lg font-semibold text-blue-900 mb-4">Renewal Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Renewal Fee</p>
                                    <p className="text-2xl font-bold text-blue-900 mt-1">
                                        ₱{data.renewal_fee ? parseFloat(data.renewal_fee).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Renewal Date</p>
                                    <p className="text-sm font-bold text-blue-900 mt-1">
                                        {data.renewal_date ? new Date(data.renewal_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Next Renewal</p>
                                    <p className="text-sm font-bold text-blue-900 mt-1">
                                        {data.next_renewal_date ? new Date(data.next_renewal_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Status</p>
                                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full mt-1 ${
                                        data.status === 'active' ? 'bg-green-100 text-green-800' :
                                        data.status === 'expired' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition shadow-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing Renewal...' : 'Process Renewal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}