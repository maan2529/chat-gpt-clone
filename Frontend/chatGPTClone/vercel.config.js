/** @type {import('@vercel/node').VercelConfig} */
module.exports = {
    builds: [
        {
            src: "package.json",
            use: "@vercel/static-build",
            config: { 
                distDir: "dist" 
            }
        }
    ],
    routes: [
        { handle: "filesystem" },
        { src: "/.*", dest: "/index.html" }
    ]
};  