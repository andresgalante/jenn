(function ($) {
  'use strict';

  const alert1 = () => `
  <div class="pf-c-alert pf-m-success" aria-label="Success Alert" id="alert1">
    <div class="pf-c-alert__icon">
      <i class="fas fa-check-circle" aria-hidden="true"></i>
    </div>

    <h4 class="pf-c-alert__title">
      <span class="pf-screen-reader">Success alert:</span>
      Success loading the test page.
    </h4>
    <div class="pf-c-alert__description">
      <p>Read the <a href="https://www.w3.org/TR/wai-aria-1.1/#aria-live">aria-live Property Definition</a></p>
    </div>

    <div class="pf-c-alert__action">
      <button class="pf-c-button close-btn pf-m-plain" aria-label="Close Success Alert: Loaded alert test page">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </div>
  </div>
  `;

  const alert2 = () => `
  <div class="pf-c-alert pf-m-info" aria-label="Information Alert" id="alert2">
    <div class="pf-c-alert__icon">
      <i class="fas fa-info-circle" aria-hidden="true"></i>
    </div>

    <h4 class="pf-c-alert__title">
      <span class="pf-screen-reader">Info alert:</span>
      Set both aria-live and role attributes.
    </h4>
    <div class="pf-c-alert__description">
      <p>The aria-live attribute is the <em>primary</em> determination of live regions.</p>
    </div>

    <div class="pf-c-alert__action">
      <button class="pf-c-button close-btn pf-m-plain" aria-label="Close Info Alert: Set aria-live and role attributes">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </div>
  </div>
`;

  const alert3 = () => `
  <div class="pf-c-alert pf-m-danger" aria-label="Error Alert" id="alert3">
    <div class="pf-c-alert__icon">
      <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
    </div>
    <h4 class="pf-c-alert__title">
      <span class="pf-screen-reader">Error alert:</span>
      There was a problem submitting your form
    </h4>
    <div class="pf-c-alert__description">
      <p>Please enter your first name.</p>
    </div>
    <div class="pf-c-alert__action">
      <button class="pf-c-button close-btn pf-m-plain" aria-label="Close Error Alert: Problem submitting your form">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
    </div>
  </div>
  `;

  const autoDismissTime = (ms) => {
    return ms + 8000;
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    const $staticAlert = $('#alert4');
    const $alertContainer = $('#alert-container');
    const $sampleForm = $('#sample-form');
    const alert1Start = 5000;
    const alert2Start = alert1Start + 3000;
    const alert1End = autoDismissTime(alert1Start);
    const alert2End = autoDismissTime(alert2Start);
    function startAlertTimers() {
      // automatically insert Alert 1 ~5 seconds after page load
      setTimeout(() => {
        $alertContainer.append(alert1());
      }, alert1Start);
      // automatically insert Alert 2 ~3 seconds after Alert 1
      setTimeout(() => {
        $alertContainer.append(alert2());
      }, alert2Start);
      // automatically dismiss each alert after ~8 seconds
      setTimeout(() => {
        $alertContainer.find('#alert1').remove();
      }, alert1End);
      setTimeout(() => {
        $alertContainer.find('#alert2').remove();
      }, alert2End);
    };

    $staticAlert.focus();

    startAlertTimers();

    $sampleForm.on('submit', event => {
      event.preventDefault();
      const invalid = $sampleForm.find('input').val() === '';
      // on submission, an alert displays
      if (invalid) {
        $alertContainer.append(alert3());
        // After the form alert displays, repeat steps 1-3
        startAlertTimers();
      }
    });

    // any alert can be manually dismissed
    $(document).on('click', '.close-btn', function () {
      $(this).parents('.pf-c-alert').remove().blur();
    });

  });

})(jQuery);
