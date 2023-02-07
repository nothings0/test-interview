const express = require("express");
const cors = require("cors");
const router = require("./routes");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
app.use("/api", router);

const PORT = 8000;

app.listen(PORT, () => {
  console.log("app run in port" + PORT);
});
