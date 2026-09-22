const {
  src,
  dest,
  series,
  parallel
} = require('gulp');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const del = require('del');

const glassCase = 1;
const overBox = 2;
const solCarousel = 3;

let config = {
  sources: {
    scripts: 'src/assets/scripts/',
    styles: 'src/assets/styles/',
    images: 'src/assets/images/loader.gif',
    fonts: 'src/assets/fonts/linea-arrows-10.*'
  },
  destination: {
    root: 'output/',
    development: '/src_dev/',
    production: '/src_prod/',
    styles: 'css/',
    scripts: 'js/',
    fonts: 'fonts/',
    images: 'images/'
  },
  glassCase: {
    name: 'glasscase'
  },
  overBox: {
    name: 'overbox'
  },
  solCarousel: {
    name: 'solcarousel'
  },
  js: {
    options: {
      mangle: {
        toplevel: true
      }
    },
    rename: {
      extname: '.min.js'
    }
  },
  css: {
    rename: {
      extname: '.min.css'
    }
  }
};
getProductName = (product) => {
  let productName = '';
  switch (product) {
    case 1:
      productName = config.glassCase.name;
      break;
    case 2:
      productName = config.overBox.name;
      break;
    case 3:
      productName = config.solCarousel.name;
      break;
  }

  return productName;
}
clean = function () {
  return del('output/*');
}
css = (product) => {
  let pathSource = config.sources.styles + product + '.css';
  let pathDestDev = config.destination.root + product + config.destination.development + config.destination.styles;
  let pathDestProd = config.destination.root + product + config.destination.production + config.destination.styles;

  const cssDev = () => {
    return src(pathSource)
      .pipe(dest(pathDestDev));
  };

  const cssProd = () => {
    return src(pathSource)
      .pipe(uglifycss())
      .pipe(rename(config.css.rename))
      .pipe(dest(pathDestProd));
  };
  const cssProdCopyToAssets = () => {
    return src(pathSource)
      .pipe(uglifycss())
      .pipe(rename(config.css.rename))
      .pipe(dest(config.sources.styles));
  };

  cssDev();
  cssProd();
  cssProdCopyToAssets();

  return Promise.resolve('CSS Done');
}
function isUnminified(file) {
  // stem: (filename without extension) 
  return !file.stem.includes('.min');
}

javascript = (product) => {
  let pathSourceJs = config.sources.scripts + 'jquery.' + product + '.js';
  let pathDestDev = config.destination.root + product + config.destination.development + config.destination.scripts;
  let pathDestProd = config.destination.root + product + config.destination.production + config.destination.scripts;

  let arrPathSources = [pathSourceJs];
  
  if(product == config.solCarousel.name){
    arrPathSources.push(config.sources.scripts + 'dynamics.min.js');
  }

  const jsDev = () => {
    return src(arrPathSources)
      .pipe(dest(pathDestDev));
  };
  const jsProd = () => {
    return src(arrPathSources)
      .pipe(uglify(config.js.options))
      .pipe(gulpif(isUnminified, rename(config.js.rename)))
      .pipe(dest(pathDestProd));
  };
  const jsProdCopyToAssets = () => {
    return src(pathSourceJs)
      .pipe(uglify(config.js.options))
      .pipe(rename(config.js.rename))
      .pipe(dest(config.sources.scripts));
  };

  jsDev();
  jsProd();
  jsProdCopyToAssets();

  return Promise.resolve('JavaScript Done');
}
images = (product) => {
  let pathSource = config.sources.images;
  let pathDestDev = config.destination.root + product + config.destination.development + config.destination.images;
  let pathDestProd = config.destination.root + product + config.destination.production + config.destination.images;

  const imagesDev = () => {
    return src(pathSource)
      .pipe(dest(pathDestDev));
  };
  const imagesProd = () => {
    return src(pathSource)
      .pipe(dest(pathDestProd));
  };

  imagesDev();
  imagesProd();

  return Promise.resolve('Images Done');
}
fonts = (product) => {
  let pathSource = config.sources.fonts;
  let pathDestDev = config.destination.root + product + config.destination.development + config.destination.fonts;
  let pathDestProd = config.destination.root + product + config.destination.production + config.destination.fonts;

  const fDev = () => {
    return src(pathSource)
      .pipe(dest(pathDestDev));
  };
  const fProd = () => {
    return src(pathSource)
      .pipe(dest(pathDestProd));
  };

  fDev();
  fProd();

  return Promise.resolve('Fonts Done');
}
getProductBundle = (product) => {
  css(product);
  javascript(product);
  images(product);
  fonts(product);
}

glasscase = series(clean, () => {
  let product = getProductName(glassCase);
  getProductBundle(product);

  return Promise.resolve('GlassCase bundle done.');
})
overbox = series(clean, () => {
  let product = getProductName(overBox);
  getProductBundle(product);

  return Promise.resolve('OverBox bundle done.');
})
solcarousel = series(clean, () => {
  let product = getProductName(solCarousel);
  getProductBundle(product);

  return Promise.resolve('SolCarousel bundle done.');
})

exports.glasscase = glasscase;
exports.overbox = overbox;
exports.solcarousel = solcarousel;

exports.default = parallel(glasscase, overbox, solcarousel);
