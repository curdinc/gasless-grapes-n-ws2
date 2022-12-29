/**
 * Makes a random ID of the specified length
 * @param length The length of the random ID to create
 * @returns {string} The randomly generated ID
 */
export function makeId(length = 7) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
