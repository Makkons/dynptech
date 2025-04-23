(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const disableScroll = () => {
  try {
    const fixBlocks = document == null ? void 0 : document.querySelectorAll(".fixed-block");
    const pagePosition = window.scrollY;
    document.documentElement.style.scrollBehavior = "none";
    fixBlocks.forEach((el) => {
      el.style.paddingRight = "var(--scroll-bar-width)";
    });
    document.body.style.paddingRight = "var(--scroll-bar-width)";
    document.body.classList.add("disable-scroll");
    document.body.dataset.position = pagePosition;
    document.body.style.top = `-${pagePosition}px`;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const enableScroll = () => {
  try {
    const fixBlocks = document == null ? void 0 : document.querySelectorAll(".fixed-block");
    const body2 = document.body;
    const pagePosition = parseInt(document.body.dataset.position, 10);
    fixBlocks.forEach((el) => {
      el.style.paddingRight = "0px";
    });
    document.body.style.paddingRight = "0px";
    document.body.style.top = "auto";
    document.body.classList.remove("disable-scroll");
    window.scroll({
      top: pagePosition,
      left: 0
    });
    document.body.removeAttribute("data-position");
  } catch (err) {
    console.log(err);
    return false;
  }
};
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
const getHeaderHeight = () => {
  const headerHeight = document == null ? void 0 : document.querySelector(".header").offsetHeight;
  document.querySelector(":root").style.setProperty("--header-height", `${headerHeight}px`);
};
const getScrollBarWidth = () => {
  const body2 = document == null ? void 0 : document.querySelector("body");
  const scrollBarWidth = window.innerWidth - body2.offsetWidth;
  document.querySelector(":root").style.setProperty("--scroll-bar-width", `${scrollBarWidth}px`);
};
(function() {
  const burgers = document.querySelectorAll("[data-burger]");
  const menus = document.querySelectorAll("[data-menu]");
  const overlay = document.querySelector("[data-menu-overlay]");
  const menuItems = document.querySelectorAll("[data-menu-item]");
  if (!burgers.length || !menus.length) return;
  burgers.forEach((burger) => {
    burger.addEventListener("click", () => toggleMenu(burger));
  });
  menuItems == null ? void 0 : menuItems.forEach((item) => {
    item.addEventListener("click", closeAllMenus);
  });
  overlay == null ? void 0 : overlay.addEventListener("click", closeAllMenus);
  function toggleMenu(burger) {
    const menu = document.querySelector(`[data-menu="${burger.dataset.burger}"]`);
    if (!menu) return;
    const isActive = menu.classList.toggle("active");
    burger.classList.toggle("active", isActive);
    burger.setAttribute("aria-expanded", isActive);
    burger.setAttribute("aria-label", isActive ? "Закрыть меню" : "Открыть меню");
    isActive ? disableScroll() : closeAllMenus();
  }
  function closeAllMenus() {
    menus.forEach((menu) => menu.classList.remove("active"));
    burgers.forEach((burger) => {
      burger.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Открыть меню");
    });
    enableScroll();
  }
})();
const body = document.querySelector("body");
const header = document.querySelector(".header");
function setClassOnScroll() {
  const isBodyTop = body.classList.contains("disable-scroll") ? true : false;
  if (window.scrollY > 20) {
    header.classList.add("scroll");
  } else if (!isBodyTop) {
    header.classList.remove("scroll");
  }
}
const throttleSetClassOnScroll = throttle(setClassOnScroll, 200);
window.addEventListener("resize", () => {
  getHeaderHeight();
  getScrollBarWidth();
});
window.addEventListener("scroll", throttleSetClassOnScroll);
document.addEventListener("DOMContentLoaded", () => {
  setClassOnScroll();
  getHeaderHeight();
  getScrollBarWidth();
});
