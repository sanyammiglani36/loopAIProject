import { v4 as uuidv4 } from 'uuid';
import { Ingestion, IngestRequest, Status, Batch } from '../models/types';
import store from '../models/store';
import { createBatches, fetchDataFromExternalApi } from '../utils/helpers';

class IngestionService {
  private isProcessing: boolean = false;
  private lastProcessedTime: number = 0;

  createIngestion(request: IngestRequest): string {
    const { ids, priority } = request;
    
    const ingestionId = uuidv4();
    
    const batches = createBatches(ids);
    
    const ingestion: Ingestion = {
      ingestionId,
      batches,
      priority,
      createdAt: new Date(),
      status: Status.YET_TO_START
    };
    
    store.addIngestion(ingestion);
    
    if (!this.isProcessing) {
      this.processNextBatch();
    }
    
    return ingestionId;
  }

  private async processNextBatch(): Promise<void> {
    this.isProcessing = true;
    
    try {
      const queue = store.getIngestionQueue();
      
      if (queue.length === 0) {
        this.isProcessing = false;
        return;
      }
      
      const nextBatch = queue[0];
      const { ingestionId, batchId, ids } = nextBatch;
      
      const now = Date.now();
      const timeSinceLastProcessed = now - this.lastProcessedTime;
      const requiredWaitTime = 5000;
      
      if (this.lastProcessedTime > 0 && timeSinceLastProcessed < requiredWaitTime) {
        const timeToWait = requiredWaitTime - timeSinceLastProcessed;
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }
      
      store.updateBatchStatus(ingestionId, batchId, Status.TRIGGERED);
      
      const processingPromises = ids.map(id => fetchDataFromExternalApi(id));
      await Promise.all(processingPromises);
      
      store.updateBatchStatus(ingestionId, batchId, Status.COMPLETED);
      
      this.lastProcessedTime = Date.now();
      
      setImmediate(() => this.processNextBatch());
    } catch (error) {
      console.error('Error processing batch:', error);
      this.isProcessing = false;
      
      setTimeout(() => {
        if (!this.isProcessing) {
          this.processNextBatch();
        }
      }, 5000);
    }
  }
}

const ingestionService = new IngestionService();

export default ingestionService; 