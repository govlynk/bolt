export function debounce(func, wait) {
  let timeout;

  const debounced = function (...args) {
    const later = () => {
      timeout = null;
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
  };

  return debounced;
}