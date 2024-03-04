// This is the configuration file for the Next.js app. It tells Next.js to treat MDX files as pages.
// This is necessary because Next.js doesn't support MDX files out of the box.
// The withMDX function is a higher-order function that takes the Next.js configuration object as an argument
// and returns a new configuration object that includes support for MDX files.
// The withMDX function is provided by the @next/mdx package, which is a plugin for Next.js that adds support for MDX files.
// The withMDX function is used to wrap the Next.js configuration object and add support for MDX files.
// The withMDX function is a higher-order function that takes the Next.js configuration object as an argument
// and returns a new configuration object that includes support for MDX files.
// The withMDX function is provided by the @next/mdx package, which is a plugin for Next.js that adds support for MDX files.
// The withMDX function is used to wrap the Next.js configuration object and add support for MDX files.
import withMDX from "@next/mdx";

/* @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  productionBrowserSourceMaps: false,
};

export default withMDX()(nextConfig);
