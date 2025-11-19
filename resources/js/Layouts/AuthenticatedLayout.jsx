import { usePage } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";

export default function AuthenticatedLayout({ children }) {
    const { component } = usePage();

    // Extract current route name from component
    const getCurrentRoute = () => {
        const componentPath = component.toLowerCase();
        if (componentPath.includes("Home")) return "dashboard";
        if (
            componentPath.includes("deceased") &&
            componentPath.includes("create")
        )
            return "deceased.create";
        if (componentPath.includes("deceased")) return "deceased.index";
        if (componentPath.includes("payment")) return "payments.index";
        if (componentPath.includes("renewal")) return "renewals.index";
        if (componentPath.includes("notice")) return "notices.index";
        if (componentPath.includes("map")) return "map.index";
        if (componentPath.includes("employers")) return "employers.index";
        return "dashboard";
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar currentRoute={getCurrentRoute()} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200 lg:ml-0 ml-0">
                    <div className="px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center lg:ml-0 ml-14">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {getCurrentRoute()
                                        .split(".")[0]
                                        .charAt(0)
                                        .toUpperCase() +
                                        getCurrentRoute()
                                            .split(".")[0]
                                            .slice(1)}
                                </h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">
                                    {new Date().toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
