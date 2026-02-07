const createGlobalStore = (key, initialState) => {
  const masterCopy = JSON.parse(JSON.stringify(initialState));
  const savedState = localStorage.getItem(key);
  let data = savedState ? JSON.parse(savedState) : { ...initialState };

  // List of component update functions
  const listeners = new Set();

  let queued = false;
  const trigger = () => {
    if (!queued) {
      queued = true;
      Promise.resolve().then(() => {
        localStorage.setItem(key, JSON.stringify(data));
        // Notify every subscriber
        listeners.forEach(fn => fn(data));
        queued = false;
      });
    }
  };

  const handler = {
    get(target, property) {
      // 1. Handle Subscriptions
      if (property === 'subscribe') {
        return (fn, selector = (s) => s) => {
          let lastSelection = JSON.parse(JSON.stringify(selector(data)));

          const listener = (newState) => {
            const newSelection = selector(newState);
            // Only run the function if the selected data has changed
            if (JSON.stringify(newSelection) !== JSON.stringify(lastSelection)) {
              lastSelection = JSON.parse(JSON.stringify(newSelection));
              fn(newSelection);
            }
          };

          listeners.add(listener);
          fn(selector(data)); // Initial call
          return () => listeners.delete(listener);
        };
      }
      // 2. Handle Reset (same as before)
      if (property === 'reset') {
        return (keysToReset) => {
          if (Array.isArray(keysToReset)) {
            // Reset only specific top-level keys
            keysToReset.forEach(k => {
              if (k in masterCopy) {
                data[k] = JSON.parse(JSON.stringify(masterCopy[k]));
              }
            });
          } else {
            // Full Reset
            localStorage.removeItem(key);
            Object.keys(data).forEach(k => delete data[k]);
            Object.assign(data, JSON.parse(JSON.stringify(masterCopy)));
          }
          trigger();
        };
      }

      const value = target[property];
      if (typeof value === 'object' && value !== null) {
        return new Proxy(value, handler);
      }

      return value;
    },
    set(target, property, value) {
      if (target[property] === value) {
        return true;
      }
      target[property] = value;
      trigger();
      return true;
    }
  };

  return new Proxy(data, handler);
};

const defaultState = {
  settings: {
    name: "Train Your Ear",
  },
  ui: {
    routes: [
      {
        uri: "/",
        label: "Home",
      },
      {
        uri: "/help",
        label: "Help",
      },
      {
        uri: "/404",
        label: "Not Found",
        hidden: true,
      },
    ],
    activeRouteIndex: 0,
  }
};

export const appStore = createGlobalStore('app', defaultState);
