import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ deceasedRecords = [], selectedDeceased = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        deceased_record_id: selectedDeceased?.id || '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_type: 'initial',
        payment_method: 'cash',
        official_receipt_number: '',
        remarks: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payments.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Record Payment" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
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

                {/* Form Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Deceased Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
                                DECEASED INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Deceased Record Selection */}
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="deceased_record_id" value="Select Deceased *" className="text-gray-700 font-semibold" />
                                    <select
                                        id="deceased_record_id"
                                        value={data.deceased_record_id}
                                        className="mt-1 block w-full bg-green-50 border border-green-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2"
                                        onChange={(e) => setData('deceased_record_id', e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose a deceased record --</option>
                                        {deceasedRecords.map((record) => (
                                            <option key={record.id} value={record.id}>
                                                {record.fullname} (Tomb: {record.tomb_number}) - Status: {record.payment_status}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.deceased_record_id} className="mt-2" />
                                </div>

                                {/* Display Selected Deceased Info */}
                                {selectedDeceased && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Deceased Name
                                            </label>
                                            <p className="text-gray-900 font-medium">{selectedDeceased.fullname}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tomb Number
                                            </label>
                                            <p className="text-gray-900 font-medium">{selectedDeceased.tomb_number}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tomb Location
                                            </label>
                                            <p className="text-gray-900 font-medium">{selectedDeceased.tomb_location}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Payment Status
                                            </label>
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedDeceased.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                selectedDeceased.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {selectedDeceased.payment_status.charAt(0).toUpperCase() + selectedDeceased.payment_status.slice(1)}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Payment Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b pb-2">
                                PAYMENT DETAILS
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Amount */}
                                <div>
                                    <InputLabel htmlFor="amount" value="Amount (₱) *" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.amount}
                                        className="mt-1 block w-full bg-green-50 border-green-200 focus:border-green-500 focus:ring-green-500"
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    <InputError message={errors.amount} className="mt-2" />
                                </div>

                                {/* Payment Date */}
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

                                {/* Payment Type */}
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

                                {/* Payment Method */}
                                <div>
                                    <InputLabel htmlFor="payment_method" value="Payment Method *" className="text-gray-700 font-semibold" />
                                    <select
                                        id="payment_method"
                                        value={data.payment_method}
                                        className="mt-1 block w-full bg-green-50 border border-green-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 px-3 py-2"
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        required
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="gcash">GCash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="check">Check</option>
                                    </select>
                                    <InputError message={errors.payment_method} className="mt-2" />
                                </div>

                                {/* Official Receipt Number */}
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

                                {/* Remarks */}
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

                        {/* Payment Summary */}
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
                                        {data.payment_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-700 font-semibold uppercase">Method</p>
                                    <p className="text-sm font-bold text-green-900 mt-1 capitalize">
                                        {data.payment_method === 'gcash' ? 'GCash' :
                                            data.payment_method === 'bank_transfer' ? 'Bank Transfer' :
                                                data.payment_method}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-700 font-semibold uppercase">Date</p>
                                    <p className="text-sm font-bold text-green-900 mt-1">
                                        {new Date(data.payment_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: '2-digit',
                                            year: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <Link
                                href="/payments"
                                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
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
