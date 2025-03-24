'use server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DetectionResult } from '@/types/detection';

export async function detectTrafficSigns(formData: FormData) {
  try {
    console.log('Sending request to detection API...');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error(`API responded with status ${response.status}`);
      throw new Error(`Detection failed with status: ${response.status}`);
    }
    let data;
    try {
      data = await response.json();
      console.log('API response received:', JSON.stringify(data));
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      throw new Error('Failed to parse detection results');
    }
    if (!data || !Array.isArray(data.results)) {
      console.error('Invalid response structure:', data);
      throw new Error('Unexpected API response format');
    }

    // Store detections for authenticated users
    const session = await auth();
    if (session && session.user && session.user.id && data.results.length > 0) {
      await prisma.detection.createMany({
        data: data.results.map((detection: DetectionResult) => ({
          classId: detection.class_id,
          className: detection.class_name,
          confidence: detection.confidence,
          userId: session.user.id,
        })),
      });
      console.log(
        `${data.results.length} detections stored in database for user:`,
        session.user.id,
      );
    }

    return { success: true, data };
  } catch (error) {
    console.error('Detection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image',
    };
  }
}
