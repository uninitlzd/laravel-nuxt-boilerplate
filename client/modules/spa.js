const path = require('path');
const fs = require('fs-extra');

/**
 * Copy dist files to public/ in spa mode.
 */
module.exports = function () {
  if (this.options.dev || this.options.mode !== 'spa') {
    return
  }

  const publicDir = path.resolve('./public');
  const nuxtOutputDir =  path.resolve('./public/_nuxt');
  const staticDir = path.resolve('./client/static');

  this.nuxt.hook('generate:done', async () => {
    const { html } = await this.nuxt.renderer.renderRoute('/', { url: '/' });

    fs.removeSync(publicDir);

    fs.copySync(this.options.buildDir + '/dist/client', nuxtOutputDir);
    fs.copySync(staticDir, publicDir);
    fs.writeFileSync(nuxtOutputDir + '/index.html', html);

    try {
      fs.removeSync(path.resolve('./dist'))
    } catch (e) {}
  })
};
