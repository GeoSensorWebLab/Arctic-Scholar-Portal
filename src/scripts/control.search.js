ArcticScholar.Search = L.Class.extend({
  options: {},

  initialize: function() {
    var self = this;
    this.searchBar = ArcticScholar.Control.searchbar({
      onSearch: function(query, searchbar) {
        return self._search(query);
      }
    });

    this.datatable = ArcticScholar.Control.dataTable({
      onCellClick: function(e, obj, data) {
        return self.highlightMarker(data._source.SISN);
      },

      table: {
        columns: [
          { data: '_source.SISN', title: 'SISN' },
          { data: '_source.TI', title: 'Title', className: 'titleCell' },
          { data: '_source.DT', title: 'Type' },
          { data: '_source.DA', title: 'Date&nbsp;Added' },
          { // Geographic Column
            data: function(row, type, set) {
              if (type === 'display' && row !== undefined && row._source !== undefined && row._source.gh !== undefined) {
                return row._source.gh.map(function(item) {
                  return item.GH;
                }).join(", ");
              } else {
                return "";
              }
            },
            title: "Geographic"
          }
        ],

        scrollCollapse: true,
        scrollY: '200px'
      }
    });

    this.resultMarkers = L.markerClusterGroup({
      removeOutsideVisibleBounds: false
    });
  },

  addTo: function(map, options) {
    if (options === undefined) {
      options = {};
    }

    this.map = map;
    this.layersControl = options.layersControl;
    this.searchBar.addTo(this.map);
    this.datatable.addTo(this.map);
  },

  highlightMarker: function(SISN) {
    this.resultMarkers.eachLayer(function(marker) {
      if (marker.options.SISN === SISN) {
        this.resultMarkers.zoomToShowLayer(marker, function() {
          marker.fire('click');
        });
      }
    }, this);
  },

  highlightResult: function(SISN) {
    return this.datatable.table.search(SISN).draw();
  },

  _addLayer: function(layer) {
    if (this.layersControl !== undefined) {
      this.layersControl.addOverlay(layer, 'Results');
    }

    return this.map.addLayer(layer);
  },

  _addResults: function(results) {
    this.datatable.show();
    this.datatable.addRows(results);

    var self = this;
    $.each(results, function(index, result) {
      var marker = self._generateMarker(result);
      if (marker !== null) {
        return self.resultMarkers.addLayer(marker);
      }
    });

    this._addLayer(this.resultMarkers);
  },

  _filterResults: function(results) {
    var valid = [];
    $.each(results, function(index, item) {
      if (item._source !== undefined && item._source.gh !== undefined) {
        valid.push(item);
      }
    });
    return valid;
  },

  _generateMarker: function(result) {
    var search = this;

    var location = this._getLocation(result);
    if (location !== null) {
      marker = L.marker([location.lat, location.lon], {
        title: result._source.TI,
        SISN: result._source.SISN,
        data: result._source,
        icon: this._getMarkerIcon(result._source.DT)
      });

      var map = this.map;
      // Marker click for popup details
      L.DomEvent.on(marker, 'click', function() {
        var div = L.DomUtil.create('div');
        div.innerHTML = JST["templates/popup"]({
          title: this.options.data.TI,
          description: this.options.data.AB,
          id: this.options.data.SISN
        });

        $(div).children("h1").first().on('click', function() {
          search.highlightResult(search.options.SISN);
        });

        var popup = L.popup().setContent(div).setLatLng(this.getLatLng());
        map.openPopup(popup);
      });

      return marker;
    } else {
      return null;
    }
  },

  _getMarkerIcon: function(type) {
    if (type === "P") {
      return new L.Icon(ArcticScholar.Icons.Yellow);
    } else if (type === "R") {
      return new L.Icon(ArcticScholar.Icons.Orange);
    } else {
      return new L.Icon.Default();
    }
  },

  // Parse location from result. Return null if it is missing or null in any way.
  _getLocation: function(result) {
    if (result._source === undefined) {
      return null;
    }

    if (result._source.location === undefined) {
      return null;
    }

    var coords = result._source.location.coordinates;
    if (coords === undefined) {
      return null;
    }

    if (coords.length === 0) {
      return null;
    }

    if ((coords[0][0] === null) || (coords[0][1] === null)) {
      return null;
    }

    return { lat: coords[0][1], lon: coords[0][0] };
  },

  _search: function(query) {
    this.resultMarkers.clearLayers();
    this.datatable.clearTable();

    var self = this;
    $.ajax({
      method: 'get',
      url: 'http://scholar.arcticconnect.org/arctic/_search',
      data: {
        default_operator: "AND",
        q: "GH:" + query,
        size: 100,
        sort: "SISN:desc",
        _source: "SISN,TI,DT,DA,AB,gh,location"
      }
    }).done(function(results) {
      self._addResults(self._filterResults(results.hits.hits));
      self.searchBar.stopActivity();
    });
  }
});

ArcticScholar.search = function(options) {
  return new ArcticScholar.Search(options);
};
