export class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "ea7dc041-453a-47d1-92f9-2ec7e3393acf",
      }
    })
      .then(res => res.json())
  }

  // other methods for working with the API
}

// export the class