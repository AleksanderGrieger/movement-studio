/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    basePath: "/movement-studio",
    output: "export",
    trailingSlash: true
};

export default nextConfig;
