import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function PaymentHistory({ deceased, paymentHistory }) {
    const totalPaid = deceased.amount_paid || 0;
    const balance = deceased.balance || 0;
    const totalDue = deceased.total_amount_due || 5000;
    const progressPercentage = (totalPaid / totalDue) * 100;

    return (
        <AuthenticatedLayout>
            <Head title={`Payment History - ${deceased.fullname}`} />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">PAYMENT HISTORY</h2>
                        <p className="text-gray-600 mt-1">{deceased.fullname}</p>
                    </div>
                    <Link
                        href={route('payments.index', deceased.id)}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition shadow-lg"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to Record
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-2 border-blue-200">
                        <h3 className="text-sm font-semibold text-blue-700 uppercase mb-2">Total Due</h3>
                        <p className="text-3xl font-bold text-blue-900">
                            ₱{totalDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">5-year coverage</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-2 border-green-200">
                        <h3 className="text-sm font-semibold text-green-700 uppercase mb-2">Amount Paid</h3>
                        <p className="text-3xl font-bold text-green-900">
                            ₱{totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-green-600 mt-2">{progressPercentage.toFixed(1)}% completed</p>
                    </div>

                    <div className={`bg-gradient-to-br ${balance > 0 ? 'from-orange-50 to-orange-100 border-orange-200' : 'from-purple-50 to-purple-100 border-purple-200'} rounded-xl shadow-lg p-6 border-2`}>
                        <h3 className={`text-sm font-semibold ${balance > 0 ? 'text-orange-700' : 'text-purple-700'} uppercase mb-2`}>
                            Balance
                        </h3>
                        <p className={`text-3xl font-bold ${balance > 0 ? 'text-orange-900' : 'text-purple-900'}`}>
                            ₱{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        {balance === 0 ? (
                            <div className="flex items-center mt-2">
                                <CheckCircleIcon className="h-4 w-4 text-purple-600 mr-1" />
                                <p className="text-xs text-purple-600 font-bold">FULLY PAID</p>
                            </div>
                        ) : (
                            <div className="flex items-center mt-2">
                                <ClockIcon className="h-4 w-4 text-orange-600 mr-1" />
                                <p className="text-xs text-orange-600">Partial payment</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Progress</h3>
                        <div className="relative">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 font-semibold">Progress</span>
                                <span className="text-gray-900 font-bold">{progressPercentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6">
                                <div 
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                >
                                    {progressPercentage > 10 && (
                                        <span className="text-white text-xs font-bold">
                                            {progressPercentage.toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h3>
                        
                        {paymentHistory.length > 0 ? (
                            <div className="space-y-4">
                                {paymentHistory.map((payment, index) => (
                                    <div 
                                        key={payment.id} 
                                        className="bg-gradient-to-r from-gray-50 to-green-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        #{paymentHistory.length - index}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {payment.receipt_number}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        payment.payment_for === 'initial' ? 'bg-blue-100 text-blue-800' :
                                                        payment.payment_for === 'balance' ? 'bg-orange-100 text-orange-800' :
                                                        payment.payment_for === 'renewal' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {payment.payment_for.charAt(0).toUpperCase() + payment.payment_for.slice(1)}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-semibold">Amount Paid</p>
                                                        <p className="text-lg font-bold text-green-700">
                                                            ₱{parseFloat(payment.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-semibold">Previous Balance</p>
                                                        <p className="text-sm font-bold text-orange-600">
                                                            ₱{parseFloat(payment.previous_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-semibold">Remaining Balance</p>
                                                        <p className={`text-sm font-bold ${payment.remaining_balance === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                                            ₱{parseFloat(payment.remaining_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-semibold">Payment Date</p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {new Date(payment.payment_date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: '2-digit',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                                        <span>Received by: <span className="font-semibold text-gray-800">{payment.receiver?.name || 'N/A'}</span></span>
                                                        {payment.official_receipt_number && (
                                                            <span>OR: <span className="font-semibold text-gray-800">{payment.official_receipt_number}</span></span>
                                                        )}
                                                    </div>
                                                    {payment.remarks && (
                                                        <div className="mt-2 text-xs text-gray-600 italic">
                                                            <span className="font-semibold">Remarks:</span> {payment.remarks}
                                                        </div>
                                                    )}
                                                </div>

                                                {payment.remaining_balance === 0 && index === 0 && (
                                                    <div className="mt-3 bg-green-100 border border-green-300 rounded-lg p-3">
                                                        <div className="flex items-center">
                                                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                                                            <span className="text-sm font-bold text-green-800">
                                                                Payment completed with this transaction! Coverage activated.
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <ClockIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-semibold">No payment history yet</p>
                                <p className="text-sm">Payments will appear here once recorded</p>
                            </div>
                        )}
                    </div>

                    {balance > 0 && (
                        <div className="mt-6 pt-6 border-t">
                            <Link
                                href={route('payments.create', { deceased_id: deceased.id })}
                                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
                            >
                                Make a Payment
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}