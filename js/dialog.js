
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
  var today = function() {
    var d = new Date();
    d.setHours(23, 59, 59);
    return d;
  };
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
  this.addBtn_('By today', ret(today()));
  this.addBtn_('By tomorrow', ret(tomorrow()));
  this.addBtn_('By weekend', ret(weekend()));
  this.addBtn_('By month end', ret(monthend()));
  this.addBySomeday_();
  this.addBtn_('No deadline', ret(infinite()));
  this.addBtn_('Close', this.close.bind(this));
};

Dialog.prototype.return_ = function(value) {
  this.callback_(value);
  this.close();
};

Dialog.prototype.addBtn_ = function(label, fn) {
  var btn = document.createElement('input');
  btn.type = 'button';
  btn.value = label;
  btn.classList.add('deadlinebtn');
  btn.onclick = fn;
  this.timePicker_.appendChild(btn);
};

Dialog.prototype.addBySomeday_ = function() {
  var item = document.createElement('div');
  item.classList.add('someday');
  var date, month, year;
  var today = new Date();
  function getInput(value, min, max) {
    var inp = document.createElement('input');
    inp.type = 'number';
    inp.min = min + '';
    inp.max = max + '';
    inp.value = value;
    return inp;
  }
  item.appendChild(date = getInput(today.getDate(), 1, 31));
  item.appendChild(month = getInput(today.getMonth() + 1, 1, 12));
  item.appendChild(year = getInput(today.getFullYear(), 1970, 2030));
  var setBtn = document.createElement('input');
  setBtn.type = 'button';
  setBtn.value = 'Set';
  setBtn.classList.add('setbtn');
  setBtn.onclick = function() {
    var d = new Date();
    d.setHours(20, 0, 0, 0);
    d.setFullYear(year.value, month.value - 1, date.value);
    this.return_(d);
  }.bind(this);
  item.appendChild(setBtn);
  this.timePicker_.appendChild(item);
};
