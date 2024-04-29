// functions.js

// Function to generate a random destination
function generateRandomDestination() {
  // Example: Generate a random 10-digit number as a string with a '276' prefix
  const destination = '1276' + Math.floor(Math.random() * 100000000).toString();
  return destination;
}

// Artillery beforeRequest hook to modify the request payload
function setDestination(requestParams, context, ee, next) {
  // Use the generateRandomDestination function to set a random destination
  requestParams.json.destination = generateRandomDestination();
  return next(); // Proceed to send the request
}

module.exports = {
  generateRandomDestination,
  setDestination
};
