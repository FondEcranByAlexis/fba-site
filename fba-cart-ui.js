
/* =========================================
   FBA WALLPAPERS — INTERFACE PANIER
   Compatible avec fba-cart.js
   ========================================= */

(function () {
  "use strict";

  function init() {
    const cart = window.FBACart;

    if (!cart) {
      console.error(
        "FBA : fba-cart.js doit être chargé avant fba-cart-ui.js"
      );
      return;
    }

    if (document.getElementById("fba-cart-drawer")) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.className = "fba-cart-overlay";
    overlay.id = "fba-cart-overlay";

    const drawer = document.createElement("aside");
    drawer.className = "fba-cart-drawer";
    drawer.id = "fba-cart-drawer";
    drawer.setAttribute("aria-label", "Mon panier");
    drawer.setAttribute("aria-hidden", "true");
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");

    drawer.innerHTML = `
      <div class="fba-cart-header">
        <h2>MON <span>PANIER</span></h2>
        <button
          class="fba-cart-close"
          type="button"
          id="fba-cart-close"
        >Fermer</button>
      </div>

      <div class="fba-cart-items"
           id="fba-cart-items"></div>

      <div class="fba-cart-summary">
        <div class="fba-cart-summary-row">
          <span>Articles</span>
          <strong id="fba-cart-quantity">0</strong>
        </div>

        <div class="fba-cart-summary-row">
          <span>Sous-total</span>
          <strong id="fba-cart-subtotal">0,00 €</strong>
        </div>

        <div class="fba-cart-summary-row fba-cart-discount">
          <span>Réduction packs</span>
          <strong id="fba-cart-discount">0,00 €</strong>
        </div>

        <div class="fba-cart-total">
          <span>TOTAL</span>
          <strong id="fba-cart-total">0,00 €</strong>
        </div>

        <button
          class="fba-cart-checkout"
          id="fba-cart-checkout"
          type="button"
          disabled
        >Paiement prochainement</button>

        <p class="fba-cart-notice">
          Boutique en préparation.
          Aucun paiement ni téléchargement HD
          n'est actuellement disponible.
        </p>
      </div>
    `;

    document.body.append(overlay, drawer);

    const itemsRoot =
      document.getElementById("fba-cart-items");

    const closeButton =
      document.getElementById("fba-cart-close");

    let previousFocus = null;

    function isOpen() {
      return drawer.classList.contains("is-open");
    }

    function open() {
      if (isOpen()) return;

      previousFocus = document.activeElement;

      overlay.classList.add("is-open");
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");

      document.body.style.overflow = "hidden";

      closeButton.focus();
    }

    function close() {
      if (!isOpen()) return;

      overlay.classList.remove("is-open");
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");

      document.body.style.overflow = "";

      if (
        previousFocus &&
        typeof previousFocus.focus === "function"
      ) {
        previousFocus.focus();
      }
    }

    function getImage(id) {
      const images = window.FBA_IMAGES || {};
      const path = images[id];

      if (
        typeof path === "string" &&
        !path.startsWith("http:") &&
        !path.startsWith("https:") &&
        !path.startsWith("//")
      ) {
        return path;
      }

      return null;
    }

    function render() {
      const products = cart.getItems();
      const totals = cart.totals();

      itemsRoot.replaceChildren();

      document.getElementById(
        "fba-cart-quantity"
      ).textContent = totals.count;

      document.getElementById(
        "fba-cart-subtotal"
      ).textContent = cart.money(
        totals.subtotalCents
      );

      document.getElementById(
        "fba-cart-discount"
      ).textContent = "- " + cart.money(
        totals.discountCents
      );

      document.getElementById(
        "fba-cart-total"
      ).textContent = cart.money(
        totals.totalCents
      );

      document.querySelectorAll(
        "[data-fba-cart-count]"
      ).forEach(element => {
        element.textContent = totals.count;
      });

      if (!products.length) {
        const empty = document.createElement("div");
        empty.className = "fba-cart-empty";
        empty.textContent =
          "Votre panier est vide. Découvrez les créations FBA et ajoutez vos favoris.";
        itemsRoot.append(empty);
        return;
      }

      products.forEach(product => {
        const row = document.createElement("div");
        row.className = "fba-cart-item";

        const imagePath = getImage(product.id);

        if (imagePath) {
          const img = document.createElement("img");
          img.className = "fba-cart-image";
          img.src = imagePath;
          img.alt = product.name;
          img.loading = "lazy";
          row.append(img);
        }

        const info = document.createElement("div");
        info.className = "fba-cart-item-info";

        const name = document.createElement("strong");
        name.className = "fba-cart-item-name";
        name.textContent = product.name;

        const price = document.createElement("span");
        price.className = "fba-cart-item-price";
        price.textContent = "1,99 €";

        info.append(name, price);

        const remove = document.createElement("button");
        remove.className = "fba-cart-remove";
        remove.type = "button";
        remove.textContent = "Retirer";
        remove.setAttribute(
          "aria-label",
          "Retirer " + product.name
        );

        remove.addEventListener("click", () => {
          cart.remove(product.id);
        });

        row.append(info, remove);
        itemsRoot.append(row);
      });
    }

    // Ouverture via les boutons du site
    document.addEventListener("click", event => {
      const trigger = event.target.closest(
        "[data-fba-cart-open]"
      );

      if (trigger) {
        event.preventDefault();
        open();
      }
    });

    // Ajout au panier depuis les collections
    document.addEventListener("click", event => {
      const button = event.target.closest(
        "[data-fba-add]"
      );

      if (!button || button.disabled) return;

      const id = button.dataset.fbaId;
      const name = button.dataset.fbaName;

      if (!id || !name) return;

      const added = cart.add({ id, name });

      if (added) open();
    });

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", close);

    document.addEventListener("keydown", event => {
      if (!isOpen()) return;

      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          drawer.querySelectorAll(
            'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter(element => element.getClientRects().length);

        if (!focusable.length) {
          event.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    cart.subscribe(render);

    window.FBACartUI = Object.freeze({
      open,
      close,
      render
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
