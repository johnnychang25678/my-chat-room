import App from "./app.js";

const main = async () => {
    const app = new App();
    await app.run(3000);
};

(async () => {
    await main();
})();
