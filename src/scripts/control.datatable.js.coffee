ArcticScholar.Control.DataTable = L.Control.extend({
  options:
    onCellClick: ->
    position: 'bottomleft'
    show: false

  tableOptions:
    columns: [ { data: 'name' } ]
    data: []
    deferRender: true
    destroy: true
    lengthChange: false
    paging: false
    language:
        emptyTable: "No results to display"
        search: "Filter:"
    noResultsText: 'No Results'

  initialize: (options) ->
    L.Util.extend(this.options, options)
    L.Util.extend(this.tableOptions, options.table)

  onAdd: (map) ->
    control = this

    # create the container
    @_container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-datatable')
    @_container.setAttribute('aria-haspopup', true)

    # Prevent scroll and click events from passing through div to map
    if (!L.Browser.touch)
      L.DomEvent
        .disableClickPropagation(@_container)
        .disableScrollPropagation(@_container)
    else
      L.DomEvent.on(@_container, 'click', L.DomEvent.stopPropagation)

    @hide() unless @options.show

    closeButton = L.DomUtil.create('button', 'leaflet-control-datatable-close', @_container)
    closeButton.innerHTML = "X"
    L.DomEvent.on(closeButton, 'click', @hide, this)

    resultsTable = L.DomUtil.create('table', '', @_container)

    @table = $(resultsTable).DataTable(@tableOptions)
    $(resultsTable).on 'click', 'td', (e) ->
      row = control.table.cell(this)[0][0].row
      data = control.table.row(row).data()
      control.options.onCellClick(e, this, data)

    @_container

  addRow: (data) ->
    @table.row.add(data).draw()

  addRows: (data) ->
    @table.rows.add(data).draw()

  clearTable: ->
    @table.clear().draw()

  hide: ->
    L.DomUtil.addClass(@_container, 'hide')

  show: ->
    L.DomUtil.removeClass(@_container, 'hide')

})

ArcticScholar.Control.dataTable = (options) ->
  new ArcticScholar.Control.DataTable(options)
