(function ($) {
  'use strict';

  let getMenuItemLnk = function (item) {
    return $(item).find('> a');
  },

  focusFirstMenuItem = function ($element) {
    $element.find('a:first').trigger('focus');
  },

  removeActiveClasses = function ($menuItems) {
    $.each($menuItems, function (idx, item) {
      if (getMenuItemLnk(item).is('.pf-is-active')) {
        getMenuItemLnk(item).removeClass('pf-is-active');
      }
    });
  },

  removeAriaCurrent = function ($menuItems) {
    $.each($menuItems, function (idx, item) {
      if (getMenuItemLnk(item).attr('aria-current') === 'true') {
        getMenuItemLnk(item).attr('aria-current', false);
      }
    });
  },

  popNotification = function ($element) {
    $('main > .notification-container').append($element);

    // https://www.w3.org/TR/wai-aria-practices/#alert => "It is also important to avoid designing alerts that disappear automatically."
    // dismissing notifications to a notification drawer where they're still available wouldn't be so bad
    // setTimeout(function () {
    //   $element.blur();
    //   $element.remove();
    // }, 10000);
  },

  alert1NotifMarkup = function () {
    return `
      <div
        id="alert-notification-01"
        class="pf-c-toast pf-is-warning"
        role="alert">
        <div>
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <strong id="alert-notification-01-title" class="sr-only">ALERT 1</strong>
          </div>
          <div id="alert-notification-01-message" class="pf-c-toast__message">
            This is an important alert notification with role="alert" set on the parent div, and strong element for the hidden type label.
          </div>
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Fix Action</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  },

  alert2NotifMarkup = function () {
    return `
      <div
        id="alert-notification-02"
        class="pf-c-toast pf-is-warning"
        aria-label="alert 2">
        <div>
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
          </div>
          <div id="alert-notification-02-message" class="pf-c-toast__message" role="alert">
            <em id="alert-notification-02-title" class="sr-only">ALERT 2</em>
            This is an important alert notification with role="alert" applied to the div that wraps the message only, and aria-label on the parent div, and em element for the hidden type label
          </div>
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Fix Action</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  },

  alert3NotifMarkup = function () {
    return `
      <div
        id="alert-notification-03"
        class="pf-c-toast pf-is-warning"
        role="alert"
        aria-label="alert 3">
        <div>
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="alert-notification-03-title" class="sr-only">ALERT 3</span>
          </div>
          <div id="alert-notification-03-message" class="pf-c-toast__message">
            This is an important alert notification, much like alert 1, but also includes aria-label on the parent div. The hidden type label is a span.
          </div>
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Fix Action</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  },

  bindMenuEvents = function ($listItem, idx, $menuItems) {
    let $menuItem = $listItem.find('> a');

    $menuItem.on('click', function (event) {

      event.preventDefault();
      event.stopImmediatePropagation();

      removeActiveClasses($menuItems);
      removeAriaCurrent($menuItems);
      $menuItem.addClass('pf-is-active').attr('aria-current', true);

      let menuItemTxt = $menuItem.find('[class*="link-text"]').text().trim();

      switch (menuItemTxt) {
        case 'Alert 1': {
          popNotification($(alert1NotifMarkup()));
          break;
        }
        case 'Alert 2': {
          popNotification($(alert2NotifMarkup()));
          break;
        }
        case 'Alert 3': {
          popNotification($(alert3NotifMarkup()));
          break;
        }
        default: {}
      }

      return false;
    });

  };

  document.addEventListener("DOMContentLoaded", function(event) {
    let $menuItems = $('.pf-c-vertical-nav__item, .pf-vertical-sub-nav__item');

    $.each($menuItems, function (idx, element) {
      let $listItem = $(element);
      bindMenuEvents($listItem, idx, $menuItems);
      getMenuItemLnk(element).attr('role', 'link');
    });

    $(document).on('click', '[data-dismiss]', function () {
      $(this).parents('.pf-c-toast').blur().remove();
    });
  });

})(jQuery);
