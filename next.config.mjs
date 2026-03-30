/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ["gbzggowikfzfebfyrtaz.supabase.co"],
    remotePatterns: [
    {
      protocol: "https",
      hostname: "**",
    },
  ],
  },
  reactCompiler: true,
};

export default nextConfig;
