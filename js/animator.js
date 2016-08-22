
function Animator(el, props, start, end, fns, time) {
  if (start.length !== end.length) {
    console.error("start and end should be of same length");
    return this;
  }
  this.el_ = el;
  this.props_ = props;
  this.fns_ = fns;
  this.start_ = start;
  this.end_ = end;
  this.duration_ = time;
  this.startTime_ = null;
  this.callback_ = function() {}
  window.requestAnimationFrame(this.updateProps_.bind(this));
  this.resolved_ = false;
}

Animator.prototype.then = function(fn) {
  if (this.resolved_) { fn(); return; }
  this.callback_ = function(oldfn) {
    return function() {
      oldfn();
      fn();
    };
  }(this.callback_);
  return this;
};

Animator.prototype.updateProps_ = function(timestamp) {
  if (!this.startTime_) this.startTime_ = timestamp;
  for (var i = 0; i < this.start_.length; i++) {
    this.setValue_(this.props_[i], this.fns_[i]((timestamp - this.startTime_) / this.duration_ * (this.end_[i] - this.start_[i]) + this.start_[i]));
  }
  if (this.duration_ < timestamp - this.startTime_) this.finalize_();
  else window.requestAnimationFrame(this.updateProps_.bind(this));
};

Animator.prototype.finalize_ = function() {
  for (var i = 0; i < this.start_.length; i++) {
    this.setValue_(this.props_[i], this.fns_[i](this.end_[i]));
  }
  this.resolved_ = true;
  this.callback_();
};

Animator.prototype.setValue_ = function(prop, value) {
  this.el_.style[prop] = value;
  return value;
};

identity = function(a) { return a; }
withpx = function(a) { return Math.floor(a) + 'px'; }

FADE_DOWN_ANIMATION = function(el) {
  return new Animator(el, ['margin-top', 'opacity'], [5, 1.0], [25, 0.0], [withpx, identity], 150);
};

FADE_UP_ANIMATION = function(el) {
  el.style.opacity = '0';
  return new Animator(el, ['margin-top', 'opacity'], [25, 0.0], [5, 1.0], [withpx, identity], 150);
};

ROLL_DOWN_ANIMATION = function(el) {
  el.style.marginTop = '-20px';
  return new Animator(el, ['margin-top'], [-20], [0], [withpx], 150);
};

GROW_DOWN_ANIMATION = function(el, height) {
  el.style.height = '0px';
  return new Animator(el, ['height'], [0], [height], [withpx], 150);
};

SHRINK_UP_ANIMATION = function(el, height) {
  return new Animator(el, ['height'], [height], [0], [withpx], 150);
};
