module.exports = {
    client: {
        name: "React Next App",
        includes: ["pages/**", "components/lib/**"],
        service: {
            name: "api",
            url: "http://localhost:3100/api",
            // optional disable SSL validation check
            skipSSLValidation: true
        }
    }
};