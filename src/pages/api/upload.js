export const uploadImage = async (file, userId, folder = `cases/${userId}`) => {
  if (!file || !userId) {
    throw new Error('File and userId are required');
  }
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'X-User-Id': userId,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed');
  }
  return data.url;
};