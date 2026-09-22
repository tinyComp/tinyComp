/*!
 * VERSION: 1.1
 * DATE: 2015-08-03
 * DOCS AT: http://www.tinycomp.net/
 * 
 * @license Copyright (c) 2014-2021, tinyComp. All rights reserved.
 * 
 * @author: tinyComp, tinycomp@outlook.com
 **/

(function ($, window, document, undefined) {
  'use strict';

  let Modernizr = window.Modernizr;

  class OVGroup {
    name;
    id;
    selector;
    options;
    config;
    state = 'new'; //updated
    isFirstInit = false;
    list;

    constructor(element, id, selector) {
      this.name = element.groupName;
      this.id = id;
      this.selector = selector;
      this.options = element.options;
      this.config = element.config;
      this.list = [element];
    }

    register(element) {
      this.list.push(element);
    }
  }

  class OBLoader {
    obLoadingClass;
    obLoading;

    constructor() {
      this.obLoadingClass = (Modernizr.csstransforms == true) ? 'ob-loading3' : 'ob-loading';
      this.obLoading = $(`<div class='ob-ploading'>
                              <div class='${this.obLoadingClass}'></div>
                          </div>`);
    }

    getInstance() {
      return this.obLoading;
    }
  }

  class OBItemSlide {
    groupName;
    type;
    url;
    errorTxt = '';
    width = 0;
    height = 0;
    instance;
    info;
    loader = new OBLoader();

    constructor(element) {
      this.groupName = $(element).data('ob-group');
      this.type = $(element).data('ob-type') || 'image';
      this.url = $(element).attr('href');

      switch (this.type) {
        case 'iframe':
          this.width = parseInt($(element).data('ob-width'), 10) || element.config.iframeWidth || 0;
          this.height = parseInt($(element).data('ob-height'), 10) || element.config.iframeHeight || 0;
          break;
        case 'ajax':
          this.errorTxt = element.config.ajaxErrorTxt;
          break;
        case 'video':
        case 'flash':
          if (this.type === 'video') {
            this.errorTxt = element.config.videoErrorTxt;
            this.width = parseInt($(element).data('ob-width'), 10) || element.config.videoWidth || 0;
            this.height = parseInt($(element).data('ob-height'), 10) || element.config.videoHeight || 0;
          } else {
            this.errorTxt = element.config.flashErrorTxt;
            this.width = parseInt($(element).data('ob-width'), 10) || element.config.flashWidth || 0;
            this.height = parseInt($(element).data('ob-height'), 10) || element.config.flashHeight || 0;
          }
          break;
        case 'image':
          this.errorTxt = element.config.imageErrorLoadTxt;
        default:
          break;
      }
      this.info = $(element).data('ob-info') || '';
      this.instance = $(`<div class="ob-overbox-slide"></div>`);
    }

    getInstance() {
      return this.instance;
    }
    getInformation() {
      return this.info;
    }
  }

  class OBVideo extends OBItemSlide {
    formats;
    poster;
    instanceVC; // video container || flash container
    instanceVideo;
    instanceSources;

    constructor(element) {
      super(element);

      this.formats = $(element).data('ob-formats') || [];
      this.poster = $(element).data('ob-poster') || '';

      this.setupVideo();
      this.init();
    }

    setupVideo() {
      if (this.type === 'video') {
        this.instanceVC = $(`<div class="ob-overbox-display" style = "background-color: #000;">
                                <video controls preload style="width: 100%; height: 100%;" poster="${ this.poster }"/>
                            </div>`);
        this.instanceVideo = this.instanceVC.find('video');
        this.instance.append(this.instanceVC);

        this.formats.unshift(this.url);

        this.formats.forEach(format => {
          switch (format.split('.').pop()) {
            case 'webm':
              this.instanceVideo.append(`<source src="${ format }" type="video/webm" />`);
              break;
            case 'ogv':
              this.instanceVideo.append(`<source src="${ format }" type="video/ogg" />`);
              break;
            case 'mp4':
              this.instanceVideo.append(`<source src="${ format }" type="video/mp4" />`);
              break;
            case 'swf':
              this.instanceVideo.append(`<object type="application/x-shockwave-flash" width="100%" height="100%" data="${ format }">
                                            <param name="movie" value="${ format }"> 
                                            <param name="allowfullscreen" value="true">
                                            <param name="loop" value="false">
                                            <param name="wmode" value="transparent" />
                                        </object>`);
              break;
          }
        });

        this.instanceSources = this.instanceVideo.find('source');

      } else {
        this.instance = $(`<div class="ob-overbox-display" style = "background-color: #333;">
                              <object type="application/x-shockwave-flash" width="100%" height="100%" data="${this.url}">
                                  <param name="movie" value="${this.url}">
                                  <param name="allowfullscreen" value="true">
                                  <param name="loop" value="false">
                                  <param name="wmode" value="transparent" />
                                  <div class="ob-flash-error"><p>${this.errorTxt}</p></div>
                              </object>
                          </div>`);
        this.instanceVC = this.instance.find('div');
        this.instanceVideo = this.instanceVC.find('object');
        this.instance.append(this.instanceVC);
      }
    }

    init() {
      this.instanceVC.hide();
      this.addLoader();

      $.when(this.load()).done(() => {
        this.removeLoader();
        this.fitSize();
      });
    }

    fitSize() {
      console.log('video fitsize');
      let cHeight = this.instance.height(),
        cWidth = this.instance.width(),
        ratio;

      if (this.height <= cHeight && this.width <= cWidth) {
        this.instanceVC.css({
          'width': this.width,
          'height': this.height
        });
      } else {
        ratio = this.width / this.height;

        if (this.height > cHeight && this.width <= cWidth) {
          this.instanceVC.css({
            'width': cHeight * ratio,
            'height': cHeight
          });
        }

        if (this.height < cHeight && this.width > cWidth) {
          this.instanceVC.css({
            'width': cWidth,
            'height': cWidth / ratio
          });
        }

        if (this.height > cHeight && this.width > cWidth) {
          let ratioC = cWidth / cHeight;
          if (ratioC < ratio) {
            if (ratio > 1) {
              this.instanceVC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            } else {
              this.instanceVC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            }
          } else {
            if (ratio > 1) {
              this.instanceVC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            } else {
              this.instanceVC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            }
          }
        }
      }
    }

    resize() {
      return this.fitSize();
    }

    load() {
      let _this = this;

      return $.Deferred(dfd => {
        this.instanceVideo.on('loadeddata', function () { //Arrow function expression does not have its own bindings to this, => using a traditional function expression
          console.log('loadeddata video');

          dfd.resolve();
        });

        this.instanceSources.on('error', function () {
          console.log('error loading video');

          let res = $('<img/>');
          this.onerror = "";
          _this.isError = true;

          if (Modernizr.svg) {
            res.width = 150;
            res.height = 150;

            let iEDB64 = window.btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='${res.width}px' height='${res.height}px'>
                                              <circle cx ='${res.width / 2}' cy ='${res.width / 2}' r='${res.width / 2}' fill='#333'/>
                                              <text text-anchor='middle' x='${res.width / 2}' y='${res.width / 2}' 
                                              style='fill:#f6f6f6; font-weight:bold; font-size:10px; font-family:Arial, Helvetica, sans-serif; dominant-baseline:central'>${_this.errorTxt}</text>
                                          </svg>`);
            res.attr('src', "data:image/svg+xml;base64," + iEDB64);
          }
          _this.instanceVC.detach();
          _this.instance.append(res);
          dfd.resolve();
        });
      }).promise();
    }

    addLoader() {
      return $(this.instance).prepend(this.loader.getInstance());
    }

    removeLoader() {
      let loader = $(this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
        this.instanceVC.fadeIn();
      }
    }
  }

  class OBIFrame extends OBItemSlide {
    instanceIFC;
    instanceIFrame;

    constructor(element) {
      super(element);

      this.instanceIFC = $(`<div class="ob-overbox-display" style = "background-color: #000;">
                                <iframe frameborder="0" allowfullscreen width="100%" height="100%" style = "background: #000;"></iframe>
                            </div>`);
      this.instanceIFrame = this.instanceIFC.find('iframe');
      this.instance.append(this.instanceIFC);

      this.init();
    }

    init() {
      this.instanceIFrame.attr('src', '//about:blank');
      this.instanceIFC.hide();
      this.addLoader();

      $.when(this.load()).done(() => {
        this.removeLoader();
        this.fitSize();
      });
    }

    load() {
      return $.Deferred(dfd => this.instanceIFrame.on('load', () => dfd.resolve()).attr('src', this.url)).promise();
    }

    fitSize() {
      let cHeight = this.instance.height(),
        cWidth = this.instance.width(),
        ratio = this.width / this.height,
        ratioC;

      if (this.height <= cHeight && this.width <= cWidth) {
        this.instanceIFC.css({
          'width': this.width,
          'height': this.height
        });
      } else {
        if (this.height > cHeight && this.width <= cWidth) {
          this.instanceIFC.css({
            'width': cHeight * ratio,
            'height': cHeight
          });
        }

        if (this.height < cHeight && this.width > cWidth) {
          this.instanceIFC.css({
            'width': cWidth,
            'height': cWidth / ratio
          });
        }

        if (this.height > cHeight && this.width > cWidth) {
          ratioC = cWidth / cHeight;

          if (ratioC < ratio) {
            if (ratio > 1) {
              this.instanceIFC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            } else {
              this.instanceIFC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            }
          } else {
            if (ratio > 1) {
              this.instanceIFC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            } else {
              this.instanceIFC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            }
          }
        }
      }
    }

    resize() {
      return this.fitSize();
    }

    addLoader() {
      return $(this.instance).prepend(this.loader.getInstance());
    }

    removeLoader() {
      let loader = $(this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
        this.instanceIFC.fadeIn();
      }
    }
  }

  class OBAjax extends OBItemSlide {
    instanceAjax;

    constructor(element) {
      super(element);

      this.instanceAjax = $(`<div class="ob-overbox-display ob-overbox-display-ajax">&nbsp;</div>`);
      this.instance.append(this.instanceAjax);


      this.init();
    }

    init() {
      this.instanceAjax.hide();
      this.addLoader();

      $.when(this.loadAjax()).done(result => {
        this.removeLoader();
        this.instance.find('div').html(result);
      });
    }

    loadAjax() {
      let _this = this,
        dObj = $.Deferred(dfd => {
          $.ajax({
            url: _this.url,
            success: result => dfd.resolve(result),
            error: () => {
              let res = $('<img/>');

              if (Modernizr.svg) {
                res.width = 150;
                res.height = 150;

                let iEDB64 = window.btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='${res.width}px' height='${res.height}px'>
                                              <circle cx ='${res.width / 2}' cy ='${res.width / 2}' r='${res.width / 2}' fill='#333'/>
                                              <text text-anchor='middle' x='${res.width / 2}' y='${res.width / 2}' 
                                              style='fill:#f6f6f6; font-weight:bold; font-size:10px; font-family:Arial, Helvetica, sans-serif; dominant-baseline:central'>${_this.errorTxt}</text>
                                          </svg>`);
                res.attr('src', "data:image/svg+xml;base64," + iEDB64);
              }
              _this.instance.removeClass('ob-overbox-display');
              res.addClass('ob-overbox-display');
              dfd.resolve(res);
            }
          });
        }).promise();

      return dObj;
    }

    resize() {
      //      return this.fitSize();
    }

    addLoader() {
      return $(this.instance).prepend(this.loader.getInstance());
    }

    removeLoader() {
      let loader = $(this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
        this.instanceAjax.fadeIn();
      }
    }
  }

  class OBImage extends OBItemSlide {
    isLoaded = false;
    isError = false;
    isEnlarged = false;
    instanceImage;

    constructor(element) {
      super(element);

      this.instanceImage = $(`<img class="ob-overbox-display" src=${this.url} />`).hide();
      this.instance.append(this.instanceImage);

      this.init();
    }

    init() {
      if (!this.isLoaded) {
        this.addLoader();

        $.when(this.preloadImage()).done(() => {
          this.removeLoader();
          this.fitSize();
        });
      }
    }

    preloadImage() {
      let _this = this;

      return $.Deferred(dfd => {
        $('<img/>')
          .on('load', function () { //Arrow function expression does not have its own bindings to this, => using a traditional function expression
            _this.width = this.width;
            _this.height = this.height;
            _this.isLoaded = true;

            dfd.resolve();
          })
          .on('error', function () {
            this.onerror = "";
            _this.isError = true;

            if (Modernizr.svg) {
              _this.width = 150;
              _this.height = 150;
              _this.isLoaded = true;

              let iEDB64 = window.btoa(`<svg xmlns='http://www.w3.org/2000/svg' width='${res.width}px' height='${res.width}px'>
                                              <circle cx ='${res.width / 2}' cy ='${res.width / 2}' r='${res.width / 2}' fill='#333'/>
                                              <text text-anchor='middle' x='${res.width / 2}' y='${res.width / 2}' 
                                              style='fill:#f6f6f6; font-weight:bold; font-size:10px; font-family:Arial, Helvetica, sans-serif; dominant-baseline:central'>${_this.errorTxt}</text>
                                          </svg>`);
              _this.url = "data:image/svg+xml;base64," + iEDB64;
              _this.instanceImage.attr('src', _this.url);
            }

            dfd.resolve();
          }).attr('src', _this.url);
      }).promise();
    }

    fitSize() {
      let widthCS = this.instance.width(),
        heightCS = this.instance.height(),
        wRatio = widthCS / this.width,
        hRatio = heightCS / this.height;

      this.instanceImage.removeClass('ob-overbox-fit-height ob-overbox-fit-width');
      this.instanceImage.addClass(wRatio > hRatio ? 'ob-overbox-fit-height' : 'ob-overbox-fit-width');
    }

    resize() {
      (this.isEnlarged === false) ? this.fitSize(): this.fullSize();
    }

    addLoader() {
      return $(this.instance).prepend(this.loader.getInstance());
    }

    removeLoader() {
      let loader = $(this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
        this.instanceImage.fadeIn();
      }
    }
  }

  class OBContainer {
    groups = [];
    defaults = {
      //GENERAL
      obOpenCloseType: 'obCorner', //obDoor, obAnimOCO, obHuge, obCntPush, obCorner
      obNavType: 'obPressAway', //obSlide, obSoftScale, obPressAway, obLetIn, obFortuneWheel
      posControlBar: 'right', //right, left
      //PAGINATION
      isPagEnabled: true,
      pagSeparator: '/',
      //INFORMATION
      isInfoEnabled: true,
      isInfiniteGroup: false,
      isKeypressEnabled: true,
      closeKeys: [27],
      prevKeys: [37],
      nextKeys: [39],
      infoKeys: [73],

      isDeepLinkingEnabled: false,
      dlGroupPrefix: 'overbox',
      dlObjectPrefix: 'object',

      iframeWidth: 640,
      iframeHeight: 390,
      videoWidth: 640,
      videoHeight: 390,
      videoErrorTxt: 'NO VIDEO',
      flashWidth: 640,
      flashHeight: 390,
      flashErrorTxt: 'Flash is not supported by your browser',
      imageErrorLoadTxt: 'NO IMAGE',
      ajaxErrorTxt: 'NO AJAX',

      destroy: false
    };

    constructor(element, options, selector) {
      this.processData(element, options, selector);
    }

    processData(element, options, selector) {
      let lEl,
        eGroup;

      element.options = options;
      element.config = $.extend(true, {}, this.defaults, options);

      lEl = this.createElement(element);
      lEl.id = 1;

      if ($(element).data('ob-group') !== undefined) {
        lEl.groupName = $(element).data('ob-group')
      } else {
        lEl.groupName = 'obgroup' + Math.floor((Math.random() * 10000) + 1);
        element.data('ob-group', lEl.groupName);
      }

      lEl.config = element.config;

      eGroup = $.grep(this.groups, (g, i) => g.name === lEl.groupName);

      if (eGroup.length > 0) {
        lEl.id += eGroup[0].list[eGroup[0].list.length - 1].id;
        eGroup[0].register(lEl);
      } else {
        this.groups.push(new OVGroup(lEl, (this.groups.length + 1), selector));
      }
    }

    createElement(element) {
      let object;

      switch ($(element).data('ob-type')) {
        case 'iframe':
          object = new OBIFrame(element);
          break;
        case 'ajax':
          object = new OBAjax(element);
          break;
        case 'video':
        case 'flash':
          object = new OBVideo(element);
          break;
        case 'image':
        default:
          object = new OBImage(element);
          break;
      }

      return object;
    }
  }

  class OverBox {
    group;

    constructor(elements, group) {
      this.group = group;

      this.setup();
      this.initEvents();

      let listElemGrouped = $.grep(elements, (e, i) => $(e).data('ob-group') === this.group.name);

      $.each(listElemGrouped, (index, el) => this.initElementsEvents(el, (index + 1)));
    }

    setup() {
      let _this = this;

      _this.obContainer = $(
        `<div class="overbox ob-overbox-cnt">
            <div class="ob-overbox-controls-cnt-768">
                <div class="ob-overbox-control-close ob-overbox-area-close">
                    <div class="ob-icon ob-icon-close">&nbsp;</div>
                </div>
            </div>
            <div class="ob-overbox-main-cnt">
                <div class="ob-overbox-slides-cnt"></div>
            </div>
            <div class="ob-overbox-info-controls-cnt">
                <div class="ob-overbox-info-cnt">
                    <div class="ob-overbox-info">
                        <div class="ob-overbox-control-pagination">
                            <span class="pagCurPos"></span> <span class="pagSeparator"></span> <span class="pagTotPos"></span>
                        </div>
                        <div class="ob-overbox-info-caption"></div>
                    </div>
                </div>
                <div class="ob-overbox-controls-cnt">
                    <div class="ob-overbox-control-close">
                        <div class="ob-icon ob-icon-close">&nbsp;</div>
                    </div>
                    <div class="ob-overbox-control-pagination">
                        <span class="pagCurPos"></span> <span class="pagSeparator"></span> <span class="pagTotPos"></span>
                    </div>
                    <div class="ob-overbox-control-next">
                        <div class="ob-icon ob-icon-next">&nbsp;</div>
                    </div>
                    <div class="ob-overbox-control-prev">
                        <div class="ob-icon ob-icon-prev">&nbsp;</div>
                    </div>
                    <div class="ob-overbox-control-info">
                        <div class="ob-icon ob-icon-information">
                            <div>i</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);

      _this.obControlsCnt768 = _this.obContainer.find('.ob-overbox-controls-cnt-768');

      _this.obMainContainer = _this.obContainer.find('.ob-overbox-main-cnt');
      _this.obSlidesContainer = _this.obMainContainer.find('.ob-overbox-slides-cnt');

      _this.obInfoControlsContainer = _this.obContainer.find('.ob-overbox-info-controls-cnt');
      _this.obInfoContainer = _this.obInfoControlsContainer.find('.ob-overbox-info-cnt');
      _this.obInfoCap = _this.obInfoContainer.find('.ob-overbox-info-caption');

      _this.obClose = _this.obContainer.find('.ob-icon-close');
      _this.obPrev = _this.obContainer.find('.ob-icon-prev');
      _this.obNext = _this.obContainer.find('.ob-icon-next');
      _this.obInfo = _this.obContainer.find('.ob-icon-information');
      _this.obContainerCtrs = _this.obInfoControlsContainer.find('.ob-overbox-controls-cnt');

      _this.obPagArea = $(`<div class="ob-overbox-area-pag">
                            <div class="ob-icon">
                                <div class="ob-overbox-control-pagination">
                                    <span class="pagCurPos"/> <span class="pagSeparator"/> <span class="pagTotPos"/>
                                </div>
                            </div>
                           </div>`);

      if (!_this.group.config.isInfoEnabled && _this.group.config.isPagEnabled) {
        _this.obControlsCnt768.append(_this.obPagArea);
      }

      _this.obPag = _this.obContainer.find('.ob-overbox-control-pagination');
      _this.obPagCurPos = _this.obPag.find('.pagCurPos');
      _this.obPagSeparator = _this.obPag.find('.pagSeparator');
      _this.obPagTotPos = _this.obPag.find('.pagTotPos');
      _this.obPagInfo = _this.obInfoContainer.find('.ob-overbox-control-pagination');

      _this.currentSlide = 0;
      _this.resizeTimer = 0;
      _this.tpStart = {
        x: 0,
        y: 0
      };
      _this.tpEnd = {
        x: 0,
        y: 0
      };
      _this.hashCntData = {
        groupId: -1,
        elId: -1
      };
      _this.isHashNavigate = false;

      if (_this.group.config.posControlBar === 'right') {
        _this.obMainContainer.addClass('ob-overbox-container-right');
        _this.obInfoContainer.addClass('ob-overbox-container-right');
        _this.obContainerCtrs.addClass('ob-pos-right');
        _this.obControlsCnt768.addClass('ob-close-right');
      } else {
        _this.obMainContainer.addClass('ob-overbox-container-left');
        _this.obInfoContainer.addClass('ob-overbox-container-left');
        _this.obContainerCtrs.addClass('ob-pos-left');
        _this.obControlsCnt768.addClass('ob-close-left');
      }

      _this.group.list.forEach(element => _this.obSlidesContainer.append(element.getInstance()));
      _this.obSlides = _this.obSlidesContainer.find('.ob-overbox-slide');
      _this.calcItemSlides();
    }

    initEvents() {
      let _this = this;

      _this.obClose.on('click.overbox', _this, event => event.data.toggleOB());
      _this.obPrev.on('click.overbox', _this, event => event.data.navigate('previous'));
      _this.obNext.on('click.overbox', _this, event => event.data.navigate('next'));
      _this.obMainContainer.on('touchstart.overbox', _this, event => event.data.obMainContainer.removeClass('.ob-no-touch'));
      _this.obSlidesContainer.on('touchstart.overbox', _this, event => event.data.touchStart());
      _this.obSlidesContainer.on('touchmove.overbox', _this, event => event.data.touchMove());
      _this.obSlidesContainer.on('touchend.overbox', _this, event => event.data.touchEnd());

      if (_this.group.config.isInfoEnabled === true) {
        _this.obSlidesContainer.on('click.overbox', _this, event => event.data.toggleInfo());
        _this.obInfo.on('click.overbox', _this, event => event.data.toggleInfo());
      } else {
        _this.obSlidesContainer.on('click.overbox', _this, event => event.data.toggleAreaCtrs());
      }

      if (_this.group.config.isKeypressEnabled === true) {
        $(document).on('keydown.overbox', _this, event => {
          let _this = event.data;

          if (_this.group.config.closeKeys.indexOf(event.which) > -1) { //esc
            _this.toggleOB(event, 'esc');
          }
          if (_this.group.config.prevKeys.indexOf(event.which) > -1 && (_this.group.list.length > 1)) { //<-
            _this.navigate('previous');
          }

          if (_this.group.config.nextKeys.indexOf(event.which) > -1 && (_this.group.list.length > 1)) { //->
            _this.navigate('next');
          }

          if (_this.group.config.isInfoEnabled === true && _this.group.config.infoKeys.indexOf(event.which) > -1) {
            _this.toggleInfo();
          }
        });
      }
      $(window).on('resize', _this, (event) => {
        let _this = event.data;

        if (!_this.obContainer.hasClass('ob-open')) {
          return;
        }
        clearTimeout(_this.resizeTimer);
        _this.resizeTimer = setTimeout(() => {
          _this.resize();
        }, 100);
      });

      if (_this.group.config.isDeepLinkingEnabled === true) {

        $(window).on('hashchange.overbox', _this, event => event.data.getHash());

        $(() => {
          let _this = this;
          _this.getHash();

          if (_this.isHashNavigate === false && _this.hashCntData.groupId !== -1 && _this.hashCntData.elId !== -1) {
            _this.toggleOB();
          }
        });
      };
    }

    initElementsEvents(element, id) {
      $(element).on('click.overbox', {
        context: this,
        id: id
      }, event => event.data.context.toggleOB(event));
    }

    calcItemSlides() {
      this.obSlidesContainer.css('width', 'calc(' + 100 * this.group.list.length + '%)');
      this.obSlides.css('width', 'calc(' + 100 / this.group.list.length + '%)');
    }

    setupPagination() {
      if (this.group.config.isPagEnabled === false) {
        return;
      }

      this.obPagCurPos.text(this.currentSlide + 1);
      this.obPagSeparator.text(this.group.config.pagSeparator);
      this.obPagTotPos.text(this.group.list.length);
    }

    resize() {
      let _this = this;
      const mediaMax768 = '(max-width: 768px)',
        isInfoOpened = this.obInfoControlsContainer.hasClass('ob-open-info');

      if (isInfoOpened) {
        if (window.matchMedia(mediaMax768).matches) {
          gsap.set($(_this.obInfoContainer), {
            height: '10rem',
            width: '100%'
          });

          gsap.set($(_this.obMainContainer), {
            height: 'calc(100% - 10rem)',
            width: '100%'
          });
        } else {
          gsap.set($(_this.obInfoContainer), {
            width: '20rem',
            height: '100%'
          });

          gsap.set($(_this.obMainContainer), {
            width: 'calc(100% - 23.75rem)',
            height: '100%'
          });
        }

      } else {
        if (window.matchMedia(mediaMax768).matches) {
          gsap.set($(_this.obInfoContainer), {
            height: '0',
            width: '100%'
          });
          gsap.set($(_this.obMainContainer), {
            height: '100%',
            width: '100%'
          });
        } else {
          gsap.set($(_this.obInfoContainer), {
            width: '0',
            height: '100%'
          });
          gsap.set($(_this.obMainContainer), {
            width: 'calc(100% - 3.75rem)',
            height: '100%'
          });
        }

      }

      _this.group.list.forEach(slide => slide.resize());
    }

    navigate(direction) {
      //'next', 'previous'
      if (!this.obContainer.hasClass('ob-open')) {
        return;
      }

      let _this = this,
        duration = direction === undefined ? 0 : 0.5,
        nextSlide = _this.currentSlide,
        timeline = gsap.timeline(),
        tweenArr = [],
        isInfoOpened = _this.obInfoControlsContainer.hasClass('ob-open-info');

      if (direction === 'next' && _this.currentSlide < (_this.group.list.length - 1)) {
        nextSlide++;
      }
      if (direction === 'previous' && _this.currentSlide > 0) {
        nextSlide--;
      }
      _this.currentSlide = nextSlide;

      if (_this.group.list[_this.currentSlide].type === 'video') {
        _this.group.list[_this.currentSlide].resize();
      }

      tweenArr.push(gsap.to($(_this.obSlidesContainer), {
        x: nextSlide === 0 ? 0 : (-(100 / _this.obSlides.length) * nextSlide + '%'),
        duration: duration,
        onComplete: () => {
          if (_this.currentSlide === 0) {
            _this.obPrev.addClass('ob-icon-disabled');
          }
          if (_this.currentSlide === _this.obSlides.length - 1) {
            _this.obNext.addClass('ob-icon-disabled');
          }

          if (_this.currentSlide > 0 && _this.currentSlide < _this.obSlides.length - 1) {
            _this.obPrev.removeClass('ob-icon-disabled');
            _this.obNext.removeClass('ob-icon-disabled');
          }
          _this.setupPagination();

          if (isInfoOpened) {
            _this.setInformation();

            gsap.fromTo($(_this.obInfoCap), {
              opacity: 0
            }, {
              duration: 0.5,
              opacity: 1
            });
          }
        }
      }));

      if (isInfoOpened) {
        tweenArr.push(gsap.fromTo($(_this.obInfoCap), {
          opacity: 1
        }, {
          duration: 0.5,
          opacity: 0
        }));
      }

      timeline.add(tweenArr, 0);
    }

    toggleAreaCtrs() {
      let _this = this;


    }

    setInformation() {
      let _this = this;

      _this.obInfoCap.html(_this.group.list[_this.currentSlide].getInformation());
    }

    toggleInfo() {
      if (!this.obContainer.hasClass('ob-open')) {
        return;
      }
      const mediaMax768 = '(max-width: 768px)',
        duration = 0.5,
        isInfoOpened = this.obInfoControlsContainer.hasClass('ob-open-info');

      let _this = this,
        tweenClose,
        tweenInfoContainer,
        tweenInfo,
        tweenMain,
        complete = () => {
          isInfoOpened ? _this.obInfoControlsContainer.removeClass('ob-open-info') : _this.obInfoControlsContainer.addClass('ob-open-info');
        },
        timeline = gsap.timeline();


      if (!isInfoOpened) {
        _this.setInformation();
      }

      if (isInfoOpened) {
        tweenInfo = gsap.fromTo($(_this.obInfoCap), {
          opacity: 1
        }, {
          duration: 0.5,
          opacity: 0
        });
        tweenClose = gsap.fromTo($(_this.obControlsCnt768), {
          opacity: 1
        }, {
          duration: 0.5,
          opacity: 0
        });

        if (window.matchMedia(mediaMax768).matches) {
          tweenInfoContainer = gsap.fromTo($(_this.obInfoContainer), {
            height: '10rem',
          }, {
            duration: duration,
            height: '0',
            onComplete: complete
          });
          tweenMain = gsap.fromTo($(_this.obMainContainer), {
            height: 'calc(100% - 10rem)',
          }, {
            duration: duration,
            height: '100%',
          });
        } else {
          tweenInfoContainer = gsap.fromTo($(_this.obInfoContainer), {
            width: '20rem'
          }, {
            duration: duration,
            width: '0',
            onComplete: complete
          });
          tweenMain = gsap.fromTo($(_this.obMainContainer), {
            width: 'calc(100% - 23.75rem)'
          }, {
            duration: duration,
            width: 'calc(100% - 3.75rem)'
          });
        }

        timeline.add(tweenInfo, 0)
          .add([tweenInfoContainer, tweenMain], '>');
      } else {
        tweenClose = gsap.fromTo($(_this.obControlsCnt768), {
          opacity: 0
        }, {
          duration: 0.5,
          opacity: 1
        });
        tweenInfo = gsap.fromTo($(_this.obInfoCap), {
          opacity: 0
        }, {
          duration: 0.5,
          opacity: 1
        });

        if (window.matchMedia(mediaMax768).matches) {
          tweenInfoContainer = gsap.fromTo($(_this.obInfoContainer), {
            height: '0',
            width: '100%'
          }, {
            duration: duration,
            height: '10rem',
            width: '100%',
            onComplete: complete
          });

          tweenMain = gsap.fromTo($(_this.obMainContainer), {
            height: '100%',
            width: '100%'
          }, {
            duration: duration,
            height: 'calc(100% - 10rem)',
            width: '100%'
          });
        } else {
          tweenInfoContainer = gsap.fromTo($(_this.obInfoContainer), {
            width: '0',
            height: '100%'
          }, {
            duration: duration,
            width: '20rem',
            height: '100%',
            onComplete: complete
          });

          tweenMain = gsap.fromTo($(_this.obMainContainer), {
            width: 'calc(100% - 3.75rem)',
            height: '100%'
          }, {
            duration: duration,
            width: 'calc(100% - 23.75rem)',
            height: '100%'
          });
        }

        timeline.add([tweenInfoContainer, tweenMain], 0)
          .add(tweenInfo, '>');
      }
    }

    toggleControls() {
      let _this = this;

      if (_this.group.list.length < 2) {
        _this.obPrev.parent().hide();
        _this.obNext.parent().hide();
        _this.obPagArea.hide();
        _this.obPag.attr('style', 'display: none !important');
        _this.obPagInfo.attr('style', 'display: none !important');
      } else {
        _this.obPrev.parent().show();
        _this.obNext.parent().show();
        _this.obPagArea.show();
        _this.obPag.show();
        _this.obPagInfo.show();
        _this.obNext.removeClass('ob-icon-disabled');
        _this.obPrev.removeClass('ob-icon-disabled');

        if (_this.group.config.isInfiniteGroup === false) {
          if (_this.currentSlide === (_this.group.list.length - 1)) {
            _this.obNext.addClass('ob-icon-disabled');
          }

          if (_this.currentSlide === 0) {
            _this.obPrev.addClass('ob-icon-disabled');
          }
        }
      }
      _this.group.config.isInfoEnabled === false ? _this.obInfo.hide() : _this.obInfo.show();
    }

    toggleOB(event, action) {
      let _this = this,
        timeline = gsap.timeline();

      if (event !== undefined) {
        event.preventDefault();
      }

      if (_this.obContainer.hasClass('ob-open')) { //close

        timeline.add(gsap.fromTo($(_this.obSlides[_this.currentSlide]), {
          scale: 1,
          opacity: 1
        }, {
          duration: 1,
          scale: 0.8,
          opacity: 0
        })).add(gsap.fromTo($(_this.obContainer), {
          opacity: 1
        }, {
          duration: 0.8,
          opacity: 0,
          onComplete: () => {
            if (_this.obInfoControlsContainer.hasClass('ob-open-info')) {
              _this.toggleInfo();
            }
            gsap.set($(_this.obSlides), {
              scale: 1,
              opacity: 1
            });
            _this.dlSetup('close');
            _this.obContainer.removeClass('ob-open ob-close').detach();
            $('body').removeClass('ob-noscroll');
          }
        }));

      } else if (!_this.obContainer.hasClass('ob-close')) { //open

        if (action === 'esc') {
          return;
        }

        if (event !== undefined) {
          let eventDataId = event.data ? event.data.id : 0;
          _this.currentSlide = --eventDataId;
        } else {
          if (_this.hashCntData.groupId !== _this.group.id) {
            return;
          }
          _this.currentSlide = _this.hashCntData.elId;
        }

        $('body').addClass('ob-noscroll');
        $('body').append($(_this.obContainer));
        $(_this.obContainer).addClass('ob-open');

        timeline.add(gsap.fromTo($(_this.obContainer), {
          opacity: 0
        }, {
          duration: 0.8,
          opacity: 1
        })).add(gsap.fromTo($(_this.obSlides[_this.currentSlide]), {
          scale: 0.8,
          opacity: 0
        }, {
          duration: 1,
          scale: 1,
          opacity: 1
        }));
        
        _this.navigate();

        _this.dlSetup('open');
        _this.toggleControls();
      }
    }

    touchStart(event) {
      let _this = this;
      event.preventDefault();

      if (event.originalEvent.touches.length == 1) {
        _this.tpStart.x = event.originalEvent.touches[0].pageX;
        _this.tpEnd.x = _this.tpStart.x;
        _this.tpStart.y = event.originalEvent.touches[0].pageY;
        _this.tpEnd.y = _this.tpStart.y;
      }
    }

    touchMove(event) {
      let _this = this;

      event.preventDefault();

      if (event.originalEvent.touches.length == 1) {
        _this.tpEnd.x = event.originalEvent.touches[0].pageX;
        _this.tpEnd.y = event.originalEvent.touches[0].pageY;
      }
    }

    touchEnd(event) {
      let _this = this;

      if (_this.tpEnd.x === _this.tpStart.x && _this.tpEnd.y === _this.tpStart.y) {
        _this.obSlidesContainer.trigger('click.overbox', event);
        return;
      }

      event.preventDefault();
      // By default the navigation is horizontal => is checked the difference between x's
      if (_this.tpStart.x - _this.tpEnd.x > 10) {
        _this.navigate('next');
      }
      if (_this.tpStart.x - _this.tpEnd.x < -10) {
        _this.navigate('previous');
      }
    }

    setHash(action) {
      let _this = this;

      window.location.replace(('' + window.location).split('#')[0] + '#' + _this.group.config.dlGroupPrefix +
        _this.group.id + '/' + _this.group.config.dlObjectPrefix + (_this.currentSlide + 1));
    }

    getHash() {
      let _this = this;

      let hash = window.location.hash;

      if (hash) {
        let hData = hash.split('/');

        if (hData.length < 2)
          return;

        _this.hashCntData.groupId = parseInt(hData[0].replace('#' + _this.group.config.dlGroupPrefix, '')) || -100;
        _this.hashCntData.elId = parseInt(hData[1].replace('' + _this.group.config.dlObjectPrefix, '')) || -100;

        if (_this.hashCntData.elId !== -100)
          _this.hashCntData.elId = _this.hashCntData.elId - 1;

        if (!(_this.hashCntData.elId >= 0 && _this.hashCntData.elId < _this.group.list.length))
          _this.hashCntData.elId = -1;
      }
    }

    clearHash() {
      let _this = this;

      if ('pushState' in history) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    }

    dlSetup(action) {
      let _this = this;

      if (_this.group.config.isDeepLinkingEnabled === false)
        return;

      switch (action) {
        case 'open':
          _this.setHash();
          break;
        case 'navigate':
          _this.isHashNavigate = true;
          _this.setHash();
          break;
        case 'close':
          _this.isHashNavigate = false;
          _this.clearHash();
          break;
      };
    }
  }

  $.fn.overbox = function (selector, options) {
    let elements = this.toArray();

    if (options === undefined || options.destroy === undefined) {
      elements.forEach(element => {
        let instance = $(document.body).data('oboverboxcnt');

        if (!instance) {
          $(document.body).data('oboverboxcnt', new OBContainer(element, options, selector));
        } else {
          instance.processData(element, options, selector);
        }
      });
    }

    let instance = $(document.body).data('oboverboxcnt');

    instance.groups.forEach(group => {
      if (group.state === 'new') {
        let iOB = $.data(this, 'oboverbox');

        if (!iOB) {
          $.data(this, 'oboverbox' + group.name, new OverBox(elements, group));
        }
        group.state = 'updated';
      }
      if (group.state === 'updated' && (options !== undefined && options.destroy === true) && group.selector === selector) {
        delete options.destroy;

        group.config = $.extend(true, {}, group.config, options);
      }
    });
  };
})(jQuery, window, document);
