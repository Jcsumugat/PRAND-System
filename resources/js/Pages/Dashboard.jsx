import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    BellIcon,
    ExclamationTriangleIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard({ stats = {}, upcomingRenewals = [] }) {
    const {
        totalRecords = 0,
        fullyPaidRecords = 0,
        partialPayments = 0,
        noPayment = 0,
        totalCollected = 0,
        totalBalance = 0,
        paidThisMonth = 0,
        upcomingRenewals: upcomingRenewalsCount = 0,
        overduePayments = 0,
        totalRenewals = 0,
        activeRenewals = 0,
    } = stats;

    const getAlertColor = (alertLevel) => {
        switch (alertLevel) {
            case "critical":
                return "bg-red-100 text-red-800 border-red-300";
            case "warning":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            default:
                return "bg-blue-100 text-blue-800 border-blue-300";
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="PRAND - Home" />

            <div className="space-y-6">
                {upcomingRenewalsCount > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <BellIcon className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-yellow-900 mb-2">
                                    Renewal Alerts
                                </h3>
                                <p className="text-yellow-800 mb-4">
                                    You have{" "}
                                    <strong>{upcomingRenewalsCount}</strong>{" "}
                                    record(s) approaching their renewal date
                                    within the next 2 months.
                                </p>
                                <Link
                                    href="/renewals"
                                    className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                                >
                                    View Renewal Records
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {overduePayments > 0 && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-red-900 mb-2">
                                    Overdue Payments Alert
                                </h3>
                                <p className="text-red-800 mb-4">
                                    You have <strong>{overduePayments}</strong>{" "}
                                    overdue payment(s) that require immediate
                                    attention.
                                </p>
                                <Link
                                    href="/deceased"
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    View Overdue Records
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-4xl font-bold mb-3">
                                PRAND System
                            </h1>
                            <p className="text-indigo-100 text-lg mb-4">
                                Payment Renewal and Notice Distribution for
                                Cemetery Operations
                            </p>
                            <p className="text-indigo-100 mb-6">
                                A comprehensive municipal management system
                                serving the Municipality of Culasi, Province of
                                Antique, Philippines
                            </p>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Efficient Management</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span>Secure Records</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                            <h3 className="text-xl font-semibold mb-4">
                                Municipality Information
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <span className="font-semibold">
                                        Location:
                                    </span>{" "}
                                    Culasi, Antique
                                </li>
                                <li>
                                    <span className="font-semibold">
                                        Region:
                                    </span>{" "}
                                    Western Visayas (Region VI)
                                </li>
                                <li>
                                    <span className="font-semibold">
                                        Province:
                                    </span>{" "}
                                    Antique
                                </li>
                                <li>
                                    <span className="font-semibold">
                                        Known For:
                                    </span>{" "}
                                    Heritage & Cultural Significance
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Records
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {totalRecords}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    All deceased records
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg
                                    className="w-8 h-8 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Fully Paid
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {fullyPaidRecords}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Complete payments
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Upcoming Renewals
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {upcomingRenewalsCount}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Within 2 months
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <ClockIcon className="w-8 h-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Overdue
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {overduePayments}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Past due date
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Payment Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Fully Paid
                                </span>
                                <span className="font-bold text-green-600">
                                    {fullyPaidRecords}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Partial Payment
                                </span>
                                <span className="font-bold text-orange-600">
                                    {partialPayments}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    No Payment
                                </span>
                                <span className="font-bold text-red-600">
                                    {noPayment}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Financial Summary
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-xs text-gray-600">
                                    Total Collected
                                </span>
                                <p className="text-xl font-bold text-green-600">
                                    ₱
                                    {totalCollected.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-600">
                                    Total Balance Unpaid
                                </span>
                                <p className="text-xl font-bold text-orange-600">
                                    ₱
                                    {totalBalance.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            This Month
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Payments
                                </span>
                                <span className="font-bold text-blue-600">
                                    {paidThisMonth}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    Active Renewals
                                </span>
                                <span className="font-bold text-green-600">
                                    {activeRenewals}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {upcomingRenewals.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Upcoming Renewals (Next 2 Months)
                        </h3>
                        <div className="space-y-3">
                            {upcomingRenewals.map((renewal) => (
                                <div
                                    key={renewal.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${getAlertColor(
                                        renewal.alert_level
                                    )}`}
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {renewal.fullname}
                                        </p>
                                        <p className="text-sm">
                                            Tomb: {renewal.tomb_number}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">
                                            {renewal.days_until_renewal} days
                                        </p>
                                        <p className="text-xs">
                                            Due:{" "}
                                            {new Date(
                                                renewal.payment_due_date
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                        About Culasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="font-semibold text-gray-900 mb-2 text-lg">
                                Historic Heritage
                            </p>
                            <p className="text-gray-700">
                                Culasi is known for its rich cultural and
                                religious heritage in the Antique province,
                                serving as a vital community with strong
                                traditions and historical significance.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 mb-2 text-lg">
                                Strategic Location
                            </p>
                            <p className="text-gray-700">
                                Located in Western Visayas (Region VI), Culasi
                                maintains strong community ties and efficient
                                municipal services that serve its residents with
                                dedication and excellence.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 mb-2 text-lg">
                                Municipal Services
                            </p>
                            <p className="text-gray-700">
                                Committed to providing quality public services
                                including cemetery management, record keeping,
                                and community support programs for all
                                residents.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M3 1a1 1 0 011-1h12a1 1 0 011 1H3zm0 4h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900">
                                Record Management
                            </h4>
                        </div>
                        <p className="text-sm text-gray-700">
                            Comprehensive deceased records with secure data
                            storage and easy accessibility for municipal staff.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-600 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900">
                                Payment Tracking
                            </h4>
                        </div>
                        <p className="text-sm text-gray-700">
                            Monitor payment status, renewals, and maintain
                            accurate financial records for the municipality.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-600 rounded-lg">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900">
                                Notice Distribution
                            </h4>
                        </div>
                        <p className="text-sm text-gray-700">
                            Automated system for sending renewal notices and
                            important cemetery information to families.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
