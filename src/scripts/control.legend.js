ArcticScholar.Control.Legend = L.Control.extend({
  options: {
    position: 'topright',
    placeholderText: 'Map Legend',
    elements: []
  },

  initialize: function(options) {
    L.Util.extend(this.options, options);
    this.elements = [];
  },

  onAdd: function(map) {
    // Add top-center control location
    var $controlContainer = $(map._controlContainer);

    // create the container
    this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-legend');

    // create the element
    var button = L.DomUtil.create('a', null, this._container);

    // create the legend
    this.legend = L.DomUtil.create('div', 'hide', button);
    this.addElements(this.options.elements);

    var toggle = L.DomUtil.create('p', null, button);
    toggle.innerText = this.options.placeholderText;

    L.DomEvent.on(button, 'click', this.toggleLegend, this);

    return this._container;
  },

  addElements: function(elements) {
    var self = this;
    $.each(elements, function(index, element) {
      self.addElement(element);
    });
  },

  addElement: function(element) {
    this.elements.push(element);
    var item = L.DomUtil.create('div', null, this.legend);
    var icon = L.DomUtil.create('img', null, item);
    icon.src = element.src;
    var desc = L.DomUtil.create('p', null, item);
    desc.innerText = element.description;
  },

  toggleLegend: function() {
    if (L.DomUtil.hasClass(this.legend, 'hide')) {
      L.DomUtil.removeClass(this.legend, 'hide');
    } else {
      L.DomUtil.addClass(this.legend, 'hide');
    }
  }
});

ArcticScholar.Control.legend = function(options) {
  return new ArcticScholar.Control.Legend(options);
};
