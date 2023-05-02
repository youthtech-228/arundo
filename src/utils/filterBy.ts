export const filterBy = (termsString = '', items = []) => {
  const terms = (
    termsString.toLowerCase().match(/((\w+:)?"[\w\s]+")|([\w\-:]+)/gi) || []
  ).map((s) => s.replace(/"/g, ''));

  const match = (terms: string[]) => (item) => {
    let tokens = item.getSearchTokens();

    for (var term of terms) {
      let passed = false;

      for (var token of tokens) {
        if (
          token.indexOf(term) === 0 ||
          token[token.indexOf(term) - 1] === ' '
        ) {
          passed = true;
          break;
        }
      }

      if (!passed) return false;
    }

    return true;
  };

  let filtered = items.filter(match(terms));

  return filtered;
};
