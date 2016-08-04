
function List() {
  this.el_ = document.createElement('div');
  this.items_ = [];
  this.init_(this.el_);
  this.changeCallback_ = null;
}

List.prototype.add = function() {
  var item = new Item();
  this.items_.push(item);
  this.itemsEl_.appendChild(item.getEl());
  item.listenChange(this.changeCallback_);
  return item;
};

List.prototype.loadFrom = function(serialized) {
  this.items_ = [];
  while (this.itemsEl_.firstChild) {
    this.itemsEl_.removeChild(this.itemsEl_.firstChild);
  }
  if (!serialized) return;
  serialized.match(/([^\\\][^&]|\\&)+/g).forEach(function(item) {
    this.add().loadValue(item)
  }, this);
};

List.prototype.serialize = function() {
  return this.items_.map(function(item) {
    return item.getValue().replace(/&/g, '\\&')
  }.bind(this)).join('&');
};

List.prototype.setName = function(name) {
  this.name_ = name;
  this.nameEl_.innerHTML = name === '' ? '(Untitled)' : name;
};

List.prototype.getName = function() {
  return this.name_;
};

List.prototype.listenNameClick = function(fn) {
  this.nameEl_.onclick = fn;
};

List.prototype.listenChange = function(fn) {
  this.changeCallback_ = fn;
  this.items_.forEach(function(item) {
    item.listenChange(fn);
  });
};

List.prototype.getEl = function() {
  return this.el_;
};

List.prototype.init_ = function(el) {
  el.appendChild(this.nameEl_ = document.createElement('div'));
  el.appendChild(this.itemsEl_ = document.createElement('div'));
  el.appendChild(this.addBtn_ = document.createElement('div'));
  this.addBtn_.innerHTML = 'Add';
  this.addBtn_.classList.add('addbtn');
  this.addBtn_.onclick = function() {
    this.add();
  }.bind(this);
};
