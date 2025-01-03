export interface DetectionResult {
  class_id: number;
  class_name: string;
  confidence: number;
}

export interface DetectionResponse {
  results: DetectionResult[];
  processing_time: number;
}
