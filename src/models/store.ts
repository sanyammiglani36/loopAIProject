import { Ingestion, Batch, Status, Priority } from './types';

class InMemoryStore {
  private ingestions: Map<string, Ingestion>;
  
  constructor() {
    this.ingestions = new Map<string, Ingestion>();
  }

  addIngestion(ingestion: Ingestion): void {
    this.ingestions.set(ingestion.ingestionId, ingestion);
  }

  getIngestion(ingestionId: string): Ingestion | undefined {
    return this.ingestions.get(ingestionId);
  }

  updateBatchStatus(ingestionId: string, batchId: string, status: Status): void {
    const ingestion = this.ingestions.get(ingestionId);
    if (ingestion) {
      const batch = ingestion.batches.find(b => b.batchId === batchId);
      if (batch) {
        batch.status = status;
        this.updateIngestionStatus(ingestionId);
      }
    }
  }

  private updateIngestionStatus(ingestionId: string): void {
    const ingestion = this.ingestions.get(ingestionId);
    if (ingestion) {
      const allCompleted = ingestion.batches.every(b => b.status === Status.COMPLETED);
      const anyTriggered = ingestion.batches.some(b => b.status === Status.TRIGGERED);
      
      if (allCompleted) {
        ingestion.status = Status.COMPLETED;
      } else if (anyTriggered) {
        ingestion.status = Status.TRIGGERED;
      } else {
        ingestion.status = Status.YET_TO_START;
      }
    }
  }

  getIngestionQueue(): { ingestionId: string; batchId: string; ids: number[]; priority: Priority; createdAt: Date }[] {
    const queue: { ingestionId: string; batchId: string; ids: number[]; priority: Priority; createdAt: Date }[] = [];
    
    this.ingestions.forEach(ingestion => {
      ingestion.batches
        .filter(batch => batch.status === Status.YET_TO_START)
        .forEach(batch => {
          queue.push({
            ingestionId: ingestion.ingestionId,
            batchId: batch.batchId,
            ids: batch.ids,
            priority: ingestion.priority,
            createdAt: batch.createdAt
          });
        });
    });
    
    return queue.sort((a, b) => {
      const priorityOrder = { [Priority.HIGH]: 0, [Priority.MEDIUM]: 1, [Priority.LOW]: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff === 0) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
      
      return priorityDiff;
    });
  }
}

const store = new InMemoryStore();

export default store; 