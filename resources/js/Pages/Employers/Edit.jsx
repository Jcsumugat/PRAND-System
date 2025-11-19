import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, LockClosedIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Edit({ employer }) {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [accountPassword, setAccountPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [verifying, setVerifying] = useState(false);
    
    // Password visibility toggles
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAccountPassword, setShowAccountPassword] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        name: employer.name || '',
        email: employer.email || '',
        mobile_number: employer.mobile_number || '',
        password: '',
        password_confirmation: '',
        account_password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowPasswordModal(true);
    };

    const handlePasswordVerification = async () => {
        if (!accountPassword) {
            setPasswordError('Password is required');
            return;
        }

        setVerifying(true);
        setPasswordError('');

        try {
            const response = await fetch(`/employers/${employer.id}/verify-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    password: accountPassword
                })
            });

            const responseData = await response.json();

            if (!response.ok || !responseData.verified) {
                setPasswordError(responseData.message || 'Incorrect account password.');
                setVerifying(false);
                return;
            }

            setData('account_password', accountPassword);
            setShowPasswordModal(false);
            
            put(`/employers/${employer.id}`, {
                data: {
                    ...data,
                    account_password: accountPassword
                },
                onError: () => {
                    setVerifying(false);
                },
                onFinish: () => {
                    setVerifying(false);
                    setAccountPassword('');
                }
            });
        } catch (error) {
            setPasswordError('An error occurred. Please try again.');
            setVerifying(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Employer" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/employers"
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Employer</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Update employer account information
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter full name"
                                autoComplete="off"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="employer@example.com"
                                autoComplete="off"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                id="mobile_number"
                                value={data.mobile_number}
                                onChange={(e) => setData('mobile_number', e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                    errors.mobile_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="09123456789"
                                autoComplete="off"
                            />
                            {errors.mobile_number && (
                                <p className="mt-1 text-sm text-red-600">{errors.mobile_number}</p>
                            )}
                        </div>

                        {/* Password Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Change Password (Optional)
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Leave blank to keep the current password
                            </p>

                            {/* New Password */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Updating...' : 'Update Employer'}
                            </button>
                            <Link
                                href="/employers"
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Account Password Verification Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4 rounded-t-xl">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                                    <ShieldCheckIcon className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Verify Account Password</h2>
                                    <p className="text-purple-100 text-sm">Enter account password to save changes</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-purple-800">
                                    To save changes to <strong>{employer.name}'s</strong> account, please enter their current account password.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Account Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showAccountPassword ? "text" : "password"}
                                        value={accountPassword}
                                        onChange={(e) => {
                                            setAccountPassword(e.target.value);
                                            setPasswordError('');
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && handlePasswordVerification()}
                                        className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                                            passwordError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter account password"
                                        autoComplete="new-password"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowAccountPassword(!showAccountPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showAccountPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordError && (
                                    <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setAccountPassword('');
                                        setPasswordError('');
                                    }}
                                    disabled={verifying}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePasswordVerification}
                                    disabled={verifying || !accountPassword}
                                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {verifying ? 'Verifying...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}