ArcticScholar.Search = L.Class.extend({
  options: {}

  initialize: ->
    @searchBar = ArcticScholar.Control.searchbar({
      onSearch: (query, searchbar) =>
        @_search(query)
    })

    @datatable = ArcticScholar.Control.dataTable({
      table:
        columns: [
          { data: '_source.SISN', title: 'SISN' }
          { data: '_source.TI', title: 'Title' }
          { data: '_source.DM', title: 'Date Modified' }
          { data: '_source.gh.0.GH', title: 'Geographic' }
          { data: '_source.SH.0', title: 'Subject Heading' }
        ]

        scrollCollapse: true
        scrollY: '200px'
    })

  addTo: (map) ->
    @searchBar.addTo(map)
    @datatable.addTo(map)

  _addResults: (results) ->
    console.log results
    @datatable.show()
    @datatable.addRows(results)

  _search: (query) ->
    $.ajax({
      method: 'get'
      url: 'http://scholar.arcticconnect.org:9200/arctic/_search'
      data:
        q: "GH:#{query}"
    }).done((results) =>
      @_addResults(results.hits.hits)
    )
})

ArcticScholar.search = (options) ->
  new ArcticScholar.Search(options)
