class IGWDPluginMap {
  constructor(map, debug = false) {
    this.map = map;
    this.debug = debug;
  }

  create(src, name, cssSrc = '') {
    let debug = this.debug;
    let plugin = document.createElement('script');
    plugin.src = src;
    document.body.append(plugin);

    if (cssSrc) {
      let cssAdditional = document.createElement('link');
      cssAdditional.rel = "stylesheet";
      cssAdditional.href = cssSrc;
      document.body.append(cssAdditional);
    }

    plugin.onload = function() {
      if (debug) {
        console.log('Loaded plugin ' + src);
      }

      document.dispatchEvent(new CustomEvent('onload-plugin-' + name, {}));
    };
  }

  init() {
    let state = {};

    Object
    .keys(this.map)
    .map(key => {
      state[key] = false;
      if (this.map[key].selectors) {
        this.map[key].selectors.forEach(selector => {
          let element = document.querySelector(selector);

          if (element && !state[key]) {
            this.create(this.map[key].src, key, this.map[key].cssSrc);

            state[key] = true;
          }
        });
      }
    });
  }
}