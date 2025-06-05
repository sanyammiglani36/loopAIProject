export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

export enum Status {
  YET_TO_START = 'yet_to_start',
  TRIGGERED = 'triggered',
  COMPLETED = 'completed'
}

export interface IngestRequest {
  ids: number[];
  priority: Priority;
}

export interface Batch {
  batchId: string;
  ids: number[];
  status: Status;
  createdAt: Date;
}

export interface Ingestion {
  ingestionId: string;
  batches: Batch[];
  priority: Priority;
  createdAt: Date;
  status: Status;
}

export interface IngestResponse {
  ingestionId: string;
}

export interface StatusResponse {
  ingestionId: string;
  status: Status;
  batches: {
    batchId: string;
    ids: number[];
    status: Status;
  }[];
} 