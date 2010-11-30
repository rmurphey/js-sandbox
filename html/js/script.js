/*
(function($) {

$(document).ready(function() {
  $('#searchForm').submit(function(e) {
    var term = $.trim($(this).find('input[name="q"]').val());

    if (!term) { return; }

    $.getJSON(
      'http://query.yahooapis.com/v1/public/yql?format=json&callback=', 
      { q : getQuery(term) }, 
      function(resp) {
        var results = resp.query.results.result, 
            tmpl = '<li><p><a href="{{url}}">{{title}}</a></p></li>',
            html;

        if (!results.length) { return; }

        html = $.map(results, function(result) {
          return tmpl
            .replace('{{url}}', result.url)
            .replace('{{title}}', result.title)
        }).join('');

        $('#results').html(html);
      }
    );

    e.preventDefault();
  });

  function getQuery(term) {
    return 'select title,url from search.news where query="' + term + '"';
  }
});

})(jQuery);
*/







(function($) {

$.subscribe('/search/term', function(term) {
  $.getJSON(
    'http://query.yahooapis.com/v1/public/yql?format=json&callback=', 
    { q : getQuery(term) }, 
    function(resp) {
      if (!resp.query.results.result.length) { return; }
      $.publish('/search/results', [ resp.query.results.result ]);
    }
  );
});

$.subscribe('/search/term', function(term) {
  $('#searches').append('<li>' + term + '</li>');
});

$.subscribe('/search/results', function(results) {
  var tmpl = '<li><p><a href="{{url}}">{{title}}</a></p></li>',
      html = $.map(results, function(result) {
        return tmpl
          .replace('{{url}}', result.url)
          .replace('{{title}}', result.title);
      }).join('');
  $('#results').html(html);
});

function getQuery(term) {
  return 'select title,url from search.news where query="' + term + '"';
}

$(document).ready(function() {
  $('#searchForm').submit(function(e) {
    e.preventDefault();
    var term = $.trim($(this).find('input[name="q"]').val());
    if (!term) { return; }
    $.publish('/search/term', [ term ]);
  });
});

})(jQuery);
