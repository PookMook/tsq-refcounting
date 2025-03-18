import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'

// Reference tracking data structures
// We'll use a Map of entity IDs to arrays of WeakRefs
const objectReferences = new Map<string, WeakRef<object>[]>();

/**
 * Computes a reference key for an object if it has __typename and id
 * @param data The object to check
 * @returns A string key in the format "__typename:id" or false if not a trackable entity
 */
function getReferenceKey(data: any): string | false {
  if (data && typeof data === 'object' && data.__typename && data.id) {
    return `${data.__typename}:${data.id}`;
  }
  return false;
}

/**
 * Traverses an object or array and either tracks or updates references to objects with __typename and id
 * @param data The object or array to traverse
 * @param isUpdate Whether to update existing references (true) or just track them (false)
 * @returns The original data (for chaining)
 */
function processReferences(data: any, isUpdate: boolean): any {
  if (!data || typeof data !== 'object') {
    return data; // Skip primitives, null, and undefined
  }

  // Check if this is a trackable entity (has __typename and id)
  const trackCode = getReferenceKey(data);
  
  if (trackCode) {
    if (isUpdate) {
      // UPDATE MODE: Update all references that haven't been garbage collected
      const weakRefs = objectReferences.get(trackCode);
      
      if (weakRefs) {
        for (let i = weakRefs.length - 1; i >= 0; i--) {
          const ref = weakRefs[i].deref();
          if (ref) {
            // The object still exists, update it
            Object.assign(ref, data);
          } else {
            // The object has been garbage collected, remove this WeakRef
            weakRefs.splice(i, 1);
          }
        }
        
        // If all references have been garbage collected, remove this entity
        if (weakRefs.length === 0) {
          objectReferences.delete(trackCode);
        }
      }
    } else {
      // TRACK MODE: Add this object to the tracked references
      if (!objectReferences.has(trackCode)) {
        objectReferences.set(trackCode, []);
      }
      
      const refs = objectReferences.get(trackCode);
      if (refs) {
        refs.push(new WeakRef(data));
      }
    }
  }

  // Recursively process arrays
  if (Array.isArray(data)) {
    for (const item of data) {
      processReferences(item, isUpdate);
    }
  } 
  // Recursively process object properties
  else {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        processReferences(data[key], isUpdate);
      }
    }
  }

  return data;
}

/**
 * Periodically checks for and removes empty reference arrays from the objectReferences map
 */
function cleanupReferences(): void {
  for (const [key, weakRefs] of objectReferences.entries()) {
    // Filter out any WeakRefs whose objects have been garbage collected
    const validRefs = weakRefs.filter(weakRef => weakRef.deref() !== undefined);
    
    if (validRefs.length === 0) {
      // All objects have been garbage collected, remove this entity
      objectReferences.delete(key);
    } else if (validRefs.length < weakRefs.length) {
      // Some objects have been garbage collected, update the array
      objectReferences.set(key, validRefs);
    }
  }
}

// Set up periodic cleanup
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let cleanupIntervalId: number | null = null;

/**
 * Gets all references to a specific entity
 * @param entity An entity identifier string
 * @returns Array of objects or undefined if not tracked
 */
export function getReferences(entity: string): object[] | undefined {
  const weakRefs = objectReferences.get(entity);
  if (!weakRefs) return undefined;
  
  // Return only the objects that haven't been garbage collected
  return weakRefs
    .map(weakRef => weakRef.deref())
    .filter((obj): obj is object => obj !== undefined);
}

const queryCache = new QueryCache({
  onSuccess: (data) => {
    // Track references in successful query results
    processReferences(data, false);
  },
})

const mutationCache = new MutationCache({
  onSuccess: (data) => {
    // Track references in successful mutation results
    processReferences(data, true);
  },
})

const queryClient = new QueryClient({
  queryCache,
  mutationCache,
})

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  // Start cleanup when Provider mounts
  React.useEffect(() => {
    cleanupIntervalId = setInterval(cleanupReferences, CLEANUP_INTERVAL);
    
    // Clean up interval when Provider unmounts
    return () => {
      if (cleanupIntervalId) {
        clearInterval(cleanupIntervalId);
        cleanupIntervalId = null;
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
