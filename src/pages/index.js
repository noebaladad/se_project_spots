import "./index.css";

import { resetValidation, enableValidation, settings } from "../scripts/validation.js";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const initialCards = [
  {name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
  {name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
  {name: "A very long bridge, over the forest", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
  {name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
  {name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name: "Golden Gate Bridge", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"},
];


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ea7dc041-453a-47d1-92f9-2ec7e3393acf",
    "Content-Type": "application/json"
  }
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
  console.log(cards);
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
    if (userInfo && userInfo.name && userInfo.about) {
      const avatarImage = document.querySelector("#avatar");
      avatarImage.src = userInfo.avatar;

      const userName = document.querySelector(".profile__name");
      userName.textContent = userInfo.name;

      const userTitle = document.querySelector(".profile__description");
      userTitle.textContent = userInfo.about;
    } else {
      console.error("User information is missing necessary properties.")
    }
})
.catch(console.error);


console.log(initialCards);

// Profile elements
const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__new-post");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description")

// Edit form elements
const editModal = document.querySelector("#edit-profile-modal");
const editProfileFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-button");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

// Card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardFormElement = cardModal.querySelector(".modal__form");
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardModalLinkInput = cardModal.querySelector("#add-card-link-input");
const cardModalCaptionInput = cardModal.querySelector("#add-card-name-input");

// Avatar form element
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarModalCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input")

// card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// Delete elements
const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = document.querySelector(".modal__form");

// Preview image popup elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image")
const previewModalCaptionEl = previewModal.querySelector(".modal__caption")
const previewModalCloseButton = previewModal.querySelector(".modal__close-button-preview");

const closeButtons = document.querySelectorAll(".modal__close");

function handleLike(evt, id, cardLikeButton) {
  const isLiked = cardLikeButton.classList.contains("card__like-button_liked");

  api
    .handleLikeStatus(id, isLiked)
    .then(() => {
      cardLikeButton.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

previewModalCloseButton.addEventListener("click", () => {
  closeModal(previewModal);
})

let selectedCard, selectedCardId;

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", modalEscClose);
  modal.addEventListener("mousedown", modalOverlayClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", modalEscClose);
  modal.removeEventListener("mousedown", modalOverlayClose);
}

function modalEscClose(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

function modalOverlayClose(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;

  setButtonText(submitButton, true, "Save", "Saving...");

  const updatedUserInfo = {
    name: editModalNameInput.value,
    about: editModalDescriptionInput.value,
  };

  api
    .editUserInfo({ name: editModalNameInput.value, about: editModalDescriptionInput.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
        submitButton.textContent = "Save";
        setButtonText(cardSubmitButton, false);
      });
}

profileEditButton.addEventListener("click", () => {
  console.log("Edit button clicked");
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editProfileFormElement, [editModalNameInput, editModalDescriptionInput]
    , settings);
  openModal(editModal);
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener('click', () => closeModal(popup));
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

editProfileFormElement.addEventListener("submit", handleEditFormSubmit);
console.log(editProfileFormElement);

cardFormElement.addEventListener("submit", handleAddCardSubmit);

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarFormElement.addEventListener("submit", handleAvatarSubmit);

deleteFormElement.addEventListener("submit", handleDeleteSubmit);

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {name: cardModalCaptionInput.value, link: cardModalLinkInput.value};
  const cardElement = getCardElement(inputValues);
  cardFormElement.reset();
  disableButton(cardSubmitButton, settings);
  closeModal(cardModal);

  api
    .createCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      setButtonText(cardSubmitButton, true);
      closeModal(cardModal);
    })
    .catch((error) => {
      console.error(error);
      setButtonText(cardSubmitButton, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
    api
      .editAvatarInfo(avatarInput.value)
      .then((data) => {
        console.log(data.avatar)
        const avatarImage = document.querySelector(".profile__avatar");
          avatarImage.src = data.avatar;
          setButtonText(cardSubmitButton, true);

          closeModal(avatarModal);
      })
      .catch(console.error);
      setButtonText(cardSubmitButton, false);
};

function getCardElement(data) {
  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", (evt) =>
    handleLike(evt, data._id, cardLikeButton));

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id, cardDeleteButton));

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function handleDeleteCard(cardElement, cardId, cardDeleteButton) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);

  setButtonText(cardDeleteButton, true, "Delete", "Deleting...");
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  if (avatarDeleteButton) {
    setButtonText(cardDeleteButton, true, "Delete", "Deleting...");
  }

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();

      closeModal(deleteModal);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setButtonText(cardDeleteButton, true, "Delete", "Deleting...");
    });
}



enableValidation(settings);