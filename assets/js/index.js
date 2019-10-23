(function() {
  const letters = Array.from(
    document.querySelectorAll('#a-to-z-order-of-companies ~ h3')
  ).filter(letter => letter.textContent.length === 1);

  const companies = Array.from(
    document.querySelectorAll('#a-to-z-order-of-companies ~ h4')
  ).reduce((arr, element) => {
    const name = element.querySelector('strong').textContent;
    return [{ name, element }, ...arr];
  }, []);

  // -------------------
  // Insert Letter Links
  // -------------------
  const letterLinks = {
    init(lettersList) {
      this.letters = lettersList;
      this.createElements();
    },

    createElements() {
      // Create Container
      const letterContainer = document.createElement('P');
      letterContainer.id = 'letter-index';

      // Create Letter link to and from nodes
      letters.forEach((letter, i) => {
        // Insert LinkFrom node before Title
        const anchorLink = this.createAnchorLink(letter);
        letterContainer.appendChild(anchorLink);

        // Insert divider in between letters
        const pipe = document.createTextNode(' | ');
        if (i !== letters.length - 1) letterContainer.appendChild(pipe);

        // Insert LinkTo node before letter
        const anchorDest = this.createAnchorDest(letter);
        letter.prepend(anchorDest);
      });

      const orderTitle = document.getElementById('a-to-z-order-of-companies');
      // Insert elements
      orderTitle.parentNode.insertBefore(
        letterContainer,
        orderTitle.nextElementSibling
      );
    },

    createAnchorLink(letter) {
      const anchorLinkFrom = document.createElement('A');
      const anchorLinkFromText = document.createTextNode(letter.textContent);

      anchorLinkFrom.href = `#${letter.textContent}`;
      anchorLinkFrom.id = `${letter.textContent.toLowerCase()}-index`;
      anchorLinkFrom.appendChild(anchorLinkFromText);

      return anchorLinkFrom;
    },

    createAnchorDest(letter) {
      const anchorLinkTo = document.createElement('A');
      anchorLinkTo.name = letter.textContent;
      return anchorLinkTo;
    },
  };

  // -------------------
  // Add company search filter
  // -------------------
  const companySearch = {
    init(companyList, lettersList) {
      this.companies = companyList;
      this.letters = lettersList;

      this.createSearchField();
    },

    events() {
      this.searchField.addEventListener('input', this.filterResults.bind(this));
    },

    createSearchField() {
      const swagListTitle = document.getElementById('swag-list-2019');

      // Create search field
      const searchContainer = document.createElement('P');
      const searchHeading = document.createElement('H2');
      const searchInput = document.createElement('INPUT');

      searchHeading.textContent = 'Search';
      searchInput.type = 'search';
      searchInput.placeholder = 'Company Name';

      searchContainer.appendChild(searchInput);

      swagListTitle.parentNode.insertBefore(
        searchHeading,
        swagListTitle.previousElementSibling
      );
      swagListTitle.parentNode.insertBefore(
        searchContainer,
        swagListTitle.previousElementSibling
      );

      this.searchField = searchInput;

      // Initialise events
      this.events();
    },

    filterResults(e) {
      const regex = new RegExp(`^${e.target.value}`, 'gi');

      this.companies.forEach(({ name, element }) => {
        this.renderCompany(element, name.match(regex));
      });

      const letterIndex = document.getElementById('letter-index');
      letterIndex.style.display = !e.target.value.length ? 'block' : 'none';

      if (e.target.value.length <= 1)
        this.letters.forEach(letter => {
          this.renderLetterIndex(letter, letter.textContent.match(regex));
        });
    },

    renderCompany(element, visible = false) {
      element.style.display = visible ? 'block' : 'none';
      element.nextElementSibling.style.display = visible ? 'block' : 'none';
    },

    renderLetterIndex(element, visible = false) {
      element.style.display = visible ? 'block' : 'none';
    },
  };

  letterLinks.init(letters);
  companySearch.init(companies, letters);
})();
