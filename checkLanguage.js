function censorLanguage(text) {
    const foulWords = ["fuck", "nigger", "nazi"]; // Add more words here
    const regex = new RegExp(foulWords.join("|"), "gi");

    let containsFoul = regex.test(text);
    let filteredText = text.replace(regex, "****");

    return { containsFoul, filteredText };
}


