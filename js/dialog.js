
function Dialog(el) {
  this.el_ = el;
  this.el_.style.display = 'none';
  this.initTimePicker_();
  this.callback_;
};

Dialog.prototype.showTimePicker = function(callback) {
  this.el_.style.display = 'block';
  this.timePicker_.style.display = 'block';
  this.callback_ = callback;
};

Dialog.prototype.close = function() {
  this.el_.style.display = 'none';
  this.timePicker_.style.display = 'none';
};

Dialog.prototype.initTimePicker_ = function() {
  this.timePicker_ = document.createElement('div');
  this.timePicker_.style.display = 'none';
  this.el_.appendChild(this.timePicker_);
  var addBtn = function(label, value) {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = label;
    btn.classList.add('deadlinebtn');
    btn.onclick = function() {
      this.return_(value);
    }.bind(this);
    this.timePicker_.appendChild(btn);
  }.bind(this);
  var tomorrow = function() {
    var d = new Date();
    d.setHours(20, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  };
  var weekend = function() {
    var d = new Date();
    d.setHours(20, 0, 0, 0);
    d.setDate(d.getDate() + 7 - d.getDay());
    return d;
  };
  var monthend = function() {
    var d = new Date();
    d.setHours(20, 0, 0, 0);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
  };
  var infinite = function() {
    var d = new Date();
    d.setYear(d.getFullYear() + 20);
    return d;
  };
  addBtn('By tomorrow', tomorrow());
  addBtn('By weekend', weekend());
  addBtn('By month end', monthend());
  addBtn('No deadline', infinite());
};

Dialog.prototype.return_ = function(value) {
  this.callback_(value);
  this.close();
};
