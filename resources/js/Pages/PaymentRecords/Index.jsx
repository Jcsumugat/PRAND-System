import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    TrashIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    BanknotesIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    CurrencyDollarIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

export default function Index({ payments, filters, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [type, setType] = useState(filters.type || "");
    const [method, setMethod] = useState(filters.method || "");
    const [paymentFor, setPaymentFor] = useState(filters.payment_for || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("payments.index"),
            { search, type, method, payment_for: paymentFor },
            { preserveState: true }
        );
    };

    const handleDelete = (id, receiptNumber) => {
        if (
            confirm(
                `Are you sure you want to delete payment record ${receiptNumber}?`
            )
        ) {
            router.delete(route("payments.destroy", id));
        }
    };

    const getPaymentForBadge = (paymentFor) => {
        const badges = {
            initial: "bg-blue-100 text-blue-800",
            renewal: "bg-green-100 text-green-800",
            balance: "bg-orange-100 text-orange-800",
            penalty: "bg-red-100 text-red-800",
        };
        return badges[paymentFor] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payment Records" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            PAYMENT RECORDS
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage all payment transactions
                        </p>
                    </div>
                    <Link
                        href={route("payments.create")}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Record Payment
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-blue-700 uppercase">
                                    Total Payments
                                </p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {stats.total_payments}
                                </p>
                            </div>
                            <BanknotesIcon className="h-10 w-10 text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-2 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-green-700 uppercase">
                                    Total Collected
                                </p>
                                <p className="text-2xl font-bold text-green-900 mt-1">
                                    ₱
                                    {parseFloat(
                                        stats.total_amount
                                    ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <CurrencyDollarIcon className="h-10 w-10 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-6 border-2 border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-orange-700 uppercase">
                                    Total Balance
                                </p>
                                <p className="text-2xl font-bold text-orange-900 mt-1">
                                    ₱
                                    {parseFloat(
                                        stats.total_balance || 0
                                    ).toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <ExclamationTriangleIcon className="h-10 w-10 text-orange-400" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-2 border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-purple-700 uppercase">
                                    Fully Paid
                                </p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">
                                    {stats.fully_paid_count}
                                </p>
                            </div>
                            <CheckCircleIcon className="h-10 w-10 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">
                                    Partial Payments
                                </p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    {stats.partial_payment_count}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Records with balance
                                </p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-yellow-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">
                                    No Payment
                                </p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    {stats.no_payment_count}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Pending initial payment
                                </p>
                            </div>
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-teal-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">
                                    Renewals
                                </p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    {stats.renewal_payments}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Completed renewals
                                </p>
                            </div>
                            <CheckCircleIcon className="h-8 w-8 text-teal-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row gap-4"
                    >
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by receipt number or deceased name..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={paymentFor}
                            onChange={(e) => setPaymentFor(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">All Payment Types</option>
                            <option value="initial">Initial</option>
                            <option value="balance">Balance</option>
                            <option value="renewal">Renewal</option>
                            <option value="penalty">Penalty</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                        {(search || type || method || paymentFor) && (
                            <Link
                                href={route("payments.index")}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Clear
                            </Link>
                        )}
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-green-200 to-emerald-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Receipt #
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Deceased Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Payment Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Payment For
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Balance Info
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Received By
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.data.length > 0 ? (
                                    payments.data.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="hover:bg-green-50 transition"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-green-700">
                                                    {payment.receipt_number}
                                                </span>
                                                {payment.official_receipt_number && (
                                                    <div className="text-xs text-gray-500">
                                                        OR:{" "}
                                                        {
                                                            payment.official_receipt_number
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {payment.deceased_record
                                                        ?.fullname || "N/A"}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Tomb:{" "}
                                                    {payment.deceased_record
                                                        ?.tomb_number || "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-gray-900">
                                                    ₱
                                                    {parseFloat(
                                                        payment.amount
                                                    ).toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {new Date(
                                                    payment.payment_date
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentForBadge(
                                                        payment.payment_for
                                                    )}`}
                                                >
                                                    {payment.payment_for
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        payment.payment_for.slice(
                                                            1
                                                        )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment.previous_balance !==
                                                    null && (
                                                    <div className="text-xs">
                                                        <div className="text-gray-600">
                                                            Before:{" "}
                                                            <span className="font-semibold text-orange-600">
                                                                ₱
                                                                {parseFloat(
                                                                    payment.previous_balance
                                                                ).toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="text-gray-600">
                                                            After:{" "}
                                                            <span
                                                                className={`font-semibold ${
                                                                    payment.remaining_balance ===
                                                                    0
                                                                        ? "text-green-600"
                                                                        : "text-orange-600"
                                                                }`}
                                                            >
                                                                ₱
                                                                {parseFloat(
                                                                    payment.remaining_balance ||
                                                                        0
                                                                ).toLocaleString(
                                                                    "en-US",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                        {payment.remaining_balance ===
                                                            0 && (
                                                            <span className="text-xs text-green-600 font-bold">
                                                                ✓ FULLY PAID
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {payment.previous_balance ===
                                                    null && (
                                                    <span className="text-xs text-gray-500 italic">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {payment.receiver?.name ||
                                                    "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        href={route("deceased.payment-history", payment.deceased_record?.id)}
                                                        className="flex items-center px-3 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                                                        title="View Payment History"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                payment.id,
                                                                payment.receipt_number
                                                            )
                                                        }
                                                        className="flex items-center px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-16 h-16 text-gray-300 mb-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                <p className="text-lg font-semibold">
                                                    No payment records found
                                                </p>
                                                <p className="text-sm">
                                                    Try adjusting your search or
                                                    filters
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {payments.data.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing{" "}
                                    <span className="font-semibold">
                                        {payments.from}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold">
                                        {payments.to}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold">
                                        {payments.total}
                                    </span>{" "}
                                    results
                                </div>
                                <div className="flex space-x-2">
                                    {payments.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                                                link.active
                                                    ? "bg-green-600 text-white"
                                                    : link.url
                                                    ? "bg-white text-gray-700 hover:bg-green-50 border border-gray-300"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                            preserveState
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}