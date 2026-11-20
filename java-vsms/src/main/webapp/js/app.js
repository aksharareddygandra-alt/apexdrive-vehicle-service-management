/**
 * Vehicle Service Management System - Client-Side Validation & Interactive Helpers
 */

document.addEventListener("DOMContentLoaded", () => {
  // Enforce minimum preferred service date >= today
  const dateInput = document.getElementById("preferredDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  // Dynamic service price preview on booking form
  const serviceSelect = document.getElementById("serviceId");
  const priceDisplay = document.getElementById("estimatedChargeDisplay");
  if (serviceSelect && priceDisplay) {
    const updatePrice = () => {
      const selected = serviceSelect.options[serviceSelect.selectedIndex];
      const price = selected ? selected.getAttribute("data-price") : null;
      priceDisplay.textContent = price ? "$" + parseFloat(price).toFixed(2) : "$0.00";
    };
    serviceSelect.addEventListener("change", updatePrice);
    updatePrice();
  }

  // Table live search filtering
  const searchInput = document.getElementById("tableSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const term = event.target.value.toLowerCase();
      const rows = document.querySelectorAll("tbody tr[data-searchable]");
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? "" : "none";
      });
    });
  }
});

function validateRegistrationForm(form) {
  const fullName = form.fullName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  if (fullName.length < 2) {
    showFormError("Please enter your full name (at least 2 characters).");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormError("Please enter a valid email address.");
    return false;
  }
  if (phone.length < 7) {
    showFormError("Please enter a valid phone number.");
    return false;
  }
  if (password.length < 6) {
    showFormError("Password must be at least 6 characters long.");
    return false;
  }
  if (password !== confirmPassword) {
    showFormError("Passwords do not match.");
    return false;
  }
  return true;
}

function validateVehicleForm(form) {
  const regNo = form.registrationNumber.value.trim();
  const year = parseInt(form.manufacturingYear.value, 10);
  const currentYear = new Date().getFullYear() + 1;

  if (regNo.length < 4) {
    showFormError("Please enter a valid vehicle registration number.");
    return false;
  }
  if (isNaN(year) || year < 1960 || year > currentYear) {
    showFormError("Manufacturing year must be between 1960 and " + currentYear + ".");
    return false;
  }
  return true;
}

function showFormError(message) {
  let box = document.getElementById("clientValidationAlert");
  if (!box) {
    box = document.createElement("div");
    box.id = "clientValidationAlert";
    box.className = "alert alert-error";
    const main = document.querySelector("form");
    if (main) main.prepend(box);
  }
  box.textContent = message;
}
