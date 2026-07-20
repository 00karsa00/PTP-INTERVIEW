/**
 * Kerala Ayurveda — Routine Quiz  (Theme App Extension)
 * Vanilla JS · no dependencies · ~5 KB minified
 *
 * Works with any OS2 theme (Dawn, Refresh, Sense…).
 * Each block instance is isolated — multiple blocks on one page are safe.
 *
 * Key conventions
 *  - All DOM queries are scoped inside the block's root element.
 *  - API URL is read from data-api-url, set by the merchant in Theme Editor.
 *  - HTML is escaped before injection to prevent XSS.
 *  - prefers-reduced-motion is respected in CSS; JS respects it for delays.
 */
(function () {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────────────
  const ADVANCE_DELAY_MS = 220;   // ms after goal selected before advancing
  const SUCCESS_RESET_MS = 2500;  // ms to show "Added!" before returning idle

  // ── Goal key normalisation (maps generated Liquid values to API enums) ─────
  // The Liquid template lowercases and underscores the option text. These are
  // the three values the API accepts. If a merchant customises the option text
  // to something unexpected, the raw value is passed through as a fallback.
  const GOAL_VALUE_MAP = {
    stress_calm:   'stress_calm',
    energy_focus:  'energy_focus',
    sleep_quality: 'sleep_quality',
  };
  const FREQ_VALUE_MAP = {
    once_daily:  'once_daily',
    twice_daily: 'twice_daily',
  };

  // ── Security: HTML escape before any innerHTML injection ──────────────────
  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ── DOM helpers ───────────────────────────────────────────────────────────
  function show(el) {
    el.classList.remove('ka-quiz__step--hidden');
    el.removeAttribute('hidden');
  }
  function hide(el) {
    el.classList.add('ka-quiz__step--hidden');
    el.setAttribute('hidden', '');
  }

  // ── Progress bar fill (0 = 33%, 1 = 66%, 2 = 100%) ───────────────────────
  function updateProgress(root, stepIndex) {
    const fill = root.querySelector('[data-progress-fill]');
    if (!fill) return;
    fill.style.width = ((stepIndex + 1) / 3 * 100) + '%';
  }

  // ── HTML builders ─────────────────────────────────────────────────────────
  function buildRoutineStepsHTML(routine) {
    return routine.map(function (step) {
      return (
        '<li class="ka-result__routine-step">' +
          '<span class="ka-result__step-label">' + esc(step.label) + '</span>' +
          '<span class="ka-result__step-instruction">' + esc(step.instruction) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  function renderResult(container, data) {
    var blurbNote = data.blurbSource === 'fallback'
      ? '<span class="ka-result__blurb-note">General guidance — not AI-personalised</span>'
      : '';

    container.innerHTML =
      '<div class="ka-result">' +

        '<div class="ka-result__blurb">' +
          '<p>' + esc(data.blurb) + '</p>' +
          blurbNote +
        '</div>' +

        '<div class="ka-result__pack">' +
          '<p class="ka-result__section-label">Recommended pack</p>' +
          '<p class="ka-result__pack-title">' + esc(data.pack.title) + '</p>' +
          '<p class="ka-result__pack-supply">' + esc(data.pack.supply) + '</p>' +
          '<p class="ka-result__pack-rationale">' + esc(data.pack.rationale) + '</p>' +
          '<button type="button" class="ka-result__select-btn" data-caps="' + esc(String(data.pack.capsules)) + '">' +
            'Select this pack' +
          '</button>' +
        '</div>' +

        '<div class="ka-result__routine">' +
          '<p class="ka-result__section-label">Your routine</p>' +
          '<ul class="ka-result__routine-list">' +
            buildRoutineStepsHTML(data.routine) +
          '</ul>' +
        '</div>' +

        '<p class="ka-result__disclaimer">' + esc(data.disclaimer) + '</p>' +

      '</div>';

    // Wire "Select this pack" — tries to select the matching variant radio in
    // Dawn's product form. If the theme structure differs, it silently no-ops.
    var selectBtn = container.querySelector('.ka-result__select-btn');
    if (selectBtn) {
      selectBtn.addEventListener('click', function () {
        var caps = selectBtn.getAttribute('data-caps');
        selectVariantByCapsules(caps);

        // Scroll to the product form buy section
        var buySection = document.querySelector('[name="add"]') ||
                         document.querySelector('.product-form__submit') ||
                         document.querySelector('#ProductSubmitButton');
        if (buySection) {
          buySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Visual confirmation
        selectBtn.textContent = '✓ Pack selected';
        selectBtn.style.background = 'var(--ka-green-700)';
      });
    }
  }

  function renderSkeleton(container) {
    container.innerHTML =
      '<div class="ka-quiz__skeleton-wrap" role="status" aria-label="Loading…">' +
        '<div class="ka-skeleton"></div>' +
        '<div class="ka-skeleton ka-skeleton--short"></div>' +
        '<div class="ka-skeleton"></div>' +
        '<div class="ka-skeleton ka-skeleton--shorter"></div>' +
      '</div>';
  }

  function renderError(container, message) {
    container.innerHTML =
      '<div class="ka-result__error" role="alert">' +
        '<p class="ka-result__error-heading">Couldn\'t load your recommendation</p>' +
        '<p>' + esc(message) + '</p>' +
        '<button type="button" class="ka-result__retry-btn">Try again</button>' +
      '</div>';
  }

  // ── Shopify variant selector integration ──────────────────────────────────
  // Dawn uses <input type="radio"> with data-index for variant options.
  // We look for a radio whose label text or value contains the capsule count.
  // This is a best-effort — if the theme structure differs it fails silently.
  function selectVariantByCapsules(capsStr) {
    if (!capsStr) return;
    var pattern = new RegExp(capsStr, 'i');

    // Strategy 1: input[type=radio] with a nearby label that mentions the count
    var radios = document.querySelectorAll(
      '.product-form input[type="radio"], form[action="/cart/add"] input[type="radio"]'
    );
    for (var i = 0; i < radios.length; i++) {
      var radio = radios[i];
      var label = document.querySelector('label[for="' + radio.id + '"]');
      var text  = (label ? label.textContent : '') + ' ' + (radio.value || '');
      if (pattern.test(text)) {
        radio.click();   // triggers Dawn's variant change event
        return;
      }
    }

    // Strategy 2: Shopify section rendering / variant select element
    var selects = document.querySelectorAll('select.product-form__input, select[name="id"]');
    for (var j = 0; j < selects.length; j++) {
      var sel = selects[j];
      for (var k = 0; k < sel.options.length; k++) {
        if (pattern.test(sel.options[k].text)) {
          sel.selectedIndex = k;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
      }
    }
  }

  // ── API call ──────────────────────────────────────────────────────────────
  function fetchRecommendation(apiUrl, goal, frequency, context) {
    var body = { goal: goal, frequency: frequency };
    if (context) body.context = context.slice(0, 200);

    return fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (resp) {
      if (!resp.ok) throw new Error('Server error ' + resp.status);
      return resp.json();
    }).then(function (json) {
      if (!json.success) throw new Error('API returned success=false');
      return json.data;
    });
  }

  // ── Per-block initialisation ──────────────────────────────────────────────
  function initQuiz(root) {
    var apiUrl = root.dataset.apiUrl;

    var selectedGoal      = null;
    var selectedFrequency = null;

    var stepEls = [
      root.querySelector('[data-step-panel="0"]'),
      root.querySelector('[data-step-panel="1"]'),
      root.querySelector('[data-step-panel="2"]'),
    ];

    var submitBtn      = root.querySelector('.ka-quiz__submit-btn');
    var resultWrap     = root.querySelector('.ka-quiz__result');

    // Respect prefers-reduced-motion for auto-advance delay
    var prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var advanceDelay = prefersReducedMotion ? 0 : ADVANCE_DELAY_MS;

    function goTo(n) {
      stepEls.forEach(function (el, i) {
        if (i === n) { show(el); } else { hide(el); }
      });
      updateProgress(root, n);
      // Shift focus for screen readers
      stepEls[n].setAttribute('tabindex', '-1');
      stepEls[n].focus({ preventScroll: true });
    }

    // ── Step 0: goal selection ────────────────────────────────────────────
    var goalBtns = stepEls[0].querySelectorAll('.ka-quiz__option[data-goal]');
    goalBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Deselect all, select this one
        goalBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        selectedGoal = GOAL_VALUE_MAP[btn.dataset.goal] || btn.dataset.goal;

        // Auto-advance after brief visual feedback pause
        setTimeout(function () { goTo(1); }, advanceDelay);
      });
    });

    // ── Step 1: frequency selection ───────────────────────────────────────
    var freqBtns = stepEls[1].querySelectorAll('.ka-quiz__option[data-frequency]');
    freqBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        freqBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        selectedFrequency = FREQ_VALUE_MAP[btn.dataset.frequency] || btn.dataset.frequency;
        // Enable submit
        submitBtn.removeAttribute('disabled');
        submitBtn.removeAttribute('aria-disabled');
      });
    });

    // Back
    root.querySelector('.ka-quiz__back-btn').addEventListener('click', function () {
      goTo(0);
    });

    // Submit
    submitBtn.addEventListener('click', function () {
      if (!selectedGoal || !selectedFrequency) return;

      var contextInput = root.querySelector('.ka-quiz__context-input');
      var context = contextInput ? contextInput.value.trim() : '';

      goTo(2);
      renderSkeleton(resultWrap);

      fetchRecommendation(apiUrl, selectedGoal, selectedFrequency, context)
        .then(function (data) {
          renderResult(resultWrap, data);
        })
        .catch(function (err) {
          renderError(resultWrap, err && err.message ? err.message : 'Please try again.');

          // Wire retry button
          var retryBtn = resultWrap.querySelector('.ka-result__retry-btn');
          if (retryBtn) {
            retryBtn.addEventListener('click', function () {
              renderSkeleton(resultWrap);
              fetchRecommendation(apiUrl, selectedGoal, selectedFrequency, context)
                .then(function (data) { renderResult(resultWrap, data); })
                .catch(function (retryErr) {
                  renderError(
                    resultWrap,
                    retryErr && retryErr.message
                      ? retryErr.message
                      : 'Still having trouble. Please try again later.'
                  );
                });
            });
          }
        });
    });

    // ── Step 2: reset ─────────────────────────────────────────────────────
    root.querySelector('.ka-quiz__reset-btn').addEventListener('click', function () {
      selectedGoal      = null;
      selectedFrequency = null;
      submitBtn.setAttribute('disabled', '');
      submitBtn.setAttribute('aria-disabled', 'true');
      goalBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      freqBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      var contextInput = root.querySelector('.ka-quiz__context-input');
      if (contextInput) contextInput.value = '';
      goTo(0);
    });
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  // Use DOMContentLoaded. Also handle Shopify theme editor Section rendering
  // events so blocks work when added live in the customiser.
  function boot() {
    document.querySelectorAll('.ka-quiz-block[data-block-id]').forEach(initQuiz);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Shopify theme editor: re-init when a block is added/selected
  document.addEventListener('shopify:block:select', function (e) {
    var root = e.target && e.target.closest
      ? e.target.closest('.ka-quiz-block[data-block-id]')
      : null;
    if (root && !root.dataset.kaInitialised) {
      root.dataset.kaInitialised = '1';
      initQuiz(root);
    }
  });

})();
