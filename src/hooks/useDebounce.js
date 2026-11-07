import { useState, useEffect } from 'react';

/**
 * Delays updating a value until `delay` ms have passed without it changing.
 * Prevents spamming the geocoding API on every keystroke.
 *
 * @param {any}    value – The value to debounce (usually the search input string)
 * @param {number} delay – Milliseconds to wait (default 400ms)
 * @returns {any}        – The debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cancel the timer if value changes before the delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
