(function ($) {
  'use strict';

  let menuItemDepth = function ($menuItem) {
    return $menuItem.parents('li').length;
  },

  hasSubmenu = function ($menuItem) {
    // if the menu item has a sub-menu, it will have a value for [aria-controls]
    return !!$menuItem.attr('aria-controls');
  },

  subMenuIsVisible = function ($subMenu) {
    return !!$subMenu.is(':visible');
  },

  openMenu = function ($menuItem, $subMenu) {
    $menuItem.attr('aria-expanded', true);
    $subMenu.attr('aria-hidden', false);
  },

  closeMenu = function ($menuItem, $subMenu) {
    $menuItem.attr('aria-expanded', false);
    $subMenu.attr('aria-hidden', true);
  },

  getMenuItemLnk = function (item) {
    return $(item).find('> a');
  },

  focusFirstMenuItem = function ($subMenu) {
    $subMenu.find('ul li:first a').trigger('focus');
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

  removeCurrentNavItemText = function ($menuItems) {
    $.each($menuItems, function (idx, item) {
      let $item = getMenuItemLnk(item);
      if ($item.is(':not([aria-disabled])') && $item.find('.sr-only').length > 0) {
        getMenuItemLnk(item).find('.sr-only').remove();
      }
    });
  },

  assignHasPopupAttrs = function ($listItem) {
    let $menuItem = $listItem.find('> a');

    if (hasSubmenu($menuItem)) {
      console.log('menu item has subMenu', $menuItem);
      $menuItem.attr('aria-haspopup', 'menuitem');
    }
  },

  bindMenuEvents = function ($listItem, idx, $menuItems) {
    let $menuItem = $listItem.find('> a');

    $menuItem.on('focus click focusout focusin', function (event) {
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
              removeCurrentNavItemText($menuItems);
              $menuItem.addClass('pf-is-active').attr('aria-current', true);

              $menuItem.find('.pf-c-vertical-nav__link-text').append('<span class="sr-only">(current navigation item)</span>');
              let menuItemText = $menuItem.find('.pf-c-vertical-nav__link-text').text().trim();

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
      // assignHasPopupAttrs($listItem);
    });
  });

})(jQuery);
