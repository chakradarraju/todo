
function Dialog(el) {
  this.el_ = el;
  this.el_.style.display = 'none';
  this.initTimePicker_();
  this.callback_;
};

Dialog.prototype.show = function() {
  this.el_.style.display = 'block';
  this.timePicker_.style.display = 'block';
};

Dialog.prototype.showTimePicker = function(left, top, callback) {
  this.show();
  this.el_.style.left = left + 'px';
  this.el_.style.top = top + 'px';
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
  var addBtn = function(label, fn) {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = label;
    btn.classList.add('deadlinebtn');
    btn.onclick = fn;
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
  var ret = function(value) {
    return function() {
      this.return_(value);
    }.bind(this)
  }.bind(this);
  addBtn('By tomorrow', ret(tomorrow()));
  addBtn('By weekend', ret(weekend()));
  addBtn('By month end', ret(monthend()));
  addBtn('No deadline', ret(infinite()));
  addBtn('Close', this.close.bind(this));
};

Dialog.prototype.return_ = function(value) {
  this.callback_(value);
  this.close();
};
