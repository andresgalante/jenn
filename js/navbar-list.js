(function ($) {
  'use strict';

  let menuItemDepth = function ($menuItem) {
    return $menuItem.parents('li').length;
  },

  hasSubmenu = function ($menuItem) {
    return !!$menuItem.find('+ section').length;
  },

  subMenuIsVisible = function ($subMenu) {
    return !!$subMenu.is(':visible');
  },

  hideEl = function ($element) {
    $element.attr('hidden', 'hidden');
  },

  showEl = function ($element) {
    $element.removeAttr('hidden');
  },

  openMenu = function ($menuItem, $subMenu) {
    $menuItem.attr('aria-expanded', true);
    $subMenu.addClass('pf-is-open');
    showEl($subMenu);
  },

  closeMenu = function ($menuItem, $subMenu) {
    $menuItem.attr('aria-expanded', false);
    $subMenu.removeClass('pf-is-open');
    hideEl($subMenu);
  },

  getMenuItemLnk = function (item) {
    return $(item).find('> a');
  },

  focusFirstMenuItem = function ($element) {
    $element.find('a:first').trigger('focus');
  },

  getSubMenu = function ($listItem) {
    return $listItem.find('> a + section');
  },

  closeOpenMenus = function ($menuItems) {
    $.each($menuItems, function (idx, item) {
      if (getMenuItemLnk(item).attr('aria-expanded') === 'true') {
        let $subMenu = getSubMenu($(item));
        closeMenu(getMenuItemLnk(item), $subMenu);
      }
    });
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

  technologyWarningMarkup = function () {
    return `
      <div
        id="technology-warning"
        class="pf-c-toast pf-is-warning">
        <div
          role="alert"
          aria-live="assertive">

          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="technology-warning-title" class="sr-only">Warning message:</span>
          </div>

          <div id="technology-warning-message" class="pf-c-toast__message">
            Technology is scary, and may include topics that are confusing.
          </div>

        </div>
        <div class="pf-c-toast__action">
          <a href="#">Exclude Confusing Topics</a>
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  },

  entertainmentInfoMarkup = function () {
    return `
      <div
        id="entertainment-info"
        class="pf-c-toast pf-is-success">
        <div
          role="alert"
          aria-live="polite">

          <div class="pf-c-toast__icon">
            <i class="fas fa-home"></i>
            <span id="entertainment-success-title" class="sr-only">Success message:</span>
          </div>

          <div id="entertainment-success-message" class="pf-c-toast__message">
            Entertainment comes in many forms like music, art, and poetry.
          </div>

        </div>
        <div class="pf-c-toast__action">
          <button data-dismiss aria-label="Dismiss Notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
  },

  bindMenuEvents = function ($listItem, idx, $menuItems) {
    let $menuItem = $listItem.find('> a');

    $menuItem.on('focus click focusout focusin', function (event) {
      event.preventDefault();

      let $subMenu = getSubMenu($listItem);

      switch (event.type) {

        case 'focusin': {

          $menuItem.on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (hasSubmenu($menuItem)) {
              if ($subMenu.attr('hidden') === 'hidden') {

                // first close any subMenus that are already open
                closeOpenMenus($menuItems);

                openMenu($menuItem, $subMenu);
                focusFirstMenuItem($subMenu);
              } else {
                closeMenu($menuItem, $subMenu);
              }
            }

            // only set as pf-is-active/aria-current if menu item isn't disabled and isn't only a gateway to submenu
            if (!hasSubmenu($menuItem) && $menuItem.is(':not([aria-disabled])')) {
              removeActiveClasses($menuItems);
              removeAriaCurrent($menuItems);
              $menuItem.addClass('pf-is-active').attr('aria-current', true);

              let menuItemTxt = $menuItem.find('[class*="link-text"]').text().trim();

              switch (menuItemTxt) {
                case 'Technology': {
                  popNotification($(technologyWarningMarkup()));
                  break;
                }
                case 'Entertainment': {
                  popNotification($(entertainmentInfoMarkup()));
                  break;
                }
                default: {}
              }

              if (menuItemDepth($menuItem) === 1) {
                closeOpenMenus($menuItems);
              }
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

    $('.pf-c-toast').on('click', '[data-dismiss]', function () {
      hideEl($(this).parents('.pf-c-toast'));
      $(this).parents('.pf-c-toast').blur();
    });
  });

})(jQuery);
