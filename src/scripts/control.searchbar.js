ArcticScholar.Control.Searchbar = L.Control.extend({
  options: {
    noResultsText: 'No Results',
    onSearch: function() {},
    position: 'topcenter',
    placeholderText: 'Search for location…',
    loadingText: 'Loading your results…'
  },

  initialize: function(options) {
    L.Util.extend(this.options, options);
  },

  onAdd: function(map) {
    // Add top-center control location
    var $controlContainer = $(map._controlContainer);

    if ($controlContainer.children('.leaflet-top.leaflet-center').length === 0) {
      $controlContainer.append('<div class="leaflet-top leaflet-center"></div>');
      map._controlCorners.topcenter = $controlContainer.children('.leaflet-top.leaflet-center').first()[0];
    }

    // create the container
    this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-searchbar');

    // create the form that will contain the input
    var form = L.DomUtil.create('form', null, this._container);

    // create the input, and set its placeholder text
    var input = L.DomUtil.create('input', null, form);
    input.placeholder = this.options.placeholderText;

    // create the error message div
    var message = L.DomUtil.create('div', 'leaflet-bar message hide', this._container);

    L.DomEvent.on(input, 'keypress', this.onKeyPress, this);

    // Loading indicator div
    this.loader = L.DomUtil.create('div', 'leaflet-bar message hide', this._container);
    this.loader.innerHTML = this.options.loadingText;

    return this._container;
  },

  onKeyPress: function(e) {
    this.clearError();

    if (e.keyCode === 13) {
      L.DomEvent.preventDefault(e);
      this.search();
    }
  },

  search: function() {
    this.startActivity();
    var input = this._container.querySelector('input');
    return this.options.onSearch(input.value, this);
  },

  clearError: function() {
    var message = this._container.querySelector('.message');
    L.DomUtil.addClass(message, 'hide');
  },

  showError: function(error) {
    var message = this._container.querySelector('.message');
    message.innerHTML = error;
    L.DomUtil.removeClass(message, 'hide');
  },

  startActivity: function() {
    L.DomUtil.removeClass(this.loader, 'hide');
  },

  stopActivity: function() {
    L.DomUtil.addClass(this.loader, 'hide');
  }
});

ArcticScholar.Control.searchbar = function(options) {
  return new ArcticScholar.Control.Searchbar(options);
};
