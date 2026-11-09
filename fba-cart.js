
/* FBA Wallpapers — Panier centralisé */
(function () {
  "use strict";

  const KEY = "fba_cart_v1";

  const UNIT_CENTS = 199;
  const PACK5_CENTS = 699;
  const PACK10_CENTS = 1199;

  const listeners = new Set();

  function sanitize(items) {
    if (!Array.isArray(items)) return [];

    const ids = new Set();

    return items.filter(item => {
      if (
        !item ||
        typeof item.id !== "string" ||
        typeof item.name !== "string"
      ) return false;

      if (
        !/^[a-z0-9][a-z0-9_-]{0,99}$/i.test(item.id) ||
        !item.name.trim() ||
        ids.has(item.id)
      ) return false;

      ids.add(item.id);
      return true;
    }).map(item => ({
      id: item.id,
      name: item.name.slice(0, 200)
    }));
  }

  function getItems() {
    try {
      return sanitize(
        JSON.parse(localStorage.getItem(KEY) || "[]")
      );
    } catch {
      return [];
    }
  }

  function notify() {
    const items = getItems();

    listeners.forEach(fn => fn(items));

    document.dispatchEvent(
      new CustomEvent("fba:cartchange", {
        detail: { items }
      })
    );
  }

  function save(items) {
    const clean = sanitize(items);

    try {
      localStorage.setItem(
        KEY,
        JSON.stringify(clean)
      );
    } catch {
      return false;
    }

    notify();
    return true;
  }

  function add(product) {
    const items = getItems();
    const clean = sanitize([product]);

    if (!clean.length) return false;

    if (items.some(item => item.id === clean[0].id)) {
      return true;
    }

    return save([...items, clean[0]]);
  }

  function remove(id) {
    return save(
      getItems().filter(item => item.id !== id)
    );
  }

  function clear() {
    return save([]);
  }

  function totalCents(n) {
    if (!Number.isSafeInteger(n) || n < 0) {
      throw new Error("Quantité invalide");
    }

    const tens = Math.floor(n / 10);
    const remaining = n % 10;
    const fives = Math.floor(remaining / 5);
    const singles = remaining % 5;

    return (
      tens * PACK10_CENTS +
      fives * PACK5_CENTS +
      singles * UNIT_CENTS
    );
  }

  function money(cents) {
    return (cents / 100).toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR"
    });
  }

  function totals() {
    const count = getItems().length;
    const subtotalCents = count * UNIT_CENTS;
    const total = totalCents(count);

    return {
      count,
      subtotalCents,
      discountCents: subtotalCents - total,
      totalCents: total
    };
  }

  function subscribe(fn) {
    if (typeof fn !== "function") {
      throw new TypeError("Fonction attendue");
    }

    listeners.add(fn);
    fn(getItems());

    return () => listeners.delete(fn);
  }

  window.addEventListener("storage", event => {
    if (event.key === KEY) notify();
  });

  window.FBACart = Object.freeze({
    getItems,
    add,
    remove,
    clear,
    totals,
    totalCents,
    money,
    subscribe
  });

})();
