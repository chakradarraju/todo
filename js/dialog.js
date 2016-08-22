
function Dialog(el) {
  this.el_ = el;
  this.content_ = null;
  this.active_ = false;
  this.init_();
};

Dialog.prototype.show = function(left, top, width, content) {
  GROW_DOWN_ANIMATION(this.getEl(), content.getHeight());
  this.el_.style.display = 'block';
  this.el_.style.left = left + 'px';
  this.el_.style.top = top + 'px';
  this.el_.style.width = width + 'px';
  this.setContent_(content);
  setTimeout(function() {
    this.active_ = true;
  }.bind(this), 0);
};

Dialog.prototype.close = function() {
  SHRINK_UP_ANIMATION(this.getEl(), this.content_.getHeight()).then(function() {
    this.el_.style.display = 'none';
    this.removeContent_();
    this.active_ = false;
  }.bind(this));
};

Dialog.prototype.getEl = function() {
  return this.el_;
};

Dialog.prototype.removeContent_ = function() {
  if (this.content_) {
    this.el_.removeChild(this.content_.getEl());
    this.content_ = null;
  }
};

Dialog.prototype.setContent_ = function(content) {
  this.content_ = content;
  this.el_.appendChild(content.getEl());
};

Dialog.prototype.init_ = function() {
  document.onclick = function(e) {
    if (!this.active_) return;
    var found = false;
    for (var i = 0; i < e.path.length; i++) {
      if (e.path[i] == this.el_) {
        found = true;
      }
    }
    if (!found) {
      this.close();
    }
  }.bind(this);
};
