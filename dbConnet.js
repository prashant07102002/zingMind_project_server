const { Client } = require("@elastic/elasticsearch");
const exp = require("constants");
const fs = require("fs");

let client;
try {
  client = new Client({
    node: "https://localhost:9200",
    auth: {
      username: "elastic",
      password: "qxhiSf5pYK7jW=dhHVMG",
    },
    tls: {
      ca: fs.readFileSync("./http_ca.crt"),
      rejectUnauthorized: false,
    },
  });
  console.log("Database Connected");
} catch (error) {
  console.log("The error is :- ", error);
}
module.exports = client;
