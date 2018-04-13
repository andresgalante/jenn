(function ($) {
  'use strict';

  let menuItemDepth = function ($menuItem) {
    return $menuItem.parents('li').length;
  },

  hasSubmenu = function ($menuItem) {
    return !!$menuItem.attr('aria-controls');
  },

  subMenuIsVisible = function ($subMenu) {
    return !!$subMenu.is(':visible');
  },

  hideEl = function ($element) {
    $element.attr('aria-hidden', true);
  },

  showEl = function ($element) {
    $element.attr('aria-hidden', false);
  },

  openMenu = function ($menuItem, $subMenu) {
    $menuItem.attr('aria-expanded', true);
    showEl($subMenu);
  },

  closeMenu = function ($menuItem, $subMenu) {
    $menuItem.attr('aria-expanded', false);
    hideEl($subMenu);
  },

  getMenuItemLnk = function (item) {
    return $(item).find('> a');
  },

  focusFirstMenuItem = function ($element) {
    $element.find('a:first').trigger('focus');
  },

  getSubMenu = function ($menuItem) {
    let subMenuSelector = '#' + $menuItem.attr('aria-controls');
    return $(subMenuSelector);
  },

  closeOpenMenus = function ($menuItems) {
    $.each($menuItems, function (idx, item) {
      if (getMenuItemLnk(item).attr('aria-expanded') === 'true') {
        let $subMenu = getSubMenu(getMenuItemLnk(item));
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
    showEl($element);
  },

  bindMenuEvents = function ($listItem, idx, $menuItems) {
    let $menuItem = $listItem.find('> a');

    $menuItem.on('focusout focusin', function (event) {
      event.preventDefault();

      let $subMenu = getSubMenu($menuItem);

      switch (event.type) {

        case 'focusin': {

          $menuItem.on('click', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();

            if (hasSubmenu($menuItem)) {
              if ($subMenu.attr('aria-hidden') === 'true') {

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
