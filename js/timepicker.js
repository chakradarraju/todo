
function TimePicker() {
  this.init_();
  this.callback_ = null;
}

TimePicker.prototype.getEl = function() {
  return this.el_;
};

TimePicker.prototype.setPicker = function(callback) {
  this.callback_ = callback;
  return this;
};

TimePicker.prototype.init_ = function() {
  this.el_ = document.createElement('div');
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
      this.callback_(value);
    }.bind(this)
  }.bind(this);
  this.addBtn_('By today', ret(today()));
  this.addBtn_('By tomorrow', ret(tomorrow()));
  this.addBtn_('By weekend', ret(weekend()));
  this.addBtn_('By month end', ret(monthend()));
  this.addBySomeday_();
  this.addBtn_('No deadline', ret(infinite()));
}

TimePicker.prototype.addBtn_ = function(label, fn) {
  var btn = document.createElement('input');
  btn.type = 'button';
  btn.value = label;
  btn.classList.add('deadlinebtn');
  btn.onclick = fn;
  this.el_.appendChild(btn);
};

TimePicker.prototype.addBySomeday_ = function() {
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
    var ret = new Date();
    ret.setHours(20, 0, 0, 0);
    ret.setFullYear(year.value, month.value - 1, date.value);
    date.value = today.getDate();
    month.value = today.getMonth() + 1;
    year.value = today.getFullYear();
    this.callback_(ret);
  }.bind(this);
  item.appendChild(setBtn);
  this.el_.appendChild(item);
};

