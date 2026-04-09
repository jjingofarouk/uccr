/**
 * Strips HTML tags from a string.
 * @param {string} html - The string containing HTML tags.
 * @returns {string} - The sanitized plain text string.
 */
export const stripHtml = (html) => {
  if (!html) return '';
  // Remove HTML tags using regex
  return html.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Sanitizes a title by removing unwanted tags and extra whitespace.
 * @param {string} title - The title to sanitize.
 * @returns {string} - The clean title.
 */
export const sanitizeTitle = (title) => {
  if (!title) return 'Untitled Case';
  
  // First strip HTML
  let clean = stripHtml(title);
  
  // Then remove any leading/trailing p tags or other common leftovers if any
  // (though stripHtml should handle most)
  
  return clean;
};
