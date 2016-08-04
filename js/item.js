
function Item() {
  this.el_ = document.createElement('div');
  this.input_ = document.createElement('input');
  this.el_.appendChild(this.input_);
}

Item.prototype.getValue = function() {
  return this.input_.value;
};

Item.prototype.loadValue = function(value) {
  this.input_.value = value;
};

Item.prototype.getEl = function() {
  return this.el_;
};

Item.prototype.listenChange = function(fn) {
  this.input_.onchange = fn;
};
