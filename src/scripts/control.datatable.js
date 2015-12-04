ArcticScholar.Control.DataTable = L.Control.extend({
  options: {
    onCellClick: function() {},
    position: 'bottomleft',
    show: false
  },

  tableOptions: {
    columns: [ { data: 'name' } ],
    data: [],
    deferRender: true,
    destroy: true,
    lengthChange: false,
    paging: false,
    language: {
      emptyTable: "No results to display",
      search: "Filter:"
    },
    noResultsText: 'No Results'
  },

  initialize: function(options) {
    L.Util.extend(this.options, options);
    L.Util.extend(this.tableOptions, options.table);
  },

  onAdd: function(map) {
    var control = this;

    // create the container
    this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-datatable');
    this._container.setAttribute('aria-haspopup', true);

    // Prevent scroll and click events from passing through div to map
    if (!L.Browser.touch) {
      L.DomEvent
        .disableClickPropagation(this._container)
        .disableScrollPropagation(this._container);
    } else {
      L.DomEvent.on(this._container, 'click', L.DomEvent.stopPropagation);
    }

    if (!this.options.show) {
      this.hide();
    }

    var closeButton = L.DomUtil.create('button', 'leaflet-control-datatable-close', this._container);
    closeButton.innerHTML = "X";
    L.DomEvent.on(closeButton, 'click', this.hide, this);

    var resultsTable = L.DomUtil.create('table', '', this._container);

    this.table = $(resultsTable).DataTable(this.tableOptions);
    $(resultsTable).on('click', 'td', function(e) {
      var row = control.table.cell(this)[0][0].row;
      var data = control.table.row(row).data();
      control.options.onCellClick(e, this, data);
    });

    return this._container;
  },

  addRow: function(data) {
    return this.table.row.add(data).draw();
  },

  addRows: function(data) {
    return this.table.rows.add(data).draw();
  },

  clearTable: function() {
    return this.table.clear().draw();
  },

  hide: function() {
    L.DomUtil.addClass(this._container, 'hide');
  },

  show: function() {
    L.DomUtil.removeClass(this._container, 'hide');
  }
});

ArcticScholar.Control.dataTable = function(options) {
  return new ArcticScholar.Control.DataTable(options);
};
