import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logger, logEvents } from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import corsOptions from "./config/corsOptions.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import printerRoutes from "./routes/printer.routes.js";
import monitorRoutes from "./routes/monitor.routes.js";
import peripheralRoutes from "./routes/peripheral.routes.js";
import networkRoutes from "./routes/network.routes.js";
import computerRoutes from "./routes/computer.routes.js";
import makersRoutes from "./routes/maker.routes.js";
import modelsRoutes from "./routes/model.routes.js";
import typesRoutes from "./routes/type.routes.js";
import statesRoutes from "./routes/state.routes.js";
import placesRoutes from "./routes/place.routes.js";
import suppliersRoutes from "./routes/supplier.routes.js";

dotenv.config({ path: "./src/.env" });

const app = express();

app.use(logger);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/", makersRoutes);
app.use("/", modelsRoutes);
app.use("/", typesRoutes);
app.use(statesRoutes);
app.use(placesRoutes);
app.use(suppliersRoutes);
app.use("/monitores", monitorRoutes);
app.use("/impresoras", printerRoutes);
app.use("/perifericos", peripheralRoutes);
app.use("/redes", networkRoutes);
app.use("/computadoras", computerRoutes);

app.use(errorHandler);

export default app;
