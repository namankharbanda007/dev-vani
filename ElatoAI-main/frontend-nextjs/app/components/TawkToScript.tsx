"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

const hiddenPaths = ["/home"];

const TawkToScript = () => {
    const pathname = usePathname();

    useEffect(() => {
        // Function to toggle visibility
        const toggleWidget = () => {
            const tawk = (window as any).Tawk_API;
            if (tawk && tawk.hideWidget && tawk.showWidget) {
                if (hiddenPaths.includes(pathname)) {
                    tawk.hideWidget();
                } else {
                    tawk.showWidget();
                }
            }
        };

        // Attempt initial toggle
        toggleWidget();

        // Also set up an interval to check for Tawk_API availability if not yet loaded
        // This is a safety measure in case the script loads slowly but navigation happens fast
        const interval = setInterval(() => {
            const tawk = (window as any).Tawk_API;
            if (tawk && tawk.hideWidget) {
                toggleWidget();
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [pathname]);

    return (
        <Script id="tawk" strategy="lazyOnload">
            {`
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                
                Tawk_API.onLoad = function(){
                    // Logic to hide if initially on hidden path
                    if (window.location.pathname === '/home') {
                        Tawk_API.hideWidget();
                    }
                };

                (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69733d14194607197bcced82/1jfl2d688';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
                })();
            `}
        </Script>
    );
};

export default TawkToScript;
