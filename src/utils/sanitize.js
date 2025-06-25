import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const createDOMPurify = () => {
  if (typeof window === 'undefined') {
    const { window } = new JSDOM('');
    return DOMPurify(window);
  }
  return DOMPurify;
};

export const sanitize = (html) => {
  const purify = createDOMPurify();
  return purify.sanitize(html);
};