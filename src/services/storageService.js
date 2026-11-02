// SNAVYO ALBUM STUDIO - Project & Asset Storage Service
// Powered by IndexedDB with graceful LocalStorage fallback

const DB_NAME = 'SnavyoAlbumStudioDB';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const STORE_ASSETS = 'assets';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_ASSETS)) {
        db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn('IndexedDB opening error, falling back to localStorage', request.error);
      resolve(null);
    };
  });
}

// LocalStorage fallback key
const LS_PROJECTS_KEY = 'snavyo_projects_store';

function getLocalStorageProjects() {
  try {
    const raw = localStorage.getItem(LS_PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read projects from localStorage:', err);
    return [];
  }
}

function saveLocalStorageProjects(projects) {
  try {
    localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
}

export const StorageService = {
  // Get all projects
  async getAllProjects() {
    try {
      const db = await openDatabase();
      if (!db) {
        return getLocalStorageProjects();
      }
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readonly');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          // Sort by updatedAt descending
          list.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
          resolve(list);
        };
        req.onerror = () => {
          resolve(getLocalStorageProjects());
        };
      });
    } catch (err) {
      console.error('Error fetching all projects:', err);
      return getLocalStorageProjects();
    }
  },

  // Get single project by id
  async getProject(id) {
    try {
      const db = await openDatabase();
      if (!db) {
        const list = getLocalStorageProjects();
        return list.find((p) => p.id === id) || null;
      }
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readonly');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result) {
            resolve(req.result);
          } else {
            const list = getLocalStorageProjects();
            resolve(list.find((p) => p.id === id) || null);
          }
        };
        req.onerror = () => {
          const list = getLocalStorageProjects();
          resolve(list.find((p) => p.id === id) || null);
        };
      });
    } catch (err) {
      console.error('Error getting project:', err);
      return null;
    }
  },

  // Save or update project
  async saveProject(project) {
    if (!project || !project.id) return false;
    const projectWithMeta = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    // Always mirror to localStorage for redundancy (without large photo binaries)
    try {
      const list = getLocalStorageProjects();
      const existingIdx = list.findIndex((p) => p.id === project.id);
      // Clean copy for localStorage
      const lightCopy = {
        ...projectWithMeta,
        photos: (projectWithMeta.photos || []).map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          width: p.width,
          height: p.height,
        })),
      };
      if (existingIdx >= 0) {
        list[existingIdx] = lightCopy;
      } else {
        list.unshift(lightCopy);
      }
      saveLocalStorageProjects(list);
    } catch (e) {
      // ignore
    }

    // Save full project in IndexedDB
    try {
      const db = await openDatabase();
      if (!db) return true;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readwrite');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.put(projectWithMeta);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (err) {
      console.error('Error saving project to IndexedDB:', err);
      return true;
    }
  },

  // Delete project
  async deleteProject(id) {
    // Remove from localStorage
    try {
      const list = getLocalStorageProjects();
      const updated = list.filter((p) => p.id !== id);
      saveLocalStorageProjects(updated);
    } catch (e) {
      // ignore
    }

    // Remove from IndexedDB
    try {
      const db = await openDatabase();
      if (!db) return true;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PROJECTS, 'readwrite');
        const store = tx.objectStore(STORE_PROJECTS);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (err) {
      console.error('Error deleting project:', err);
      return false;
    }
  },

  // Duplicate project
  async duplicateProject(id) {
    const original = await this.getProject(id);
    if (!original) return null;

    const duplicated = {
      ...JSON.parse(JSON.stringify(original)),
      id: 'snavyo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: `${original.name || 'Album Project'} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.saveProject(duplicated);
    return duplicated;
  },
};

