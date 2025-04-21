import "dotenv/config";
import app from "./app";
import sequelize from "./db";

const PORT = process.env.PORT || 5000;

// Initialize database and sync models
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced.");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error: any) => {
  console.error("Database sync failed:", error);
});
