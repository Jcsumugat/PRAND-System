import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeftIcon, MagnifyingGlassIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Create({ deceasedRecords = [], selectedDeceased = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        deceased_record_id: selectedDeceased?.id || '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_type: 'initial',
        payment_for: selectedDeceased?.balance > 0 ? 'balance' : 'initial',
        payment_method: 'cash',
        official_receipt_number: '',
        remarks: '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(selectedDeceased);

    const filteredRecords = deceasedRecords.filter(record => {
        const searchLower = searchQuery.toLowerCase();
        return (
            record.fullname.toLowerCase().includes(searchLower) ||
            record.tomb_number.toLowerCase().includes(searchLower) ||
            record.payment_status.toLowerCase().includes(searchLower)
        );
    });

    const handleSelectRecord = (record) => {
        setSelectedRecord(record);
        setData('deceased_record_id', record.id);
        
        if (record.balance > 0) {
            setData('payment_for', 'balance');
            setData('payment_type', 'initial');
        } else if (record.is_fully_paid) {
            setData('payment_for', 'renewal');
            setData('payment_type', 'renewal');
        }
        
        setSearchQuery(record.fullname);
        setShowDropdown(false);
    };

    const handleClearSelection = () => {
        setSelectedRecord(null);
        setData('deceased_record_id', '');
        setSearchQuery('');
        setShowDropdown(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'), {
            onSuccess: () => {
                reset();
                setSelectedRecord(null);
                setSearchQuery('');
            },
        });
    };

    const remainingBalance = selectedRecord?.balance || 0;
    const amountPaid = selectedRecord?.amount_paid || 0;
    const totalDue = selectedRecord?.total_amount_due || 5000;
    const paymentProgress = totalDue > 0 ? (amountPaid / totalDue) * 100 : 0;

    return (
        <AuthenticatedLayout>
            <Head title="Record Payment" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">RECORD PAYMENT</h2>
                            <p className="text-gray-600 mt-1">Process a new payment transaction</p>
                        </div>
                        <Link
                            href="/payments"
                            className="flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition shadow-lg"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Back to Records
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
                                DECEASED INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
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
                                                className="block w-full pl-10 pr-10 py-2 bg-green-50 border border-green-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
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

                                        {showDropdown && searchQuery && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-green-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                                {filteredRecords.length > 0 ? (
                                                    filteredRecords.map((record) => (
                                                        <button
                                                            key={record.id}
                                                            type="button"
                                                            onClick={() => handleSelectRecord(record)}
                                                            className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">{record.fullname}</p>
                                                                    <p className="text-sm text-gray-600">Tomb: {record.tomb_number}</p>
                                                                    {record.balance > 0 && (
                                                                        <p className="text-xs text-orange-600 font-semibold mt-1">
                                                                            Balance: ₱{parseFloat(record.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    record.is_fully_paid ? 'bg-green-100 text-green-800' :
                                                                    record.amount_paid > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {record.is_fully_paid ? 'Fully Paid' : record.amount_paid > 0 ? 'Partial' : 'Pending'}
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

                                {selectedRecord && (
                                    <>
                                        <div className="md:col-span-2 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-semibold text-green-800 uppercase">Selected Record</h4>
                                                <button
                                                    type="button"
                                                    onClick={handleClearSelection}
                                                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                                                >
                                                    Clear Selection
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        Deceased Name
                                                    </label>
                                                    <p className="text-sm text-gray-900 font-medium">{selectedRecord.fullname}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        Tomb Number
                                                    </label>
                                                    <p className="text-sm text-gray-900 font-medium">{selectedRecord.tomb_number}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        Tomb Location
                                                    </label>
                                                    <p className="text-sm text-gray-900 font-medium">{selectedRecord.tomb_location}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                        Payment Status
                                                    </label>
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        selectedRecord.is_fully_paid ? 'bg-green-100 text-green-800' :
                                                        selectedRecord.amount_paid > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {selectedRecord.is_fully_paid ? 'Fully Paid' : selectedRecord.amount_paid > 0 ? 'Partial Payment' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {remainingBalance > 0 && (
                                            <div className="md:col-span-2 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 flex-shrink-0" />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-orange-900 mb-3">Balance Payment Required</h4>
                                                        
                                                        <div className="mb-3">
                                                            <div className="flex justify-between text-sm mb-1">
                                                                <span className="text-orange-800 font-semibold">Payment Progress</span>
                                                                <span className="text-orange-900 font-bold">{paymentProgress.toFixed(1)}%</span>
                                                            </div>
                                                            <div className="w-full bg-orange-200 rounded-full h-3">
                                                                <div 
                                                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-300"
                                                                    style={{ width: `${paymentProgress}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                                            <div className="bg-white rounded p-2">
                                                                <p className="text-xs text-gray-600">Total Due</p>
                                                                <p className="font-bold text-gray-900">₱{totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                                            </div>
                                                            <div className="bg-white rounded p-2">
                                                                <p className="text-xs text-gray-600">Paid</p>
                                                                <p className="font-bold text-green-700">₱{amountPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                                            </div>
                                                            <div className="bg-white rounded p-2">
                                                                <p className="text-xs text-gray-600">Balance</p>
                                                                <p className="font-bold text-orange-700">₱{remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-orange-800 mt-3">
                                                            ⚠️ Coverage will only be activated after full payment is received. No automatic due dates or penalties for partial payments - staff will determine any penalties if needed.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
                                PAYMENT DETAILS
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="amount" value="Amount (₱) *" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min={selectedRecord?.amount_paid === 0 ? "2500" : "0.01"}
                                        max={remainingBalance > 0 ? remainingBalance : undefined}
                                        value={data.amount}
                                        className="mt-1 block w-full bg-green-50 border-green-200 focus:border-green-500 focus:ring-green-500"
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    <InputError message={errors.amount} className="mt-2" />
                                    {remainingBalance > 0 && (
                                        <p className="mt-1 text-xs text-orange-600 font-semibold">
                                            {selectedRecord?.amount_paid === 0 
                                                ? `Min Down Payment: ₱2,500.00 (50%) | Max: ₱${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                                : `Min: ₱0.01 | Max: ₱${remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="payment_date" value="Payment Date *" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="payment_date"
                                        type="date"
                                        value={data.payment_date}
                                        className="mt-1 block w-full bg-green-50 border-green-200 focus:border-green-500 focus:ring-green-500"
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.payment_date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="payment_for" value="Payment For *" className="text-gray-700 font-semibold" />
                                    <select
                                        id="payment_for"
                                        value={data.payment_for}
                                        className="mt-1 block w-full bg-green-50 border border-green-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2"
                                        onChange={(e) => setData('payment_for', e.target.value)}
                                        required
                                        disabled={remainingBalance > 0}
                                    >
                                        {remainingBalance > 0 ? (
                                            <option value="balance">Balance Payment</option>
                                        ) : (
                                            <>
                                                <option value="initial">Initial Payment</option>
                                                <option value="renewal">Renewal Payment</option>
                                                <option value="penalty">Penalty Payment</option>
                                            </>
                                        )}
                                    </select>
                                    <InputError message={errors.payment_for} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="payment_type" value="Payment Type *" className="text-gray-700 font-semibold" />
                                    <select
                                        id="payment_type"
                                        value={data.payment_type}
                                        className="mt-1 block w-full bg-green-50 border border-green-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2"
                                        onChange={(e) => setData('payment_type', e.target.value)}
                                        required
                                    >
                                        <option value="initial">Initial Payment</option>
                                        <option value="renewal">Renewal Payment</option>
                                        <option value="penalty">Penalty Payment</option>
                                    </select>
                                    <InputError message={errors.payment_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="payment_method" value="Payment Method *" className="text-gray-700 font-semibold" />
                                    <div className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm px-3 py-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-900 font-medium">Cash</span>
                                            <span className="text-xs text-gray-500 italic">(Walk-in only)</span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-600">All payments must be made in person at the municipal office</p>
                                    <InputError message={errors.payment_method} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="official_receipt_number" value="Official Receipt Number (Optional)" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="official_receipt_number"
                                        type="text"
                                        value={data.official_receipt_number}
                                        className="mt-1 block w-full bg-green-50 border-green-200 focus:border-green-500 focus:ring-green-500"
                                        onChange={(e) => setData('official_receipt_number', e.target.value)}
                                        placeholder="e.g., OR-2025-0001"
                                    />
                                    <InputError message={errors.official_receipt_number} className="mt-2" />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="remarks" value="Remarks (Optional)" className="text-gray-700 font-semibold" />
                                    <textarea
                                        id="remarks"
                                        value={data.remarks}
                                        className="mt-1 block w-full bg-green-50 border border-green-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2"
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        rows="3"
                                        placeholder="Add any additional notes or remarks..."
                                    />
                                    <InputError message={errors.remarks} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6 border-2 border-green-300">
                            <h4 className="text-lg font-semibold text-green-900 mb-4">Payment Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-green-700 font-semibold uppercase">Amount</p>
                                    <p className="text-2xl font-bold text-green-900 mt-1">
                                        ₱{data.amount ? parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-700 font-semibold uppercase">Type</p>
                                    <p className="text-sm font-bold text-green-900 mt-1 capitalize">
                                        {data.payment_for}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-700 font-semibold uppercase">Method</p>
                                    <p className="text-sm font-bold text-green-900 mt-1">Cash</p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-700 font-semibold uppercase">Date</p>
                                    <p className="text-sm font-bold text-green-900 mt-1">
                                        {new Date(data.payment_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Link
                                href="/payments"
                                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || !selectedRecord}
                                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg disabled:bg-green-400 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Recording Payment...' : 'Record Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}