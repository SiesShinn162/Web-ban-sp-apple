
export function renderGlassCard(contentHtml, isDark = false, extraClasses = '') {
  const baseClass = isDark ? 'glass-card-dark text-white' : 'glass-card-light text-ink';
  return `
    <div class="p-lg ${baseClass} ${extraClasses}">
      ${contentHtml}
    </div>
  `;
}
