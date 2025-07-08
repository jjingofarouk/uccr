let DOMPurify;

if (typeof window !== 'undefined') {
  // Running on client
  DOMPurify = require('dompurify');
} else {
  // Avoid jsdom on serverless platforms like Vercel
  DOMPurify = {
    sanitize: (html) => html, // no-op or return raw HTML
  };
}

export const sanitize = (html) => {
  return DOMPurify.sanitize(html);
};