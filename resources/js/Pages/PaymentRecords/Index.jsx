import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

export default function Index({ payments, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [type, setType] = useState(filters.type || "");
    const [method, setMethod] = useState(filters.method || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("payments.index"),
            { search, type, method },
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

    const getTypeBadge = (type) => {
        const badges = {
            initial: "bg-blue-100 text-blue-800",
            renewal: "bg-green-100 text-green-800",
            penalty: "bg-red-100 text-red-800",
        };
        return badges[type] || "bg-gray-100 text-gray-800";
    };

    const getMethodBadge = (method) => {
        const badges = {
            cash: "bg-green-100 text-green-800",
            gcash: "bg-blue-100 text-blue-800",
            bank_transfer: "bg-purple-100 text-purple-800",
            check: "bg-yellow-100 text-yellow-800",
        };
        return badges[method] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Payment Records" />

            <div className="space-y-6">
                {/* Header */}
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

                {/* Search and Filter */}
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
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">All Types</option>
                            <option value="initial">Initial</option>
                            <option value="renewal">Renewal</option>
                            <option value="penalty">Penalty</option>
                        </select>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">All Methods</option>
                            <option value="cash">Cash</option>
                            <option value="gcash">GCash</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="check">Check</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                        {(search || type || method) && (
                            <Link
                                href={route("payments.index")}
                                className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Clear
                            </Link>
                        )}
                    </form>
                </div>

                {/* Table */}
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
                                        Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                                        Method
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
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadge(
                                                        payment.payment_type
                                                    )}`}
                                                >
                                                    {payment.payment_type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        payment.payment_type.slice(
                                                            1
                                                        )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodBadge(
                                                        payment.payment_method
                                                    )}`}
                                                >
                                                    {payment.payment_method ===
                                                    "gcash"
                                                        ? "GCash"
                                                        : payment.payment_method ===
                                                          "bank_transfer"
                                                        ? "Bank Transfer"
                                                        : payment.payment_method
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          payment.payment_method.slice(
                                                              1
                                                          )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {payment.receiver?.name ||
                                                    "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        href={`/payments/${payment.id}/edit`}
                                                        className="flex items-center px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
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

                    {/* Pagination */}
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
