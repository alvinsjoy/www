'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert, LuCamera, LuScan } from 'react-icons/lu';
import { motion, AnimatePresence } from 'motion/react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface CameraFeedProps {
  onFrame: (formData: FormData) => void;
  isProcessing: boolean;
}

export function CameraFeed({ onFrame, isProcessing }: CameraFeedProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string>('');

  const videoConstraints = {
    facingMode: 'environment',
    width: 640,
    height: 480,
  };

  const capture = useCallback(async () => {
    if (!isProcessing && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const base64Response = await fetch(imageSrc);
        const blob = await base64Response.blob();

        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');

        onFrame(formData);
      }
    }
  }, [onFrame, isProcessing]);

  React.useEffect(() => {
    const interval = setInterval(capture, 1000);
    return () => clearInterval(interval);
  }, [capture]);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.log('Camera error:', error);
    setError(
      "Camera access denied. Please ensure you've granted camera permissions.",
    );
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Alert
              variant="destructive"
              className="mb-3 text-sm md:mb-4 md:text-base"
            >
              <LuCircleAlert className="h-3 w-3 md:h-4 md:w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative min-h-[15rem] md:min-h-[20rem]">
          <div className="relative h-full rounded-lg border p-1 md:rounded-2xl md:p-2">
            <GlowingEffect
              blur={0}
              borderWidth={2.5}
              spread={60}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              movementDuration={1.5}
            />

            <div className="border-0.5 md:border-0.75 bg-background relative flex h-full flex-col justify-between overflow-hidden rounded-md p-0.5 md:rounded-xl md:p-1">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMediaError={handleUserMediaError}
                className="h-auto w-full rounded-md md:rounded-lg"
                mirrored={false}
              />

              <div className="bg-background/80 absolute right-2 bottom-2 flex items-center gap-1 rounded-full px-2 py-1 backdrop-blur md:right-4 md:bottom-4 md:gap-2 md:px-3 md:py-1.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full md:h-2 md:w-2 ${isProcessing ? 'bg-primary animate-pulse' : 'bg-green-500'}`}
                ></div>
                <LuCamera className="h-3 w-3 md:h-4 md:w-4" />
              </div>

              {isProcessing && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <LuScan className="text-primary/80 h-6 w-6 animate-pulse md:h-8 md:w-8" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
