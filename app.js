const LIBRARY_URL = "https://cdn.jsdelivr.net/gh/gshehu24-hub/tracker-library@main/subscription-lib.js";

const script = document.createElement("script");
script.src = LIBRARY_URL;

script.onload = function () {
  SubscriptionLib.init({
    formId: "subscription-form",
    tbodyId: "subscription-body",
    totalId: "total-count",
    expiredId: "expired-count",
    redirectAfterAdd: "table.html"
  });
};

document.head.appendChild(script);