/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: "https",
                hostname:'res.cloudinary.com'
            },
            {
                protocol: "https",
                hostname:'a0.muscache.com'
            },
        ],
    },
};

export default nextConfig;