/* ===== JS Library: SubscriptionLib ===== */
const SubscriptionLib = (function () {
  const STORAGE_KEY = "subscriptions";
  let subscriptions = [];

  function load() {
    try {
      subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      subscriptions = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }

  function isExpired(renewalDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(renewalDate + "T00:00:00") < today;
  }

  function add(data) {
    subscriptions.push({
      id: Date.now(),
      service: data.service,
      provider: data.provider,
      subscriber: data.subscriber,
      renewalDate: data.renewalDate,
      category: data.category
    });
    save();
  }

  function remove(id) {
    subscriptions = subscriptions.filter(function (item) {
      return item.id !== id;
    });
    save();
  }

  function getTotal() {
    return subscriptions.length;
  }

  function getExpiredCount() {
    return subscriptions.filter(function (item) {
      return isExpired(item.renewalDate);
    }).length;
  }

  function createCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
  }

  function renderTable(tbody) {
    tbody.innerHTML = "";

    subscriptions.forEach(function (item) {
      const row = document.createElement("tr");
      row.appendChild(createCell(item.service));
      row.appendChild(createCell(item.provider));
      row.appendChild(createCell(item.subscriber));
      row.appendChild(createCell(item.renewalDate));
      row.appendChild(createCell(item.category));

      const statusCell = document.createElement("td");
      const badge = document.createElement("span");
      const expired = isExpired(item.renewalDate);
      badge.className = "ui-badge " + (expired ? "ui-badge-danger" : "ui-badge-success");
      badge.textContent = expired ? "Expired" : "Active";
      statusCell.appendChild(badge);
      row.appendChild(statusCell);

      const actionCell = document.createElement("td");
      const button = document.createElement("button");
      button.className = "ui-btn ui-btn-danger";
      button.textContent = "Delete";
      button.setAttribute("data-id", item.id);
      actionCell.appendChild(button);
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });
  }

  function renderSummary(totalEl, expiredEl) {
    totalEl.textContent = getTotal();
    expiredEl.textContent = getExpiredCount();
  }
  function init(config) {
    const form = document.getElementById(config.formId);
    const tbody = document.getElementById(config.tbodyId);
    const totalEl = document.getElementById(config.totalId);
    const expiredEl = document.getElementById(config.expiredId);

    function refresh() {
      if (tbody) {
        renderTable(tbody);
      }
      if (totalEl && expiredEl) {
        renderSummary(totalEl, expiredEl);
      }
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        add({
          service: form.elements["service"].value.trim(),
          provider: form.elements["provider"].value.trim(),
          subscriber: form.elements["subscriber"].value.trim(),
          renewalDate: form.elements["renewal-date"].value,
          category: form.elements["category"].value.trim()
        });
        form.reset();
        window.location.href = config.redirectAfterAdd;
      });
    }

    if (tbody) {
      tbody.addEventListener("click", function (event) {
        const id = event.target.getAttribute("data-id");
        if (id) {
          remove(Number(id));
          refresh();
        }
      });
    }

    load();
    refresh();
  }


  return {
    init: init,
    add: add,
    remove: remove,
    getTotal: getTotal,
    getExpiredCount: getExpiredCount,
    isExpired: isExpired
  };
})();
SubscriptionLib.init({
  formId: "subscription-form",
  tbodyId: "subscription-body",
  totalId: "total-count",
  expiredId: "expired-count",
  redirectAfterAdd: "table.html"
});