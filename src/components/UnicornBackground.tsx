import { useEffect } from "react";

export default function UnicornBackground() {
    useEffect(() => {
        // Check if script already exists
        if (!document.querySelector('script[src*="unicornStudio"]')) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
            script.async = true;
            script.onload = () => {
                // @ts-ignore
                if (window.UnicornStudio) {
                    // @ts-ignore
                    window.UnicornStudio.init();
                }
            };
            document.head.appendChild(script);
        }
    }, []);

    return (
        <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none opacity-40">
            <div
                className="absolute top-0 left-0 w-full h-full transition-opacity duration-1000"
                data-us-project="BhoqrigscYbD7NN1fwcp"
            />
            {/* Fallback pattern if Unicorn fails */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(74,222,128,0.1),transparent_70%)]" />
        </div>
    );
}
