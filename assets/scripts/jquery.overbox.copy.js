/*!
 * VERSION: 1.1
 * DATE: 2015-08-03
 * DOCS AT: http://www.tinycomp.net/
 * 
 * @license Copyright (c) 2014-2015, tinyComp. All rights reserved.
 * 
 * @author: tinyComp, tinycomp@outlook.com
 **/
;
(function ($, window, document, undefined) {
  'use strict';

  let Modernizr = window.Modernizr;

  function OVGroup(element, id, selector) {
    this.name = element.groupName;
    this.id = id;
    this.selector = selector;
    this.options = element.options;
    this.config = element.config;
    this.state = 'new'; //updated
    this.isFirstInit = false;
    this.list = [element];
    this.register = function (element) {
      this.list.push(element);
    }
  }

  function OVSlideFactory() {}
  OVSlideFactory.prototype = {
    createSlide: function (element) {

      switch ($(element).data('ob-type')) {
        case 'iframe':
          OVSlideFactory.prototype.slideClass = OBIFrame;
          break;
        case 'ajax':
          OVSlideFactory.prototype.slideClass = OBAjax;
          break;
        case 'video':
        case 'flash':
          OVSlideFactory.prototype.slideClass = OBVideo;
          break;
        case 'image':
        default:
          OVSlideFactory.prototype.slideClass = OBImage;
          break;
      }

      return new this.slideClass(element);
    }
  }

  function OBLoader() {
    this.init();
  }
  OBLoader.prototype = {
    init: function () {
      this.obLoadingClass = (Modernizr.csstransforms == true) ? 'ob-loading3' : 'ob-loading';
      this.obLoading = $("<div class='ob-ploading'><div class='" + this.obLoadingClass + "'></div></div>");
    },
    getInstance: function () {
      return this.obLoading;
    }
  };

  function OBVideo(element) {
    let _this = this;

    _this.type = $(element).data('ob-type') || 'video';
    _this.url = $(element).attr('href');
    _this.groupName = $(element).data('ob-group');
    if (_this.type === 'video') {
      _this.width = parseInt($(element).data('ob-width'), 10) || element.config.videoWidth || 0;
      _this.height = parseInt($(element).data('ob-height'), 10) || element.config.videoHeight || 0;
    } else {
      _this.width = parseInt($(element).data('ob-width'), 10) || element.config.flashWidth || 0;
      _this.height = parseInt($(element).data('ob-height'), 10) || element.config.flashHeight || 0;
      _this.errorTxt = element.config.flashErrorTxt;
    }
    _this.formats = $(element).data('ob-formats') || [];
    _this.poster = $(element).data('ob-poster') || '';
    _this.info = $(element).data('ob-info') || '';
    _this.instance;
    _this.instanceVC; // video container || flash container
    _this.instanceVideo;

    _this.setup();
  }
  OBVideo.prototype = {
    setup: function () {
      let _this = this;

      if (_this.type === 'video') {
        _this.instance = $('<div class="ob-overbox-cnt-slide">' +
          '<div class="ob-overbox-display" style = "background-color: #000;">' +
          '<video controls preload style="width: 100%; height: 100%;"' +
          'poster="' + _this.poster + '"/>' +
          '</div></div>');
        _this.instanceVC = _this.instance.find('div');
        _this.instanceVideo = _this.instanceVC.find('video');

        _this.formats.unshift(_this.url);
        $.each(_this.formats, function (i, v) {
          switch (v.split('.').pop()) {
            case 'webm':
              _this.instanceVideo.append('<source src="' + v + '" type="video/webm" />');
              break;
            case 'ogv':
              _this.instanceVideo.append('<source src="' + v + '" type="video/ogg" />');
              break;
            case 'mp4':
              _this.instanceVideo.append('<source src="' + v + '" type="video/mp4" />');
              break;
            case 'swf':
              _this.instanceVideo.append('<object type="application/x-shockwave-flash" width="100%" height="100%" data="' + v + '">' +
                '<param name="movie" value="' + v + '"> ' +
                '<param name="allowfullscreen" value="true">' +
                '<param name="loop" value="false">' +
                '<param name="wmode" value="transparent" />' +
                '</object>');
              break;
          }
        });
      } else {
        _this.instance = $('<div class="ob-overbox-cnt-slide">' +
          '<div class="ob-overbox-display" style = "background-color: #333;">' +
          '<object type="application/x-shockwave-flash" width="100%" height="100%" data="' + _this.url + '">' +
          '<param name="movie" value="' + _this.url + '"> ' +
          '<param name="allowfullscreen" value="true">' +
          '<param name="loop" value="false">' +
          '<param name="wmode" value="transparent" />' +
          '<div class="ob-flash-error"><p>' + _this.errorTxt + '</p></div>' +
          '</object>' +
          '</div></div>');
        _this.instanceVC = _this.instance.find('div');
        _this.instanceVideo = _this.instanceVC.find('object');
      }
    },
    init: function () {
      let _this = this;

      _this.fitSize();
    },
    fitSize: function () {
      let _this = this;
      let cHeight = _this.instance.height(),
        cWidth = _this.instance.width();

      if (_this.height <= cHeight &&
        _this.width <= cWidth) {
        _this.instanceVC.css({
          'width': _this.width,
          'height': _this.height
        });
      } else {
        let ratio = _this.width / _this.height;

        if (_this.height > cHeight &&
          _this.width <= cWidth) {
          _this.instanceVC.css({
            'width': cHeight * ratio,
            'height': cHeight
          });
        }

        if (_this.height < cHeight &&
          _this.width > cWidth) {
          _this.instanceVC.css({
            'width': cWidth,
            'height': cWidth / ratio
          });
        }

        if (_this.height > cHeight &&
          _this.width > cWidth) {
          let ratioC = cWidth / cHeight;
          if (ratioC < ratio) {
            if (ratio > 1) {
              _this.instanceVC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            } else {
              _this.instanceVC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            }
          } else {
            if (ratio > 1) {
              _this.instanceVC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            } else {
              _this.instanceVC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            }
          }
        }
      }
    },
    resize: function () {
      let _this = this;

      _this.fitSize();
    },
    getInstance: function () {
      return this.instance;
    },
    getInformation: function () {
      return this.info;
    }
  };

  function OBIFrame(element) {
    let _this = this;

    _this.type = $(element).data('ob-type') || 'iframe';
    _this.groupName = $(element).data('ob-group');
    _this.url = $(element).attr('href');
    _this.width = parseInt($(element).data('ob-width'), 10) || element.config.iframeWidth || 0;
    _this.height = parseInt($(element).data('ob-height'), 10) || element.config.iframeHeight || 0;
    _this.instance;
    _this.info = $(element).data('ob-info') || '';
    _this.loader = new OBLoader();

    _this.setup();
  }
  OBIFrame.prototype = {
    setup: function () {
      let _this = this;

      _this.instance = $('<div class="ob-overbox-cnt-slide">' +
        '<div class="ob-overbox-display" style = "background-color: #000;">' +
        '<iframe ' +
        'frameborder="0" allowfullscreen width="100%" height="100%" ' +
        'style = "background: #000;"' +
        '></iframe>' +
        '</div>' +
        '</div>');
      _this.instanceIFC = _this.instance.find('div'); //iframe container
      _this.instanceIFrame = _this.instanceIFC.find('iframe');
    },
    init: function () {
      let _this = this;

      _this.instanceIFrame.attr('src', '//about:blank');

      $.when(_this.load()).done(() => {
        _this.removeLoader();
        _this.fitSize();
      });
    },
    load: function () {
      let _this = this;

      return $.Deferred((dfd) => _this.instanceIFrame.on('load', () => dfd.resolve()).attr('src', _this.url)).promise();
    },
    resize: () => this.fitSize(),
    fitSize: function () {
      let _this = this;
      let cHeight = _this.instance.height();
      let cWidth = _this.instance.width();

      if (_this.height <= cHeight && _this.width <= cWidth) {
        _this.instanceIFC.css({
          'width': _this.width,
          'height': _this.height
        });
      } else {
        let ratio = _this.width / _this.height;

        if (_this.height > cHeight && _this.width <= cWidth) {
          _this.instanceIFC.css({
            'width': cHeight * ratio,
            'height': cHeight
          });
        }

        if (_this.height < cHeight && _this.width > cWidth) {
          _this.instanceIFC.css({
            'width': cWidth,
            'height': cWidth / ratio
          });
        }

        if (_this.height > cHeight && _this.width > cWidth) {
          let ratioC = cWidth / cHeight;

          if (ratioC < ratio) {
            if (ratio > 1) {
              _this.instanceIFC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            } else {
              _this.instanceIFC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            }
          } else {
            if (ratio > 1) {
              _this.instanceIFC.css({
                'width': cHeight * ratio,
                'height': cHeight
              });
            } else {
              _this.instanceIFC.css({
                'width': cWidth,
                'height': cWidth / ratio
              });
            }
          }
        }
      }
    },
    addLoader: function () {
      let _this = this;
      let cnt = _this.loader.getInstance();

      $(_this.instance).prepend(cnt);
    },
    removeLoader: function () {
      let _this = this;
      let loader = $(_this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
      }
    },
    getInformation: function () {
      let _this = this;

      return _this.info;
    },
    getInstance: function () {
      let _this = this;

      _this.fitSize();
      _this.addLoader();
      _this.instanceIFrame.attr('src', '//about:blank');

      return _this.instance;
    }
  }

  function OBAjax(element) {
    let _this = this;

    _this.type = $(element).data('ob-type');
    _this.groupName = $(element).data('ob-group');
    _this.url = $(element).attr('href');
    _this.width = 0;
    _this.height = 0;
    _this.instance;
    _this.errorTxt = element.config.ajaxErrorTxt;
    _this.info = $(element).data('ob-info') || '';
    _this.loader = new OBLoader();

    _this.setup();
  }
  OBAjax.prototype = {
    setup: function () {
      let _this = this;

      _this.instance = $('<div class="ob-overbox-cnt-slide">' +
        '<div class="ob-overbox-display ob-overbox-display-ajax">&nbsp;</div>' +
        '</div>');
    },
    init: function () {
      let _this = this;

      _this.addLoader();

      $.when(_this.loadAjax()).done((result) => {
        _this.removeLoader();
        _this.instance.find('div').html(result);
      });
    },
    loadAjax: function () {
      let _this = this;

      let dObj = $.Deferred((dfd) => {
        $.ajax({
          url: _this.url,
          success: (result) => dfd.resolve(result),
          error: () => {
            let res = $('<img/>');

            if (Modernizr.svg) {
              res.width = 150;
              res.height = 150;

              let iEDB64 = window.btoa("<svg xmlns='http://www.w3.org/2000/svg' width='" + res.width + "px' height='" + res.width + "px'><circle cx ='" + res.width / 2 + "' cy ='" + res.width / 2 + "' r='" + res.width / 2 + "' fill='#333'/><text text-anchor='middle' x='" + res.width / 2 + "' y='" + res.width / 2 + "' style='fill:#f6f6f6;font-weight:bold;font-size:10px;font-family:Arial,Helvetica,sans-serif;dominant-baseline:central'>" + _this.errorTxt + "</text></svg>");
              res.attr('src', "data:image/svg+xml;base64," + iEDB64);
            }
            _this.instance.removeClass('ob-overbox-display');
            res.addClass('ob-overbox-display');
            dfd.resolve(res);
          }
        });
      }).promise();

      return dObj;
    },
    resize: function () {
      let _this = this;
      _this.fitSize();
    },
    fitSize: function () {
      let _this = this; //TODO
    },
    addLoader: function () {
      let _this = this;

      let cnt = _this.loader.getInstance();
      $(_this.instance).prepend(cnt);
    },
    removeLoader: function () {
      let _this = this;
      let loader = $(_this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
      }
    },
    getInformation: function () {
      let _this = this;

      return _this.info;
    },
    getInstance: function () {
      let _this = this;

      return _this.instance;
    }
  }

  function OBImage(element) {
    let _this = this;

    _this.type = $(element).data('ob-type') || 'image';
    _this.groupName = $(element).data('ob-group');
    _this.url = $(element).attr('href');
    _this.width = 0;
    _this.height = 0;
    _this.instance;
    _this.isLoaded = false;
    _this.isError = false;
    _this.isEnlarged = false;
    _this.errorTxt = element.config.imageErrorLoadTxt;
    _this.info = $(element).data('ob-info') || '';
    _this.loader = new OBLoader();

    _this.setup();
  }
  OBImage.prototype = {
    setup: function () {
      let _this = this;

      _this.instance = $('<div class="ob-overbox-cnt-slide"> ' +
        '<img class="ob-overbox-display" src=' + _this.url + ' /> ' +
        '</div>');

      _this.instanceImage = _this.instance.find('img').hide();
    },
    init: function () {
      let _this = this;

      if (!_this.isLoaded) {
        _this.addLoader();

        $.when(this.preloadImage()).done(() => {
          _this.removeLoader();
          _this.fitSize();
        });
      }
    },
    resize: function () {
      let _this = this;

      (_this.isEnlarged === false) ? _this.fitSize(): _this.fullSize();
    },
    preloadImage: function () {
      let _this = this;

      return $.Deferred((dfd) => {
        $('<img/>')
          .on('load', () => {
            _this.width = this.width;
            _this.height = this.height;
            _this.isLoaded = true;

            dfd.resolve();
          })
          .on('error', () => {
            this.onerror = "";

            _this.isError = true;
            if (Modernizr.svg) {
              _this.width = 150;
              _this.height = 150;
              _this.isLoaded = true;

              let iEDB64 = window.btoa("<svg xmlns='http://www.w3.org/2000/svg' width='" + _this.width + "px' height='" + _this.width + "px'><circle cx ='" + _this.width / 2 + "' cy ='" + _this.width / 2 + "' r='" + _this.width / 2 + "' fill='#333'/><text text-anchor='middle' x='" + _this.width / 2 + "' y='" + _this.width / 2 + "' style='fill:#f6f6f6;font-weight:bold;font-size:10px;font-family:Arial,Helvetica,sans-serif;dominant-baseline:central'>" + _this.errorTxt + "</text></svg>");
              _this.url = "data:image/svg+xml;base64," + iEDB64;
              _this.instanceImage.attr('src', _this.url);
            }

            dfd.resolve();
          }).attr('src', _this.url);
      }).promise();
    },
    addLoader: function () {
      let _this = this;

      let cnt = _this.loader.getInstance();
      $(_this.instance).prepend(cnt);
    },
    removeLoader: function () {
      let _this = this;

      let loader = $(_this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
        _this.instanceImage.fadeIn();
      }
    },
    getInformation: function () {
      let _this = this;
      console.log(_this.info);
      return _this.info;
    },
    getInstance: function () {
      return this.instance;
    },
    fitSize: function () {
      let _this = this;

      let widthCS = _this.instance.width();
      let heightCS = _this.instance.height();
      let wRatio = widthCS / _this.width;
      let hRatio = heightCS / _this.height;

      _this.instanceImage.removeClass('ob-overbox-fit-height ob-overbox-fit-width');

      if (wRatio > hRatio) {
        _this.instanceImage.addClass('ob-overbox-fit-height');
      } else {
        _this.instanceImage.addClass('ob-overbox-fit-width');
      }
    },
    fullSize: function () {
      let _this = this;
    }
  }

  function OBContainer(element, options, selector) {
    let _this = this;

    _this.groups = [];
    _this.ovSlideFactory = new OVSlideFactory();
    _this.processData(element, options, selector);
  }
  OBContainer.prototype = {
    processData: function (element, options, selector) {
      let _this = this;
      let lEl;
      let eGroup;

      element.options = options;
      element.config = $.extend(true, {}, OverBox.defaults, options);

      lEl = _this.ovSlideFactory.createSlide(element);
      lEl.id = 1;

      if ($(element).data('ob-group') !== undefined) {
        lEl.groupName = $(element).data('ob-group')
      } else {
        lEl.groupName = 'obgroup' + Math.floor((Math.random() * 10000) + 1);
        element.data('ob-group', lEl.groupName);
      }

      lEl.config = element.config;

      eGroup = $.grep(_this.groups, (g, i) => g.name === lEl.groupName);

      if (eGroup.length > 0) {
        lEl.id += eGroup[0].list[eGroup[0].list.length - 1].id;
        eGroup[0].register(lEl);
      } else {
        _this.groups.push(new OVGroup(lEl, (_this.groups.length + 1), selector));
      }
    }
  }

  function OverBox(elements, group) {
    let _this = this;

    _this.group = group;
    _this.setup();
    _this.initEvents();

    let listElemGrouped = $.grep(elements, (e, i) => $(e).data('ob-group') === _this.group.name);

    $.each(listElemGrouped, (index, el) => _this.initElementsEvents(el, (index + 1)));
  }
  OverBox.defaults = {
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
    flashWidth: 640,
    flashHeight: 390,
    flashErrorTxt: 'Flash is not supported by your browser',
    imageErrorLoadTxt: 'NO IMAGE',
    ajaxErrorTxt: 'NO AJAX',

    destroy: false
  };

  OverBox.prototype = {
    setup: function () {
      let _this = this;

      _this.obArea = $(
        `<div class="overbox ob-overbox-area">
            <div class="ob-overbox-area-ctr">
                <div class="ob-overbox-control-close ob-overbox-area-close">
                    <div class="ob-icon ob-icon-close">&nbsp;</div>
                </div>
            </div>
            <div class="ob-overbox-container">
                <div class="ob-overbox-container-cnt"/>
                <div class="ob-overbox-container-info">
                    <div class="ob-overbox-control-pagination">
                        <span class="pagCurPos"/> <span class="pagSeparator"/> <span class="pagTotPos"/>
                    </div>
                    <div class="ob-overbox-info-caption"/>
                    <div class="ob-overbox-info-controls"/>
                </div>
            </div>
            <div class="ob-overbox-container-control">
                <div class="ob-overbox-control-close">
                    <div class="ob-icon ob-icon-close">&nbsp;</div>
                </div>
                <div class="ob-overbox-control-pagination">
                    <span class="pagCurPos"/> <span class="pagSeparator"/> <span class="pagTotPos"/>
                </div>
                <div class="ob-overbox-control-next">
                    <div class="ob-icon ob-icon-next">&nbsp;</div>
                </div>
                <div class="ob-overbox-control-prev">
                    <div class="ob-icon ob-icon-prev">&nbsp;</div>
                </div>
                <div class="ob-overbox-control-info">
                    <div class="ob-icon ob-icon-information"><div>i</div></div>
                </div>
            </div>
        </div>`);
      console.log($(_this.obArea)[0]);
      _this.obAreaCtrs = _this.obArea.find('.ob-overbox-area-ctr');
      _this.obCloseArea = _this.obAreaCtrs.find('.ob-overbox-area-close');
      _this.obContainer = _this.obArea.find('.ob-overbox-container');
      _this.obContainerCnt = _this.obContainer.find('.ob-overbox-container-cnt');
      _this.obCntSlides = _this.obContainerCnt.find('.ob-overbox-cnt-slide');

      _this.obContainerInfo = _this.obContainer.find('.ob-overbox-container-info');
      _this.obInfoCap = _this.obContainerInfo.find('.ob-overbox-info-caption');
      _this.obInfoCtrs = _this.obContainerInfo.find('.ob-overbox-info-controls');

      _this.obClose = _this.obArea.find('.ob-icon-close');
      _this.obPrev = _this.obArea.find('.ob-icon-prev');
      _this.obNext = _this.obArea.find('.ob-icon-next');
      _this.obInfo = _this.obArea.find('.ob-icon-information');
      _this.obContainerCtrs = _this.obArea.find('.ob-overbox-container-control');

      _this.obPagArea = $(`<div class="ob-overbox-area-pag">
                            <div class="ob-icon">
                                <div class="ob-overbox-control-pagination">
                                    <span class="pagCurPos"/> <span class="pagSeparator"/> <span class="pagTotPos"/>
                                </div>
                            </div>
                           </div>`);

      if (_this.group.config.isInfoEnabled === false && _this.group.config.isPagEnabled === true) {
        _this.obAreaCtrs.append(_this.obPagArea);
      }

      _this.obPag = _this.obArea.find('.ob-overbox-control-pagination');
      _this.obPagCurPos = _this.obPag.find('.pagCurPos');
      _this.obPagSeparator = _this.obPag.find('.pagSeparator');
      _this.obPagTotPos = _this.obPag.find('.pagTotPos');
      _this.obPagInfo = _this.obContainerInfo.find('.ob-overbox-control-pagination');

      _this.isAnimating = false;
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
        _this.obContainer.addClass('ob-overbox-container-right');
        _this.obContainerCtrs.addClass('ob-pos-right');
        _this.obContainerInfo.addClass('ob-cntr-info-right');
        _this.obAreaCtrs.addClass('ob-close-right');
      } else {
        _this.obContainer.addClass('ob-overbox-container-left');
        _this.obContainerCtrs.addClass('ob-pos-left');
        _this.obContainerInfo.addClass('ob-cntr-info-left');
        _this.obAreaCtrs.addClass('ob-close-left');
      }
      console.log($(_this.obArea)[0]);
    },
    initEvents: function () {
      let _this = this;

      _this.obClose.on('click.overbox', _this, (event) => {
        let _this = event.data;
        _this.toggleOB();
      });

      _this.obPrev.on('click.overbox', _this, (event) => {
        let _this = event.data;
        _this.navigate('previous');
      });
      _this.obNext.on('click.overbox', _this, (event) => {
        let _this = event.data;
        _this.navigate('next');
      });

      _this.obArea.on('touchstart.overbox', _this, (event) => {
        let _this = event.data;
        _this.obArea.removeClass('.ob-no-touch');
      });

      _this.obContainerCnt.on('touchstart.overbox', _this, (event) => {
        let _this = event.data;
        _this.touchStart();
      });

      _this.obContainerCnt.on('touchmove.overbox', _this, (event) => {
        let _this = event.data;
        _this.touchMove();
      });
      _this.obContainerCnt.on('touchend.overbox', _this, (event) => {
        let _this = event.data;
        _this.touchEnd();
      });

      if (_this.group.config.isInfoEnabled === true) {
        _this.obContainerCnt.on('click.overbox', _this, (event) => {
          let _this = event.data;
          _this.toggleInfo();
        });
        _this.obInfo.on('click.overbox', _this, (event) => {
          let _this = event.data;
          _this.toggleInfo();
        });
      } else {
        _this.obContainerCnt.on('click.overbox', _this, (event) => {
          let _this = event.data;
          _this.toggleAreaCtrs();
        });
      }
      if (_this.group.config.isKeypressEnabled === true) {
        $(document).on('keydown.overbox', _this, (event) => {
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

        if (!_this.obArea.hasClass('ob-open')) {
          return;
        }
        clearTimeout(_this.resizeTimer);
        _this.resizeTimer = setTimeout(() => _this.resize(), 100);
      });

      if (_this.group.config.isDeepLinkingEnabled === true) {

        $(window).on('hashchange.overbox', _this, (event) => {
          let _this = event.data;
          _this.getHash();
        });

        $(() => {
          let _this = this;
          console.log('hello ready');
        });
        // $(document).ready($.proxy(function () {
        //     let _this = this;

        //     _this.getHash();

        //     if (_this.isHashNavigate === false && _this.hashCntData.groupId !== -1 && _this.hashCntData.elId !== -1) {
        //         _this.toggleOB();
        //     }

        // }, _this));
      };
    },
    initElementsEvents: function (element, id) {
      $(element).on('click.overbox', {
        context: this,
        id: id
      }, (event) => {
        let _this = event.data.context;
        console.log('initElementsEvents');
        _this.toggleOB(event);
      });
    },
    setupContent: function (direction) {
      let _this = this;
      let cssClassInfoOpen;

      let el = _this.group.list[_this.cIEl];

      if (el.type !== 'iframe') {
        el.init();
      }

      _this.setupPagination();
      _this.setupInfo(el);

      cssClassInfoOpen = _this.obCntSlides.hasClass('ob-overbox-cnt-info-right') ?
        'ob-overbox-cnt-info-right' : _this.obCntSlides.hasClass('ob-overbox-cnt-info-left') ?
        'ob-overbox-cnt-info-left' : '';

      if (direction === 'previous') {
        $(el.getInstance()).prependTo(_this.obContainerCnt).addClass(cssClassInfoOpen);
      } else {
        $(el.getInstance()).appendTo(_this.obContainerCnt).addClass(cssClassInfoOpen);
      }

      _this.obCntSlides = _this.obContainerCnt.find('.ob-overbox-cnt-slide');

      if (direction === 'previous' || direction === 'next') {
        _this.obContainerCnt.css('width', '200%');
        _this.obCntSlides.css({
          'width': '50%',
          'height': '100%'
        });
        el.fitSize();
      } else {
        _this.obContainerCnt.css('width', '100%');
        _this.obCntSlides.css({
          'width': '100%',
          'height': '100%'
        });
        el.fitSize();
        _this.obCntSlides.eq(0).addClass('current');
      }
    },
    detachContent: function () {
      let _this = this;

      _this.obCntSlides.not('.current').removeClass('ob-overbox-cnt-info-right ob-overbox-cnt-info-left').detach();
      _this.obContainerCnt.css('width', '100%');
      _this.obCntSlides.css({
        'width': '100%',
        'height': '100%'
      });
      _this.obCntSlides = _this.obContainerCnt.find('.ob-overbox-cnt-slide');
    },
    setupPagination: function () {
      let _this = this;

      if (_this.group.config.isPagEnabled === false)
        return;

      _this.obPagCurPos.text(_this.cIEl + 1);
      _this.obPagSeparator.text(_this.group.config.pagSeparator);
      _this.obPagTotPos.text(_this.group.list.length);
    },
    setupInfo: (el) => this.obInfoCap.html(el.getInformation()),
    resize: () => this.group.list[_this.cIEl].resize(),
    navigate: function (direction) {
      if (this.isAnimating === true)
        return;

      if (!this.obArea.hasClass('ob-open')) //navigation is done only when overbox is open
        return;

      let _this = this;
      let currentSlideItem, nextSlideItem;

      if (direction === 'next') {
        if (_this.cIEl < _this.group.list.length - 1) {
          _this.cIEl = _this.cIEl + 1;
          if (_this.group.config.isInfiniteGroup === false) {
            if (_this.cIEl === 1)
              _this.obPrev.removeClass('ob-icon-disabled');
            if (_this.cIEl === (_this.group.list.length - 1))
              _this.obNext.addClass('ob-icon-disabled');
          }
        } else {
          if (_this.group.config.isInfiniteGroup)
            _this.cIEl = 0;
          else
            return;
        }
      } else if (direction === 'previous') {
        if (_this.cIEl > 0) {
          _this.cIEl = _this.cIEl - 1;

          if (_this.group.config.isInfiniteGroup === false) {
            if (_this.cIEl === (_this.group.list.length - 2))
              _this.obNext.removeClass('ob-icon-disabled');
            if (_this.cIEl === 0)
              _this.obPrev.addClass('ob-icon-disabled');
          }
        } else {
          if (_this.group.config.isInfiniteGroup)
            _this.cIEl = _this.group.list.length - 1;
          else
            return;
        }
      }
      _this.isAnimating = true;
      _this.setupContent(direction);

      if (direction === 'next') {
        currentSlideItem = _this.obCntSlides.eq(0);
        nextSlideItem = _this.obCntSlides.eq(1);
      } else if (direction === 'previous') {
        nextSlideItem = _this.obCntSlides.eq(0);
        currentSlideItem = _this.obCntSlides.eq(1);
      }

      _this.obAnimNav(currentSlideItem, nextSlideItem, direction);
    },
    toggleAreaCtrs: function () {
      let _this = this;

      if (_this.obAreaCtrs.hasClass('ob-open')) { //close
        gsap.to($(_this.obAreaCtrs), 0.3, {
          css: {
            opacity: 0
          }
        });
        _this.obAreaCtrs.removeClass('ob-open');
      } else { //open
        gsap.set($(_this.obAreaCtrs), {
          css: {
            opacity: 0
          }
        });
        gsap.to($(_this.obAreaCtrs), 0.3, {
          css: {
            opacity: 1
          }
        });
        _this.obAreaCtrs.addClass('ob-open');
      }
    },
    toggleInfo: function () {
      let _this = this;

      if (!_this.obArea.hasClass('ob-open')) {
        return;
      }

      const mediaMax768 = '(max-width: 768px)';
      let el = _this.group.list[_this.cIEl];
      //let cssClassInfoOpen = _this.group.config.posControlBar === 'left' ? 'ob-overbox-cnt-info-left' : 'ob-overbox-cnt-info-right';
      let cssClassInfoOpenLeft = {
        'padding-left': '20em'
      };
      let cssClassInfoOpenRight = {
        'padding-right': '20em'
      };
      let cssClassInfoOpenLeftMinus = {
        'padding-left': '0'
      };
      let cssClassInfoOpenRightMinus = {
        'padding-right': '0'
      };
      let cssClassInfoOpen = _this.group.config.posControlBar === 'left' ? cssClassInfoOpenLeft : cssClassInfoOpenRight;
      let cssClassInfoOpenMinus = _this.group.config.posControlBar === 'left' ? cssClassInfoOpenLeftMinus : cssClassInfoOpenRightMinus;

      let cssInfoOpenRight = {
        'right': '3.75em',
        'width': '20em',
        'padding': '5.75em 2.5em 0.5em 1.10em',
        'border-left': '0.15em solid #484848'
      };
      let cssInfoOpenLeft = {
        'left': '3.75em',
        'width': '20em',
        'padding': '5.75em 1.10em 0.5em 2.5em',
        'border-right': '0.15em solid #484848'
      };
      let cssInfoOpenRightMinus = {
        'right': '0',
        'width': '0',
        'padding': '0',
        'border-left': 'none'
      };
      let cssInfoOpenLeftMinus = {
        'left': '0',
        'width': '0',
        'padding': '0',
        'border-right': 'none'
      };
      let cssInfoOpen768 = {
        'right': '0',
        'height': '10em',
        'padding': '1em 0.5em 0.5em 1em',
        'border-left': '0',
        'border-top': '0.15em solid #484848'
      };
      let cssInfoOpen768Minus = {
        'right': '0',
        'height': '0',
        'padding': '0',
        'border-left': '0',
        'border-top': '0'
      };

      let cssToAdd = window.matchMedia(mediaMax768).matches ? cssInfoOpen768 : (_this.group.config.posControlBar === 'left' ? cssInfoOpenLeft : cssInfoOpenRight);
      let cssToExtract = window.matchMedia(mediaMax768).matches ? cssInfoOpen768Minus : (_this.group.config.posControlBar === 'left' ? cssInfoOpenLeftMinus : cssInfoOpenRightMinus);

      let clbkOpen = () => {
        gsap.to($(_this.obInfoCap), 0.3, {
          css: {
            opacity: 1
          }
        });
        gsap.to($(_this.obInfoCtrs), 0.3, {
          css: {
            opacity: 1
          }
        });
        gsap.to($(_this.obPagInfo), 0.3, {
          css: {
            opacity: 1
          }
        });
        gsap.to($(_this.obAreaCtrs), 0.3, {
          css: {
            opacity: 1
          }
        });
        el.fitSize();
        _this.obContainerInfo.addClass('ob-open');
      };
      let clbkClose = () => {
        gsap.to($(_this.obCntSlides), 0.5, {
          //className: "-=" + cssClassInfoOpen,
          css: cssClassInfoOpenMinus,
          onComplete: function () {
            el.fitSize();
          }
        });
        gsap.to($(_this.obContainerInfo), 0.5, {
          //className: "-=ob-overbox-ci-open"
          css: cssToExtract
        });
        _this.obContainerInfo.removeClass('ob-open');
      };

      if (_this.obContainerInfo.hasClass('ob-open')) { //close
        gsap.to($(_this.obAreaCtrs), 0.3, {
          css: {
            opacity: 0
          }
        });
        gsap.to($(_this.obInfoCap), 0.3, {
          css: {
            opacity: 0
          }
        });
        gsap.to($(_this.obPagInfo), 0.3, {
          css: {
            opacity: 0
          }
        });
        gsap.to($(_this.obInfoCtrs), 0.3, {
          css: {
            opacity: 0
          },
          onComplete: clbkClose
        });
      } else { //open
        gsap.set($(_this.obAreaCtrs), {
          css: {
            opacity: 0
          }
        });
        gsap.set($(_this.obInfoCap), {
          css: {
            opacity: 0
          }
        });
        gsap.set($(_this.obPagInfo), {
          css: {
            opacity: 0
          }
        });
        gsap.set($(_this.obInfoCtrs), {
          css: {
            opacity: 0
          }
        });

        gsap.to($(_this.obContainerInfo), 0.5, {
          //className: "+=ob-overbox-ci-open"
          css: cssToAdd
        });
        gsap.to($(_this.obCntSlides), 0.5, {
          //className: "+=" + cssClassInfoOpen,
          css: cssClassInfoOpen,
          onComplete: clbkOpen
        });
      }
    },
    toggleControls: function () {
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
          if (_this.cIEl === (_this.group.list.length - 1))
            _this.obNext.addClass('ob-icon-disabled');

          if (_this.cIEl === 0)
            _this.obPrev.addClass('ob-icon-disabled');
        }
      }

      if (_this.group.config.isInfoEnabled === false) {
        _this.obInfo.hide();
      } else {
        _this.obInfo.show();
      }

    },
    toggleOB: function (event, action) {
      let _this = this;

      if (event !== undefined) {
        event.preventDefault();
      }

      if (_this.obArea.hasClass('ob-open')) { //close
        _this.obAnimOCO('close');
      } else if (!_this.obArea.hasClass('ob-close')) { //open
        if (action === 'esc') {
          return;
        }

        if (event !== undefined) {
          let eventDataId = event.data ? event.data.id : 0;
          _this.cIEl = --eventDataId;
        } else {
          if (_this.hashCntData.groupId !== _this.group.id) {
            return;
          }

          _this.cIEl = _this.hashCntData.elId;
        }

        $('body').addClass('ob-noscroll');
        $('body').append($(_this.obArea));
        $(_this.obArea).addClass('ob-open');

        _this.toggleControls();
        _this.obAnimOCO('open');
      }
    },
    obAnimOCO: function (action) { //Animate Open/Close Overlay
      let _this = this;
      let callbackOpen = function () {
        if (_this.group.config.obOpenCloseType === 'obDoor') {
          _this.setupContent();
          gsap.set($(_this.obCntSlides.eq(0)), {
            opacity: 0
          });
        }
        _this.obCntSlides.attr('style', '');
        gsap.to($(_this.obCntSlides.eq(0)), 0.5, {
          opacity: 1,
          onComplete: function () {
            let el = _this.group.list[_this.cIEl];
            if (el.type === 'iframe') {
              el.init();
            }
          }
        });
        _this.dlSetup('open');
      };

      let callbackClose = function (event) {
        $(_this.obArea).attr('style', '');

        if (_this.obContainerInfo.hasClass('ob-open')) {
          _this.toggleInfo();
        }
        _this.obCntSlides.removeClass('current');
        _this.obContainerCnt.empty();
        _this.dlSetup('close');
        _this.obArea.removeClass('ob-open').removeClass('ob-close').detach();
        $('body').removeClass('ob-noscroll');
      };

      if (action === 'open') {
        switch (_this.group.config.obOpenCloseType) {
          case 'obDoor':
            gsap.set($(_this.obArea), {
              css: {
                width: 0,
                opacity: 0,
                left: '50%',
                xPercent: '-50%'
              }
            });
            let tlO = new TimelineLite();

            let tweenO1 = gsap.to($(_this.obArea), 0.4, {
              css: {
                width: '100%'
              }
            });
            let tweenO2 = gsap.to($(_this.obArea), 0.8, {
              css: {
                opacity: 1,
                clearProps: 'all'
              },
              onComplete: callbackOpen
            });
            tlO.add([tweenO2, tweenO1], 'start', 0.4);
            break;
          case 'obHuge':
            _this.setupContent();
            gsap.set($(_this.obCntSlides), {
              css: {
                transformPerspective: 1200,
                opacity: 0.4,
                yPercent: '-35%',
                rotationX: '35deg',
                scale: 0.7
              }
            });

            gsap.set($(_this.obArea), {
              css: {
                opacity: 0
              }
            });
            gsap.to($(_this.obArea), 0.5, {
              css: {
                opacity: 1,
                clearProps: 'all'
              },
              onComplete: callbackOpen
            });
            gsap.to($(_this.obCntSlides), 0.5, {
              css: {
                rotationX: 0,
                yPercent: 0,
                scale: 1
              }
            });
            break;
          case 'obCntScale':
            _this.setupContent();
            gsap.set($(_this.obArea), {
              css: {
                opacity: 0,
                yPercent: '100%',
              }
            });
            gsap.to($(_this.obArea), 0.5, {
              css: {
                opacity: 1,
                yPercent: 0
              },
              onComplete: callbackOpen
            });
            gsap.to($('body').children().not('.overbox'), 0.5, {
              css: {
                scale: 0.8
              }
            });
            break;
          case 'obCntPush':
            _this.setupContent();
            gsap.set($(_this.obArea), {
              css: {
                opacity: 0,
                xPercent: '-100%',
              }
            });
            gsap.to($('body').children().not('.overbox'), 0.5, {
              css: {
                xPercent: '100%'
              }
            });
            gsap.to($(_this.obArea), 0.5, {
              css: {
                opacity: 1,
                xPercent: 0,
                clearProps: 'all'
              },
              onComplete: callbackOpen
            });
            break;
          case 'obCorner':
            _this.setupContent();
            gsap.fromTo($(_this.obArea), 0.5, {
              css: {
                x: '50',
                y: '50',
                opacity: 0
              }
            }, {
              css: {
                x: '0',
                y: '0',
                opacity: 1,
                clearProps: 'all'
              },
              onComplete: callbackOpen
            });
            break;
          default:
            _this.setupContent();
            gsap.set($(_this.obArea), {
              css: {
                scale: 0.01,
                opacity: 0
              }
            });
            gsap.to($(_this.obArea), 0.6, {
              css: {
                scale: 1,
                opacity: 1
              },
              onComplete: callbackOpen
            });
            break;
        }
      }
      if (action === 'close') {
        switch (_this.group.config.obOpenCloseType) {
          case 'obDoor':
            gsap.to($(_this.obCntSlides), 0.4, {
              opacity: 0
            });

            let tlC = new TimelineLite({
              delay: 0.4
            });
            let tweenC1 = gsap.to($(_this.obArea), 0.4, {
              css: {
                opacity: 0
              }
            });
            let tweenC2 = gsap.to($(_this.obArea), 0.4, {
              css: {
                width: 0
              },
              onComplete: callbackClose
            });

            tlC.add([tweenC1, tweenC2], 'start', 0.8);
            break;
          case 'obHuge':
            gsap.to($(_this.obCntSlides), 0.5, {
              css: {
                transformPerspective: 1200,
                yPercent: '35%',
                rotationX: '-35deg',
                scale: 0.7,
                opacity: 0.4,
                clearProps: 'all'
              }
            });
            gsap.to($(_this.obArea), 0.6, {
              css: {
                opacity: 0,
                clearProps: 'all'
              },
              onComplete: callbackClose
            });
            break;
          case 'obCntScale':
            gsap.to($(_this.obArea), 0.5, {
              css: {
                opacity: 0,
                yPercent: '100%',
                clearProps: 'all'
              },
              onComplete: callbackClose
            });
            gsap.to($('body').children().not('.overbox'), 0.5, {
              css: {
                scale: 1,
                clearProps: 'all'
              }
            });
            break;
          case 'obCntPush':
            gsap.to($('body').children().not('.overbox'), 0.5, {
              css: {
                xPercent: '0',
                clearProps: 'all'
              }
            });
            gsap.to($(_this.obArea), 0.5, {
              css: {
                xPercent: '-100%',
                clearProps: 'all'
              },
              onComplete: callbackClose
            });
            break;
          case 'obCorner':
            gsap.to($(_this.obArea), 0.5, {
              css: {
                x: '50',
                y: '50',
                opacity: 0,
                clearProps: 'all'
              },
              onComplete: callbackClose
            });
            break;
          default:
            gsap.to($(_this.obArea), 0.6, {
              css: {
                scale: 0.01,
                opacity: 0,
                clearProps: 'all'
              },
              onComplete: callbackClose
            });
            break;
        }
      }
    },
    obAnimNav: function (current, next, direction) {
      let _this = this;

      let onEndAnimationCurrentItem = function () {
        current.removeClass('current');
      };
      let onEndAnimationNextItem = function () {
        next.addClass('current');
        _this.isAnimating = false;
        _this.detachContent();

        let el = _this.group.list[_this.cIEl];
        if (el.type === 'iframe') {
          el.init();
        }
        _this.dlSetup('navigate');
      };
      let tl = new TimelineLite();
      let tweenC;
      let tweenN;
      let cssNavOutNext;
      let cssNavOutPrev;
      let cssNavInNextFrom;
      let cssNavInNextTo;
      let cssNavInPrevFrom;
      let cssNavInPrevTo;

      switch (_this.group.config.obNavType) {
        case 'obPressAway':
          cssNavOutNext = {
            xPercent: '-100%',
            opacity: 0,
            scale: 0.9,
            clearProps: 'all'
          };
          cssNavOutPrev = {
            scale: 0.9,
            xPercent: '100%',
            opacity: 0,
            clearProps: 'all'
          };

          cssNavInNextFrom = {
            xPercent: '100%',
            opacity: 1,
            scale: 1
          };
          cssNavInNextTo = {
            xPercent: '0',
            opacity: 1,
            scale: 1
          };
          cssNavInPrevFrom = {
            xPercent: '-100%',
            opacity: 1,
            scale: 1
          };
          cssNavInPrevTo = {
            xPercent: '0',
            opacity: 1,
            scale: 1
          };

          tweenC = gsap.to($(current), 1.2, {
            css: direction === 'next' ? cssNavOutNext : cssNavOutPrev,
            onComplete: onEndAnimationCurrentItem
          });

          tweenN = gsap.fromTo($(next), 1.2, {
            css: direction === 'next' ? cssNavInNextFrom : cssNavInPrevFrom
          }, {
            css: direction === 'next' ? cssNavInNextTo : cssNavInPrevTo,
            onComplete: onEndAnimationNextItem
          });

          tl.add([tweenC, tweenN], "start", 0.2);
          break;
        case 'obSlide':
          cssNavOutNext = {
            scale: 0.7,
            xPercent: '-50%',
            opacity: 0,
            clearProps: 'all'
          };
          cssNavOutPrev = {
            scale: 0.7,
            xPercent: '50%',
            opacity: 0,
            clearProps: 'all'
          };

          cssNavInNextFrom = {
            scale: 0.7,
            opacity: 0.5,
            xPercent: '50%'
          };
          cssNavInNextTo = {
            scale: 1,
            opacity: 1,
            xPercent: '0%'
          };
          cssNavInPrevFrom = {
            scale: 0.7,
            opacity: 0.5,
            xPercent: '-50%'
          };
          cssNavInPrevTo = {
            scale: 1,
            opacity: 1,
            xPercent: '0%'
          };

          tweenC = gsap.to($(current), 0.8, {
            css: direction === 'next' ? cssNavOutNext : cssNavOutPrev,
            onComplete: onEndAnimationCurrentItem
          });
          gsap.set($(next), {
            css: direction === 'next' ? cssNavInNextFrom : cssNavInPrevFrom
          });
          tweenN = gsap.to($(next), 0.8, {
            css: direction === 'next' ? cssNavInNextTo : cssNavInPrevTo,
            onComplete: onEndAnimationNextItem
          });

          tl.add([tweenC, tweenN], "start", 0.5);
          break;
        case 'obSoftScale':
          cssNavOutNext = {
            opacity: 0,
            scale: 1.2,
            clearProps: 'all'
          };
          cssNavOutPrev = {
            opacity: 0,
            scale: 0.9,
            clearProps: 'all'
          };

          cssNavInNextFrom = {
            opacity: 0,
            scale: 0.9
          };
          cssNavInNextTo = {
            opacity: 1,
            scale: 1
          };
          cssNavInPrevFrom = {
            scale: 1.2
          };
          cssNavInPrevTo = {
            opacity: 1,
            scale: 1
          };

          tweenC = gsap.to($(current), 1, {
            css: direction === 'next' ? cssNavOutNext : cssNavOutPrev,
            onComplete: onEndAnimationCurrentItem
          });

          tweenN = gsap.fromTo($(next), 1, {
            css: direction === 'next' ? cssNavInNextFrom : cssNavInPrevFrom
          }, {
            css: direction === 'next' ? cssNavInNextTo : cssNavInPrevTo,
            onComplete: onEndAnimationNextItem
          });
          tl.add([tweenC, tweenN], "start", 0.2);
          break;
        case 'obFortuneWheel':
          gsap.set(_this.obContainerCnt, {
            perspective: '1600px'
          });

          cssNavOutNext = {
            xPercent: '-100%',
            scale: 0.9,
            opacity: 0,
            clearProps: 'all'
          };
          cssNavOutPrev = {
            xPercent: '100%',
            scale: 0.9,
            opacity: 0,
            clearProps: 'all'
          };

          cssNavInNextFrom = {
            transformOrigin: '0% 50%',
            rotationY: '65deg',
            xPercent: '100%',
            scale: 1
          };
          cssNavInNextTo = {
            opacity: 1,
            xPercent: '0',
            rotationY: '0',
            scale: 1
          };
          cssNavInPrevFrom = {
            transformOrigin: '100% 50%',
            xPercent: '-100%',
            rotationY: '-65deg',
            scale: 1
          };
          cssNavInPrevTo = {
            opacity: 1,
            xPercent: '0',
            rotationY: '0',
            scale: 1
          };

          tweenC = gsap.to($(current), 1, {
            css: direction === 'next' ? cssNavOutNext : cssNavOutPrev,
            onComplete: onEndAnimationCurrentItem
          });

          tweenN = gsap.fromTo($(next), 1, {
            css: direction === 'next' ? cssNavInNextFrom : cssNavInPrevFrom
          }, {
            css: direction === 'next' ? cssNavInNextTo : cssNavInPrevTo,
            onComplete: onEndAnimationNextItem
          });
          tl.add([tweenC, tweenN], "start", 0.2);
          break;
        case 'obLetIn':
          gsap.set(_this.obContainerCnt, {
            perspective: '1600px'
          });

          cssNavOutNext = {
            transformOrigin: '0% 50%',
            rotationY: '20deg',
            scale: 0.9,
            opacity: 0,
            clearProps: 'all'
          };
          cssNavOutPrev = {
            transformOrigin: '100% 0%',
            rotationY: '-20deg',
            zIndex: '0',
            scale: 0.9,
            opacity: 0,
            clearProps: 'all'
          };

          cssNavInNextFrom = {
            xPercent: '100%',
            zIndex: '3000',
            scale: 1,
            opacity: 1
          };
          cssNavInNextTo = {
            xPercent: '0',
            rotationY: '0deg',
            zIndex: '3000',
            scale: 1,
            opacity: 1
          };
          cssNavInPrevFrom = {
            xPercent: '-100%',
            zIndex: '3000',
            scale: 1,
            opacity: 1
          };
          cssNavInPrevTo = {
            xPercent: '0',
            rotationY: '0deg',
            zIndex: '3000',
            scale: 1,
            opacity: 1
          };

          tweenC = gsap.to($(current), 0.5, {
            css: direction === 'next' ? cssNavOutNext : cssNavOutPrev,
            onComplete: onEndAnimationCurrentItem
          });

          tweenN = gsap.fromTo($(next), 0.5, {
            css: direction === 'next' ? cssNavInNextFrom : cssNavInPrevFrom
          }, {
            css: direction === 'next' ? cssNavInNextTo : cssNavInPrevTo,
            onComplete: onEndAnimationNextItem
          });
          tl.add([tweenC, tweenN], "start", 0.2);

          break;
      }
    },
    touchStart: function (event) {
      let _this = this;
      event.preventDefault();

      if (event.originalEvent.touches.length == 1) {
        _this.tpStart.x = event.originalEvent.touches[0].pageX;
        _this.tpEnd.x = _this.tpStart.x;
        _this.tpStart.y = event.originalEvent.touches[0].pageY;
        _this.tpEnd.y = _this.tpStart.y;
      }
    },
    touchMove: function (event) {
      let _this = this;

      event.preventDefault();

      if (event.originalEvent.touches.length == 1) {
        _this.tpEnd.x = event.originalEvent.touches[0].pageX;
        _this.tpEnd.y = event.originalEvent.touches[0].pageY;
      }
    },
    touchEnd: function (event) {
      let _this = this;

      if (_this.tpEnd.x === _this.tpStart.x && _this.tpEnd.y === _this.tpStart.y) {
        _this.obContainerCnt.trigger('click.overbox', event);
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
    },
    setHash: function (action) {
      let _this = this;

      window.location.replace(('' + window.location).split('#')[0] + '#' + _this.group.config.dlGroupPrefix +
        _this.group.id + '/' + _this.group.config.dlObjectPrefix + (_this.cIEl + 1));
    },
    getHash: function () {
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
    },
    clearHash: function () {
      let _this = this;

      if ('pushState' in history) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    },
    dlSetup: function (action) {
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
  };

  $.fn.overbox = function (selector, options) {
    let elements = this;

    if (options === undefined || options.destroy === undefined) {
      elements.each(function () {
        let instance = $(document.body).data('oboverboxcnt');
        if (!instance) {
          $(document.body).data('oboverboxcnt', new OBContainer($(this), options, selector));
        } else {
          instance.processData($(this), options, selector);
        }
      });
    }

    let instance = $.data(document.body, 'oboverboxcnt');
    $.each(instance.groups, function (index, group) {
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
