ENTER_KEY = 13;

function PromptBox() {
  this.callback_ = null;
  this.init_();
}

PromptBox.prototype.getEl = function() {
  return this.el_;
};

PromptBox.prototype.getHeight = function() {
  return 24;
};

PromptBox.prototype.getValue = function(label, value, fn) {
  this.label_.innerHTML = label;
  this.callback_ = fn;
  this.input_.value = value;
  setTimeout(function() {
    this.input_.focus();
  }.bind(this), 0);
  return this;
};

PromptBox.prototype.init_ = function() {
  this.el_ = document.createElement('div');
  this.el_.style.display = 'flex';
  this.label_ = document.createElement('span');
  this.el_.appendChild(this.label_);
  this.input_ = document.createElement('input');
  this.input_.classList.add('input');
  this.input_.onkeypress = function(e) {
    if (e.keyCode === ENTER_KEY) {
      this.callback_(this.input_.value);
    }
  }.bind(this);
  this.el_.appendChild(this.input_);
  this.button_ = document.createElement('input');
  this.button_.type = 'button';
  this.button_.value = 'OK';
  this.button_.onclick = function() {
    this.callback_(this.input_.value);
  }.bind(this);
  this.el_.appendChild(this.button_);
}
