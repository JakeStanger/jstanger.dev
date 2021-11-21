const REMOVE_WORDS = ["a", "i", "my", "the"];

/**
 * Gets a lowercase hyphen-joined string
 * of all the keywords in the input string.
 *
 * @param title
 */
function keywords(title: string) {
  return title
    .toLowerCase()
    .split(" ")
    .filter((word) => !REMOVE_WORDS.includes(word.toLowerCase()))
    .join("-");
}

export default keywords;
