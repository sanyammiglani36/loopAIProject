import express, { NextFunction, Request, Response } from "express";
import routes from "./routes";
import { PORT } from "./config";

const app = express();
app.use(express.json());

app.use("/", routes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
