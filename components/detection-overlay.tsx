'use client';

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DetectionResult } from '@/types/detection';

interface DetectionOverlayProps {
  detections: DetectionResult[];
  processingTime?: number;
  audioEnabled: boolean;
}

export function DetectionOverlay({
  detections,
  processingTime,
  audioEnabled,
}: DetectionOverlayProps) {
  useEffect(() => {
    if (audioEnabled && detections.length > 0 && 'speechSynthesis' in window) {
      const text = detections
        .map((d) => `${d.class_name}, ${(d.confidence * 100).toFixed(0)}%`)
        .join(', ');

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2; // Slightly faster
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    }
  }, [detections, audioEnabled]);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">
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
                <h3 className="text-foreground font-medium">
                  {detection.class_name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  Confidence: {(detection.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <Badge>{detection.class_id}</Badge>
            </div>
          </Card>
        ))}

        {detections.length === 0 && (
          <p className="text-muted-foreground col-span-2 py-4 text-center">
            No traffic signs detected
          </p>
        )}
      </div>
    </div>
  );
}
