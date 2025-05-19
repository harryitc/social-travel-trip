/**
 * Utility to fix zoom behavior in scrollable areas
 * This script helps to ensure that when zooming with the mouse wheel,
 * the zoom happens from the cursor position rather than from the center of the page
 */

// Function to apply zoom fix to all scrollable areas
export function applyZoomFix() {
  if (typeof window === 'undefined') return;

  // Wait for DOM to be fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    // Find all scrollable elements
    const scrollableElements = document.querySelectorAll(
      '[data-radix-scroll-area-viewport], .scrollarea-viewport, .scrollable-content'
    );

    scrollableElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        // Set transform origin to top left
        element.style.transformOrigin = '0 0';
        
        // Add data attribute for CSS targeting
        element.setAttribute('data-zoom-fix', 'true');
      }
    });

    // Add wheel event listener to handle zoom behavior
    document.addEventListener('wheel', handleZoomWheel, { passive: false });
  });
}

// Function to handle wheel events for zooming
function handleZoomWheel(event: WheelEvent) {
  // Check if Ctrl key is pressed (zoom gesture)
  if (event.ctrlKey) {
    // Find the element under the cursor
    const elementUnderCursor = document.elementFromPoint(event.clientX, event.clientY);
    
    // Find closest scrollable parent
    const scrollableParent = findScrollableParent(elementUnderCursor);
    
    if (scrollableParent && scrollableParent.hasAttribute('data-zoom-fix')) {
      // Let the browser handle the zoom, but ensure it's from the right origin point
      scrollableParent.style.transformOrigin = `${event.clientX}px ${event.clientY}px`;
    }
  }
}

// Helper function to find the closest scrollable parent
function findScrollableParent(element: Element | null): HTMLElement | null {
  if (!element) return null;
  
  // Check if the element itself is scrollable
  if (
    element.hasAttribute('data-radix-scroll-area-viewport') ||
    element.classList.contains('scrollarea-viewport') ||
    element.classList.contains('scrollable-content')
  ) {
    return element as HTMLElement;
  }
  
  // Recursively check parent elements
  return findScrollableParent(element.parentElement);
}

// Export a function to initialize the zoom fix
export function initZoomFix() {
  if (typeof window !== 'undefined') {
    applyZoomFix();
  }
}

export default initZoomFix;
