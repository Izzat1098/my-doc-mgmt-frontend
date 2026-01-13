/**
 * S3-related operations for direct AWS S3 interactions
 */

// Upload file to S3
export async function uploadToS3(
  uploadUrl: string,
  file: File
): Promise<boolean> {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file to S3: ${response.statusText}`);
  }

  return true;
}
