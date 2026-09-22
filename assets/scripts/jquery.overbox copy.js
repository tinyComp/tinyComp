/*!
 * VERSION: 1.1
 * DATE: 2015-08-03
 * DOCS AT: http://www.tinycomp.net/
 * 
 * @license Copyright (c) 2014-2015, tinyComp. All rights reserved.
 * 
 * @author: tinyComp, tinycomp@outlook.com
 **/

(function ($, window, document, undefined) {
  'use strict';

  let Modernizr = window.Modernizr;

  function OVGroup(element, id, selector) {
    let _this = this;

    //properties
    _this.name = element.groupName;
    _this.id = id;
    _this.selector = selector;
    _this.options = element.options;
    _this.config = element.config;
    _this.state = 'new'; //updated
    _this.isFirstInit = false;
    _this.list = [element];

    //methods
    _this.register = element => _this.list.push(element)
  }

  function OVSlideFactory() {
    let _this = this;

    _this.createSlide = element => {
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
    let _this = this;

    //methods
    _this.init = () => {
      this.obLoadingClass = (Modernizr.csstransforms == true) ? 'ob-loading3' : 'ob-loading';
      this.obLoading = $("<div class='ob-ploading'><div class='" + this.obLoadingClass + "'></div></div>");
    };
    _this.getInstance = () => this.obLoading;

    //call
    this.init();
  }

  function OBItemSlide(element) {
    let _this = this;

    //properties
    _this.groupName = $(element).data('ob-group');
    _this.type = $(element).data('ob-type') || 'image';
    _this.url = $(element).attr('href');
    _this.errorTxt = '';
    _this.width = 0;
    _this.height = 0;

    switch (_this.type) {
      case 'iframe':
        _this.width = parseInt($(element).data('ob-width'), 10) || element.config.iframeWidth || 0;
        _this.height = parseInt($(element).data('ob-height'), 10) || element.config.iframeHeight || 0;
        break;
      case 'ajax':
        _this.errorTxt = element.config.ajaxErrorTxt;
        break;
      case 'video':
      case 'flash':
        _this.errorTxt = element.config.flashErrorTxt;
        if (_this.type === 'video') {
          _this.width = parseInt($(element).data('ob-width'), 10) || element.config.videoWidth || 0;
          _this.height = parseInt($(element).data('ob-height'), 10) || element.config.videoHeight || 0;
        } else {
          _this.width = parseInt($(element).data('ob-width'), 10) || element.config.flashWidth || 0;
          _this.height = parseInt($(element).data('ob-height'), 10) || element.config.flashHeight || 0;
        }
        break;
      case 'image':
        _this.errorTxt = element.config.imageErrorLoadTxt;
      default:
        break;
    }
    _this.instance;
    _this.isloaded = false;
    _this.info = $(element).data('ob-info') || '';
    _this.loader = new OBLoader();

    //methods
    _this.setup = () => this.instance = $(`<div class="ob-overbox-slide"></div>`);
    _this.getInstance = () => this.instance;
    _this.getInformation = () => this.info;

    //call
    _this.setup();
  }

  function OBVideo(element) {
    let _this = this;
    OBItemSlide.call(_this, element);

    //properties
    _this.formats = $(element).data('ob-formats') || [];
    _this.poster = $(element).data('ob-poster') || '';
    _this.instanceVC; // video container || flash container
    _this.instanceVideo;

    //methods
    _this.setupVideo = () => {
      let _this = this;

      if (_this.type === 'video') {
        _this.instanceVC = $(`<div class="ob-overbox-display" style = "background-color: #000;">
          <video controls preload style="width: 100%; height: 100%;" poster="` + _this.poster + `"/>
          </div>`);
        _this.instanceVideo = _this.instanceVC.find('video');
        _this.instance.append(_this.instanceVC);

        _this.formats.unshift(_this.url);

        _this.formats.forEach(format => {
          switch (format.split('.').pop()) {
            case 'webm':
              _this.instanceVideo.append('<source src="' + format + '" type="video/webm" />');
              break;
            case 'ogv':
              _this.instanceVideo.append('<source src="' + format + '" type="video/ogg" />');
              break;
            case 'mp4':
              _this.instanceVideo.append('<source src="' + format + '" type="video/mp4" />');
              break;
            case 'swf':
              _this.instanceVideo.append('<object type="application/x-shockwave-flash" width="100%" height="100%" data="' + format + '">' +
                '<param name="movie" value="' + format + '"> ' +
                '<param name="allowfullscreen" value="true">' +
                '<param name="loop" value="false">' +
                '<param name="wmode" value="transparent" />' +
                '</object>');
              break;
          }
        });
      } else {
        _this.instance = $(`<div class="ob-overbox-display" style = "background-color: #333;">
            <object type="application/x-shockwave-flash" width="100%" height="100%" data="` + _this.url + `">
              <param name="movie" value="` + _this.url + `">
              <param name="allowfullscreen" value="true">
              <param name="loop" value="false">
              <param name="wmode" value="transparent" />
              <div class="ob-flash-error"><p>` + _this.errorTxt + `</p></div>
            </object>
          </div>`);
        _this.instanceVC = _this.instance.find('div');
        _this.instanceVideo = _this.instanceVC.find('object');
        _this.instance.append(_this.instanceVC);
      }
    }
    _this.init = () => this.fitSize();
    _this.fitSize = () => {
      let _this = this,
        cHeight = _this.instance.height(),
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
    }
    _this.resize = () => this.fitSize();

    //call
    _this.setupVideo();
  }
  OBVideo.prototype = Object.create(OBItemSlide);

  function OBIFrame(element) {
    let _this = this;

    OBItemSlide.call(_this, element);

    //methods
    _this.setupIFrame = () => {
      let _this = this;

      _this.instanceIFC = $(`<div class="ob-overbox-display" style = "background-color: #000;">
        <iframe frameborder="0" allowfullscreen width="100%" height="100%" style = "background: #000;"></iframe>
        </div>`);
      _this.instanceIFrame = _this.instanceIFC.find('iframe');

      _this.instance.append(_this.instanceIFC);
    }
    _this.init = () => {
      let _this = this;

      _this.instanceIFrame.attr('src', '//about:blank');

      $.when(_this.load()).done(() => {
        _this.removeLoader();
        _this.fitSize();
      });
    }
    _this.load = () => $.Deferred((dfd) => this.instanceIFrame.on('load', () => dfd.resolve()).attr('src', this.url)).promise();
    _this.resize = () => this.fitSize();

    _this.fitSize = () => {
      let _this = this,
        cHeight = _this.instance.height(),
        cWidth = _this.instance.width(),
        ratio = _this.width / _this.height;

      if (_this.height <= cHeight && _this.width <= cWidth) {
        _this.instanceIFC.css({
          'width': _this.width,
          'height': _this.height
        });
      } else {
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
    }

    _this.addLoader = () => $(this.instance).prepend(this.loader.getInstance());
    _this.removeLoader = () => {
      let _this = this,
        loader = $(_this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
      }
    }

    //call
    _this.setupIFrame();
    _this.init();
  }
  OBIFrame.prototype = Object.create(OBItemSlide);

  function OBAjax(element) {
    let _this = this;

    OBItemSlide.call(_this, element);

    //methods
    _this.setupAjax = () => {
      let _this = this;

      _this.instanceAjax = $(`<div class="ob-overbox-display ob-overbox-display-ajax">&nbsp;</div>`);
      _this.instance.append(_this.instanceAjax);
    }
    _this.init = () => {
      let _this = this;

      _this.addLoader();

      $.when(_this.loadAjax()).done(result => {
        _this.removeLoader();
        _this.instance.find('div').html(result);
      });
    }
    _this.loadAjax = () => {
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
    }
    _this.resize = () => this.fitSize();
    _this.fitSize = () => {
      let _this = this; //TODO
    }
    _this.addLoader = () => $(this.instance).prepend(this.loader.getInstance());
    _this.removeLoader = () => {
      let _this = this,
        loader = $(_this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
      }
    }

    //call
    _this.setupAjax();
    _this.init();
  }
  OBAjax.prototype = Object.create(OBItemSlide);

    
  function OBImage(element) {
    let _this = this;

    OBItemSlide.call(_this, element);

    //properties
    _this.isLoaded = false;
    _this.isError = false;
    _this.isEnlarged = false;

    //methods
    _this.setupImage = () => {
      let _this = this;

      _this.instanceImage = $('<img class="ob-overbox-display" src=' + _this.url + ' /> ').hide();
      _this.instance.append(_this.instanceImage);
    }
    _this.init = () => {
      let _this = this;

      if (!_this.isLoaded) {
        _this.addLoader();

        $.when(_this.preloadImage()).done(() => {
          _this.removeLoader();
          _this.fitSize();
        });
      }
    }
    _this.resize = () => (this.isEnlarged === false) ? this.fitSize() : this.fullSize();
    _this.preloadImage = () => {
      let _this = this;

      return $.Deferred(dfd => {
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
    }
    _this.addLoader = () => $(this.instance).prepend(this.loader.getInstance());
    _this.removeLoader = () => {
      let _this = this,
        loader = $(_this.instance).find('.ob-ploading');

      if (loader.length) {
        loader.remove();
        _this.instanceImage.fadeIn();
      }
    }
    _this.fitSize = () => {
      let _this = this,
        widthCS = _this.instance.width(),
        heightCS = _this.instance.height(),
        wRatio = widthCS / _this.width,
        hRatio = heightCS / _this.height;

      _this.instanceImage.removeClass('ob-overbox-fit-height ob-overbox-fit-width');
      _this.instanceImage.addClass(wRatio > hRatio ? 'ob-overbox-fit-height' : 'ob-overbox-fit-width');
    }
    //call
    _this.setupImage();
    _this.init();
  }
  OBImage.prototype = Object.create(OBItemSlide);

  function OBContainer(element, options, selector) {
    let _this = this;

    //properties
    _this.groups = [];
    _this.ovSlideFactory = new OVSlideFactory();

    //methods
    _this.processData = (element, options, selector) => {
      let _this = this,
        lEl,
        eGroup;

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

    //call
    _this.processData(element, options, selector);
  }

  function OverBox(elements, group) {
    let _this = this;

    //properties
    _this.group = group;

    //methods
    _this.setup = () => {
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

        console.log('hello pagination');
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
      },
      _this.initEvents = () => {
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

        _this.obMainContainer.on('touchstart.overbox', _this, (event) => {
          let _this = event.data;
          _this.obMainContainer.removeClass('.ob-no-touch');
        });

        _this.obSlidesContainer.on('touchstart.overbox', _this, (event) => {
          let _this = event.data;
          _this.touchStart();
        });

        _this.obSlidesContainer.on('touchmove.overbox', _this, (event) => {
          let _this = event.data;
          _this.touchMove();
        });

        _this.obSlidesContainer.on('touchend.overbox', _this, (event) => {
          let _this = event.data;
          _this.touchEnd();
        });

        if (_this.group.config.isInfoEnabled === true) {
          _this.obSlidesContainer.on('click.overbox', _this, (event) => {
            let _this = event.data;
            _this.toggleInfo();
          });
          _this.obInfo.on('click.overbox', _this, (event) => {
            let _this = event.data;
            _this.toggleInfo();
          });
        } else {
          _this.obSlidesContainer.on('click.overbox', _this, (event) => {
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

          if (!_this.obContainer.hasClass('ob-open')) {
            return;
          }
          clearTimeout(_this.resizeTimer);
          _this.resizeTimer = setTimeout(function () {
            console.log('resize');
            _this.resize();
          }, 100);
        });

        if (_this.group.config.isDeepLinkingEnabled === true) {

          $(window).on('hashchange.overbox', _this, (event) => {
            let _this = event.data;
            _this.getHash();
          });

          $(() => {
            let _this = this;
            _this.getHash();

            if (_this.isHashNavigate === false && _this.hashCntData.groupId !== -1 && _this.hashCntData.elId !== -1) {
              _this.toggleOB();
            }
          });
        };
      }
    _this.initElementsEvents = (element, id) => {
      $(element).on('click.overbox', {
        context: this,
        id: id
      }, (event) => {
        let _this = event.data.context;
        _this.toggleOB(event);
      });
    }
    _this.calcItemSlides = () => {
      let _this = this;
      _this.obSlidesContainer.css('width', 'calc(' + 100 * _this.group.list.length + '%)');
      _this.obSlides.css('width', 'calc(' + 100 / _this.group.list.length + '%)');
    }
    _this.setupPagination = () => {
      let _this = this;

      if (_this.group.config.isPagEnabled === false)
        return;

      _this.obPagCurPos.text(_this.currentSlide + 1);
      _this.obPagSeparator.text(_this.group.config.pagSeparator);
      _this.obPagTotPos.text(_this.group.list.length);
    }
    _this.resize = () => {
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
    _this.navigate = (direction) => {
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

      tweenArr.push(gsap.to($(_this.obSlidesContainer), {
        x: nextSlide === 0 ? 0 : (-(100 / _this.obSlides.length) * nextSlide + '%'),
        duration: duration,
        onComplete: () => {
          _this.currentSlide = nextSlide;

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
    _this.toggleAreaCtrs = () => {
      let _this = this;


    }
    _this.setInformation = () => {
      let _this = this;

      _this.obInfoCap.html(_this.group.list[_this.currentSlide].getInformation());
    }
    _this.toggleInfo = () => {
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
          console.log('hello');
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
    _this.toggleControls = () => {
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
    _this.toggleOB = (event, action) => {
      let _this = this,
        tweenArr = [],
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
    _this.touchStart = (event) => {
      let _this = this;
      event.preventDefault();

      if (event.originalEvent.touches.length == 1) {
        _this.tpStart.x = event.originalEvent.touches[0].pageX;
        _this.tpEnd.x = _this.tpStart.x;
        _this.tpStart.y = event.originalEvent.touches[0].pageY;
        _this.tpEnd.y = _this.tpStart.y;
      }
    }
    _this.touchMove = (event) => {
      let _this = this;

      event.preventDefault();

      if (event.originalEvent.touches.length == 1) {
        _this.tpEnd.x = event.originalEvent.touches[0].pageX;
        _this.tpEnd.y = event.originalEvent.touches[0].pageY;
      }
    }
    _this.touchEnd = (event) => {
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
    _this.setHash = (action) => {
      let _this = this;

      window.location.replace(('' + window.location).split('#')[0] + '#' + _this.group.config.dlGroupPrefix +
        _this.group.id + '/' + _this.group.config.dlObjectPrefix + (_this.currentSlide + 1));
    }
    _this.getHash = () => {
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
    _this.clearHash = () => {
      let _this = this;

      if ('pushState' in history) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    }
    _this.dlSetup = (action) => {
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

    //call
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
