import express, { Request, Response } from 'express';
import cors from "cors";
import { config, connectDB } from "./config";
import bodyParser from "body-parser";
import { authRoutes } from "./routes";
import { User } from "./models";
import bcrypt from "bcrypt";


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());


// Add User admin if not exists
const addAdmin = async () => {
  try {
    const user = await User.findOne({ username: "admin" });
    if (!user) {
      const hashedPassword = await bcrypt.hash("admin", 10);

      // Create a new user
      const newUser = new User({ username: "admin", password: hashedPassword, email: "admin@admin.com" });
      await newUser.save();
      console.log("Admin user created successfully!");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error while creating admin user:", error);
  }
};


// Routes

app.use("/auth", authRoutes);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});


// Start Server
const startServer = async () => {
  try {
    // DB connection
    await connectDB(config.db.url);

    // add user
    await addAdmin();

    // launch server
    app.listen(config.server.port, () => 
      console.log(`Server is running at http://localhost:${config.server.port}`)
    )
  }
  catch(error) {
    console.error("Error starting the server:", error);
  }
}

startServer()