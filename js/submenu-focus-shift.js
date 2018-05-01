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
    showEl($element);
  },

  bindMenuEvents = function ($listItem, idx, $menuItems) {
    let $menuItem = $listItem.find('> a');

    $menuItem.on('click', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let $subMenu = getSubMenu($listItem);

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

        if (menuItemDepth($menuItem) === 1) {
          closeOpenMenus($menuItems);
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

  });

})(jQuery);
