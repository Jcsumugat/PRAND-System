import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Edit({ deceased }) {
    // Format dates from database (YYYY-MM-DD format)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        // If it's already in YYYY-MM-DD format, return as is
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
        // Otherwise, parse and format
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const [values, setValues] = useState({
        fullname: deceased.fullname || "",
        birthday: formatDate(deceased.birthday) || "",
        date_of_death: formatDate(deceased.date_of_death) || "",
        date_of_burial: formatDate(deceased.date_of_burial) || "",
        tomb_number: deceased.tomb_number || "",
        tomb_location: deceased.tomb_location || "",
        payment_status: deceased.payment_status || "partial",
        next_of_kin_name: deceased.next_of_kin_name || "",
        next_of_kin_relationship: deceased.next_of_kin_relationship || "",
        contact_number: deceased.contact_number || "",
        email: deceased.email || "",
        address: deceased.address || "",
        payment_due_date: formatDate(deceased.payment_due_date) || "",
        total_amount_due: deceased.total_amount_due || "",
        amount_paid: deceased.amount_paid || "",
        balance: deceased.balance || "",
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Calculate payment due date whenever date_of_burial changes
    useEffect(() => {
        if (values.date_of_burial) {
            const burialDate = new Date(values.date_of_burial);
            const dueDate = new Date(burialDate.setFullYear(burialDate.getFullYear() + 5));
            setValues(prev => ({
                ...prev,
                payment_due_date: dueDate.toISOString().split('T')[0]
            }));
        }
    }, [values.date_of_burial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.put(route("deceased.update", deceased.id), values, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    // Format currency for display
    const formatCurrency = (amount) => {
        if (!amount) return "₱0.00";
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    // Calculate days until due date or days overdue
    const getDueDateStatus = () => {
        if (!values.payment_due_date) return null;
        const today = new Date();
        const dueDate = new Date(values.payment_due_date);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return {
                status: 'overdue',
                days: Math.abs(diffDays),
                message: `Overdue by ${Math.abs(diffDays)} days`
            };
        } else if (diffDays <= 60) {
            return {
                status: 'approaching',
                days: diffDays,
                message: `Due in ${diffDays} days`
            };
        }
        return {
            status: 'normal',
            days: diffDays,
            message: `Due in ${diffDays} days`
        };
    };

    const dueDateStatus = getDueDateStatus();

    return (
        <AuthenticatedLayout>
            <Head title="Edit Deceased Record" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={route("deceased.index")}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            EDIT DECEASED RECORD
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Update the information for {deceased.fullname}
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-lg p-6 space-y-8"
                >
                    {/* Deceased Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                            Deceased Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="fullname"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Full Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={values.fullname}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.fullname
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.fullname && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.fullname}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="birthday"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Birthday{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    value={values.birthday}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.birthday
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.birthday && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.birthday}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="date_of_death"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Date of Death{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date_of_death"
                                    name="date_of_death"
                                    value={values.date_of_death}
                                    onChange={handleChange}
                                    min={values.birthday || ""}
                                    max={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.date_of_death
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.date_of_death && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.date_of_death}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="date_of_burial"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Date of Burial{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="date_of_burial"
                                    name="date_of_burial"
                                    value={values.date_of_burial}
                                    onChange={handleChange}
                                    min={values.date_of_death || ""}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.date_of_burial
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.date_of_burial && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.date_of_burial}
                                    </p>
                                )}
                                {values.date_of_burial && (
                                    <p className="text-xs text-purple-600 mt-1">
                                        📅 Coverage will expire on:{" "}
                                        {new Date(
                                            new Date(
                                                values.date_of_burial
                                            ).setFullYear(
                                                new Date(
                                                    values.date_of_burial
                                                ).getFullYear() + 5
                                            )
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "2-digit",
                                            year: "numeric",
                                        })}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="payment_status"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Payment Status{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="payment_status"
                                    name="payment_status"
                                    value={values.payment_status}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.payment_status
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                >
                                    <option value="partial">Partial</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                                {errors.payment_status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.payment_status}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Current status: <span className={`font-semibold ${
                                        values.payment_status === 'paid' ? 'text-green-600' :
                                        values.payment_status === 'partial' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>{values.payment_status.toUpperCase()}</span>
                                </p>
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
                                <label
                                    htmlFor="tomb_number"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Tomb Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="tomb_number"
                                    name="tomb_number"
                                    value={values.tomb_number}
                                    onChange={handleChange}
                                    placeholder="e.g., T-001"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.tomb_number
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.tomb_number && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.tomb_number}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="tomb_location"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Tomb Location{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="tomb_location"
                                    name="tomb_location"
                                    value={values.tomb_location}
                                    onChange={handleChange}
                                    placeholder="e.g., Section A, Row 5"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.tomb_location
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.tomb_location && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.tomb_location}
                                    </p>
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
                                <label
                                    htmlFor="next_of_kin_name"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="next_of_kin_name"
                                    name="next_of_kin_name"
                                    value={values.next_of_kin_name}
                                    onChange={handleChange}
                                    placeholder="Full name of next of kin"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.next_of_kin_name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.next_of_kin_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.next_of_kin_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="next_of_kin_relationship"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
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
                                        errors.next_of_kin_relationship
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.next_of_kin_relationship && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.next_of_kin_relationship}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="contact_number"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Contact Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="contact_number"
                                    name="contact_number"
                                    value={values.contact_number}
                                    onChange={handleChange}
                                    placeholder="09123456789"
                                    pattern="[0-9]{11}"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.contact_number
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {errors.contact_number && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.contact_number}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Format: 11-digit mobile number (09XXXXXXXXX)
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Complete address of next of kin"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                        errors.address
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Information Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                            Payment Information
                        </h3>
                        
                        {/* Payment Due Date - READ ONLY */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                        Payment Due Date (Auto-calculated)
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-blue-700 mb-1">
                                                Due Date
                                            </label>
                                            <div className="bg-white border border-blue-300 rounded-lg px-4 py-2">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {values.payment_due_date 
                                                        ? new Date(values.payment_due_date).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "2-digit",
                                                            year: "numeric",
                                                        })
                                                        : "Not set"}
                                                </p>
                                            </div>
                                        </div>
                                        {dueDateStatus && (
                                            <div>
                                                <label className="block text-xs font-medium text-blue-700 mb-1">
                                                    Status
                                                </label>
                                                <div className={`rounded-lg px-4 py-2 ${
                                                    dueDateStatus.status === 'overdue' 
                                                        ? 'bg-red-100 border border-red-300' 
                                                        : dueDateStatus.status === 'approaching'
                                                        ? 'bg-yellow-100 border border-yellow-300'
                                                        : 'bg-green-100 border border-green-300'
                                                }`}>
                                                    <p className={`text-sm font-semibold ${
                                                        dueDateStatus.status === 'overdue' 
                                                            ? 'text-red-900' 
                                                            : dueDateStatus.status === 'approaching'
                                                            ? 'text-yellow-900'
                                                            : 'text-green-900'
                                                    }`}>
                                                        {dueDateStatus.message}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-blue-700 mt-2">
                                        📌 Payment due date is automatically calculated as 5 years from the burial date and cannot be manually edited.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary - If available */}
                        {(deceased.total_amount_due || deceased.amount_paid || deceased.balance) && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Payment Summary (View Only)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Total Amount Due
                                        </label>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatCurrency(deceased.total_amount_due)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Amount Paid
                                        </label>
                                        <p className="text-lg font-bold text-green-600">
                                            {formatCurrency(deceased.amount_paid)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Balance
                                        </label>
                                        <p className={`text-lg font-bold ${
                                            deceased.balance > 0 ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                            {formatCurrency(deceased.balance)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-3">
                                    💡 To update payment amounts, please use the Payment Records section.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Link
                            href={route("deceased.index")}
                            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg ${
                                processing
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {processing ? "Updating..." : "Update Record"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}