PROMPTBOX = new PromptBox();

function ToDos(el) {
  this.listsContainer_ = document.createElement('div');
  el.appendChild(this.listsContainer_);

  this.addBtn_ = document.createElement('div');
  this.addBtn_.classList.add('newlistbtn');
  this.addBtn_.innerHTML = '+';
  this.addBtn_.onclick = function() {
    var list = this.lists_[''] = this.setupList_(new List(), '', '');
    this.getRenameFn_(list)();
    list.show();
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
    var left = document.body.clientWidth / 2 - 150;
    dialog.show(left, 0, 300, PROMPTBOX.getValue('New name:', el.getName(), function(newName) {
      var oldName = el.getName();
      newName = newName.toLowerCase();
      if (oldName === newName) {
        dialog.close();
        return;
      }
      if (/[;!]/.test(newName)) {
        alert('Name cannot contain ; or !');
        return;
      }
      if (newName in this.lists_) {
        alert('Name already in use');
        return;
      }
      this.lists_[newName] = this.lists_[oldName];
      this.lists_[newName].setName(newName);
      delete this.lists_[oldName];
      this.removeListFromStorage_(oldName);
      this.save();
      dialog.close();
    }.bind(this)));
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
    list.hide().then(function() {
      this.deleteList(list.getName());
      this.save();
    }.bind(this));
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
