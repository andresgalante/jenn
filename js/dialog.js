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
    $('main').append($element);

    setTimeout(function () {
      $element.remove();
    }, 6000);
  },

  alertDialogMarkup = function () {
    return `
      <div
        id="alert-dialog-notification"
        role="alertdialog"
        aria-live="assertive"
        class="pf-c-toast pf-is-warning">
        <div class="pf-c-toast__icon">
          <i class="fas fa-home"></i>
          <span id="alert-dialog-notification-title" class="sr-only">Warning message:</span>
        </div>
        <div id="alert-dialog-notification-message" class="pf-c-toast__message">
          This is an alert dialog notification
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Continue</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  },

  popoverDialogMarkup = function () {
    return `
      <dialog
        id="dialog-notification-warning"
        role="dialog"
        class="pf-c-toast pf-is-warning">
        <div role="alert" aria-live="assertive">
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="dialog-notification-warning-title" class="sr-only">Warning message:</span>
          </div>
          <div id="dialog-notification-warning-message" class="pf-c-toast__message">
            This is a warning dialog
            <input type="text" placeholder="enter stuff here">
          </div>
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Dismiss Notification</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </dialog>
    `;
  },

  modalDialogMarkup = function () {
    return `
      <dialog
        id="dialog-notification-warning"
        role="dialog"
        class="pf-c-toast pf-is-warning">
        <div role="alert" aria-live="assertive">
          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="dialog-notification-warning-title" class="sr-only">Warning message:</span>
          </div>
          <div id="dialog-notification-warning-message" class="pf-c-toast__message">
            This is a warning dialog
            <input type="text" placeholder="enter stuff here">
          </div>
        </div>
        <div class="pf-c-toast__action">
          <a href="#">Dismiss Notification</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </dialog>
    `;
  },

  // used to keep the focus inside a modal context
  tabFocusRestrictor = function (lastItem, firstItem) {
    $(lastItem).blur(function() {
      $(firstItem).focus();
    });
  },

  bindMenuEvents = function ($listItem, idx, $menuItems) {
    let $menuItem = $listItem.find('> a');

    $menuItem.on('focus click focusout focusin', function (event) {
      event.preventDefault();

      switch (event.type) {

        case 'focusin': {

          $menuItem.on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            removeActiveClasses($menuItems);
            removeAriaCurrent($menuItems);
            $menuItem.addClass('pf-is-active').attr('aria-current', true);

            let menuItemTxt = $menuItem.find('[class*="link-text"]').text().trim();

            switch (menuItemTxt) {
              case 'Popover Dialog': {
                popNotification($(popoverDialogMarkup()));
                break;
              }
              case 'Modal Dialog': {
                let $alertDialogNotif = $(modalDialogMarkup());
                popNotification($alertDialogNotif);
                focusFirstMenuItem($alertDialogNotif);
                break;
              }
              case 'Alert Dialog': {
                let $alertDialogNotif = $(alertDialogMarkup());
                popNotification($alertDialogNotif);
                focusFirstMenuItem($alertDialogNotif);
                break;
              }
              default: {}
            }

          });

          break;
        }

        case 'focusout': {
          $menuItem.off('click');
          break;
        }

        default: {
          // console.log('unsupported event type');
        }
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

    $('body').on('click', '[data-dismiss]', function () {
      $(this).parents('.pf-c-toast').remove();
    });
  });

})(jQuery);
