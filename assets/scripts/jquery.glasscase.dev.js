/*!
 * VERSION: 3.0.1
 * DATE: 2018-04-06
 * DOCS AT: http://www.tinycomp.net/
 * 
 * @license Copyright (c) 2014-2018, tinyComp. All rights reserved.
 * 
 * @author: tinyComp, tinycomp@outlook.com
 **/
;
(function ($, window, document, undefined) {
  'use strict';

  let Modernizr = window.Modernizr;

  class GCLoader {
    color;
    pLoadingClass;
    gcLoadingClass;
    gcLoading;

    constructor(colorLoading) {
      this.color = colorLoading;
      this.pLoadingClass = 'gc-ploading';
      this.gcLoadingClass = (Modernizr.csstransforms === true) ? 'gc-loading3' : 'gc-loading';
      this.gcLoading = $('<div class="' + this.pLoadingClass + '"><div class="' + this.gcLoadingClass + '"></div></div>"');

      this.init();
    }

    init() {
      let c;

      if (this.color !== -1 && Modernizr.csstransforms === true) {
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(this.color)) {
          c = this.color.substring(1).split('');
          if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
          }
          c = '0x' + c.join('');
          let sC = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
          this.gcLoading.find('.' + this.gcLoadingClass).css({
            'border-top-color': sC + '0.2)',
            'border-right-color': sC + '0.2)',
            'border-bottom-color': sC + '0.2)',
            'border-left-color': sC + '1)'
          });
        }

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
        if (result) {
          let sC = 'rgba(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) + ', ';
          this.gcLoading.find('.' + this.gcLoadingClass).css({
            'border-top-color': sC + '0.2)',
            'border-right-color': sC + '0.2)',
            'border-bottom-color': sC + '0.2)',
            'border-left-color': sC + '1)'
          });
        }
      }

    }
    getInstance() {
      return this.gcLoading;
    }
  }
  class GCImage {
    //Properties
    type = 'image';
    width = 0;
    height = 0;
    url; //src
    altTxt; //alt
    caption;
    state = 'new'; //new; loading; loaded; error;
    dfdState = $.Deferred();
    instanceCnt = [];
    instance = [];
    instanceDisplay = [];
    errorTxt;
    tmp = ['thumb', 'display', 'zoom', 'overlay']; //templates
    loader = [];
    wDisplayR = 0;
    hDisplayR = 0;
    isMouseEventsOn = false;
    colorLoading;
    isEnlarged = false;

    constructor(element, config) {
      this.url = $(element).attr('src');
      this.altTxt = $(element).attr('alt') || 'image';
      this.caption = $(element).data('gc-caption') || '';
      this.errorTxt = config.textImageNotLoaded;
      this.colorLoading = config.colorLoading;

      this.init();
    }
    //Methods
    init() {
      $.each(this.tmp, (index, tmpI) => {
        switch (tmpI) {
          case 'zoom':
            this.instance.push($(`<div class="gc-zoom-container">
                                                <img src=${this.url} alt=${this.altTxt} />
                                            </div>`));
            break;
          case 'display':
            this.instance.push($(`<div class="gc-slide-container">
                        <div class="gc-display-container">
                        <img class="gc-display-display" src=${this.url} alt=${this.altTxt} />
                        </div></div>`));
            break;
          case 'thumb':
            this.instance.push($(`<div class="gc-display-container">
                        <img class="gc-display-display" src=${this.url} alt=${this.altTxt} />
                        </div>`));
            break;
          case 'overlay':
            this.instance.push($(`<li><img src=${this.url} alt=${this.altTxt} /></li>`));
            break;
        }

        this.instanceDisplay.push(this.instance[index].find('img').hide());
        this.loader.push(new GCLoader(this.colorLoading));
      });

      if (this.state === 'new') {
        this.state = 'loading';
        this.addLoader();

        $.when(this.preload()).done(() => {
          if (this.state === 'error') {
            $.each(this.instance, (index) => {
              this.instance[index].find('img').attr('src', this.url);
            });
          }
          this.removeLoader();
          this.fitSize();
          this.dfdState.resolve();
        });
      }
    };

    getInstance(area) {
      return this.instance[$.inArray(area, this.tmp)];
    };
    getInstanceDisplay(area) {
      return this.instanceDisplay[$.inArray(area, this.tmp)];
    };
    preload() {
      let _this = this;

      return $.Deferred(
        function (dfd) {
          $('<img/>')
            .on('load', function () {
              _this.width = this.width;
              _this.height = this.height;
              _this.state = 'loaded';

              dfd.resolve();
            })
            .on('error', function () {
              this.onerror = '';

              _this.state = 'error';
              if (Modernizr.svg) {
                //Is needed the width and height of the li container
                _this.width = 150;
                _this.height = 150;

                let iEDB64 = window.btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${_this.width}" height="${_this.height}"><rect width="${_this.width}" height="${_this.height}" fill="#fff"/><text text-anchor="middle" x="${_this.width / 2 }" y="${_this.height / 2 }" style="fill:#333;font-weight:bold;font-size:16px;font-family:Arial,Helvetica,sans-serif;dominant-baseline:central">${_this.errorTxt}</text></svg>`);
                _this.url = 'data:image/svg+xml;base64,' + iEDB64;
              }

              dfd.resolve();
            }).attr('src', _this.url);
        }
      ).promise();
    };
    fitSize() {
      $.each(this.instanceDisplay, (index, el) => {

        if (this.tmp[index] === 'display') {
          this.instance[index].find('.gc-display-container').addClass('gc-dc-center');
        }

        if (this.tmp[index] === 'thumb') {
          let wRatio = this.instance[index].width() / this.width;
          let hRatio = this.instance[index].height() / this.height;
          let ratioImg = wRatio > hRatio ? wRatio : hRatio;

          el.width(Math.ceil(this.width * ratioImg, 10));
          el.height(Math.ceil(this.height * ratioImg, 10));

          let percMarginLeft = ((el.outerWidth() / 2) * 100) / (this.instance[index].outerWidth());
          let percMarginTop = ((el.outerHeight() / 2) * 100) / (this.instance[index].outerWidth());

          el.css({
            'margin-top': "-" + percMarginTop + "%",
            'margin-left': "-" + percMarginLeft + "%"
          });
        }

        //old
        // if (this.tmp[index] === 'overlay') {
        //   this.instanceDisplay[index]
        //     .removeClass('gc-overlay-display-hcenter gc-overlay-display-vcenter')
        //     .addClass('gc-overlay-display-center');
        // }
      });
    };
    isFitScr(width, height) {
      return (this.width <= width) && (this.height <= height);
    };
    showNF(displayType) { //displayType: fit [default], nat
      $.each(this.tmp, (index, tmpI) => {
        if (tmpI === 'overlay') {
          if (displayType === 'fit') {
            this.isEnlarged = false;
            this.instance[index].removeClass('gc-overlay-enlarge');
          } else {
            this.isEnlarged = true;
            this.instance[index].addClass('gc-overlay-enlarge');
          }
        }
      });
    };
    addLoader() {
      $.each(this.instanceDisplay, (index, el) => {
        $(el).before(this.loader[index].getInstance());
      });
    };
    removeLoader() {
      $.each(this.instance, (index, el) => {
        $(el).find('.' + this.loader[index].pLoadingClass).remove();
        $(this.instanceDisplay[index]).fadeIn();
      });
    };
  }
  class GCIFrame {
    //Properties
    type = 'iframe';
    width;
    height;
    url;
    urlImgPoster;
    txtImgThumb;
    state;
    instance = [];
    instanceIFrame = [];
    dfdState = $.Deferred();
    tmp = ['thumb', 'display', 'overlay'];
    loader = [];
    isMouseEventsOn = false;

    constructor(element, config) {
      this.width = $(element).data('gc-width') || config.iframeWidth || 0;
      this.height = $(element).data('gc-height') || config.iframeHeight || 0;
      this.url = $(element).attr('href');
      this.urlImgPoster = $(element).data('gc-poster-image') || ''; //NOT USED
      this.txtImgThumb = config.txtImgThumbIframe || 'IFRAME';

      this.init();
    }
    //Methods
    init() {
      $.each(this.tmp, (index, tmpI) => {
        this.loader.push(new GCLoader());

        if (tmpI === 'thumb') {
          this.instance.push($(`<div class="gc-display-container gc-thumb-img">
                        <div class="gc-icon gc-icon-play"></div>
                        <span>${this.txtImgThumb}</span>
                    </div>`));
          this.instanceIFrame.push($(''));
          this.instance[index].addClass('gc-dd-center');
        }
        if (tmpI === 'display') {
          this.instance.push($(`<div class="gc-slide-container">
                        <div class="gc-display-container gc-dd-center" style="background-color: rgb(0, 0, 0);">
                            <iframe class="gc-display-display" frameborder="0" allowfullscreen width="100%" height="100%" style = "background: #000;"/>
                        </div>
                    </div>`));
          this.instanceIFrame.push(this.instance[index].find('iframe'));
          this.instanceIFrame[index].attr('src', '//about:blank');
          this.instance[index].hide();

          $.when(this.preload(tmpI)).done(result => {
            this.fitSize(tmpI);
            this.instance[index].fadeIn();
            this.dfdState.resolve();
          });
        }
        if (tmpI === 'overlay') {
          // this.instance.push($(`<div class="gc-overlay-container-display gc-dd-center" style="background-color: rgb(0, 0, 0);">
          //               <iframe frameborder="0" allowfullscreen width="100%" height="100%" style = "background: #000;"/>
          //           </div>`));

          //New
          this.instance.push($(`<li>
                      <div class="gc-overlay-container-display gc-dd-center" style="background-color: rgb(0, 0, 0); max-width: ${this.width}px; max-height: ${this.height}px">
                        <iframe frameborder="0" allowfullscreen width="100%" height="100%" style = "background: #000;"/>
                      </div>
                    </li>`));
          this.instanceIFrame.push(this.instance[index].find('iframe'));
          this.instanceIFrame[index].attr('src', '//about:blank');

          $.when(this.preload(tmpI)).done(result => {
            this.fitSize(tmpI);
            this.dfdState.resolve();
          });
        }
      });
    };
    getInstance(area, width, height) {
      if (area !== 'thumb') {
        this.fitSize(area, width, height);
      }

      return this.instance[$.inArray(area, this.tmp)];
    };
    preload(area) {
      var _this = this;

      return $.Deferred(
        function (dfd) {
          _this.instanceIFrame[$.inArray(area, _this.tmp)].on('load', function () {
            dfd.resolve();
          }).attr('src', _this.url);
        }
      ).promise();
    };
    //ToDo: fitSize no need for overlay?!
    fitSize(area, cWidth, cHeight) {
      let index = $.inArray(area, this.tmp);
      let oConfig = {};
      let ratio;
      let ratioC;

      if (this.height <= cHeight && this.width <= cWidth) {
        oConfig = {
          'width': this.width,
          'height': this.height
        };
      } else {
        ratio = this.width / this.height;

        if (this.height > cHeight && this.width <= cWidth) {
          oConfig = {
            'width': cHeight * ratio,
            'height': cHeight
          };
        }

        if (this.height < cHeight && this.width > cWidth) {
          oConfig = {
            'width': cWidth,
            'height': cWidth / ratio
          };
        }

        if (this.height > cHeight && this.width > cWidth) {
          ratioC = cWidth / cHeight;

          if (ratioC < ratio) {
            oConfig = ratio > 1 ? {
              'width': cWidth,
              'height': cWidth / ratio
            } : {
              'width': cHeight * ratio,
              'height': cHeight
            };
          } else {
            oConfig = ratio > 1 ? {
              'width': cHeight * ratio,
              'height': cHeight
            } : {
              'width': cWidth,
              'height': cWidth / ratio
            };
          }
        }
      }
      if (area === 'display') {
        this.instance[index].find('.gc-display-container').css(oConfig);
      } else if (area === 'overlay') {
        $(this.instance[index]).find('.gc-overlay-container-display').css(oConfig);
      } else {
        $(this.instance[index]).css(oConfig);
      }
    };
    addLoader() {
      $.each(this.instanceIFrame, (index, el) => {
        if (this.tmp[index] !== 'thumb')
          $(el).before(this.loader[index].getInstance());
      });
    };
    removeLoader() {
      $.each(this.instance, (index, el) => {
        $(el).find('.' + this.loader[index].pLoadingClass).remove();
      });
    };
    navigate(area) {
      let index = $.inArray(area, this.tmp);

      this.instanceIFrame[index].detach();

      if (area === 'display') {
        this.instanceIFrame[index].appendTo(this.instance[index].find('.gc-display-container'));
      }
      if (area === 'overlay') {
        this.instanceIFrame[index].appendTo(this.instance[index]);
      }
    };
  }
  class GCVideo {
    //Properties
    type = 'video';
    url;
    width;
    heigh;
    formats;
    poster;
    txtImgThumb;
    instance = [];
    instanceVC = []; // video container
    instanceVideo = [];
    state;
    dfdState = $.Deferred();
    tmp = ['thumb', 'display', 'overlay'];
    isMouseEventsOn = false;

    constructor(element, config) {
      this.url = $(element).attr('href');
      this.width = parseInt($(element).data('gc-width'), 10) || config.videoWidth || 0;
      this.height = parseInt($(element).data('gc-height'), 10) || config.videoHeight || 0;
      this.formats = $(element).data('gc-formats') || [];
      this.poster = $(element).data('gc-poster') || '';
      this.txtImgThumb = config.txtImgThumbVideo || 'VIDEO';

      this.init();
    }

    //Methods
    init() {
      $.each(this.tmp, (index, tmpI) => {
        if (tmpI === 'thumb') {
          this.instance.push($(`<div class="gc-display-container gc-thumb-img">
                    <div class="gc-icon gc-icon-play"></div>
                    <span>${ this.txtImgThumb }</span>
                </div>`));
          this.instanceVC.push($(''));
          this.instanceVideo.push($(''));
          this.instance[index].addClass('gc-dd-center');
        }
        if (tmpI === 'display') {
          this.instance.push($(`<div class="gc-slide-container">
                    <div class="gc-display-container gc-dd-center" style = "background-color: #000;">
                        <video class="gc-display-display" controls preload style="width: 100%; height: 100%;" poster="${ this.poster } "/>
                    </div>
                </div>`));
          this.instanceVC.push(this.instance[index].find('.gc-display-container'));
          this.instanceVideo.push(this.instanceVC[index].find('.gc-display-display'));

          this.instance[index].hide();
          this.formats.unshift(this.url);

          $.each(this.formats, (i, v) => {
            switch (v.split('.').pop()) {
              case 'webm':
                this.instanceVideo[index].append(`<source src="${ v }" type="video/webm" />`);
                break;
              case 'ogv':
                this.instanceVideo[index].append(`<source src="${ v }" type="video/ogg" />`);
                break;
              case 'mp4':
                this.instanceVideo[index].append(`<source src="${ v }" type="video/mp4" />`);
                break;
            }
          });
          this.fitSize(tmpI);
          this.instance[index].fadeIn();
          this.dfdState.resolve();
        }
        if (tmpI === 'overlay') {
          // this.instance.push($(`<div class="gc-overlay-container-display gc-dd-center" style = "background-color: #000;">
          //           <video class="gc-overlay-display" controls preload style="width: 100%; height: 100%;" poster="${ this.poster }"/>
          //       </div>`));

          //New
          this.instance.push($(`<li>
                  <div class="gc-overlay-container-display gc-dd-center" style="background-color: rgb(0, 0, 0); max-width: ${this.width}px; max-height: ${this.height}px">
                    <video class="gc-overlay-display" controls preload style="width: 100%; height: 100%;" poster="${this.poster}"/>
                  </div>
                </li>`));

          this.instanceVC.push('');
          this.instanceVideo.push(this.instance[index].find('.gc-overlay-display'));
          this.instance[index].hide();
          this.formats.unshift(this.url);

          $.each(this.formats, (i, v) => {
            switch (v.split('.').pop()) {
              case 'webm':
                this.instanceVideo[index].append(`<source src="${ v }" type="video/webm" />`);
                break;
              case 'ogv':
                this.instanceVideo[index].append(`<source src="${ v }" type="video/ogg" />`);
                break;
              case 'mp4':
                this.instanceVideo[index].append(`<source src="${ v }" type="video/mp4" />`);
                break;
            }
          });

          this.instance[index].fadeIn();
          this.dfdState.resolve();
        }
      });
    };
    getInstance(area, width, height) {
      if (area !== 'thumb') {
        this.fitSize(area, width, height);
      }

      return this.instance[$.inArray(area, this.tmp)];
    };
    fitSize(area, cWidth, cHeight) {
      let index = $.inArray(area, this.tmp);
      let oConfig = {};
      let ratio;
      let ratioC;

      if (this.height <= cHeight && this.width <= cWidth) {
        oConfig = {
          'width': this.width,
          'height': this.height
        };
      } else {
        ratio = this.width / this.height;

        if (this.height > cHeight && this.width <= cWidth) {
          oConfig = {
            'width': cHeight * ratio,
            'height': cHeight
          };
        }

        if (this.height < cHeight && this.width > cWidth) {
          oConfig = {
            'width': cWidth,
            'height': cWidth / ratio
          };
        }

        if (this.height > cHeight && this.width > cWidth) {
          ratioC = cWidth / cHeight;

          if (ratioC < ratio) {
            oConfig = ratio > 1 ? oConfig = {
              'width': cWidth,
              'height': cWidth / ratio
            } : oConfig = {
              'width': cHeight * ratio,
              'height': cHeight
            };
          } else {
            oConfig = ratio > 1 ? oConfig = {
              'width': cHeight * ratio,
              'height': cHeight
            } : oConfig = {
              'width': cWidth,
              'height': cWidth / ratio
            };
          }
        }
      }
      if (area === 'display') {
        this.instanceVC[index].css(oConfig);
      } else {
        $(this.instance[index]).css(oConfig);
      }
    };
    navigate(area) {
      let index = $.inArray(area, this.tmp);

      this.instanceVideo[index].detach();

      if (area === 'display') {
        this.instanceVideo[index].appendTo(this.instanceVC[index]);
      }
      if (area === 'overlay') {
        this.instanceVideo[index].appendTo(this.instance[index]);
      }
    };
  }
  class GCDisplay {
    //Properties
    component;
    width;
    height;
    wDperc = 100; //widthDisplayPerc
    isShowAlwaysIcons;
    speedHideIcons;
    mouseEnterCB;
    mouseLeaveCB;
    isAutoPlay;
    pauseTime;
    isPauseOnHover;
    isDownloadEnabled;
    downloadPosition;

    instancePrime = $(`<div class="gc-display-area">
            <div class = "gc-display-area-container">
                <div class="gc-icon gc-icon-download"></div>
                <div class="gc-icon gc-icon-next"></div>
                <div class="gc-icon gc-icon-prev"></div>
            </div>
        </div>`);
    instance;
    slidesCnt;
    slides;
    display;
    btnPrevious;
    btnNext;
    btnDownload;
    currentMousePos = {
      x: -1,
      y: -1
    };
    mousePos = 'out'; //in; out
    isMouseInDspArea = false;
    mouseTimer = 0;
    isTouchMove = false;
    tpStart = {
      x: 0,
      y: 0
    };
    tpEnd = {
      x: 0,
      y: 0
    };
    autoPlayInterval = '';
    supportCanvas = Modernizr.canvas;

    constructor(config, component) {
      this.component = component;
      this.width = config.widthDisplay;
      this.height = config.heightDisplay;
      this.isShowAlwaysIcons = config.isShowAlwaysIcons;
      this.speedHideIcons = config.speedHideIcons;
      this.mouseEnterCB = config.mouseEnterDisplayCB;
      this.mouseLeaveCB = config.mouseLeaveDisplayCB;
      this.isAutoPlay = config.isAutoPlayDisplay;
      this.pauseTime = config.pauseTimeDisplay;
      this.isPauseOnHover = config.isPauseOnHoverDisplay;
      this.isDownloadEnabled = config.isDownloadEnabled;
      this.downloadPosition = config.downloadPosition;
      this.lens = new GCLens(config, component);
      this.zoom = new GCZoom(config, component);

      this.instance = this.instancePrime.find('.gc-display-area-container');
      this.btnPrevious = this.instance.find('.gc-icon-prev');
      this.btnNext = this.instance.find('.gc-icon-next');
      this.btnDownload = this.instance.find('.gc-icon-download');

      if (this.zoom.isZCapEnabled === true) {
        this.zoom.caption = new GCCaption(config, this.zoom);
      }

      this.init();
    }

    init() {
      let cssDownloadPosition = {
          top: '',
          bottom: '',
          right: '',
          left: ''
        },
        bW = '-' + this.instancePrime.css('border-left-width');

      if (this.component.element.find('li').length === 1 || this.isShowAlwaysIcons === false) {
        this.btnPrevious.hide();
        this.btnNext.hide();
        this.btnDownload.hide();
      }

      if (this.isDownloadEnabled === false || this.supportCanvas === false) {
        this.btnDownload.addClass('gc-hide');
      } else {
        switch (this.downloadPosition) {
          case 1:
            cssDownloadPosition.top = bW;
            cssDownloadPosition.left = bW;
            break;
          case 2:
            cssDownloadPosition.top = bW;
            cssDownloadPosition.right = bW;
            break;
          case 4:
            cssDownloadPosition.bottom = bW;
            cssDownloadPosition.right = bW;
            break;
          default:
            cssDownloadPosition.bottom = bW;
            cssDownloadPosition.left = bW;
            break;
        }
        this.btnDownload.css(cssDownloadPosition);
      }
    };
    initEvents() {
      var _this = this;

      _this.instance.on('mouseenter.glasscaseA', () => _this.isMouseInDspArea = true)
        .on('mouseleave.glasscaseA', () => _this.isMouseInDspArea = false);

      $(_this.lens.getInstance())
        .on('mousemove.glasscase', _this, (event, eventTrigger) => event.data.mousemoveHandler(event, eventTrigger))
        .on('mouseenter.glasscase', _this, (event, eventTrigger) => event.data.mouseenterHandler(event, eventTrigger))
        .on('mouseenter.glasscase', _this, event => event.data.mouseEnterCB())
        .on('mouseleave.glasscase', _this, (event, eventTrigger) => event.data.mouseleaveHandler(event, eventTrigger))
        .on('mouseleave.glasscase', _this, event => event.data.mouseLeaveCB())
        .on('touchstart.glasscase', _this, event => event.data.touchStart(event))
        .on('touchmove.glasscase', _this, event => event.data.touchMove(event))
        .on('touchend.glasscase', _this, event => event.data.touchEnd(event));

      if (_this.isShowAlwaysIcons === false && _this.component.thumbs.li.length > 1) {
        _this.instance.on('mouseenter.glasscaseDA', _this, event => event.data.toggleNavBtn('show', 'mouseenter', event))
          .on('mouseleave.glasscaseDA', _this, event => event.data.toggleNavBtn('hide', 'mouseleave', event))
          .on('mousemove.glasscaseDA', _this, event => {
            let _this = event.data;

            _this.toggleNavBtn('show');
            clearTimeout(_this.mouseTimer);
            _this.mouseTimer = setTimeout(() => _this.toggleNavBtn('hide'), _this.speedHideIcons);
          })
          .on('touchmove.glasscaseDA', _this, event => {
            _this.toggleNavBtn('show');
            clearTimeout(_this.mouseTimer);
            _this.mouseTimer = setTimeout(() => _this.toggleNavBtn('hide'), _this.speedHideIcons);

            if (_this.zoom.isEnabled === true) {
              event.preventDefault();
            }
          });
      }
      if (_this.component.overlay.isEnabled === true) {
        $.each(_this.component.items, (index, slide) => {
          $.when(slide.dfdstate).done(() => {

            if (slide.type === 'video') {
              $(slide.getInstance('display')).on('click.glasscase', event => _this.component.overlay.toggle())
                .find('video').on('click.glasscase', e => {
                  return false
                });
            } else {
              $(slide.getInstance('display')).on('click.glasscase', event => _this.component.overlay.toggle());
            }
          });
        });
      }

      _this.btnPrevious.on('click.glasscase', () => _this.navigate('previous'));
      _this.btnNext.on('click.glasscase', () => _this.navigate('next'));

      _this.btnDownload.on('click.glasscase', _this, event => {
        let _this = event.data,
          canvas = document.createElement('canvas'),
          blob = new Blob();
        canvas.width = _this.component.items[_this.component.thumbs.current].width;
        canvas.height = _this.component.items[_this.component.thumbs.current].height;
        let context = canvas.getContext('2d'),
          image = _this.instance.find('.gc-display-display')[_this.component.thumbs.current];

        context.drawImage(image, 0, 0);
        canvas.toBlob(blob => saveAs(blob, $(image).attr('src').replace(/^.*[\\\/]/, '')), 'image/png');
      });

      if (_this.isAutoPlay === true) {
        _this.autoPlay('start');

        if (_this.isPauseOnHover === true) {
          _this.instance.on('mouseenter.glasscase', _this, event => {
              let _this = event.data;
              _this.autoPlay('stop')
            })
            .on('mouseleave.glasscase', _this, event => {
              let _this = event.data;
              _this.autoPlay('start')
            });
        }
      }
    };
    setup(wC) {
      wC = this.component.element.outerWidth();
      let nextDW = this.wDperc * wC / 100,
        nextDH = nextDW * this.height / this.width;

      this.instancePrime.css({
          'height': '0',
          'width': '0'
        })
        .css({
          'height': Math.ceil(nextDH),
          'width': Math.ceil(nextDW)
        });

      $.each(this.component.items, (index, item) => this.instance.append(this.component.items[index].getInstance('display', Math.ceil(nextDW), Math.ceil(nextDH))));

      this.slidesCnt = this.instance.find('.gc-slide-container');
      $(this.slidesCnt[this.component.thumbs.current]).addClass('gc-slide-container-current');
      this.slides = this.slidesCnt.find('.gc-display-container');
      this.display = this.slides.find('.gc-display-display');

      $.each(this.component.items, (index, item) => {
        $.when(item.dfdState).done(() => {
          if (item.type === 'image') {
            this.setupDisplay(index, item); //ToDo: check why double-call
            this.setupDisplay(index, item);
          }
        });
      });

      this.btnPrevious.css('margin-top', -(this.btnPrevious.outerHeight() / 2));
      this.btnNext.css('margin-top', -(this.btnNext.outerHeight() / 2));
    };
    setupZoomLens() {
      $.when(this.component.items[this.component.thumbs.current].dfdState).done(() => {

        if (this.component.items[this.component.thumbs.current].isMouseEventsOn === false) {
          this.mouseleaveHandler();
          return;
        }

        if (this.component.items[this.component.thumbs.current].type === 'image') {
          $(this.slides[this.component.thumbs.current]).append(this.lens.getInstance());
          this.zoom.changeCnt();

          $.when(this.zoom.dfdState).done(() => {
            this.lens.setup(this, this.component.items[this.component.thumbs.current]);

            if (this.isMousePosInDsp() && this.isMouseInDspArea === true) {
              this.mouseenterHandler();
            } else {
              this.mouseleaveHandler();
            }
          });
        }
      });
    };
    setupDisplay(index, item) {
      let ratio,
        wdd,
        hdd;

      $(this.slides[index]).css({
          'width': '0',
          'height': '0'
        })
        .css({
          'width': this.instance.width(),
          'height': this.instance.height()
        });

      item.wDisplayR = $(this.slides[index]).outerWidth() / item.width;
      item.hDisplayR = $(this.slides[index]).outerHeight() / item.height;

      if ((item.wDisplayR < 1 || item.hDisplayR < 1)) {
        item.isMouseEventsOn = this.zoom.isEnabled === true ? true : false;
        ratio = item.wDisplayR < item.hDisplayR ? item.wDisplayR : item.hDisplayR;
      } else {
        // In case that the image's width and height are smaller than the container's width and height
        item.isMouseEventsOn = false;
        ratio = 1;
      }
      wdd = ratio * item.width;
      hdd = ratio * item.height;

      if (this.component.items[index].type === 'image') {
        $(this.display[index]).css({
          'width': wdd,
          'height': hdd
        });
      }
      $(this.slides[index]).css({
        'width': wdd,
        'height': hdd
      });

      // Positioning the container in the center of DisplayArea
      var borderVal = parseFloat(this.instance.css('border-left-width')) * 2;
      var paddingVal = parseFloat(this.instance.css('padding-top')) * 2;

      var percMarginLeft = (($(this.slides[index]).outerWidth() / 2) * 100) / (this.instance.outerWidth() - borderVal - paddingVal);
      var percMarginTop = (($(this.slides[index]).outerHeight() / 2) * 100) / (this.instance.outerWidth() - borderVal - paddingVal);

      $(this.slides[index]).css({
        'margin-left': '-' + percMarginLeft + '%',
        'margin-top': '-' + percMarginTop + '%'
      });
    };
    getInstance() {
      return this.instancePrime;
    };
    mousemoveHandler(event, oEventTrigger) {
      if (oEventTrigger !== undefined) {
        event = oEventTrigger;
      }

      if (event !== undefined) {
        this.currentMousePos = this.isTouchMove === true && event.originalEvent.touches.length === 1 ? {
          x: event.originalEvent.touches[0].pageX,
          y: event.originalEvent.touches[0].pageY
        } : {
          x: event.pageX,
          y: event.pageY
        };
      }

      if (this.currentMousePos.x === -1 && this.currentMousePos.y === -1) {
        return;
      }

      this.calcMousePos();

      if ((this.zoom.isSlowZoom === false) || (this.zoom.isSlowZoom === true && event === undefined)) {
        this.zoom.display.css({
          'top': this.zoom.newZoom.top,
          'left': this.zoom.newZoom.left
        });
      }

      if ((this.lens.isSlowLens === false) || (this.lens.isSlowLens === true && event === undefined)) {
        this.lens.display.css({
          'top': this.lens.newLens.top,
          'left': this.lens.newLens.left
        });
      }
    };
    mouseenterHandler(event, oEventTrigger) {
      if (this.component.items[this.component.thumbs.current].isMouseEventsOn === false) {
        return;
      }

      if (oEventTrigger !== undefined) {
        event = oEventTrigger;
      }

      this.zoom.state = 'showing';

      if (event !== undefined) {
        this.currentMousePos = this.isTouchMove === true && event.originalEvent.touches.length === 1 ? {
          x: event.originalEvent.touches[0].pageX,
          y: event.originalEvent.touches[0].pageY
        } : {
          x: event.pageX,
          y: event.pageY
        };
      }

      this.calcMousePos();

      this.zoom.currentZoom = {
        top: this.zoom.newZoom.top,
        left: this.zoom.newZoom.left
      };
      this.zoom.display.css({
        'top': this.zoom.newZoom.top,
        'left': this.zoom.newZoom.left
      });

      this.lens.currentLens = {
        top: this.lens.newLens.top,
        left: this.lens.newLens.left
      };
      this.lens.display.css({
        'top': this.lens.newLens.top,
        'left': this.lens.newLens.left
      });

      if (this.zoom.zooming === false) {
        if (this.zoom.position === 'inner' || this.zoom.isAIZooming === true) {
          this.zoom.instance.fadeIn(this.component.config.speed);
        } else {
          this.lens.display.fadeIn(this.component.config.speed);
          this.zoom.instance.fadeIn(this.component.config.speed);
        }
      }

      if (this.zoom.isSlowZoom === true) {
        clearTimeout(this.zoom.slowZoomTimer);
        this.zoom.slowDown();
      }

      if (this.lens.isSlowLens === true) {
        clearTimeout(this.lens.slowLensTimer);
        this.lens.slowDown();
      }
      this.zoom.zooming = true;
    };
    mouseleaveHandler(event, oEventTrigger) {
      this.lens.display.stop().hide();
      this.zoom.instance.stop().fadeOut(this.component.config.speed);
      this.zoom.state = 'hiding';

      if (oEventTrigger !== undefined) {
        event = oEventTrigger;
      }

      if (event !== undefined) {
        this.currentMousePos = this.isTouchMove === true && event.originalEvent.touches.length === 1 ? {
          x: event.originalEvent.touches[0].pageX,
          y: event.originalEvent.touches[0].pageY
        } : {
          x: event.pageX,
          y: event.pageY
        };
      }

      if (this.zoom.isSlowZoom === true) {
        clearTimeout(this.zoom.slowZoomTimer);
      }

      if (this.lens.isSlowLens === true) {
        clearTimeout(this.lens.slowLensTimer);
      }
      this.zoom.zooming = false;
    };
    touchStart(event) {
      event.preventDefault();
    };
    touchMove(event) {
      if (this.isTouchMove === false) {
        this.isTouchMove = true;
        $(this.lens.getInstance()).trigger('mouseenter.glasscase', event);
      }
      $(this.lens.getInstance()).trigger('mousemove.glasscase', event);

      event.preventDefault();
    };
    touchEnd(event) {
      if (this.isTouchMove === true) {
        $(this.lens.getInstance()).trigger('mouseleave.glasscase', event);
        this.isTouchMove = false;
      } else {
        this.component.overlay.toggle();
      }

      event.preventDefault();
    };
    calcMousePos() {
      let areaDspOffset = $(this.instance).offset(),
        imgOffset = $(this.slides[this.component.thumbs.current]).position(),
        mouseXRelative = this.currentMousePos.x - (areaDspOffset.left + imgOffset.left + parseFloat($(this.slides[this.component.thumbs.current]).css('margin-left'))),
        mouseYRelative = this.currentMousePos.y - (areaDspOffset.top + imgOffset.top + parseFloat($(this.slides[this.component.thumbs.current]).css('margin-top'))),
        imageDisplayHeight = $(this.display[this.component.thumbs.current]).outerHeight(),
        imageDisplayWidth = $(this.display[this.component.thumbs.current]).outerWidth(),
        lensWidth = this.lens.display.outerWidth(),
        lensHeight = this.lens.display.outerHeight(),
        lensTop = mouseYRelative - Math.round(lensHeight / 2),
        lensLeft = mouseXRelative - Math.round(lensWidth / 2), // 2 -> the middle
        ratio = this.component.items[this.component.thumbs.current].width / imageDisplayWidth,
        zoomTop = -lensTop * ratio,
        zoomLeft = -lensLeft * ratio;

      if (mouseYRelative - lensHeight / 2 < 0) {
        lensTop = 0;
        zoomTop = 0;
      }
      if (mouseYRelative + lensHeight / 2 > 0 + imageDisplayHeight) {
        lensTop = imageDisplayHeight - lensHeight;
        zoomTop = -(this.component.items[this.component.thumbs.current].height - this.zoom.instance.outerHeight());
      }
      if (mouseXRelative - lensWidth / 2 < 0) {
        lensLeft = 0;
        zoomLeft = 0;
      }
      if (mouseXRelative + lensWidth / 2 > 0 + imageDisplayWidth) {
        lensLeft = imageDisplayWidth - lensWidth;
        zoomLeft = -(this.component.items[this.component.thumbs.current].width - this.zoom.instance.outerWidth());
      }

      this.zoom.newZoom = {
        top: zoomTop,
        left: zoomLeft
      };
      this.lens.newLens = {
        top: lensTop,
        left: lensLeft
      };
    };
    isMousePosInDsp() {
      let areaDspOffset = $(this.instance).offset(),
        imgOffset = $(this.slides[this.component.thumbs.current]).position(),
        mouseXRelative = this.currentMousePos.x - (areaDspOffset.left + imgOffset.left + parseFloat($(this.slides[this.component.thumbs.current]).css('margin-left'))),
        mouseYRelative = this.currentMousePos.y - (areaDspOffset.top + imgOffset.top + parseFloat($(this.slides[this.component.thumbs.current]).css('margin-top'))),
        imageDisplayWidth = $(this.display[this.component.thumbs.current]).outerWidth(),
        imageDisplayHeight = $(this.display[this.component.thumbs.current]).outerHeight();

      return (mouseXRelative >= 0 && mouseYRelative >= 0) && (mouseXRelative <= imageDisplayWidth && mouseYRelative <= imageDisplayHeight) ? true : false;
    };
    navigate(direction, context) {
      var _this = context || this;

      _this.component.thumbs.navigate(direction);
      _this.component.changeCnt();
    };
    changeCnt() {
      let _this = this,
        currentEl = _this.slidesCnt[_this.component.thumbs.old],
        nextEl = _this.slidesCnt[_this.component.thumbs.current];
      // dirRight = this.component.thumbs.old === (this.component.items.length - 1) && this.component.thumbs.current === 0, ToDo: check this variable, if they are needed
      // dirLeft = this.component.thumbs.old === 0 && this.component.thumbs.current === (this.component.items.length - 1),
      // dir = ((this.component.thumbs.old < this.component.thumbs.current && !dirLeft) || dirRight) ? 'right' : 'left';

      _this.setupZoomLens();
      dynamics.animate(currentEl, {
        opacity: 0
      }, {
        type: dynamics.easeInOut,
        duration: 100,
        complete: () => {
          dynamics.css(currentEl, {
            opacity: 0,
            visibility: 'hidden'
          });

          if (_this.component.items[_this.component.thumbs.old].type !== 'image') {
            _this.component.items[_this.component.thumbs.old].navigate('display');
          }
        }
      });

      // set the right properties for the next element to come in
      dynamics.css(nextEl, {
        opacity: 1
      });

      _this.slidesCnt.removeClass('gc-slide-container-current');
      $(nextEl).addClass('gc-slide-container-current');

      // animate the next element in
      dynamics.animate(nextEl, {
        opacity: 1
      }, {
        type: dynamics.easeInOut,
        duration: 100,
        complete: () => {
          dynamics.css(nextEl, {
            opacity: 1,
            visibility: 'visible'
          });
        }
      });
    };
    toggleNavBtn(action, eventType, event) {
      if (event !== undefined) {
        this.currentMousePos = this.isTouchMove === true && event.originalEvent.touches.length === 1 ? {
          x: event.originalEvent.touches[0].pageX,
          y: event.originalEvent.touches[0].pageY
        } : {
          x: event.pageX,
          y: event.pageY
        };
      }

      if (eventType === 'mouseleave') {
        this.mousePos = 'out';
      }

      if (eventType === 'mouseenter') {
        this.mousePos = 'in';
      }

      if (action === 'hide') {
        this.btnPrevious.hide();
        this.btnNext.hide();
        if (this.isDownloadEnabled === true) {
          this.btnDownload.hide();
        }
      } else {
        this.btnPrevious.show();
        this.btnNext.show();
        if (this.isDownloadEnabled === true) {
          this.btnDownload.show();
        }
      }
    };
    autoPlay(action) {
      if (action === 'stop') {
        clearInterval(this.autoPlayInterval);
      } else {
        this.autoPlayInterval = setInterval(this.navigate, this.pauseTime, 'next', this);
      }
    };
  }
  class GCLens {
    component;
    isSlowLens;
    speedSlowLens;
    instance = $(`<div class="gc-lens-container">
            <div class="gc-lens-display"></div>
        </div>`);
    display = this.instance.find('.gc-lens-display');
    slowLensTimer = 0;
    newLens = {
      left: 0,
      top: 0
    };
    currentLens = {
      left: 0,
      top: 0
    };

    constructor(config, component) {
      this.component = component;
      this.isSlowLens = config.isSlowLens;
      this.speedSlowLens = config.speedSlowLens;

      this.init();
    }

    init() {
      this.display.hide();
      this.newLens = { //ToDo: is init called outside ?!
        left: 0,
        top: 0
      };
      this.currentLens = { //? repeated
        left: 0,
        top: 0
      };
      this.slowLensTimer = 0; //? repeated
    };
    setup(display, slide) {
      let percZoomWidth = Math.round(display.zoom.instance.outerWidth() / slide.width * 100),
        valueLensW = Math.round($(display.display[this.component.thumbs.current]).outerWidth() * percZoomWidth / 100),
        percZoomHeight = Math.round(display.zoom.instance.outerHeight() / slide.height * 100),
        valueLensH = Math.round($(display.display[this.component.thumbs.current]).outerHeight() * percZoomHeight / 100),
        height = $(display.display[this.component.thumbs.current]).outerHeight(),
        width = $(display.display[this.component.thumbs.current]).outerWidth();

      this.instance.css({
        'width': width,
        'height': height
      });
      this.instance.css({
        'top': $(display.display[this.component.thumbs.current]).position().top,
        'left': $(display.display[this.component.thumbs.current]).position().left
      });
      this.display.css({
        'width': (valueLensW),
        'height': (valueLensH)
      });

      if (display.zoom.position === 'inner' || display.zoom.isAIZooming === true) {
        display.zoom.instance.appendTo(this.instance);
      }
    };
    getInstance() {
      return this.instance;
    };
    slowDown() {
      let diffLensPos = {
          left: 0,
          top: 0
        },
        moveLensPos = {
          left: 0,
          top: 0
        };

      diffLensPos = {
        top: this.newLens.top - this.currentLens.top,
        left: this.newLens.left - this.currentLens.left
      };
      moveLensPos = {
        top: -diffLensPos.top / (this.speedSlowLens / 100),
        left: -diffLensPos.left / (this.speedSlowLens / 100)
      };
      this.currentLens = {
        top: this.currentLens.top - moveLensPos.top,
        left: this.currentLens.left - moveLensPos.left
      };

      if (diffLensPos.top < 1 && diffLensPos.top > -1) {
        this.currentLens.top = this.newLens.top;
      }
      if (diffLensPos.left < 1 && diffLensPos.left > -1) {
        this.currentLens.left = this.newLens.left;
      }

      this.display.css({
        'top': this.currentLens.top,
        'left': this.currentLens.left
      });
      this.slowLensTimer = setTimeout(() => this.slowDown(), 25);
    };
  }
  class GCZoom {
    component;
    position;
    autoInnerZoom;
    isEnabled;
    isSlowZoom;
    speedSlowZoom;
    isDiffWH;
    width;
    height;
    alignment;
    margin;
    isZCapEnabled;

    instance = $(`<div class = "gc-zoom-area"/>`);
    container = this.instance.find('.gc-zoom-container');
    display = this.container.find('img');
    isAIZooming = false; //for internal use
    dfdState = $.Deferred();
    state = 'showing'; //showing, hiding
    zooming = false;
    newZoom = {
      left: 0,
      top: 0
    };
    currentZoom = {
      left: 0,
      top: 0
    };
    slowZoomTimer = 0;

    constructor(config, component) {
      this.component = component;
      this.position = config.zoomPosition;
      this.autoInnerZoom = config.autoInnerZoom;
      this.isEnabled = config.isZoomEnabled;
      this.isSlowZoom = config.isSlowZoom;
      this.speedSlowZoom = config.speedSlowZoom;
      this.isDiffWH = config.isZoomDiffWH;
      this.width = config.zoomWidth;
      this.height = config.zoomHeight;
      this.alignment = config.zoomAlignment;
      this.margin = config.zoomMargin;
      this.isZCapEnabled = config.isZCapEnabled;

      this.init();
    }

    init() {
      this.instance.hide();

      if (this.position === 'inner') {
        this.isDiffWH = true;
        this.width = 0;
        this.height = 0;
      }
    };
    setup() {
      this.container.detach();
      this.instance.append(this.component.items[this.component.thumbs.current].getInstance('zoom'));
      this.container = this.instance.find('.gc-zoom-container');
      this.display = this.container.find('img');

      this.calcSettings();
    };
    calcSettings() {
      if (this.position !== 'inner') {
        this.isAIZooming = false;
        this.instance.appendTo(this.component.element).removeClass('gc-zoom-inner');
      }

      if (this.position === 'inner' || this.isAIZooming === true) {
        this.instance.appendTo(this.component.display.slides[this.component.thumbs.current]).addClass('gc-zoom-inner');
      }

      let borderVal = parseFloat(this.instance.css('border-left-width')) * 2 || 0,
        paddingVal = parseFloat(this.instance.css('padding-top')) * 2 || 0,
        wZ = (this.position === 'inner') ? paddingVal : (borderVal + paddingVal),
        hZ = (this.position === 'inner') ? paddingVal : (borderVal + paddingVal),
        topZ,
        topT;

      for (var i = 0; i < 2; i++) {
        if ((this.isDiffWH && this.width > 0)) {
          wZ += this.width < this.component.items[this.component.thumbs.current].width ? this.width : this.component.items[this.component.thumbs.current].width;
        } else {
          wZ += $(this.component.display.display[this.component.thumbs.current]).outerWidth();
        }
        if ((this.isDiffWH && this.height > 0)) {
          hZ += this.height < this.component.items[this.component.thumbs.current].height ? this.height : this.component.items[this.component.thumbs.current].height;
        } else {
          hZ += $(this.component.display.display[this.component.thumbs.current]).outerHeight();
        }
        if (this.isDiffWH === false && this.isAIZooming === false) {
          wZ = hZ;
        }

        if (this.autoInnerZoom === true && this.position !== 'inner') {

          if (this.component.element.outerWidth() + wZ > $(window).width()) {
            this.isAIZooming = true;
            if (i === 0) {
              wZ = hZ = paddingVal;
            }
          } else {
            break;
          }
        } else {
          break;
        }

        if (this.position === 'inner') {
          break;
        }
      }

      this.container.css({
        'width': 0,
        'height': 0
      });
      this.instance.css({
        'width': wZ,
        'height': hZ
      });
      this.container.css({
        'width': this.instance.outerWidth(),
        'height': this.instance.outerHeight()
      });

      //setupZoomPos
      if (this.position === 'inner' || this.isAIZooming === true) {
        this.instance.appendTo(this.component.display.slides[this.component.thumbs.current]).addClass('gc-zoom-inner');
      } else {
        this.instance.appendTo(this.component.element).removeClass('gc-zoom-inner');

        if (this.position === 'left') {
          this.instance.css({
            'right': (this.component.element.outerWidth(true)),
            'margin-right': this.margin + 'px'
          });
        } else {
          this.instance.css({
            'left': (this.component.element.outerWidth(true)),
            'margin-left': this.margin + 'px'
          });
        }

        topZ = this.alignment === 'displayArea' ? 0 : $(this.component.display.slides[this.component.thumbs.current]).position().top +
          parseFloat($(this.component.display.slides[this.component.thumbs.current]).css('margin-top'));

        if (this.component.thumbs.position === 'top') {
          topT = this.component.thumbs.instance.outerHeight() + parseFloat(this.component.thumbs.margin);
          this.instance.css({
            'top': topZ + topT
          });
        } else {
          this.instance.css({
            'top': topZ
          });
        }
      }
    };
    changeCnt() {
      this.setup();
      if (this.isZCapEnabled === true) {
        this.caption.setup();
      }

      this.dfdState.resolve();
    };
    getInstance() {
      return this.instance;
    };
    slowDown() {
      let diffZoomPos = {
          left: 0,
          top: 0
        },
        moveZoomPos = {
          left: 0,
          top: 0
        };

      diffZoomPos = {
        top: this.newZoom.top - this.currentZoom.top,
        left: this.newZoom.left - this.currentZoom.left
      };
      moveZoomPos = {
        top: -diffZoomPos.top / (this.speedSlowZoom / 100),
        left: -diffZoomPos.left / (this.speedSlowZoom / 100)
      };
      this.currentZoom = {
        top: this.currentZoom.top - moveZoomPos.top,
        left: this.currentZoom.left - moveZoomPos.left
      };

      if (diffZoomPos.top < 1 && diffZoomPos.top > -1) {
        this.currentZoom.top = this.newZoom.top;
      }

      if (diffZoomPos.left < 1 && diffZoomPos.left > -1) {
        this.currentZoom.left = this.newZoom.left;
      }
      this.display.css({
        'top': this.currentZoom.top,
        'left': this.currentZoom.left
      });
      this.slowZoomTimer = setTimeout(() => this.slowDown(), 25);
    };
  }
  class GCThumbs {
    component;
    position;
    nrThumbsPerRow;
    isThumbsOneRow;
    isOneThumbShown;
    firstThumbSelected;
    colorActiveThumb;
    margin;
    isHoverShowThumbs;
    slideType;
    ul;
    li;
    instance;
    abtnPrevious;
    btnPrevious;
    abtnNext;
    btnNext;
    current = 0; //default value
    old = 0;
    currentSlide;
    currentSlideElement;
    tpStart = {
      x: 0,
      y: 0
    };
    tpEnd = {
      x: 0,
      y: 0
    };

    constructor(config, component) {
      this.component = component;
      this.position = config.thumbsPosition;
      this.nrThumbsPerRow = config.nrThumbsPerRow;
      this.isThumbsOneRow = config.isThumbsOneRow;
      this.isOneThumbShown = config.isOneThumbShown;
      this.firstThumbSelected = config.firstThumbSelected ? config.firstThumbSelected : 0;
      this.colorActiveThumb = config.colorActiveThumb;
      this.margin = config.thumbsMargin;
      this.isHoverShowThumbs = config.isHoverShowThumbs;
      this.slideType = config.slideType;

      this.init(component);
    }

    init() {
      let sVT = (this.position === 'right' || this.position === 'left') ? '-vt' : '',
        ctntThumbsPrevNext = `<div class="gc-thumbs-area-prev">
                <div class = "gc-icon gc-icon-prev${sVT}"> </div>
            </div>
            <div class="gc-thumbs-area-next">
                <div class="gc-icon gc-icon-next${sVT}"> </div>
            </div>`;

      this.ul = this.component.element.find('ul');
      this.ul.removeClass('gc-start');
      this.ul.wrap('<div class="gc-thumbs-area"></div>');
      this.li = this.ul.find('li');
      this.instance = this.ul.parent();
      this.instance.append(ctntThumbsPrevNext);
      this.abtnPrevious = this.instance.find('.gc-thumbs-area-prev');
      this.btnPrevious = this.abtnPrevious.find('.gc-icon-prev' + sVT);
      this.abtnNext = this.instance.find('.gc-thumbs-area-next');
      this.btnNext = this.abtnNext.find('.gc-icon-next' + sVT);

      this.position === 'left' || this.position === 'right' ? this.instance.addClass('gc-vt') : this.instance.addClass('gc-hz');

      if (parseFloat(this.firstThumbSelected) > -1 &&
        parseFloat(this.firstThumbSelected) <= (this.li.length - 1)) {
        this.current = this.firstThumbSelected;
        this.old = this.firstThumbSelected;
      }

      this.currentSlide = Math.floor(this.current / this.nrThumbsPerRow);
      this.currentSlideElement = this.current;
    };
    initEvents() {
      var _this = this;

      _this.li.on('click.glasscase', function () {
        _this.changeThumbs($(this).index());
      });
      if (_this.isHoverShowThumbs === true) {
        _this.li.on('mouseenter', function () {
          _this.changeThumbs($(this).index());
        });
      }
      _this.abtnPrevious.on('click.glasscase', function () {
        _this.slide('false', 'previous');
      });
      _this.abtnNext.on('click.glasscase', function () {
        _this.slide('false', 'next');
      });
      _this.ul.on('touchstart.glasscase', _this, event => event.data.touchStart(event))
        .on('touchmove.glasscase', _this, event => event.data.touchMove(event))
        .on('touchend.glasscase', _this, event => event.data.touchEnd(event));
    };
    setup() {
      let display = this.component.display.getInstance();

      if (this.isOneThumbShown === false && this.li.length === 1) {
        this.instance.outerHeight(0);
        this.instance.addClass('gc-hide');

        return;
      } else {
        this.isOneThumbShown = true;
      }

      if (this.position === 'right') {
        this.setupLR();
        display.css({
          'top': '0',
          'left': '0'
        });
        this.instance.css({
          'top': '0',
          'left': display.outerWidth() + this.margin
        });
      }

      if (this.position === 'left') {
        this.setupLR();
        this.instance.css({
          'top': '0',
          'left': '0'
        });
        display.css({
          'top': '0',
          'left': this.instance.outerWidth() + this.margin
        });
      }

      if (this.position === 'bottom') {
        this.setupTB();
        display.css({
          'top': '0',
          'left': '0'
        });
        this.instance.css({
          'top': display.outerHeight() + this.margin,
          'left': '0'
        });
      }

      if (this.position === 'top') {
        this.setupTB();
        this.instance.css({
          'top': '0',
          'left': '0'
        });
        display.css({
          'top': this.instance.outerHeight() + this.margin,
          'left': '0'
        });
      }

      if (parseFloat(this.firstThumbSelected) > 0 && this.currentSlide > 0) {
        this.currentSlide -= 1;
        this.slide('false', '');
      }
    };
    setupLR() {
      let display = this.component.display.getInstance();

      this.instance.css('height', display.outerHeight());

      let mgL = parseFloat(this.li.css('margin-bottom')),
        ratio = this.component.display.width / this.component.display.height,
        hL = (this.instance.outerHeight() / this.nrThumbsPerRow - (this.nrThumbsPerRow - 1) * mgL / this.nrThumbsPerRow),
        wL = hL * ratio,
        hLPerc = (hL * 100) / (((hL + mgL) * this.li.length) - mgL),
        brwLiHeight,
        brwDiff;

      this.li.css({
        'width': wL,
        'height': hLPerc + '%'
      });
      this.li.last().css('margin-bottom', 0);

      this.ul.css({
        'width': Math.ceil(wL),
        'height': Math.ceil((((hL + mgL) * this.li.length) - mgL))
      });
      this.instance.css('width', Math.ceil(wL));
      this.abtnPrevious.removeClass('gc-hide');
      this.btnPrevious.css('margin-left', (-this.btnPrevious.outerWidth() / 2));
      this.abtnNext.removeClass('gc-hide');
      this.btnNext.css('margin-left', (-this.btnNext.outerWidth() / 2));

      this.setupSlider();

      if (this.component.iOS) {
        brwLiHeight = this.li.outerHeight();
        brwDiff = this.instance.outerHeight() - (brwLiHeight * this.nrThumbsPerRow + (this.nrThumbsPerRow - 1) * mgL);
        this.ul.find(':nth-child(' + this.nrThumbsPerRow + 'n)').css('height', brwLiHeight + brwDiff);
      }
    };
    setupTB() {
      let display = this.component.display.getInstance();

      this.instance.css('width', display.outerWidth());

      let mgL = parseFloat(this.li.css('margin-right')),
        ratio = this.component.display.width / this.component.display.height,
        wL = (this.instance.outerWidth() / this.nrThumbsPerRow - (this.nrThumbsPerRow - 1) * mgL / this.nrThumbsPerRow),
        hL = wL / ratio,
        wLPerc,
        totalRows,
        lHeight,
        brwLiWidth,
        brwDiff;

      if (this.isThumbsOneRow === true) {
        wLPerc = (wL * 100) / (((wL + mgL) * this.li.length) - mgL);
      } else {
        wLPerc = (wL * 100) / this.instance.outerWidth();
      }
      this.li.css({
        'width': wLPerc + '%',
        'height': hL
      });

      if (this.isThumbsOneRow === true) {
        this.li.last().css('margin-right', 0);
      } else {
        this.ul.find(':nth-child(' + this.nrThumbsPerRow + 'n)').css('margin-right', 0);
        this.ul.find(':nth-child(n +' + (parseFloat(this.nrThumbsPerRow) + 1) + ')').css('margin-top', mgL + 'px');
      }

      if (this.isThumbsOneRow === true) {
        this.ul.css({
          'width': Math.ceil((wL * this.li.length + (this.li.length - 1) * mgL)),
          'height': Math.ceil(hL)
        });
        this.instance.css('height', Math.ceil(hL));
      } else {
        totalRows = Math.ceil((this.li.length) / this.nrThumbsPerRow);
        lHeight = Math.ceil(hL * totalRows + mgL * (totalRows - 1));

        this.ul.css({
          'width': this.instance.outerWidth(),
          'height': lHeight
        });
        this.instance.css('height', lHeight);
      }

      if (this.isThumbsOneRow === true) {
        this.abtnPrevious.removeClass('gc-hide');
        this.btnPrevious.css('margin-top', (-this.btnPrevious.outerHeight() / 2));
        this.abtnNext.removeClass('gc-hide');
        this.btnNext.css('margin-top', (-this.btnNext.outerHeight() / 2));

        this.setupSlider();
      } else {
        this.abtnPrevious.addClass('gc-hide');
        this.abtnNext.addClass('gc-hide');
      }

      if (this.component.iOS) {
        brwLiWidth = this.li.outerWidth();
        brwDiff = this.instance.outerWidth() - (brwLiWidth * this.nrThumbsPerRow + (this.nrThumbsPerRow - 1) * mgL);
        this.ul.find(':nth-child(' + this.nrThumbsPerRow + 'n)').css('width', brwLiWidth + brwDiff);
      }
    };
    setupSlider() {
      if (this.li.length <= this.nrThumbsPerRow) {
        this.abtnPrevious.addClass('gc-hide');
        this.abtnNext.addClass('gc-hide');
        return;
      }
      this.abtnPrevious.removeClass('gc-disabled');
      this.abtnNext.removeClass('gc-disabled');

      if (this.slideType !== 'slideElement') {

        if (this.currentSlide === 0) {
          this.abtnPrevious.addClass('gc-disabled');
        }

        if (this.currentSlide === Math.floor((this.li.length - 1) / this.nrThumbsPerRow)) {
          this.abtnNext.addClass('gc-disabled');
        }
      }

    };
    changeCnt() {
      if (this.colorActiveThumb !== -1) {
        this.ul.find('.gc-active').css('border-color', '');
      }

      this.li.removeClass('gc-active').eq(this.current).addClass('gc-active');

      if (this.colorActiveThumb !== -1) {
        this.ul.find('.gc-active').css('border-color', this.colorActiveThumb);
      }
      this.slide('true', '');
    };
    getInstance() {
      return this.instance;
    };
    touchStart(event) {
      if (event.originalEvent.touches.length === 1) {
        this.tpStart.x = event.originalEvent.touches[0].pageX;
        this.tpEnd.x = this.tpStart.x;
        this.tpStart.y = event.originalEvent.touches[0].pageY;
        this.tpEnd.y = this.tpStart.y;
      }
    };
    touchMove(event) {
      if (event.originalEvent.touches.length === 1) {
        this.tpEnd.x = event.originalEvent.touches[0].pageX;
        this.tpEnd.y = event.originalEvent.touches[0].pageY;
      }
    };
    touchEnd(event) {
      if (this.tpEnd.x !== this.tpStart.x || this.tpEnd.y !== this.tpStart.y) {
        event.preventDefault();

        if (this.position === 'right' || this.position === 'left') {
          if (this.tpStart.y - this.tpEnd.y > 10) {
            this.slide('false', 'next');
          }

          if (this.tpStart.y - this.tpEnd.y < -10) {
            this.slide('false', 'previous');
          }
        } else {
          if (this.tpStart.x - this.tpEnd.x > 10) {
            this.slide('false', 'next');
          }

          if (this.tpStart.x - this.tpEnd.x < -10) {
            this.slide('false', 'previous');
          }
        }
      }
    };
    slide(isImageChange, slideChange) { //isImageChange: true || false; slideChange:   previous || next
      let nextSlide = 0,
        nextSlideElement = 0,
        vMargin,
        config,
        configAnimProp;

      if (this.isThumbsOneRow === false && (this.position === 'bottom' || this.position === 'top')) {
        return;
      }
      config = {
        type: dynamics.easeInOut,
        duration: 800,
        change: () => this.setupSlider()
      };

      if (this.slideType === 'slideElement') {

        if (isImageChange === 'true') {
          nextSlideElement = this.current;
        } else {

          if (slideChange === 'previous') {
            nextSlideElement = this.currentSlideElement > 0 ? this.currentSlideElement - 1 : this.li.length - 1 /*was 0*/ ;
          } else {
            nextSlideElement = (this.currentSlideElement + 1) > (this.li.length - 1) ? 0 : this.currentSlideElement + 1;
          }
        }

        this.currentSlideElement = nextSlideElement;
        //Making the slide
        if (this.position === 'bottom' || this.position === 'top') {
          vMargin = this.li.outerWidth() + parseFloat(this.li.css('margin-right'));
          configAnimProp = {
            left: -(nextSlideElement * vMargin)
          };
        } else {
          vMargin = this.li.outerHeight() + parseFloat(this.li.css('margin-bottom'));
          configAnimProp = {
            top: -(nextSlideElement * vMargin)
          };
        }
      } else {

        if (isImageChange === 'true') {
          nextSlide = Math.floor(this.current / this.nrThumbsPerRow);
        } else {

          if (slideChange === 'previous') {
            nextSlide = this.currentSlide > 0 ? this.currentSlide - 1 : 0;
          } else {
            nextSlide = this.currentSlide + 1 > Math.floor((this.li.length - 1) / this.nrThumbsPerRow) ? Math.floor((this.li.length - 1) / this.nrThumbsPerRow) : this.currentSlide + 1;
          }
        }

        if (nextSlide === this.currentSlide) {
          return;
        }

        this.currentSlide = nextSlide;
        //Making the slide
        if (this.position === 'bottom' || this.position === 'top') {
          vMargin = this.instance.outerWidth() + parseFloat(this.li.css('margin-right'));
          configAnimProp = {
            translateX: -(nextSlide * vMargin)
          };
        } else {
          vMargin = this.instance.outerHeight() + parseFloat(this.li.css('margin-bottom'));
          configAnimProp = {
            translateY: -(nextSlide * vMargin)
          };
        }
      }
      dynamics.animate(this.ul[0], configAnimProp, config);
    };
    changeThumbs(index) {
      if (this.current !== index) {
        this.old = this.current;
        this.current = index;
        this.component.changeCnt();
      }
    };
    navigate(direction) {
      this.old = this.current;

      if (direction === 'next') {
        this.current = this.current === (this.li.length - 1) ? 0 : this.current + 1;
      } else {
        this.current = this.current === 0 ? (this.li.length - 1) : this.current - 1;
      }
    };
  }
  class GCOverlay {
    component;
    isEnabled;
    isFullImage;
    isOpened = false;
    displayState = ''; //enlarged; compressed
    isPagEnabled = false;

    instance = $(`
    <div class="gc-overlay-area gc-theme-light">
      <div class="gc-overlay-top">
        <div class="gc-overlay-pagination md-60">
          <span class="gc-pagination-current"></span> <span class="gc-pagination-separator"></span> <span class="gc-pagination-total"></span>
        </div>
        <div class="gc-overlay-close md-60">
          <span class="material-icons md-48">close</span>
        </div>
      </div>
      <div class="gc-overlay-center">
        <div class="gc-overlay-prev">
          <span class="material-icons md-60">chevron_left</span>
        </div>
        <div class="gc-overlay-container-items">
          <ul></ul>
        </div>
        <div class="gc-overlay-next">
          <span class="material-icons md-60">chevron_right</span>
        </div>
      </div>
      <div class="gc-overlay-bottom">
        <div class="gc-overlay-container-slider">
          <div class="gc-overlay-slider">
            <div class="gc-overlay-slider-thumb"></div>
          </div>
        </div>
      </div>
    </div>
    `);

    items = this.instance.find('.gc-overlay-container-items ul');
    itemLi;
    btnPrevious = this.instance.find('.gc-overlay-prev');
    btnNext = this.instance.find('.gc-overlay-next');
    btnClose = this.instance.find('.gc-overlay-close');
    slider = this.instance.find('.gc-overlay-slider');
    sliderThumb = this.slider.find('.gc-overlay-slider-thumb');
    isSliderThumbDown = false;
    sliderStartX = 0;
    pagination = this.instance.find('.gc-overlay-pagination');
    paginationCurrent = this.pagination.find('.gc-pagination-current');
    paginationSeparator = this.pagination.find('.gc-pagination-separator');
    paginationTotal = this.pagination.find('.gc-pagination-total');

    //old
    gcontainer = this.instance.find('.gc-overlay-gcontainer');
    slidesCnt = this.gcontainer.find('.gc-overlay-container');
    slides;
    display;
    // btnPrevious = this.instance.find('.gc-icon-prev');
    // btnNext = this.instance.find('.gc-icon-next');
    // btnClose = this.instance.find('.gc-icon-close');
    btnEnlarge = this.instance.find('.gc-icon-enlarge');
    btnCompress = this.instance.find('.gc-icon-compress');
    tpStart = {
      x: 0,
      y: 0
    };
    tpEnd = {
      x: 0,
      y: 0
    };

    constructor(options, component) {
      this.component = component;
      this.isEnabled = options.isOverlayEnabled;
      this.isFullImage = options.isOverlayFullImage;
      this.isPagEnabled = options.isPagEnabled;

      this.init();
    }

    init() {
      // $.each(this.component.items, (index, item) => {
      //   this.slidesCnt.append(this.component.items[index].getInstance('overlay', this.slidesCnt.width(), this.slidesCnt.height()));
      // });

      // this.slides = this.slidesCnt.find('.gc-overlay-container-display');
      // this.display = this.slides.find('.gc-overlay-display');

      // this.instance.hide();
      // this.btnEnlarge.hide();
      // this.btnCompress.hide();

      //**************New

      this.component.items.forEach(item => {
        this.items.append(item.getInstance('overlay'));
      });
      this.itemLi = this.items.find('li');

      this.sliderThumb.css('width', `calc(${100/this.itemLi.length}%)`);

      this.items.css('width', `calc(${this.itemLi.length*100}%`);
      this.itemLi.css('width', `calc(${100/this.itemLi.length}%)`);
      this.initPagination();

    };
    initEvents() {
      var _this = this;

      _this.btnClose.on('click.glasscase', () => _this.toggle());

      _this.sliderThumb.on('mousedown.gcoslider', event => {
        _this.isSliderThumbDown = true;
        _this.sliderStartX = event.offsetX + _this.slider.offset().left;
        _this.sliderThumbRest = _this.sliderThumb.width() - event.offsetX;

        $(document).on('mousemove.gcoslider', event => { //ToDo: right end issues
          if (_this.isSliderThumbDown) {
            let x = 0;

            if (event.pageX - _this.sliderStartX < 0) {
              x = 0;
            } else if (event.pageX - _this.sliderStartX > _this.slider.width() - _this.sliderThumb.width() - _this.sliderThumbRest) {
              x = (_this.itemLi.length - 1) * 100;
            } else {
              x = ((event.pageX - _this.sliderStartX) * 1000) / $(window).width();
            }

            let currentItemIndex = this.component.thumbs.current;
            let percPos = _this.sliderThumb.position().left * 100 / _this.slider.width();
            let nextItemIndex = Math.round((percPos * _this.itemLi.length) / 100);

            let currentItemPos = {
              start: 0,
              end: 0
            };
            let navigationType;
            // if currentItemIndex == nextItemIndex => navigation -> else navigation <-
            if (nextItemIndex >= currentItemIndex) {
              navigationType = 'next';
            } else {
              navigationType = 'previous';
              currentItemIndex--;
            };
            currentItemPos = {
              start: _this.sliderThumb.width() * currentItemIndex,
              end: _this.sliderThumb.width() * (currentItemIndex + 1)
            };

            let segmentI = _this.sliderThumb.position().left - currentItemPos.start;
            let segmentII = currentItemPos.end - _this.sliderThumb.position().left;
            if ((segmentI > segmentII && navigationType === 'next') || (segmentII > segmentI && navigationType === 'previous')) {
              _this.navigate(navigationType);
            }

            gsap.to($(_this.sliderThumb), {
              x: x + '%',
              duration: 0,
              onComplete: () => {}
            });
          }
        });
      });
      $(document).on('mouseup.gcoslider', () => {
        _this.isSliderThumbDown = false;
        $(document).off("mousemove.gcoslider");
      });

      _this.slider.on('click.gcoslider', event => {
        let percPos = event.offsetX * 100 / _this.slider.width();
        let nextItemPos = Math.ceil((percPos * _this.itemLi.length) / 100) - 1;
        _this.changeSliderPos(nextItemPos);

        //slider navigate
        this.component.thumbs.changeThumbs(nextItemPos);
      });

      // _this.slidesCnt.on('click.glasscase', () => _this.toggle());

      if (!_this.isFullImage) {
        _this.component.items.forEach(item => {
          if (item.type === 'image') {
            $.when(item.dfdstate).done(() => {
              $(item.getInstance('overlay')).on('click.glasscase', () => _this.toggleEC('toggle'));
              $(item.getInstanceDisplay('overlay')).addClass('gc-overlay-image-fit');

              // $(slide.getInstance('overlay')).on('dblclick.glasscase', () => _this.toggleEC('toggle'));
              // $(slide.getInstanceDisplay('overlay')).on('click.glasscase', e => e.stopPropagation());
            });
          }
        });

        _this.btnEnlarge.on('click.glasscase', () => _this.toggleEC('nat'));
        _this.btnCompress.on('click.glasscase', () => _this.toggleEC('fit'));
      } else {
        _this.component.items.forEach(item => {
          if (item.type === 'image') {
            item.showNF('nat');
          }
        });
      }

      _this.component.items.forEach(item => {
        if (item.type === 'image') {
          $.when(item.dfdstate).done(() => {
            $(item.getInstance('overlay')).on('mousemove.glasscase', function (e) {
              let relativeMouseX = e.clientX - $(item.getInstance('overlay')).offset().left,
                relativeMouseY = e.clientY - $(item.getInstance('overlay')).offset().top,
                liWidth = $(item.getInstance('overlay')).width(),
                liHeight = $(item.getInstance('overlay')).height(),
                xPerc = relativeMouseX / liWidth,
                yPerc = relativeMouseY / liHeight,
                xDelta = item.width - liWidth,
                yDelta = item.height - liHeight;

              // console.log('yDelta: ' + yDelta + ', yPerc: ' + yPerc);
              // console.log('scroll top: ' + yDelta * yPerc);
              // console.log('xDelta: ' + xDelta + ', xPerc: ' + xPerc);
              // console.log('scroll left: ' + xDelta * xPerc);
              $(this).scrollTop(yDelta * yPerc).scrollLeft(xDelta * xPerc);

            });
          });
        }
      });

      _this.btnPrevious.on('click.glasscase', () => _this.navigate('previous'));
      _this.btnNext.on('click.glasscase', () => _this.navigate('next'));

      // if (_this.isFullImage === false) {
      //   _this.slidesCnt
      //     .on('touchstart.glasscase', this, event => event.data.touchStart(event))
      //     .on('touchmove.glasscase', this, event => event.data.touchMove(event))
      //     .on('touchend.glasscase', this, event => event.data.touchEnd(event));
      // }



      //**************New
    };
    setup() { //ToDo: nead to make a setup on each opening of the overlay
      let _this = this;

      gsap.fromTo($(_this.items[0]), {
        opacity: 0
      }, {
        duration: 0.8,
        opacity: 1,
        x: (-_this.itemLi.width() * _this.component.thumbs.current),
        onComplete: () => {
          //ToDo
        }
      });
    };
    initPagination() {
      if (this.isPagEnabled === false) {
        return;
      }

      this.paginationCurrent.text(this.component.thumbs.current + 1);
      this.paginationSeparator.text('/'); //ToDo: add in options, add default
      this.paginationTotal.text(this.itemLi.length);
    }
    changeCnt(action) {
      if (!this.isOpened) { //overlay on
        return;
      }
      console.log('changeCnt');
      let _this = this;

      if (_this.component.thumbs.current === 0) {
        _this.btnPrevious.addClass('gc-hide');
      } else {
        _this.btnPrevious.removeClass('gc-hide');
      }
      if (_this.component.thumbs.current === _this.itemLi.length - 1) {
        _this.btnNext.addClass('gc-hide');
      } else {
        _this.btnNext.removeClass('gc-hide');
      }
      _this.changeSliderPos(_this.component.thumbs.current);
      _this.paginationCurrent.text(_this.component.thumbs.current + 1);

      let config = {
        duration: 800,
        complete: function () {
          if (_this.component.items[_this.component.thumbs.old].isEnlarged) {
            _this.toggleEC('fit', _this.component.items[_this.component.thumbs.old]);
          }
        }
      };

      let configAnimProp = {
        translateX: (-_this.itemLi.width() * _this.component.thumbs.current)
      };
      dynamics.animate(_this.items[0], configAnimProp, config);

    };
    changeSliderPos(index) {
      gsap.to($(this.sliderThumb), {
        x: (index * 100) + '%',
        duration: 0,
        onComplete: () => {}
      });
    }
    getInstance() {
      return this.instance;
    };
    touchStart(event) {
      if (event.originalEvent.touches.length === 1) {
        this.tpStart.x = event.originalEvent.touches[0].pageX;
        this.tpEnd.x = this.tpStart.x;
        this.tpStart.y = event.originalEvent.touches[0].pageY;
        this.tpEnd.y = this.tpStart.y;
      }
    };
    touchMove(event) {
      if (event.originalEvent.touches.length === 1) {
        this.tpEnd.x = event.originalEvent.touches[0].pageX;
        this.tpEnd.y = event.originalEvent.touches[0].pageY;
      }
    };
    touchEnd(event) {
      if (this.tpEnd.x !== this.tpStart.x || this.tpEnd.y !== this.tpStart.y) {
        event.preventDefault();
        if (this.tpStart.x - this.tpEnd.x > 10) {
          this.navigate('next');
        }
        if (this.tpStart.x - this.tpEnd.x < -10) {
          this.navigate('previous');
        }
      }
    };
    toggle(action) {
      if ($('body').hasClass('gc-noscroll')) { //overlay on
        this.close();
      } else {
        if (action === 'esc') {
          return;
        }
        $('body').addClass('gc-noscroll');
        $('body').append(this.instance);

        this.instance.fadeIn(500, () => {
          this.isOpened = true;

          this.changeSliderPos(this.component.thumbs.current);
          this.changeCnt('opening');
        });
      }

      //**************New
    };
    close() {
      this.instance.fadeOut(500, () => {
        this.isOpened = false;
        $('body').removeClass('gc-noscroll');
        this.instance.detach();
      });
    };
    toggleEC(displayType, item) {
      let toggleItem = item || this.component.items[this.component.thumbs.current];

      if (toggleItem.type !== 'image' ||
        toggleItem.isFitScr(this.instance.outerWidth(), this.instance.outerHeight())) {
        return;
      }

      if (displayType === 'toggle') {
        displayType = toggleItem.getInstance('overlay').hasClass('gc-overlay-enlarge') ? 'fit' : 'nat';
      }

      toggleItem.showNF(displayType);

      if (displayType === 'fit') {
        this.displayState = 'compressed';
        this.btnCompress.hide();
        this.btnEnlarge.show();

        this.slidesCnt
          .on('touchstart.glasscase', this, event => event.data.touchStart(event))
          .on('touchmove.glasscase', this, event => event.data.touchMove(event))
          .on('touchend.glasscase', this, event => event.data.touchEnd(event));
      }

      if (displayType === 'nat') {
        this.displayState = 'enlarged';
        this.btnCompress.show();
        this.btnEnlarge.hide();

        this.slidesCnt
          .off('touchstart.glasscase')
          .off('touchmove.glasscase')
          .off('touchend.glasscase');
      }

      toggleItem.showNF(displayType, this.instance.outerWidth(), this.instance.outerHeight());
    };
    navigate(direction) {
      this.component.thumbs.navigate(direction);
      this.component.changeCnt();
      //pagination change

      // if (this.component.items[this.component.thumbs.current].isFitScr(this.instance.outerWidth(), this.instance.outerHeight()) && this.displayState === 'enlarged') {
      //   this.slidesCnt
      //     .on('touchstart.glasscase', this, event => event.data.touchStart(event))
      //     .on('touchmove.glasscase', this, event => event.data.touchMove(event))
      //     .on('touchend.glasscase', this, event => event.data.touchEnd(event));
      // }

      // if (!this.component.items[this.component.thumbs.current].isFitScr(this.instance.outerWidth(), this.instance.outerHeight()) && this.displayState === 'enlarged') {
      //   this.slidesCnt
      //     .off('touchstart.glasscase')
      //     .off('touchmove.glasscase')
      //     .off('touchend.glasscase');
      // }
    };
  }
  class GCCaption {
    zoom;
    zType;
    zPosition;
    zAlign;
    instance = $('<div class="gc-caption-container"><div></div></div>');
    display = this.instance.find('div');

    constructor(options, zoom) {
      this.zoom = zoom;
      this.zType = options.capZType;
      this.zPosition = options.capZPos;
      this.zAlign = options.capZAlign;

      this.init();
    }
    init() {
      let cssClass = 'gc-caption-' + this.zType + this.zPosition;

      if (this.zoom.position === 'inner') {
        this.zType = 'in';
      }

      if ($.inArray(cssClass, ['gc-caption-outtop', 'gc-caption-outbottom', 'gc-caption-intop', 'gc-caption-inbottom']) === -1) {
        cssClass = 'gc-caption-' + this.zoom.component.defaults.capZType + this.zoom.component.defaults.capZPos;
      }

      $.inArray(this.zAlign, ['left', 'right', 'center']) === -1 ?
        cssClass += ' gc-alignment-' + this.zoom.component.defaults.capZAlign :
        cssClass += ' gc-alignment-' + this.zAlign;

      this.instance.addClass(cssClass).appendTo(this.zoom.instance);
    };
    setup() {
      let capTxt = this.zoom.component.items[this.zoom.component.thumbs.current].caption;
      capTxt === '' ? this.instance.hide() : (this.instance.show(), this.display.empty().append(capTxt));

      if (this.zoom.isAIZooming === true) {
        if (this.zType === 'out') {
          this.instance.removeClass('gc-caption-outtop gc-caption-outbottom')
            .addClass(this.zPosition === 'top' ? 'gc-caption-intop' : 'gc-caption-inbottom');
        }
      } else {
        if (this.zType === 'out' && (this.instance.hasClass('gc-caption-intop') || this.instance.hasClass('gc-caption-inbottom'))) {
          this.instance.removeClass('gc-caption-intop gc-caption-inbottom')
            .addClass(this.zPosition === 'top' ? 'gc-caption-outtop' : 'gc-caption-outbottom');
        }
      }
    };
    getInstance() {
      return this.instance;
    };
  }
  class GlassCase {
    defaults = {
      //DISPLAY AREA
      widthDisplay: 400, // Default width of the display image
      heightDisplay: 534, // Default height of the display image
      isAutoScaleDisplay: true,
      isAutoScaleHeight: true,
      isDownloadEnabled: false,
      downloadPosition: 3,
      isShowAlwaysIcons: false,
      speedHideIcons: 3000,
      mouseEnterDisplayCB: function () {},
      mouseLeaveDisplayCB: function () {},
      isAutoPlayDisplay: false,
      pauseTimeDisplay: 3000,
      isPauseOnHoverDisplay: true,
      //THUMBS AREA        
      thumbsPosition: 'bottom', // Default position of thumbs. Position is relative to the image display. Can take the values: top; bottom      
      nrThumbsPerRow: 5, // Number of images per row        
      isThumbsOneRow: true, // Show one row or all images: true -> will be shown only one row; false -> will be shown all images
      isOneThumbShown: false,
      firstThumbSelected: 0, // Current element's index
      colorActiveThumb: '-1',
      thumbsMargin: 4, // in px
      isHoverShowThumbs: false,
      slideType: 'slideRow', //slideRow; slideElement
      //ZOOM AREA
      zoomPosition: 'right', // Default position for the zoom. It can take values: right; left; inner
      autoInnerZoom: true, // true; false
      isZoomEnabled: true,
      isSlowZoom: false,
      speedSlowZoom: 1200,
      isZoomDiffWH: false,
      zoomWidth: 0,
      zoomHeight: 0,
      zoomAlignment: 'displayImage', //displayImage, displayArea
      zoomMargin: 4, // in px    
      //LENS AREA
      isSlowLens: false,
      speedSlowLens: 600,
      //OVERLAY AREA
      isOverlayEnabled: true,
      isOverlayFullImage: false,
      //GENERAL
      speed: 400, // Default speed
      isKeypressEnabled: true,
      colorIcons: '-1', // The color of the icons 
      colorLoading: '-1',
      textImageNotLoaded: 'NO IMAGE',
      //CAPTION
      isZCapEnabled: true,
      capZType: 'in', // in, out
      capZPos: 'bottom', // top, bottom
      capZAlign: 'center', // left, center, right
      //VIDEO && IFRAME 
      iframeWidth: 640,
      iframeHeight: 390,
      txtImgThumbIframe: 'IFRAME',
      videoWidth: 640,
      videoHeight: 390,
      txtImgThumbVideo: 'VIDEO'
    };

    element;
    config;
    options;
    items = [];
    windowWidth = $(window).width();

    display;
    thumbs;
    overlay;
    iOS = $.inArray(window.navigator.platform, ['iPad', 'iPhone', 'iPod']) > -1 ? true : false; //ToDo .platform ?!?!?!
    isTouchMove = false;
    mouseTimer = 0;
    resizeTimer = 0;
    current = 0;
    isFullScreenOn = false;

    constructor(element, options) {
      this.element = element.wrap('<div class="glass-case"></div>').parent();
      this.config = $.extend(true, {}, this.defaults, options);
      this.options = options;

      this.processInput();
      this.init();

      this.setup();
      this.changeCnt();
      this.initEvents();
    }

    processInput() {
      this.element.find('li').each((index, item) => this.items.push(this.createItem(item, this.config)));
      this.element.find('li').empty();
      $.each(this.element.find('li'), (index, li) => $(li).append(this.items[index].getInstance('thumb')));
    }
    createItem(item, config) {
      let object;

      switch ($(item).find(':first').data('gc-type')) {
        case 'iframe':
          object = new GCIFrame($(item).find(':first'), config);
          break;
        case 'video':
        case 'flash':
          object = new GCVideo($(item).find(':first'), config);
          break;
        case 'image':
        default:
          object = new GCImage($(item).find(':first'), config);
          break;
      }

      return object;
    }
    init() {
      this.display = new GCDisplay(this.config, this);
      this.thumbs = new GCThumbs(this.config, this);
      this.overlay = new GCOverlay(this.config, this);

      //To test
      // $('body').addClass('gc-noscroll');
      // $('body').append(this.overlay.instanceTest);

      if (this.config.colorIcons !== -1) {
        this.display.getInstance().find('.gc-icon').css('color', this.config.colorIcons);
        this.thumbs.getInstance().find('.gc-icon').css('color', this.config.colorIcons);
        this.overlay.getInstance().find('.gc-icon').css('color', this.config.colorIcons);
      }
    }
    initEvents() {
      let _this = this;

      _this.thumbs.initEvents();
      _this.display.initEvents();
      _this.overlay.initEvents();

      $(document)
        .on('fullscreenchange.glasscase', _this, event => event.data.fullScreenHandler(event))
        .on('webkitfullscreenchange.glasscase', _this, event => event.data.fullScreenHandler(event))
        .on('mozfullscreenchange.glasscase', _this, event => event.data.fullScreenHandler(event));

      $(document).on('keydown', (event) => {
        let handled = false;

        if (event.key !== undefined) {
          if (_this.config.isKeypressEnabled === true) {
            if (event.key === 'ArrowLeft') { //<-
              _this.display.navigate('previous');
              _this.thumbs.changeCnt();
            }

            if (event.key === 'ArrowRight') { //->
              _this.display.navigate('next');
              _this.thumbs.changeCnt();
            }
          }

          if (event.key === 'Escape') { //esc
            _this.overlay.close();
          }
          handled = true;
        } else if (event.keyCode !== undefined) {
          if (_this.config.isKeypressEnabled === true) {
            if (event.keyCode === 37) { //<-
              _this.display.navigate('previous');
              _this.thumbs.changeCnt();
            }

            if (event.keyCode === 39) { //->
              _this.display.navigate('next');
              _this.thumbs.changeCnt();
            }
          }

          if (event.keyCode === 27) { //esc
            _this.overlay.close();
          }
          handled = true;
        }

        if (handled) {
          // Suppress "double action" if event handled
          event.preventDefault();
        }
      });

      $(window).on('resize', () => {
        clearTimeout(_this.resizeTimer);
        _this.resizeTimer = setTimeout(() => _this.resize(), 100);
      });
    }
    setup() {
      this.config = $.extend(true, {}, this.defaults, this.options);
      this.thumbs.isOneThumbShown = this.config.isOneThumbShown;

      let wC, //width component
        display = this.display.getInstance(),
        mgL,
        hL,
        ratio,
        wL,
        hT,
        wT;

      //ToDo: Overlay-toolbar Appending the overlay when it's opened, to the body itself
      // if (this.overlay.isEnabled === true) {
      //   this.element.prepend(this.overlay.instance);
      // }

      if (this.thumbs.position === 'top' || this.thumbs.position === 'left') {
        this.element.append(display);
      } else {
        this.element.prepend(display);
      }

      if ((this.thumbs.position === 'right' || this.thumbs.position === 'left') &&
        (this.thumbs.isOneThumbShown === false && (this.thumbs.li.length > 1))) {

        mgL = parseFloat(this.thumbs.li.css('margin-bottom'));
        hL = (parseFloat(this.config.heightDisplay) - (this.config.nrThumbsPerRow - 1) * mgL) / this.config.nrThumbsPerRow;
        ratio = this.config.widthDisplay / this.config.heightDisplay;
        wL = hL * ratio;
        wC = wL + this.config.thumbsMargin + parseFloat(this.config.widthDisplay);

        this.display.wDperc = Math.round(this.config.widthDisplay * 100 / wC);

        wC = this.element.parent().width() > wC ? wC : this.element.parent().width();

      } else {
        wC = this.element.parent().width() > this.config.widthDisplay ? (this.config.widthDisplay) : this.element.parent().width();
      }

      this.element.css({
        'width': wC
      });
      this.display.setup();
      this.thumbs.setup();
      this.overlay.setup();

      if (this.thumbs.position === 'top' || this.thumbs.position === 'bottom') {
        hT = this.thumbs.isOneThumbShown === false ? 0 : this.thumbs.instance.outerHeight();
        this.element.css({
          'height': hT + display.outerHeight() + parseFloat(this.thumbs.margin)
        });
      } else {
        wT = this.thumbs.isOneThumbShown === false ? 0 : this.thumbs.instance.outerWidth();
        this.element.css({
          'width': wT + display.outerWidth() + parseFloat(this.thumbs.margin)
        });
        this.element.css({
          'height': display.outerHeight()
        });
      }
    }
    changeCnt() {
      this.thumbs.changeCnt();
      this.display.changeCnt();
      this.overlay.changeCnt();
    }
    resize() {
      if (this.isFullScreenOn)
        return;
      //on mobile devices any scrolling is triggering [resize], therefore we keep track of the window.width. If the width is changing => resize
      if (this.windowWidth === $(window).width()) {
        return;
      }
      this.windowWidth = $(window).width();

      this.element.css({
        'height': '0',
        'width': '0'
      });
      this.setup();
      //Resising the component item, fit size of the thumb images
      $.each(this.element.find('li'), (index, li) => this.items[index].fitSize());
    }
    fullScreenHandler(event, context) { //ToDo: check if context is needed ?!
      var _this = context || this;

      if (!_this.overlay.isOpened) {
        _this.isFullScreenOn = !_this.isFullScreenOn;
      }
    }
  }
  $.fn.glassCase = function (options) {
    this.each(() => {
      let instance = $.data(this, 'gcglasscase');
      if (!instance) {
        $.data(this, 'gcglasscase', new GlassCase($(this), options));
      }
    });
  };
})(jQuery, window, document);

/*!
Dynamics.js

Dynamics.js is a JavaScript library to create physics-based animations.
To see some demos, check out http://dynamicsjs.com.
*/

(function () {
  var t, e, n, r, o, i, s, a, u, l, f, h, p, c, m, d, g, y, v, b, w, x, M, S, k, T, C, H, R, q, I, X, Y, A, j, z, F, G, O, V, Z, E, L, D, P, W, N, U, $, B, K, J, Q, _, te, ee, ne, re, oe = function (t, e) {
    return function () {
      return t.apply(e, arguments)
    }
  };
  I = function () {
    return "visible" === document.visibilityState || null != H.tests
  }, z = function () {
    var t;
    return t = [], "undefined" != typeof document && null !== document && document.addEventListener("visibilitychange", function () {
        var e, n, r, o;
        for (o = [], n = 0, r = t.length; r > n; n++) e = t[n], o.push(e(I()));
        return o
      }),
      function (e) {
        return t.push(e)
      }
  }(), S = function (t) {
    var e, n, r;
    n = {};
    for (e in t) r = t[e], n[e] = r;
    return n
  }, x = function (t) {
    var e;
    return e = {},
      function () {
        var n, r, o, i, s;
        for (r = "", i = 0, s = arguments.length; s > i; i++) n = arguments[i], r += n.toString() + ",";
        return o = e[r], o || (e[r] = o = t.apply(this, arguments)), o
      }
  }, j = function (t) {
    return function (e) {
      var n, r, o;
      return e instanceof Array || e instanceof NodeList || e instanceof HTMLCollection ? o = function () {
        var o, i, s;
        for (s = [], r = o = 0, i = e.length; i >= 0 ? i > o : o > i; r = i >= 0 ? ++o : --o) n = Array.prototype.slice.call(arguments, 1), n.splice(0, 0, e[r]), s.push(t.apply(this, n));
        return s
      }.apply(this, arguments) : t.apply(this, arguments)
    }
  }, y = function (t, e) {
    var n, r, o;
    o = [];
    for (n in e) r = e[n], o.push(null != t[n] ? t[n] : t[n] = r);
    return o
  }, v = function (t, e) {
    var n, r, o;
    if (null != t.style) return b(t, e);
    o = [];
    for (n in e) r = e[n], o.push(t[n] = r.format());
    return o
  }, b = function (t, e) {
    var n, r, o, i, s;
    e = F(e), i = [], n = X(t);
    for (r in e) s = e[r], ee.contains(r) ? i.push([r, s]) : (null != s.format && (s = s.format()), "number" == typeof s && (s = "" + s + re(r, s)), null != t.hasAttribute && t.hasAttribute(r) ? t.setAttribute(r, s) : null != t.style && (t.style[O(r)] = s), r in t && (t[r] = s));
    return i.length > 0 ? n ? (o = new l, o.applyProperties(i), t.setAttribute("transform", o.decompose().format())) : (s = i.map(function (t) {
      return ne(t[0], t[1])
    }).join(" "), t.style[O("transform")] = s) : void 0
  }, X = function (t) {
    var e, n;
    return "undefined" != typeof SVGElement && null !== SVGElement && "undefined" != typeof SVGSVGElement && null !== SVGSVGElement ? t instanceof SVGElement && !(t instanceof SVGSVGElement) : null != (e = null != (n = H.tests) && "function" == typeof n.isSVG ? n.isSVG(t) : void 0) ? e : !1
  }, E = function (t, e) {
    var n;
    return n = Math.pow(10, e), Math.round(t * n) / n
  }, f = function () {
    function t(t) {
      var e, n, r;
      for (this.obj = {}, n = 0, r = t.length; r > n; n++) e = t[n], this.obj[e] = 1
    }
    return t.prototype.contains = function (t) {
      return 1 === this.obj[t]
    }, t
  }(), te = function (t) {
    return t.replace(/([A-Z])/g, function (t) {
      return "-" + t.toLowerCase()
    })
  }, V = new f("marginTop,marginLeft,marginBottom,marginRight,paddingTop,paddingLeft,paddingBottom,paddingRight,top,left,bottom,right,translateX,translateY,translateZ,perspectiveX,perspectiveY,perspectiveZ,width,height,maxWidth,maxHeight,minWidth,minHeight,borderRadius".split(",")), C = new f("rotate,rotateX,rotateY,rotateZ,skew,skewX,skewY,skewZ".split(",")), ee = new f("translate,translateX,translateY,translateZ,scale,scaleX,scaleY,scaleZ,rotate,rotateX,rotateY,rotateZ,rotateC,rotateCX,rotateCY,skew,skewX,skewY,skewZ,perspective".split(",")), K = new f("accent-height,ascent,azimuth,baseFrequency,baseline-shift,bias,cx,cy,d,diffuseConstant,divisor,dx,dy,elevation,filterRes,fx,fy,gradientTransform,height,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,letter-spacing,limitingConeAngle,markerHeight,markerWidth,numOctaves,order,overline-position,overline-thickness,pathLength,points,pointsAtX,pointsAtY,pointsAtZ,r,radius,rx,ry,seed,specularConstant,specularExponent,stdDeviation,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,surfaceScale,target,targetX,targetY,transform,underline-position,underline-thickness,viewBox,width,x,x1,x2,y,y1,y2,z".split(",")), re = function (t, e) {
    return "number" != typeof e ? "" : V.contains(t) ? "px" : C.contains(t) ? "deg" : ""
  }, ne = function (t, e) {
    var n, r;
    return n = ("" + e).match(/^([0-9.-]*)([^0-9]*)$/), null != n ? (e = n[1], r = n[2]) : e = parseFloat(e), e = E(parseFloat(e), 10), (null == r || "" === r) && (r = re(t, e)), "" + t + "(" + e + r + ")"
  }, F = function (t) {
    var e, n, r, o, i, s, a, u;
    r = {};
    for (o in t)
      if (i = t[o], ee.contains(o))
        if (n = o.match(/(translate|rotateC|rotate|skew|scale|perspective)(X|Y|Z|)/), n && n[2].length > 0) r[o] = i;
        else
          for (u = ["X", "Y", "Z"], s = 0, a = u.length; a > s; s++) e = u[s], r[n[1] + e] = i;
    else r[o] = i;
    return r
  }, T = function (t) {
    var e;
    return e = "opacity" === t ? 1 : 0, "" + e + re(t, e)
  }, R = function (t, e) {
    var n, r, o, i, s, a, f, h, p, m, d;
    if (i = {}, n = X(t), null != t.style)
      for (s = window.getComputedStyle(t, null), f = 0, p = e.length; p > f; f++) r = e[f], ee.contains(r) ? null == i.transform && (o = n ? new l(null != (d = t.transform.baseVal.consolidate()) ? d.matrix : void 0) : u.fromTransform(s[O("transform")]), i.transform = o.decompose()) : (a = null != t.hasAttribute && t.hasAttribute(r) ? t.getAttribute(r) : r in t ? t[r] : s[r], null != a && "d" !== r || !K.contains(r) || (a = t.getAttribute(r)), ("" === a || null == a) && (a = T(r)), i[r] = k(a));
    else
      for (h = 0, m = e.length; m > h; h++) r = e[h], i[r] = k(t[r]);
    return c(t, i), i
  }, c = function (t, e) {
    var n, r;
    for (r in e) n = e[r], n instanceof i && null != t.style && r in t.style && (n = new a([n, re(r, 0)])), e[r] = n;
    return e
  }, k = function (t) {
    var e, n, o, u, l;
    for (o = [r, s, i, a], u = 0, l = o.length; l > u; u++)
      if (n = o[u], e = n.create(t), null != e) return e;
    return null
  }, a = function () {
    function t(t) {
      this.parts = t, this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
    }
    return t.prototype.interpolate = function (e, n) {
      var r, o, i, s, a, u;
      for (s = this.parts, r = e.parts, i = [], o = a = 0, u = Math.min(s.length, r.length); u >= 0 ? u > a : a > u; o = u >= 0 ? ++a : --a) i.push(null != s[o].interpolate ? s[o].interpolate(r[o], n) : s[o]);
      return new t(i)
    }, t.prototype.format = function () {
      var t;
      return t = this.parts.map(function (t) {
        return null != t.format ? t.format() : t
      }), t.join("")
    }, t.create = function (e) {
      var n, r, s, a, u, l, f, h, p, c, m;
      for (e = "" + e, s = [], f = [{
          re: /(#[a-f\d]{3,6})/gi,
          klass: o,
          parse: function (t) {
            return t
          }
        }, {
          re: /(rgba?\([0-9.]*, ?[0-9.]*, ?[0-9.]*(?:, ?[0-9.]*)?\))/gi,
          klass: o,
          parse: function (t) {
            return t
          }
        }, {
          re: /([-+]?[\d.]+)/gi,
          klass: i,
          parse: parseFloat
        }], h = 0, c = f.length; c > h; h++)
        for (l = f[h], u = l.re; r = u.exec(e);) s.push({
          index: r.index,
          length: r[1].length,
          interpolable: l.klass.create(l.parse(r[1]))
        });
      for (s = s.sort(function (t, e) {
          return t.index > e.index ? 1 : -1
        }), a = [], n = 0, p = 0, m = s.length; m > p; p++) r = s[p], r.index < n || (r.index > n && a.push(e.substring(n, r.index)), a.push(r.interpolable), n = r.index + r.length);
      return n < e.length && a.push(e.substring(n)), new t(a)
    }, t
  }(), s = function () {
    function t(t) {
      this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this), this.obj = t
    }
    return t.prototype.interpolate = function (e, n) {
      var r, o, i, s, a;
      s = this.obj, r = e.obj, i = {};
      for (o in s) a = s[o], i[o] = null != a.interpolate ? a.interpolate(r[o], n) : a;
      return new t(i)
    }, t.prototype.format = function () {
      return this.obj
    }, t.create = function (e) {
      var n, r, o;
      if (e instanceof Object) {
        r = {};
        for (n in e) o = e[n], r[n] = k(o);
        return new t(r)
      }
      return null
    }, t
  }(), i = function () {
    function t(t) {
      this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this), this.value = parseFloat(t)
    }
    return t.prototype.interpolate = function (e, n) {
      var r, o;
      return o = this.value, r = e.value, new t((r - o) * n + o)
    }, t.prototype.format = function () {
      return E(this.value, 5)
    }, t.create = function (e) {
      return "number" == typeof e ? new t(e) : null
    }, t
  }(), r = function () {
    function t(t) {
      this.values = t, this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
    }
    return t.prototype.interpolate = function (e, n) {
      var r, o, i, s, a, u;
      for (s = this.values, r = e.values, i = [], o = a = 0, u = Math.min(s.length, r.length); u >= 0 ? u > a : a > u; o = u >= 0 ? ++a : --a) i.push(null != s[o].interpolate ? s[o].interpolate(r[o], n) : s[o]);
      return new t(i)
    }, t.prototype.format = function () {
      return this.values.map(function (t) {
        return null != t.format ? t.format() : t
      })
    }, t.createFromArray = function (e) {
      var n;
      return n = e.map(function (t) {
        return k(t) || t
      }), n = n.filter(function (t) {
        return null != t
      }), new t(n)
    }, t.create = function (e) {
      return e instanceof Array ? t.createFromArray(e) : null
    }, t
  }(), t = function () {
    function t(t, e) {
      this.rgb = null != t ? t : {}, this.format = e, this.toRgba = oe(this.toRgba, this), this.toRgb = oe(this.toRgb, this), this.toHex = oe(this.toHex, this)
    }
    return t.fromHex = function (e) {
      var n, r;
      return n = e.match(/^#([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i), null != n && (e = "#" + n[1] + n[1] + n[2] + n[2] + n[3] + n[3]), r = e.match(/^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i), null != r ? new t({
        r: parseInt(r[1], 16),
        g: parseInt(r[2], 16),
        b: parseInt(r[3], 16),
        a: 1
      }, "hex") : null
    }, t.fromRgb = function (e) {
      var n, r;
      return n = e.match(/^rgba?\(([0-9.]*), ?([0-9.]*), ?([0-9.]*)(?:, ?([0-9.]*))?\)$/), null != n ? new t({
        r: parseFloat(n[1]),
        g: parseFloat(n[2]),
        b: parseFloat(n[3]),
        a: parseFloat(null != (r = n[4]) ? r : 1)
      }, null != n[4] ? "rgba" : "rgb") : null
    }, t.componentToHex = function (t) {
      var e;
      return e = t.toString(16), 1 === e.length ? "0" + e : e
    }, t.prototype.toHex = function () {
      return "#" + t.componentToHex(this.rgb.r) + t.componentToHex(this.rgb.g) + t.componentToHex(this.rgb.b)
    }, t.prototype.toRgb = function () {
      return "rgb(" + this.rgb.r + ", " + this.rgb.g + ", " + this.rgb.b + ")"
    }, t.prototype.toRgba = function () {
      return "rgba(" + this.rgb.r + ", " + this.rgb.g + ", " + this.rgb.b + ", " + this.rgb.a + ")"
    }, t
  }(), o = function () {
    function e(t) {
      this.color = t, this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
    }
    return e.prototype.interpolate = function (n, r) {
      var o, i, s, a, u, l, f, h;
      for (a = this.color, o = n.color, s = {}, h = ["r", "g", "b"], l = 0, f = h.length; f > l; l++) i = h[l], u = Math.round((o.rgb[i] - a.rgb[i]) * r + a.rgb[i]), s[i] = Math.min(255, Math.max(0, u));
      return i = "a", u = E((o.rgb[i] - a.rgb[i]) * r + a.rgb[i], 5), s[i] = Math.min(1, Math.max(0, u)), new e(new t(s, o.format))
    }, e.prototype.format = function () {
      return "hex" === this.color.format ? this.color.toHex() : "rgb" === this.color.format ? this.color.toRgb() : "rgba" === this.color.format ? this.color.toRgba() : void 0
    }, e.create = function (n) {
      var r;
      if ("string" == typeof n) return r = t.fromHex(n) || t.fromRgb(n), null != r ? new e(r) : null
    }, e
  }(), n = function () {
    function t(t) {
      this.props = t, this.applyRotateCenter = oe(this.applyRotateCenter, this), this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
    }
    return t.prototype.interpolate = function (e, n) {
      var r, o, i, s, a, u, l, f, h, p, c, m;
      for (i = {}, p = ["translate", "scale", "rotate"], s = 0, f = p.length; f > s; s++)
        for (o = p[s], i[o] = [], r = a = 0, c = this.props[o].length; c >= 0 ? c > a : a > c; r = c >= 0 ? ++a : --a) i[o][r] = (e.props[o][r] - this.props[o][r]) * n + this.props[o][r];
      for (r = u = 1; 2 >= u; r = ++u) i.rotate[r] = e.props.rotate[r];
      for (m = ["skew"], l = 0, h = m.length; h > l; l++) o = m[l], i[o] = (e.props[o] - this.props[o]) * n + this.props[o];
      return new t(i)
    }, t.prototype.format = function () {
      return "translate(" + this.props.translate.join(",") + ") rotate(" + this.props.rotate.join(",") + ") skewX(" + this.props.skew + ") scale(" + this.props.scale.join(",") + ")"
    }, t.prototype.applyRotateCenter = function (t) {
      var e, n, r, o, i, s;
      for (n = w.createSVGMatrix(), n = n.translate(t[0], t[1]), n = n.rotate(this.props.rotate[0]), n = n.translate(-t[0], -t[1]), r = new l(n), o = r.decompose().props.translate, s = [], e = i = 0; 1 >= i; e = ++i) s.push(this.props.translate[e] -= o[e]);
      return s
    }, t
  }(), w = "undefined" != typeof document && null !== document ? document.createElementNS("http://www.w3.org/2000/svg", "svg") : void 0, l = function () {
    function t(t) {
      this.m = t, this.applyProperties = oe(this.applyProperties, this), this.decompose = oe(this.decompose, this), this.m || (this.m = w.createSVGMatrix())
    }
    return t.prototype.decompose = function () {
      var t, e, r, o, i;
      return o = new h([this.m.a, this.m.b]), i = new h([this.m.c, this.m.d]), t = o.length(), r = o.dot(i), o = o.normalize(), e = i.combine(o, 1, -r).length(), new n({
        translate: [this.m.e, this.m.f],
        rotate: [180 * Math.atan2(this.m.b, this.m.a) / Math.PI, this.rotateCX, this.rotateCY],
        scale: [t, e],
        skew: r / e * 180 / Math.PI
      })
    }, t.prototype.applyProperties = function (t) {
      var e, n, r, o, i, s, a, u;
      for (e = {}, i = 0, s = t.length; s > i; i++) r = t[i], e[r[0]] = r[1];
      for (n in e) o = e[n], "translateX" === n ? this.m = this.m.translate(o, 0) : "translateY" === n ? this.m = this.m.translate(0, o) : "scaleX" === n ? this.m = this.m.scaleNonUniform(o, 1) : "scaleY" === n ? this.m = this.m.scaleNonUniform(1, o) : "rotateZ" === n ? this.m = this.m.rotate(o) : "skewX" === n ? this.m = this.m.skewX(o) : "skewY" === n && (this.m = this.m.skewY(o));
      return this.rotateCX = null != (a = e.rotateCX) ? a : 0, this.rotateCY = null != (u = e.rotateCY) ? u : 0
    }, t
  }(), h = function () {
    function t(t) {
      this.els = t, this.combine = oe(this.combine, this), this.normalize = oe(this.normalize, this), this.length = oe(this.length, this), this.cross = oe(this.cross, this), this.dot = oe(this.dot, this), this.e = oe(this.e, this)
    }
    return t.prototype.e = function (t) {
      return 1 > t || t > this.els.length ? null : this.els[t - 1]
    }, t.prototype.dot = function (t) {
      var e, n, r;
      if (e = t.els || t, r = 0, n = this.els.length, n !== e.length) return null;
      for (n += 1; --n;) r += this.els[n - 1] * e[n - 1];
      return r
    }, t.prototype.cross = function (e) {
      var n, r;
      return r = e.els || e, 3 !== this.els.length || 3 !== r.length ? null : (n = this.els, new t([n[1] * r[2] - n[2] * r[1], n[2] * r[0] - n[0] * r[2], n[0] * r[1] - n[1] * r[0]]))
    }, t.prototype.length = function () {
      var t, e, n, r, o;
      for (t = 0, o = this.els, n = 0, r = o.length; r > n; n++) e = o[n], t += Math.pow(e, 2);
      return Math.sqrt(t)
    }, t.prototype.normalize = function () {
      var e, n, r, o, i;
      r = this.length(), o = [], i = this.els;
      for (n in i) e = i[n], o[n] = e / r;
      return new t(o)
    }, t.prototype.combine = function (e, n, r) {
      var o, i, s, a;
      for (i = [], o = s = 0, a = this.els.length; a >= 0 ? a > s : s > a; o = a >= 0 ? ++s : --s) i[o] = n * this.els[o] + r * e.els[o];
      return new t(i)
    }, t
  }(), e = function () {
    function t() {
      this.toMatrix = oe(this.toMatrix, this), this.format = oe(this.format, this), this.interpolate = oe(this.interpolate, this)
    }
    return t.prototype.interpolate = function (e, n, r) {
      var o, i, s, a, u, l, f, h, p, c, m, d, g, y, v, b, w, x;
      for (null == r && (r = null), s = this, i = new t, w = ["translate", "scale", "skew", "perspective"], d = 0, b = w.length; b > d; d++)
        for (f = w[d], i[f] = [], a = g = 0, x = s[f].length - 1; x >= 0 ? x >= g : g >= x; a = x >= 0 ? ++g : --g) i[f][a] = null == r || r.indexOf(f) > -1 || r.indexOf("" + f + ["x", "y", "z"][a]) > -1 ? (e[f][a] - s[f][a]) * n + s[f][a] : s[f][a];
      if (null == r || -1 !== r.indexOf("rotate")) {
        if (h = s.quaternion, p = e.quaternion, o = h[0] * p[0] + h[1] * p[1] + h[2] * p[2] + h[3] * p[3], 0 > o) {
          for (a = y = 0; 3 >= y; a = ++y) h[a] = -h[a];
          o = -o
        }
        for (o + 1 > .05 ? 1 - o >= .05 ? (m = Math.acos(o), l = 1 / Math.sin(m), c = Math.sin(m * (1 - n)) * l, u = Math.sin(m * n) * l) : (c = 1 - n, u = n) : (p[0] = -h[1], p[1] = h[0], p[2] = -h[3], p[3] = h[2], c = Math.sin(piDouble * (.5 - n)), u = Math.sin(piDouble * n)), i.quaternion = [], a = v = 0; 3 >= v; a = ++v) i.quaternion[a] = h[a] * c + p[a] * u
      } else i.quaternion = s.quaternion;
      return i
    }, t.prototype.format = function () {
      return this.toMatrix().toString()
    }, t.prototype.toMatrix = function () {
      var t, e, n, r, o, i, s, a, l, f, h, p, c, m, d, g;
      for (t = this, o = u.I(4), e = c = 0; 3 >= c; e = ++c) o.els[e][3] = t.perspective[e];
      for (i = t.quaternion, f = i[0], h = i[1], p = i[2], l = i[3], s = t.skew, r = [
          [1, 0],
          [2, 0],
          [2, 1]
        ], e = m = 2; m >= 0; e = --m) s[e] && (a = u.I(4), a.els[r[e][0]][r[e][1]] = s[e], o = o.multiply(a));
      for (o = o.multiply(new u([
          [1 - 2 * (h * h + p * p), 2 * (f * h - p * l), 2 * (f * p + h * l), 0],
          [2 * (f * h + p * l), 1 - 2 * (f * f + p * p), 2 * (h * p - f * l), 0],
          [2 * (f * p - h * l), 2 * (h * p + f * l), 1 - 2 * (f * f + h * h), 0],
          [0, 0, 0, 1]
        ])), e = d = 0; 2 >= d; e = ++d) {
        for (n = g = 0; 2 >= g; n = ++g) o.els[e][n] *= t.scale[e];
        o.els[3][e] = t.translate[e]
      }
      return o
    }, t
  }(), u = function () {
    function t(t) {
      this.els = t, this.toString = oe(this.toString, this), this.decompose = oe(this.decompose, this), this.inverse = oe(this.inverse, this), this.augment = oe(this.augment, this), this.toRightTriangular = oe(this.toRightTriangular, this), this.transpose = oe(this.transpose, this), this.multiply = oe(this.multiply, this), this.dup = oe(this.dup, this), this.e = oe(this.e, this)
    }
    return t.prototype.e = function (t, e) {
      return 1 > t || t > this.els.length || 1 > e || e > this.els[0].length ? null : this.els[t - 1][e - 1]
    }, t.prototype.dup = function () {
      return new t(this.els)
    }, t.prototype.multiply = function (e) {
      var n, r, o, i, s, a, u, l, f, h, p, c, m;
      for (c = e.modulus ? !0 : !1, n = e.els || e, "undefined" == typeof n[0][0] && (n = new t(n).els), h = this.els.length, u = h, l = n[0].length, o = this.els[0].length, i = [], h += 1; --h;)
        for (s = u - h, i[s] = [], p = l, p += 1; --p;) {
          for (a = l - p, m = 0, f = o, f += 1; --f;) r = o - f, m += this.els[s][r] * n[r][a];
          i[s][a] = m
        }
      return n = new t(i), c ? n.col(1) : n
    }, t.prototype.transpose = function () {
      var e, n, r, o, i, s, a;
      for (a = this.els.length, e = this.els[0].length, n = [], i = e, i += 1; --i;)
        for (r = e - i, n[r] = [], s = a, s += 1; --s;) o = a - s, n[r][o] = this.els[o][r];
      return new t(n)
    }, t.prototype.toRightTriangular = function () {
      var t, e, n, r, o, i, s, a, u, l, f, h, p, c;
      for (t = this.dup(), a = this.els.length, o = a, i = this.els[0].length; --a;) {
        if (n = o - a, 0 === t.els[n][n])
          for (r = f = p = n + 1; o >= p ? o > f : f > o; r = o >= p ? ++f : --f)
            if (0 !== t.els[r][n]) {
              for (e = [], u = i, u += 1; --u;) l = i - u, e.push(t.els[n][l] + t.els[r][l]);
              t.els[n] = e;
              break
            } if (0 !== t.els[n][n])
          for (r = h = c = n + 1; o >= c ? o > h : h > o; r = o >= c ? ++h : --h) {
            for (s = t.els[r][n] / t.els[n][n], e = [], u = i, u += 1; --u;) l = i - u, e.push(n >= l ? 0 : t.els[r][l] - t.els[n][l] * s);
            t.els[r] = e
          }
      }
      return t
    }, t.prototype.augment = function (e) {
      var n, r, o, i, s, a, u, l, f;
      if (n = e.els || e, "undefined" == typeof n[0][0] && (n = new t(n).els), r = this.dup(), o = r.els[0].length, l = r.els.length, a = l, u = n[0].length, l !== n.length) return null;
      for (l += 1; --l;)
        for (i = a - l, f = u, f += 1; --f;) s = u - f, r.els[i][o + s] = n[i][s];
      return r
    }, t.prototype.inverse = function () {
      var e, n, r, o, i, s, a, u, l, f, h, p, c;
      for (f = this.els.length, a = f, e = this.augment(t.I(f)).toRightTriangular(), u = e.els[0].length, i = [], f += 1; --f;) {
        for (o = f - 1, r = [], h = u, i[o] = [], n = e.els[o][o], h += 1; --h;) p = u - h, l = e.els[o][p] / n, r.push(l), p >= a && i[o].push(l);
        for (e.els[o] = r, s = c = 0; o >= 0 ? o > c : c > o; s = o >= 0 ? ++c : --c) {
          for (r = [], h = u, h += 1; --h;) p = u - h, r.push(e.els[s][p] - e.els[o][p] * e.els[s][o]);
          e.els[s] = r
        }
      }
      return new t(i)
    }, t.I = function (e) {
      var n, r, o, i, s;
      for (n = [], i = e, e += 1; --e;)
        for (r = i - e, n[r] = [], s = i, s += 1; --s;) o = i - s, n[r][o] = r === o ? 1 : 0;
      return new t(n)
    }, t.prototype.decompose = function () {
      var t, n, r, o, i, s, a, u, l, f, p, c, m, d, g, y, v, b, w, x, M, S, k, T, C, H, R, q, I, X, Y, A, j, z, F, G, O, V;
      for (s = this, x = [], v = [], b = [], f = [], u = [], t = [], n = I = 0; 3 >= I; n = ++I)
        for (t[n] = [], o = X = 0; 3 >= X; o = ++X) t[n][o] = s.els[n][o];
      if (0 === t[3][3]) return !1;
      for (n = Y = 0; 3 >= Y; n = ++Y)
        for (o = A = 0; 3 >= A; o = ++A) t[n][o] /= t[3][3];
      for (l = s.dup(), n = j = 0; 2 >= j; n = ++j) l.els[n][3] = 0;
      if (l.els[3][3] = 1, 0 !== t[0][3] || 0 !== t[1][3] || 0 !== t[2][3]) {
        for (c = new h(t.slice(0, 4)[3]), r = l.inverse(), M = r.transpose(), u = M.multiply(c).els, n = z = 0; 2 >= z; n = ++z) t[n][3] = 0;
        t[3][3] = 1
      } else u = [0, 0, 0, 1];
      for (n = F = 0; 2 >= F; n = ++F) x[n] = t[3][n], t[3][n] = 0;
      for (d = [], n = G = 0; 2 >= G; n = ++G) d[n] = new h(t[n].slice(0, 3));
      if (v[0] = d[0].length(), d[0] = d[0].normalize(), b[0] = d[0].dot(d[1]), d[1] = d[1].combine(d[0], 1, -b[0]), v[1] = d[1].length(), d[1] = d[1].normalize(), b[0] /= v[1], b[1] = d[0].dot(d[2]), d[2] = d[2].combine(d[0], 1, -b[1]), b[2] = d[1].dot(d[2]), d[2] = d[2].combine(d[1], 1, -b[2]), v[2] = d[2].length(), d[2] = d[2].normalize(), b[1] /= v[2], b[2] /= v[2], a = d[1].cross(d[2]), d[0].dot(a) < 0)
        for (n = O = 0; 2 >= O; n = ++O)
          for (v[n] *= -1, o = V = 0; 2 >= V; o = ++V) d[n].els[o] *= -1;
      g = function (t, e) {
        return d[t].els[e]
      }, m = [], m[1] = Math.asin(-g(0, 2)), 0 !== Math.cos(m[1]) ? (m[0] = Math.atan2(g(1, 2), g(2, 2)), m[2] = Math.atan2(g(0, 1), g(0, 0))) : (m[0] = Math.atan2(-g(2, 0), g(1, 1)), m[1] = 0), w = g(0, 0) + g(1, 1) + g(2, 2) + 1, w > 1e-4 ? (y = .5 / Math.sqrt(w), C = .25 / y, H = (g(2, 1) - g(1, 2)) * y, R = (g(0, 2) - g(2, 0)) * y, q = (g(1, 0) - g(0, 1)) * y) : g(0, 0) > g(1, 1) && g(0, 0) > g(2, 2) ? (y = 2 * Math.sqrt(1 + g(0, 0) - g(1, 1) - g(2, 2)), H = .25 * y, R = (g(0, 1) + g(1, 0)) / y, q = (g(0, 2) + g(2, 0)) / y, C = (g(2, 1) - g(1, 2)) / y) : g(1, 1) > g(2, 2) ? (y = 2 * Math.sqrt(1 + g(1, 1) - g(0, 0) - g(2, 2)), H = (g(0, 1) + g(1, 0)) / y, R = .25 * y, q = (g(1, 2) + g(2, 1)) / y, C = (g(0, 2) - g(2, 0)) / y) : (y = 2 * Math.sqrt(1 + g(2, 2) - g(0, 0) - g(1, 1)), H = (g(0, 2) + g(2, 0)) / y, R = (g(1, 2) + g(2, 1)) / y, q = .25 * y, C = (g(1, 0) - g(0, 1)) / y), f = [H, R, q, C], p = new e, p.translate = x, p.scale = v, p.skew = b, p.quaternion = f, p.perspective = u, p.rotate = m;
      for (k in p) {
        S = p[k];
        for (i in S) T = S[i], isNaN(T) && (S[i] = 0)
      }
      return p
    }, t.prototype.toString = function () {
      var t, e, n, r, o;
      for (n = "matrix3d(", t = r = 0; 3 >= r; t = ++r)
        for (e = o = 0; 3 >= o; e = ++o) n += E(this.els[t][e], 10), (3 !== t || 3 !== e) && (n += ",");
      return n += ")"
    }, t.matrixForTransform = x(function (t) {
      var e, n, r, o, i, s;
      return e = document.createElement("div"), e.style.position = "absolute", e.style.visibility = "hidden", e.style[O("transform")] = t, document.body.appendChild(e), r = window.getComputedStyle(e, null), n = null != (o = null != (i = r.transform) ? i : r[O("transform")]) ? o : null != (s = H.tests) ? s.matrixForTransform(t) : void 0, document.body.removeChild(e), n
    }), t.fromTransform = function (e) {
      var n, r, o, i, s, a;
      for (i = null != e ? e.match(/matrix3?d?\(([-0-9,e \.]*)\)/) : void 0, i ? (n = i[1].split(","), n = n.map(parseFloat), r = 6 === n.length ? [n[0], n[1], 0, 0, n[2], n[3], 0, 0, 0, 0, 1, 0, n[4], n[5], 0, 1] : n) : r = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], s = [], o = a = 0; 3 >= a; o = ++a) s.push(r.slice(4 * o, 4 * o + 4));
      return new t(s)
    }, t
  }(), G = x(function (t) {
    var e, n, r, o, i, s, a, u, l, f;
    if (void 0 !== document.body.style[t]) return "";
    for (o = t.split("-"), i = "", s = 0, u = o.length; u > s; s++) r = o[s], i += r.substring(0, 1).toUpperCase() + r.substring(1);
    for (f = ["Webkit", "Moz", "ms"], a = 0, l = f.length; l > a; a++)
      if (n = f[a], e = n + i, void 0 !== document.body.style[e]) return n;
    return ""
  }), O = x(function (t) {
    var e;
    return e = G(t), "Moz" === e ? "" + e + (t.substring(0, 1).toUpperCase() + t.substring(1)) : "" !== e ? "-" + e.toLowerCase() + "-" + te(t) : te(t)
  }), Z = "undefined" != typeof window && null !== window ? window.requestAnimationFrame : void 0, d = [], g = [], N = !1, U = 1, "undefined" != typeof window && null !== window && window.addEventListener("keyup", function (t) {
    return 68 === t.keyCode && t.shiftKey && t.ctrlKey ? H.toggleSlow() : void 0
  }), null == Z && (Y = 0, Z = function (t) {
    var e, n, r;
    return e = Date.now(), r = Math.max(0, 16 - (e - Y)), n = window.setTimeout(function () {
      return t(e + r)
    }, r), Y = e + r, n
  }), D = !1, L = !1, B = function () {
    return D ? void 0 : (D = !0, Z(P))
  }, P = function (t) {
    var e, n, r, o;
    if (L) return void Z(P);
    for (n = [], r = 0, o = d.length; o > r; r++) e = d[r], m(t, e) || n.push(e);
    return d = d.filter(function (t) {
      return -1 === n.indexOf(t)
    }), 0 === d.length ? D = !1 : Z(P)
  }, m = function (t, e) {
    var n, r, o, i, s, a, u, l;
    if (null == e.tStart && (e.tStart = t), i = (t - e.tStart) / e.options.duration, s = e.curve(i), r = {}, i >= 1) r = e.curve.returnsToSelf ? e.properties.start : e.properties.end;
    else {
      l = e.properties.start;
      for (n in l) o = l[n], r[n] = q(o, e.properties.end[n], s)
    }
    return v(e.el, r), "function" == typeof (a = e.options).change && a.change(e.el, Math.min(1, i)), i >= 1 && "function" == typeof (u = e.options).complete && u.complete(e.el), 1 > i
  }, q = function (t, e, n) {
    return null != t && null != t.interpolate ? t.interpolate(e, n) : null
  }, $ = function (t, e, n, r) {
    var o, i, s, a, f, h, p;
    if (null != r && (g = g.filter(function (t) {
        return t.id !== r
      })), H.stop(t, {
        timeout: !1
      }), !n.animated) return H.css(t, e), void("function" == typeof n.complete && n.complete(this));
    f = R(t, Object.keys(e)), e = F(e), o = {}, h = [];
    for (s in e) p = e[s], null != t.style && ee.contains(s) ? h.push([s, p]) : o[s] = k(p);
    return h.length > 0 && (i = X(t), i ? (a = new l, a.applyProperties(h)) : (p = h.map(function (t) {
      return ne(t[0], t[1])
    }).join(" "), a = u.fromTransform(u.matrixForTransform(p))), o.transform = a.decompose(), i && f.transform.applyRotateCenter([o.transform.props.rotate[1], o.transform.props.rotate[2]])), c(t, o), d.push({
      el: t,
      properties: {
        start: f,
        end: o
      },
      options: n,
      curve: n.type.call(n.type, n)
    }), B()
  }, _ = [], Q = 0, W = function (t) {
    return I() ? Z(function () {
      return -1 !== _.indexOf(t) ? t.realTimeoutId = setTimeout(function () {
        return t.fn(), M(t.id)
      }, t.delay) : void 0
    }) : void 0
  }, p = function (t, e) {
    var n;
    return Q += 1, n = {
      id: Q,
      tStart: Date.now(),
      fn: t,
      delay: e,
      originalDelay: e
    }, W(n), _.push(n), Q
  }, M = function (t) {
    return _ = _.filter(function (e) {
      return e.id === t && e.realTimeoutId && clearTimeout(e.realTimeoutId), e.id !== t
    })
  }, A = function (t, e) {
    var n;
    return null != t ? (n = t - e.tStart, e.originalDelay - n) : e.originalDelay
  }, "undefined" != typeof window && null !== window && window.addEventListener("unload", function () {}), J = null, z(function (t) {
    var e, n, r, o, i, s, a, u, l, f;
    if (L = !t, t) {
      if (D)
        for (n = Date.now() - J, i = 0, u = d.length; u > i; i++) e = d[i], null != e.tStart && (e.tStart += n);
      for (s = 0, l = _.length; l > s; s++) r = _[s], r.delay = A(J, r), W(r);
      return J = null
    }
    for (J = Date.now(), f = [], o = 0, a = _.length; a > o; o++) r = _[o], f.push(clearTimeout(r.realTimeoutId));
    return f
  }), H = {}, H.linear = function () {
    return function (t) {
      return t
    }
  }, H.spring = function (t) {
    var e, n, r, o, i, s;
    return null == t && (t = {}), y(t, H.spring.defaults), o = Math.max(1, t.frequency / 20), i = Math.pow(20, t.friction / 100), s = t.anticipationSize / 1e3, r = Math.max(0, s), e = function (e) {
        var n, r, o, i, a;
        return n = .8, i = s / (1 - s), a = 0, o = (i - n * a) / (i - a), r = (n - o) / i, r * e * t.anticipationStrength / 100 + o
      }, n = function (t) {
        return Math.pow(i / 10, -t) * (1 - t)
      },
      function (t) {
        var r, i, a, u, l, f, h, p;
        return f = t / (1 - s) - s / (1 - s), s > t ? (p = s / (1 - s) - s / (1 - s), h = 0 / (1 - s) - s / (1 - s), l = Math.acos(1 / e(p)), a = (Math.acos(1 / e(h)) - l) / (o * -s), r = e) : (r = n, l = 0, a = 1), i = r(f), u = o * (t - s) * a + l, 1 - i * Math.cos(u)
      }
  }, H.bounce = function (t) {
    var e, n, r, o;
    return null == t && (t = {}), y(t, H.bounce.defaults), r = Math.max(1, t.frequency / 20), o = Math.pow(20, t.friction / 100), e = function (t) {
      return Math.pow(o / 10, -t) * (1 - t)
    }, n = function (t) {
      var n, o, i, s;
      return s = -1.57, o = 1, n = e(t), i = r * t * o + s, n * Math.cos(i)
    }, n.returnsToSelf = !0, n
  }, H.gravity = function (t) {
    var e, n, r, o, i, s, a;
    return null == t && (t = {}), y(t, H.gravity.defaults), n = Math.min(t.bounciness / 1250, .8), o = t.elasticity / 1e3, a = 100, r = [], e = function () {
        var r, o;
        for (r = Math.sqrt(2 / a), o = {
            a: -r,
            b: r,
            H: 1
          }, t.returnsToSelf && (o.a = 0, o.b = 2 * o.b); o.H > .001;) e = o.b - o.a, o = {
          a: o.b,
          b: o.b + e * n,
          H: o.H * n * n
        };
        return o.b
      }(), s = function (n, r, o, i) {
        var s, a;
        return e = r - n, a = 2 / e * i - 1 - 2 * n / e, s = a * a * o - o + 1, t.returnsToSelf && (s = 1 - s), s
      },
      function () {
        var i, s, u, l;
        for (s = Math.sqrt(2 / (a * e * e)), u = {
            a: -s,
            b: s,
            H: 1
          }, t.returnsToSelf && (u.a = 0, u.b = 2 * u.b), r.push(u), i = e, l = []; u.b < 1 && u.H > .001;) i = u.b - u.a, u = {
          a: u.b,
          b: u.b + i * n,
          H: u.H * o
        }, l.push(r.push(u));
        return l
      }(), i = function (e) {
        var n, o, i;
        for (o = 0, n = r[o]; !(e >= n.a && e <= n.b) && (o += 1, n = r[o]););
        return i = n ? s(n.a, n.b, n.H, e) : t.returnsToSelf ? 0 : 1
      }, i.returnsToSelf = t.returnsToSelf, i
  }, H.forceWithGravity = function (t) {
    return null == t && (t = {}), y(t, H.forceWithGravity.defaults), t.returnsToSelf = !0, H.gravity(t)
  }, H.bezier = function () {
    var t, e, n;
    return e = function (t, e, n, r, o) {
        return Math.pow(1 - t, 3) * e + 3 * Math.pow(1 - t, 2) * t * n + 3 * (1 - t) * Math.pow(t, 2) * r + Math.pow(t, 3) * o
      }, t = function (t, n, r, o, i) {
        return {
          x: e(t, n.x, r.x, o.x, i.x),
          y: e(t, n.y, r.y, o.y, i.y)
        }
      }, n = function (t, e, n) {
        var r, o, i, s, a, u, l, f, h, p;
        for (r = null, h = 0, p = e.length; p > h && (o = e[h], t >= o(0).x && t <= o(1).x && (r = o), null === r); h++);
        if (!r) return n ? 0 : 1;
        for (f = 1e-4, s = 0, u = 1, a = (u + s) / 2, l = r(a).x, i = 0; Math.abs(t - l) > f && 100 > i;) t > l ? s = a : u = a, a = (u + s) / 2, l = r(a).x, i += 1;
        return r(a).y
      },
      function (e) {
        var r, o, i;
        return null == e && (e = {}), i = e.points, r = function () {
          var e, n, o;
          r = [], o = function (e, n) {
            var o;
            return o = function (r) {
              return t(r, e, e.cp[e.cp.length - 1], n.cp[0], n)
            }, r.push(o)
          };
          for (e in i) {
            if (n = parseInt(e), n >= i.length - 1) break;
            o(i[n], i[n + 1])
          }
          return r
        }(), o = function (t) {
          return 0 === t ? 0 : 1 === t ? 1 : n(t, r, this.returnsToSelf)
        }, o.returnsToSelf = 0 === i[i.length - 1].y, o
      }
  }(), H.easeInOut = function (t) {
    var e, n;
    return null == t && (t = {}), e = null != (n = t.friction) ? n : H.easeInOut.defaults.friction, H.bezier({
      points: [{
        x: 0,
        y: 0,
        cp: [{
          x: .92 - e / 1e3,
          y: 0
        }]
      }, {
        x: 1,
        y: 1,
        cp: [{
          x: .08 + e / 1e3,
          y: 1
        }]
      }]
    })
  }, H.easeIn = function (t) {
    var e, n;
    return null == t && (t = {}), e = null != (n = t.friction) ? n : H.easeIn.defaults.friction, H.bezier({
      points: [{
        x: 0,
        y: 0,
        cp: [{
          x: .92 - e / 1e3,
          y: 0
        }]
      }, {
        x: 1,
        y: 1,
        cp: [{
          x: 1,
          y: 1
        }]
      }]
    })
  }, H.easeOut = function (t) {
    var e, n;
    return null == t && (t = {}), e = null != (n = t.friction) ? n : H.easeOut.defaults.friction, H.bezier({
      points: [{
        x: 0,
        y: 0,
        cp: [{
          x: 0,
          y: 0
        }]
      }, {
        x: 1,
        y: 1,
        cp: [{
          x: .08 + e / 1e3,
          y: 1
        }]
      }]
    })
  }, H.spring.defaults = {
    frequency: 300,
    friction: 200,
    anticipationSize: 0,
    anticipationStrength: 0
  }, H.bounce.defaults = {
    frequency: 300,
    friction: 200
  }, H.forceWithGravity.defaults = H.gravity.defaults = {
    bounciness: 400,
    elasticity: 200
  }, H.easeInOut.defaults = H.easeIn.defaults = H.easeOut.defaults = {
    friction: 500
  }, H.css = j(function (t, e) {
    return b(t, e, !0)
  }), H.animate = j(function (t, e, n) {
    var r;
    return null == n && (n = {}), n = S(n), y(n, {
      type: H.easeInOut,
      duration: 1e3,
      delay: 0,
      animated: !0
    }), n.duration = Math.max(0, n.duration * U), n.delay = Math.max(0, n.delay), 0 === n.delay ? $(t, e, n) : (r = H.setTimeout(function () {
      return $(t, e, n, r)
    }, n.delay), g.push({
      id: r,
      el: t
    }))
  }), H.stop = j(function (t, e) {
    return null == e && (e = {}), null == e.timeout && (e.timeout = !0), e.timeout && (g = g.filter(function (n) {
      return n.el !== t || null != e.filter && !e.filter(n) ? !0 : (H.clearTimeout(n.id), !1)
    })), d = d.filter(function (e) {
      return e.el !== t
    })
  }), H.setTimeout = function (t, e) {
    return p(t, e * U)
  }, H.clearTimeout = function (t) {
    return M(t)
  }, H.toggleSlow = function () {
    return N = !N, U = N ? 3 : 1, "undefined" != typeof console && null !== console && "function" == typeof console.log ? console.log("dynamics.js: slow animations " + (N ? "enabled" : "disabled")) : void 0
  }, "object" == typeof module && "object" == typeof module.exports ? module.exports = H : "function" == typeof define ? define("dynamics", function () {
    return H
  }) : window.dynamics = H
}).call(this);
