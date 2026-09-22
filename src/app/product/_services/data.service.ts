import { Injectable } from '@angular/core';

import { ContentChangeLog } from 'src/app/shared/_models/content-change-log';
import { ContentDocs } from 'src/app/shared/_models/content-docs';
import { ContentExamples } from 'src/app/shared/_models/content-examples';
import { ContentFeatures } from 'src/app/shared/_models/content-features';
import { Example } from 'src/app/shared/_models/example';
import { Product } from 'src/app/shared/_models/product';

import { Attribute } from '../../shared/_models/attribute';
import { GroupOption } from '../../shared/_models/group-option';
import { OptionClass } from '../../shared/_models/option-class.enum';
import { PageType } from '../../shared/_models/page-type.enum';
import { ProductType } from '../../shared/_models/product-type.enum';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  glassCaseOptions: GroupOption[] = [
    {
      type: OptionClass.Display,
      title: 'Display',
      options: [
        { name: 'widthDisplay', order: 1, type: 'number', default: '400', description: 'The width of the Display. Value is in px.' },
        { name: 'heightDisplay', order: 2, type: 'number', default: '534', description: 'The height of the Display. Value is in px.' },
        { name: 'isDownloadEnabled', order: 3, type: 'boolean', default: 'true', description: 'Enables or disables the feature of download. The feature consists in the ability to download the displayed image. From version 1.1 the download icon will be visible(and available) only in modern browsers.', versionDeleted: '3.0' },
        { name: 'isShowAlwaysIcons', order: 4, type: 'boolean', default: 'false', description: 'If true the icons on the Display Area will always be shown. If false, the icons we\'ll appear only when the user hovers the Display Area. ', versionAdded: '2.0' },
        { name: 'speedHideIcons', order: 5, type: 'number', default: '3000', description: 'The spead with which the icons disappear on the Display Area. The speed is given in milliseconds.', versionAdded: '2.0' },
        { name: 'mouseEnterDisplayCB', order: 6, type: 'function', default: 'function(){ }', description: 'Callback for the mouseenter event of Display Image', versionAdded: '2.1' },
        { name: 'mouseLeaveDisplayCB', order: 7, type: 'function', default: 'function(){ }', description: 'Callback for the mouseleave event of Display Image.', versionAdded: '2.1' },
        { name: 'isAutoPlayDisplay', order: 8, type: 'boolean', default: 'false', description: 'Enable or disables the auto play of the images.', versionAdded: '3.0' },
        { name: 'pauseTimeDisplay', order: 9, type: 'number', default: '3000', description: 'Time between the change of images enabled by isAutoPlayDisplay. Value is in milliseconds.', versionAdded: '3.0' },
        { name: 'isPauseOnHoverDisplay', order: 10, type: 'boolean', default: 'true', description: 'If set to true, on hovering the display image the auto play display will pause.', versionAdded: '3.0' }
      ]
    },
    {
      type: OptionClass.Thumbs,
      title: 'Thumbs',
      options: [
        { name: 'thumbsPosition', order: 1, type: 'string', default: '\'bottom\'', description: 'The position of thumbs: it is relative to the Display Area. <br> Possible values: <code>\'top\'</code>; <code>\'bottom\'</code>; <code>\'left\'</code>; <code>\'right\'</code>.' },
        { name: 'nrThumbsPerRow', order: 2, type: 'number', default: '5', description: 'Number of thumbs per row.' },
        { name: 'isThumbsOneRow', order: 3, type: 'boolean', default: 'true', description: 'If <code>true</code> => the thumbs will be shown on one row; <br>If <code>false</code> => all thumbs will be shown. <br>This value can be used only when the <code>thumbsPosition</code> is set to <code>\'top\'</code> or <code>\'bottom\'</code>.' },
        { name: 'isOneThumbShown', order: 4, type: 'boolean', default: 'false', description: 'Having only one thumb, it (the thumb) can be hidden. If the option is set to false the thumb will be hidden.' },
        { name: 'firstThumbSelected', order: 5, type: 'number', default: '0', description: 'Manages the ability to set the selected thumb on component load. Thumb counting starts with 0 (zero). If the assigned value is outside the range, the it will be set to 0.' },
        { name: 'colorActiveThumb', order: 6, type: 'string', default: '\'-1\'', description: 'Sets the color of the active thumb. By default it will use the value set in the css. To set a color use the following format: \'#xxxxxx\', where xxxxxx is the number of color in hex. ', versionAdded: '' },
        { name: 'thumbsMargin', order: 7, type: 'number', default: '4', description: 'The distance between the thumbs and display area. The value is in px.', versionAdded: '1.4' },
        { name: 'isHoverShowThumbs', order: 8, type: 'boolean', default: 'false', description: 'If <code>true</code>, hovering a thumb will change the displayed image.', versionAdded: '2.0' },
        { name: 'slideType', order: 9, type: 'string', default: '\'slideRow\'', description: 'The sliding effect related to the thumbs area. <br>Possible values: <code>\'slideRow\'</code>, <code>\'slideElement\'</code>.', versionAdded: '3.0' },
      ]
    },
    {
      type: OptionClass.Zoom,
      title: 'Zoom',
      options: [
        { name: 'zoomPosition', order: 1, type: 'string', default: '\'right\'', description: 'The position of the Zoom: it is relative to the Display Area. <br>Possible values: <code>\'left\'</code>; <code>\'right\'</code>; <code>\'inner\'</code>.' },
        { name: 'autoInnerZoom', order: 2, type: 'boolean', default: 'true', description: 'If true: In case that the zoom doesn\'t fit on the page, the zoom will be set in inner zoom position.', versionAdded: '2.0' },
        { name: 'isZoomEnabled', order: 3, type: 'boolean', default: 'true', description: 'Enables or disables zoom.', versionAdded: '1.1' },
        { name: 'isSlowZoom', order: 4, type: 'boolean', default: 'false', description: 'Enables the effect of \'slowing\' the movement of zoom.', versionAdded: '1.3' },
        { name: 'speedSlowZoom', order: 5, type: 'number', default: '1200', description: 'Determines how long the animation will run. The speed is given in milliseconds.', versionAdded: '1.3' },
        { name: 'isZoomDiffWH', order: 6, type: 'boolean', default: 'false', description: 'Determines if the zoom\'s width and height have different values. If false and zoomWidth == 0 and zoomHeight == 0 => width will be equal to height of the image container. If true => height will be different from width.', versionAdded: '1.4' },
        { name: 'zoomWidth', order: 7, type: 'number', default: '0', description: 'The width of the zoom. The value is in px. If zoomWidth is bigger than the width of the original image then to the zoomWidth will be assigned the width of the original image. If zoomWidth == 0 then to zoomWidth will be assigned the width of the Display Container.', versionAdded: '1.4' },
        { name: 'zoomHeight', order: 8, type: 'number', default: '0', description: 'The height of the zoom. The value is in px. <br>If zoomHeight is bigger than the height of the original image then to the zoomHeight will be assigned the height of the original image. <br>If zoomHeight == 0 then to zoomHeight will be assigned the height of the Display Container.', versionAdded: '1.4' },
        { name: 'zoomAlignment', order: 9, type: 'string', default: '\'displayImage\'', description: 'Possible values: <code>\'displayImage\'</code>, <code>\'displayArea\'</code>.', versionAdded: '1.4' },
        { name: 'zoomMargin', order: 10, type: 'number', default: '4', description: 'The distance between the Zoom Area and Display Area. The value is in px.', versionAdded: '1.4' },
      ]
    },
    {
      type: OptionClass.Lens,
      title: 'Lens',
      options: [
        { name: 'isSlowLens', order: 1, type: 'boolean', default: 'false', description: 'Enables the effect of \'slowing\' the movement of lens.', versionAdded: '1.3' },
        { name: 'speedSlowLens', order: 2, type: 'number', default: '600', description: 'Determines how long the animation will run. The speed is given in milliseconds.', versionAdded: '1.3' },
      ]
    },
    {
      type: OptionClass.Overlay,
      title: 'Overlay',
      options: [
        { name: 'isOverlayEnabled', order: 1, type: 'boolean', default: 'true', description: 'Enables or disables the overlay.', versionAdded: ' 1.1' },
        { name: 'isOverlayFullImage', order: 2, type: 'boolean', default: 'false', description: 'If true the image in overlay will be shown in full size and only. If false the image will fit the display. On double clicking, the image size will be toggled. If the image is in fit => after double click it will be shown in full size. If the image is in full size => after double click it will fit the display.', versionAdded: '1.3' },
      ]
    },
    {
      type: OptionClass.Caption,
      title: 'Caption',
      options: [
        { name: 'isZCapEnabled', order: 1, type: 'boolean', default: 'true', description: 'Enables or disables captions for Zoom Area.', versionAdded: '2.1' },
        { name: 'capZType', order: 2, type: 'string', default: '\'in\'', description: 'The type of captions: in-side the Zoom Area or out-side the Zoom Area. If Zoom position is inner => the type of the captions will be set to in. Possible values: \'in\'; \'out\'.', versionAdded: '2.1' },
        { name: 'capZPos', order: 3, type: 'string', default: '\'bottom\'', description: 'Position of captions in relation to the Zoom Area. <br>Possible values: <code>\'bottom\'</code>; <code>\'top\'</code>.', versionAdded: '2.1' },
        { name: 'capZAlign', order: 4, type: 'string', default: '\'center\'', description: 'The alignment of the caption text. <br>Possible values: <code>\'center\'</code>; <code>\'left\'</code>; <code>\'right\'</code>.', versionAdded: '2.1' },
      ]
    },
    {
      type: OptionClass.VideoIFrame,
      title: 'VideoIFrame',
      options: [
        { name: 'iframeWidth', order: 1, type: 'number', default: '640', description: 'The iframe width. Value is in px.', versionAdded: '3.0' },
        { name: 'iframeHeight', order: 2, type: 'number', default: '390', description: 'The iframe height. Value is in px.', versionAdded: '3.0' },
        { name: 'txtImgThumbIframe', order: 3, type: 'string', default: '\'IFRAME\'', description: 'The text that is used by the image thumb holder, for the iframe thumb image.', versionAdded: '3.0' },
        { name: 'videoWidth', order: 4, type: 'number', default: '640', description: 'The HTML5 video width. Value is in px.', versionAdded: '3.0' },
        { name: 'videoHeight', order: 5, type: 'number', default: '390', description: 'The HTML5 video height. Value is in px.', versionAdded: '3.0' },
        { name: 'txtImgThumbVideo', order: 6, type: 'string', default: '\'VIDEO\'', description: 'The text that is used by the image thumb holder, for the video thumb image.', versionAdded: '3.0' },
      ]
    },
    {
      type: OptionClass.General,
      title: 'General',
      options: [
        { name: 'isKeypressEnabled', order: 1, type: 'boolean', default: 'true', description: 'If <code>true</code>, the option enables the keyboard navigation. <br>If <code>false</code> it disables the keyboard navigation.' },
        { name: 'colorIcons', order: 2, type: 'string', default: '\'-1\'', description: 'Sets the color of icons used by the component. By default, it will use the color defined in css. To set a color use the following format: \'#xxxxxx\', where xxxxxx is the number of color in hex.' },
        { name: 'speed', order: 3, type: 'number', default: '400', description: 'Determines how long the animation will run. The speed is given in milliseconds. This value is used in the animation of lens; zoom; overlay; slide.', versionAdded: '1.3' },
        { name: 'colorLoading', order: 4, type: 'string', default: '\'-1\'', description: 'Sets the color of the loading wheel used by the component. By default, it will use the color defined in css. To set a color use the following format: \'#xxxxxx\', where xxxxxx is the number of color in hex.', versionAdded: '2.0' },
        { name: 'textImageNotLoaded', order: 5, type: 'string', default: '\'NO IMAGE\'', description: 'The text that is used by the holder, in case that the image did not load.', versionAdded: '2.0' }
      ]
    }
  ];
  glassCaseAttributes: Attribute[] = [
    { name: 'data-gc-caption', description: 'Enables the captions. The value of this attribute holds the text of the captions. Captions are only available for image content type.', versionAdded: '2.1' },
    { name: 'data-gc-type', description: 'The type of the element. When the content is an image there is no need to indicate the content type. <br>Possible values: <code>iframe</code>, <code>video</code>.', versionAdded: '3.0' },
    { name: 'data-gc-width', description: 'Defines the width of the container. Overrides the value defined in the plugin\'s options. This data attribute affects the following type of elements: <code>iframe</code>, <code>video</code>.', versionAdded: '3.0' },
    { name: 'data-gc-height', description: 'Defines the height of the container. Overrides the value defined in the plugin\'s options. This data attribute affects the following type of elements: <code>iframe</code>, <code>video</code>.', versionAdded: '3.0' },
    { name: 'data-gc-formats', description: 'This attribute is used only by the video element type. It is used for specifying multiple source files(multiple formats) as a fallback in case the user\'s browser doesn\'t support one of them. The type of this attribute is an array of strings.<br/> e.g.: <code class="tc-no-wraps">data-gc-formats=[\'../../images/m1.webm\']</code>', versionAdded: '3.0' },
    { name: 'data-gc-poster', description: 'This attribute is used only by the <code>video</code> element type. Provides an image to show before the video loads.', versionAdded: '3.0' },
  ];
  overBoxOptions: GroupOption[] = [
    {
      type: OptionClass.General,
      title: 'Options',
      options: [
        {name: "obOpenCloseType", type: "string", default: "'obCorner'", description: "The type of the effect used for opening and closing the OverBox. <br>Possible values: <code>'obCorner'</code>, <code>'obDoor'</code>, <code>'obAnimOCO'</code>, <code>'obHuge'</code>, <code>'obCntPush'</code>."},
        {name: "obNavType", type: "string", default: "'obPressAway'", description: "The type of the effect used for navigation through the OverBox elements. <br>Possible values: <code>'obPressAway'</code>, <code>'obSlide'</code>, <code>'obSoftScale'</code>, <code>'obLetIn'</code>, <code>'obFortuneWheel'</code>."},
        {name: "posControlBar", type: "string", default: "'right'", description: "The position of the control bar. <br>Possible values: <code>'right'</code>, <code>'left'</code>."},
        {name: "isPagEnabled", type: "boolean", default: "true", description: "Enables or disables the pagination. <br>Possible values: <code>true</code>, <code>false</code>."},
        {name: "pagSeparator", type: "string", default: "'/'", description: "The character which separates the two values of pagination: current_element and total_elements."},
        {name: "isInfoEnabled", type: "boolean", default: "true", description: "Enables of disables the the information bar. <br>Possible values: <code>true</code>, <code>false</code>."},
        {name: "isKeypressEnabled", type: "boolean", default: "true", description: "Enables or disables the keyboard navigation. <br>Possible values: <code>true</code>, <code>false</code>."},
        {name: "closeKeys", type: "array of numbers", default: "[27]", description: "The key codes, which will trigger the close event for the OverBox."},
        {name: "prevKeys", type: "array of numbers", default: "[37]", description: "The key codes, which will trigger the 'previous' navigation for the OverBox."},
        {name: "nextKeys", type: "array of numbers", default: "[39]", description: "The key codes, which will trigger the 'next' navigation for the OverBox."},
        {name: "infoKeys", type: "array of numbers", default: "[73]", description: "The key codes, which will toggle the information bar."},
        {name: "isDeepLinkingEnabled", type: "boolean", default: "false", description: "Enables or disables deeplinking for the OverBox. <br>Possible values: <code>true</code>, <code>false</code>."},
        {name: "dlGroupPrefix", type: "string", default: "'overbox'", description: "The name of the group prefix."},
        {name: "dlObjectPrefix", type: "string", default: "'object'", description: "The name of the element prefix."},
        {name: "iframeWidth", type: "number", default: "640", description: "The iframe width. Value is in px."},
        {name: "iframeHeight", type: "number", default: "390", description: "The iframe height. Value is in px."},
        {name: "videoWidth", type: "number", default: "640", description: "The HTML5 video width. Value is in px."},
        {name: "videoHeight", type: "number", default: "390", description: "The HTML5 video height. Value is in px."},
        {name: "imageErrorLoadTxt", type: "string", default: "'NO IMAGE'", description: "The text that is used by the holder, in case that the image did not load."},
        {name: "ajaxErrorTxt", type: "string", default: "'NO AJAX'", description: "The text that is used by the holder, in case that the request fails."}  
      ]
    }
  ];
  overBoxAttributes: Attribute[] = [
    { name: "data-ob-type", description: "The type of the element. The default value is: <code>image</code>. <br>Possible values: <code>iframe</code>, <code>ajax</code>, <code>video</code>, <code>image</code>."},
    { name: "data-ob-group", description: "The name of the group in which are grouped the elements that have the same group name. "},
    { name: "data-ob-info", description: "The information text of each element. "},
    { name: "data-ob-width", description: "Defines the width of the container. Overrides the value defined in the plugin's options. This data attribute affects the following type of elements: <code>iframe</code>, <code>video</code>, <code>flash</code>. "},
    { name: "data-ob-height", description: "Defines the height of the container. Overrides the value defined in the plugin's options. This data attribute affects the following type of elements: <code>iframe</code>, <code>video</code>, <code>flash</code>. "},
    { name: "data-ob-formats", description: "This attribute is used only by the video element type. It is used for specifying multiple source files(multiple formats) as a fallback in case the user's browser doesn't support one of them. The type of this attribute is an array of strings. e.g.: <code class='tc-no-wrap'>data-ob-formats=['../../images/m1.webm']</code>"},
    { name: "data-ob-poster", description: "This attribute is used only by the <code>video</code> element type. Provides an image to show before the video loads. "}
  ];
  solCarouselOptions: GroupOption[] = [
    {
      type: OptionClass.ItemsPanel,
      title: 'Items Panel',
      options: [
        {
          name: 'nrItemsPerSlide',
          type: 'number',
          default: '5',
          description: 'The number of items per slide for media with min-width: 1200px. <br>Possible values: a number between [ 1, 20 ].'        
        },
        {
          name: 'nrItemsPerSlideL',
          type: 'number',
          default: '4',
          description: 'The number of items per slide for media with min-width: 992px. <br>Possible values: a number between [ 1, 20 ].'
        },
        {
          name: 'nrItemsPerSlideT',
          type: 'number',
          default: '3',
          description: 'The number of items per slide for media with min-width: 768px. <br>Possible values: a number between [ 1, 20 ].'
        },
        {
          name: 'nrItemsPerSlideP',
          type: 'number',
          default: '2',
          description: 'The number of items per slide for media with min-width: 576px. <br>Possible values: a number between [ 1, 20 ].'
        },
        {
          name: 'nrItemsPerSlideSP',
          type: 'number',
          default: '1',
          description: 'The number of items per slide for media with width smaller than 576px. <br>Possible values: a number between [ 1, 20 ].'
        },
        {
          name: 'itemPanelHoverEfx',
          type: 'string',
          default: '\'none\'',
          description: 'Hover effects for itemPanel. <br>Possible values: <code>\'none\'</code>, <code>\'translateUp\'</code>, <code>\'scale\'</code>, <code>\'fadeOut\'</code>.',
        },
        {
          name: 'itemPanelStyle',
          type: 'string',
          default: '\'none\'',
          description: 'Style type for itemPanel. <br>Possible values:  <code>\'none\'</code>, <code>\'style1\'</code>, <code>\'style2\'</code>, <code>\'style3\'</code>.'
        },
        {
          name: 'iframeWidth',
          type: 'number',
          default: '640',
          description: 'The iframe width. Value is in px.'
        },
        {
          name: 'iframeHeight',
          type: 'number',
          default: '390',
          description: 'The iframe height. Value is in px.'
        },
        {
          name: 'videoWidth',
          type: 'number',
          default: '640',
          description: 'The HTML5 video width. Value is in px.'
        },
        {
          name: 'videoHeight',
          type: 'number',
          default: '390',
          description: 'The HTML5 video height. Value is in px.'
        },
        {
          name: 'vposMedia',
          type: 'string',
          default: '\'top\'',
          description: 'Vertical position of the media. <br>Possible values:  <code>\'top\'</code>, <code>\'bottom\'</code>.'
        },
        {
          name: 'posItemTitle',
          type: 'string',
          default: '\'left\'',
          description: 'The position of the itemTitle. <br>Possible values:  <code>\'left\'</code>, <code>\'center\'</code>, <code>\'right\'</code>.'
        },
        {
          name: 'isTitleCutted',
          type: 'boolean',
          default: 'true',
          description: 'Enables or disables the truncation of the title.'
        },
        {
          name: 'totalTitleLines',
          type: 'number',
          default: '2',
          description: 'The number of lines for title.<br>Possible values: a number between [ 1, 10 ].'
        },
        {
          name: 'posItemText',
          type: 'string',
          default: '\'left\'',
          description: 'The position of the itemText. <br>Possible values:  <code>\'left\'</code>, <code>\'center\'</code>, <code>\'right\'</code>.'
        },
        {
          name: 'isTextCutted',
          type: 'boolean',
          default: 'true',
          description: 'Enables or disables the truncation of the title.'
        },
        {
          name: 'totalTextLines',
          type: 'number',
          default: '6',
          description: 'The number of lines for text.<br>Possible values: a number between [ 1, 20 ].'
        },
        {
          name: 'txtImageNotLoaded',
          type: 'string',
          default: '\'NO IMAGE\'',
          description: 'The text that is used by the holder, which will be shown in case that the image, from media, didn\'t load.'
        }
      ]
    },
    {
      type: OptionClass.QuickView,
      title: 'Quick View',
      options: [
        {
          name: 'showQuickView',
          type: 'boolean',
          default: 'false',
          description: 'Shows or hides the Quick View button.'
        },
        {
          name: 'posQuickView',
          type: 'string',
          default: '\'bottom_left\'',
          description: 'Position of the Quick View button. The position <code>inner_center</code> is available only for \'image\' content type. <br>Possible values: <code>\'top_left\'</code>, <code>\'top_center\'</code>, <code>\'top_right\'</code>, <code>\'inner_center\'</code>, <code>\'bottom_left\'</code>, <code>\'bottom_center\'</code>, <code>\'bottom_right\'</code>.'
        },
        {
          name: 'txtQuickViewBtn',
          type: 'string',
          default: '\'Quick View\'',
          description: 'The text of the Quick View button.'
        },
        {
          name: 'txtQuickViewNotLoaded',
          type: 'string',
          default: '\'ERROR QUICK VIEW\'',
          description: 'The text that is used by the holder, which will be shown in case that the Quick View content didn\'t load.'
        }
      ]
    },
    {
      type: OptionClass.DeleteBtn,
      title: 'Delete Button',
      options: [
        {
          name: 'hasDeleteBtn',
          type: 'boolean',
          default: 'false',
          description: 'Enables or disables the delete button. If set to <code>true</code> each item will have a delete button.'
        },
        {
          name: 'posDeleteBtn',
          type: 'string',
          default: '\'media_left\'',
          description: 'Position of the delete button. <br>Possible values: <code>\'media_left\'</code>, <code>\'media_right\'</code>, <code>\'item_left\'</code>, <code>\'item_right\'</code>.'
        }
      ]
    },
    {
      type: OptionClass.SlidesNav,
      title: 'Slides Navigation',
      options: [
        {
          name: 'slidesNavPos',
          type: 'string',
          default: '\'bottom\'',
          description: 'The position of the slidesNav. It is relative to the whole component. <br>Possible values: <code>\'top\'</code>, <code>\'bottom\'</code>.'
        },
        {
          name: 'slidesNavStyle',
          type: 'string',
          default: '\'square\'',
          description: 'The style of the slidesNav. <br>Possible values: <code>\'square\'</code>, <code>\'circle\'</code>, <code>\'line\'</code>, <code>\'squareOutline\'</code>, <code>\'circleOutline\'</code>.'
        },
        {
          name: 'hasSlidesNavShadow',
          type: 'boolean',
          default: 'false',
          description: 'If <code>true</code> will add a shadow to the slides.'
        },
        {
          name: 'showSlidesNav',
          type: 'boolean',
          default: 'true',
          description: 'Shows or hides the slidesNav.'
        },
        {
          name: 'showOneSlideNav',
          type: 'boolean',
          default: 'false',
          description: 'If showOneSlideNav is set to <code>false</code> and there is only one slide, then the slidesNav will be hidden.'
        }
      ]
    },
    {
      type: OptionClass.ArrowsNav,
      title: 'Arrows Navigation',
      options: [
        {
          name: 'arrowsNavPos',
          type: 'string',
          default: '\'center\'',
          description: 'The position of the arrowsNav. <br>Possible values: <code>\'top\'</code>, <code>\'center\'</code>, <code>\'centerOverlap\'</code>, <code>\'bottom\'</code>.'
        },
        {
          name: 'arrowsNavStyle',
          type: 'string',
          default: '\'none\'',
          description: 'The style of the arrowsNav. <br>Possible values: <code>\'square\'</code>, <code>\'circle\'</code>, <code>\'none\'</code>, <code>\'circleNone\'</code>.'
        },
        {
          name: 'hasArrowsNavShadow',
          type: 'boolean',
          default: 'false',
          description: 'If <code>true</code> will add a shadow to the arrows.'
        },
        {
          name: 'showArrowsNavOSN',
          type: 'boolean',
          default: 'false',
          description: 'If showArrowsNavOSN is set to <code>false</code> and there is only one slide, then the arrowsNav will be hidden.'
        }
      ]
    },
    {
      type: OptionClass.General,
      title: 'General',
      options: [
        {
          name: 'colorLoading',
          type: 'string',
          default: '\'#333333\'',
          description: 'Sets the color of the loading wheel used by the component. To set a color use the following format: \'#xxxxxx\', where xxxxxx is the number of color in hex.'
        },
        {
          name: 'navType',
          type: 'string',
          default: '\'slide\'',
          description: 'This option specifies which navigation type is used by the component. <br>Possible values: <code>\'slide\'</code>, <code>\'element\'</code>.'
        },
        {
          name: 'isInfiniteNav',
          type: 'boolean',
          default: 'false',
          description: 'Enables or disables the infinite navigation.'
        },
        {
          name: 'isAutoPlay',
          type: 'boolean',
          default: 'false',
          description: 'Enable or disables the auto play of items in the component.'
        },
        {
          name: 'pauseTime',
          type: 'number',
          default: '2000',
          description: 'Time between the change of items. Value is in milliseconds.'
        },
        {
          name: 'isPauseOnHover',
          type: 'boolean',
          default: 'true',
          description: 'If set to <code>true</code>, on hovering the itemPanel the auto play will pause.'
        }
      ]
    }  
  ];
  solCarouselAttributes: Attribute[] = [
    {
      name: 'data-crl-link',
      description: 'The link to which will navigate the user, after clicking an itemPanel.'
    },
    {
      name: 'data-crl-title',
      description: 'The title text for the itemPanel.'
    },
    {
      name: 'data-crl-text',
      description: 'The text for the itemPanel'
    },
    {
      name: 'data-crl-url-qv',
      description: 'The link for the quickView button. The component will make an ajax call to load the content for the quick view overlay.'
    },
    {
      name: 'data-crl-type',
      description: 'The type of the item. By default the item has the image type. <br>Possible values: <code>\'none\'</code>, <code>\'image\'</code>, <code>\'iframe\'</code>, <code>\'video\'</code>.'
    }
  ];

  examplesGCDisplay: Example[] = [
    new Example(
      `HTML5 Video && IFrame`,
      `To add to the component the HTML5 video or IFrame content you have to use the <code>&lt;a&gt;</code> tag, adding the type of content: <code>iframe</code> or <code>video</code>.`,
      `<ul class='gc-start display1'>
  <li>
    <img src="assets/images/dress_green_1.jpg" alt='image1' data-gc-caption="Caption text" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image2' data-gc-caption="Caption text title2" />
  </li>
  <li>
      <a data-gc-type="iframe" href='https://www.youtube.com/embed/OfDNDKU8XoA' data-gc-width="640" data-gc-height="390"></a>
  </li>
  <li>
      <a data-gc-type="video" href="assets/images/clips-of-the-aurora-hd-stock-video.mp4"></a>
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" data-gc-caption="Caption text title3" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image4' data-gc-caption="Caption text title4" />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image5' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image6' data-gc-caption="Caption text title6" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image7' data-gc-caption="Caption text title7" />
  </li>
</ul>`,
`$('.display1').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'isSlowLens': true,
  'capZType': 'in',
  'isHoverShowThumbs': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333',
  'thumbsPosition': 'left'
});`
    ),
    new Example(
      `Autoplay of Display Images`,
      `By default, the <code>isAutoPlayDisplay</code> is disabled. To enable it, set it to <code>true</code>. The autoplay, also can be seen in overlay.`,
      `<ul class='gc-start display2'>
  <li>
      <img src="/assets/images/dress_green_1.jpg" alt='image1' />
  </li>
  <li>
      <img src="/assets/images/dress_redmix_1.jpg" alt='image2' />
  </li>
  <li>
      <img src="/assets/images/dress_green_2.jpg" />
  </li>
  <li>
      <img src="/assets/images/dress_redmix_2.jpg" alt='image4' />
  </li>
  <li>
      <img src="/assets/images/dress_green_3.jpg" alt='image5' />
  </li>
  <li>
      <img src="/assets/images/dress_green_4.jpg" alt='image6' />
  </li>
  <li>
      <img src="/assets/images/dress_redmix_3.jpg" alt='image7' />
  </li>
</ul>`,
`$('.display2').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'isSlowLens': true,
  'capZType': 'in',
  'isHoverShowThumbs': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333',
  'isAutoPlayDisplay': true,
  'zoomPosition': 'left'
});`
    ),
    new Example(
      `Callbacks`,
      `At Display level we have 2 callbacks that are managed through the options: <code>mouseEnterDisplayCB</code> && <code>mouseLeaveDisplayCB</code> that have the <code>function</code> type.`,
      `<div style="max-width: 370px; width: 100%;" class="div-display3">
  <ul class='gc-start display3'>
    <li>
        <img src="/assets/images/dress_green_1.jpg" alt='image1' />
    </li>
    <li>
        <img src="/assets/images/dress_redmix_1.jpg" alt='image2' />
    </li>
    <li>
        <img src="/assets/images/dress_green_2.jpg" />
    </li>
    <li>
        <img src="/assets/images/dress_redmix_2.jpg" alt='image4' />
    </li>
    <li>
        <img src="/assets/images/dress_green_3.jpg" alt='image5' />
    </li>
    <li>
        <img src="/assets/images/dress_green_4.jpg" alt='image6' />
    </li>
    <li>
        <img src="/assets/images/dress_redmix_3.jpg" alt='image7' />
    </li>
  </ul>
  <div class="tc-callout tc-callout-info pInstructions">
    <p class="card-text">Roll over the image to zoom in</p>
  </div>
</div>`,
`$('.pInstructions').hide();
$('.display3').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'isSlowLens': true,
  'capZType': 'in',
  'isHoverShowThumbs': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333',
  'mouseEnterDisplayCB': () => $('.pInstructions').text('Click to open expanded view'),
  'mouseLeaveDisplayCB': () => $('.pInstructions').text('Roll over image to zoom in')
});
setTimeout(() => $('.pInstructions').fadeIn(), 1000);`
    )
  ];
  examplesGCZoom: Example[] = [
    new Example(
      `Zoom on the Right`,
      `<p>By default, the Zoom Area is positioned on the right of the Display.</p>
  <div class="tc-callout tc-callout-info">
      <p>For images that are smaller than the Display Area, Zoom is disabled. For Zoom to appear, the images must be
bigger than the Display Area. Please see the <strong>3rd image</strong>.
      </p>
  </div>`,
      `<ul class='gc-start zoom1'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image1' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image2' />
  </li>
  <li>
      <img src="assets/images/dress_green_2_small.jpg" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image4' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image5' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image6' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image7' />
  </li>
</ul>`,
      `$('.zoom1').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`
    ),
    new Example(
      `Zoom on the Left`,
      `<p>Using <code>zoomPosition: 'left'</code> property you can set zoom in a different position.</p>`,
      `<ul class='gc-start zoom2'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.zoom2').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'zoomPosition': 'left',
  'isDownloadEnabled': false,
  'captionType': 'in',
  'captionPosition': 'bottom',
  'captionAlignment': 'right',
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`
    ),
    new Example(
      `Different Zoom height and width`,
      `<p>By default, the Zoom's width and height have the same size and are equal to the height of the Display Image.
    <br />Setting <code>isZoomDiffWH: true</code>, zoom's width and height will be proportional to the image's width and height. Setting
    <code>zoomWidth: X</code> or/and <code>zoomHeight: Y</code> will change the zoom's width and height. <br /> Also, through:
    <code>zoomAlignment: 'displayImage'</code> property you have the option to change the zoom alignment. </p>`,
      `<ul class='gc-start zoom3'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.zoom3').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'isZoomDiffWH': true,
  'zoomWidth': 400,
  'zoomHeight': 500,
  'zoomAlignment': 'displayArea',
  'isDownloadEnabled': false,
  'captionType': 'out',
  'captionPosition': 'bottom',
  'captionAlignment': 'center',
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`
    ),
    new Example(
      `Inner Zoom`,
      `<p>Using the <code>zoomPosition: 'inner'</code> property will set the zoom inside the Display Area.
    <br />In case that the zoom doesn't fit on the page, using the property <code>autoInnerZoom: true</code>, will set the zoom in
    <code>zoomPosition: 'inner'</code> mode.</p>`,
      `<ul class='gc-start zoom4'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.zoom4').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'zoomPosition': 'inner',
  'isDownloadEnabled': false,
  'captionType': 'out',
  'captionPosition': 'bottom',
  'captionAlignment': 'left',
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`
    )
  ];
  examplesGCThumbs: Example[] = [
    new Example(
      `Thumbs on Top with Slider`,
      `<p>Using the <code>thumbsPosition: 'top'</code> property you can chage the place where the thumbs are set.
    <br />Using the <code>nrThumbsPerRow: 4</code> property will set the number of thumbs per row.
    <br />Setting the <code>firstThumbSelected: 2</code>, after loading the 3 thumb will be selected (zero-based counting).</p>`,
      `<ul class='gc-start thumbs1'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.thumbs1').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'thumbsPosition': 'top',
  'firstThumbSelected': 2,
  'nrThumbsPerRow': 4,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`
    ),
    new Example(
      `Thumbs on Bottom in Rows`,
      `<p>Setting the <code>isThumbsOneRow: false</code> property will show all the thumbs in a grid.</p>`,
      `<ul class='gc-start thumbs2'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.thumbs2').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isThumbsOneRow': false,
  'zoomPosition': 'left',
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`),
    new Example(
      `Thumbs on the Left`,
      `<p>By default, the <code>slideType</code> has the value <code>slideRow</code>.</p>`,
      `<ul class='gc-start thumbs3'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.thumbs3').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'thumbsPosition': 'left',
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`),
    new Example(
      `Thumbs on the Right`,
      `<p>In this example, the <code>slideType</code> has the value <code>slideElement</code>.</p>`,
      `<ul class='gc-start thumbs4'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.thumbs4').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'thumbsPosition': 'right',
  'zoomPosition': 'left',
  'colorIcons': '#fff',
  'colorActiveThumb': '#333',
  'slideType': 'slideElement'
});`),
  ];
  examplesGCOverlay: Example[] = [
    new Example(
      `Fit Screen Mode`,
      `<p>Clicking on the Display Image, will open the Overlay. By default, the image is diplayed in Fit Screen Mode.
    <br />Double-clicking or pressing the Expand button will show the image in its natural size.</p>`,
      `<ul class='gc-start fo1'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.fo1').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isThumbsOneRow': false,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`),
    new Example(
      `Full Screen Mode`,
      `<p>Using the <code>isOverlayFullImage: true</code> will always show the image in the Overlay in Full Screen Mode.</p>`,
      `<ul class='gc-start fo2'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
`$('.fo2').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isOverlayFullImage': true,
  'zoomPosition': 'left',
  'isThumbsOneRow': false,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`)
  ];
  examplesGCCaptions: Example[] = [
    new Example(
      `Type - Inside, Position - Top`,
      ``,
      `<ul class='gc-start cap1'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image1' data-gc-caption="Caption text" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image2' data-gc-caption="Caption text title2" />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image3' data-gc-caption="Caption text title3" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image4' data-gc-caption="Caption text title4" />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image5' data-gc-caption="Caption text title5" />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image6' data-gc-caption="Caption text title6" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image7' data-gc-caption="Caption text title7" />
  </li>
</ul>`,
`$('.cap1').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'capZPos': 'top',
  'isShowAlwaysIcons': true,
  'isHoverShowThumbs': true,
  'isOverlayFullImage': false,
  'isThumbsOneRow': false,
  'isSlowZoom': true,
  'isSlowLens': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`),
    new Example(
      `Type - Outside, Position - Bottom`,
      ``,
      `<ul class='gc-start cap2'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image1' data-gc-caption="Caption text" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image2' data-gc-caption="Caption text title2" />
  </li>
  <li>
      <img src="assets/images/dress_green_2_small.jpg" data-gc-caption="Caption text title3" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image4' data-gc-caption="Caption text title4" />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image5' data-gc-caption="Caption text title5" />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image6' data-gc-caption="Caption text title6" />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image7' data-gc-caption="Caption text title7" />
  </li>
</ul>`,
      `$('.cap2').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isOverlayFullImage': false,
  'capZType': 'out',
  'isZCapEnabled': true,
  'capZPos': 'bottom',
  'zoomPosition': 'left',
  'isSlowZoom': true,
  'isSlowLens': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`)
  ];
  examplesGCGeneral: Example[] = [
    new Example(
      `Miscellaneous Features`,
      `<p>Hovering a thumb will change the display image. This feature can be enabled through:
    <code>isHoverShowThumbs: true</code>.
    <br />By default, the icons on the display area are shown only when the user hovers the area. Using the property
    <code>isShowAlwaysIcons: true</code> will always show the icons.
    <br />In case that a image wasn't loaded, in it's place will appear a holder. Its text can be customized through:
    <code>textImageNotLoaded: 'NO IMAGE'</code>.
    <br />Now you can customize the color of the loading wheel. This is done through:
    <code>colorLoading: '#E0A1A9'</code>.</p>`,
      `<ul class='gc-start gnr1'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_1.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_2.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_3.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_green_4.jpg" alt='image' />
  </li>
  <li>
      <img src="assets/images/dress_redmix_3.jpg" alt='image' />
  </li>
</ul>`,
      `$('.gnr1').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isShowAlwaysIcons': true,
  'isHoverShowThumbs': true,
  'isOverlayFullImage': false,
  'isThumbsOneRow': false,
  'isSlowZoom': true,
  'isSlowLens': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`),
    new Example(
      `One Thumb Image`,
      `<p>By default, when the list has only one item, the thumb isn't shown. The prev/next buttons are disabled and not visible. Using
    the <code>isOneThumbShown: true</code> property will show the thumb.</p>`,
      `<ul class='gc-start gnr2'>
  <li>
      <img src="assets/images/dress_green_1.jpg" alt='image' />
  </li>
</ul>`,
`$('.gnr2').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'zoomPosition': 'left',
  'isSlowZoom': true,
  'isSlowLens': true,
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});`),
    new Example(
      `Dynamic change of images`,
      `<p><span>Select a Color:</span>&nbsp;
                      <select class="tcSelectColor">
                          <option value="1">Green</option>
                          <option value="2">Red</option>
                      </select>
        </p>`,
      `<div class="gallery" style="max-width: 370px; width: 100%;">
  <ul class='gc-start gnr3'>
    <li>
        <img src="assets/images/dress_green_1.jpg" alt='image' />
    </li>
    <li>
        <img src="assets/images/dress_green_2.jpg" alt='image' />
    </li>
    <li>
        <img src="assets/images/dress_green_3.jpg" alt='image' />
    </li>
    <li>
        <img src="assets/images/dress_green_4.jpg" alt='image' />
    </li>
  </ul>
</div>`,
      `$('.gnr3').glassCase({
  'widthDisplay': 370,
  'heightDisplay': 550,
  'isSlowZoom': true,
  'thumbsPosition': 'left',
  'colorIcons': '#fff',
  'colorActiveThumb': '#333'
});

//Handler for the change event of the dropdown, resposible for color change
$('.tcSelectColor').on('change', function (event) {
  let code = \`\`;

  if (event.target.selectedIndex) {
    code = \`<ul class='gc-start gnr3'>
    <li><img src='assets/images/dress_redmix_1.jpg' alt='image' /></li>
    <li><img src='assets/images/dress_redmix_2.jpg' alt='image' /></li>
    <li><img src='assets/images/dress_redmix_3.jpg' alt='image' /></li>
    </ul>\`;
  } else {
    code = \`<ul class='gc-start gnr3'>
    <li><img src="assets/images/dress_green_1.jpg" alt='image' /></li>
    <li><img src="assets/images/dress_green_2.jpg" alt='image' /></li>
    <li><img src="assets/images/dress_green_3.jpg" alt='image' /></li>
    <li><img src="assets/images/dress_green_4.jpg" alt='image' /></li>
    </ul>\`;
  }
  $('.gallery').html(code);
  $('.gallery ul').glassCase({
    'widthDisplay': 310,
    'heightDisplay': 461,
    'isSlowZoom': true,
    'thumbsPosition': 'left',
    'colorActiveThumb': '#333'
  });
});`)
  ];
  
  examplesOBSingleGrouped: Example[] = [
    new Example(
      `Single element`,
      ``,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a class='ob-content1 tc-ob-holder mat-elevation-z1' href='assets/images/img1.jpg' data-ob-info="Lorem ipsum dolor sit amet, usu enim laoreet te, sea error dolorum in. Id per dico complectitur. Est no propriae ponderum, at alii legimus adipiscing qui. Eos quem suscipiantur et, labitur scripserit vel cu, cu sea iusto postea. Suas meliore sententiae nam at, nam esse molestie cu.">Image</a>
    <a class='ob-content1 tc-ob-holder mat-elevation-z1' href='assets/images/img2.jpg' data-ob-info="Choro periculis complectitur has et, eos in elitr labores, iracundia argumentum eum in. Eum unum illum populo ne. Docendi ancillae pri id, bonorum intellegat eum eu, numquam imperdiet in sit. Nihil putant accommodare ex mel, qui atqui dicit noster ut. Dicam graeci propriae sed ne, his albucius moderatius te, an adhuc idque vix.">Image</a>
    <a class='ob-content1 tc-ob-holder mat-elevation-z1' href='assets/images/img3.jpg' data-ob-info="Mel reque illum simul ne, habeo augue definitionem ius ne. Ea usu saperet periculis, mea ei laoreet scaevola. Dicta discere cu usu, sed ei denique delicatissimi. Vel atomorum deterruisset ne. Mei esse dicant feugiat ex, alterum ceteros ne nec.">Image</a>
  </div>
  <div class="tc-ob-container-row tc-ob-container-row-center">
    <a class='ob-content1 tc-ob-holder mat-elevation-z1' href='assets/images/img4.jpg' data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a class='ob-content1 tc-ob-holder mat-elevation-z1' href='assets/images/img5.jpg' data-ob-info="Ex sit dolor consetetur accommodare. Pro id magna facer velit. At munere nonumes pri. Eu pro agam facilisis qualisque, his offendit contentiones an. Ut cum quem veniam inermis.">Image</a>
    <a class='ob-content1 tc-ob-holder mat-elevation-z1' href='assets/images/img6.jpg' data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a class='ob-content1 tc-ob-holder mat-elevation-z1' href='assets/images/img7.jpg' data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.ob-content1').overbox('.ob-content1', {});`
    ),
    new Example(
      `Group of elements`,
      `<p>To group elements just add to each item of the group the data attribute <code>data-ob-group = "your_group_name"</code>.</p>`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a class='ob-content2 tc-ob-holder mat-elevation-z1' data-ob-group="gr2" href='assets/images/img1.jpg' data-ob-info="Lorem ipsum dolor sit amet, usu enim laoreet te, sea error dolorum in. Id per dico complectitur. Est no propriae ponderum, at alii legimus adipiscing qui. Eos quem suscipiantur et, labitur scripserit vel cu, cu sea iusto postea. Suas meliore sententiae nam at, nam esse molestie cu.">Image</a>
    <a class='ob-content2 tc-ob-holder mat-elevation-z1' data-ob-group="gr2" href='assets/images/img2.jpg' data-ob-info="Choro periculis complectitur has et, eos in elitr labores, iracundia argumentum eum in. Eum unum illum populo ne. Docendi ancillae pri id, bonorum intellegat eum eu, numquam imperdiet in sit. Nihil putant accommodare ex mel, qui atqui dicit noster ut. Dicam graeci propriae sed ne, his albucius moderatius te, an adhuc idque vix.">Image</a>
    <a class='ob-content2 tc-ob-holder mat-elevation-z1' data-ob-group="gr2" href='assets/images/img3.jpg' data-ob-info="Mel reque illum simul ne, habeo augue definitionem ius ne. Ea usu saperet periculis, mea ei laoreet scaevola. Dicta discere cu usu, sed ei denique delicatissimi. Vel atomorum deterruisset ne. Mei esse dicant feugiat ex, alterum ceteros ne nec.">Image</a>
  </div>
  <div class="tc-ob-container-row tc-ob-container-row-center">
    <a class='ob-content2 tc-ob-holder mat-elevation-z1' data-ob-group="gr2" href='assets/images/img4.jpg' data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a class='ob-content2 tc-ob-holder mat-elevation-z1' data-ob-group="gr2" href='assets/images/img5.jpg' data-ob-info="Ex sit dolor consetetur accommodare. Pro id magna facer velit. At munere nonumes pri. Eu pro agam facilisis qualisque, his offendit contentiones an. Ut cum quem veniam inermis.">Image</a>
    <a class='ob-content2 tc-ob-holder mat-elevation-z1' data-ob-group="gr2" href='assets/images/img6.jpg' data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a class='ob-content2 tc-ob-holder mat-elevation-z1' data-ob-group="gr2" href='assets/images/img7.jpg' data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.ob-content2').overbox('.ob-content2');`
    )
  ];
  examplesOBContentType: Example[] = [
    new Example(
      `Ajax`,
      `<p>The ajax content was let to be positioned as the user desires. In
      <em>example 1</em> the content was placed in the middle of the container. Also, if an error will be encountered
during the process of getting the ajax content then a holder, with customizable text will be shown, see <em>example 2</em>.</p>`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='assets/ajax/test.html' class='ob-content3 tc-ob-holder mat-elevation-z1' data-ob-type="ajax">Ajax</a>
    <a href='/test1.html' class='ob-content3 tc-ob-holder mat-elevation-z1' data-ob-type="ajax">Ajax Error</a>
  </div>
</div>`,
      `$('.ob-content3').overbox('.ob-content3', { 
  'isInfoEnabled': false 
});`),
    new Example(
      `IFrame`,
      `<p>OverBox can show several types of content. To display an iframe content add to the item the data attribute:
      <code>data-ob-type = "iframe"</code>. To change the width and/or height of the content, just add to the element the
following data attributes: <code>data-ob-width = "your_value"</code> and/or <code>data-ob-height = "your_value"</code>.</p>`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='//www.youtube.com/embed/0vxOhd4qlnA' class='ob-content4 tc-ob-holder mat-elevation-z1' data-ob-group="gr4" data-ob-type="iframe">Youtube</a>
    <a href='//player.vimeo.com/video/69225705' class='ob-content4 tc-ob-holder mat-elevation-z1' data-ob-group="gr4" data-ob-type="iframe">Vimeo</a>
    <a href='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3037.7773921218754!2d-3.6921269999999993!3d40.413782000000005!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42289d66d8a2ed%3A0x1094f07d93ad885a!2sMuseo+Nacional+del+Prado!5e0!3m2!1sen!2s!4v1418217930952' class='ob-content4 tc-ob-holder mat-elevation-z1' data-ob-group="gr4" data-ob-type="iframe" data-ob-width="800" data-ob-height="500">Google Maps</a>
  </div>
  <div class="tc-ob-container-row">
    <a href='https://www.bing.com/maps/embed?h=500&w=800&cp=40.413815~-3.692195&lvl=10&typ=d&sty=r&src=SHELL&FORM=MBEDV8' class='ob-content4 tc-ob-holder mat-elevation-z1' data-ob-group="gr4" data-ob-type="iframe" data-ob-width="800" data-ob-height="500">Bing Maps</a>
    <a href='https://instagram.com/p/laFnNmhL35/embed/' class='ob-content4 tc-ob-holder mat-elevation-z1' data-ob-group="gr4" data-ob-type="iframe" data-ob-width="800" data-ob-height="500">Instagram</a>
  </div>
</div>`,
      `$('.ob-content4').overbox('.ob-content4', { 
  'isInfoEnabled': false, 
  'obOpeningType': 'obCntPush', 
  'obNavType': 'obSoftScale' 
});`),
    new Example(
      `Video HTML5`,
      `<p>To display Video HTML5 content add to the item the data attribute: <code>data-ob-type = "video"</code>. 
      If you want to specify multiple source files(multiple formats) use the data attribute: 
      <code>data-ob-formats = ["/images/m1.webm"]</code>.</p>`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a class='ob-content5 tc-ob-holder mat-elevation-z1' data-ob-type="video" href="/images/clips-of-the-aurora-hd-stock-video.mp4" data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Video HTML5</a>
  </div>
</div>`,
      `$('.ob-content5').overbox('.ob-content5', { 
  'obOpeningType': 'obAnimOCO', 
  'obNavType': 'obSlide' 
});`
    )
  ];
  examplesOBEffects: Example[] = [
    new Example(
      `Open / Close`,
      `<p>Changing the opening and closing type of the overbox can be done through the option <code>obOpenCloseType</code>.<br />
        e.g.:
        <code>'obOpenCloseType': 'obAnimOCO'</code>.
      </p>
      <p>
        <span>Select an Open/Close effect:</span>&nbsp;
        <select class="tcSelectColor tcSelectOpenClose">
          <option value="1">obCorner</option>
          <option value="2">obDoor</option>
          <option value="3">obAnimOCO</option>
          <option value="4">obHuge</option>
          <option value="5">obCntPush</option>
        </select>
      </p>`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='assets/images/img1.jpg' class='ob-content11 tc-ob-holder mat-elevation-z1' data-ob-group="gr11" data-ob-info="Lorem ipsum dolor sit amet, no minim postulant sed, mea eligendi consetetur ut. Nam eu utinam meliore ceteros, mei partiendo complectitur cu. Natum singulis ex ius, et rebum invenire eos. In persius officiis reprehendunt sed, ei animal noluisse explicari vim, sea choro quidam ei. Sit cu ceteros intellegat, ei tamquam inermis accusata qui. Est id sumo dolorem pertinacia, ei nec impedit gloriatur, virtute senserit scripserit cu per.">Image</a>
    <a href='assets/images/img2.jpg' class='ob-content11 tc-ob-holder mat-elevation-z1' data-ob-group="gr11" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img3.jpg' class='ob-content11 tc-ob-holder mat-elevation-z1' data-ob-group="gr11" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
  <div class="tc-ob-container-row  tc-ob-container-row-center">
    <a href='assets/images/img4.jpg' class='ob-content11 tc-ob-holder mat-elevation-z1' data-ob-group="gr11" data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a href='assets/images/img5.jpg' class='ob-content11 tc-ob-holder mat-elevation-z1' data-ob-group="gr11" data-ob-info="Skating on Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
    <a href='assets/images/img6.jpg' class='ob-content11 tc-ob-holder mat-elevation-z1' data-ob-group="gr11" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img7.jpg' class='ob-content11 tc-ob-holder mat-elevation-z1' data-ob-group="gr11" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.tcSelectOpenClose').on('change', function (event) {
  $('.ob-content11').overbox('.ob-content11', { 'obOpenCloseType': event.target.selectedOptions[0].text, destroy: true });
  });

$('.ob-content11').overbox('.ob-content11', { 'isInfoEnabled': false });`
    ),
    new Example(
      `Navigation`,
      `<p> You can change the navigation type by using the option <code>obNavType</code>.
          <br /> e.g.: <code>'obNavType': 'obSlide'</code>.
      </p>
      <p>
          <span>Select a Navigation effect:</span>&nbsp;

          <select class="tcSelectColor tcSelectNav">
              <option value="1">obPressAway</option>
              <option value="2">obSlide</option>
              <option value="3">obSoftScale</option>
              <option value="4">obLetIn</option>
              <option value="5">obFortuneWheel</option>
          </select>
      </p>`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='assets/images/img1.jpg' class='ob-content12 tc-ob-holder mat-elevation-z1' data-ob-group="gr12" data-ob-info="Lorem ipsum dolor sit amet, no minim postulant sed, mea eligendi consetetur ut. Nam eu utinam meliore ceteros, mei partiendo complectitur cu. Natum singulis ex ius, et rebum invenire eos. In persius officiis reprehendunt sed, ei animal noluisse explicari vim, sea choro quidam ei. Sit cu ceteros intellegat, ei tamquam inermis accusata qui. Est id sumo dolorem pertinacia, ei nec impedit gloriatur, virtute senserit scripserit cu per.">Image</a>
    <a href='assets/images/img2.jpg' class='ob-content12 tc-ob-holder mat-elevation-z1' data-ob-group="gr12" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img3.jpg' class='ob-content12 tc-ob-holder mat-elevation-z1' data-ob-group="gr12"
        data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
  <div class="tc-ob-container-row  tc-ob-container-row-center">
    <a href='assets/images/img4.jpg' class='ob-content12 tc-ob-holder mat-elevation-z1' data-ob-group="gr12" data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a href='assets/images/img5.jpg' class='ob-content12 tc-ob-holder mat-elevation-z1' data-ob-group="gr12" data-ob-info="Skating on Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
    <a href='assets/images/img6.jpg' class='ob-content12 tc-ob-holder mat-elevation-z1' data-ob-group="gr12" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img7.jpg' class='ob-content12 tc-ob-holder mat-elevation-z1' data-ob-group="gr12" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.ob-content12').overbox('.ob-content12', { 'isInfoEnabled': false });   

$('.tcSelectNav').on('change', function (event) {
  $('.ob-content12').overbox('.ob-content12', { 'obNavType': event.target.selectedOptions[0].text, destroy: true });
});`)
  ];
  examplesOBGeneral: Example[] = [
    new Example(
      `Infinite Navigation`,
      `To enable infinite navigation, just add to the call the option <code>isInfiniteGroup: true</code>.`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='assets/images/img1.jpg' class='ob-content6 tc-ob-holder mat-elevation-z1' data-ob-group="gr6" data-ob-info="Lorem ipsum dolor sit amet, no minim postulant sed, mea eligendi consetetur ut. Nam eu utinam meliore ceteros, mei partiendo complectitur cu. Natum singulis ex ius, et rebum invenire eos. In persius officiis reprehendunt sed, ei animal noluisse explicari vim, sea choro quidam ei. Sit cu ceteros intellegat, ei tamquam inermis accusata qui. Est id sumo dolorem pertinacia, ei nec impedit gloriatur, virtute senserit scripserit cu per.">Image</a>
    <a href='assets/images/img2.jpg' class='ob-content6 tc-ob-holder mat-elevation-z1' data-ob-group="gr6" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img3.jpg' class='ob-content6 tc-ob-holder mat-elevation-z1' data-ob-group="gr6" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
  <div class="tc-ob-container-row  tc-ob-container-row-center">
    <a href='assets/images/img4.jpg' class='ob-content6 tc-ob-holder mat-elevation-z1' data-ob-group="gr6" data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a href='assets/images/img5.jpg' class='ob-content6 tc-ob-holder mat-elevation-z1' data-ob-group="gr6" data-ob-info="Skating on Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
    <a href='assets/images/img6.jpg' class='ob-content6 tc-ob-holder mat-elevation-z1' data-ob-group="gr6" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img7.jpg' class='ob-content6 tc-ob-holder mat-elevation-z1' data-ob-group="gr6" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.ob-content6').overbox('.ob-content6', { 'isInfiniteGroup': true });`
    ),
    new Example(
      `Deeplinking`,
      `To enable deeplinking, add to the call the option <code>isDeepLinkingEnabled: true</code>. The link will have the following format: <code>http://www.your-site.com/page#overbox3/object1</code>. It is made of 2 prefixes: group prefix(by default it's
overbox) and object prefix(by default it's object). Through options you can change both values: <code>dlGroupPrefix: 'new_group_name'</code> and <code>dlObjectPrefix: 'new_object_name'</code>.`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='assets/images/img1.jpg' class='ob-content7 tc-ob-holder mat-elevation-z1' data-ob-group="gr7" data-ob-info="Lorem ipsum dolor sit amet, no minim postulant sed, mea eligendi consetetur ut. Nam eu utinam meliore ceteros, mei partiendo complectitur cu. Natum singulis ex ius, et rebum invenire eos. In persius officiis reprehendunt sed, ei animal noluisse explicari vim, sea choro quidam ei. Sit cu ceteros intellegat, ei tamquam inermis accusata qui. Est id sumo dolorem pertinacia, ei nec impedit gloriatur, virtute senserit scripserit cu per.">Image</a>
    <a href='assets/images/img2.jpg' class='ob-content7 tc-ob-holder mat-elevation-z1' data-ob-group="gr7" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img3.jpg' class='ob-content7 tc-ob-holder mat-elevation-z1' data-ob-group="gr7" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
  <div class="tc-ob-container-row  tc-ob-container-row-center">
    <a href='assets/images/img4.jpg' class='ob-content7 tc-ob-holder mat-elevation-z1' data-ob-group="gr7" data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a href='assets/images/img5.jpg' class='ob-content7 tc-ob-holder mat-elevation-z1' data-ob-group="gr7" data-ob-info="Skating on Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
    <a href='assets/images/img6.jpg' class='ob-content7 tc-ob-holder mat-elevation-z1' data-ob-group="gr7" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img7.jpg' class='ob-content7 tc-ob-holder mat-elevation-z1' data-ob-group="gr7" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.ob-content7').overbox('.ob-content7', { 'isDeepLinkingEnabled': true });`
    ),
    new Example(
      'Positioning the Control bar on the left',
      `You can change the position of the control bar using the option <code>posControlBar: 'left'</code>.`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='assets/images/img1.jpg' class='ob-content8 tc-ob-holder mat-elevation-z1' data-ob-group="gr8" data-ob-info="Lorem ipsum dolor sit amet, no minim postulant sed, mea eligendi consetetur ut. Nam eu utinam meliore ceteros, mei partiendo complectitur cu. Natum singulis ex ius, et rebum invenire eos. In persius officiis reprehendunt sed, ei animal noluisse explicari vim, sea choro quidam ei. Sit cu ceteros intellegat, ei tamquam inermis accusata qui. Est id sumo dolorem pertinacia, ei nec impedit gloriatur, virtute senserit scripserit cu per.">Image</a>
    <a href='assets/images/img2.jpg' class='ob-content8 tc-ob-holder mat-elevation-z1' data-ob-group="gr8" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img3.jpg' class='ob-content8 tc-ob-holder mat-elevation-z1' data-ob-group="gr8" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
  <div class="tc-ob-container-row  tc-ob-container-row-center">
    <a href='assets/images/img4.jpg' class='ob-content8 tc-ob-holder mat-elevation-z1' data-ob-group="gr8" data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a href='assets/images/img5.jpg' class='ob-content8 tc-ob-holder mat-elevation-z1' data-ob-group="gr8" data-ob-info="Skating on Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
    <a href='assets/images/img6.jpg' class='ob-content8 tc-ob-holder mat-elevation-z1' data-ob-group="gr8" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img7.jpg' class='ob-content8 tc-ob-holder mat-elevation-z1' data-ob-group="gr8" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.ob-content8').overbox('.ob-content8', { 'posControlBar': 'left' });`
    ),
    new Example(
      'Disabling the Info Bar',
      `You can disable the info bar by using the option <code>isInfoEnabled: false</code>.`,
      `<div class="tc-ob-container">
  <div class="tc-ob-container-row">
    <a href='assets/images/img1.jpg' class='ob-content9 tc-ob-holder mat-elevation-z1' data-ob-group="gr9" data-ob-info="Lorem ipsum dolor sit amet, no minim postulant sed, mea eligendi consetetur ut. Nam eu utinam meliore ceteros, mei partiendo complectitur cu. Natum singulis ex ius, et rebum invenire eos. In persius officiis reprehendunt sed, ei animal noluisse explicari vim, sea choro quidam ei. Sit cu ceteros intellegat, ei tamquam inermis accusata qui. Est id sumo dolorem pertinacia, ei nec impedit gloriatur, virtute senserit scripserit cu per.">Image</a>
    <a href='assets/images/img2.jpg' class='ob-content9 tc-ob-holder mat-elevation-z1' data-ob-group="gr9" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img3.jpg' class='ob-content9 tc-ob-holder mat-elevation-z1' data-ob-group="gr9" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
  <div class="tc-ob-container-row  tc-ob-container-row-center">
    <a href='assets/images/img4.jpg' class='ob-content9 tc-ob-holder mat-elevation-z1' data-ob-group="gr9" data-ob-info="Modo pertinax ei pro, at mel meis necessitatibus. Dicunt viderer instructior nec id, ei sit vero euismod. Case nobis feugiat mel ne, quod persecuti honestatis an mel, te labitur dissentiet vel. Ea summo percipitur per, ei facer euripidis voluptaria vis. Ne affert tollit munere pro. Cu velit putent pri, at quo duis populo ocurreret.">Image</a>
  </div>
  <div class="tc-ob-container-row">
    <a href='assets/images/img5.jpg' class='ob-content9 tc-ob-holder mat-elevation-z1' data-ob-group="gr9" data-ob-info="Skating on Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
    <a href='assets/images/img6.jpg' class='ob-content9 tc-ob-holder mat-elevation-z1' data-ob-group="gr9" data-ob-info="Id ludus exerci est, pri inciderint contentiones definitiones at. Duo ex feugait praesent. Epicurei tacimates te ius, qui ut fabulas inimicus. Cu veniam utinam contentiones vel, qui no suas modus.">Image</a>
    <a href='assets/images/img7.jpg' class='ob-content9 tc-ob-holder mat-elevation-z1' data-ob-group="gr9" data-ob-info="Eirmod neglegentur no pro. Tation exerci nostrum te eum, in est velit invidunt. Ex pri option ullamcorper, ius quando argumentum mediocritatem id. Alia mazim definitiones ne vis, sea id prima etiam, ea dico aeterno theophrastus eum. Falli aperiam eum eu, sit at tota illum vidisse. Mel et vide delenit. Harum vocibus volutpat ex vix, nostrud sadipscing eum ex, dolore essent appareat ei sed.">Image</a>
  </div>
</div>`,
      `$('.ob-content9').overbox('.ob-content9', { 'isInfoEnabled': false });`
    )
  ];
  
  examplesSolItemsPanel: Example[] = [ new Example(
      `Responsive Display`,
      `To create a resposive display we have 5 options that manage the number of itemsPanel shown in a slide. Each option corresponds to a responsive breakpoint. See the table below.
      <br/>
      <table class="table table-bordered table-striped mt-5">
                    <thead>
                        <tr>
                            <th></th>
                            <th class="text-center">Extra small<br>
                                <small>&lt;576px</small>
                            </th>
                            <th class="text-center">Small<br>
                                <small>≥576px</small>
                            </th>
                            <th class="text-center">Medium<br>
                                <small>≥768px</small>
                            </th>
                            <th class="text-center">Large<br>
                                <small>≥992px</small>
                            </th>
                            <th class="text-center">Extra large<br>
                                <small>≥1200px</small>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th class="text-nowrap tc-table-title">Option Name</th>
                            <td>nrItemsPerSlideSP</td>
                            <td>nrItemsPerSlideP</td>
                            <td>nrItemsPerSlideT</td>
                            <td>nrItemsPerSlideL</td>
                            <td>nrItemsPerSlide</td>
                        </tr>
                        <tr>
                            <th class="text-nowrap tc-table-title">Nr. of itemsPanel shown</th>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                        </tr>
                    </tbody>
                </table>
      `,
      `<ul class="sCarouselIP1 crlStart">
  <li>
    <a href="assets/images/img_sol_1.jpg" data-crl-link="examples" data-crl-title="Product Title1" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_2.jpg" data-crl-link="examples" data-crl-title="Product Title2" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_3.jpg" data-crl-link="examples" data-crl-title="Product Title3" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>data-crl-title="Product Title" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_4.jpg" data-crl-link="examples" data-crl-title="Product Title4" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_5.jpg" data-crl-link="examples" data-crl-title="Product Title5" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_6.jpg" data-crl-link="examples" data-crl-title="Product Title6" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_7.jpg" data-crl-link="examples" data-crl-title="Product Title7" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_8.jpg" data-crl-link="examples" data-crl-title="Product Title8" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_9.jpg" data-crl-link="examples" data-crl-title="Product Title9" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
</ul>`,
      `$('.sCarouselIP1').solCarousel({
  'itemPanelStyle': 'style1',
  'arrowsNavStyle': 'circle',        
  'slidesNavStyle': 'circleOutline',
  'nrItemsPerSlide': 4,
  'colorQuickViewBtn': '#777777',
  'totalTitleLines': 1,
  'totalTextLines': 5
});`), 
new Example(`QuickView`, 
`<p>Each itemPanel can have a <strong>QuickView</strong>. A QuickView is composed of: a <strong>button</strong> that is placed inside the itemPanel and an <strong>overlay</strong> which appears after clicking the button. The content in the overlay is loaded using the data-attribute <code>data-crl-url-qv</code>. This attribute is set at item level.
          The QuickView button's position can be changed through the option <code>posQuickView</code>. The text of the button can be changed using the option <code>txtQuickViewBnt</code>.
      </p>`,
`<ul class="sCarouselIP2 crlStart">
  <li>
    <a href="assets/images/img_sol_1.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-type="image"/>
  </li>
  <li>
    <a href="assets/images/img_sol_2.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-type="image"/>
  </li>
  <li>
    <a href="assets/images/img_sol_3.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-type="image"/>
  </li>
  <li>
    <a href="assets/images/img_sol_4.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-type="image"/>
  </li>
  <li>
    <a href="assets/images/img_sol_5.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-type="image"/>
  </li>
  <li>
    <a href="assets/images/img_sol_6.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-type="image"/>
  </li>
  <li>
    <a href="assets/images/img_sol_7.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-type="image"/>
  </li>
</ul>`,
    `$('.sCarouselIP2').solCarousel({
  'showQuickView': true,
  'posQuickView': 'bottom_center',
  'posItemTitle': 'center',
  'posItemText': 'center',
  'slidesNavStyle': 'line',
  'colorQuickViewBtn': '#777777'
});`
), new Example(
      `Delete Items && Component`,
      `<p>
    To delete an item from the itemsPanel use the option <code>'hasDeleteBtn': true</code>. To delete the whole component call the plugin with the option <code>'delete': true</code>.
</p>
      `,
      `<p>
  <button class="tc-btn btn-outline-secondary btnDelete" type="button">Delete Component</button>
</p>
<ul class="sCarouselIP3 crlStart">
  <li>
      <a href="assets/images/img_sol_1.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_2.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_3.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_4.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_5.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_6.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_7.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_8.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_9.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
</ul>`,
`
$('.btnDelete').on('click', function () {
  $('.sCarouselIP3').solCarousel({
    'delete': true
  });
});
$('.sCarouselIP3').solCarousel({
  'hasDeleteBtn': true,
  'posItemTitle': 'center',
  'posItemText': 'center',
  'slidesNavStyle': 'circleOutline'
});
`)
  ];
  examplesSolContentType: Example[] = [
    new Example(
      `IFrame`,
      `<p>The main part of SolCarousel is the <strong>itemsPanel</strong> - the part that holds carousel's content.</p>
  <p>Each itemPanel can have a media object. The <strong>media object</strong> can be: an image(default), an iFrame or a html5 Video. The type of the media object is specified through the data attribute <code>data-crl-type</code>.</p>`,
      `<ul class="sCarouselCT1 crlStart">
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
  </ul>`,
  `$('.sCarouselCT1').solCarousel({
  'nrItemsPerSlide': 4,
  'nrItemsPerSlideL': 4,
  'nrItemsPerSlideT': 3,
  'nrItemsPerSlideP': 3,
  'nrItemsPerSlideSP': 2,
  'slidesNavStyle': 'circle'
});`
    ),
    new Example(
      `HTML5`,
      ``,
      `<ul class="sCarouselCT2 crlStart">
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
  </ul>`,
  `$('.sCarouselCT2').solCarousel({
  'nrItemsPerSlide': 4,
  'nrItemsPerSlideL': 4,
  'nrItemsPerSlideT': 3,
  'nrItemsPerSlideP': 3,
  'nrItemsPerSlideSP': 2,
});`
    ),
    new Example(
      `None - No Media Object`,
      `<p>In case that you don't want to have a media object, set <code>data-crl-type='none'</code>.</p>`,
      `<ul class="sCarouselCT3 crlStart">
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
    <li>
        <a data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
    </li>
  </ul>`,
`$('.sCarouselCT3').solCarousel({
  'posItemTitle': 'center',
  'posItemText': 'center',
  'arrowsNavPos': 'top',
  'arrowsNavStyle': 'square',
  'slidesNavStyle': 'squareOutline'
});`
    ),
    new Example(
      `Mixed Content`,
      ``,
      `<ul class="sCarouselCT4 crlStart">
  <li>
      <a href="assets/images/img_sol_1.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="https://www.youtube.com/embed/OfDNDKU8XoA" data-crl-type='iframe' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/clips-of-the-aurora-hd-stock-video.mp4" data-crl-type='video' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_4.jpg" data-crl-type='none' data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_5.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_6.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_7.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_8.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_9.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
</ul>`,
  `$('.sCarouselCT4').solCarousel({
    'posItemTitle': 'center',
    'posItemText': 'center',
    'arrowsNavStyle': 'square',
    'slidesNavStyle': 'squareOutline',
    'vposMedia': 'bottom'
  });`
    )
    
  ];
  examplesSolNavigation: Example[] = [
    new Example(
      `Navigation Type`,
      `<p>
      By default, SolCarousel uses the <strong>slide</strong> navigation type. To change the navigation type use the option <code>'navType': 'element'</code>. The <em>slidesNav</em>( the "dots" ) appear only when <code>'navType': 'slide'</code>.
  </p>`,
      `<ul class="sCarouselNT1 crlStart">
  <li>
      <a href="assets/images/img_sol_1.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_2.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_3.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_4.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_5.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_6.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_7.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_8.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
  <li>
      <a href="assets/images/img_sol_9.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
  </li>
</ul>`,
  `$('.sCarouselNT1').solCarousel({
  'navType': 'element',
  'arrowsNavPos': 'bottom',
  'arrowsNavStyle': 'square',
  'showQuickView': true,
  'posQuickView': 'inner_center'
});`
    ),
    new Example(
      `Infinite Navigation`,
      `<p>To enable infinite navigation use the option <code>'isInfiniteNav': true</code>.</p>`,
      `<ul class="sCarouselNT2 crlStart">
      <li>
          <a href="assets/images/img_sol_1.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_2.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_3.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_4.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_5.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_6.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_7.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_8.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
      <li>
          <a href="assets/images/img_sol_9.jpg" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a>
      </li>
  </ul>`,
  `$('.sCarouselNT2').solCarousel({
  'isInfiniteNav': true,
  'posItemTitle': 'center',
  'posItemText': 'center',
  'arrowsNavStyle': 'circle',
  'slidesNavStyle': 'circleOutline'
});`
    ),
    new Example(
      `Auto Play`,
      `<p>To enable the auto play of items in the component use the option <code>'isAutoPlay': true</code>.</p>
      <div class="tc-callout tc-callout-warning rounded-0">
          <p class="card-text">
              Having <code>'isInfiniteNav': false</code> the autoplay will stop at the end of carousel. So, to have a continuos movement, also set <code>'isInfiniteNav': true</code>.
          </p>
      </div>
      <div class="tc-callout tc-callout-info rounded-0">
          <p class="card-text">
              Hovering an itemPanel or opening the overlay from the quickView will pause the autoplay.
          </p>
      </div>`,
      `<ul class="sCarouselNT3 crlStart">
    <li><a href="assets/images/img_sol_1.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a></li>
    <li><a href="assets/images/img_sol_2.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a></li>
    <li><a href="assets/images/img_sol_3.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a></li>
    <li><a href="assets/images/img_sol_4.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a></li>
    <li><a href="assets/images/img_sol_5.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a></li>
    <li><a href="assets/images/img_sol_6.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a></li>
    <li><a href="assets/images/img_sol_7.jpg" data-crl-url-qv="assets/sol-jquery-carousel-plugin/test.html" data-crl-text="<p><b>Lorem</b> ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>"></a></li>
</ul>`,
  `$('.sCarouselNT3').solCarousel({
  'isInfiniteNav': true,
  'isAutoPlay': true,
  'posItemTitle': 'center',
  'posItemText': 'center',
  'slidesNavStyle': 'line',
  'showQuickView': true,
  'posQuickView': 'bottom_center'
});`
  )];

  featuresContentGC: ContentFeatures = {
    code: `
        <ul id='girlstop1' class='gc-start'>
                <li>
                    <img src="assets/images/dress_green_1.jpg" alt='image1 qwerty' data-gc-caption="Caption text" />
                </li>
                <li>
                    <img src="assets/images/dress_redmix_1.jpg" alt='image2' data-gc-caption="Caption text title2" />
                </li>
                <li>
                    <a data-gc-type="iframe" href='https://www.youtube.com/embed/OfDNDKU8XoA' data-gc-width="640"
                        data-gc-height="390"></a>
                </li>
                <li>
                    <a data-gc-type="video" href="assets/images/clips-of-the-aurora-hd-stock-video.mp4"></a>
                </li>
                <li>
                    <img src="assets/images/dress_green_2.jpg" data-gc-caption="Caption text title3" />
                </li>
                <li>
                    <img src="assets/images/dress_redmix_2.jpg" alt='image4' data-gc-caption="Caption text title4" />
                </li>
                <li>
                    <img src="assets/images/dress_green_3.jpg" alt='image5' />
                </li>
                <li>
                    <img src="assets/images/dress_green_4.jpg" alt='image6' data-gc-caption="Caption text title6" />
                </li>
                <li>
                    <img src="assets/images/dress_redmix_3.jpg" alt='image7' data-gc-caption="Caption text title7" />
                </li>
            </ul>
        `,
    overview: {
      title: 'Overview',
      list: ['Responsive and Touch Enabled – enjoy mobile experience',
        'Support of different content type: Video && Images',
        '1 Set of Images with Different Sizes – no need of thumbs images',
        'Thumbs – automatically generated and positioned',
        '1 Click Full Screen Overlay – built-in Lightbox',
        'Transition Effects for Zoom and Lens',
        '3 Clicks to Install',
        '50 Options for Customization – really flexible',
        'FREE 6 months included support'
      ]
    },
    features: [
      {
        title: 'Resp. && Touch Enabled',
        icon: 'mobile_friendly',
        list: [
          'Works on any screen size.',
          'Ready to be used on touch enabled devices.'
        ]
      },
      {
        title: 'Zoom',
        icon: 'zoom_in',
        list: [
          'Positioning: Left, Right or Inner.',
          'Width and Height - Customizable.',
          'Alignment: Display Image | Display Area.'
        ]
      },
      {
        title: 'Different Content Type',
        icon: 'view_comfy',
        list: [
          'Images: the default type.',
          'Just 1 Set of Images with Different Sizes.',
          'No need of any size adjustments.',
          'IFrame: Youtube, Vimeo.',
          'HTML5 Video.'
        ]
      },
      {
        title: 'Fullscreen Overlay',
        icon: 'zoom_out_map',
        list: [
          'Built-in. No need of 3-party components.',
          '1-Click to see the Images in Fullscreen Overlay.',
          '2 Display modes: Fit to screen | Fullscreen.',
          'Can be disabled through options.'
        ]
      },
      {
        title: 'Thumbs',
        icon: 'view_list',
        list: [
          'Built-in. No need of thumbnail images.',
          'Number of thumbs images - customizable.',
          'Automatic Sizing + Positioning.',
          'Position: Top/Bottom or Left/Right.',
          'Shown: 1 Row with a Slider | All at Once (only on Top/Bottom).'
        ]
      },
      {
        title: 'Transition Effects',
        icon: 'shuffle',
        list: [
          'Simple and creative effects.',
          'Slow down movements for Zoom and Lens.',
          'Define your movement speed.'
        ]
      },
      {
        title: 'Captions',
        icon: 'closed_caption',
        list: [
          'On Zoom.',
          'Type: In | Out.',
          'Position: Top | Bottom.',
          'Alignment: Left | Center | Right.'
        ]
      },
      {
        title: 'Callback API',
        icon: 'repeat',
        list: [
          'mouseEnter() on display image.',
          'mouseLeave() from display image.'
        ]
      },
      {
        title: 'General Features',
        icon: 'attach_file',
        list: [
          'Multiple Instances per page.',
          'Left/Right navigation controls.',
          'Keyboard navigation.'
        ]
      },
      {
        title: 'Compatibility',
        icon: 'settings',
        list: [
          'IE9-IE11, Chrome, Firefox, Safari and Opera.',
          'Bootstrap.',
          'eBay stores.',
          'WordPress themes.',
          'Easy to integrate in many modern CMS.'
        ]
      },
      {
        title: 'Installation && Customization',
        icon: 'build',
        list: [
          '3 easy steps to Install.',
          '50 Options to customize it as you need.'
        ]
      },
      {
        title: 'Docs && Support',
        icon: 'wysiwyg',
        list: [
          'Detailed Documentation.',
          '18 Examples for an easy Quick Start.',
          'FREE + Rapid Technical Support.',
          'Regular Updates + Continuous Improvements.'
        ]
      },
    ]
  };
  examplesContentGC: ContentExamples[] = [
    {
      title: 'Display',
      id: 'display',
      icon: 'mobile_friendly',
      isLoaded: false,
      examples: this.examplesGCDisplay
    },
    {
      title: 'Zoom',
      id: 'zoom',
      icon: 'zoom_in',
      isLoaded: false,
      examples: this.examplesGCZoom
    },
    {
      title: 'Thumbs',
      id: 'thumbs',
      icon: 'view_list',
      isLoaded: false,
      examples: this.examplesGCThumbs
    },
    {
      title: 'Overlay',
      id: 'fullscreen-overlay',
      icon: 'zoom_out_map',
      isLoaded: false,
      examples: this.examplesGCOverlay
    },
    {
      title: 'Captions',
      id: 'captions',
      icon: 'closed_caption',
      isLoaded: false,
      examples: this.examplesGCCaptions
    },
    {
      title: 'General',
      id: 'general',
      icon: 'attach_file',
      isLoaded: false,
      examples: this.examplesGCGeneral
    },
  ];
  docsContentGC: ContentDocs[] = [
    {
      title: 'Source Code Structure',
      id: 'source-code-structure',
      icon: 'code',
      desc: `<p>Once you've downloaded the component, you'll get a zip file containing 2 folders:</p>
      <div class="tc-card bg-grey">
      glasscase/<br/>
      ├── src_dev/&nbsp; -> the un-minified version of css and js files<br/>
      └── src_prod/ -> the minified version of css and js files<br/>
      </div>
      <p>General structure:</p>
      <div class="tc-card bg-grey">
      glasscase/<br/>
      ├── css/&nbsp;&nbsp;&nbsp; -> contains the css file<br/>
      ├── fonts/&nbsp; -> contains the fonts(Linea Iconset), that are used by GlassCase<br/>
      ├── images/ -> contains loader.gif, that is used by the component <br/>
      └── js/&nbsp;&nbsp;&nbsp;&nbsp; -> contains the js file(s)<br/>
      </div>
      <p>
      * <a href="http://linea.io/" target="_blank" class="tc-link">Linea Iconset</a> is released for free under the license <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" class="tc-link">CC BY 4.0 LICENSE</a>
      </p>`
    },
    {
      title: 'Getting Started',
      id: 'getting-started',
      icon: 'trending_up',
      desc: [
        `<!-- GlassCase stylesheet -->
<link rel="Stylesheet" type="text/css" href="../css/glasscase.min.css"/>
<!-- Modernizr a JavaScript library that detects HTML5 and CSS3 features in the user’s browser -->
<script src="../js/modernizr.custom.js" type="text/javascript"></script>
<!-- GlassCase plugin requires jQuery 1.7+ -->
<script src="../js/jquery-1.8.3.min.js" type="text/javascript"></script>
<!-- GlassCase plugin's JS script file -->
<script src="../js/jquery.glasscase.min.js" type="text/javascript"></script>`,

        `<ul id="glasscase" class="gc-start">
  <li><img src="assets/img1.jpg" alt="Text" data-gc-caption="Your caption text" /></li>
  <li><img src="assets/img2.jpg" alt="Text" /></li>
  <li><img src="assets/img3.jpg" alt="Text" /></li>
  <li><a href="/assets/video.mp4" data-gc-type="video"</a></li>
  <li><a href="//www.youtube.com/embed/0vxOhd4qlnA" data-gc-type="iframe"</a></li>
</ul>`,

        `<!-- Calling the GlassCase plugin -->
<script type="text/javascript">
$(document).ready( function () {
    //If your <ul> has the id "glasscase"
    $('#glasscase').glassCase();
});
</script>`
      ]
    },
    {
      title: 'Customizing',
      icon: 'build',
      id: 'customizing',
      desc: [
        `<script type="text/javascript">
    $(document).ready( function () {
        $('#glasscase').glassCase({ 'thumbsPosition': 'top' });
    });
</script>`
      ],
      options: this.glassCaseOptions,
      attributes: this.glassCaseAttributes
    }
  ];
  changeLogsGC: ContentChangeLog[] = [
    {
      title: '3.0.1 — 08 April 2018',
      fix: [{
        text: 'Fixed issue related to event handler declaration, Firefox specific;'
      }]
    },
    {
      title: '3.0 — 24 November 2017',
      new: [{
        text: 'The whole component was re-written from scratch. It was changed how the component works internally, all the options have been kept, except <code>isDownloadEnabled</code> that was deprecated. No changes were done to the option names.'
      },
      {
        text: 'To the component was added the capability of showing HTML5 Video and IFrame content. Were added the following options:',
        list: [
          '<code>iframeWidth</code> - The IFrame width;',
          '<code>iframeHeight</code> - The IFrame height;',
          '<code>txtImgThumbIframe</code> - The text that is used by the image thumb holder, for the IFrame thumb image;',
          '<code>videoWidth</code> - The HTML5 video width;',
          '<code>videoHeight</code> - The HTML5 video height;',
          '<code>txtImgThumbVideo</code> - The text that is used by the image thumb holder, for the video thumb image;',
        ],
      },
      {
        text: 'Also, were added data attributes(related to HTML5 Video && IFrame):',
        list: [
          '<code>data-gc-type</code> - The type of the element. Possible values: IFrame, video;',
          '<code>data-gc-width</code> - Defines the width of the container. Overrides the value defined in the plugin\'s options. This data attribute affects the following type of elements: IFrame, video;',
          '<code>data-gc-height</code> - Defines the height of the container. Overrides the value defined in the plugin\'s options;',
          '<code>data-gc-formats</code> - This attribute is used only by the video element type. It is used for specifying multiple source files(multiple formats) as a fallback in case the user\'s browser doesn\'t support one of them. The type of this attribute is an array of strings;',
          '<code>data-gc-poster</code> - This attribute is used only by the video element type. Provides an image to show before the video loads;'
        ]
      },
      {
        text: 'To the component was added the capability of autoplay. Were added the following options:',
        list: [
          '<code>isAutoPlayDisplay</code> - Enable or disables the auto play of the images;',
          '<code>pauseTimeDisplay</code> - Time between the change of images enabled by isAutoPlayDisplay. Value is in milliseconds;',
          '<code>isPauseOnHoverDisplay</code> - If set to true, on hovering the display image the auto play display will pause;'
        ]
      },
      {
        text: 'To the thumb slider was added the option <code>slideType</code> - The sliding effect related to the thumbs area. Possible values: \'slideRow\', \'slideElement\.'
      }
      ]
    },
    {
      title: '2.1 —11 February 2015',
      fix: [{
        text: 'The image\'s <code>alt</code> is saved and passed;'
      }],
      new: [{
        text: 'To the component was added the posibility of adding captions. Captions can be added in the Zoom Area.',
        list: [
          '<code>isZCapEnabled</code> - enables / disables the Zoom Captions;',
          '<code>capZType</code> - the type of Zoom Caption: <code>in</code> - placed inside the Zoom Area; <code>out</code> - Captions are placed outside the Zoom Area;',
          '<code>capZPos</code> - the position of the Caption in relation to the Zoom Area;',
          '<code>capZAlign</code> - the alignment of the text placed in Caption for Zoom;'
        ]
      },
      { text: '<code>mouseEnterDisplayCB</code> - callback for the mouseEnter event of the display image;' },
      { text: '<code>mouseLeaveDisplayCB</code> - callback for the mouseLeave event of the display image;' },
      { text: 'When processing the images, the ones that have the same <code>href</code> will be removed.' }
      ]
    },
    {
      title: '2.0 — 30 October 2014',
      new: [
        { text: 'The component was made touch friendly;' },
        { text: 'Were added the options to set the thumbs on left or right side of the Display Image;' },
        { text: 'The icons were changed to another set;' },
        { text: 'Was changed the loading wheel (it uses CSS3);' },
        { text: '<code>isHoverShowThumbs</code> - on hovering a thumb it will change the Display Image;' },
        { text: 'Was added a new Zoom position: <code>Inner</ode> - The Zoom will be shown inside the Display;' },
        { text: '<code>autoInnerZoom</code>- If the Display and Zoom do not fit on the page, Zoom will be shown in inner position;' },
        { text: 'Was handled the case when an image is not loaded: in this case it will appear a holder.' },
      ]
    },
    {
      title: '1.4 — 16 September 2014',
      fix: [
        { text: 'The opacity of the image in the overlay, in ie8;' },
        { text: 'The issue related to: clicking on a selected thumb, it disables the selection of another image;' },
      ],
      new: [
        { text: '<code>isZoomDiffWH</code> - Determines if the zoom\'s width and height have different values;' },
        { text: '<code>zoomWidth</code> - The width of the zoom. The value is in px;' },
        { text: '<code>zoomHeight</code> - The height of the zoom. The value is in px;' },
        { text: '<code>zoomAlignment</code> - Possible values: \'displayImage\', \'displayArea\';' },
        { text: '<code>thumbsMargin</code> - The distance between the thumbs and display area;' },
      ]
    },
    {
      title: '1.3 — 5 September 2014',
      new: [
        { text: '<code>isOverlayFullImage</code> - If true the image in overlay will be shown in full size and only. If false the image will fit the display. On double clicking, the image size will be toggled. If the image is in fit => after double click it will be shown in full size. If the image is in full size => after double click it will fit the display;' },
        { text: 'In overlay, clicking outside the image will close it;' },
        { text: '<code>isSlowZoom</code> - Enables the effect of "slowing" the movement of zoom;' },
        { text: '<code>isSlowLens</code> - Enables the effect of "slowing" the movement of lens;' },
        { text: '<code>speedSlowLens</code> - Determines how long the animation will run. The speed is given in milliseconds;' },
        { text: '<code>speed</code> - Determines how long the animation will run. The speed is given in milliseconds. This value is used in the animation of lens; zoom; overlay; slide;' },
        { text: 'Added to the selector \'.gc-zoom-container img\': \'max-width: none !important;\'.' },
      ]
    },
    {
      title: '1.2.1 — 24 August 2014',
      fix: [
        { text: 'If <code>firstThumbSelected</code> will be greater than the total number of thumbs then to firstThumbSelected will be assigned it\'s default value.' },
      ]
    },
    {
      title: '1.2 — 31 July 2014',
      fix: [
        { text: 'Corrected the height of the component when it has no thumbs and only the display is used.' },
      ],
      new: [
        { text: 'The GlassCase component was made responsive.' },
      ],
    },
    {
      title: '1.2 — 31 July 2014',
      fix: [
        { text: 'Bug related to the case when the number of images is one more than the number of thumbs per row.' },
      ]
    },
    {
      title: '1.1 — 09 July 2014',
      fix: [
        { text: 'Fixed the script so it could properly work in IE8;' },
      ],
      new: [
        { text: '<code>isZoomEnabled</code> - Enables or disables the zoom;' },
        { text: '<code>isOverlayEnabled</code> - Enables or disables the overlay.' }
      ],
    },
    {
      title: '1.0 — 3 June 2014',
      release: 'The Release'
    }
  ];

  featuresContentOB: ContentFeatures = {
    code: `
        <div class="tc-ob-container">
                <div class="tc-ob-container-row">
                    <a class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr" href='assets/images/img1.jpg'
                        data-ob-info="1Lorem ipsum dolor sit amet, usu enim laoreet te, sea error dolorum in. Id per dico complectitur. Est no propriae ponderum, at alii legimus adipiscing qui. Eos quem suscipiantur et, labitur scripserit vel cu, cu sea iusto postea. Suas meliore sententiae nam at, nam esse molestie cu.">
                        Image
                    </a>
                    <a class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr" href='assets/images/img2.jpg'
                        data-ob-info="2Choro periculis complectitur has et, eos in elitr labores, iracundia argumentum eum in. Eum unum illum populo ne. Docendi ancillae pri id, bonorum intellegat eum eu, numquam imperdiet in sit. Nihil putant accommodare ex mel, qui atqui dicit noster ut. Dicam graeci propriae sed ne, his albucius moderatius te, an adhuc idque vix.">
                        Image
                    </a>
                    <a class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr" href='assets/images/img3.jpg'
                        data-ob-info="3Mel reque illum simul ne, habeo augue definitionem ius ne. Ea usu saperet periculis, mea ei laoreet scaevola. Dicta discere cu usu, sed ei denique delicatissimi. Vel atomorum deterruisset ne. Mei esse dicant feugiat ex, alterum ceteros ne nec.">
                        Image
                    </a>
                </div>
                <div class="tc-ob-container-row">
                    <a href='assets/ajax/test.html'
                        class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr" data-ob-type="ajax"
                        data-ob-info="4Lorem ipsum dolor sit amet, usu enim laoreet te, sea error dolorum in. Id per dico complectitur. Est no propriae ponderum, at alii legimus adipiscing qui. Eos quem suscipiantur et, labitur scripserit vel cu, cu sea iusto postea. Suas meliore sententiae nam at, nam esse molestie cu.">
                        Ajax
                    </a>
                    <a class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr" data-ob-type="video"
                        href="assets/images/clips-of-the-aurora-hd-stock-video.mp4"
                        data-ob-info="5Choro periculis complectitur has et, eos in elitr labores, iracundia argumentum eum in. Eum unum illum populo ne. Docendi ancillae pri id, bonorum intellegat eum eu, numquam imperdiet in sit. Nihil putant accommodare ex mel, qui atqui dicit noster ut. Dicam graeci propriae sed ne, his albucius moderatius te, an adhuc idque vix.">
                        Video HTML5
                    </a>
                </div>
                <div class="tc-ob-container-row">
                    <a class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr" data-ob-type="iframe"
                        href='//www.youtube.com/embed/0vxOhd4qlnA'
                        data-ob-info="6Ea qui purto elitr, vim et aperiri impedit. Cum iudicabit temporibus scribentur te, id oratio eirmod verterem vis. Ius solum utinam legere ei, nam posse malis assum no. Quo noster placerat te, mea veri fugit ceteros ne.">
                        Youtube
                    </a>
                    <a class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr"
                        href='//player.vimeo.com/video/69225705'
                        data-ob-info="7Erat nusquam no vel, cum omnes sapientem reprimique ex. Usu te oratio contentiones, in vix eirmod expetenda."
                        data-ob-type="iframe">
                        Vimeo
                    </a>
                    <a href='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3037.7773921218754!2d-3.6921269999999993!3d40.413782000000005!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42289d66d8a2ed%3A0x1094f07d93ad885a!2sMuseo+Nacional+del+Prado!5e0!3m2!1sen!2s!4v1418217930952'
                        class='ob-content tc-ob-holder mat-elevation-z1' data-ob-group="gr" data-ob-type="iframe"
                        data-ob-width="800" data-ob-height="500"
                        data-ob-info="8Laudem consequuntur at pri, sit ad elitr periculis dissentiet. Mel at harum platonem neglegentur, vix te solum qualisque. Id nibh incorrupte cum. Modo atomorum temporibus mei eu, errem utinam persequeris nec te.">
                        Google Maps
                    </a>
                </div>
            </div>
        `,
    overview: {
      title: 'Overview',
      list: [
        'Responsive and Touch Enabled – enjoy mobile experience',
        'Different Content Types',
        'Information Bar and Smart UI',
        'Sleek Effects and Transitions',
        '3 easy steps to Install and Customize'
      ]
    },
    features: [
      {
        title: 'Resp. && Touch Enabled',
        icon: 'mobile_friendly',
        list: [
          'Works on any screen size.',
          'Ready to be used on touch enabled devices.'
        ]
      },
      {
        title: 'Info && Control Bar',
        icon: 'info',
        list: [
          'Smart organization of Screen Elements.',
          '\'Highlighting\' the content: the attention is set on presenting your content.',
          'Easy to access: 1-click on content container presents the Info(Description/Caption).',
          'Different UI visualization on each device type.',
        ]
      },
      {
        title: 'Different Content Type',
        icon: 'view_comfy',
        list: [
          'Images: the default type.',
          'IFrame: Youtube, Vimeo, Google, Bing, Yahoo Maps, Instagram e.t.c.',
          'HTML5 Video.',
          'Ajax.',
        ]
      },
      {
        title: 'Effects && Transitions',
        icon: 'shuffle',
        list: [
          '5 Open / Close effects.',
          '5 Navigation effects.',
        ]
      },
      {
        title: 'General Features',
        icon: 'attach_file',
        list: [
          'Deeplinking.',
          'Multiple Instances per page.',
          'Keyboard controllable UI.',
          'Infinite Navigation.'
        ]
      },
      {
        title: 'Installation && Customization',
        icon: 'build',
        list: [
          '3 easy steps to Install.',
          '24 Options to customize it as you need.'
        ]
      },
      {
        title: 'Docs && Support',
        icon: 'wysiwyg',
        list: [
          'Detailed Documentation.',
          '12 Examples for an easy Quick Start.',
          'FREE + Rapid Technical Support.',
          'Regular Updates + Continuous Improvements.'
        ]
      },
    ]
  };
  examplesContentOB: ContentExamples[] = [
    {
      title: 'Single vs. Grouped',
      id: 'single-grouped',
      icon: 'group_work',
      isLoaded: false,
      examples: this.examplesOBSingleGrouped
    },
    {
      title: 'Content Type',
      id: 'content-type',
      icon: 'view_comfy',
      isLoaded: false,
      examples: this.examplesOBContentType
    },
    {
      title: 'Effects',
      id: 'effects',
      icon: 'shuffle',
      isLoaded: false,
      examples: this.examplesOBEffects
    },
    {
      title: 'General',
      id: 'general',
      icon: 'attach_file',
      isLoaded: false,
      examples: this.examplesOBGeneral
    }
  ];
  docsContentOB: ContentDocs[] = [
    {
      title: 'Source Code Structure',
      id: 'source-code-structure',
      icon: 'code',
      desc: `
                            <p>Once you've downloaded the component, you'll get a zip file containing 3 folders:</p>
                            <div class="tc-card bg-grey">overbox/<br/>
    ├── documentation/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; the offline version of the plugin documentation<br/>
    ├── overbox_development/ -&gt; the un-minified version of css and js files<br/>
    └── overbox_production/&nbsp;&nbsp;-&gt; the minified version of css and js files<br/>
                            </div>
                            <p>General structure:</p>
                            <div class="tc-card bg-grey">overbox/<br/>
    ├── css/&nbsp;&nbsp;&nbsp;-&gt; contains the css file<br/>
    ├── fonts/ -&gt; contains the fonts*(Linea Iconset), that are used for creating the icons for the component<br/>
    └── js/&nbsp;&nbsp;&nbsp;&nbsp;-&gt; contains the js file(s)
                            </div>
      <p>
      * <a href="http://linea.io/" target="_blank" class="tc-link">Linea Iconset</a> is released for free under the license <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" class="tc-link">CC BY 4.0 LICENSE</a>
      </p>`
    },
    {
      title: 'Getting Started',
      id: 'getting-started',
      icon: 'trending_up',
      desc: [
        `<!-- OverBox stylesheet -->
<link rel="Stylesheet" type="text/css" href="../css/overbox.min.css"/>
<!-- Modernizr a JavaScript library that detects HTML5 and CSS3 features in the user’s browser -->
<script src="../js/modernizr.custom.js" type="text/javascript"></script>
<!-- OverBox plugin requires jQuery 1.8+ -->
<script src="../js/jquery-1.8.3.min.js" type="text/javascript"></script>
<!-- OverBox plugin's JS script file -->
<script src="../js/jquery.overbox.min.js" type="text/javascript"></script>`,
        `<a href="images/img1.jpg" class="ob-content">Image1</a>`,
        `<a href="images/img1.jpg" class="ob-content" data-ob-group="group1">Image1</a>
<a href="images/img2.jpg" class="ob-content" data-ob-group="group1">Image2</a>`,
        `<!-- Calling the OverBox plugin -->
<script type="text/javascript">
    $(document).ready( function () {
        //The selector '.ob-content' selects the elements on which you want to apply the plugin
        $('.ob-content').overbox();
    });
</script>`
      ]
    },
    {
      title: 'Customizing',
      icon: 'build',
      id: 'customizing',
      desc: [],
      options: this.overBoxOptions,
      attributes: this.overBoxAttributes
    }
  ];
  changeLogsOB: ContentChangeLog[] = [
    {
      title: '1.1 — 04 August 2015',
      new: [
        { text: 'The possibility to insert formatted HTML to the info pane.' },
      ],
    },
    {
      title: '1.0 — 13 July 2015',
      release: 'The Release'
    }
  ];

  featuresContentSol: ContentFeatures = {
    code: 
    `<ul class="sCarouselIP1 crlStart">
  <li>
    <a href="assets/images/img_sol_1.jpg" data-crl-link="examples" data-crl-title="Product Title1" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_2.jpg" data-crl-link="examples" data-crl-title="Product Title2" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_3.jpg" data-crl-link="examples" data-crl-title="Product Title3" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>data-crl-title="Product Title" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_4.jpg" data-crl-link="examples" data-crl-title="Product Title4" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_5.jpg" data-crl-link="examples" data-crl-title="Product Title5" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_6.jpg" data-crl-link="examples" data-crl-title="Product Title6" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_7.jpg" data-crl-link="examples" data-crl-title="Product Title7" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_8.jpg" data-crl-link="examples" data-crl-title="Product Title8" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
  <li>
    <a href="assets/images/img_sol_9.jpg" data-crl-link="examples" data-crl-title="Product Title9" data-crl-text="<div><span class='tc-crl-pdesc'>Additional product information and description</span><span class='tc-crl-pprice'>£28.93</span></div>"></a>
  </li>
</ul>   
    `,
    overview: {
      title: 'Overview',
      list: [
        'Responsive and Touch Enabled – enjoy mobile experience',
        'Support for different Content Types',
        'Quick View feature with built-in Lightbox',
        'Delete option at element level',
        'Infinite Navigation && Autoplay',
        '40 options for a customizable design',
        '3 easy steps to Install and Customize'
      ]
    },
    features: [
      {
        title: 'Resp. && Touch Enabled',
        icon: 'mobile_friendly',
        list: [
          'Works on any screen size.',
          'Ready to be used on touch enabled devices.',
          '5 options <=> 5 responsive breakpoints.'
        ]
      },
      {
        title: 'Quick View && Delete Button',
        icon: 'info',
        list: [
          'Quick View content shown in Overlay.',
          'Customizable feel && look.',
          'Delete button at element level.'
        ]
      },
      {
        title: 'Different Content Type',
        icon: 'view_comfy',
        list: [
          'Images: the default type.',
          'IFrame: Youtube, Vimeo, Google, Bing, Yahoo Maps, Instagram e.t.c.',
          'HTML5 Video.',
          'None: No Media Object.',
          'Mixed Content.'
        ]
      },
      {
        title: 'Navigation',
        icon: 'shuffle',
        list: [
          '2 types: Slide && Element.',
          'Infinite Navigation.',
          'Autoplay, on hover pauses.',
          'Customizable design.'
        ]
      },
      {
        title: 'Installation && Customization',
        icon: 'build',
        list: [
          '3 easy steps to Install.',
          '40 Options && 5 attributes to customize it as you need.'
        ]
      },
      {
        title: 'Docs && Support',
        icon: 'wysiwyg',
        list: [
          'Detailed Documentation.',
          '10 Examples for an easy Quick Start.',
          'FREE + Rapid Technical Support.',
        ]
      },
    ]
  };
  examplesContentSol: ContentExamples[] = [
    {
      title: 'ItemsPanel',
      id: 'items-panel',
      icon: 'calendar_view_week',
      isLoaded: false,
      examples: this.examplesSolItemsPanel
    },
    {
      title: 'Content Type',
      id: 'content-type',
      icon: 'view_comfy',
      isLoaded: false,
      examples: this.examplesSolContentType
    },
    {
      title: 'Navigation',
      id: 'navigation',
      icon: 'shuffle',
      isLoaded: false,
      examples: this.examplesSolNavigation
    }
  ];
  docsContentSol: ContentDocs[] = [
    {
      title: 'Source Code Structure',
      id: 'source-code-structure',
      icon: 'code',
      desc: `
                            <p>Once you've downloaded the component, you'll get a zip file containing 2 folders:</p>
                            <div class="tc-card bg-grey">solcarousel/<br/>
    ├── src_dev/ &nbsp;-&gt; the un-minified version of css and js files<br/>
    └── src_prod/&nbsp;-&gt; the minified version of css and js files<br/>
                            </div>
                            <p>General structure:</p>
                            <div class="tc-card bg-grey">solcarousel/<br/>
    ├── css/&nbsp;&nbsp;&nbsp;&nbsp;-&gt; contains the css file<br/>
    ├── fonts/&nbsp;&nbsp;-&gt; contains the fonts*(Linea Iconset), that are used for creating the icons for the component<br/>
    ├── images/ -&gt; contains loader.gif, that is used by the component<br/>
    └── js/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&gt; contains the js file(s)
                            </div>
      <p>
      * <a href="http://linea.io/" target="_blank" class="tc-link">Linea Iconset</a> is released for free under the license <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" class="tc-link">CC BY 4.0 LICENSE</a>
      </p>`
    },
    {
      title: 'Getting Started',
      id: 'getting-started',
      icon: 'trending_up',
      desc: [
        `<!-- SolCarousel stylesheet --> 
<link href="../css/solcarousel.min.css" type="text/css" rel="Stylesheet"/> 
<!-- Modernizr a JavaScript library that detects HTML5 and CSS3 features in the user’s browser --> 
<script src="../js/modernizr.custom.js" type="text/javascript"></script> 
<!-- SolCarousel plugin requires jQuery 1.7+ --> 
<script src="../js/jquery-1.8.3.min.js" type="text/javascript"></script> 
<!-- SolCarousel plugin uses Dynamics.js, a JavaScript library to create physics-based animations --> 
<script src="../js/dynamics.min.js" type="text/javascript"></script> 
<!-- SolCarousel plugin's JS script file -->; 
<script src="../js/jquery.solcarousel.min.js" type="text/javascript"></script>`,
        `<ul id="sCarousel" class="crlStart">
  <li><a href="assets/img1.jpg" data-crl-title="Your title" data-crl-text="Your text"></a></li> 
  <li><a href="assets/img2.jpg" data-crl-title="Your title" data-crl-text="Your text"></a></li> 
  <li><a href="assets/img3.jpg" data-crl-title="Your title" data-crl-text="Your text"></a></li> 
  <li><a data-crl-type="none" data-crl-title="Your title" data-crl-text="Your text"></a></li> 
  <li><a href="/assets/video.mp4" data-crl-type="video"></a></li>
  <li><a href="//www.youtube.com/embed/0vxOhd4qlnA" data-crl-type="iframe"></a></li>
</ul>`,
        `<!-- Calling the SolCarousel plugin --> 
<script type="text/javascript"> 
$(document).ready( function () {
  //If your <ul> has the id "sCarousel" 
  $('#sCarousel').solCarousel(); 
}); 
</script>`
      ]
    },
    {
      title: 'Customizing',
      icon: 'build',
      id: 'customizing',
      desc: [
        `<script type="text/javascript"> 
$(document).ready( function () { 
  $('#sCarousel').solCarousel({ 'slidesNavPos': 'top' }); 
}); 
</script>`
      ],
      options: this.solCarouselOptions,
      attributes: this.solCarouselAttributes
    }
  ];
  changeLogsSol: ContentChangeLog[] = [
    {
      title: '1.0 — 11 May 2021',
      release: 'The Release'
    }
  ];

  data: Product[] = [
  {
    type: ProductType.GlassCase,
    pages: [
      {
        title: 'Features - Overview',
        titleHtml: 'GlassCase - jQuery Image Zoom plugin | Features',
        metaHtml: {
          name: 'Description',
          content: 'Discover the features of our jQuery Image Zoom plugin. Bust your web development with our featured plugin; Zoom your Product\'s Images in a new innovative way.'
        },
        type: PageType.Features,
        content: this.featuresContentGC
      },
      {
        title: 'Examples',
        titleHtml: 'GlassCase - jQuery Image Zoom plugin | Examples',
        metaHtml: {
        name: 'Description',
        content: 'Explore how you can use our jQuery Image Zoom plugin; See many examples and how the plugin could be customized in different Image Zoom scenarios.'
      },
        type: PageType.Examples,
        content: this.examplesContentGC
      },
      {
        title: 'Documentation for v3.0.1',
        titleHtml: 'GlassCase - jQuery Image Zoom plugin | Documentation',
        metaHtml: {
          name: 'Description',
          content: 'Discover the Documentation of jQuery Image Zoom plugin. See how easy is to install it; Enhance your web development with flexible customization of the plugin.'
        },
        type: PageType.Documentation,
        content: this.docsContentGC
      },
      {
        title: 'Change Logs for v3.0.1',
        titleHtml: 'GlassCase - jQuery Image Zoom plugin | Change Logs',
        metaHtml: {
          name: 'Description',
          content: 'Explore the Change log of our jQuery Image Zoom plugin. See how plugin improved over time; discover the changes introduced in each version of the plugin.'
        },
        type: PageType.changeLogs,
        content: this.changeLogsGC
      },
    ],
  },
  {
    type: ProductType.OverBox,
    pages: [
      {
        type: PageType.Features,
        titleHtml: 'Overbox - jQuery Image and Video Lightbox plugin | Features',
        metaHtml: {
          name: 'Description',
          content: 'Responsive, touch enabled Image and Video jQuery Lightbox plugin. Shows Images, HTML5 videos, Youtube, Vimeo ... in Lightbox popup with an Informational bar.'
        },
        title: 'Features - Overview',
        content: this.featuresContentOB
      },
      {
        title: 'Examples',
        titleHtml: 'Overbox - jQuery Image and Video Lightbox plugin | Examples',
        metaHtml: {
          name: 'Description',
          content: 'Discover Image and Video jQuery Lightbox plugin Examples. See how to show Images, HTML5 videos, Youtube, Vimeo ... in Lightbox popup with an Info toolbar.'
        },
        type: PageType.Examples,
        content: this.examplesContentOB
      },
      {
        type: PageType.Documentation,
        titleHtml: 'Overbox - jQuery Image and Video Lightbox plugin | Documentation',
        metaHtml: {
          name: 'Description',
          content: 'Discover the Documentation of jQuery Image and Video Lightbox plugin. See how easy is to install and customize the plugin in your web development project.'
        },
        title: 'Documentation for v1.1',
        content: this.docsContentOB
      },
      {
        type: PageType.changeLogs,
        titleHtml: 'Overbox - jQuery Image and Video Lightbox plugin | Change Logs',
        metaHtml: {
          name: 'Description',
          content: 'Explore the Change log of jQuery Image and Video Lightbox plugin. See how plugin improved over time; discover the changes introduced in each version.'
        },
        title: 'Change Logs for v1.1',
        content: this.changeLogsOB
      }
    ]
  },
  {
    type: ProductType.SolCarousel,
    pages: [
      {
        type: PageType.Features,
        titleHtml: '',
        metaHtml: {
        name: 'Description',
        content: ''
      },
        title: 'Features - Overview',
        content: this.featuresContentSol
      },
      {
        title: 'Examples',
        titleHtml: '',
        metaHtml: {
          name: 'Description',
          content: ''
        },
        type: PageType.Examples,
        content: this.examplesContentSol
      },
      {
        type: PageType.Documentation,
        titleHtml: '',
        metaHtml: {
          name: 'Description',
          content: ''
        },
        title: 'Documentation for v1.0',
        content: this.docsContentSol
      },
      {
        type: PageType.changeLogs,
        titleHtml: '',
        metaHtml: {
          name: 'Description',
          content: ''
        },
        title: 'Change Log for v1.0',
        content: this.changeLogsSol
      }
    ]
  }
  ];

  constructor() { }
}
