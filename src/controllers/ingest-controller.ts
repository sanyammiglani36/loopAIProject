import { Request, Response } from "express";
import { IngestRequest, Priority } from "../models/types";
import ingestionService from "../services/ingestion-service";

const ingestController = {
    createIngestion: (req: Request, res: Response) => {
        try {
            const { ids, priority } = req.body;

            // Validate IDs
            if (!Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({
                    error: "IDs must be a non-empty array",
                });
                return;
            }

            // Validate each ID
            const maxId = 10 ** 9 + 7; // 10^9+7
            for (const id of ids) {
                if (!Number.isInteger(id) || id < 1 || id > maxId) {
                    res.status(400).json({
                        error: `ID ${id} is invalid. IDs must be integers between 1 and 10^9+7`,
                    });
                    return;
                }
            }

            // Validate priority
            if (
                !priority ||
                !Object.values(Priority).includes(priority as Priority)
            ) {
                res.status(400).json({
                    error: `Priority must be one of: ${Object.values(
                        Priority
                    ).join(", ")}`,
                });
                return;
            }

            // Create ingestion request
            const request: IngestRequest = {
                ids,
                priority: priority as Priority,
            };

            // Process the request
            const ingestionId = ingestionService.createIngestion(request);

            // Return the ingestion ID
            res.status(201).json({ ingestionId });
        } catch (error) {
            console.error("Error creating ingestion:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
};

export default ingestController;
