const alerts = {
  instructionalAlert: {
    title: "Find recipes for your ingredients",
    text: `Looking for recipes that use specific ingredients? Tired of wasting food that you forgot to use? Get some recipe ideas for ingredients you have at home with our recipe search.`,
    imageUrl: 'https://media.treehugger.com/assets/images/2020/04/getting_ingredients_out_of_the_fridge.jpg.600x315_q90_crop-smart.jpg',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Popup_image',
    confirmButtonText: "START NOW",
    confirmButtonColor: '#505050',
  },

  warnings: {
    addIngredient: {
      title: "Search and find ingredient.",
      text: "Please select an ingredient before adding.",
      icon: "info",
      showCloseButton: true,
      confirmButtonColor: '#505050',
      confirmButtonText: 'CLOSE',
    },
    loginPrompt: {
      title: "Please signup and/or login",
      text: "Signup and/or login to save recipes to your favourites.",
      type: "info",
      icon: "info",
      showCloseButton: true,
      confirmButtonColor: '#505050',
      confirmButtonText: 'CLOSE',
    },
    notEmailFormat: {
      title: "Check your email address.",
      text: "You have entered an invalid email address!",
      icon: "info",
      showCloseButton: true,
      confirmButtonColor: '#505050',
      confirmButtonText: 'CLOSE',
    }
  }
}

module.exports = alerts;