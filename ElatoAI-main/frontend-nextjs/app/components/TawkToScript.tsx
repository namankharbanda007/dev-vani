"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const TawkToScript = () => {
    const pathname = usePathname();

    // specific paths where we DON'T want the chat widget
    const hiddenPaths = ["/home"];

    if (hiddenPaths.includes(pathname)) {
        return null;
    }

    return (
        <Script id="tawk" strategy="lazyOnload">
            {`
                var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
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
