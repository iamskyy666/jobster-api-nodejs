import "dotenv/config";
import mockJobs from "./mock-data.json" with { type: "json" };
import connectDB from "./db/connect.js";
import Job from "./models/Job.model.js";

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany({});
    await Job.create(mockJobs);
    console.log(`Populated successfully!`);
    process.exit(0);
  } catch (err) {
    console.log(`ERROR:`, err);
    process.exit(1);
  }
};

start();
