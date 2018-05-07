(function () {
  'use strict';

  let setupDialog01 = function () {
    document.getElementById('aria-labelledby-dialog-btn').addEventListener('click', function () {
      document.getElementById('aria-labelledby-dialog').setAttribute('open', 'open');
      document.querySelectorAll('#aria-labelledby-dialog > button')[0].focus();
    });
  },

  setupDialog02 = function () {
    document.getElementById('standard-dialog-btn').addEventListener('click', function () {
      document.getElementById('standard-dialog').setAttribute('open', 'open');
      document.querySelectorAll('#standard-dialog > button')[0].focus();
    });
  },

  setupDismissBtns = function () {
    document.querySelectorAll('[data-dismiss]').forEach(function (el) {
      el.addEventListener('click', function (event) {
        el.blur();
        this.parentElement.removeAttribute('open');
        document.getElementById(this.parentElement.id + '-btn').focus();
      });
    });
  };

  document.addEventListener("DOMContentLoaded", function(event) {
    setupDialog01();
    setupDialog02();
    setupDismissBtns();
  });
})();

