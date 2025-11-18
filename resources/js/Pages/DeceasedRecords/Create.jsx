import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        fullname: "",
        birthday: "",
        date_of_death: "",
        tomb_number: "",
        tomb_location: "",
        next_of_kin_name: "",
        next_of_kin_relationship: "",
        contact_number: "",
        email: "",
        address: "",
        payment_due_date: "",
        payment_status: "pending",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("deceased.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Registration - Deceased Information" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        DECEASED REGISTRATION
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Register new deceased information
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg p-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Deceased Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                DECEASED INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name */}
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

                                {/* Birthday */}
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

                                {/* Date of Death */}
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

                                {/* Tomb Number */}
                                <div>
                                    <InputLabel
                                        htmlFor="tomb_number"
                                        value="Tomb Number *"
                                        className="text-gray-700 font-semibold"
                                    />
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
                                    />
                                    <InputError
                                        message={errors.tomb_number}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Tomb Location */}
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
                            </div>
                        </div>

                        {/* Next of Kin Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                Payor
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Next of Kin Name */}
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

                                {/* Relationship */}
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

                                {/* Contact Number */}
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

                                {/* Email */}
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

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="address"
                                        value="Address"
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

                        {/* Payment Information Section */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-purple-700 mb-4 border-b pb-2">
                                PAYMENT INFORMATION
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Payment Due Date */}
                                <div>
                                    <InputLabel
                                        htmlFor="payment_due_date"
                                        value="Payment Due Date"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <TextInput
                                        id="payment_due_date"
                                        type="date"
                                        value={data.payment_due_date}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "payment_due_date",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.payment_due_date}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Payment Status */}
                                <div>
                                    <InputLabel
                                        htmlFor="payment_status"
                                        value="Payment Status *"
                                        className="text-gray-700 font-semibold"
                                    />
                                    <select
                                        id="payment_status"
                                        value={data.payment_status}
                                        className="mt-1 block w-full bg-pink-50 border-pink-200 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                        onChange={(e) =>
                                            setData(
                                                "payment_status",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                    <InputError
                                        message={errors.payment_status}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
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
                                {processing ? "Registering..." : "Register"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
