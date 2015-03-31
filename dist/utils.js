// Generated by CoffeeScript 1.9.1
var Keys, Levels, React, moment, ref;

React = require('react');

moment = require('moment-range');

ref = require('./constants'), Keys = ref.Keys, Levels = ref.Levels;

module.exports = {
  above: false,
  toggle: function(visible) {
    if (visible == null) {
      visible = !this.state.visible;
    }
    if (visible !== this.state.visible) {
      return this.setState({
        visible: visible
      });
    }
  },
  parse: function(input) {
    var parsing, ref1, test;
    parsing = moment(input, this.format(), true);
    if (!parsing.isValid()) {
      test = new Date(input);
      if (isNaN(test.getTime())) {
        if ((ref1 = this.state) != null ? ref1.datetime : void 0) {
          test = this.state.datetime;
        } else {
          test = moment();
        }
      }
      parsing = moment(test);
    }
    return parsing;
  },
  save: function(saving) {
    var datetime;
    datetime = this.state.datetime;
    if (this.props.date) {
      saving.hours(datetime.hours());
      saving.minutes(datetime.minutes());
    }
    if (this.props.time) {
      saving.date(datetime.date());
      saving.month(datetime.month());
      saving.year(datetime.year());
    }
    this.setState({
      datetime: saving,
      input: saving.format(this.format())
    });
    return this.commit(saving);
  },
  commit: function(datetime) {
    var base, result;
    result = (function() {
      switch (this.props.returnAs) {
        case 'string':
          return datetime.format(this.format());
        case 'iso':
          return datetime.toISOString();
        case 'moment':
          return datetime;
        case 'jsdate':
          return datetime.toDate();
      }
    }).call(this);
    return typeof (base = this.props).onChange === "function" ? base.onChange(result) : void 0;
  },
  onChange: function(e) {
    var datetime, input;
    input = e.target.value;
    datetime = moment(input, this.format(), true);
    if (datetime.isValid()) {
      return this.save(datetime);
    } else {
      return this.setState({
        input: input
      });
    }
  },
  onSelect: function(datetime, close) {
    this.setState({
      visible: this.props.close && close ? !this.state.visible : this.state.visible
    });
    return this.save(datetime);
  },
  onBlur: function() {
    var datetime;
    if (this.above) {
      React.findDOMNode(this.refs.input).focus();
    } else {
      this.toggle(false);
    }
    if (this.state.input === this.state.datetime.format(this.format())) {

    } else {
      datetime = this.parse(this.state.input);
      return this.save(datetime);
    }
  },
  onKeyDown: function(code) {
    var datetime, lvl;
    datetime = this.state.datetime || moment();
    lvl = Levels[this.state.level];
    switch (code) {
      case Keys.UP:
        return this.onSelect(datetime.subtract(lvl.key.span, lvl.key.unit));
      case Keys.DOWN:
        return this.onSelect(datetime.add(lvl.key.span, lvl.key.unit));
      case Keys.ENTER:
        if (lvl.down) {
          return this.setState({
            level: lvl.down
          });
        } else {
          if (this.state.input === datetime.format(this.format())) {
            return this.toggle();
          } else {
            if (!this.state.visible) {
              this.toggle(true);
            }
            datetime = this.parse(this.state.input);
            return this.save(datetime);
          }
        }
    }
  }
};