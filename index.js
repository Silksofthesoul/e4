"use strict";
(_ => {
  domReady(async _ => {
    await script([
      'neuro.js',
      'scene.js'
    ]);

    let data = [];
    const scene = new Scene({
      id: 'scene',
      width: 24,
      height: 24,
      context: { }
    });

  })
})();
