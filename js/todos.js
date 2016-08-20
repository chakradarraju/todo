
function ToDos(el) {
  this.listsContainer_ = document.createElement('div');
  el.appendChild(this.listsContainer_);

  this.addBtn_ = document.createElement('div');
  this.addBtn_.classList.add('newlistbtn');
  this.addBtn_.innerHTML = '+';
  this.addBtn_.onclick = function() {
    var list = this.lists_[''] = this.setupList_(new List(), '', '');
    this.getRenameFn_(list)();
  }.bind(this);
  el.appendChild(this.addBtn_);

  this.lists_ = {};
  this.loadFromStorage_();
}

ToDos.prototype.save = function() {
  this.saveToStorage_();
};

ToDos.prototype.deleteList = function(name) {
  this.listsContainer_.removeChild(this.lists_[name].getEl());
  delete this.lists_[name];
  this.removeListFromStorage_(name);
};

ToDos.prototype.getRenameFn_ = function(el) {
  return function() {
    var newName = prompt('New name:');
    if (newName) {
      newName = newName.toLowerCase();
      if (/[;!]/.test(newName)) {
        alert('Name cannot contain ; or !');
        return;
      }
      if (newName in this.lists_) {
        alert('Name already in use');
        return;
      }
      var oldName = el.getName();
      this.lists_[newName] = this.lists_[oldName];
      this.lists_[newName].setName(newName);
      delete this.lists_[name];
      this.removeListFromStorage_(name);
      this.save();
    }
  }.bind(this);
};

ToDos.prototype.loadFromStorage_ = function() {
  var names = this.getFromStorage_('!list').split(';');
  for (var i in names) {
    this.lists_[names[i]] = this.setupList_(
        new List(), names[i], this.getFromStorage_(names[i]));
  }
};

ToDos.prototype.getFromStorage_ = function(key) {
  var item = localStorage.getItem(key);
  return item ? item : '';
};

ToDos.prototype.setupList_ = function(list, name, data) {
  var el = list.getEl();
  el.classList.add('list');
  this.listsContainer_.appendChild(el);
  list.setName(name);
  list.loadFrom(data);
  list.listenNameClick(this.getRenameFn_(list));
  list.listenChange(this.save.bind(this));
  list.getDeleteBtn().onclick = function() {
    this.deleteList(list.getName());
    this.save();
  }.bind(this);
  return list;
};

ToDos.prototype.saveToStorage_ = function() {
  var names = Object.keys(this.lists_);
  for (var i in names) {
    localStorage.setItem(names[i], this.lists_[names[i]].serialize());
  }
  localStorage.setItem('!list', names.join(';'));
};

ToDos.prototype.removeListFromStorage_ = function(key) {
  localStorage.removeItem(key);
};
