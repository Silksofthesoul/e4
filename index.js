"use strict";
(_ => {
  domReady(async _ => {
    const projectPath = '.';
    await script([
      `${projectPath}/neuro.js`,
      `${projectPath}/scene.js`
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
