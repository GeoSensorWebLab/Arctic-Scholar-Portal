ArcticScholar.Control.DataTable = L.Control.extend({
  options:
    columns: [ { data: 'name' } ]
    data: []
    noResultsText: 'No Results'
    position: 'bottomleft'
    show: false

  initialize: (options) ->
    L.Util.extend(this.options, options)

  onAdd: (map) ->
    # create the container
    @_container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-datatable')
    @hide() unless @options.show

    resultsTable = L.DomUtil.create('table', '', @_container)

    @table = $(resultsTable).DataTable({
      deferRender: true
      lengthChange: false
      paging: false

      language:
        emptyTable: "No results to display"
        search: "Filter:"

      data: @options.data
      columns: @options.columns
    })

    @_container

  addRow: (data) ->
    @table.row.add(data).draw()

  addRows: (data) ->
    @table.row.add(data).draw()

  clearTable: ->
    @table.clear().draw()

  hide: ->
    L.DomUtil.addClass(@_container, 'hide')

  show: ->
    L.DomUtil.removeClass(@_container, 'hide')

})

ArcticScholar.Control.dataTable = (options) ->
  new ArcticScholar.Control.DataTable(options)
