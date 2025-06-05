import { Request, Response } from "express";
import store from "../models/store";
import { StatusResponse } from "../models/types";

const statusController = {
    getStatus: (req: Request, res: Response) => {
        try {
            const { ingestionId } = req.params;

            const ingestion = store.getIngestion(ingestionId);

            if (!ingestion) {
                res.status(404).json({
                    error: `Ingestion with ID ${ingestionId} not found`,
                });
                return;
            }

            const response: StatusResponse = {
                ingestionId: ingestion.ingestionId,
                status: ingestion.status,
                batches: ingestion.batches.map((batch) => ({
                    batchId: batch.batchId,
                    ids: batch.ids,
                    status: batch.status,
                })),
            };

            res.json(response);
        } catch (error) {
            console.error("Error getting ingestion status:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
};

export default statusController;
