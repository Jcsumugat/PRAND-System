import { useState } from "react";
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
        message: "",
        notice_type: "general",
    });

    const [messageLength, setMessageLength] = useState(0);
    const [searchQuery, setSearchQuery] = useState(
        selectedDeceased?.fullname || ""
    );
    const [showDropdown, setShowDropdown] = useState(false);
    const maxMessageLength = 225;

    // Filter deceased records based on search query
    const filteredRecords = deceasedRecords.filter((record) => {
        const query = searchQuery.toLowerCase();
        return (
            record.fullname?.toLowerCase().includes(query) ||
            record.tomb_number?.toLowerCase().includes(query) ||
            record.payment_status?.toLowerCase().includes(query)
        );
    });

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
        setData({
            ...data,
            deceased_record_id: record.id,
            recipient_name: record.next_of_kin_name || "",
            recipient_number: record.contact_number || "",
        });
    };

    const handleClearSelection = () => {
        setSearchQuery("");
        setShowDropdown(false);
        setData({
            ...data,
            deceased_record_id: "",
            recipient_name: "",
            recipient_number: "",
        });
    };

    const noticeTemplates = {
        payment_reminder: `Dear ${data.recipient_name}, this is a reminder about the upcoming payment for the tomb at our cemetery. Please settle the payment as soon as possible. Thank you.`,
        renewal_notice: `Dear ${data.recipient_name}, your tomb renewal is due. Please contact us or visit the office to process your renewal. Thank you.`,
        overdue_notice: `Dear ${data.recipient_name}, your payment is now overdue. Please settle your account immediately to avoid penalties. Thank you.`,
        general: "",
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
                                            {/* Search Icon - Using SVG if icons not available */}
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
                                                    {/* X Icon - Using SVG */}
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
                                                                            }
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
                                        value="Recipient Name *"
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
                                            if (e.target.value !== "general") {
                                                handleMessageChange(
                                                    noticeTemplates[
                                                        e.target.value
                                                    ]
                                                );
                                            }
                                        }}
                                        required
                                    >
                                        <option value="general">
                                            General Notice
                                        </option>
                                        <option value="payment_reminder">
                                            Payment Reminder
                                        </option>
                                        <option value="renewal_notice">
                                            Renewal Notice
                                        </option>
                                        <option value="overdue_notice">
                                            Overdue Notice
                                        </option>
                                    </select>
                                    <InputError
                                        message={errors.notice_type}
                                        className="mt-2"
                                    />
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
                                        rows="4"
                                        placeholder="Enter your message here (max 225 characters for SMS)"
                                        required
                                    />
                                    {messageLength > maxMessageLength && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Message exceeds SMS character limit.
                                            It may be sent as multiple messages.
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
                                Message Preview
                            </h4>
                            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-600">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {data.message ||
                                        "Your message will appear here..."}
                                </p>
                                <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                                    <span>To: {data.recipient_number}</span>
                                    <span
                                        className={
                                            messageLength > maxMessageLength
                                                ? "text-red-600 font-bold"
                                                : ""
                                        }
                                    >
                                        {Math.ceil(
                                            messageLength / maxMessageLength
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
                                disabled={processing}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition shadow-md"
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
