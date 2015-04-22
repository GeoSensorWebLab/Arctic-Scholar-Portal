ArcticScholar.Control.Legend = L.Control.extend({
  options:
    position: 'topright'
    placeholderText: 'Map Legend'
    elements: []

  initialize: (options) ->
    L.Util.extend(this.options, options)
    @elements = []

  onAdd: (map) ->
    # Add top-center control location
    $controlContainer = $(map._controlContainer)

    # create the container
    this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-legend')

    # create the element
    button = L.DomUtil.create('a', null, this._container)

    # create the legend
    @legend = L.DomUtil.create('div', 'hide', button)
    @addElements(@options.elements)

    toggle = L.DomUtil.create('p', null, button)
    toggle.innerText = @options.placeholderText

    L.DomEvent.on(button, 'click', @toggleLegend, this)

    this._container

  addElements: (elements) ->
    for element in elements
      do (element) =>
        @addElement(element)

  addElement: (element) ->
    @elements.push(element)
    item = L.DomUtil.create('div', null, @legend)
    icon = L.DomUtil.create('img', null, item)
    icon.src = element.src
    desc = L.DomUtil.create('p', null, item)
    desc.innerText = element.description

  toggleLegend: ->
    if L.DomUtil.hasClass(@legend, 'hide')
      L.DomUtil.removeClass(@legend, 'hide')
    else
      L.DomUtil.addClass(@legend, 'hide')
})

ArcticScholar.Control.legend = (options) ->
  new ArcticScholar.Control.Legend(options)
