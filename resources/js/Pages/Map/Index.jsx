import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Index({ deceased = [] }) {
    const [selectedTomb, setSelectedTomb] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDeceased, setFilteredDeceased] = useState(deceased);
    const [gridView, setGridView] = useState(true);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredDeceased(deceased);
        } else {
            const term = searchTerm.toLowerCase();
            setFilteredDeceased(
                deceased.filter(d =>
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
        const location = item.tomb_location || 'Unknown';
        if (!acc[location]) {
            acc[location] = [];
        }
        acc[location].push(item);
        return acc;
    }, {});

    const locations = Object.keys(groupedByLocation).sort();

    return (
        <AuthenticatedLayout>
            <Head title="Cemetery Map" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-200 to-orange-200 rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800">CEMETERY MAP</h2>
                    <p className="text-gray-600 mt-1">Interactive cemetery layout - {deceased.length} tombs total</p>
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
                                <h3 className="text-lg font-semibold text-gray-800">Cemetery Grid</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setGridView(true)}
                                        className={`px-4 py-2 font-semibold rounded-lg transition ${
                                            gridView
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        Grid View
                                    </button>
                                    <button
                                        onClick={() => setGridView(false)}
                                        className={`px-4 py-2 font-semibold rounded-lg transition ${
                                            !gridView
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        List View
                                    </button>
                                </div>
                            </div>

                            {/* Grid View */}
                            {gridView ? (
                                <div className="space-y-8">
                                    {locations.map((location) => (
                                        <div key={location}>
                                            <h4 className="text-base font-bold text-amber-700 mb-4 pb-2 border-b-2 border-amber-300">
                                                📍 {location} ({groupedByLocation[location].length} tombs)
                                            </h4>
                                            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                                {groupedByLocation[location]
                                                    .sort((a, b) => {
                                                        const numA = parseInt(a.tomb_number) || 0;
                                                        const numB = parseInt(b.tomb_number) || 0;
                                                        return numA - numB;
                                                    })
                                                    .map((tomb) => (
                                                        <button
                                                            key={tomb.id}
                                                            onClick={() => handleTombClick(tomb)}
                                                            className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-400 rounded-lg hover:from-amber-200 hover:to-orange-200 hover:border-amber-600 transition transform hover:scale-105"
                                                        >
                                                            <div className="text-xs font-bold text-amber-900">#{tomb.tomb_number}</div>
                                                            <div className="text-xs text-amber-700 truncate mt-1">{tomb.fullname.split(' ')[0]}</div>
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* List View */
                                <div className="space-y-3">
                                    {filteredDeceased.length > 0 ? (
                                        filteredDeceased.map((tomb) => (
                                            <button
                                                key={tomb.id}
                                                onClick={() => handleTombClick(tomb)}
                                                className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg hover:from-amber-100 hover:to-orange-100 hover:border-amber-500 transition text-left"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-bold text-amber-900">Tomb #{tomb.tomb_number}</div>
                                                        <div className="text-sm text-gray-700 mt-1">{tomb.fullname}</div>
                                                        <div className="text-xs text-gray-600 mt-1">📍 {tomb.tomb_location}</div>
                                                    </div>
                                                    <span className="text-xs font-semibold px-2 py-1 bg-white rounded border border-amber-300 text-amber-700">
                                                        Click to view
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
                                        <h3 className="text-lg font-bold text-gray-800">Tomb Details</h3>
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
                                            <p className="text-xs text-gray-600 font-semibold uppercase">Tomb Number</p>
                                            <p className="text-lg font-bold text-amber-700 mt-1">#{selectedTomb.tomb_number}</p>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">Location</p>
                                            <p className="text-gray-900 font-medium mt-1">📍 {selectedTomb.tomb_location}</p>
                                        </div>

                                        {/* Deceased Name */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">Deceased Name</p>
                                            <p className="text-gray-900 font-medium mt-1">{selectedTomb.fullname}</p>
                                        </div>

                                        {/* Birth - Death */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">Life Span</p>
                                            <p className="text-gray-900 font-medium mt-1">
                                                {new Date(selectedTomb.birthday).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric'
                                                })} - {new Date(selectedTomb.date_of_death).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        {/* Next of Kin */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">Next of Kin</p>
                                            <p className="text-gray-900 font-medium mt-1">{selectedTomb.next_of_kin_name}</p>
                                            {selectedTomb.next_of_kin_relationship && (
                                                <p className="text-xs text-gray-600 mt-1">({selectedTomb.next_of_kin_relationship})</p>
                                            )}
                                        </div>

                                        {/* Contact */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">Contact Number</p>
                                            <p className="text-gray-900 font-medium mt-1">{selectedTomb.contact_number}</p>
                                        </div>

                                        {/* Payment Status */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase">Payment Status</p>
                                            <div className="mt-1">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    selectedTomb.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                    selectedTomb.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {selectedTomb.payment_status.charAt(0).toUpperCase() + selectedTomb.payment_status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        {selectedTomb.email && (
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold uppercase">Email</p>
                                                <p className="text-gray-900 font-medium mt-1 break-all">{selectedTomb.email}</p>
                                            </div>
                                        )}

                                        {/* Address */}
                                        {selectedTomb.address && (
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold uppercase">Address</p>
                                                <p className="text-gray-900 font-medium mt-1 text-xs">{selectedTomb.address}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0 0l-6 6m6-6l6-6m-6 6l-6-6" />
                                    </svg>
                                    <p className="text-gray-600 font-semibold">Click a tomb to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-400 rounded"></div>
                            <span className="text-sm text-gray-700">All Tombs</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
