// Copy code button functionality
export function initCodeCopyButtons() {
  const buttons = document.querySelectorAll('.copy-code-btn');
  
  buttons.forEach((button: Element) => {
    button.addEventListener('click', async (e: Event) => {
      const wrapper = (button as HTMLElement).closest('.code-block-wrapper') as HTMLElement;
      if (!wrapper) return;
      
      const codeText = wrapper.getAttribute('data-code');
      if (!codeText) return;
      
      // Decode the escaped code
      const decodedCode = codeText
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
      
      try {
        await navigator.clipboard.writeText(decodedCode);
        
        // Show copied state
        const copyIcon = (button as HTMLElement).querySelector('.copy-icon');
        const checkIcon = (button as HTMLElement).querySelector('.check-icon');
        
        if (copyIcon) copyIcon.classList.add('hidden');
        if (checkIcon) checkIcon.classList.remove('hidden');
        (button as HTMLElement).classList.add('copied');
        
        // Reset after 2 seconds
        setTimeout(() => {
          if (copyIcon) copyIcon.classList.remove('hidden');
          if (checkIcon) checkIcon.classList.add('hidden');
          (button as HTMLElement).classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });
}
