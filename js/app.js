(function() {
  'use strict';

  let movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({ delay: 50 }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  $('#searchButton').on('click', (event) => {
    event.preventDefault();
    movies = [];
    if ($('#search').val() === '') {
      Materialize.toast('Please enter a movie title.', 4000, 'toast');
    }
    const $xhrFirst = $.ajax({
      method: 'GET',
      url: `http://www.omdbapi.com/?s=${$('#search').val()}`,
      dataType: 'json'
    });

    $xhrFirst.done((dataSearch) => {
      if ($xhrFirst.status !== 200) {
        return;
      }
      if (dataSearch.Response === 'True') {
        for (let i = 0; i < (dataSearch.Search).length; i++) {
          const movie = {};

          movie.id = dataSearch.Search[i].imdbID;
          const $xhrSecond = $.ajax({
            method: 'GET',
            url: `http://www.omdbapi.com/?i=${movie.id}`,
            dataType: 'json'
          });

          $xhrSecond.done((dataPlot) => {
            if ($xhrSecond.status !== 200) {
              return;
            }
            movie.title = dataSearch.Search[i].Title;
            movie.plot = dataPlot.Plot;
            movie.poster = dataSearch.Search[i].Poster;
            movie.year = dataSearch.Search[i].Year;
            movies.push(movie);
            if (movie.poster === 'N/A') {
              movies.pop(movie);
            }
            renderMovies();
          });
          $xhrSecond.fail((err) => {
            console.log(err);
          });
        }
      }
      else {
        Materialize.toast('No such movie. Sorry.', 4000, 'toast');
      }
    });
    $xhrFirst.fail((err) => {
      console.log(err);
    });
  });
})();
