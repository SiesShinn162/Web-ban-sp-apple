

export const modal = {
  create({ title, contentHtml, onClose }) {

    const existingModal = document.getElementById('istore-modal');
    if (existingModal) existingModal.remove();

    const modalEl = document.createElement('div');
    modalEl.id = 'istore-modal';
    modalEl.className = 'fixed inset-0 z-[9990] flex items-center justify-center p-md bg-black/50 backdrop-blur-sm transition-opacity duration-300 opacity-0';

    modalEl.innerHTML = `
      <div class="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl transform scale-95 transition-transform duration-300 flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="px-lg py-md border-b border-neutral-100 flex justify-between items-center bg-canvas-parchment">
          <h3 class="text-tagline text-ink font-semibold">${title}</h3>
          <button id="modal-close-btn" class="text-neutral-400 hover:text-ink w-8 h-8 rounded-full flex justify-center items-center hover:bg-neutral-200 transition-colors btn-press-effect">
            ✕
          </button>
        </div>
        <!-- Body -->
        <div class="px-lg py-lg overflow-y-auto flex-grow text-body-apple text-neutral-600">
          ${contentHtml}
        </div>
      </div>
    `;

    document.body.appendChild(modalEl);

    setTimeout(() => {
      modalEl.classList.remove('opacity-0');
      modalEl.querySelector('.transform').classList.remove('scale-95');
    }, 10);

    const closeModal = () => {
      modalEl.classList.add('opacity-0');
      modalEl.querySelector('.transform').classList.add('scale-95');
      modalEl.addEventListener('transitionend', () => {
        modalEl.remove();
        if (onClose) onClose();
      });
    };

    modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeModal();
    });

    return { close: closeModal };
  }
};
export default modal;
