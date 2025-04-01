export function setButtonText(button, isLoading, defaultText = "Save", loadingText = "Saving...") {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = defaultText;
    button.disabled = false;
  }
}