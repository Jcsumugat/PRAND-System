import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UserPlusIcon,
    DocumentTextIcon,
    CreditCardIcon,
    ArrowPathIcon,
    BellIcon,
    MapIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const page = usePage();
    const { auth } = page.props;

    // Get the component name from the page
    const currentRoute = page.component;

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', component: 'Dashboard', icon: HomeIcon },
        { name: 'Registration', href: '/deceased/create', component: 'DeceasedRecords/Create', icon: UserPlusIcon },
        { name: 'Deceased Records', href: '/deceased', component: 'DeceasedRecords', icon: DocumentTextIcon },
        { name: 'Payment Records', href: '/payments', component: 'PaymentRecords', icon: CreditCardIcon },
        { name: 'Renewal Records', href: '/renewals', component: 'RenewalRecords', icon: ArrowPathIcon },
        { name: 'Notice Distribution', href: '/notices', component: 'NoticeDistributions', icon: BellIcon },
        { name: 'Map', href: '/map', component: 'Map', icon: MapIcon },
    ];

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white lg:hidden hover:bg-purple-700 transition"
            >
                {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <Bars3Icon className="h-6 w-6" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-pink-100 to-purple-100 shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static lg:w-64`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Header */}
                    <div className="p-6 border-b border-purple-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">P</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">PRAND System</h1>
                                <p className="text-xs text-gray-600">Cemetery Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;

                                // Special handling for Registration vs Deceased Records
                                let isActive;
                                if (item.component === 'DeceasedRecords/Create') {
                                    // Registration: only exact match
                                    isActive = currentRoute === 'DeceasedRecords/Create';
                                } else if (item.component === 'DeceasedRecords') {
                                    // Deceased Records: match DeceasedRecords but exclude Create
                                    isActive = currentRoute &&
                                              currentRoute.startsWith('DeceasedRecords') &&
                                              currentRoute !== 'DeceasedRecords/Create';
                                } else {
                                    // All other items: normal startsWith matching
                                    isActive = currentRoute === item.component ||
                                              (currentRoute && currentRoute.startsWith(item.component));
                                }

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-purple-600 text-white shadow-lg'
                                                : 'text-gray-700 hover:bg-purple-200 hover:text-purple-900'
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon className="h-5 w-5 mr-3" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-purple-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {auth?.user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {auth?.user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth?.user?.email || 'user@email.com'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
