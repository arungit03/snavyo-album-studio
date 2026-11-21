//
// Upload + Firebase Storage helpers.
// Kept separate from the legacy IndexedDB StorageService in src/services/storageService.js
// so the editor keeps working while the order flow moves to Firebase.
//

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase';

/**
 * Upload a file with progress reporting.
 * @param {File} file
 * @param {string} path - Storage path, e.g. `drafts/${draftId}/photos/${name}`
 * @param {(percent:number)=>void} [onProgress]
 * @returns {Promise<string>} download URL
 */
export function uploadWithProgress(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      cacheControl: 'public,max-age=31536000',
      contentType: file.type || 'image/jpeg',
    });
    task.on(
      'state_changed',
      (snap) => {
        if (onProgress && snap.totalBytes) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      (err) => reject(err),
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}

/** Upload a thumbnail/data URL by converting it to a Blob first. */
export async function uploadDataUrl(dataUrl, path, onProgress) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return uploadWithProgress(blob, path, onProgress);
}

/** Delete a file by its Storage path. Errors are swallowed (best effort). */
export async function deleteFile(path) {
  try {
    await deleteObject(ref(storage, path));
    return true;
  } catch (err) {
    return false;
  }
}
