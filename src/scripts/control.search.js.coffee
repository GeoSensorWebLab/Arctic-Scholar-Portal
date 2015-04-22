ArcticScholar.Search = L.Class.extend({
  options: {}

  initialize: ->
    @searchBar = ArcticScholar.Control.searchbar({
      onSearch: (query, searchbar) =>
        @_search(query)
    })

    @datatable = ArcticScholar.Control.dataTable({
      onCellClick: (e, obj, data) =>
        @highlightMarker(data._source.SISN)

      table:
        columns: [
          { data: '_source.SISN', title: 'SISN' }
          { data: '_source.TI', title: 'Title', className: 'titleCell' }
          { data: '_source.DT', title: 'Type' }
          { data: '_source.DM', title: 'Date Modified' }
          { data: '_source.gh.0.GH', title: 'Geographic' }
          { # Handle possible null values in SH array
            data: (row, type, set) ->
              if (type is 'display' and row?._source?.SH?[0])
                row._source.SH[0]
              else
                ""
          }
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

  highlightMarker: (SISN) ->
    @resultMarkers.eachLayer((marker) ->
      if (marker.options.SISN is SISN)
        @resultMarkers.zoomToShowLayer(marker, ->
          marker.fire('click')
        )
    , this)

  highlightResult: (SISN) ->
    @datatable.table.search(SISN).draw()

  _addLayer: (layer) ->
    if @layersControl isnt undefined
      @layersControl.addOverlay(layer, 'Results')

    @map.addLayer(layer)

  _addResults: (results) ->
    @datatable.show()
    @datatable.addRows(results)

    for result in results
      marker = @_generateMarker(result)
      @resultMarkers.addLayer(marker) unless marker is null

    @_addLayer(@resultMarkers)

  _generateMarker: (result) ->
    search = this

    location = @_getLocation(result)
    if (location isnt null)
      marker = L.marker([location.lat, location.lon], {
        title: result._source.TI
        SISN: result._source.SISN
        data: result._source
        icon: @_getMarkerIcon(result._source.DT)
      })

      # Marker click for popup details
      L.DomEvent.on marker, 'click', ->
        div = L.DomUtil.create('div')
        div.innerHTML = JST["templates/popup"](
          title: this.options.data.TI
          description: this.options.data.AB
          id: this.options.data.SISN
        )

        $(div).children("h1").first().on('click', =>
          search.highlightResult(this.options.SISN)
        )

        this.bindPopup(div).openPopup()

      marker
    else
      null

  _getMarkerIcon: (type) ->
    switch type
      when "P" then new L.Icon(ArcticScholar.Icons.Yellow)
      when "R" then new L.Icon(ArcticScholar.Icons.Orange)
      else new L.Icon.Default()

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
      url: 'http://scholar.arcticconnect.org/arctic/_search'
      data:
        q: "GH:*#{query}*"
        size: 100
        sort: "SISN:desc"
    }).done((results) =>
      @_addResults(results.hits.hits)
      @searchBar.stopActivity()
    )
})

ArcticScholar.search = (options) ->
  new ArcticScholar.Search(options)
