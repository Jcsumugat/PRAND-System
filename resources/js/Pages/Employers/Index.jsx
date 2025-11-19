import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    UserIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    XMarkIcon,
    PhoneIcon,
    EnvelopeIcon,
    LockClosedIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export default function Index({ employers = [] }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordAction, setPasswordAction] = useState(null); // 'edit' or 'delete'
    const [selectedEmployer, setSelectedEmployer] = useState(null);
    const [verificationPassword, setVerificationPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [verifying, setVerifying] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        mobile_number: "",
        password: "",
        password_confirmation: "",
    });

    const handleDelete = (employer) => {
        setSelectedEmployer(employer);
        setPasswordAction("delete");
        setShowPasswordModal(true);
        setVerificationPassword("");
        setPasswordError("");
    };

    const handleEdit = (employer) => {
        setSelectedEmployer(employer);
        setPasswordAction("edit");
        setShowPasswordModal(true);
        setVerificationPassword("");
        setPasswordError("");
    };

    const handlePasswordVerification = async () => {
        if (!verificationPassword) {
            setPasswordError("Password is required");
            return;
        }

        setVerifying(true);
        setPasswordError("");

        try {
            // Verify the currently logged-in user's password (not the target employer's password)
            const response = await fetch("/verify-current-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    password: verificationPassword,
                }),
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.verified) {
                setPasswordError(
                    responseData.message ||
                        "Incorrect password. Please enter YOUR account password."
                );
                setVerifying(false);
                return;
            }

            // Password verified, now proceed with the action
            if (passwordAction === "delete") {
                router.delete(`/employers/${selectedEmployer.id}`, {
                    onSuccess: () => {
                        setShowPasswordModal(false);
                        setVerificationPassword("");
                        setVerifying(false);
                        setSelectedEmployer(null);
                    },
                    onError: (errors) => {
                        setPasswordError(
                            errors.password || "Failed to delete employer"
                        );
                        setVerifying(false);
                    },
                });
            } else if (passwordAction === "edit") {
                // Password verified, navigate to edit page
                setShowPasswordModal(false);
                setVerificationPassword("");
                setVerifying(false);
                router.visit(`/employers/${selectedEmployer.id}/edit`);
            }
        } catch (error) {
            setPasswordError("An error occurred. Please try again.");
            setVerifying(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/employers", {
            onSuccess: () => {
                reset();
                setShowModal(false);
            },
        });
    };

    const filteredEmployers = employers.filter(
        (employer) =>
            employer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employer.mobile_number &&
                employer.mobile_number.includes(searchTerm))
    );

    return (
        <AuthenticatedLayout>
            <Head title="Employers" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Employers
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage system user accounts
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Employer
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-md p-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        autoComplete="off"
                    />
                </div>

                {/* Employers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployers.map((employer) => (
                        <div
                            key={employer.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Avatar */}
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">
                                            {employer.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {employer.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {employer.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <UserIcon className="h-4 w-4 mr-2" />
                                        ID: {employer.id}
                                    </div>
                                    {employer.mobile_number && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <PhoneIcon className="h-4 w-4 mr-2" />
                                            {employer.mobile_number}
                                        </div>
                                    )}
                                    <div className="text-sm text-gray-600">
                                        Joined:{" "}
                                        {new Date(
                                            employer.created_at
                                        ).toLocaleDateString()}
                                    </div>
                                    {employer.email_verified_at && (
                                        <div className="flex items-center">
                                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                                Verified
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleEdit(employer)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employer)}
                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredEmployers.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <UserIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No employers found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "Get started by creating a new employer account"}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add First Employer
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Employer Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                                    <UserIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Add New Employer
                                    </h2>
                                    <p className="text-purple-100 text-sm">
                                        Create a new employer account
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="employer@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={data.mobile_number}
                                            onChange={(e) =>
                                                setData(
                                                    "mobile_number",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            placeholder="09123456789"
                                        />
                                    </div>
                                    {errors.mobile_number && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.mobile_number}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="••••••••"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? "Creating..."
                                        : "Create Employer"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Verification Modal */}
            {showPasswordModal && selectedEmployer && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 rounded-t-xl">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                                    <ShieldCheckIcon className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Security Verification
                                    </h2>
                                    <p className="text-amber-100 text-sm">
                                        Verify your password to continue
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-amber-800 flex items-start">
                                    <ShieldCheckIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>
                                        You are about to{" "}
                                        <strong>{passwordAction}</strong> the
                                        account of{" "}
                                        <strong>{selectedEmployer.name}</strong>
                                        . Please enter{" "}
                                        <strong>YOUR password</strong>{" "}
                                        (currently logged in as{" "}
                                        <strong>{auth.user.name}</strong>) to
                                        confirm this action.
                                    </span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Account Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={verificationPassword}
                                        onChange={(e) => {
                                            setVerificationPassword(
                                                e.target.value
                                            );
                                            setPasswordError("");
                                        }}
                                        onKeyPress={(e) =>
                                            e.key === "Enter" &&
                                            handlePasswordVerification()
                                        }
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                            passwordError
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                </div>
                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center">
                                        <XMarkIcon className="h-4 w-4 mr-1" />
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setVerificationPassword("");
                                        setPasswordError("");
                                        setSelectedEmployer(null);
                                    }}
                                    disabled={verifying}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePasswordVerification}
                                    disabled={
                                        verifying || !verificationPassword
                                    }
                                    className={`flex-1 px-4 py-3 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                                        passwordAction === "delete"
                                            ? "bg-red-600 hover:bg-red-700 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                                >
                                    {verifying
                                        ? "Verifying..."
                                        : passwordAction === "delete"
                                        ? "Delete Account"
                                        : "Continue to Edit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
