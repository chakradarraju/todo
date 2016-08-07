POW16 = 65536;
DATELEN = 4;

function Item(data) {
  this.el_ = document.createElement('div');
  this.save_ = null;
  this.deadline_ = new Date();
  this.deadline_.setDate(this.deadline_.getDate() + 1);
  this.deadlineEl_ = document.createElement('span');
  this.deadlineEl_.onclick = function() {
    dialog.showTimePicker(function(val) {
      this.setDeadline_(val);
    }.bind(this));
  }.bind(this);
  this.el_.appendChild(this.deadlineEl_);

  this.input_ = document.createElement('input');
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
    return 'EX';
  } else if (diff < 60) {
    return 'SS';
  } else if (diff < 60 * 60) {
    return Math.floor(diff / 60) + 'M';
  } else if (diff < 24 * 60 * 60) {
    return Math.floor(diff / 60 / 60) + 'H';
  } else if (diff < 30 * 24 * 60 * 60) {
    return Math.floor(diff / 24 / 60 / 60) + 'D';
  } else if (diff < 10 * 365 * 24 * 60 * 60) {
    return Math.floor(diff / 365 / 24 / 60 / 60) + 'Y';
  } else {
    return '--';
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
