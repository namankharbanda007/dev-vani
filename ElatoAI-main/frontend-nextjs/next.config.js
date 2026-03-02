/** @type {import('next').NextConfig} */
const nextConfig = {
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
