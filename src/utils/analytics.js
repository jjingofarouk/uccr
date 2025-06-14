export const trackEvent = (action, category, label = '', value = 0) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (page_title, page_location) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-GLWW8HX76X', {
      page_title: page_title,
      page_location: page_location,
    });
  }
};

export const trackClick = (element_name, section) => {
  trackEvent('click', 'navigation', `${section}_${element_name}`);
};

export const trackEngagement = (action, section, details = '') => {
  trackEvent(action, 'engagement', `${section}_${details}`);
};