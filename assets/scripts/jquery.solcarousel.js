/*!
 * VERSION: 1.0
 * DATE: 2021-05-11
 * DOCS AT: http://www.tinycomp.net/
 * 
 * @license Copyright (c) 2014-2021, tinyComp. All rights reserved.
 * 
 * @author: tinyComp, tinycomp@outlook.com
 **/
;
(function ($, window, document, undefined) {
  'use strict';

  let Modernizr = window.Modernizr;

  function CRLItemPanelFactory() {}
  CRLItemPanelFactory.prototype = {
    createItemPanel: function (el, config, id) {
      switch (el.find('a').data('crl-type')) {
        case 'iframe':
          CRLItemPanelFactory.prototype.itemPanelClass = CRLIFrame;
          break;
        case 'video':
          CRLItemPanelFactory.prototype.itemPanelClass = CRLVideo;
          break;
        case 'none':
          CRLItemPanelFactory.prototype.itemPanelClass = CRLItemPanel;
          break;
        case 'image':
        default:
          CRLItemPanelFactory.prototype.itemPanelClass = CRLImage;
          break;
      }

      return new this.itemPanelClass(el, config, id);
    }
  }

  function CRLCutter(el, totalLines) {
    let _this = this;

    //properties
    _this.instance = el;
    _this.inner;
    _this.elStyle = _this.instance.attr('style') || '';
    _this.ellipsis;
    _this.content;
    _this.heightContainer;
    _this.heightContent;
    _this.totalLines = totalLines;
    _this.coef = 1;
    _this.hasEllipses = false;

    //methods
    _this.init = function () {
      let _this = this;

      _this.content = _this.instance.contents().clone(true);

      if (_this.instance.css('word-wrap') !== 'break-word') {
        _this.instance.css('word-wrap', 'break-word');
      }

      if (_this.instance.css('white-space') === 'nowrap') {
        _this.instance.css('white-space', 'normal');
      }

      _this.ellipsis = $(document.createTextNode('\u2026')).wrap('<span/>').parent()
        .css({
          'display': 'inline',
          'height': 'auto',
          'width': 'auto',
          'border': 'none',
          'padding': 0,
          'margin': 0
        })
        .addClass('crlEll');
    };
    _this.cut = function () {
      let _this = this;

      _this.calcHeight();

      _this.inner = _this.instance.wrapInner('<div />').children()
        .css({
          'display': 'block',
          'height': 'auto',
          'width': 'auto',
          'border': 'none',
          'padding': 0,
          'margin': 0
        });
      _this.inner.empty().append(_this.content.clone(true));
      _this.heightContent = _this.inner.height();
      _this.hasEllipses = false;

      if (_this.heightContent > _this.heightContainer) {
        _this.cutN(_this.inner);

        if (_this.hasEllipses === false) {
          _this.inner.contents().append(_this.ellipsis);
        }
        _this.inner.contents().appendTo(_this.instance);
        _this.inner.remove();
      }
    };
    _this.cutN = function (pNodes) {
      let _this = this;

      let tmp;

      for (let i = pNodes.contents().length - 1; i >= 0; i--) {
        tmp = $(pNodes.contents()[i]).clone(true);

        //1. removing the last node
        $(pNodes.contents()[i]).remove();
        //2. adding the ellipses
        $(pNodes.contents()[i - 1]).append(_this.ellipsis);
        _this.hasEllipses = true;
        //3. check the height of the element
        _this.heightContent = Math.ceil(_this.inner.height());

        if (_this.heightContent <= _this.heightContainer) {
          $(pNodes.contents()).find('.crlEll').remove(); //removing the ellipses
          _this.hasEllipses = false;
          $(pNodes).append(tmp);
          //if content is smaller = > we need to add back the last removed node and cut it
          if ($(pNodes.contents()[i]).contents().length > 1) { //has node => we need to cutN
            _this.cutN($(pNodes.contents()[i]));
            if (pNodes.contents().length === 0) {
              $(pNodes).remove();
            }
          } else {
            _this.cutW($(pNodes.contents()[i]));
            if (_this.hasEllipses === false && pNodes.contents().length === 0) { //all the text from node was deleted
              $(pNodes).remove();
            }
          }
          break;
        }
      }

    };
    _this.cutW = function (pNode) {
      let _this = this;

      const txtSep = ' ';
      let nodeArr = pNode.text().split(txtSep);

      nodeArr.push('...');

      for (let i = nodeArr.length - 2; i >= 0; i--) {
        nodeArr.splice(nodeArr.length - 2, 1);
        let str = nodeArr.join(txtSep);
        pNode[0].nodeValue = str;
        _this.heightContent = Math.ceil(_this.inner.height());

        if (_this.heightContent <= _this.heightContainer) {
          _this.hasEllipses = true;
          return;
        }
      }
      pNode.remove();
      _this.hasEllipses = false;
    };
    _this.calcHeight = function () {
      let _this = this;

      let bpHeight = 0; //border + padding
      const arr = ['lineHeight', 'borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
      _this.coef = 1;
      _this.heightContainer = 1;

      for (let i = 0; i < arr.length; i++) {
        let v = window.getComputedStyle(_this.instance[0])[arr[i]];
        if (v.slice(-2) === 'px') {
          if (i === 0) {
            _this.heightContainer = _this.totalLines * parseFloat(v);
          } else {
            bpHeight = bpHeight + parseFloat(v)
          }
        }
      }
      _this.heightContainer = Math.ceil(_this.heightContainer);
      _this.instance.css('height', (_this.heightContainer + bpHeight) + 'px');
    };

    //call
    _this.init();
  };

  function CRLLoader(colorLoading) {
    let _this = this;

    //properties
    _this.color = colorLoading;

    //methods
    _this.init = function () {
      let _this = this;

      let c;
      _this.pLoadingClass = 'crl-ploading';
      _this.crlLoadingClass = (Modernizr.csstransforms === true) ? 'crl-loading3' : 'crl-loading';
      _this.crlLoading = $('<div class="' + _this.pLoadingClass + '"><div class="' + _this.crlLoadingClass + '"><div></div><div></div><div></div><div></div></div></div>');

      if (Modernizr.csstransforms === true) {
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(_this.color)) {
          c = _this.color.substring(1).split('');
          if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
          }
          _this.crlLoading.find('.' + _this.crlLoadingClass + ' div').css({
            'border-color': '#' + c.join('') + ' transparent transparent transparent'
          });
        }
      }
    };
    _this.getInstance = function () {
      return this.crlLoading;
    };
    _this.add = function (cntHide, cntToPrepend) {
      let _this = this;

      cntHide.hide();
      cntToPrepend.prepend(_this.getInstance());
    };
    _this.remove = function (cntShow, cntRemoveFrom) {
      let _this = this;

      cntShow.fadeIn();
      cntRemoveFrom.find('.' + _this.pLoadingClass).remove();
    };

    //call
    _this.init();
  };

  function CRLItemPanel(el, config, id) {
    let _this = this;
    let obj = el.find('a');

    //properties
    _this.id = id;
    _this.type = obj.data('crl-type') || 'image';
    _this.url = obj.attr('href');
    _this.link = obj.data('crl-link') || '';
    _this.title = obj.data('crl-title') || '';
    _this.text = obj.data('crl-text') || '';
    _this.instance;
    _this.showQuickView = config.showQuickView;
    _this.posQV = config.posQuickView.split("_");
    _this.vposQuickView = _this.posQV[0];
    _this.posQuickView = _this.posQV[1];
    _this.urlQuickView = obj.data('crl-url-qv') || '';
    _this.txtQuickViewBtn = config.txtQuickViewBtn;
    _this.errorTxtQuickView = config.txtQuickViewNotLoaded;
    _this.instanceQuickView;
    _this.vposMedia = config.vposMedia;

    _this.posItemTitle = config.posItemTitle;
    _this.isTitleCutted = config.isTitleCutted;
    _this.totalTitleLines = config.totalTitleLines;
    _this.cutterTitle;

    _this.posItemText = config.posItemText;
    _this.isTextCutted = config.isTextCutted;
    _this.totalTextLines = config.totalTextLines;
    _this.cutterText;

    _this.itemPanelHoverEfx = config.itemPanelHoverEfx;
    _this.itemPanelStyle = config.itemPanelStyle;

    _this.hasDeleteBtn = config.hasDeleteBtn;
    _this.posDeleteBtn = config.posDeleteBtn.split("_");
    _this.loader = new CRLLoader(config.colorLoading);

    //methods
    _this.setup = function () {
      let _this = this;

      let cssClass = '';
      _this.instance = $('<div class="crlItemPanel"></div>');
      _this.crlMedia = $('<div class="crlItemPanelMedia crlItemPanelOverlay"></div >');
      _this.crlBody = $('<div class="crlItemPanelBody"><h5 class="crlItemPanelTitle"></h5><p class="crlItemPanelText"></p></div>');
      _this.crlDelete = $('<i class="crlIcon crlIconDelete" aria-hidden="true"></i>');

      if (_this.hasDeleteBtn === true) {
        _this.posDeleteBtn[1] === 'left' ? _this.crlDelete.addClass('crlTL') : _this.crlDelete.addClass('crlRL');

        if (_this.type === 'none' || _this.posDeleteBtn[0] === 'item') {
          _this.instance.append(_this.crlDelete);
        } else {
          _this.crlMedia.append(_this.crlDelete);
        }
      }

      if (_this.vposMedia === 'top') {
        _this.instance.append(_this.crlMedia.addClass('crlTop')).append(_this.crlBody.addClass('crlBottom'));
      } else {
        _this.instance.append(_this.crlBody.addClass('crlTop')).append(_this.crlMedia.addClass('crlBottom'));
      }

      if (_this.link !== '') {
        _this.instance.wrapInner('<a href="' + _this.link + '"></a>');
      }

      if (_this.title === '' && _this.text === '') {
        _this.crlBody.remove();
      } else {
        _this.crlBody.hide();
        _this.crlItemPanelTitle = _this.crlBody.find('.crlItemPanelTitle');
        _this.crlItemPanelText = _this.crlBody.find('.crlItemPanelText');

        if (_this.title !== '') {
          cssClass = _this.posItemTitle === 'left' ? 'crlTextAlignLeft' : (_this.posItemTitle === 'right' ? 'crlTextAlignRight' : 'crlTextAlignCenter');
          _this.crlItemPanelTitle.html(_this.title).addClass(cssClass);

          if (_this.isTitleCutted) {
            _this.crlItemPanelTitle.attr('title', _this.title);
            _this.cutterTitle = new CRLCutter(_this.crlItemPanelTitle, _this.totalTitleLines);
          }
        } else {
          _this.crlItemPanelTitle.remove();
        }

        if (_this.text !== '') {
          cssClass = _this.posItemText === 'left' ? 'crlTextAlignLeft' : (_this.posItemText === 'right' ? 'crlTextAlignRight' : 'crlTextAlignCenter');
          _this.crlItemPanelText.html(_this.text).addClass(cssClass);

          if (_this.isTextCutted) {
            _this.cutterText = new CRLCutter(_this.crlItemPanelText, _this.totalTextLines);
          }
        } else {
          _this.crlItemPanelText.remove();
        }
      }

      if (_this.itemPanelStyle !== 'none') {
        _this.instance.addClass(_this.itemPanelStyle);
      }

      if (_this.showQuickView === true) {
        _this.crlQVBtnCnt = $('<div class="crlBtnCnt"><button class="crlBtn crlBtnColor" type="button">' + _this.txtQuickViewBtn + '</button></div>');
        _this.crlQuickViewBtn = _this.crlQVBtnCnt.find('.crlBtn');

        if (_this.vposQuickView === 'inner') {
          _this.crlHoverCntDiv = $('<div class="crlItemPanelOverlayCnt"><div></div></div>');
          _this.crlMedia.append(_this.crlHoverCntDiv);
          _this.crlHoverCnt = _this.crlHoverCntDiv.find('div');
          _this.crlHoverCntDiv.append(_this.crlQuickViewBtn);
        }

        if (_this.vposQuickView === 'top') {
          _this.instance.prepend(_this.crlQVBtnCnt.addClass('crlTop'));
        }

        if (_this.vposQuickView === 'bottom') {
          _this.instance.append(_this.crlQVBtnCnt.addClass('crlBottom'));
        }

        if (_this.vposQuickView !== 'inner') {
          if (_this.posQuickView === 'center') {
            _this.crlQuickViewBtn.addClass('crlHpc');
          }

          if (_this.posQuickView === 'right') {
            _this.crlQuickViewBtn.addClass('crlHpr');
          }
        } else {
          _this.crlQuickViewBtn.addClass('crlHpcIn');
        }
      }

      _this.initEvents();
      _this.setupQuickViewCnt();
    };
    _this.initEvents = function () {
      let _this = this;

      if (_this.showQuickView === true && _this.vposQuickView === 'inner') {

        _this.crlQuickViewBtn
          .mouseover(function () {
            _this.crlHoverCnt.addClass('crlHovered');
          })
          .mouseout(function () {
            _this.crlHoverCnt.removeClass('crlHovered');
          });
        _this.crlBody
          .mouseover(function () {
            _this.crlHoverCntDiv.addClass('crlHoveredDiv');
            _this.crlHoverCnt.addClass('crlHovered');
          })
          .mouseout(function () {
            _this.crlHoverCntDiv.removeClass('crlHoveredDiv');
            _this.crlHoverCnt.removeClass('crlHovered');
          });
      }
    };
    _this.getInstance = function () {
      return this.instance;
    };
    _this.getTitle = function () {
      return this.crlItemPanelTitle;
    };
    _this.getText = function () {
      return this.crlItemPanelText;
    };
    _this.setupQuickViewCnt = function () {
      this.instanceQuickView = $('<div class="crlQuickView">&nbsp;</div>');
    };
    _this.initQuickView = function () {
      let _this = this;

      if (_this.urlQuickView === '') {
        return;
      }
      _this.loader.add($(), _this.instanceQuickView);
      _this.loader.getInstance().addClass('crlHpt');

      $.when(_this.loadQuickView()).done(function (result) {
        setTimeout(function () {
          _this.loader.remove($(), _this.instanceQuickView);
          _this.instanceQuickView.hide().html(result).fadeIn();
        }, 0);
      });
    };
    _this.loadQuickView = function () {
      let _this = this;

      let dObj = $.Deferred(function () {
        let dfdBase = this;

        $.ajax({
          url: _this.urlQuickView,
          success: function (result) {
            dfdBase.resolve(result);
          },
          error: function () {
            let res = $('<img/>');
            if (Modernizr.svg) {
              const width = 200;
              const height = 200;

              const iEDB64 = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"><rect width="198" height="198" x="1" y="1" stroke="#d7d7d7" stroke-width="2" fill="transparent"/><text text-anchor="middle" x="' + width / 2 + '" y="' + height / 2 + '" style="fill:#c1c1c1;font-size:1rem;font-family:Arial,Helvetica,sans-serif;dominant-baseline:central">' + _this.errorTxtQuickView + '</text></svg>');
              res.attr('src', "data:image/svg+xml;base64," + iEDB64);
            }
            res.addClass('crlQuickViewError crlHpcIn');
            dfdBase.resolve(res);
          }
        });

      }).promise();

      return dObj;
    };
    _this.getInstanceQuickView = function () {
      return this.instanceQuickView;
    };
    _this.showBody = function () {
      this.crlBody.fadeIn();
    };

    //call
    _this.setup();
  };

  function CRLImage(el, config, id) {
    let _this = this;

    CRLItemPanel.call(_this, el, config, id);

    let obj = el.find('a');

    //properties
    _this.alt = obj.attr('crl-alt') || 'image';
    _this.errorTxt = config.txtImageNotLoaded;
    _this.state = 'new'; //new; loading; loaded; error;
    _this.dfdState = $.Deferred();
    _this.loader = new CRLLoader(config.colorLoading);

    //methods
    _this.setupImage = function () {
      let _this = this;

      _this.instanceImg = $('<img src="' + _this.url + '" alt="' + _this.alt + '"/>');
      _this.crlMedia.append(_this.instanceImg);


      if (_this.state === 'new') {
        _this.state = 'loading';
        _this.loader.add(_this.crlMedia.find('img'), _this.crlMedia);

        $.when(_this.preload()).done(function () {
          setTimeout(function () {
            if (_this.state === 'error') {
              _this.instance.find('img').attr('src', _this.url);
            }
            _this.loader.remove(_this.crlMedia.find('img'), _this.crlMedia);
            _this.dfdState.resolve();
          }, 0);
        });
      }
    };
    _this.preload = function () {
      let _this = this;

      return $.Deferred(
        function (dfd) {
          $('<img/>')
            .on('load', function () {
              _this.state = 'loaded';
              dfd.resolve();
            })
            .on('error', function () {
              this.onerror = '';

              _this.state = 'error';
              if (Modernizr.svg) {
                const width = 150;
                const height = 150;

                const iEDB64 = window.btoa('<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"><rect width="148" height="148" x="1" y="1" stroke="#d7d7d7" stroke-width="2" fill="transparent"/><text text-anchor="middle" x="' + width / 2 + '" y="' + height / 2 + '" style="fill:#c1c1c1;font-size:1rem;font-family:Arial,Helvetica,sans-serif;dominant-baseline:central">' + _this.errorTxt + '</text></svg>');
                _this.url = 'data:image/svg+xml;base64,' + iEDB64;
              }

              dfd.resolve();
            }).attr('src', _this.url);
        }).promise();
    };

    //call
    _this.setupImage();
  };
  CRLImage.prototype = Object.create(CRLItemPanel.prototype);

  function CRLIFrame(el, config, id) {
    let _this = this;
    let obj = el.find('a');

    CRLItemPanel.call(_this, el, config, id);

    //properties
    _this.width = parseInt(obj.data('crl-width'), 10) || config.iframeWidth || 0;
    _this.height = parseInt(obj.data('crl-height'), 10) || config.iframeHeight || 0;
    _this.instanceIFrame;
    _this.loader = new CRLLoader(config.colorLoading);
    //methods
    _this.setupIFrame = function () {
      let _this = this;

      _this.instanceIFrameCnt = $('<div style = "background-color: #000; max-width: ' + _this.width + 'px; max-height: ' + _this.height + 'px;">' +
        '<iframe frameborder="0" allowfullscreen width="100%" height="100%" style = "background: #000;"></iframe>' +
        '</div>');
      _this.instanceIFrame = _this.instanceIFrameCnt.find('iframe');

      _this.crlMedia.append(_this.instanceIFrameCnt);
    };
    _this.init = function () {
      let _this = this;

      _this.instanceIFrame.attr('src', '//about:blank');
      _this.loader.add(_this.instanceIFrameCnt, _this.crlMedia);
      $.when(_this.load()).done((result) => {
        setTimeout(() => {
          _this.loader.remove(_this.instanceIFrameCnt, _this.crlMedia);
        }, 0);
      });
    };
    _this.load = function () {
      let _this = this;

      return $.Deferred(
        function (dfd) {
          _this.instanceIFrame.on('load', () => {
            dfd.resolve();
          }).attr('src', _this.url);
        }
      ).promise();
    };

    //call
    _this.setupIFrame();
    _this.init();
  };
  CRLIFrame.prototype = Object.create(CRLItemPanel.prototype);

  function CRLVideo(el, config, id) {
    let _this = this;
    let obj = el.find('a');

    CRLItemPanel.call(_this, el, config, id);

    //properties
    _this.width = parseInt(obj.data('crl-width'), 10) || config.videoWidth || 0;
    _this.height = parseInt(obj.data('crl-height'), 10) || config.videoHeight || 0;
    _this.formats = obj.data('crl-formats') || [];
    _this.poster = obj.data('crl-poster') || '';

    _this.instanceVC;
    _this.instanceVideo;
    //methods
    _this.setupVideo = () => {
      let _this = this;

      _this.instanceVC = $('<div style="background-color: #000; max-width: ' + _this.width + 'px; max-height: ' + _this.height + 'px;">' +
        '<video controls preload style="width: 100%; height: 100%;" poster="' + _this.poster + '"/>' +
        '</div>');
      _this.instanceVideo = _this.instanceVC.find('video');
      _this.crlMedia.append(_this.instanceVC);

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
        }
      });
    };

    //call
    _this.setupVideo();
  }
  CRLVideo.prototype = Object.create(CRLItemPanel.prototype);

  function SolCarousel(element, options) {
    this.process(element, options);
  }
  SolCarousel.defaults = {
    //***itemsPanel
    nrItemsPerSlide: 5,
    nrItemsPerSlideL: 4,
    nrItemsPerSlideT: 3,
    nrItemsPerSlideP: 2,
    nrItemsPerSlideSP: 1,
    itemPanelHoverEfx: 'none', //none, translateUp, scale, fadeOut
    itemPanelStyle: 'none', //none, style1, style2, style3, style4
    //***media
    vposMedia: 'top', //top, bottom
    iframeWidth: 640,
    iframeHeight: 390,
    videoWidth: 640,
    videoHeight: 390,
    //***body
    posItemTitle: 'left', //left, center, right
    isTitleCutted: true,
    totalTitleLines: 2,
    posItemText: 'left', //left, center, right
    isTextCutted: true,
    totalTextLines: 6,
    //***quickView
    showQuickView: false,
    posQuickView: 'bottom_left', //top_left, top_center, top_right, inner_center, bottom_left, bottom_center, bottom_right
    txtQuickViewBtn: 'Quick View',
    txtQuickViewNotLoaded: 'ERROR QUICK VIEW',
    txtImageNotLoaded: 'NO IMAGE',
    //***deleteItemBtn
    hasDeleteBtn: false,
    posDeleteBtn: 'media_left', //media_left, media_right, item_left, item_right
    //***slidesNav
    slidesNavPos: 'bottom', //top, bottom
    slidesNavStyle: 'square', //square, circle, line, circleOutline, squareOutline
    hasSlidesNavShadow: false,
    showSlidesNav: true,
    showOneSlideNav: false,
    //***arrowsNav
    arrowsNavPos: 'center', //top, center, centerOverlap, bottom
    arrowsNavStyle: 'none', //square, circle, none, circleNone
    hasArrowsNavShadow: false,
    showArrowsNavOSN: false,
    //***general
    colorLoading: '#777',
    navType: 'slide', //slide, element.
    isInfiniteNav: false,
    isAutoPlay: false,
    pauseTime: 2000,
    isPauseOnHover: true,
    delete: false
  };
  SolCarousel.prototype = {
    process: function (element, options) {
      let _this = this;

      if (element.find('a').length === 0) {
        return;
      }

      _this.options = options || {};
      _this.config = $.extend(true, {}, SolCarousel.defaults, options);
      _this.element = element;
      _this.items = [];
      _this.crlItemPanelFactory = new CRLItemPanelFactory();
      _this.resizeTimer = 0;

      _this.processInput();
      _this.setup();
      _this.initEvents();
    },
    processInput: function () {
      let _this = this;

      let showQVIn = false;

      _this.element.find('li').each(function () {
        if ($(this).find('a').data('crl-type') === 'none' ||
          $(this).find('a').data('crl-type') === 'iframe' ||
          $(this).find('a').data('crl-type') === 'video') {
          showQVIn = true;
        }
      });
      if (showQVIn && _this.config.vposQuickView === 'inner') {
        _this.config.vposQuickView = Carousel.defaults.vposQuickView;
      }

      _this.element.find('li').each(function (index) {
        _this.items.push(_this.crlItemPanelFactory.createItemPanel($(this), _this.config, index));
      });

      _this.element.find('li').empty();

      $.each(_this.element.find('li'), (index, li) => $(li).append(_this.items[index].getInstance()));
    },
    setup: function () {
      let _this = this;
      /*overlay*/
      _this.crlOverlay = $('<div class="crlOverlay"><div><i class="crlIcon crlIconClose" aria-hidden="true">&nbsp;</i></div></div>');
      _this.crlOverlayClose = _this.crlOverlay.find('.crlIconClose');
      _this.crlOverlayCurrentItem; //the current item shown in the overlay

      /*itemsPanel*/
      _this.crlAI = $('<div class="crlAI"></div>');
      _this.element = _this.element.wrap('<div class="crlCarousel crlDirectionColumn"><div class="crlItemsPanel"></div></div>').parent().parent();
      _this.crlItemsPanel = _this.element.find('.crlItemsPanel');

      switch (_this.config.itemPanelHoverEfx) {
        case 'translateUp':
          _this.crlItemsPanel.addClass('crlTranslateUp');
          break;
        case 'scale':
          _this.crlItemsPanel.addClass('crlScale');
          break;
        case 'fadeOut':
          _this.crlItemsPanel.addClass('crlFadeOut');
          break;
        case 'none':
        default:
          break;
      };

      _this.crlItemsPanelUL = _this.crlItemsPanel.find('ul');
      _this.crlItemsPanelLI = _this.crlItemsPanel.find('li');
      _this.currentSlide = 0;
      _this.nextSlide = 0;
      _this.totalSlides = 0;
      _this.totalPrevElements = 0; //Used for navType: element
      _this.crlItemsPanelLI.find('img').css({
        'width': 'auto',
        'height': 'auto'
      });
      _this.mqNrItemsPerSlide = _this.config.nrItemsPerSlide;
      _this.calcItemsPanelSlide();

      /*slidesNav*/
      _this.crlSlidesNav = $('<div class="crlSlidesNav"><ul></ul></div>');
      _this.crlSlidesNavUL = _this.crlSlidesNav.find('ul');
      _this.calcSlidesNav();

      /*arrowsNav*/
      _this.isArrowsNavIns = false;
      _this.crlArrowsNav = $('<div class="crlArrowsNav"></div>');
      _this.crlArrowNavPrev = $('<div class="crlArrowNavPrev crlArrowCnt"><i class="crlIcon crlIconPrev" aria-hidden="true"></i></div>');
      _this.crlArrowNavNext = $('<div class="crlArrowNavNext crlArrowCnt"><i class="crlIcon crlIconNext" aria-hidden="true"></i></div>');

      if (_this.config.arrowsNavPos === 'centerOverlap') {
        _this.crlArrowNavPrev.addClass('crlArrowsOverlap');
        _this.crlArrowNavNext.addClass('crlArrowsOverlap');

        _this.config.arrowsNavPos = 'center';
      }
      _this.styleArrowsNav();
      _this.calcArrowsNav();

      /*general*/
      _this.tpStart = {
        x: 0,
        y: 0
      };
      _this.tpEnd = {
        x: 0,
        y: 0
      };
      _this.crlItemsPanelUL.removeClass('crlStart');
      _this.autoPlayInterval = 0;

      /*cutting panel title&&text*/
      //_this.cutTitleText(); //todo
      _this.resize();
    },
    initEvents: function () {
      let _this = this;

      _this.crlArrowNavPrev.on('click.ccarousel', _this, (event) => {
        let _this = event.data;

        if (_this.config.isAutoPlay === true) {
          _this.autoPlay('stop');
        }
        _this.navigate('prev');

        if (_this.config.isAutoPlay === true) {
          _this.autoPlay('start');
        }
      });

      _this.crlArrowNavNext.on('click.ccarousel', _this, (event) => {
        let _this = event.data;

        if (_this.config.isAutoPlay === true) {
          _this.autoPlay('stop');
        }
        _this.navigate('next');

        if (_this.config.isAutoPlay === true) {
          _this.autoPlay('start');
        }
      });

      _this.initEventSlidesNav();

      if (_this.config.showQuickView) {
        _this.items.forEach(item => {
          item.crlQuickViewBtn.on('click.ccarousel touchstart.ccarousel', _this, (event) => {
            let _this = event.data;
            _this.openOverlay(item);
          })
        });
      }

      if (_this.config.hasDeleteBtn === true) {
        _this.items.forEach(item => {
          item.crlDelete.on('click.ccarousel touchstart.ccarousel', _this, (event) => {
            let _this = event.data;
            _this.delete(item);
          });
        });
      }
      _this.crlItemsPanelUL.on('touchstart.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.start(true, event);
      });
      _this.crlItemsPanelUL.on('touchmove.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.move(true, event);
      });
      _this.crlItemsPanelUL.on('touchend.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.end(event);
      });
      _this.crlItemsPanelUL.on('mousedown.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.start(false, event);
      });
      _this.crlItemsPanelUL.on('mousemove.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.move(false, event);
      });
      _this.crlItemsPanelUL.on('mouseup.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.end(event);
      });
      $(window).on('resize.solcrl', _this, (event) => {
        let _this = event.data;
        _this.resize();
      });
      _this.crlOverlayClose.on('click.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.closeOverlay();
      });
      $(document).on('keydown.solcrl', _this, (event) => {
        let _this = event.data;
        _this.keyCloseOverlay(event);
      });
      _this.crlOverlay.on('click.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.closeOverlay();
      });

      if (_this.config.isAutoPlay === true) {
        _this.autoPlay('start');

        if (_this.config.isPauseOnHover === true) {
          _this.crlItemsPanelUL
            .on('mouseenter.ccarousel', _this, (event) => {
              let _this = event.data;
              _this.autoPlay('stop');
            })
            .on('mouseleave.ccarousel', _this, (event) => {
              let _this = event.data;
              _this.autoPlay('start');
            });
        }
      }
    },
    delete: function (item) {
      let _this = this;

      let config = {
        duration: 400,
        complete: function () {
          item.getInstance().parent().remove();
          _this.items = _this.items.filter(function (i) {
            return i.id !== item.id;
          });

          if (_this.items.length === 0) { //if the element was deleted
            _this.element.remove();
            $(window).off('resize.solcrl');
            $(document).off('keydown.solcrl');
          } else {
            //after delete recalculate li
            _this.crlItemsPanelLI = _this.crlItemsPanel.find('li');
            _this.calcItemsPanelSlide();
            if (((_this.currentSlide + 1) > _this.totalSlides) || _this.config.navType === 'element') {
              _this.navigate('');
            }
            _this.calcSlidesNav();
            _this.initEventSlidesNav();
            _this.styleArrowsNav();
            _this.calcArrowsNav();
          }
        }
      };

      dynamics.animate(item.getInstance().parent()[0], {
        opacity: 0
      }, config);
    },
    keyCloseOverlay: function (event) {
      if (event.keyCode === 27) { //esc
        this.closeOverlay();
      }
    },
    closeOverlay: function () {
      let _this = this;
      let config = {
        duration: 800,
        complete: () => {
          $('body').removeClass('crl-noscroll');
          if (_this.crlOverlayCurrentItem !== undefined) {
            $(_this.crlOverlayCurrentItem.getInstanceQuickView()).remove();
          }
          _this.crlOverlay.detach();

          if (_this.config.isAutoPlay === true) {
            _this.autoPlay('start');

            if (_this.config.isPauseOnHover === true) {
              _this.crlItemsPanelUL
                .on('mouseenter.ccarousel', _this, (event) => {
                  let _this = event.data;
                  _this.autoPlay('stop');
                })
                .on('mouseleave.ccarousel', _this, (event) => {
                  let _this = event.data;
                  _this.autoPlay('start');
                });
            }
          }
        }
      };

      dynamics.animate(_this.crlOverlay[0], {
        opacity: 0
      }, config);
    },
    openOverlay: function (item) {
      let _this = this;

      if (_this.config.isAutoPlay === true) {
        _this.autoPlay('stop');

        if (_this.config.isPauseOnHover === true) {
          _this.crlItemsPanelUL
            .off('mouseenter.ccarousel')
            .off('mouseleave.ccarousel');
        }
      }

      $('body').addClass('crl-noscroll');
      _this.crlOverlayCurrentItem = item;

      _this.crlOverlayCurrentItem.initQuickView();
      _this.crlOverlay.append(_this.crlOverlayCurrentItem.getInstanceQuickView());

      $('body').append(_this.crlOverlay);

      dynamics.animate(_this.crlOverlay[0], {
        opacity: 1
      }, {
        duration: 800
      });
    },
    navigate: function (navDir, context) {
      let _this = context || this;

      if (_this.config.navType === 'element') {
        _this.navElement(navDir);
      } else {
        _this.navSlide(navDir);
      }
    },
    navSlide: function (navDir) {
      let _this = this;

      if (navDir === 'prev') {
        if (_this.currentSlide === 0) {
          if (_this.config.isInfiniteNav === true) {
            _this.currentSlide = _this.totalSlides - 1;
            _this.totalPrevElements = _this.currentSlide * _this.mqNrItemsPerSlide;
          } else {
            return;
          }
        } else {
          _this.currentSlide = _this.currentSlide - 1;
          _this.totalPrevElements = _this.totalPrevElements - _this.mqNrItemsPerSlide;
        }
      }
      if (navDir === 'next') {
        if (_this.currentSlide === (_this.totalSlides - 1)) {
          if (_this.config.isInfiniteNav === true) {
            _this.currentSlide = 0;
            _this.totalPrevElements = 0;
          } else {
            return;
          }
        } else {
          _this.currentSlide = _this.currentSlide + 1;
          _this.totalPrevElements = _this.totalPrevElements + _this.mqNrItemsPerSlide;
        }
      }
      if (navDir === 'slide') {
        if (_this.currentSlide === _this.nextSlide) {
          return;
        }
        _this.currentSlide = _this.nextSlide;
        _this.totalPrevElements = (_this.nextSlide) * _this.mqNrItemsPerSlide;
      }
      if (navDir === '') {
        if (_this.totalPrevElements <= _this.mqNrItemsPerSlide) {
          _this.totalPrevElements = 0;
          _this.currentSlide = 0;
        } else {
          _this.currentSlide = Math.ceil(_this.totalPrevElements / _this.mqNrItemsPerSlide) - 1;
          _this.totalPrevElements = (_this.currentSlide - 1) * _this.mqNrItemsPerSlide;
        }
      }

      _this.crlItemsPanelLI.addClass('crlShow');
      _this.crlSlidesNavLI.removeClass('active').eq(_this.currentSlide).addClass('active');

      let config = {
        duration: 800,
        complete: function () {
          if (_this.config.isInfiniteNav === false) {
            if (_this.currentSlide === 0) {
              _this.crlArrowNavPrev.addClass('disabled');
            } else {
              _this.crlArrowNavPrev.removeClass('disabled');
            }

            if (_this.currentSlide === (_this.totalSlides - 1)) {
              _this.crlArrowNavNext.addClass('disabled');
            } else {
              _this.crlArrowNavNext.removeClass('disabled');
            }
          }
          _this.crlItemsPanelLI.removeClass('crlShow');
          for (let i = _this.totalPrevElements; i < _this.totalPrevElements + _this.mqNrItemsPerSlide; i++) {
            _this.crlItemsPanelLI.eq(i).addClass('crlShow');
          }
        }
      };
      let configAnimProp = {
        translateX: -_this.currentSlide * (_this.crlItemsPanelLI.width() + 20) * _this.mqNrItemsPerSlide
      };
      dynamics.animate(_this.crlItemsPanelUL[0], configAnimProp, config);
    },
    navElement: function (navDir) {
      let _this = this;

      if (navDir === 'next') {
        if (_this.totalPrevElements === (_this.crlItemsPanelLI.length - _this.mqNrItemsPerSlide)) {
          if (_this.config.isInfiniteNav === true) {
            _this.totalPrevElements = 0;
          } else {
            return;
          }
        } else {
          _this.totalPrevElements = _this.totalPrevElements + 1;
        }
      }
      if (navDir === 'prev') {
        if (_this.totalPrevElements === 0) {
          if (_this.config.isInfiniteNav === true) {
            _this.totalPrevElements = _this.crlItemsPanelLI.length - _this.mqNrItemsPerSlide;
          } else {
            return;
          }
        } else {
          _this.totalPrevElements = _this.totalPrevElements - 1;
        }
      }
      if (navDir === '' && _this.totalPrevElements > _this.crlItemsPanelLI.length - _this.mqNrItemsPerSlide) {
        _this.totalPrevElements = _this.crlItemsPanelLI.length >= _this.mqNrItemsPerSlide ? _this.crlItemsPanelLI.length - _this.mqNrItemsPerSlide : 0;
      }

      _this.crlItemsPanelLI.addClass('crlShow');

      let config = {
        duration: 800,
        complete: function () {
          if (_this.config.isInfiniteNav === false) {
            if (_this.totalPrevElements === 0) {
              _this.crlArrowNavPrev.addClass('disabled');
            } else {
              _this.crlArrowNavPrev.removeClass('disabled');
            }

            if (_this.totalPrevElements === (_this.crlItemsPanelLI.length - _this.mqNrItemsPerSlide)) {
              _this.crlArrowNavNext.addClass('disabled');
            } else {
              _this.crlArrowNavNext.removeClass('disabled');
            }
          }
          _this.crlItemsPanelLI.removeClass('crlShow');
          for (let i = _this.totalPrevElements; i < _this.totalPrevElements + _this.mqNrItemsPerSlide; i++) {
            _this.crlItemsPanelLI.eq(i).addClass('crlShow');
          }
        }
      };

      let configAnimProp = {
        translateX: (-_this.totalPrevElements * (_this.crlItemsPanelLI.width() + 20))
      };
      dynamics.animate(_this.crlItemsPanelUL[0], configAnimProp, config);
    },
    autoPlay: function (action) {
      let _this = this;

      if (action === 'stop') {
        clearInterval(_this.autoPlayInterval);
        _this.autoPlayInterval = 0;
      } else {
        _this.autoPlayInterval = setInterval(_this.navigate, _this.config.pauseTime, 'next', _this);
      }
    },
    start: function (isTouch, event) {
      let _this = this;

      event.preventDefault();

      if (isTouch) {
        if (event.originalEvent.touches.length == 1) {
          _this.tpStart.x = event.originalEvent.touches[0].pageX;
          _this.tpEnd.x = _this.tpStart.x;
          _this.tpStart.y = event.originalEvent.touches[0].pageY;
          _this.tpEnd.y = _this.tpStart.y;
        }
      } else {
        _this.tpStart.x = event.pageX;
        _this.tpEnd.x = _this.tpStart.x;
        _this.tpStart.y = event.pageY;
        _this.tpEnd.y = _this.tpStart.y;
      }
    },
    move: function (isTouch, event) {
      let _this = this;

      event.preventDefault();

      if (isTouch) {
        if (event.originalEvent.touches.length == 1) {
          _this.tpEnd.x = event.originalEvent.touches[0].pageX;
          _this.tpEnd.y = event.originalEvent.touches[0].pageY;
        }
      } else {
        _this.tpEnd.x = event.pageX;
        _this.tpEnd.y = event.pageY;
      }
    },
    end: function (event) {
      let _this = this;

      if (_this.tpEnd.x === _this.tpStart.x && _this.tpEnd.y === _this.tpStart.y) {
        return;
      }
      event.preventDefault();

      // By default the navigation is horizontal => is checked the difference between x's
      if (_this.tpStart.x - _this.tpEnd.x > 10) {
        _this.navigate('next');
      }
      if (_this.tpStart.x - _this.tpEnd.x < -10) {
        _this.navigate('prev');
      }
    },
    resize: function () {
      let _this = this;

      clearTimeout(_this.resizeTimer);
      _this.resizeTimer = setTimeout(function () {
        _this.calcItemsPanelSlide();
        if ((_this.config.navType === 'slide' && (_this.currentSlide + 1) > _this.totalSlides) || _this.config.navType === 'element') {
          _this.navigate('');
        }
        _this.calcSlidesNav();
        _this.initEventSlidesNav();
        _this.styleArrowsNav();
        _this.calcArrowsNav();
        _this.cutTitleText();
      }, 100);
    },
    calcItemsPanelSlide: function () {
      let _this = this;
      const mediaDesktop = '(min-width: 1200px)';
      const mediaLaptop = '(min-width: 992px)';
      const mediaTablet = '(min-width: 768px)';
      const mediaPhone = '(min-width: 576px)';

      if (window.matchMedia(mediaDesktop).matches) {
        _this.mqNrItemsPerSlide = _this.config.nrItemsPerSlide;
      } else {
        if (window.matchMedia(mediaLaptop).matches) {
          _this.mqNrItemsPerSlide = _this.config.nrItemsPerSlideL;
        } else {
          if (window.matchMedia(mediaTablet).matches) {
            _this.mqNrItemsPerSlide = _this.config.nrItemsPerSlideT;
          } else {
            if (window.matchMedia(mediaPhone).matches) {
              _this.mqNrItemsPerSlide = _this.config.nrItemsPerSlideP;
            } else {
              _this.mqNrItemsPerSlide = _this.config.nrItemsPerSlideSP;
            }
          }
        }
      }

      _this.totalSlides = Math.ceil(_this.crlItemsPanelLI.length / _this.mqNrItemsPerSlide);
      _this.crlItemsPanelUL.css('width', 'calc(' + 100 * _this.totalSlides + '% + ' + 20 * _this.totalSlides + 'px)');
      _this.crlItemsPanelLI.css('width', 100 / (_this.totalSlides * _this.mqNrItemsPerSlide) + '%');
      _this.crlItemsPanelUL.find('li:first-child').css('width', 'calc(' + 100 / (_this.totalSlides * _this.mqNrItemsPerSlide) + '%' + ' - 20px)');

      _this.crlItemsPanelLI.removeClass('crlShow');

      for (let i = _this.totalPrevElements; i < _this.totalPrevElements + _this.mqNrItemsPerSlide; i++) {
        _this.crlItemsPanelLI.eq(i).addClass('crlShow');
      }
    },
    calcSlidesNav: function () {
      let _this = this;
      const mediaDesktop = '(min-width: 1200px)';
      let cssClass = '';

      _this.crlSlidesNavUL.find('li').remove();

      if (!_this.config.showSlidesNav ||
        (_this.config.showOneSlideNav === false && _this.totalSlides === 1) ||
        _this.config.navType === 'element') {
        _this.crlSlidesNavLI = _this.crlSlidesNav.find('li');

        return;
      }

      for (let i = 0; i < _this.totalSlides; i++) {
        _this.crlSlidesNavUL.append('<li data-crl-slide="' + i + '"></li>');
      }
      _this.crlSlidesNavLI = _this.crlSlidesNav.find('li');
      _this.crlSlidesNavLI.eq(_this.currentSlide).addClass('active');

      switch (_this.config.slidesNavStyle) {
        case 'line':
          cssClass = 'crlLine';
          break;
        case 'circleOutline':
          cssClass = 'crlCircle crlOutline';
          break;
        case 'circle':
          cssClass = 'crlCircle crlSolid';
          break;
        case 'squareOutline':
          cssClass = 'crlOutline';
          break;
        case 'square':
        default:
          cssClass = 'crlSolid';
          break;
      }
      _this.crlSlidesNavLI.addClass(cssClass);
      if (_this.config.hasSlidesNavShadow === true) {
        _this.crlSlidesNavLI.addClass('crlShadow');
      }

      if (_this.config.slidesNavPos === 'bottom') {
        _this.crlSlidesNav.addClass('crlBottom crlSlidesNavMt');
      } else {
        _this.crlSlidesNav.addClass('crlSlidesNavMb');
      }
    },
    calcArrowsNav: function () {
      let _this = this;

      if (_this.config.isInfiniteNav === false) {
        _this.currentSlide === 0 ? _this.crlArrowNavPrev.addClass('disabled') : _this.crlArrowNavPrev.removeClass('disabled');

        _this.totalSlides === (_this.currentSlide + 1) ? _this.crlArrowNavNext.addClass('disabled') : _this.crlArrowNavNext.removeClass('disabled');
      }
    },
    styleArrowsNav: function () {
      let _this = this;

      if (_this.config.showArrowsNavOSN === false) {
        if (_this.totalSlides === 1) {
          if (_this.isArrowsNavIns === true) {
            if (_this.config.arrowsNavPos === 'center') {
              _this.crlItemsPanel.removeClass('crlItemsPanelCenter');
              _this.crlArrowNavPrev.hide();
              _this.crlArrowNavNext.hide();
            } else {
              _this.crlArrowsNav.hide();
            }
          }

          return;
        } else {
          if (_this.isArrowsNavIns === true) {
            if (_this.config.arrowsNavPos === 'center') {
              _this.crlItemsPanel.addClass('crlItemsPanelCenter');
              _this.crlArrowNavPrev.show();
              _this.crlArrowNavNext.show();
            } else {
              _this.crlArrowsNav.show();
            }
          }
        }
      }
      if (_this.isArrowsNavIns === false) { //Controlling that the insert is done only one time
        //style
        if (_this.config.arrowsNavStyle !== 'none') {
          const cssClass = _this.config.arrowsNavStyle === 'square' ? 'crlSquare' : (_this.config.arrowsNavStyle === 'circle' ? 'crlCircle' : 'crlCircleNone');
          _this.crlArrowNavPrev.addClass(cssClass);
          _this.crlArrowNavNext.addClass(cssClass);
        }
        if (_this.config.hasArrowsNavShadow === true) {
          _this.crlArrowNavPrev.addClass('crlShadow');
          _this.crlArrowNavNext.addClass('crlShadow');
        }
        //pos + insert
        if (_this.config.arrowsNavPos === 'center') {
          _this.element.append(_this.crlSlidesNav);
          _this.crlItemsPanel.addClass('crlItemsPanelCenter');
          _this.element.append(_this.crlAI);
          _this.crlAI.append(_this.crlArrowNavPrev).append(_this.crlItemsPanel).append(_this.crlArrowNavNext);
        } else {
          _this.crlArrowNavPrev.addClass('crlArrowSpace');
          _this.crlArrowsNav.append(_this.crlArrowNavPrev).append(_this.crlArrowNavNext);
          _this.crlArrowsNav.insertBefore(_this.crlItemsPanel);
          _this.crlSlidesNav.insertBefore(_this.crlItemsPanel);

          if (_this.config.arrowsNavPos === 'bottom') {
            _this.crlArrowsNav.addClass('crlArrowBottom');
          }
          if (_this.config.arrowsNavPos === 'top') {
            _this.crlArrowsNav.addClass('crlArrowTop');
          }
        }

        _this.isArrowsNavIns = true;
      }
    },
    initEventSlidesNav: function () {
      let _this = this;

      if (_this.crlSlidesNavLI.length === 0) {
        return;
      }
      _this.crlSlidesNavLI.on('click.ccarousel', _this, (event) => {
        let _this = event.data;
        _this.nextSlide = $(event.target).data('crl-slide');
        _this.navigate('slide');
      });
    },
    cutTitleText: function () {
      let _this = this;

      _this.items.forEach(item => {
        item.showBody();

        if (item.title !== '' && _this.config.isTitleCutted) {
          item.cutterTitle.cut();
        }
        if (item.text !== '' && _this.config.isTextCutted) {
          item.cutterText.cut();
        }
      });
    }
  };

  $.fn.solCarousel = function (options) {
    let _this = this;

    _this.each(function (index, el) {
      let instance = $(el).data('crlCarousel');

      if (!instance) {
        $(el).data('crlCarousel', new SolCarousel($(el), options));
      } else {
        if (options !== undefined && options.delete === true) {
          instance.element.remove(); //removing the component
          $(window).off('resize.solcrl');
          $(document).off('keydown.solcrl');
        }
      }
    });
  };
})(jQuery, window, document);
