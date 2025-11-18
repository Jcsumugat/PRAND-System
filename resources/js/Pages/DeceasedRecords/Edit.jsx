import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ deceased }) {
    const [values, setValues] = useState({
        fullname: deceased.fullname || '',
        birthday: deceased.birthday || '',
        date_of_death: deceased.date_of_death || '',
        tomb_number: deceased.tomb_number || '',
        tomb_location: deceased.tomb_location || '',
        payment_status: deceased.payment_status || 'pending',
        next_of_kin_name: deceased.next_of_kin_name || '',
        next_of_kin_relationship: deceased.next_of_kin_relationship || '',
        contact_number: deceased.contact_number || '',
        email: deceased.email || '',
        address: deceased.address || '',
        payment_due_date: deceased.payment_due_date || '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.put(route('deceased.update', deceased.id), values, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Deceased Record" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={route('deceased.index')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">EDIT DECEASED RECORD</h2>
                        <p className="text-gray-600 mt-1">Update the information for {deceased.fullname}</p>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-8">
                    {/* Deceased Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                            Deceased Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={values.fullname}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.fullname ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.fullname && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="birthday" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Birthday <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    value={values.birthday}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.birthday ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.birthday && (
                                    <p className="mt-1 text-sm text-red-600">{errors.birthday}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="date_of_death" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Date of Death <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date_of_death"
                                    name="date_of_death"
                                    value={values.date_of_death}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.date_of_death ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.date_of_death && (
                                    <p className="mt-1 text-sm text-red-600">{errors.date_of_death}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="payment_status" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Payment Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="payment_status"
                                    name="payment_status"
                                    value={values.payment_status}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.payment_status ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                                {errors.payment_status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.payment_status}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tomb Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                            Tomb Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="tomb_number" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tomb Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="tomb_number"
                                    name="tomb_number"
                                    value={values.tomb_number}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.tomb_number ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.tomb_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tomb_number}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="tomb_location" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tomb Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="tomb_location"
                                    name="tomb_location"
                                    value={values.tomb_location}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.tomb_location ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.tomb_location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tomb_location}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Next of Kin Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                            Next of Kin Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="next_of_kin_name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="next_of_kin_name"
                                    name="next_of_kin_name"
                                    value={values.next_of_kin_name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.next_of_kin_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.next_of_kin_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.next_of_kin_name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="next_of_kin_relationship" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Relationship
                                </label>
                                <input
                                    type="text"
                                    id="next_of_kin_relationship"
                                    name="next_of_kin_relationship"
                                    value={values.next_of_kin_relationship}
                                    onChange={handleChange}
                                    placeholder="e.g., Son, Daughter, Spouse"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.next_of_kin_relationship ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.next_of_kin_relationship && (
                                    <p className="mt-1 text-sm text-red-600">{errors.next_of_kin_relationship}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="contact_number" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="contact_number"
                                    name="contact_number"
                                    value={values.contact_number}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.contact_number ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.contact_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                            Payment Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="payment_due_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Payment Due Date
                                </label>
                                <input
                                    type="date"
                                    id="payment_due_date"
                                    name="payment_due_date"
                                    value={values.payment_due_date}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.payment_due_date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.payment_due_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.payment_due_date}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Link
                            href={route('deceased.index')}
                            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg ${
                                processing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {processing ? 'Updating...' : 'Update Record'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}