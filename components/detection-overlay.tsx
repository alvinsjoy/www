'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DetectionResult } from '@/types/detection';

interface DetectionOverlayProps {
  detections: DetectionResult[];
  processingTime?: number;
}

export function DetectionOverlay({
  detections,
  processingTime,
}: DetectionOverlayProps) {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Detected Signs
        </h2>
        {processingTime && (
          <Badge variant="secondary">{processingTime.toFixed(2)}ms</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {detections.map((detection, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  {detection.class_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <Badge>{detection.class_id}</Badge>
            </div>
          </Card>
        ))}

        {detections.length === 0 && (
          <p className="col-span-2 py-4 text-center text-muted-foreground">
            No traffic signs detected
          </p>
        )}
      </div>
    </div>
  );
}
