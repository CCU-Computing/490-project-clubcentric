function toggleBox(element) {
    const details = element.querySelector('.club-details');
    const isVisible = details.style.display === "block";

    // Toggle visibility
    details.style.display = isVisible ? "none" : "block";
}
