import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Create({
    deceasedRecords = [],
    selectedDeceased = null,
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        deceased_record_id: selectedDeceased?.id || "",
        recipient_name: selectedDeceased?.next_of_kin_name || "",
        recipient_number: selectedDeceased?.contact_number || "",
        deceased_name: selectedDeceased?.fullname || "",
        tomb_number: selectedDeceased?.tomb_number || "",
        balance: selectedDeceased?.balance || 0,
        payment_due_date: selectedDeceased?.payment_due_date || "",
        total_amount_due: selectedDeceased?.total_amount_due || 0,
        message: "",
        notice_type: "general",
    });

    const [messageLength, setMessageLength] = useState(0);
    const [searchQuery, setSearchQuery] = useState(
        selectedDeceased?.fullname || ""
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const maxMessageLength = 500;

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    // Calculate days overdue
    const calculateDaysOverdue = (dueDate) => {
        if (!dueDate) return 0;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Filter deceased records based on search query
    const filteredRecords = deceasedRecords.filter((record) => {
        const query = searchQuery.toLowerCase();
        return (
            record.fullname?.toLowerCase().includes(query) ||
            record.tomb_number?.toLowerCase().includes(query) ||
            record.payment_status?.toLowerCase().includes(query)
        );
    });

    // Generate message templates based on selected data
    const generateTemplate = (type) => {
        const daysOverdue = calculateDaysOverdue(data.payment_due_date);
        const balance = parseFloat(data.balance || 0);
        const totalDue = parseFloat(data.total_amount_due || 0);
        
        const templates = {
            payment_reminder: `Dear ${data.recipient_name},

Payment reminder from PRAND - Municipality of Culasi.

Record: ${data.deceased_name}
Tomb: ${data.tomb_number}
Balance Due: ${formatCurrency(balance)}
Due Date: ${formatDate(data.payment_due_date)}

Please settle your payment at the municipal office at your earliest convenience.

Thank you.`,
            renewal_notice: `Dear ${data.recipient_name},

Renewal reminder from PRAND - Municipality of Culasi.

Record: ${data.deceased_name}
Tomb: ${data.tomb_number}
Renewal Due: ${formatDate(data.payment_due_date)}
Amount: ${formatCurrency(totalDue)}

Please visit the municipal office to process your renewal.

Thank you.`,
            overdue_notice: `URGENT: Payment Overdue

Dear ${data.recipient_name},

Record: ${data.deceased_name}
Tomb: ${data.tomb_number}
Overdue by: ${daysOverdue} days
Balance Due: ${formatCurrency(balance)}

Please visit PRAND - Municipality of Culasi immediately to settle your account and avoid penalties.

Thank you.`,
            general: "",
        };
        return templates[type] || "";
    };

    // Update message when notice type changes and we have deceased info
    useEffect(() => {
        if (data.notice_type !== "general" && data.deceased_name && data.recipient_name) {
            const template = generateTemplate(data.notice_type);
            handleMessageChange(template);
        }
    }, [data.notice_type, data.deceased_name, data.recipient_name, data.balance, data.payment_due_date]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("notices.store"), {
            onSuccess: () => reset(),
        });
    };

    const handleMessageChange = (value) => {
        setData("message", value);
        setMessageLength(value.length);
    };

    const handleSelectRecord = (record) => {
        setSearchQuery(record.fullname);
        setShowDropdown(false);
        
        const newData = {
            ...data,
            deceased_record_id: record.id,
            recipient_name: record.next_of_kin_name || "",
            recipient_number: record.contact_number || "",
            deceased_name: record.fullname || "",
            tomb_number: record.tomb_number || "",
            balance: record.balance || 0,
            payment_due_date: record.payment_due_date || "",
            total_amount_due: record.total_amount_due || 0,
        };
        
        setData(newData);

        // Auto-populate message if a template type is selected
        if (newData.notice_type !== "general") {
            const daysOverdue = calculateDaysOverdue(newData.payment_due_date);
            const balance = parseFloat(newData.balance || 0);
            const totalDue = parseFloat(newData.total_amount_due || 0);
            
            const templates = {
                payment_reminder: `Dear ${newData.recipient_name},

Payment reminder from PRAND - Municipality of Culasi.

Record: ${newData.deceased_name}
Tomb: ${newData.tomb_number}
Balance Due: ${formatCurrency(balance)}
Due Date: ${formatDate(newData.payment_due_date)}

Please settle your payment at the municipal office at your earliest convenience.

Thank you.`,
                renewal_notice: `Dear ${newData.recipient_name},

Renewal reminder from PRAND - Municipality of Culasi.

Record: ${newData.deceased_name}
Tomb: ${newData.tomb_number}
Renewal Due: ${formatDate(newData.payment_due_date)}
Amount: ${formatCurrency(totalDue)}

Please visit the municipal office to process your renewal.

Thank you.`,
                overdue_notice: `URGENT: Payment Overdue

Dear ${newData.recipient_name},

Record: ${newData.deceased_name}
Tomb: ${newData.tomb_number}
Overdue by: ${daysOverdue} days
Balance Due: ${formatCurrency(balance)}

Please visit PRAND - Municipality of Culasi immediately to settle your account and avoid penalties.

Thank you.`,
            };
            
            if (templates[newData.notice_type]) {
                handleMessageChange(templates[newData.notice_type]);
            }
        }
    };

    const handleClearSelection = () => {
        setSearchQuery("");
        setShowDropdown(false);
        setData({
            ...data,
            deceased_record_id: "",
            recipient_name: "",
            recipient_number: "",
            deceased_name: "",
            tomb_number: "",
            balance: 0,
            payment_due_date: "",
            total_amount_due: 0,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Send Notice" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        SEND NOTICE
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Distribute SMS notifications to recipients
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-8">
                    <div className="space-y-6">
                        {/* Deceased Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                DECEASED INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Deceased Record Search */}
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="deceased_search"
                                        value="Search Deceased *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <div className="relative mt-1">
                                        <div className="relative">
                                            <svg
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                            <input
                                                id="deceased_search"
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(
                                                        e.target.value
                                                    );
                                                    setShowDropdown(true);
                                                }}
                                                onFocus={() =>
                                                    setShowDropdown(true)
                                                }
                                                className="block w-full pl-10 pr-10 py-2 bg-green-50 border border-green-200 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                                                placeholder="Search by name, tomb number, or status..."
                                                autoComplete="off"
                                            />
                                            {searchQuery && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleClearSelection
                                                    }
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        {/* Dropdown Results */}
                                        {showDropdown && searchQuery && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-green-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                                {filteredRecords.length > 0 ? (
                                                    filteredRecords.map(
                                                        (record) => (
                                                            <button
                                                                key={record.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSelectRecord(
                                                                        record
                                                                    )
                                                                }
                                                                className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-b-0 transition"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-semibold text-gray-900">
                                                                            {
                                                                                record.fullname
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            Tomb:{" "}
                                                                            {
                                                                                record.tomb_number
                                                                            } | Balance: {formatCurrency(record.balance)}
                                                                        </p>
                                                                    </div>
                                                                    <span
                                                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                            record.payment_status ===
                                                                            "paid"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : record.payment_status ===
                                                                                  "pending"
                                                                                ? "bg-yellow-100 text-yellow-800"
                                                                                : "bg-red-100 text-red-800"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            record.payment_status
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </button>
                                                        )
                                                    )
                                                ) : (
                                                    <div className="px-4 py-3 text-gray-500 text-center">
                                                        No records found
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <InputError
                                        message={errors.deceased_record_id}
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-600">
                                        Start typing to search for deceased
                                        records
                                    </p>
                                </div>

                                {/* Display Selected Deceased Info */}
                                {data.deceased_name && (
                                    <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-md p-4">
                                        <h4 className="font-semibold text-blue-900 mb-3">Selected Record Details</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                            <div>
                                                <span className="font-semibold text-gray-700 block">
                                                    Deceased Name:
                                                </span>
                                                <p className="text-gray-900">
                                                    {data.deceased_name}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700 block">
                                                    Tomb Number:
                                                </span>
                                                <p className="text-gray-900">
                                                    {data.tomb_number}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700 block">
                                                    Balance Due:
                                                </span>
                                                <p className={`font-bold ${parseFloat(data.balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {formatCurrency(data.balance)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-700 block">
                                                    Due Date:
                                                </span>
                                                <p className="text-gray-900">
                                                    {formatDate(data.payment_due_date)}
                                                </p>
                                            </div>
                                        </div>
                                        {calculateDaysOverdue(data.payment_due_date) > 0 && (
                                            <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-sm">
                                                <span className="font-semibold text-red-800">⚠️ Overdue by {calculateDaysOverdue(data.payment_due_date)} days</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recipient Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                RECIPIENT INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Recipient Name */}
                                <div>
                                    <InputLabel
                                        htmlFor="recipient_name"
                                        value="Recipient Name (Next of Kin) *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="recipient_name"
                                        type="text"
                                        value={data.recipient_name}
                                        className="mt-1 block w-full bg-purple-50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "recipient_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter recipient name"
                                        required
                                    />
                                    <InputError
                                        message={errors.recipient_name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Recipient Number */}
                                <div>
                                    <InputLabel
                                        htmlFor="recipient_number"
                                        value="Phone Number (Mobile) *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="recipient_number"
                                        type="text"
                                        value={data.recipient_number}
                                        className="mt-1 block w-full bg-purple-50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "recipient_number",
                                                e.target.value
                                            )
                                        }
                                        placeholder="09123456789"
                                        required
                                    />
                                    <InputError
                                        message={errors.recipient_number}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notice Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                NOTICE DETAILS
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Notice Type */}
                                <div>
                                    <InputLabel
                                        htmlFor="notice_type"
                                        value="Notice Type *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <select
                                        id="notice_type"
                                        value={data.notice_type}
                                        className="mt-1 block w-full bg-purple-50 border border-purple-200 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
                                        onChange={(e) => {
                                            setData(
                                                "notice_type",
                                                e.target.value
                                            );
                                        }}
                                        required
                                    >
                                        <option value="general">
                                            General Notice
                                        </option>
                                        <option value="payment_reminder">
                                            Payment Reminder (includes balance & due date)
                                        </option>
                                        <option value="renewal_notice">
                                            Renewal Notice (includes amount & renewal date)
                                        </option>
                                        <option value="overdue_notice">
                                            Overdue Notice (includes days overdue & balance)
                                        </option>
                                    </select>
                                    <InputError
                                        message={errors.notice_type}
                                        className="mt-2"
                                    />
                                    <p className="mt-1 text-xs text-gray-600">
                                        Templates automatically include relevant payment data
                                    </p>
                                </div>

                                {/* Message */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <InputLabel
                                            htmlFor="message"
                                            value="Message *"
                                            className="text-gray-700 font-semibold"
                                        />
                                        <span
                                            className={`text-xs font-semibold ${
                                                messageLength > maxMessageLength
                                                    ? "text-red-600"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {messageLength}/{maxMessageLength}
                                        </span>
                                    </div>
                                    <textarea
                                        id="message"
                                        value={data.message}
                                        className="mt-1 block w-full bg-purple-50 border border-purple-200 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
                                        onChange={(e) =>
                                            handleMessageChange(e.target.value)
                                        }
                                        rows="8"
                                        placeholder="Enter your message here (max 500 characters)"
                                        required
                                    />
                                    {messageLength > maxMessageLength && (
                                        <p className="text-xs text-red-600 mt-1">
                                            ⚠️ Message exceeds 500 character limit ({Math.ceil(messageLength / maxMessageLength)} SMS will be sent).
                                        </p>
                                    )}
                                    <InputError
                                        message={errors.message}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Message Preview */}
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border-2 border-purple-300">
                            <h4 className="text-lg font-semibold text-purple-900 mb-3">
                                📱 Message Preview
                            </h4>
                            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-600">
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">
                                    {data.message ||
                                        "Your message will appear here..."}
                                </p>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs text-gray-500">
                                    <span>To: {data.recipient_number || "Phone number"}</span>
                                    <span
                                        className={
                                            messageLength > maxMessageLength
                                                ? "text-red-600 font-bold"
                                                : ""
                                        }
                                    >
                                        {Math.ceil(
                                            messageLength / maxMessageLength || 1
                                        )}{" "}
                                        SMS
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing || !data.deceased_record_id || !data.message}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                            >
                                {processing
                                    ? "Sending Notice..."
                                    : "Send Notice"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}