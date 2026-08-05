const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.8;

export interface CompressedImage {
  base64: string; // tanpa prefix "data:...;base64,"
  mimeType: string;
}

/**
 * Resize gambar ke maksimal 1024px di sisi terpanjang, lalu compress jadi
 * JPEG kualitas 80%. Ini dilakukan di browser (client-side) sebelum upload
 * supaya hemat bandwidth & token API, tanpa perlu library tambahan.
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const { width, height } = image;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(
      'Browser tidak mendukung pemrosesan gambar (canvas 2D context)',
    );
  }
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const base64 = compressedDataUrl.split(',')[1] ?? '';

  return { base64, mimeType: 'image/jpeg' };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = src;
  });
}
