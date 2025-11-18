import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ renewal, deceasedRecords }) {
    const [formData, setFormData] = useState({
        deceased_record_id: renewal.deceased_record_id,
        renewal_date: renewal.renewal_date,
        next_renewal_date: renewal.next_renewal_date,
        renewal_fee: renewal.renewal_fee,
        status: renewal.status,
        remarks: renewal.remarks || '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.put(`/renewals/${renewal.id}`, formData, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Renewal Record" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit Renewal Record</h2>
                        <p className="text-gray-600 mt-1">Update renewal information</p>
                    </div>
                    <Link
                        href="/renewals"
                        className="flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to List
                    </Link>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Deceased Record (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deceased Person
                            </label>
                            <input
                                type="text"
                                value={deceasedRecords.find(d => d.id === formData.deceased_record_id)?.fullname || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
                            />
                            <p className="mt-1 text-sm text-gray-500">Cannot be changed after creation</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Renewal Date */}
                            <div>
                                <label htmlFor="renewal_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Renewal Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="renewal_date"
                                    name="renewal_date"
                                    value={formData.renewal_date}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.renewal_date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.renewal_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.renewal_date}</p>
                                )}
                            </div>

                            {/* Next Renewal Date */}
                            <div>
                                <label htmlFor="next_renewal_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Next Renewal Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="next_renewal_date"
                                    name="next_renewal_date"
                                    value={formData.next_renewal_date}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.next_renewal_date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.next_renewal_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.next_renewal_date}</p>
                                )}
                            </div>

                            {/* Renewal Fee */}
                            <div>
                                <label htmlFor="renewal_fee" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Renewal Fee (₱) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="renewal_fee"
                                    name="renewal_fee"
                                    value={formData.renewal_fee}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.renewal_fee ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.renewal_fee && (
                                    <p className="mt-1 text-sm text-red-600">{errors.renewal_fee}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.status ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="expired">Expired</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        {/* Remarks */}
                        <div>
                            <label htmlFor="remarks" className="block text-sm font-semibold text-gray-700 mb-2">
                                Remarks
                            </label>
                            <textarea
                                id="remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows="4"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.remarks ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter any additional remarks..."
                            ></textarea>
                            {errors.remarks && (
                                <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <Link
                                href="/renewals"
                                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-3 font-semibold rounded-lg transition shadow-lg ${
                                    processing
                                        ? 'bg-blue-400 text-white cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {processing ? 'Updating...' : 'Update Renewal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
