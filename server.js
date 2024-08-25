const app = require('./app');
const connection = require("./Database/db");
const dotenv = require("dotenv");

dotenv.config({ path: "config/config.env" });

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});