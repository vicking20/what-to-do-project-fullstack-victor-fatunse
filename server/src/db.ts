import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import path from "path";
import { TaskModel } from "./models/taskModel";
import { ActivityModel } from "./models/activityModel";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  dialect: "postgres",
  models: [TaskModel, ActivityModel],
  logging: console.log, 
});

sequelize.authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    console.log("Loaded models:", sequelize.models);
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

export default sequelize;
