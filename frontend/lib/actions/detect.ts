'use server';
export async function detectTrafficSigns(formData: FormData) {
  try {
    console.log('Sending request to detection API...');

    const response = await fetch('http://localhost:8000/detect', {
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
    return { success: true, data };
  } catch (error) {
    console.error('Detection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process image',
    };
  }
}
