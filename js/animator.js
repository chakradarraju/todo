
INTERVAL = 33;

function Animator(el, props, start, end, fns, time) {
  this.el_ = el;
  this.props_ = props;
  this.vals_ = [];
  this.diffs_ = [];
  this.fns_ = fns;
  this.end_ = end;
  this.callback_ = function() {}
  this.init_(start, end, time);
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
};

Animator.prototype.init_ = function(start, end, time) {
  var frames = time / INTERVAL;
  if (start.length !== end.length) {
    console.error("start and end should be of same length");
    return this;
  }
  for (var i = 0; i < start.length; i++) {
    this.vals_[i] = this.setValue_(this.props_[i], start[i]);
    this.diffs_.push((end[i] - start[i]) / frames);
  }
  this.interval_ = setInterval(this.updateProps_.bind(this), INTERVAL);
  setTimeout(this.finalize_.bind(this), time);
};

Animator.prototype.updateProps_ = function() {
  for (var i = 0; i < this.vals_.length; i++) {
    this.vals_[i] = this.vals_[i] + this.diffs_[i];
    this.setValue_(this.props_[i], this.fns_[i](this.vals_[i]));
  }
};

Animator.prototype.finalize_ = function() {
  for (var i = 0; i < this.vals_.length; i++) {
    this.vals_[i] = this.setValue_(this.props_[i], this.fns_[i](this.end_[i]));
  }
  clearInterval(this.interval_);
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

GROW_DOWN_ANIMATION = function(el) {
  el.style.height = '0px';
  return new Animator(el, ['height'], [0], [24], [withpx], 150);
};

SHRINK_UP_ANIMATION = function(el) {
  return new Animator(el, ['height'], [24], [0], [withpx], 150);
};
