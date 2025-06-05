import { v4 as uuidv4 } from 'uuid';
import { Batch, Status } from '../models/types';

export const createBatches = (ids: number[]): Batch[] => {
  const batches: Batch[] = [];
  const batchSize = 3;
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize);
    
    batches.push({
      batchId: uuidv4(),
      ids: batchIds,
      status: Status.YET_TO_START,
      createdAt: new Date()
    });
  }
  
  return batches;
};

export const fetchDataFromExternalApi = async (id: number): Promise<{ id: number; data: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    id,
    data: "processed"
  };
}; 