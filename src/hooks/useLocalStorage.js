import { useState, useCallback } from 'react';

/**
 * A drop-in replacement for `useState` that persists the value in localStorage.
 * Values are JSON-serialised, so any JSON-compatible type is supported.
 *
 * The returned `setValue` is stable (created with useCallback + functional update)
 * so it is safe to include in dependency arrays of useEffect and useCallback.
 *
 * @template T
 * @param {string} key           - The localStorage key
 * @param {T}      initialValue  - Value used when no persisted entry exists yet
 * @returns {[T, Function, Function]} - [storedValue, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(`[useLocalStorage] Failed to read "${key}":`, err);
      return initialValue;
    }
  });

  // Stable setter: uses functional update so it doesn't depend on storedValue
  const setValue = useCallback(
    (value) => {
      setStoredValue((prevStored) => {
        const valueToStore =
          value instanceof Function ? value(prevStored) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
          console.error(`[useLocalStorage] Failed to write "${key}":`, err);
        }
        return valueToStore;
      });
    },
    [key] // key never changes between renders — setValue is therefore stable
  );

  const removeValue = useCallback(() => {
    setStoredValue(initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      console.error(`[useLocalStorage] Failed to remove "${key}":`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
