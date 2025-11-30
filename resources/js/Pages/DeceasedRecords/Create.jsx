import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function Create({
    requiresPayment = true,
    standardAmount = 5000,
    renewalYears = 5,
    tombAvailability = {},
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        fullname: "",
        birthday: "",
        date_of_death: "",
        date_of_burial: "",
        tomb_number: "",
        tomb_location: "",
        next_of_kin_name: "",
        next_of_kin_relationship: "",
        contact_number: "",
        email: "",
        address: "",
    });

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPinned, setTooltipPinned] = useState(false);
    const tooltipRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tooltipPinned &&
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target)
            ) {
                setTooltipPinned(false);
                setShowTooltip(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [tooltipPinned]);

    const submit = (e) => {
        e.preventDefault();
        post(route("deceased.store"));
    };

    const getLocationAvailability = () => {
        if (!data.tomb_location || !tombAvailability[data.tomb_location]) {
            return null;
        }
        return tombAvailability[data.tomb_location];
    };

    const locationData = getLocationAvailability();

    return (
        <AuthenticatedLayout>
            <Head title="Registration - Deceased Information" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        DECEASED REGISTRATION
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Register new deceased information
                    </p>
                </div>{" "}
                {requiresPayment && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
                        <div className="flex items-start">
                            <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-bold text-blue-900 mb-2">
                                    Payment Required After Registration
                                </h3>
                                <div className="space-y-2 text-sm text-blue-800">
                                    <p>
                                        After completing this registration form,
                                        you will be redirected to make a
                                        payment.
                                    </p>
                                    <div className="bg-white/50 rounded-lg p-4 mt-3">
                                        <p className="font-semibold text-blue-900 mb-2">
                                            Payment Details:
                                        </p>
                                        <ul className="space-y-1 list-disc list-inside">
                                            <li>
                                                <strong>Total Amount:</strong> ₱
                                                {standardAmount.toLocaleString(
                                                    "en-US",
                                                    { minimumFractionDigits: 2 }
                                                )}
                                            </li>
                                            <li>
                                                <strong>
                                                    Minimum Down Payment:
                                                </strong>{" "}
                                                ₱2,500.00 (50%)
                                            </li>
                                            <li>
                                                <strong>Coverage:</strong>{" "}
                                                {renewalYears} years (activated
                                                upon full payment)
                                            </li>
                                            <li>
                                                <strong>Payment Method:</strong>{" "}
                                                Cash (Walk-in only)
                                            </li>
                                            <li>
                                                <strong>
                                                    Balance Payments:
                                                </strong>{" "}
                                                Can be paid anytime, no due
                                                dates or automatic penalties
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                DECEASED INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="fullname"
                                        value="Fullname *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="fullname"
                                        type="text"
                                        value={data.fullname}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData("fullname", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.fullname}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="birthday"
                                        value="Birthday *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="birthday"
                                        type="date"
                                        value={data.birthday}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData("birthday", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.birthday}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="date_of_death"
                                        value="Date of Death *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="date_of_death"
                                        type="date"
                                        value={data.date_of_death}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "date_of_death",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.date_of_death}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="date_of_burial"
                                        value="Date of Burial *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="date_of_burial"
                                        type="date"
                                        value={data.date_of_burial}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "date_of_burial",
                                                e.target.value
                                            )
                                        }
                                        required
                                        min={data.date_of_death || ""}
                                    />
                                    <InputError
                                        message={errors.date_of_burial}
                                        className="mt-2"
                                    />
                                    {data.date_of_burial && (
                                        <p className="text-xs text-purple-600 mt-1">
                                            Coverage will expire on:{" "}
                                            {new Date(
                                                new Date(
                                                    data.date_of_burial
                                                ).setFullYear(
                                                    new Date(
                                                        data.date_of_burial
                                                    ).getFullYear() + 5
                                                )
                                            ).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="tomb_location"
                                        value="Tomb Location *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <select
                                        id="tomb_location"
                                        value={data.tomb_location}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "tomb_location",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select a location
                                        </option>
                                        <option value="North East A">
                                            North East A
                                        </option>
                                        <option value="North East B">
                                            North East B
                                        </option>
                                        <option value="North West A">
                                            North West A
                                        </option>
                                        <option value="North West B">
                                            North West B
                                        </option>
                                        <option value="South East A">
                                            South East A
                                        </option>
                                        <option value="South East B">
                                            South East B
                                        </option>
                                        <option value="South West A">
                                            South West A
                                        </option>
                                        <option value="South West B">
                                            South West B
                                        </option>
                                        <option value="Central Area">
                                            Central Area
                                        </option>
                                    </select>
                                    <InputError
                                        message={errors.tomb_location}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <InputLabel
                                            htmlFor="tomb_number"
                                            value="Tomb Number *"
                                            className="text-gray-700 font-semibold"
                                        />
                                        <div
                                            className="relative"
                                            ref={tooltipRef}
                                        >
                                            <InformationCircleIcon
                                                className="h-5 w-5 text-purple-600 cursor-pointer hover:text-purple-800"
                                                onClick={() => {
                                                    setTooltipPinned(
                                                        !tooltipPinned
                                                    );
                                                    setShowTooltip(
                                                        !tooltipPinned
                                                    );
                                                }}
                                                onMouseEnter={() =>
                                                    !tooltipPinned &&
                                                    setShowTooltip(true)
                                                }
                                                onMouseLeave={() =>
                                                    !tooltipPinned &&
                                                    setShowTooltip(false)
                                                }
                                            />

                                            {showTooltip && locationData && (
                                                <div className="absolute left-0 top-6 z-50 w-80 bg-white border-2 border-purple-300 rounded-lg shadow-2xl">
                                                    <div className="p-4 max-h-96 overflow-y-auto">
                                                        <div className="flex items-center justify-between mb-3 pb-2 border-b">
                                                            <h4 className="font-bold text-purple-800">
                                                                {
                                                                    data.tomb_location
                                                                }{" "}
                                                                - Tomb
                                                                Availability
                                                            </h4>
                                                            {tooltipPinned && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setTooltipPinned(
                                                                            false
                                                                        );
                                                                        setShowTooltip(
                                                                            false
                                                                        );
                                                                    }}
                                                                    className="text-gray-400 hover:text-gray-600"
                                                                >
                                                                    ✕
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="mb-3 text-sm bg-purple-50 p-2 rounded">
                                                            <p className="font-semibold text-purple-900">
                                                                Available:{" "}
                                                                {
                                                                    locationData.available_count
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    locationData.total
                                                                }
                                                            </p>
                                                            <p className="text-purple-700">
                                                                Taken:{" "}
                                                                {
                                                                    locationData.taken_count
                                                                }
                                                            </p>
                                                        </div>

                                                        {locationData.available_count >
                                                        0 ? (
                                                            <>
                                                                <h5 className="font-semibold text-green-700 mb-2 text-sm">
                                                                    ✓ Available
                                                                    Tombs:
                                                                </h5>
                                                                <div className="grid grid-cols-8 gap-1 mb-3">
                                                                    {locationData.available.map(
                                                                        (
                                                                            num
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    num
                                                                                }
                                                                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded text-center"
                                                                            >
                                                                                {
                                                                                    num
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <p className="text-red-600 text-sm font-semibold mb-3">
                                                                All tombs in
                                                                this location
                                                                are taken
                                                            </p>
                                                        )}

                                                        {locationData.taken_count >
                                                            0 && (
                                                            <>
                                                                <h5 className="font-semibold text-red-700 mb-2 text-sm">
                                                                    ✗ Taken
                                                                    Tombs:
                                                                </h5>
                                                                <div className="grid grid-cols-8 gap-1">
                                                                    {locationData.taken.map(
                                                                        (
                                                                            num
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    num
                                                                                }
                                                                                className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded text-center"
                                                                            >
                                                                                {
                                                                                    num
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    {tooltipPinned && (
                                                        <div className="border-t px-4 py-2 bg-gray-50 text-xs text-gray-600 rounded-b-lg">
                                                            Click the ✕ button
                                                            or outside to close
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {showTooltip &&
                                                !data.tomb_location && (
                                                    <div className="absolute left-0 top-6 z-50 w-64 bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-lg p-3">
                                                        <p className="text-sm text-yellow-800">
                                                            Please select a tomb
                                                            location first to
                                                            see availability
                                                        </p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    <TextInput
                                        id="tomb_number"
                                        type="text"
                                        value={data.tomb_number}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "tomb_number",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., 33"
                                        required
                                        disabled={!data.tomb_location}
                                    />
                                    {!data.tomb_location && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Select a location first
                                        </p>
                                    )}
                                    <InputError
                                        message={errors.tomb_number}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                PAYOR INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="next_of_kin_name"
                                        value="Payor Name *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="next_of_kin_name"
                                        type="text"
                                        value={data.next_of_kin_name}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "next_of_kin_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.next_of_kin_name}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="next_of_kin_relationship"
                                        value="Relationship"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <select
                                        id="next_of_kin_relationship"
                                        value={data.next_of_kin_relationship}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "next_of_kin_relationship",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Relationship
                                        </option>
                                        <option value="Spouse">Spouse</option>
                                        <option value="Son">Son</option>
                                        <option value="Daughter">
                                            Daughter
                                        </option>
                                        <option value="Father">Father</option>
                                        <option value="Mother">Mother</option>
                                        <option value="Brother">Brother</option>
                                        <option value="Sister">Sister</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <InputError
                                        message={
                                            errors.next_of_kin_relationship
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="contact_number"
                                        value="Contact Number *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="contact_number"
                                        type="text"
                                        value={data.contact_number}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "contact_number",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., 09123456789"
                                        required
                                    />
                                    <InputError
                                        message={errors.contact_number}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email (Optional)"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="address"
                                        value="Address *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        rows="3"
                                    />
                                    <InputError
                                        message={errors.address}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-5">
                            <h4 className="font-bold text-yellow-900 mb-2 flex items-center">
                                <InformationCircleIcon className="h-5 w-5 mr-2" />
                                Next Steps After Registration
                            </h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                                <li>Complete this registration form</li>
                                <li>
                                    You will be redirected to the payment page
                                </li>
                                <li>
                                    Make a minimum down payment of ₱2,500.00
                                    (50%) or pay in full ₱5,000.00
                                </li>
                                <li>
                                    Balance can be paid anytime - no due dates
                                    or automatic penalties
                                </li>
                                <li>
                                    Coverage activates when full payment is
                                    completed
                                </li>
                            </ol>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition shadow-md"
                            >
                                Cancel
                            </button>
                            <PrimaryButton
                                disabled={processing}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                {processing
                                    ? "Registering..."
                                    : "Continue to Payment"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
