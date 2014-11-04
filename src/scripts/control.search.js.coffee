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

    @resultMarkers = L.markerClusterGroup({
      removeOutsideVisibleBounds: false
    })

  addTo: (map, options = {}) ->
    @map = map
    @layersControl = options.layersControl
    @searchBar.addTo(@map)
    @datatable.addTo(@map)

  _addLayer: (layer) ->
    if @layersControl isnt undefined
      @layersControl.addOverlay(layer, 'Results')
      @map.addLayer(layer)
    else
      @map.addLayer(layer)

  _addResults: (results) ->
    @datatable.show()
    @datatable.addRows(results)

    for result in results
      marker = @_generateMarker(result)
      @resultMarkers.addLayer(marker) unless marker is null

    @_addLayer(@resultMarkers)

  _generateMarker: (result) ->
    location = @_getLocation(result)
    if (location isnt null)
      L.marker([location.lat, location.lon], {
        title: result._source.TI
      })
    else
      null

  # Parse location from result. Return null if it is missing or null in any way.
  _getLocation: (result) ->
    return null if result._source is undefined
    return null if result._source.location is undefined

    coords = result._source.location.coordinates
    return null if coords is undefined
    return null if coords.length is 0

    return null if (coords[0][0] is null) or (coords[0][1] is null)

    { lat: coords[0][1], lon: coords[0][0] }

  _search: (query) ->
    @resultMarkers.clearLayers()
    @datatable.clearTable()

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
