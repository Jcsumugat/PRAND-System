import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ payment, deceasedRecords = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        deceased_record_id: payment.deceased_record_id || '',
        amount: payment.amount || '',
        payment_date: payment.payment_date || new Date().toISOString().split('T')[0],
        payment_type: payment.payment_type || 'initial',
        payment_method: payment.payment_method || 'cash',
        official_receipt_number: payment.official_receipt_number || '',
        remarks: payment.remarks || '',
    });

    // Set the deceased record from payment (non-editable)
    const deceasedRecord = payment.deceased || null;

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('payments.update', payment.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Payment" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-200 to-indigo-200 rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">EDIT PAYMENT</h2>
                            <p className="text-gray-600 mt-1">Update payment transaction details</p>
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Payment Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
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
                                        className="mt-1 block w-full bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                                        className="mt-1 block w-full bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                                        className="mt-1 block w-full bg-blue-50 border border-blue-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                        onChange={(e) => setData('payment_type', e.target.value)}
                                        required
                                    >
                                        <option value="initial">Initial Payment</option>
                                        <option value="renewal">Renewal Payment</option>
                                        <option value="penalty">Penalty Payment</option>
                                    </select>
                                    <InputError message={errors.payment_type} className="mt-2" />
                                </div>

                                {/* Payment Method - Cash Only (Read-only) */}
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

                                {/* Official Receipt Number */}
                                <div>
                                    <InputLabel htmlFor="official_receipt_number" value="Official Receipt Number (Optional)" className="text-gray-700 font-semibold" />
                                    <TextInput
                                        id="official_receipt_number"
                                        type="text"
                                        value={data.official_receipt_number}
                                        className="mt-1 block w-full bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                                        className="mt-1 block w-full bg-blue-50 border border-blue-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                        onChange={(e) => setData('remarks', e.target.value)}
                                        rows="3"
                                        placeholder="Add any additional notes or remarks..."
                                    />
                                    <InputError message={errors.remarks} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-6 border-2 border-blue-300">
                            <h4 className="text-lg font-semibold text-blue-900 mb-4">Payment Summary</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Amount</p>
                                    <p className="text-2xl font-bold text-blue-900 mt-1">
                                        ₱{data.amount ? parseFloat(data.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Type</p>
                                    <p className="text-sm font-bold text-blue-900 mt-1 capitalize">
                                        {data.payment_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Method</p>
                                    <p className="text-sm font-bold text-blue-900 mt-1">Cash</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-700 font-semibold uppercase">Date</p>
                                    <p className="text-sm font-bold text-blue-900 mt-1">
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
                                disabled={processing || !deceasedRecord}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Updating Payment...' : 'Update Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
