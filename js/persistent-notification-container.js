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
    setTimeout(function () {
      $element.blur();
      $element.remove();
    }, 10000);
  },

  alert1NotifMarkup = function () {
    return `
      <section
        aria-label="Alert 1 Notification Label"
        id="alert-notification-01"
        class="pf-c-toast pf-is-warning">
        <div>
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="alert-notification-01-title" class="sr-only">ALERT</span>
          </div>
          <div id="alert-notification-01-message" class="pf-c-toast__message">
            This is an important alert notification in a section element
          </div>
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Fix Action</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </section>
    `;
  },

  alert2NotifMarkup = function () {
    return `
      <div
        aria-label="Alert 2 Notification Label"
        id="alert-notification-02"
        class="pf-c-toast pf-is-warning">
        <div>
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="alert-notification-02-title" class="sr-only">ALERT</span>
          </div>
          <div id="alert-notification-02-message" class="pf-c-toast__message">
            This is an important alert notification in a standard div
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
      <aside
        aria-label="Alert 3 Notification Label"
        id="alert-notification-03"
        class="pf-c-toast pf-is-warning">
        <div>
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="alert-notification-03-title" class="sr-only">ALERT</span>
          </div>
          <div id="alert-notification-03-message" class="pf-c-toast__message">
            This is an important alert notification in an aside element
          </div>
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Fix Action</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </aside>
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
