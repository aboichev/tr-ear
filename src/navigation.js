import { appStore } from './state/appStore.js'

function renderMenu(newState) {
  let navHtml = '';
  for (const [index, route] of newState.routes.entries()) {
    if (route.hidden === true) {
      continue;
    }
    if (index === newState.activeRouteIndex) {
      navHtml += `<span>${route.label}</span>`;
    }
    else {
      navHtml += `<a href="${route.uri}">${route.label}</a>`;
    }
  }

  document.getElementById('mainNav').innerHTML = navHtml;
}

function updateDomOnActiveRouteChanged(newState) {
  // Update the DOM
  const activeRoute = newState.routes[newState.activeRouteIndex];

  document.title = `${appStore.settings.name} - ${activeRoute.label}`;
  document.getElementById('header').innerHTML = activeRoute.label;

  renderMenu(newState);
}

function triggerStateChange(path) {
  const newIndex = appStore.ui.routes.findIndex(x => x.uri === path);
  if (newIndex >= 0) {
    appStore.ui.activeRouteIndex = newIndex;
  }
  else {
    appStore.ui.activeRouteIndex = appStore.ui.routes.findIndex(x => x.uri === '/404');
  }
}

function handleNavEvent(event) {
  // Only intercept same-document navigations (ignore external links, etc.)
  if (!event.canIntercept || event.hashChange || event.downloadRequest) return;

  // Intercept the navigation to prevent a full page reload
  event.intercept({
    async handler() {
      const path = new URL(event.destination.url).pathname;
      triggerStateChange(path);
    }
  });
}

export function init() {
  // Attach nav handler, that will trigger state change
  navigation.addEventListener('navigate', handleNavEvent);
  // Subscribe dom update to state changes
  appStore.subscribe(updateDomOnActiveRouteChanged, (s) => s.ui);
  // Trigger the state change to manually when page loads
  triggerStateChange(window.location.pathname);
}
