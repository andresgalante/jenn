(function initializeDropdowns() {
  const elements = document.querySelectorAll('.pf-c-dropdown')
  const SPACE_KEYCODE = 32
  const ENTER_KEYCODE = 13

  function toggleMenu(element, expandState) {
    let trigger = element.querySelector('.pf-c-btn')
    if (expandState === undefined) {
      element.classList.toggle('pf-is-expanded')
      if (trigger.getAttribute('aria-expanded') === 'true') {
        trigger.setAttribute('aria-expanded', false)
      } else {
        trigger.setAttribute('aria-expanded', true)
      }
    } else {
      element.classList.toggle('pf-is-expanded', expandState)
      trigger.setAttribute('aria-expanded', expandState)
    }

  }

  elements.forEach((element) => {
    let trigger = element.querySelector('.pf-c-btn')
    let menu = element.querySelector('.pf-c-dropdown__menu')
    let menuItems = menu.querySelectorAll('.pf-c-dropdown__link')

    trigger.onclick = function (e) {
      e.preventDefault()
      toggleMenu(element)
    }
    trigger.onkeyup = function (e) {
      e.preventDefault()
      const pressedSpace = (e.keyCode === SPACE_KEYCODE)
      const pressedEnter = (e.keyCode === SPACE_KEYCODE)
      if (pressedEnter || pressedSpace) {
        toggleMenu(element)
      }
    }
    trigger.onblur = function (e) {
      if (e.relatedTarget.className !== 'pf-c-dropdown__link') {
        toggleMenu(element, false)
      }
    }
    menuItems.forEach((menuItem) => {
      menuItem.onblur = function (e) {
        if (e.relatedTarget.className !== 'pf-c-dropdown__link' && e.relatedTarget.className !== 'pf-c-btn') {
          toggleMenu(element, false)
        }
      }
    })
  })
})()
