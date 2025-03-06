'use client';

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { DetectionResult } from '@/types/detection';
import { motion, AnimatePresence } from 'motion/react';

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
    <div className="mt-4 space-y-3 md:mt-6 md:space-y-4">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold md:text-2xl">Detected Signs</h2>
        {processingTime && (
          <Badge variant="secondary" className="text-xs font-medium md:text-sm">
            {processingTime.toFixed(2)}ms
          </Badge>
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        <AnimatePresence mode="sync">
          {detections.map((detection, index) => (
            <motion.div
              key={`${detection.class_id}-${index}-${detection.confidence}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.15,
              }}
              layout="position"
            >
              <Card className="border-l-primary overflow-hidden border-l-4 p-3 shadow-sm transition-all hover:shadow-md md:p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium md:text-base">
                      {detection.class_name}
                    </h3>
                    <div className="mt-1 flex items-center">
                      <div className="bg-secondary h-1.5 w-16 overflow-hidden rounded-full md:h-2 md:w-20">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${detection.confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-muted-foreground ml-2 text-xs md:text-sm">
                        {(detection.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-secondary/50 text-xs">
                    ID: {detection.class_id}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {detections.length === 0 && (
          <motion.div
            className="border-muted col-span-1 rounded-lg border border-dashed p-6 text-center sm:col-span-2 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-muted-foreground text-sm md:text-base">
              No traffic signs detected
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
