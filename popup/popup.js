document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('image-container');
  const img = document.getElementById('zoom-image');
  const status = document.getElementById('status');
  const body = document.body;

  // Set initial dark theme styles
  body.style.backgroundColor = '#1a1a1a';
  container.style.backgroundColor = '#2d2d2d';
  status.style.color = '#b0b0b0';

  // Get the zoom lens image
  browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    browser.tabs.executeScript(tabs[0].id, {
      code: `
        const zoomLens = document.querySelector('.zoomLens');
        if (zoomLens) {
          const bgImage = window.getComputedStyle(zoomLens).backgroundImage;
          bgImage.replace(/^url\\(["']?/, '').replace(/["']?\\)$/, '');
        } else {
          null;
        }
      `
    }).then((results) => {
      const imageUrl = results[0];
      
      if (imageUrl) {
        // Clean the filename
        const cleanedUrl = imageUrl.replace(/(_p\d+)(?=\.\w+$)/, '');
        img.src = cleanedUrl;
        
        img.onload = function() {
          status.style.display = 'none';
          img.style.display = 'block';
          
          // Calculate appropriate popup size based on image dimensions
          const maxWidth = 600;  // Maximum popup width
          const maxHeight = 600; // Maximum popup height
          const padding = 20;    // Padding around image
          
          let width = this.naturalWidth + padding;
          let height = this.naturalHeight + padding;
          
          // Constrain to max dimensions while maintaining aspect ratio
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width = width * ratio;
          }
          
          // Apply calculated dimensions
          container.style.width = `${width}px`;
          container.style.height = `${height}px`;
          body.style.width = `${width}px`;
          body.style.height = `${height}px`;
        };
        
        img.onerror = function() {
          // Fallback to original URL if cleaned version fails
          img.src = imageUrl;
          img.onerror = () => {
            status.textContent = 'Failed to load image';
            status.style.color = '#ff6b6b';
          };
        };
      } else {
        status.textContent = 'No zoomLens element found';
        status.style.color = '#ff6b6b';
      }
    }).catch((error) => {
      status.textContent = 'Error: ' + error.message;
      status.style.color = '#ff6b6b';
    });
  });
});