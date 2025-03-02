'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LuCircleAlert, LuCamera } from 'react-icons/lu';

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
    <div className="mx-auto max-w-2xl">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <LuCircleAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card className="relative overflow-hidden rounded-lg">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMediaError={handleUserMediaError}
          className="h-auto w-full"
          mirrored={false}
        />
        <div className="absolute right-4 bottom-4">
          <LuCamera className="text-muted-foreground h-6 w-6 drop-shadow-lg" />
        </div>
      </Card>
    </div>
  );
}
