'use client';

import { useEffect } from 'react';

export default function BlogScrollTrigger() {
  useEffect(() => {
    // Small delay to let the page fully render before scrolling
    const timer = setTimeout(() => {
      const el = document.getElementById('blog-list');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
