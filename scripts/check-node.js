const requiredVersion = 18;
const currentVersion = process.version.substring(1).split('.')[0];

if (parseInt(currentVersion) < requiredVersion) {
    console.error(`\x1b[31mError: Node.js version ${process.version} is incompatible with this project.\x1b[0m`);
    console.error(`\x1b[33mPlease upgrade to Node.js v${requiredVersion} or higher (v20+ recommended).\x1b[0m`);
    console.error(`You can use nvm to switch: \x1b[36mnvm use 20\x1b[0m`);
    process.exit(1);
}
