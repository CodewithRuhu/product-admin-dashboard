"use client";

import { useEffect, useState } from "react";

// value: jo bhi tez tez change ho raha hai (jaise search input text)
// delay: kitni der ruk ke update karna hai (ms mein)
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Har naye "value" par ek naya timer set karo
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CLEANUP: agar value delay khatam hone se pehle hi phir badal gayi,
    // to purana timer cancel kar do. Yahi debouncing ka core logic hai.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}