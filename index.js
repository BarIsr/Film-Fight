const autocompleteConfig = {

  renderOption(movie) {
    return `<img  src="${movie.Poster === 'N/A' ? '' : movie.Poster}" />
            ${movie.Title}
            (${movie.Year})`
  },

  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'd9835cc5',
        s: searchTerm
      }
    });

    if (response.data.Error) {
      // alert("no results");
      return [];
    }

    return response.data.Search;
  }
}


createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    let location = document.querySelector('#left-summary');
    onMovieSelect(movie, location, 'left');
  },

});
createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    const location = document.querySelector('#right-summary');
    onMovieSelect(movie, location, 'right');
  },

});


let leftMovie, rightMovie;

const onMovieSelect = async (movie, summaryLocation, side) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    }
  });
  try {
    summaryLocation.innerHTML = moiveTemplate(response.data);
  } catch (error) {

  }


  if (side === 'left')
    leftMovie = response.data;
  else {
    rightMovie = response.data;
  }

  if (rightMovie && leftMovie) {
    //console.log("aaaa");
    runComprison();
  }
}

runComprison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const righttSideValue = parseInt(rightStat.dataset.value);

    if (leftSideValue === "N/A" && righttSideValue === "N/A") {
      rightStat.classList.remove('is-primary');
    }
    else if

      (righttSideValue > leftSideValue) {

      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warnning');
    }
    if (righttSideValue < leftSideValue) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warnning');
    }



  })

};



const moiveTemplate = (moiveData) => {
 

    const dollars = parseInt(
      moiveData.BoxOffice.replace('$', ' ').replace(',', '')
    );
  
    
  console.log("dollars", dollars);
  /*  */
  const metascore = parseInt(moiveData.Metascore);
  const imdbRating = parseFloat(moiveData.imdbRating);
  const imdbVotes = parseInt(moiveData.imdbVotes.replace(/,/g, ''));


  const awards = moiveData.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value))
      return prev;
    else {
      return prev + value;
    }
  }, 0);

  /* console.log("awards:" + awards);
  console.log(metascore, imdbRating, imdbVotes); */





  return `
  <article class="media >
    <figure class="media-left>
    <p class="image">
    <img class="imgb" src="${moiveData.Poster}"/>
    </p>
    </figure>
    <div class="media-content">
    <div class="content">
    <h1>${moiveData.Title} (${moiveData.Year}) </h1>
    <h4>${moiveData.Genre} </h4>
    <p>${moiveData.Plot} </p>
    </div>
    </div>
  </article>

 <div class="container1">
  <div class="column1">
  <article  data-value=${awards ? awards : 'N/A'} class="notification is-primary">

  <p class="title">${moiveData.Awards ? moiveData.Awards : 'N/A'} </p>
  <p class="subtitle">Awards </p>
   </article>

   <article data-value=${dollars ? dollars : 'N/A'} class="notification is-primary">
   

  <p class="title">${moiveData.BoxOffice ? moiveData.BoxOffice : 'N/A'} </p>
  <p class="subtitle">Box Office </p>
   </article>

   <article data-value=${metascore ? metascore : 'N/A'} class="notification is-primary">

  <p class="title">${moiveData.Metascore ? moiveData.Metascore : 'N/A'} </p>
  <p class="subtitle">Metascore </p>
   </article>

   <article data-value=${imdbRating ? imdbRating : 'N/A'} class="notification is-primary">

  <p class="title">${moiveData.imdbRating ? moiveData.imdbRating : 'N/A'} </p>
  <p class="subtitle">imdb Rating </p>
   </article>

  <article data-value=${imdbVotes ? imdbVotes : 'N/A'} class="notification is-primary">

  <p class="title">${moiveData.imdbVotes ? moiveData.imdbVotes : 'N/A'} </p>
  <p class="subtitle">imdb Votes </p>
   </article>

 <article class=" notification is-success">
  <p class="title">Torrent Search </p>
  <p class="subtitle">
   <a href="https://1337x.to/search/${(moiveData.Title.replaceAll(' ', '+')) + /1/} "  target="_blank">
   Torrent </a>
  </p>
   </article>
    </div>

</div>
   
  `;
 
}



