
function List() {
  this.el_ = document.createElement('div');
  this.items_ = [];
  this.init_();
  this.changeCallback_ = null;
}

List.prototype.add = function(data) {
  var item = new Item(data);
  this.items_.push(item);
  this.setupItem_(item);
  return item;
};

List.prototype.remove = function(item) {
  var index = this.items_.findIndex(function(elem) {
    return elem === item;
  });
  if (index !== -1) {
    this.itemsEl_.removeChild(item.getEl());
    this.items_.splice(index, 1);
  }
};

List.prototype.loadFrom = function(serialized) {
  this.items_ = [];
  while (this.itemsEl_.firstChild) {
    this.itemsEl_.removeChild(this.itemsEl_.firstChild);
  }
  if (!serialized) return;
  serialized.match(/([^\\\][^&]|\\&)+/g).forEach(function(item) {
    this.add(item);
  }, this);
};

List.prototype.serialize = function() {
  return this.items_.map(function(item) {
    return item.getValue().replace(/&/g, '\\&')
  }.bind(this)).join('&');
};

List.prototype.setName = function(name) {
  this.name_ = name;
  this.nameEl_.innerHTML = name === '' ? '(Untitled list)' : name;
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

List.prototype.hide = function() {
  return FADE_DOWN_ANIMATION(this.getEl());
};

List.prototype.show = function() {
  return FADE_UP_ANIMATION(this.getEl());
};

List.prototype.getEl = function() {
  return this.el_;
};

List.prototype.getDeleteBtn = function() {
  return this.deleteEl_;
};

List.prototype.init_ = function() {
  var el = this.getEl();
  el.appendChild(this.headerEl_ = document.createElement('div'));
  el.appendChild(this.itemsEl_ = document.createElement('div'));
  el.appendChild(this.addBtn_ = document.createElement('div'));
  this.headerEl_.appendChild(this.nameEl_ = document.createElement('span'));
  this.headerEl_.appendChild(this.deleteEl_ = this.createDeleteBtn_());
  this.headerEl_.classList.add('header');
  this.addBtn_.innerHTML = 'Add';
  this.addBtn_.classList.add('addbtn');
  this.addBtn_.onclick = function() {
    var item = this.add();
    item.show();
  }.bind(this);
};

List.prototype.createDeleteBtn_ = function() {
  var el = document.createElement('a');
  el.href = '#';
  el.innerHTML = 'x';
  el.classList.add('delete');
  el.classList.add('floatright');
  return el;
};

List.prototype.setupItem_ = function(item) {
  this.itemsEl_.appendChild(item.getEl());
  item.listenChange(this.changeCallback_);
  var remove = this.createDeleteBtn_();
  remove.onclick = function() {
    item.hide().then(function() {
      this.remove(item);
      this.changeCallback_();
    }.bind(this));
  }.bind(this);
  item.getEl().appendChild(remove);
};
