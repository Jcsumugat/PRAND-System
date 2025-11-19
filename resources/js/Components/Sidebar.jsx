import { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    HomeIcon,
    UserPlusIcon,
    DocumentTextIcon,
    CreditCardIcon,
    ArrowPathIcon,
    BellIcon,
    MapIcon,
    UsersIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [expiringCount, setExpiringCount] = useState(0);
    const [expiringRecords, setExpiringRecords] = useState([]);
    const [hoveredItemName, setHoveredItemName] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const page = usePage();
    const { auth } = page.props;

    const currentRoute = page.component;

    useEffect(() => {
        const fetchExpiringRecords = async () => {
            try {
                const csrfToken = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') || '';
                
                const response = await fetch('/api/expiring-records-list', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const allRecords = [...(data.expiring_soon || []), ...(data.overdue || [])];
                setExpiringRecords(allRecords);
                setExpiringCount(data.total_count || 0);
            } catch (error) {
                console.error('Failed to fetch expiring records:', error);
                setExpiringCount(0);
                setExpiringRecords([]);
            }
        };

        fetchExpiringRecords();
        
        const interval = setInterval(fetchExpiringRecords, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const navigation = [
        {
            name: "Home",
            href: "/dashboard",
            component: "Dashboard",
            icon: HomeIcon,
        },
        {
            name: "Registration",
            href: "/deceased/create",
            component: "DeceasedRecords/Create",
            icon: UserPlusIcon,
        },
        {
            name: "Deceased Records",
            href: "/deceased",
            component: "DeceasedRecords",
            icon: DocumentTextIcon,
            badge: expiringCount > 0 ? expiringCount : null,
        },
        {
            name: "Payment Records",
            href: "/payments",
            component: "PaymentRecords",
            icon: CreditCardIcon,
        },
        {
            name: "Renewal Records",
            href: "/renewals",
            component: "RenewalRecords",
            icon: ArrowPathIcon,
        },
        {
            name: "Notice Distribution",
            href: "/notices",
            component: "NoticeDistributions",
            icon: BellIcon,
        },
        {
            name: "Cemetery Information",
            href: "/map",
            component: "Map",
            icon: MapIcon,
        },
        {
            name: "Users",
            href: "/employers",
            component: "Employers",
            icon: UsersIcon,
        },
    ];

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
        setIsOpen(false);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);

        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN":
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
            },
        })
            .then(() => {
                window.location.href = "/login";
            })
            .catch((error) => {
                console.error("Logout error:", error);
                window.location.href = "/login";
            });
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleBadgeMouseEnter = (e, itemName) => {
        if (e.currentTarget && expiringRecords.length > 0) {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPosition({
                top: rect.top,
                left: rect.right + 20,
            });
            setHoveredItemName(itemName);
        }
    };

    const handleBadgeMouseLeave = () => {
        setHoveredItemName(null);
    };

    return (
        <>
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

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-pink-100 to-purple-100 shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 lg:static lg:w-64`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-purple-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                    P
                                </span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">
                                    PRAND System
                                </h1>
                                <p className="text-xs text-gray-600">
                                    Cemetery Management
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4 px-3">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;

                                let isActive;
                                if (item.component === "DeceasedRecords/Create") {
                                    isActive = currentRoute === "DeceasedRecords/Create";
                                } else if (item.component === "DeceasedRecords") {
                                    isActive =
                                        currentRoute &&
                                        currentRoute.startsWith("DeceasedRecords") &&
                                        currentRoute !== "DeceasedRecords/Create";
                                } else {
                                    isActive =
                                        currentRoute === item.component ||
                                        (currentRoute && currentRoute.startsWith(item.component));
                                }

                                const isHovered = hoveredItemName === item.name && item.badge;

                                return (
                                    <div key={item.name} className="relative">
                                        <Link
                                            href={item.href}
                                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                isActive
                                                    ? "bg-purple-600 text-white shadow-lg"
                                                    : "text-gray-700 hover:bg-purple-200 hover:text-purple-900"
                                            }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                                            <span className="flex-1">{item.name}</span>
                                            
                                            {item.badge && (
                                                <span 
                                                    className="ml-2 inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse relative cursor-help"
                                                    onMouseEnter={(e) => handleBadgeMouseEnter(e, item.name)}
                                                    onMouseLeave={handleBadgeMouseLeave}
                                                >
                                                    {item.badge}
                                                    <span className="absolute inline-flex rounded-full h-3 w-3 bg-red-600 -top-1 -right-1 animate-ping"></span>
                                                </span>
                                            )}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="p-4 border-t border-purple-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                    {auth?.user?.name?.charAt(0) || "U"}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {auth?.user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth?.user?.email || "user@email.com"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogoutClick}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Tooltip - Fixed Position */}
            {hoveredItemName && expiringRecords.length > 0 && (
                <div 
                    className="fixed w-96 bg-gray-950 text-white text-xs rounded-lg shadow-2xl p-4 border border-gray-700 z-50"
                    style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                    }}
                    onMouseEnter={() => setHoveredItemName(hoveredItemName)}
                    onMouseLeave={() => setHoveredItemName(null)}
                >
                    <div className="font-semibold mb-3 text-yellow-400 border-b border-gray-600 pb-2">
                        🔔 Payment Renewal Alert ({expiringRecords.length})
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {expiringRecords.map((record, idx) => (
                            <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-600 hover:border-gray-500 transition">
                                <p className="font-semibold text-yellow-300 mb-1">
                                    {record.fullname}
                                </p>
                                <p className="text-gray-300 text-xs mb-2">
                                    🏺 Tomb #{record.tomb_number}
                                </p>
                                
                                {record.type === 'overdue' ? (
                                    <div className="text-red-400 font-semibold text-xs mb-1">
                                        ⚠️ OVERDUE by {record.days_overdue} days
                                    </div>
                                ) : (
                                    <div className="text-orange-400 font-semibold text-xs mb-1">
                                        ⏱️ Expires in {record.days_until_expiry} days
                                    </div>
                                )}
                                
                                <p className="text-gray-400 text-xs">
                                    📅 Due: {new Date(record.payment_due_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-600 text-center">
                        Click "Deceased Records" to manage
                    </div>
                </div>
            )}

            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Confirm Logout
                            </h3>
                            <p className="text-sm text-gray-600">
                                Are you sure you want to logout? You will need to sign in again.
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}