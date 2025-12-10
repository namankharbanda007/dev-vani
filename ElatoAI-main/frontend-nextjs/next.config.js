/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ksyttkhqzrgjqvwokich.supabase.co",
            },
        ],
    },
};

module.exports = nextConfig;
