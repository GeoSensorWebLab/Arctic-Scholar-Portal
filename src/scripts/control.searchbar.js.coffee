window.ArcticScholar = {
  Control: {}
}

ArcticScholar.Control.Searchbar = L.Control.extend({
  options:
    noResultsText: 'No Results'
    onSearch: ->
    position: 'topcenter'
    placeholderText: 'Search for location…'

  initialize: (options) ->
    L.Util.extend(this.options, options)

  onAdd: (map) ->
    # Add top-center control location
    $controlContainer = $(map._controlContainer)

    if ($controlContainer.children('.leaflet-top.leaflet-center').length is 0)
      $controlContainer.append('<div class="leaflet-top leaflet-center"></div>')
      map._controlCorners.topcenter = $controlContainer.children('.leaflet-top.leaflet-center').first()[0]

    # create the container
    this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-searchbar')

    # create the form that will contain the input
    form = L.DomUtil.create('form', null, this._container)

    # create the input, and set its placeholder ("Enter address") text
    input = L.DomUtil.create('input', null, form)
    input.placeholder = @options.placeholderText

    # create the error message div
    message = L.DomUtil.create('div', 'leaflet-bar message hide', this._container)

    L.DomEvent.on(input, 'keypress', @onKeyPress, this)

    this._container

  onKeyPress: (e) ->
    @clearError()

    if (e.keyCode is 13)
      L.DomEvent.preventDefault(e)
      @search()

  search: ->
    input = @_container.querySelector('input')
    @options.onSearch(input.value, this)

  clearError: ->
    message = @_container.querySelector('.message')
    L.DomUtil.addClass(message, 'hide')

  showError: (error) ->
    message = @_container.querySelector('.message')
    message.innerHTML = error
    L.DomUtil.removeClass(message, 'hide')

})

ArcticScholar.Control.searchbar = (options) ->
  new ArcticScholar.Control.Searchbar(options)
