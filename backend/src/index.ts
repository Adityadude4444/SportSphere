import mainrouter from "./Routers/mainRoute";
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", mainrouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
