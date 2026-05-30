(function () {
  if (window.__entertainmeToastInit) return;
  window.__entertainmeToastInit = true;

  const ICONS = {
    success: "bi-check-circle-fill",
    error: "bi-x-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    info: "bi-info-circle-fill"
  };

  function ensureContainer() {
    let container = document.getElementById("em-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "em-toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type, duration) {
    if (!message) return;
    type = type || "info";
    duration = typeof duration === "number" ? duration : 3000;

    const container = ensureContainer();
    const toast = document.createElement("div");
    toast.className = "em-toast em-toast-" + type;

    const icon = document.createElement("i");
    icon.className = "bi " + (ICONS[type] || ICONS.info) + " em-toast-icon";

    const text = document.createElement("div");
    text.className = "em-toast-message";
    text.textContent = message;

    const close = document.createElement("button");
    close.type = "button";
    close.className = "em-toast-close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = '<i class="bi bi-x-lg"></i>';

    const bar = document.createElement("div");
    bar.className = "em-toast-progress";

    toast.appendChild(icon);
    toast.appendChild(text);
    toast.appendChild(close);
    toast.appendChild(bar);
    container.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add("show");
    });

    let timeoutId;
    function dismiss() {
      if (toast.classList.contains("hide")) return;
      clearTimeout(timeoutId);
      toast.classList.remove("show");
      toast.classList.add("hide");
      toast.addEventListener("transitionend", function handler() {
        toast.removeEventListener("transitionend", handler);
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      });
    }

    close.addEventListener("click", dismiss);

    if (duration > 0) {
      bar.style.animationDuration = duration + "ms";
      timeoutId = setTimeout(dismiss, duration);
    } else {
      bar.style.display = "none";
    }

    return { dismiss: dismiss };
  }

  function showConfirm(message, options) {
    options = options || {};
    const okText = options.okText || "Confirm";
    const cancelText = options.cancelText || "Cancel";
    const type = options.type || "warning";
    const title = options.title || "";

    return new Promise(function (resolve) {
      const overlay = document.createElement("div");
      overlay.className = "em-confirm-overlay";

      const card = document.createElement("div");
      card.className = "em-confirm-card em-confirm-" + type;

      const iconWrap = document.createElement("div");
      iconWrap.className = "em-confirm-icon";
      iconWrap.innerHTML = '<i class="bi ' + (ICONS[type] || ICONS.warning) + '"></i>';

      const titleEl = document.createElement("div");
      titleEl.className = "em-confirm-title";
      titleEl.textContent = title;
      if (!title) titleEl.style.display = "none";

      const msgEl = document.createElement("div");
      msgEl.className = "em-confirm-message";
      msgEl.textContent = message;

      const actions = document.createElement("div");
      actions.className = "em-confirm-actions";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "em-confirm-cancel";
      cancelBtn.textContent = cancelText;

      const okBtn = document.createElement("button");
      okBtn.type = "button";
      okBtn.className = "em-confirm-ok";
      okBtn.textContent = okText;

      actions.appendChild(cancelBtn);
      actions.appendChild(okBtn);

      card.appendChild(iconWrap);
      card.appendChild(titleEl);
      card.appendChild(msgEl);
      card.appendChild(actions);
      overlay.appendChild(card);
      document.body.appendChild(overlay);

      requestAnimationFrame(function () {
        overlay.classList.add("show");
      });

      function close(result) {
        overlay.classList.remove("show");
        overlay.addEventListener("transitionend", function handler() {
          overlay.removeEventListener("transitionend", handler);
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        });
        resolve(result);
      }

      okBtn.addEventListener("click", function () { close(true); });
      cancelBtn.addEventListener("click", function () { close(false); });
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) close(false);
      });
      document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") {
          document.removeEventListener("keydown", escHandler);
          close(false);
        }
      });

      setTimeout(function () { okBtn.focus(); }, 50);
    });
  }

  window.showToast = showToast;
  window.showConfirm = showConfirm;
  window.toastSuccess = function (msg, ms) { return showToast(msg, "success", ms); };
  window.toastError = function (msg, ms) { return showToast(msg, "error", ms); };
  window.toastWarning = function (msg, ms) { return showToast(msg, "warning", ms); };
  window.toastInfo = function (msg, ms) { return showToast(msg, "info", ms); };
})();
