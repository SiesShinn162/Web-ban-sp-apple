

export const toast = {
  show(message, type = 'success', duration = 3000) {

    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-16 right-4 z-[9999] flex flex-col gap-sm max-w-sm w-full pointer-events-none';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('role', 'status');
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `
      p-md rounded-lg shadow-xl text-caption-apple text-white font-medium pointer-events-auto
      transform translate-x-full transition-transform duration-300 flex items-center gap-xs
      ${type === 'success' ? 'bg-emerald-500 border-l-4 border-emerald-700' : 'bg-red-500 border-l-4 border-red-700'}
    `;

    const icon = type === 'success' ? '✓' : '⚠';
    toastEl.innerHTML = `
      <span class="text-body-strong font-bold">${icon}</span>
      <span class="flex-grow">${message}</span>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.classList.remove('translate-x-full');
    }, 10);

    setTimeout(() => {
      toastEl.classList.add('translate-x-full');
      toastEl.addEventListener('transitionend', () => {
        toastEl.remove();
      });
    }, duration);
  }
};
export default toast;
