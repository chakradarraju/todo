
function Dialog(el) {
  this.el_ = el;
  this.content_ = null;
  this.active_ = false;
  this.init_();
};

Dialog.prototype.show = function(left, top, width, content) {
  var el = this.getEl();
  GROW_DOWN_ANIMATION(el, content.getHeight());
  el.style.display = 'block';
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  el.style.width = width + 'px';
  this.setContent_(content);
  setTimeout(function() {
    this.active_ = true;
  }.bind(this), 0);
};

Dialog.prototype.close = function() {
  SHRINK_UP_ANIMATION(this.getEl(), this.content_.getHeight()).then(function() {
    this.getEl().style.display = 'none';
    this.removeContent_();
    this.active_ = false;
  }.bind(this));
};

Dialog.prototype.getEl = function() {
  return this.el_;
};

Dialog.prototype.removeContent_ = function() {
  if (this.content_) {
    this.getEl().removeChild(this.content_.getEl());
    this.content_ = null;
  }
};

Dialog.prototype.setContent_ = function(content) {
  this.content_ = content;
  this.getEl().appendChild(content.getEl());
};

Dialog.prototype.init_ = function() {
  document.onclick = function(e) {
    if (!this.active_) return;
    var found = false;
    for (var i = 0; i < e.path.length; i++)
      if (e.path[i] == this.getEl())
        found = true;
    if (!found) this.close();
  }.bind(this);
};
