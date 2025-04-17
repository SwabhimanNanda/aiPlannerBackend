const axios = require("axios");

const hitEndpoint = async () => {
  try {
    const response = await axios.get(
      "https://event-management-backend-7l8t.onrender.com"
    );
    console.log("API hit successfully:", response.data);
  } catch (error) {
    console.error("Error hitting API:", error.message);
  }
};

hitEndpoint();
