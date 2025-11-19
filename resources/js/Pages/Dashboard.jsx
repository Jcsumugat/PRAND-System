import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ stats = {}, trendData = [] }) {
    const {
        totalRecords = 0,
        paidThisMonth = 0,
        pendingRenewals = 0,
        overduePayments = 0
    } = stats;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const lineChartData = monthNames.map((name, index) => {
        const monthData = trendData.find(stat => stat.month === index + 1);
        return {
            name,
            records: monthData ? monthData.count : 0
        };
    });

    return (
        <AuthenticatedLayout>
            <Head title="PRAND - Home" />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg shadow-lg p-8 mb-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl font-bold mb-3">
                            PRAND System
                        </h1>
                        <p className="text-indigo-100 text-lg mb-4">
                            Payment Renewal and Notice Distribution for Cemetery Operations
                        </p>
                        <p className="text-indigo-100 mb-6">
                            A comprehensive government management system serving the Municipality of Culasi, Province of Antique, Philippines
                        </p>
                        <div className="flex gap-3">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Efficient Management</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Secure Records</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                        <h3 className="text-xl font-semibold mb-4">Municipality Information</h3>
                        <ul className="space-y-2 text-sm">
                            <li><span className="font-semibold">Location:</span> Culasi, Antique</li>
                            <li><span className="font-semibold">Region:</span> Western Visayas (Region VI)</li>
                            <li><span className="font-semibold">Province:</span> Antique</li>
                            <li><span className="font-semibold">Known For:</span> Heritage & Cultural Significance</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Records</p>
                            <p className="text-3xl font-bold text-gray-900">{totalRecords}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                            <p className="text-3xl font-bold text-gray-900">{paidThisMonth}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Renewals</p>
                            <p className="text-3xl font-bold text-gray-900">{pendingRenewals}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20 hover:shadow-xl transition">
                    <div className="flex items-center">
                        <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                            <p className="text-3xl font-bold text-gray-900">{overduePayments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Culasi Section */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">About Culasi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="font-semibold text-gray-900 mb-2 text-lg">Historic Heritage</p>
                        <p className="text-gray-700">Culasi is known for its rich cultural and religious heritage in the Antique province, serving as a vital community with strong traditions and historical significance.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 mb-2 text-lg">Strategic Location</p>
                        <p className="text-gray-700">Located in Western Visayas (Region VI), Culasi maintains strong community ties and efficient municipal services that serve its residents with dedication and excellence.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 mb-2 text-lg">Municipal Services</p>
                        <p className="text-gray-700">Committed to providing quality public services including cemetery management, record keeping, and community support programs for all residents.</p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 1a1 1 0 011-1h12a1 1 0 011 1H3zm0 4h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900">Record Management</h4>
                    </div>
                    <p className="text-sm text-gray-700">Comprehensive deceased records with secure data storage and easy accessibility.</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900">Payment Tracking</h4>
                    </div>
                    <p className="text-sm text-gray-700">Monitor payment status, renewals, and generate timely notices for outstanding fees.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-600 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900">Distribution Notices</h4>
                    </div>
                    <p className="text-sm text-gray-700">Automated system for sending renewal notices and important cemetery information.</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}