POW16 = 65536;
DATELEN = 4;
TIMEPICKER = new TimePicker();

function Item(data) {
  function infiniteDeadline() {
    var d = new Date();
    d.setYear(d.getFullYear() + 20);
    return d;
  }
  this.el_ = document.createElement('div');
  this.el_.classList.add('item');
  this.save_ = null;
  this.deadline_ = null;
  this.deadlineEl_ = document.createElement('span');
  this.deadlineEl_.classList.add('deadline');
  this.deadlineEl_.onclick = function(e) {
    var box = this.deadlineEl_.getBoundingClientRect();
    dialog.show(box.left, box.bottom, 150, TIMEPICKER.getTime(function(val) {
      this.setDeadline_(val);
      dialog.close();
    }.bind(this)));
  }.bind(this);
  this.el_.appendChild(this.deadlineEl_);
  this.setDeadline_(infiniteDeadline());

  this.input_ = document.createElement('input');
  this.input_.classList.add('input');
  this.el_.appendChild(this.input_);
  if (data) {
    this.loadValue(data);
  }
  this.updater_ = setInterval(this.updateLabel_.bind(this), 30000);
}

Item.prototype.getValue = function() {
  return this.deadlineSerialized_() + this.input_.value;
};

Item.prototype.loadValue = function(value) {
  if (value.length >= DATELEN) {
    this.input_.value = value.substr(DATELEN);
    this.setDeadline_(this.deserialize_(value.substr(0, DATELEN)));
  }
};

Item.prototype.getEl = function() {
  return this.el_;
};

Item.prototype.listenChange = function(fn) {
  this.save_ = fn;
  this.input_.onchange = fn;
};

Item.prototype.save = function() {
  if (this.save_) {
    this.save_();
  }
};

Item.prototype.setDeadline_ = function(newDeadline) {
  this.deadline_ = newDeadline;
  this.save();
  this.updateLabel_();
};

Item.prototype.updateLabel_ = function() {
  this.deadlineEl_.innerHTML = this.getLabel_(this.deadline_ - new Date());
};

Item.prototype.getLabel_ = function(diff) {
  diff /= 1000;
  if (diff < 0) {
    return 'EX';  // Expired
  } else if (diff < 60 * 60) {
    return 'FM';  // Few minutes
  } else if (diff < 24 * 60 * 60) {
    return Math.floor(diff / 60 / 60) + 'H';
  } else if (diff < 30 * 24 * 60 * 60) {
    return Math.floor(diff / 24 / 60 / 60) + 'D';
  } else if (diff < 365 * 24 * 60 * 60) {
    return Math.floor(diff / 31 / 24 / 60 / 60) + 'M';
  } else if (diff < 10 * 365 * 24 * 60 * 60) {
    return Math.floor(diff / 365 / 24 / 60 / 60) + 'Y';
  } else {
    return '--';  // No deadline
  }
};

Item.prototype.deadlineSerialized_ = function() {
  var val = this.deadline_.valueOf();
  var str = '';
  for (var i = 0; i < DATELEN; i++) {
    str += String.fromCharCode(val);
    val /= POW16;
  }
  console.assert(val > 0, "Failed serializing fully");
  return str;
};

Item.prototype.deserialize_ = function(val) {
  var ret = 0;
  for (var i = DATELEN - 1; i >= 0; i--) {
    ret *= POW16;
    ret += val.charCodeAt(i);
  }
  return new Date(ret);
};
