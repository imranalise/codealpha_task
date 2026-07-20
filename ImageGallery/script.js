document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  let currentIndex = 0;
  let visibleItems = [];

  // --- Filtering Logic ---
  function filterImages(category) {
    visibleItems = []; // Reset array
    galleryItems.forEach((item) => {
      if (
        category === "all" ||
        item.getAttribute("data-category") === category
      ) {
        item.classList.add("show");
        // Store the item in our array of currently visible images
        visibleItems.push(item);
        // Assign a dynamic index for lightbox navigation
        item.dataset.visibleIndex = visibleItems.length - 1;
      } else {
        item.classList.remove("show");
        item.removeAttribute("data-visible-index");
      }
    });
  }

  // Initialize gallery showing all images
  filterImages("all");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");
      // Filter images
      filterImages(btn.getAttribute("data-filter"));
    });
  });

  // --- Lightbox Logic ---
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      lightboxImg.src = img.src;
      // Get the index of the clicked item relative to the filtered view
      currentIndex = parseInt(item.dataset.visibleIndex);
      lightbox.classList.add("active");
    });
  });

  // Close Lightbox
  closeBtn.addEventListener("click", () => lightbox.classList.remove("active"));

  // Close if clicking outside the image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  // --- Navigation Logic ---
  function updateLightboxImage() {
    // Add a quick fade out/in effect for image transition
    lightboxImg.style.opacity = 0;
    setTimeout(() => {
      const currentItem = visibleItems[currentIndex];
      lightboxImg.src = currentItem.querySelector("img").src;
      lightboxImg.style.opacity = 1;
    }, 150);
  }

  prevBtn.addEventListener("click", () => {
    // Go back, wrap to the end if at the beginning
    currentIndex =
      currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
    updateLightboxImage();
  });

  nextBtn.addEventListener("click", () => {
    // Go forward, wrap to the start if at the end
    currentIndex =
      currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
    updateLightboxImage();
  });

  // Keyboard navigation (Arrow keys to navigate, Esc to close)
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "Escape") closeBtn.click();
  });
});
