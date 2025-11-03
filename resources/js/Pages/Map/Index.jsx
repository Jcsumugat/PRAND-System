import { useState, useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CemeteryMap({ deceased = [] }) {
    const [selectedTomb, setSelectedTomb] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredDeceased, setFilteredDeceased] = useState(deceased);
    const [gridView, setGridView] = useState(true);

    // Define the standard location order
    const locationOrder = [
        "North East A",
        "North East B",
        "North West A",
        "North West B",
        "South East A",
        "South East B",
        "South West A",
        "South West B",
        "Central Area",
    ];

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredDeceased(deceased);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredDeceased(
                deceased.filter(
                    (d) =>
                        d.fullname.toLowerCase().includes(term) ||
                        d.tomb_number.toLowerCase().includes(term) ||
                        d.tomb_location.toLowerCase().includes(term)
                )
            );
        }
    }, [searchTerm, deceased]);

    const handleTombClick = (tomb) => {
        setSelectedTomb(tomb);
    };

    const handleCloseDetails = () => {
        setSelectedTomb(null);
    };

    // Group by location for better organization
    const groupedByLocation = deceased.reduce((acc, item) => {
        const location = item.tomb_location || "Unknown";
        if (!acc[location]) {
            acc[location] = [];
        }
        acc[location].push(item);
        return acc;
    }, {});

    // Sort locations based on predefined order
    const locations = Object.keys(groupedByLocation).sort((a, b) => {
        const indexA = locationOrder.indexOf(a);
        const indexB = locationOrder.indexOf(b);

        // If both are in the order list, sort by their position
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        // If only a is in the list, it comes first
        if (indexA !== -1) return -1;
        // If only b is in the list, it comes first
        if (indexB !== -1) return 1;
        // If neither is in the list, sort alphabetically
        return a.localeCompare(b);
    });

    return (
    <AuthenticatedLayout>
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-200 to-orange-200 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    CEMETERY INFORMATION
                </h2>
                <p className="text-gray-600 mt-1">
                    Interactive cemetery layout - {deceased.length} tombs total
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by deceased name, tomb number, or location..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Map/Grid View */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-h-screen">
                        {/* View Toggle */}
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Cemetery Grid
                            </h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setGridView(true)}
                                    className={`px-4 py-2 font-semibold rounded-lg transition ${
                                        gridView
                                            ? "bg-amber-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    Grid View
                                </button>
                                <button
                                    onClick={() => setGridView(false)}
                                    className={`px-4 py-2 font-semibold rounded-lg transition ${
                                        !gridView
                                            ? "bg-amber-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    List View
                                </button>
                            </div>
                        </div>

                        {/* Grid View */}
                        {gridView ? (
                            <div className="space-y-8">
                                {locations.length > 0 ? (
                                    locations.map((location) => (
                                        <div key={location}>
                                            <h4 className="text-base font-bold text-amber-700 mb-4 pb-2 border-b-2 border-amber-300">
                                                📍 {location} (
                                                {
                                                    groupedByLocation[location]
                                                        .length
                                                }{" "}
                                                tombs)
                                            </h4>
                                            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                                {groupedByLocation[location]
                                                    .sort((a, b) => {
                                                        const numA =
                                                            parseInt(
                                                                a.tomb_number
                                                            ) || 0;
                                                        const numB =
                                                            parseInt(
                                                                b.tomb_number
                                                            ) || 0;
                                                        return numA - numB;
                                                    })
                                                    .map((tomb) => (
                                                        <button
                                                            key={tomb.id}
                                                            onClick={() =>
                                                                handleTombClick(
                                                                    tomb
                                                                )
                                                            }
                                                            className={`p-3 border-2 rounded-lg transition transform hover:scale-105 ${
                                                                tomb.payment_status ===
                                                                "paid"
                                                                    ? "bg-gradient-to-br from-green-100 to-green-200 border-green-400 hover:from-green-200 hover:to-green-300 hover:border-green-600"
                                                                    : tomb.payment_status ===
                                                                      "pending"
                                                                    ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 hover:from-yellow-200 hover:to-yellow-300 hover:border-yellow-600"
                                                                    : "bg-gradient-to-br from-red-100 to-red-200 border-red-400 hover:from-red-200 hover:to-red-300 hover:border-red-600"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`text-xs font-bold ${
                                                                    tomb.payment_status ===
                                                                    "paid"
                                                                        ? "text-green-900"
                                                                        : tomb.payment_status ===
                                                                          "pending"
                                                                        ? "text-yellow-900"
                                                                        : "text-red-900"
                                                                }`}
                                                            >
                                                                #
                                                                {
                                                                    tomb.tomb_number
                                                                }
                                                            </div>
                                                            <div
                                                                className={`text-xs truncate mt-1 ${
                                                                    tomb.payment_status ===
                                                                    "paid"
                                                                        ? "text-green-700"
                                                                        : tomb.payment_status ===
                                                                          "pending"
                                                                        ? "text-yellow-700"
                                                                        : "text-red-700"
                                                                }`}
                                                            >
                                                                {
                                                                    tomb.fullname.split(
                                                                        " "
                                                                    )[0]
                                                                }
                                                            </div>
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No tombs available.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* List View */
                            <div className="space-y-3">
                                {filteredDeceased.length > 0 ? (
                                    filteredDeceased.map((tomb) => (
                                        <button
                                            key={tomb.id}
                                            onClick={() =>
                                                handleTombClick(tomb)
                                            }
                                            className={`w-full p-4 border-2 rounded-lg transition text-left ${
                                                tomb.payment_status === "paid"
                                                    ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300 hover:from-green-100 hover:to-green-200 hover:border-green-500"
                                                    : tomb.payment_status ===
                                                      "pending"
                                                    ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 hover:from-yellow-100 hover:to-yellow-200 hover:border-yellow-500"
                                                    : "bg-gradient-to-r from-red-50 to-red-100 border-red-300 hover:from-red-100 hover:to-red-200 hover:border-red-500"
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div
                                                        className={`font-bold ${
                                                            tomb.payment_status ===
                                                            "paid"
                                                                ? "text-green-900"
                                                                : tomb.payment_status ===
                                                                  "pending"
                                                                ? "text-yellow-900"
                                                                : "text-red-900"
                                                        }`}
                                                    >
                                                        Tomb #{tomb.tomb_number}
                                                    </div>
                                                    <div className="text-sm text-gray-700 mt-1">
                                                        {tomb.fullname}
                                                    </div>
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        📍 {tomb.tomb_location}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded border ${
                                                        tomb.payment_status ===
                                                        "paid"
                                                            ? "bg-green-100 border-green-300 text-green-800"
                                                            : tomb.payment_status ===
                                                              "pending"
                                                            ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                                                            : "bg-red-100 border-red-300 text-red-800"
                                                    }`}
                                                >
                                                    {tomb.payment_status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        tomb.payment_status.slice(
                                                            1
                                                        )}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No tombs match your search.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 max-h-96 overflow-y-auto">
                        {selectedTomb ? (
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Tomb Details
                                    </h3>
                                    <button
                                        onClick={handleCloseDetails}
                                        className="p-1 hover:bg-gray-100 rounded transition"
                                    >
                                        <XMarkIcon className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>

                                <div className="space-y-4 text-sm">
                                    {/* Tomb Number */}
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold uppercase">
                                            Tomb Number
                                        </p>
                                        <p className="text-lg font-bold text-amber-700 mt-1">
                                            #{selectedTomb.tomb_number}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold uppercase">
                                            Location
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            📍 {selectedTomb.tomb_location}
                                        </p>
                                    </div>

                                    {/* Deceased Name */}
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold uppercase">
                                            Deceased Name
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {selectedTomb.fullname}
                                        </p>
                                    </div>

                                    {/* Birth - Death */}
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold uppercase">
                                            Life Span
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {new Date(
                                                selectedTomb.birthday
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}{" "}
                                            -{" "}
                                            {new Date(
                                                selectedTomb.date_of_death
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    {/* Next of Kin */}
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold uppercase">
                                            Payor
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {selectedTomb.next_of_kin_name}
                                        </p>
                                        {selectedTomb.next_of_kin_relationship && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                (
                                                {
                                                    selectedTomb.next_of_kin_relationship
                                                }
                                                )
                                            </p>
                                        )}
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold uppercase">
                                            Contact Number
                                        </p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {selectedTomb.contact_number}
                                        </p>
                                    </div>

                                    {/* Payment Status */}
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold uppercase">
                                            Payment Status
                                        </p>
                                        <div className="mt-1">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    selectedTomb.payment_status ===
                                                    "paid"
                                                        ? "bg-green-100 text-green-800"
                                                        : selectedTomb.payment_status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {selectedTomb.payment_status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    selectedTomb.payment_status.slice(
                                                        1
                                                    )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    {selectedTomb.email && (
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">
                                                Email
                                            </p>
                                            <p className="text-gray-900 font-medium mt-1 break-all">
                                                {selectedTomb.email}
                                            </p>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {selectedTomb.address && (
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">
                                                Address
                                            </p>
                                            <p className="text-gray-900 font-medium mt-1 text-xs">
                                                {selectedTomb.address}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg
                                    className="w-16 h-16 text-gray-300 mx-auto mb-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <p className="text-gray-600 font-semibold">
                                    Click a tomb to view details
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Legend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 rounded"></div>
                        <span className="text-sm text-gray-700">Paid</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded"></div>
                        <span className="text-sm text-gray-700">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-400 rounded"></div>
                        <span className="text-sm text-gray-700">Overdue</span>
                    </div>
                </div>
            </div>
        </div>

    </AuthenticatedLayout>);
}
