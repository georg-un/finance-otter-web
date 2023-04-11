/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/image-editor/ngx-doc-scanner.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter, __generator, __read, __spread } from "tslib";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LimitsService, PositionChangeData } from '../../services/limits.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxFilterMenuComponent } from '../filter-menu/ngx-filter-menu.component';
import { NgxOpenCVService } from 'ngx-opencv';
var NgxDocScannerComponent = /** @class */ (function () {
    function NgxDocScannerComponent(ngxOpenCv, limitsService, bottomSheet) {
        var _this = this;
        this.ngxOpenCv = ngxOpenCv;
        this.limitsService = limitsService;
        this.bottomSheet = bottomSheet;
        // ************* //
        // EDITOR CONFIG //
        // ************* //
        /**
         * an array of action buttons displayed on the editor screen
         */
        this.editorButtons = [
            {
                name: 'exit',
                action: (/**
                 * @return {?}
                 */
                function () {
                    _this.exitEditor.emit('canceled');
                }),
                icon: 'arrow_back',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'rotate',
                action: this.rotateImage.bind(this),
                icon: 'rotate_right',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'done_crop',
                action: (/**
                 * @return {?}
                 */
                function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.mode = 'color';
                                return [4 /*yield*/, this.transform()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.applyFilter(true)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }),
                icon: 'done',
                type: 'fab',
                mode: 'crop'
            },
            {
                name: 'back',
                action: (/**
                 * @return {?}
                 */
                function () {
                    _this.mode = 'crop';
                    _this.loadFile(_this.originalImage);
                }),
                icon: 'arrow_back',
                type: 'fab',
                mode: 'color'
            },
            {
                name: 'filter',
                action: (/**
                 * @return {?}
                 */
                function () {
                    return _this.chooseFilters();
                }),
                icon: 'photo_filter',
                type: 'fab',
                mode: 'color'
            },
            {
                name: 'upload',
                action: this.exportImage.bind(this),
                icon: 'cloud_upload',
                type: 'fab',
                mode: 'color'
            },
        ];
        /**
         * true after the image is loaded and preview is displayed
         */
        this.imageLoaded = false;
        /**
         * editor mode
         */
        this.mode = 'crop';
        /**
         * filter selected by the user, returned by the filter selector bottom sheet
         */
        this.selectedFilter = 'default';
        /**
         * image dimensions
         */
        this.imageDimensions = {
            width: 0,
            height: 0
        };
        // ************** //
        // EVENT EMITTERS //
        // ************** //
        /**
         * optional binding to the exit button of the editor
         */
        this.exitEditor = new EventEmitter();
        /**
         * fires on edit completion
         */
        this.editResult = new EventEmitter();
        /**
         * emits errors, can be linked to an error handler of choice
         */
        this.error = new EventEmitter();
        /**
         * emits the loading status of the cv module.
         */
        this.ready = new EventEmitter();
        /**
         * emits true when processing is done, false when completed
         */
        this.processing = new EventEmitter();
        this.screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        // subscribe to status of cv module
        this.ngxOpenCv.cvState.subscribe((/**
         * @param {?} cvState
         * @return {?}
         */
        function (cvState) {
            _this.cvState = cvState.state;
            _this.ready.emit(cvState.ready);
            if (cvState.error) {
                _this.error.emit(new Error('error loading cv'));
            }
            else if (cvState.loading) {
                _this.processing.emit(true);
            }
            else if (cvState.ready) {
                _this.processing.emit(false);
            }
        }));
        // subscribe to positions of crop tool
        this.limitsService.positions.subscribe((/**
         * @param {?} points
         * @return {?}
         */
        function (points) {
            _this.points = points;
        }));
    }
    Object.defineProperty(NgxDocScannerComponent.prototype, "displayedButtons", {
        /**
         * returns an array of buttons according to the editor mode
         */
        get: /**
         * returns an array of buttons according to the editor mode
         * @return {?}
         */
        function () {
            var _this = this;
            return this.editorButtons.filter((/**
             * @param {?} button
             * @return {?}
             */
            function (button) {
                return button.mode === _this.mode;
            }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxDocScannerComponent.prototype, "file", {
        // ****** //
        // INPUTS //
        // ****** //
        /**
         * set image for editing
         * @param file - file from form input
         */
        set: 
        // ****** //
        // INPUTS //
        // ****** //
        /**
         * set image for editing
         * @param {?} file - file from form input
         * @return {?}
         */
        function (file) {
            var _this = this;
            if (file) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.processing.emit(true);
                }), 5);
                this.imageLoaded = false;
                this.originalImage = file;
                this.ngxOpenCv.cvState.subscribe((/**
                 * @param {?} cvState
                 * @return {?}
                 */
                function (cvState) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!cvState.ready) return [3 /*break*/, 2];
                                // read file to image & canvas
                                return [4 /*yield*/, this.loadFile(file)];
                            case 1:
                                // read file to image & canvas
                                _a.sent();
                                this.processing.emit(false);
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); }));
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxDocScannerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // set options from config object
        this.options = new ImageEditorConfig(this.config);
        // set export image icon
        this.editorButtons.forEach((/**
         * @param {?} button
         * @return {?}
         */
        function (button) {
            if (button.name === 'upload') {
                button.icon = _this.options.exportImageIcon;
            }
        }));
        this.maxPreviewWidth = this.options.maxPreviewWidth;
        this.editorStyle = this.options.editorStyle;
    };
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     */
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     * @return {?}
     */
    NgxDocScannerComponent.prototype.exit = 
    // ***************************** //
    // editor action buttons methods //
    // ***************************** //
    /**
     * emits the exitEditor event
     * @return {?}
     */
    function () {
        this.exitEditor.emit('canceled');
    };
    /**
     * applies the selected filter, and when done emits the resulted image
     */
    /**
     * applies the selected filter, and when done emits the resulted image
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.exportImage = /**
     * applies the selected filter, and when done emits the resulted image
     * @private
     * @return {?}
     */
    function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.applyFilter(false)];
                    case 1:
                        _a.sent();
                        if (this.options.maxImageDimensions) {
                            this.resize(this.editedImage)
                                .then((/**
                             * @param {?} resizeResult
                             * @return {?}
                             */
                            function (resizeResult) {
                                resizeResult.toBlob((/**
                                 * @param {?} blob
                                 * @return {?}
                                 */
                                function (blob) {
                                    _this.editResult.emit(blob);
                                    _this.processing.emit(false);
                                }), _this.originalImage.type);
                            }));
                        }
                        else {
                            this.editedImage.toBlob((/**
                             * @param {?} blob
                             * @return {?}
                             */
                            function (blob) {
                                _this.editResult.emit(blob);
                                _this.processing.emit(false);
                            }), this.originalImage.type);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     */
    /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.chooseFilters = /**
     * open the bottom sheet for selecting filters, and applies the selected filter in preview mode
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var data = { filter: this.selectedFilter };
        /** @type {?} */
        var bottomSheetRef = this.bottomSheet.open(NgxFilterMenuComponent, {
            data: data
        });
        bottomSheetRef.afterDismissed().subscribe((/**
         * @return {?}
         */
        function () {
            _this.selectedFilter = data.filter;
            _this.applyFilter(true);
        }));
    };
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     */
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     * @private
     * @param {?} file
     * @return {?}
     */
    NgxDocScannerComponent.prototype.loadFile = 
    // *************************** //
    // File Input & Output Methods //
    // *************************** //
    /**
     * load image from input field
     * @private
     * @param {?} file
     * @return {?}
     */
    function (file) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var err_1, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.processing.emit(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.readImage(file)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        this.error.emit(new Error(err_1));
                        return [3 /*break*/, 4];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.showPreview()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _a.sent();
                        console.error(err_2);
                        this.error.emit(new Error(err_2));
                        return [3 /*break*/, 7];
                    case 7:
                        // set pane limits
                        // show points
                        this.imageLoaded = true;
                        return [4 /*yield*/, this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height })];
                    case 8:
                        _a.sent();
                        setTimeout((/**
                         * @return {?}
                         */
                        function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.detectContours()];
                                    case 1:
                                        _a.sent();
                                        this.processing.emit(false);
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); }), 15);
                        return [2 /*return*/];
                }
            });
        }); }));
    };
    /**
     * read image from File object
     */
    /**
     * read image from File object
     * @private
     * @param {?} file
     * @return {?}
     */
    NgxDocScannerComponent.prototype.readImage = /**
     * read image from File object
     * @private
     * @param {?} file
     * @return {?}
     */
    function (file) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var imageSrc, err_3, img;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, readFile()];
                    case 1:
                        imageSrc = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        reject(err_3);
                        return [3 /*break*/, 3];
                    case 3:
                        img = new Image();
                        img.onload = (/**
                         * @return {?}
                         */
                        function () { return __awaiter(_this, void 0, void 0, function () {
                            var ctx, width, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        // set edited image canvas and dimensions
                                        this.editedImage = (/** @type {?} */ (document.createElement('canvas')));
                                        this.editedImage.width = img.width;
                                        this.editedImage.height = img.height;
                                        ctx = this.editedImage.getContext('2d');
                                        ctx.drawImage(img, 0, 0);
                                        // resize image if larger than max image size
                                        width = img.width > img.height ? img.height : img.width;
                                        if (!(width > this.options.maxImageDimensions.width)) return [3 /*break*/, 2];
                                        _a = this;
                                        return [4 /*yield*/, this.resize(this.editedImage)];
                                    case 1:
                                        _a.editedImage = _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        this.imageDimensions.width = this.editedImage.width;
                                        this.imageDimensions.height = this.editedImage.height;
                                        this.setPreviewPaneDimensions(this.editedImage);
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        img.src = imageSrc;
                        return [2 /*return*/];
                }
            });
        }); }));
        /**
         * read file from input field
         * @return {?}
         */
        function readFile() {
            return new Promise((/**
             * @param {?} resolve
             * @param {?} reject
             * @return {?}
             */
            function (resolve, reject) {
                /** @type {?} */
                var reader = new FileReader();
                reader.onload = (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    resolve(reader.result);
                });
                reader.onerror = (/**
                 * @param {?} err
                 * @return {?}
                 */
                function (err) {
                    reject(err);
                });
                reader.readAsDataURL(file);
            }));
        }
    };
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     */
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.rotateImage = 
    // ************************ //
    // Image Processing Methods //
    // ************************ //
    /**
     * rotate image 90 degrees
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var dst = cv.imread(_this.editedImage);
                // const dst = new cv.Mat();
                cv.transpose(dst, dst);
                cv.flip(dst, dst, 1);
                cv.imshow(_this.editedImage, dst);
                // src.delete();
                dst.delete();
                // save current preview dimensions and positions
                /** @type {?} */
                var initialPreviewDimensions = { width: 0, height: 0 };
                Object.assign(initialPreviewDimensions, _this.previewDimensions);
                /** @type {?} */
                var initialPositions = Array.from(_this.points);
                // get new dimensions
                // set new preview pane dimensions
                _this.setPreviewPaneDimensions(_this.editedImage);
                // get preview pane resize ratio
                /** @type {?} */
                var previewResizeRatios = {
                    width: _this.previewDimensions.width / initialPreviewDimensions.width,
                    height: _this.previewDimensions.height / initialPreviewDimensions.height
                };
                // set new preview pane dimensions
                _this.limitsService.rotateClockwise(previewResizeRatios, initialPreviewDimensions, initialPositions);
                _this.showPreview().then((/**
                 * @return {?}
                 */
                function () {
                    _this.processing.emit(false);
                    resolve();
                }));
            }), 30);
        }));
    };
    /**
     * detects the contours of the document and
     **/
    /**
     * detects the contours of the document and
     *
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.detectContours = /**
     * detects the contours of the document and
     *
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                // load the image and compute the ratio of the old height to the new height, clone it, and resize it
                /** @type {?} */
                var processingResizeRatio = 0.5;
                /** @type {?} */
                var dst = cv.imread(_this.editedImage);
                /** @type {?} */
                var dsize = new cv.Size(dst.rows * processingResizeRatio, dst.cols * processingResizeRatio);
                /** @type {?} */
                var ksize = new cv.Size(5, 5);
                // convert the image to grayscale, blur it, and find edges in the image
                cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
                cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
                cv.Canny(dst, dst, 75, 200);
                // find contours
                cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY);
                /** @type {?} */
                var contours = new cv.MatVector();
                /** @type {?} */
                var hierarchy = new cv.Mat();
                cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
                /** @type {?} */
                var rect = cv.boundingRect(dst);
                dst.delete();
                hierarchy.delete();
                contours.delete();
                // transform the rectangle into a set of points
                Object.keys(rect).forEach((/**
                 * @param {?} key
                 * @return {?}
                 */
                function (key) {
                    rect[key] = rect[key] * _this.imageResizeRatio;
                }));
                /** @type {?} */
                var contourCoordinates = [
                    new PositionChangeData({ x: rect.x, y: rect.y }, ['left', 'top']),
                    new PositionChangeData({ x: rect.x + rect.width, y: rect.y }, ['right', 'top']),
                    new PositionChangeData({ x: rect.x + rect.width, y: rect.y + rect.height }, ['right', 'bottom']),
                    new PositionChangeData({ x: rect.x, y: rect.y + rect.height }, ['left', 'bottom']),
                ];
                _this.limitsService.repositionPoints(contourCoordinates);
                // this.processing.emit(false);
                resolve();
            }), 30);
        }));
    };
    /**
     * apply perspective transform
     */
    /**
     * apply perspective transform
     * @private
     * @return {?}
     */
    NgxDocScannerComponent.prototype.transform = /**
     * apply perspective transform
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var dst = cv.imread(_this.editedImage);
                // create source coordinates matrix
                /** @type {?} */
                var sourceCoordinates = [
                    _this.getPoint(['top', 'left']),
                    _this.getPoint(['top', 'right']),
                    _this.getPoint(['bottom', 'right']),
                    _this.getPoint(['bottom', 'left'])
                ].map((/**
                 * @param {?} point
                 * @return {?}
                 */
                function (point) {
                    return [point.x / _this.imageResizeRatio, point.y / _this.imageResizeRatio];
                }));
                // get max width
                /** @type {?} */
                var bottomWidth = _this.getPoint(['bottom', 'right']).x - _this.getPoint(['bottom', 'left']).x;
                /** @type {?} */
                var topWidth = _this.getPoint(['top', 'right']).x - _this.getPoint(['top', 'left']).x;
                /** @type {?} */
                var maxWidth = Math.max(bottomWidth, topWidth) / _this.imageResizeRatio;
                // get max height
                /** @type {?} */
                var leftHeight = _this.getPoint(['bottom', 'left']).y - _this.getPoint(['top', 'left']).y;
                /** @type {?} */
                var rightHeight = _this.getPoint(['bottom', 'right']).y - _this.getPoint(['top', 'right']).y;
                /** @type {?} */
                var maxHeight = Math.max(leftHeight, rightHeight) / _this.imageResizeRatio;
                // create dest coordinates matrix
                /** @type {?} */
                var destCoordinates = [
                    [0, 0],
                    [maxWidth - 1, 0],
                    [maxWidth - 1, maxHeight - 1],
                    [0, maxHeight - 1]
                ];
                // convert to open cv matrix objects
                /** @type {?} */
                var Ms = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat.apply([], __spread(sourceCoordinates)));
                /** @type {?} */
                var Md = cv.matFromArray(4, 1, cv.CV_32FC2, [].concat.apply([], __spread(destCoordinates)));
                /** @type {?} */
                var transformMatrix = cv.getPerspectiveTransform(Ms, Md);
                // set new image size
                /** @type {?} */
                var dsize = new cv.Size(maxWidth, maxHeight);
                // perform warp
                cv.warpPerspective(dst, dst, transformMatrix, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
                cv.imshow(_this.editedImage, dst);
                dst.delete();
                Ms.delete();
                Md.delete();
                transformMatrix.delete();
                _this.setPreviewPaneDimensions(_this.editedImage);
                _this.showPreview().then((/**
                 * @return {?}
                 */
                function () {
                    _this.processing.emit(false);
                    resolve();
                }));
            }), 30);
        }));
    };
    /**
     * applies the selected filter to the image
     * @param preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     */
    /**
     * applies the selected filter to the image
     * @private
     * @param {?} preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     * @return {?}
     */
    NgxDocScannerComponent.prototype.applyFilter = /**
     * applies the selected filter to the image
     * @private
     * @param {?} preview - when true, will not apply the filter to the edited image but only display a preview.
     * when false, will apply to editedImage
     * @return {?}
     */
    function (preview) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var options, dst;
            var _this = this;
            return __generator(this, function (_a) {
                this.processing.emit(true);
                // default options
                options = {
                    blur: false,
                    th: true,
                    thMode: cv.ADAPTIVE_THRESH_MEAN_C,
                    thMeanCorrection: 10,
                    thBlockSize: 25,
                    thMax: 255,
                    grayScale: true,
                };
                dst = cv.imread(this.editedImage);
                switch (this.selectedFilter) {
                    case 'original':
                        options.th = false;
                        options.grayScale = false;
                        options.blur = false;
                        break;
                    case 'magic_color':
                        options.grayScale = false;
                        break;
                    case 'bw2':
                        options.thMode = cv.ADAPTIVE_THRESH_GAUSSIAN_C;
                        options.thMeanCorrection = 15;
                        options.thBlockSize = 15;
                        break;
                    case 'bw3':
                        options.blur = true;
                        options.thMeanCorrection = 15;
                        break;
                }
                setTimeout((/**
                 * @return {?}
                 */
                function () { return __awaiter(_this, void 0, void 0, function () {
                    var ksize;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (options.grayScale) {
                                    cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY, 0);
                                }
                                if (options.blur) {
                                    ksize = new cv.Size(5, 5);
                                    cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
                                }
                                if (options.th) {
                                    if (options.grayScale) {
                                        cv.adaptiveThreshold(dst, dst, options.thMax, options.thMode, cv.THRESH_BINARY, options.thBlockSize, options.thMeanCorrection);
                                    }
                                    else {
                                        dst.convertTo(dst, -1, 1, 60);
                                        cv.threshold(dst, dst, 170, 255, cv.THRESH_BINARY);
                                    }
                                }
                                if (!preview) {
                                    cv.imshow(this.editedImage, dst);
                                }
                                return [4 /*yield*/, this.showPreview(dst)];
                            case 1:
                                _a.sent();
                                this.processing.emit(false);
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); }), 30);
                return [2 /*return*/];
            });
        }); }));
    };
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     */
    /**
     * resize an image to fit constraints set in options.maxImageDimensions
     * @private
     * @param {?} image
     * @return {?}
     */
    NgxDocScannerComponent.prototype.resize = /**
     * resize an image to fit constraints set in options.maxImageDimensions
     * @private
     * @param {?} image
     * @return {?}
     */
    function (image) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            _this.processing.emit(true);
            setTimeout((/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var src = cv.imread(image);
                /** @type {?} */
                var currentDimensions = {
                    width: src.size().width,
                    height: src.size().height
                };
                /** @type {?} */
                var resizeDimensions = {
                    width: 0,
                    height: 0
                };
                if (currentDimensions.width > _this.options.maxImageDimensions.width) {
                    resizeDimensions.width = _this.options.maxImageDimensions.width;
                    resizeDimensions.height = _this.options.maxImageDimensions.width / currentDimensions.width * currentDimensions.height;
                    if (resizeDimensions.height > _this.options.maxImageDimensions.height) {
                        resizeDimensions.height = _this.options.maxImageDimensions.height;
                        resizeDimensions.width = _this.options.maxImageDimensions.height / currentDimensions.height * currentDimensions.width;
                    }
                    /** @type {?} */
                    var dsize = new cv.Size(Math.floor(resizeDimensions.width), Math.floor(resizeDimensions.height));
                    cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);
                    /** @type {?} */
                    var resizeResult = (/** @type {?} */ (document.createElement('canvas')));
                    cv.imshow(resizeResult, src);
                    src.delete();
                    _this.processing.emit(false);
                    resolve(resizeResult);
                }
                else {
                    _this.processing.emit(false);
                    resolve(image);
                }
            }), 30);
        }));
    };
    /**
     * display a preview of the image on the preview canvas
     */
    /**
     * display a preview of the image on the preview canvas
     * @private
     * @param {?=} image
     * @return {?}
     */
    NgxDocScannerComponent.prototype.showPreview = /**
     * display a preview of the image on the preview canvas
     * @private
     * @param {?=} image
     * @return {?}
     */
    function (image) {
        var _this = this;
        return new Promise((/**
         * @param {?} resolve
         * @param {?} reject
         * @return {?}
         */
        function (resolve, reject) {
            /** @type {?} */
            var src;
            if (image) {
                src = image;
            }
            else {
                src = cv.imread(_this.editedImage);
            }
            /** @type {?} */
            var dst = new cv.Mat();
            /** @type {?} */
            var dsize = new cv.Size(0, 0);
            cv.resize(src, dst, dsize, _this.imageResizeRatio, _this.imageResizeRatio, cv.INTER_AREA);
            cv.imshow(_this.previewCanvas.nativeElement, dst);
            src.delete();
            dst.delete();
            resolve();
        }));
    };
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     */
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     * @private
     * @param {?} img
     * @return {?}
     */
    NgxDocScannerComponent.prototype.setPreviewPaneDimensions = 
    // *************** //
    // Utility Methods //
    // *************** //
    /**
     * set preview canvas dimensions according to the canvas element of the original image
     * @private
     * @param {?} img
     * @return {?}
     */
    function (img) {
        // set preview pane dimensions
        this.previewDimensions = this.calculateDimensions(img.width, img.height);
        this.previewCanvas.nativeElement.width = this.previewDimensions.width;
        this.previewCanvas.nativeElement.height = this.previewDimensions.height;
        this.imageResizeRatio = this.previewDimensions.width / img.width;
        this.imageDivStyle = {
            width: this.previewDimensions.width + this.options.cropToolDimensions.width + 'px',
            height: this.previewDimensions.height + this.options.cropToolDimensions.height + 'px',
            'margin-left': "calc((100% - " + (this.previewDimensions.width + 10) + "px) / 2 + " + this.options.cropToolDimensions.width / 2 + "px)",
            'margin-right': "calc((100% - " + (this.previewDimensions.width + 10) + "px) / 2 - " + this.options.cropToolDimensions.width / 2 + "px)",
        };
        this.limitsService.setPaneDimensions({ width: this.previewDimensions.width, height: this.previewDimensions.height });
    };
    /**
     * calculate dimensions of the preview canvas
     */
    /**
     * calculate dimensions of the preview canvas
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    NgxDocScannerComponent.prototype.calculateDimensions = /**
     * calculate dimensions of the preview canvas
     * @private
     * @param {?} width
     * @param {?} height
     * @return {?}
     */
    function (width, height) {
        /** @type {?} */
        var ratio = width / height;
        /** @type {?} */
        var maxWidth = this.screenDimensions.width > this.maxPreviewWidth ?
            this.maxPreviewWidth : this.screenDimensions.width - 40;
        /** @type {?} */
        var maxHeight = this.screenDimensions.height - 240;
        /** @type {?} */
        var calculated = {
            width: maxWidth,
            height: Math.round(maxWidth / ratio),
            ratio: ratio
        };
        if (calculated.height > maxHeight) {
            calculated.height = maxHeight;
            calculated.width = Math.round(maxHeight * ratio);
        }
        return calculated;
    };
    /**
     * returns a point by it's roles
     * @param roles - an array of roles by which the point will be fetched
     */
    /**
     * returns a point by it's roles
     * @private
     * @param {?} roles - an array of roles by which the point will be fetched
     * @return {?}
     */
    NgxDocScannerComponent.prototype.getPoint = /**
     * returns a point by it's roles
     * @private
     * @param {?} roles - an array of roles by which the point will be fetched
     * @return {?}
     */
    function (roles) {
        var _this = this;
        return this.points.find((/**
         * @param {?} point
         * @return {?}
         */
        function (point) {
            return _this.limitsService.compareArray(point.roles, roles);
        }));
    };
    NgxDocScannerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-doc-scanner',
                    template: "<div [ngStyle]=\"editorStyle\" fxLayoutAlign=\"space-around\" style=\"direction: ltr !important\">\n  <div #imageContainer [ngStyle]=\"imageDivStyle\" style=\"margin: auto;\" >\n    <ng-container *ngIf=\"imageLoaded && mode === 'crop'\">\n      <ngx-shape-outine #shapeOutline [color]=\"options.cropToolColor\" [weight]=\"options.cropToolLineWeight\" [dimensions]=\"previewDimensions\"></ngx-shape-outine>\n      <ngx-draggable-point #topLeft [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: 0, y: 0}\" [limitRoles]=\"['top', 'left']\" [container]=\"imageContainer\"></ngx-draggable-point>\n      <ngx-draggable-point #topRight [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: previewDimensions.width, y: 0}\" [limitRoles]=\"['top', 'right']\" [container]=\"imageContainer\"></ngx-draggable-point>\n      <ngx-draggable-point #bottomLeft [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: 0, y: previewDimensions.height}\" [limitRoles]=\"['bottom', 'left']\" [container]=\"imageContainer\"></ngx-draggable-point>\n      <ngx-draggable-point #bottomRight [pointOptions]=\"options.pointOptions\" [startPosition]=\"{x: previewDimensions.width, y: previewDimensions.height}\" [limitRoles]=\"['bottom', 'right']\" [container]=\"imageContainer\"></ngx-draggable-point>\n    </ng-container>\n    <canvas #PreviewCanvas [ngStyle]=\"{'max-width': options.maxPreviewWidth}\" style=\"z-index: 5\" ></canvas>\n  </div>\n  <div class=\"editor-actions\" fxLayout=\"row\" fxLayoutAlign=\"space-around\" style=\"position: absolute; bottom: 0; width: 100vw\">\n    <ng-container *ngFor=\"let button of displayedButtons\" [ngSwitch]=\"button.type\">\n      <button mat-mini-fab *ngSwitchCase=\"'fab'\" [name]=\"button.name\" (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">\n        <mat-icon>{{button.icon}}</mat-icon>\n      </button>\n      <button mat-raised-button *ngSwitchCase=\"'button'\" [name]=\"button.name\" (click)=\"button.action()\" [color]=\"options.buttonThemeColor\">\n        <mat-icon>{{button.icon}}</mat-icon>\n        <span>{{button.text}}}</span>\n      </button>\n    </ng-container>\n  </div>\n</div>\n\n\n",
                    styles: [".editor-actions{padding:12px}.editor-actions button{margin:5px}"]
                }] }
    ];
    /** @nocollapse */
    NgxDocScannerComponent.ctorParameters = function () { return [
        { type: NgxOpenCVService },
        { type: LimitsService },
        { type: MatBottomSheet }
    ]; };
    NgxDocScannerComponent.propDecorators = {
        previewCanvas: [{ type: ViewChild, args: ['PreviewCanvas', { static: false, read: ElementRef },] }],
        exitEditor: [{ type: Output }],
        editResult: [{ type: Output }],
        error: [{ type: Output }],
        ready: [{ type: Output }],
        processing: [{ type: Output }],
        file: [{ type: Input }],
        config: [{ type: Input }]
    };
    return NgxDocScannerComponent;
}());
export { NgxDocScannerComponent };
if (false) {
    /**
     * editor config object
     * @type {?}
     */
    NgxDocScannerComponent.prototype.options;
    /**
     * an array of action buttons displayed on the editor screen
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.editorButtons;
    /**
     * max width of the preview area
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.maxPreviewWidth;
    /**
     * dimensions of the image container
     * @type {?}
     */
    NgxDocScannerComponent.prototype.imageDivStyle;
    /**
     * editor div style
     * @type {?}
     */
    NgxDocScannerComponent.prototype.editorStyle;
    /**
     * state of opencv loading
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.cvState;
    /**
     * true after the image is loaded and preview is displayed
     * @type {?}
     */
    NgxDocScannerComponent.prototype.imageLoaded;
    /**
     * editor mode
     * @type {?}
     */
    NgxDocScannerComponent.prototype.mode;
    /**
     * filter selected by the user, returned by the filter selector bottom sheet
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.selectedFilter;
    /**
     * viewport dimensions
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.screenDimensions;
    /**
     * image dimensions
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.imageDimensions;
    /**
     * dimensions of the preview pane
     * @type {?}
     */
    NgxDocScannerComponent.prototype.previewDimensions;
    /**
     * ration between preview image and original
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.imageResizeRatio;
    /**
     * stores the original image for reset purposes
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.originalImage;
    /**
     * stores the edited image
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.editedImage;
    /**
     * stores the preview image as canvas
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.previewCanvas;
    /**
     * an array of points used by the crop tool
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.points;
    /**
     * optional binding to the exit button of the editor
     * @type {?}
     */
    NgxDocScannerComponent.prototype.exitEditor;
    /**
     * fires on edit completion
     * @type {?}
     */
    NgxDocScannerComponent.prototype.editResult;
    /**
     * emits errors, can be linked to an error handler of choice
     * @type {?}
     */
    NgxDocScannerComponent.prototype.error;
    /**
     * emits the loading status of the cv module.
     * @type {?}
     */
    NgxDocScannerComponent.prototype.ready;
    /**
     * emits true when processing is done, false when completed
     * @type {?}
     */
    NgxDocScannerComponent.prototype.processing;
    /**
     * editor configuration object
     * @type {?}
     */
    NgxDocScannerComponent.prototype.config;
    /**
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.ngxOpenCv;
    /**
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.limitsService;
    /**
     * @type {?}
     * @private
     */
    NgxDocScannerComponent.prototype.bottomSheet;
}
/**
 * a class for generating configuration objects for the editor
 */
var /**
 * a class for generating configuration objects for the editor
 */
ImageEditorConfig = /** @class */ (function () {
    function ImageEditorConfig(options) {
        var _this = this;
        /**
         * max dimensions of oputput image. if set to zero
         */
        this.maxImageDimensions = {
            width: 800,
            height: 1200
        };
        /**
         * background color of the main editor div
         */
        this.editorBackgroundColor = '#fefefe';
        /**
         * css properties for the main editor div
         */
        this.editorDimensions = {
            width: '100vw',
            height: '100vh'
        };
        /**
         * css that will be added to the main div of the editor component
         */
        this.extraCss = {
            position: 'absolute',
            top: 0,
            left: 0
        };
        /**
         * material design theme color name
         */
        this.buttonThemeColor = 'accent';
        /**
         * icon for the button that completes the editing and emits the edited image
         */
        this.exportImageIcon = 'cloud_upload';
        /**
         * color of the crop tool
         */
        this.cropToolColor = '#3cabe2';
        /**
         * shape of the crop tool, can be either a rectangle or a circle
         */
        this.cropToolShape = 'rect';
        /**
         * dimensions of the crop tool
         */
        this.cropToolDimensions = {
            width: 10,
            height: 10
        };
        /**
         * crop tool outline width
         */
        this.cropToolLineWeight = 3;
        /**
         * maximum size of the preview pane
         */
        this.maxPreviewWidth = 800;
        if (options) {
            Object.keys(options).forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) {
                _this[key] = options[key];
            }));
        }
        this.editorStyle = { 'background-color': this.editorBackgroundColor };
        Object.assign(this.editorStyle, this.editorDimensions);
        Object.assign(this.editorStyle, this.extraCss);
        this.pointOptions = {
            shape: this.cropToolShape,
            color: this.cropToolColor,
            width: 0,
            height: 0
        };
        Object.assign(this.pointOptions, this.cropToolDimensions);
    }
    return ImageEditorConfig;
}());
if (false) {
    /**
     * max dimensions of oputput image. if set to zero
     * @type {?}
     */
    ImageEditorConfig.prototype.maxImageDimensions;
    /**
     * background color of the main editor div
     * @type {?}
     */
    ImageEditorConfig.prototype.editorBackgroundColor;
    /**
     * css properties for the main editor div
     * @type {?}
     */
    ImageEditorConfig.prototype.editorDimensions;
    /**
     * css that will be added to the main div of the editor component
     * @type {?}
     */
    ImageEditorConfig.prototype.extraCss;
    /**
     * material design theme color name
     * @type {?}
     */
    ImageEditorConfig.prototype.buttonThemeColor;
    /**
     * icon for the button that completes the editing and emits the edited image
     * @type {?}
     */
    ImageEditorConfig.prototype.exportImageIcon;
    /**
     * color of the crop tool
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolColor;
    /**
     * shape of the crop tool, can be either a rectangle or a circle
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolShape;
    /**
     * dimensions of the crop tool
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolDimensions;
    /**
     * aggregation of the properties regarding point attributes generated by the class constructor
     * @type {?}
     */
    ImageEditorConfig.prototype.pointOptions;
    /**
     * aggregation of the properties regarding the editor style generated by the class constructor
     * @type {?}
     */
    ImageEditorConfig.prototype.editorStyle;
    /**
     * crop tool outline width
     * @type {?}
     */
    ImageEditorConfig.prototype.cropToolLineWeight;
    /**
     * maximum size of the preview pane
     * @type {?}
     */
    ImageEditorConfig.prototype.maxPreviewWidth;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWRvYy1zY2FubmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kb2N1bWVudC1zY2FubmVyLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvaW1hZ2UtZWRpdG9yL25neC1kb2Mtc2Nhbm5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBQyxhQUFhLEVBQXVCLGtCQUFrQixFQUFhLE1BQU0sK0JBQStCLENBQUM7QUFDakgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQzlELE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBS2hGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUk1QztJQThNRSxnQ0FBb0IsU0FBMkIsRUFBVSxhQUE0QixFQUFVLFdBQTJCO1FBQTFILGlCQXVCQztRQXZCbUIsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFnQjs7Ozs7OztRQTlMbEgsa0JBQWEsR0FBOEI7WUFDakQ7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osTUFBTTs7O2dCQUFFO29CQUNOLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUE7Z0JBQ0QsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFD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QUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBdkZELElBdUZDOzs7Ozs7SUFuRkMsK0NBR0U7Ozs7O0lBSUYsa0RBQWtDOzs7OztJQUlsQyw2Q0FHRTs7Ozs7SUFJRixxQ0FJRTs7Ozs7SUFLRiw2Q0FBdUQ7Ozs7O0lBSXZELDRDQUFpQzs7Ozs7SUFJakMsMENBQTBCOzs7OztJQUkxQiwwQ0FBbUM7Ozs7O0lBSW5DLCtDQUdFOzs7OztJQUlGLHlDQUEyQjs7Ozs7SUFJM0Isd0NBQTZDOzs7OztJQUk3QywrQ0FBdUI7Ozs7O0lBSXZCLDRDQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TGltaXRzU2VydmljZSwgUG9pbnRQb3NpdGlvbkNoYW5nZSwgUG9zaXRpb25DaGFuZ2VEYXRhLCBSb2xlc0FycmF5fSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XG5pbXBvcnQge01hdEJvdHRvbVNoZWV0fSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9ib3R0b20tc2hlZXQnO1xuaW1wb3J0IHtOZ3hGaWx0ZXJNZW51Q29tcG9uZW50fSBmcm9tICcuLi9maWx0ZXItbWVudS9uZ3gtZmlsdGVyLW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7UG9pbnRTaGFwZX0gZnJvbSAnLi4vLi4vUHJpdmF0ZU1vZGVscyc7XG4vLyBpbXBvcnQge05neE9wZW5DVlNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25neC1vcGVuY3Yuc2VydmljZSc7XG5pbXBvcnQge0ltYWdlRGltZW5zaW9ucywgRG9jU2Nhbm5lckNvbmZpZywgT3BlbkNWU3RhdGV9IGZyb20gJy4uLy4uL1B1YmxpY01vZGVscyc7XG5pbXBvcnQge0VkaXRvckFjdGlvbkJ1dHRvbiwgUG9pbnRPcHRpb25zfSBmcm9tICcuLi8uLi9Qcml2YXRlTW9kZWxzJztcbmltcG9ydCB7Tmd4T3BlbkNWU2VydmljZX0gZnJvbSAnbmd4LW9wZW5jdic7XG5cbmRlY2xhcmUgdmFyIGN2OiBhbnk7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25neC1kb2Mtc2Nhbm5lcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZ3gtZG9jLXNjYW5uZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hEb2NTY2FubmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgLyoqXG4gICAqIGVkaXRvciBjb25maWcgb2JqZWN0XG4gICAqL1xuICBvcHRpb25zOiBJbWFnZUVkaXRvckNvbmZpZztcbiAgLy8gKioqKioqKioqKioqKiAvL1xuICAvLyBFRElUT1IgQ09ORklHIC8vXG4gIC8vICoqKioqKioqKioqKiogLy9cbiAgLyoqXG4gICAqIGFuIGFycmF5IG9mIGFjdGlvbiBidXR0b25zIGRpc3BsYXllZCBvbiB0aGUgZWRpdG9yIHNjcmVlblxuICAgKi9cbiAgcHJpdmF0ZSBlZGl0b3JCdXR0b25zOiBBcnJheTxFZGl0b3JBY3Rpb25CdXR0b24+ID0gW1xuICAgIHtcbiAgICAgIG5hbWU6ICdleGl0JyxcbiAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICB0aGlzLmV4aXRFZGl0b3IuZW1pdCgnY2FuY2VsZWQnKTtcbiAgICAgIH0sXG4gICAgICBpY29uOiAnYXJyb3dfYmFjaycsXG4gICAgICB0eXBlOiAnZmFiJyxcbiAgICAgIG1vZGU6ICdjcm9wJ1xuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3JvdGF0ZScsXG4gICAgICBhY3Rpb246IHRoaXMucm90YXRlSW1hZ2UuYmluZCh0aGlzKSxcbiAgICAgIGljb246ICdyb3RhdGVfcmlnaHQnLFxuICAgICAgdHlwZTogJ2ZhYicsXG4gICAgICBtb2RlOiAnY3JvcCdcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdkb25lX2Nyb3AnLFxuICAgICAgYWN0aW9uOiBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRoaXMubW9kZSA9ICdjb2xvcic7XG4gICAgICAgIGF3YWl0IHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwbHlGaWx0ZXIodHJ1ZSk7XG4gICAgICB9LFxuICAgICAgaWNvbjogJ2RvbmUnLFxuICAgICAgdHlwZTogJ2ZhYicsXG4gICAgICBtb2RlOiAnY3JvcCdcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdiYWNrJyxcbiAgICAgIGFjdGlvbjogKCkgPT4ge1xuICAgICAgICB0aGlzLm1vZGUgPSAnY3JvcCc7XG4gICAgICAgIHRoaXMubG9hZEZpbGUodGhpcy5vcmlnaW5hbEltYWdlKTtcbiAgICAgIH0sXG4gICAgICBpY29uOiAnYXJyb3dfYmFjaycsXG4gICAgICB0eXBlOiAnZmFiJyxcbiAgICAgIG1vZGU6ICdjb2xvcidcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdmaWx0ZXInLFxuICAgICAgYWN0aW9uOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNob29zZUZpbHRlcnMoKTtcbiAgICAgIH0sXG4gICAgICBpY29uOiAncGhvdG9fZmlsdGVyJyxcbiAgICAgIHR5cGU6ICdmYWInLFxuICAgICAgbW9kZTogJ2NvbG9yJ1xuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3VwbG9hZCcsXG4gICAgICBhY3Rpb246IHRoaXMuZXhwb3J0SW1hZ2UuYmluZCh0aGlzKSxcbiAgICAgIGljb246ICdjbG91ZF91cGxvYWQnLFxuICAgICAgdHlwZTogJ2ZhYicsXG4gICAgICBtb2RlOiAnY29sb3InXG4gICAgfSxcbiAgXTtcbiAgLyoqXG4gICAqIHJldHVybnMgYW4gYXJyYXkgb2YgYnV0dG9ucyBhY2NvcmRpbmcgdG8gdGhlIGVkaXRvciBtb2RlXG4gICAqL1xuICBnZXQgZGlzcGxheWVkQnV0dG9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JCdXR0b25zLmZpbHRlcihidXR0b24gPT4ge1xuICAgICAgcmV0dXJuIGJ1dHRvbi5tb2RlID09PSB0aGlzLm1vZGU7XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gICAqIG1heCB3aWR0aCBvZiB0aGUgcHJldmlldyBhcmVhXG4gICAqL1xuICBwcml2YXRlIG1heFByZXZpZXdXaWR0aDogbnVtYmVyO1xuICAvKipcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgaW1hZ2UgY29udGFpbmVyXG4gICAqL1xuICBpbWFnZURpdlN0eWxlOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfG51bWJlcn07XG4gIC8qKlxuICAgKiBlZGl0b3IgZGl2IHN0eWxlXG4gICAqL1xuICBlZGl0b3JTdHlsZToge1trZXk6IHN0cmluZ106IHN0cmluZ3xudW1iZXJ9O1xuXG4gIC8vICoqKioqKioqKioqKiogLy9cbiAgLy8gRURJVE9SIFNUQVRFIC8vXG4gIC8vICoqKioqKioqKioqKiogLy9cbiAgLyoqXG4gICAqIHN0YXRlIG9mIG9wZW5jdiBsb2FkaW5nXG4gICAqL1xuICBwcml2YXRlIGN2U3RhdGU6IHN0cmluZztcbiAgLyoqXG4gICAqIHRydWUgYWZ0ZXIgdGhlIGltYWdlIGlzIGxvYWRlZCBhbmQgcHJldmlldyBpcyBkaXNwbGF5ZWRcbiAgICovXG4gIGltYWdlTG9hZGVkID0gZmFsc2U7XG4gIC8qKlxuICAgKiBlZGl0b3IgbW9kZVxuICAgKi9cbiAgbW9kZTogJ2Nyb3AnfCdjb2xvcicgPSAnY3JvcCc7XG4gIC8qKlxuICAgKiBmaWx0ZXIgc2VsZWN0ZWQgYnkgdGhlIHVzZXIsIHJldHVybmVkIGJ5IHRoZSBmaWx0ZXIgc2VsZWN0b3IgYm90dG9tIHNoZWV0XG4gICAqL1xuICBwcml2YXRlIHNlbGVjdGVkRmlsdGVyID0gJ2RlZmF1bHQnO1xuXG4gIC8vICoqKioqKioqKioqKioqKioqKiogLy9cbiAgLy8gT1BFUkFUSU9OIFZBUklBQkxFUyAvL1xuICAvLyAqKioqKioqKioqKioqKioqKioqIC8vXG4gIC8qKlxuICAgKiB2aWV3cG9ydCBkaW1lbnNpb25zXG4gICAqL1xuICBwcml2YXRlIHNjcmVlbkRpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucztcbiAgLyoqXG4gICAqIGltYWdlIGRpbWVuc2lvbnNcbiAgICovXG4gIHByaXZhdGUgaW1hZ2VEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnMgPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwXG4gIH07XG4gIC8qKlxuICAgKiBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IHBhbmVcbiAgICovXG4gIHByZXZpZXdEaW1lbnNpb25zOiBJbWFnZURpbWVuc2lvbnM7XG4gIC8qKlxuICAgKiByYXRpb24gYmV0d2VlbiBwcmV2aWV3IGltYWdlIGFuZCBvcmlnaW5hbFxuICAgKi9cbiAgcHJpdmF0ZSBpbWFnZVJlc2l6ZVJhdGlvOiBudW1iZXI7XG4gIC8qKlxuICAgKiBzdG9yZXMgdGhlIG9yaWdpbmFsIGltYWdlIGZvciByZXNldCBwdXJwb3Nlc1xuICAgKi9cbiAgcHJpdmF0ZSBvcmlnaW5hbEltYWdlOiBGaWxlO1xuICAvKipcbiAgICogc3RvcmVzIHRoZSBlZGl0ZWQgaW1hZ2VcbiAgICovXG4gIHByaXZhdGUgZWRpdGVkSW1hZ2U6IEhUTUxDYW52YXNFbGVtZW50O1xuICAvKipcbiAgICogc3RvcmVzIHRoZSBwcmV2aWV3IGltYWdlIGFzIGNhbnZhc1xuICAgKi9cbiAgQFZpZXdDaGlsZCgnUHJldmlld0NhbnZhcycsIHtzdGF0aWM6IGZhbHNlLCByZWFkOiBFbGVtZW50UmVmfSkgcHJpdmF0ZSBwcmV2aWV3Q2FudmFzOiBFbGVtZW50UmVmO1xuICAvKipcbiAgICogYW4gYXJyYXkgb2YgcG9pbnRzIHVzZWQgYnkgdGhlIGNyb3AgdG9vbFxuICAgKi9cbiAgcHJpdmF0ZSBwb2ludHM6IEFycmF5PFBvaW50UG9zaXRpb25DaGFuZ2U+O1xuXG4gIC8vICoqKioqKioqKioqKioqIC8vXG4gIC8vIEVWRU5UIEVNSVRURVJTIC8vXG4gIC8vICoqKioqKioqKioqKioqIC8vXG4gIC8qKlxuICAgKiBvcHRpb25hbCBiaW5kaW5nIHRvIHRoZSBleGl0IGJ1dHRvbiBvZiB0aGUgZWRpdG9yXG4gICAqL1xuICBAT3V0cHV0KCkgZXhpdEVkaXRvcjogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgLyoqXG4gICAqIGZpcmVzIG9uIGVkaXQgY29tcGxldGlvblxuICAgKi9cbiAgQE91dHB1dCgpIGVkaXRSZXN1bHQ6IEV2ZW50RW1pdHRlcjxCbG9iPiA9IG5ldyBFdmVudEVtaXR0ZXI8QmxvYj4oKTtcbiAgLyoqXG4gICAqIGVtaXRzIGVycm9ycywgY2FuIGJlIGxpbmtlZCB0byBhbiBlcnJvciBoYW5kbGVyIG9mIGNob2ljZVxuICAgKi9cbiAgQE91dHB1dCgpIGVycm9yOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICAvKipcbiAgICogZW1pdHMgdGhlIGxvYWRpbmcgc3RhdHVzIG9mIHRoZSBjdiBtb2R1bGUuXG4gICAqL1xuICBAT3V0cHV0KCkgcmVhZHk6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgLyoqXG4gICAqIGVtaXRzIHRydWUgd2hlbiBwcm9jZXNzaW5nIGlzIGRvbmUsIGZhbHNlIHdoZW4gY29tcGxldGVkXG4gICAqL1xuICBAT3V0cHV0KCkgcHJvY2Vzc2luZzogRXZlbnRFbWl0dGVyPGJvb2xlYW4+ID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIC8vICoqKioqKiAvL1xuICAvLyBJTlBVVFMgLy9cbiAgLy8gKioqKioqIC8vXG4gIC8qKlxuICAgKiBzZXQgaW1hZ2UgZm9yIGVkaXRpbmdcbiAgICogQHBhcmFtIGZpbGUgLSBmaWxlIGZyb20gZm9ybSBpbnB1dFxuICAgKi9cbiAgQElucHV0KCkgc2V0IGZpbGUoZmlsZTogRmlsZSkge1xuICAgIGlmIChmaWxlKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XG4gICAgICB9LCA1KTtcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IGZpbGU7XG4gICAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZShcbiAgICAgICAgYXN5bmMgKGN2U3RhdGU6IE9wZW5DVlN0YXRlKSA9PiB7XG4gICAgICAgICAgaWYgKGN2U3RhdGUucmVhZHkpIHtcbiAgICAgICAgICAgIC8vIHJlYWQgZmlsZSB0byBpbWFnZSAmIGNhbnZhc1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRmlsZShmaWxlKTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBlZGl0b3IgY29uZmlndXJhdGlvbiBvYmplY3RcbiAgICovXG4gIEBJbnB1dCgpIGNvbmZpZzogRG9jU2Nhbm5lckNvbmZpZztcblxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmd4T3BlbkN2OiBOZ3hPcGVuQ1ZTZXJ2aWNlLCBwcml2YXRlIGxpbWl0c1NlcnZpY2U6IExpbWl0c1NlcnZpY2UsIHByaXZhdGUgYm90dG9tU2hlZXQ6IE1hdEJvdHRvbVNoZWV0KSB7XG4gICAgdGhpcy5zY3JlZW5EaW1lbnNpb25zID0ge1xuICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICB9O1xuXG4gICAgLy8gc3Vic2NyaWJlIHRvIHN0YXR1cyBvZiBjdiBtb2R1bGVcbiAgICB0aGlzLm5neE9wZW5Ddi5jdlN0YXRlLnN1YnNjcmliZSgoY3ZTdGF0ZTogT3BlbkNWU3RhdGUpID0+IHtcbiAgICAgIHRoaXMuY3ZTdGF0ZSA9IGN2U3RhdGUuc3RhdGU7XG4gICAgICB0aGlzLnJlYWR5LmVtaXQoY3ZTdGF0ZS5yZWFkeSk7XG4gICAgICBpZiAoY3ZTdGF0ZS5lcnJvcikge1xuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKCdlcnJvciBsb2FkaW5nIGN2JykpO1xuICAgICAgfSBlbHNlIGlmIChjdlN0YXRlLmxvYWRpbmcpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGN2U3RhdGUucmVhZHkpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gc3Vic2NyaWJlIHRvIHBvc2l0aW9ucyBvZiBjcm9wIHRvb2xcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25zLnN1YnNjcmliZShwb2ludHMgPT4ge1xuICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBzZXQgb3B0aW9ucyBmcm9tIGNvbmZpZyBvYmplY3RcbiAgICB0aGlzLm9wdGlvbnMgPSBuZXcgSW1hZ2VFZGl0b3JDb25maWcodGhpcy5jb25maWcpO1xuICAgIC8vIHNldCBleHBvcnQgaW1hZ2UgaWNvblxuICAgIHRoaXMuZWRpdG9yQnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICBpZiAoYnV0dG9uLm5hbWUgPT09ICd1cGxvYWQnKSB7XG4gICAgICAgIGJ1dHRvbi5pY29uID0gdGhpcy5vcHRpb25zLmV4cG9ydEltYWdlSWNvbjtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLm1heFByZXZpZXdXaWR0aCA9IHRoaXMub3B0aW9ucy5tYXhQcmV2aWV3V2lkdGg7XG4gICAgdGhpcy5lZGl0b3JTdHlsZSA9IHRoaXMub3B0aW9ucy5lZGl0b3JTdHlsZTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXG4gIC8vIGVkaXRvciBhY3Rpb24gYnV0dG9ucyBtZXRob2RzIC8vXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXG5cbiAgLyoqXG4gICAqIGVtaXRzIHRoZSBleGl0RWRpdG9yIGV2ZW50XG4gICAqL1xuICBleGl0KCkge1xuICAgIHRoaXMuZXhpdEVkaXRvci5lbWl0KCdjYW5jZWxlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciwgYW5kIHdoZW4gZG9uZSBlbWl0cyB0aGUgcmVzdWx0ZWQgaW1hZ2VcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgZXhwb3J0SW1hZ2UoKSB7XG4gICAgYXdhaXQgdGhpcy5hcHBseUZpbHRlcihmYWxzZSk7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMpIHtcbiAgICAgIHRoaXMucmVzaXplKHRoaXMuZWRpdGVkSW1hZ2UpXG4gICAgICAgIC50aGVuKHJlc2l6ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgcmVzaXplUmVzdWx0LnRvQmxvYigoYmxvYikgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0UmVzdWx0LmVtaXQoYmxvYik7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XG4gICAgICAgICAgfSwgdGhpcy5vcmlnaW5hbEltYWdlLnR5cGUpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lZGl0ZWRJbWFnZS50b0Jsb2IoKGJsb2IpID0+IHtcbiAgICAgICAgdGhpcy5lZGl0UmVzdWx0LmVtaXQoYmxvYik7XG4gICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcbiAgICAgIH0sIHRoaXMub3JpZ2luYWxJbWFnZS50eXBlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogb3BlbiB0aGUgYm90dG9tIHNoZWV0IGZvciBzZWxlY3RpbmcgZmlsdGVycywgYW5kIGFwcGxpZXMgdGhlIHNlbGVjdGVkIGZpbHRlciBpbiBwcmV2aWV3IG1vZGVcbiAgICovXG4gIHByaXZhdGUgY2hvb3NlRmlsdGVycygpIHtcbiAgICBjb25zdCBkYXRhID0geyBmaWx0ZXI6IHRoaXMuc2VsZWN0ZWRGaWx0ZXIgfTtcbiAgICBjb25zdCBib3R0b21TaGVldFJlZiA9IHRoaXMuYm90dG9tU2hlZXQub3BlbihOZ3hGaWx0ZXJNZW51Q29tcG9uZW50LCB7XG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gICAgYm90dG9tU2hlZXRSZWYuYWZ0ZXJEaXNtaXNzZWQoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zZWxlY3RlZEZpbHRlciA9IGRhdGEuZmlsdGVyO1xuICAgICAgdGhpcy5hcHBseUZpbHRlcih0cnVlKTtcbiAgICB9KTtcblxuICB9XG5cbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqIC8vXG4gIC8vIEZpbGUgSW5wdXQgJiBPdXRwdXQgTWV0aG9kcyAvL1xuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKiogLy9cbiAgLyoqXG4gICAqIGxvYWQgaW1hZ2UgZnJvbSBpbnB1dCBmaWVsZFxuICAgKi9cbiAgcHJpdmF0ZSBsb2FkRmlsZShmaWxlOiBGaWxlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5yZWFkSW1hZ2UoZmlsZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICB0aGlzLmVycm9yLmVtaXQobmV3IEVycm9yKGVycikpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgdGhpcy5zaG93UHJldmlldygpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgdGhpcy5lcnJvci5lbWl0KG5ldyBFcnJvcihlcnIpKTtcbiAgICAgIH1cbiAgICAgIC8vIHNldCBwYW5lIGxpbWl0c1xuICAgICAgLy8gc2hvdyBwb2ludHNcbiAgICAgIHRoaXMuaW1hZ2VMb2FkZWQgPSB0cnVlO1xuICAgICAgYXdhaXQgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGV0ZWN0Q29udG91cnMoKTtcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCAxNSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogcmVhZCBpbWFnZSBmcm9tIEZpbGUgb2JqZWN0XG4gICAqL1xuICBwcml2YXRlIHJlYWRJbWFnZShmaWxlOiBGaWxlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGxldCBpbWFnZVNyYztcbiAgICAgIHRyeSB7XG4gICAgICAgIGltYWdlU3JjID0gYXdhaXQgcmVhZEZpbGUoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgaW1nLm9ubG9hZCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gc2V0IGVkaXRlZCBpbWFnZSBjYW52YXMgYW5kIGRpbWVuc2lvbnNcbiAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2Uud2lkdGggPSBpbWcud2lkdGg7XG4gICAgICAgIHRoaXMuZWRpdGVkSW1hZ2UuaGVpZ2h0ID0gaW1nLmhlaWdodDtcbiAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5lZGl0ZWRJbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG4gICAgICAgIC8vIHJlc2l6ZSBpbWFnZSBpZiBsYXJnZXIgdGhhbiBtYXggaW1hZ2Ugc2l6ZVxuICAgICAgICBjb25zdCB3aWR0aCA9IGltZy53aWR0aCA+IGltZy5oZWlnaHQgPyBpbWcuaGVpZ2h0IDogaW1nLndpZHRoO1xuICAgICAgICBpZiAod2lkdGggPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoKSB7XG4gICAgICAgICAgdGhpcy5lZGl0ZWRJbWFnZSA9IGF3YWl0IHRoaXMucmVzaXplKHRoaXMuZWRpdGVkSW1hZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW1hZ2VEaW1lbnNpb25zLndpZHRoID0gdGhpcy5lZGl0ZWRJbWFnZS53aWR0aDtcbiAgICAgICAgdGhpcy5pbWFnZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5lZGl0ZWRJbWFnZS5oZWlnaHQ7XG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9O1xuICAgICAgaW1nLnNyYyA9IGltYWdlU3JjO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogcmVhZCBmaWxlIGZyb20gaW5wdXQgZmllbGRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWFkRmlsZSgpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgICByZWFkZXIub25lcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKiogLy9cbiAgLy8gSW1hZ2UgUHJvY2Vzc2luZyBNZXRob2RzIC8vXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKiAvL1xuICAvKipcbiAgICogcm90YXRlIGltYWdlIDkwIGRlZ3JlZXNcbiAgICovXG4gIHByaXZhdGUgcm90YXRlSW1hZ2UoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KHRydWUpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcbiAgICAgICAgLy8gY29uc3QgZHN0ID0gbmV3IGN2Lk1hdCgpO1xuICAgICAgICBjdi50cmFuc3Bvc2UoZHN0LCBkc3QpO1xuICAgICAgICBjdi5mbGlwKGRzdCwgZHN0LCAxKTtcbiAgICAgICAgY3YuaW1zaG93KHRoaXMuZWRpdGVkSW1hZ2UsIGRzdCk7XG4gICAgICAgIC8vIHNyYy5kZWxldGUoKTtcbiAgICAgICAgZHN0LmRlbGV0ZSgpO1xuICAgICAgICAvLyBzYXZlIGN1cnJlbnQgcHJldmlldyBkaW1lbnNpb25zIGFuZCBwb3NpdGlvbnNcbiAgICAgICAgY29uc3QgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zID0ge3dpZHRoOiAwLCBoZWlnaHQ6IDB9O1xuICAgICAgICBPYmplY3QuYXNzaWduKGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucywgdGhpcy5wcmV2aWV3RGltZW5zaW9ucyk7XG4gICAgICAgIGNvbnN0IGluaXRpYWxQb3NpdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzKTtcbiAgICAgICAgLy8gZ2V0IG5ldyBkaW1lbnNpb25zXG4gICAgICAgIC8vIHNldCBuZXcgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcbiAgICAgICAgdGhpcy5zZXRQcmV2aWV3UGFuZURpbWVuc2lvbnModGhpcy5lZGl0ZWRJbWFnZSk7XG4gICAgICAgIC8vIGdldCBwcmV2aWV3IHBhbmUgcmVzaXplIHJhdGlvXG4gICAgICAgIGNvbnN0IHByZXZpZXdSZXNpemVSYXRpb3MgPSB7XG4gICAgICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbml0aWFsUHJldmlld0RpbWVuc2lvbnMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodCAvIGluaXRpYWxQcmV2aWV3RGltZW5zaW9ucy5oZWlnaHRcbiAgICAgICAgfTtcbiAgICAgICAgLy8gc2V0IG5ldyBwcmV2aWV3IHBhbmUgZGltZW5zaW9uc1xuXG4gICAgICAgIHRoaXMubGltaXRzU2VydmljZS5yb3RhdGVDbG9ja3dpc2UocHJldmlld1Jlc2l6ZVJhdGlvcywgaW5pdGlhbFByZXZpZXdEaW1lbnNpb25zLCBpbml0aWFsUG9zaXRpb25zKTtcbiAgICAgICAgdGhpcy5zaG93UHJldmlldygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgMzApO1xuICAgIH0pO1xuXG5cbiAgfVxuXG4gIC8qKlxuICAgKiBkZXRlY3RzIHRoZSBjb250b3VycyBvZiB0aGUgZG9jdW1lbnQgYW5kXG4gICAqKi9cbiAgcHJpdmF0ZSBkZXRlY3RDb250b3VycygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gbG9hZCB0aGUgaW1hZ2UgYW5kIGNvbXB1dGUgdGhlIHJhdGlvIG9mIHRoZSBvbGQgaGVpZ2h0IHRvIHRoZSBuZXcgaGVpZ2h0LCBjbG9uZSBpdCwgYW5kIHJlc2l6ZSBpdFxuICAgICAgICBjb25zdCBwcm9jZXNzaW5nUmVzaXplUmF0aW8gPSAwLjU7XG4gICAgICAgIGNvbnN0IGRzdCA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcbiAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShkc3Qucm93cyAqIHByb2Nlc3NpbmdSZXNpemVSYXRpbywgZHN0LmNvbHMgKiBwcm9jZXNzaW5nUmVzaXplUmF0aW8pO1xuICAgICAgICBjb25zdCBrc2l6ZSA9IG5ldyBjdi5TaXplKDUsIDUpO1xuICAgICAgICAvLyBjb252ZXJ0IHRoZSBpbWFnZSB0byBncmF5c2NhbGUsIGJsdXIgaXQsIGFuZCBmaW5kIGVkZ2VzIGluIHRoZSBpbWFnZVxuICAgICAgICBjdi5jdnRDb2xvcihkc3QsIGRzdCwgY3YuQ09MT1JfUkdCQTJHUkFZLCAwKTtcbiAgICAgICAgY3YuR2F1c3NpYW5CbHVyKGRzdCwgZHN0LCBrc2l6ZSwgMCwgMCwgY3YuQk9SREVSX0RFRkFVTFQpO1xuICAgICAgICBjdi5DYW5ueShkc3QsIGRzdCwgNzUsIDIwMCk7XG4gICAgICAgIC8vIGZpbmQgY29udG91cnNcbiAgICAgICAgY3YudGhyZXNob2xkKGRzdCwgZHN0LCAxMjAsIDIwMCwgY3YuVEhSRVNIX0JJTkFSWSk7XG4gICAgICAgIGNvbnN0IGNvbnRvdXJzID0gbmV3IGN2Lk1hdFZlY3RvcigpO1xuICAgICAgICBjb25zdCBoaWVyYXJjaHkgPSBuZXcgY3YuTWF0KCk7XG4gICAgICAgIGN2LmZpbmRDb250b3Vycyhkc3QsIGNvbnRvdXJzLCBoaWVyYXJjaHksIGN2LlJFVFJfQ0NPTVAsIGN2LkNIQUlOX0FQUFJPWF9TSU1QTEUpO1xuICAgICAgICBjb25zdCByZWN0ID0gY3YuYm91bmRpbmdSZWN0KGRzdCk7XG4gICAgICAgIGRzdC5kZWxldGUoKTsgaGllcmFyY2h5LmRlbGV0ZSgpOyBjb250b3Vycy5kZWxldGUoKTtcbiAgICAgICAgLy8gdHJhbnNmb3JtIHRoZSByZWN0YW5nbGUgaW50byBhIHNldCBvZiBwb2ludHNcbiAgICAgICAgT2JqZWN0LmtleXMocmVjdCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIHJlY3Rba2V5XSA9IHJlY3Rba2V5XSAgKiB0aGlzLmltYWdlUmVzaXplUmF0aW87XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGNvbnRvdXJDb29yZGluYXRlcyA9IFtcbiAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueX0sIFsnbGVmdCcsICd0b3AnXSksXG4gICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54ICsgcmVjdC53aWR0aCwgeTogcmVjdC55fSwgWydyaWdodCcsICd0b3AnXSksXG4gICAgICAgICAgbmV3IFBvc2l0aW9uQ2hhbmdlRGF0YSh7eDogcmVjdC54ICsgcmVjdC53aWR0aCwgeTogcmVjdC55ICsgcmVjdC5oZWlnaHR9LCBbJ3JpZ2h0JywgJ2JvdHRvbSddKSxcbiAgICAgICAgICBuZXcgUG9zaXRpb25DaGFuZ2VEYXRhKHt4OiByZWN0LngsIHk6IHJlY3QueSArIHJlY3QuaGVpZ2h0fSwgWydsZWZ0JywgJ2JvdHRvbSddKSxcbiAgICAgICAgXTtcblxuICAgICAgICB0aGlzLmxpbWl0c1NlcnZpY2UucmVwb3NpdGlvblBvaW50cyhjb250b3VyQ29vcmRpbmF0ZXMpO1xuICAgICAgICAvLyB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0sIDMwKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBhcHBseSBwZXJzcGVjdGl2ZSB0cmFuc2Zvcm1cbiAgICovXG4gIHByaXZhdGUgdHJhbnNmb3JtKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdCh0cnVlKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBkc3QgPSBjdi5pbXJlYWQodGhpcy5lZGl0ZWRJbWFnZSk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHNvdXJjZSBjb29yZGluYXRlcyBtYXRyaXhcbiAgICAgICAgY29uc3Qgc291cmNlQ29vcmRpbmF0ZXMgPSBbXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ3RvcCcsICdsZWZ0J10pLFxuICAgICAgICAgIHRoaXMuZ2V0UG9pbnQoWyd0b3AnLCAncmlnaHQnXSksXG4gICAgICAgICAgdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdyaWdodCddKSxcbiAgICAgICAgICB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSlcbiAgICAgICAgXS5tYXAocG9pbnQgPT4ge1xuICAgICAgICAgIHJldHVybiBbcG9pbnQueCAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgcG9pbnQueSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpb107XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGdldCBtYXggd2lkdGhcbiAgICAgICAgY29uc3QgYm90dG9tV2lkdGggPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ2xlZnQnXSkueDtcbiAgICAgICAgY29uc3QgdG9wV2lkdGggPSB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLnggLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSkueDtcbiAgICAgICAgY29uc3QgbWF4V2lkdGggPSBNYXRoLm1heChib3R0b21XaWR0aCwgdG9wV2lkdGgpIC8gdGhpcy5pbWFnZVJlc2l6ZVJhdGlvO1xuICAgICAgICAvLyBnZXQgbWF4IGhlaWdodFxuICAgICAgICBjb25zdCBsZWZ0SGVpZ2h0ID0gdGhpcy5nZXRQb2ludChbJ2JvdHRvbScsICdsZWZ0J10pLnkgLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ2xlZnQnXSkueTtcbiAgICAgICAgY29uc3QgcmlnaHRIZWlnaHQgPSB0aGlzLmdldFBvaW50KFsnYm90dG9tJywgJ3JpZ2h0J10pLnkgLSB0aGlzLmdldFBvaW50KFsndG9wJywgJ3JpZ2h0J10pLnk7XG4gICAgICAgIGNvbnN0IG1heEhlaWdodCA9IE1hdGgubWF4KGxlZnRIZWlnaHQsIHJpZ2h0SGVpZ2h0KSAvIHRoaXMuaW1hZ2VSZXNpemVSYXRpbztcbiAgICAgICAgLy8gY3JlYXRlIGRlc3QgY29vcmRpbmF0ZXMgbWF0cml4XG4gICAgICAgIGNvbnN0IGRlc3RDb29yZGluYXRlcyA9IFtcbiAgICAgICAgICBbMCwgMF0sXG4gICAgICAgICAgW21heFdpZHRoIC0gMSwgMF0sXG4gICAgICAgICAgW21heFdpZHRoIC0gMSwgbWF4SGVpZ2h0IC0gMV0sXG4gICAgICAgICAgWzAsIG1heEhlaWdodCAtIDFdXG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gY29udmVydCB0byBvcGVuIGN2IG1hdHJpeCBvYmplY3RzXG4gICAgICAgIGNvbnN0IE1zID0gY3YubWF0RnJvbUFycmF5KDQsIDEsIGN2LkNWXzMyRkMyLCBbXS5jb25jYXQoLi4uc291cmNlQ29vcmRpbmF0ZXMpKTtcbiAgICAgICAgY29uc3QgTWQgPSBjdi5tYXRGcm9tQXJyYXkoNCwgMSwgY3YuQ1ZfMzJGQzIsIFtdLmNvbmNhdCguLi5kZXN0Q29vcmRpbmF0ZXMpKTtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtTWF0cml4ID0gY3YuZ2V0UGVyc3BlY3RpdmVUcmFuc2Zvcm0oTXMsIE1kKTtcbiAgICAgICAgLy8gc2V0IG5ldyBpbWFnZSBzaXplXG4gICAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUobWF4V2lkdGgsIG1heEhlaWdodCk7XG4gICAgICAgIC8vIHBlcmZvcm0gd2FycFxuICAgICAgICBjdi53YXJwUGVyc3BlY3RpdmUoZHN0LCBkc3QsIHRyYW5zZm9ybU1hdHJpeCwgZHNpemUsIGN2LklOVEVSX0xJTkVBUiwgY3YuQk9SREVSX0NPTlNUQU5ULCBuZXcgY3YuU2NhbGFyKCkpO1xuICAgICAgICBjdi5pbXNob3codGhpcy5lZGl0ZWRJbWFnZSwgZHN0KTtcblxuICAgICAgICBkc3QuZGVsZXRlKCk7IE1zLmRlbGV0ZSgpOyBNZC5kZWxldGUoKTsgdHJhbnNmb3JtTWF0cml4LmRlbGV0ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKHRoaXMuZWRpdGVkSW1hZ2UpO1xuICAgICAgICB0aGlzLnNob3dQcmV2aWV3KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCAzMCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogYXBwbGllcyB0aGUgc2VsZWN0ZWQgZmlsdGVyIHRvIHRoZSBpbWFnZVxuICAgKiBAcGFyYW0gcHJldmlldyAtIHdoZW4gdHJ1ZSwgd2lsbCBub3QgYXBwbHkgdGhlIGZpbHRlciB0byB0aGUgZWRpdGVkIGltYWdlIGJ1dCBvbmx5IGRpc3BsYXkgYSBwcmV2aWV3LlxuICAgKiB3aGVuIGZhbHNlLCB3aWxsIGFwcGx5IHRvIGVkaXRlZEltYWdlXG4gICAqL1xuICBwcml2YXRlIGFwcGx5RmlsdGVyKHByZXZpZXc6IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XG4gICAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIGJsdXI6IGZhbHNlLFxuICAgICAgICB0aDogdHJ1ZSxcbiAgICAgICAgdGhNb2RlOiBjdi5BREFQVElWRV9USFJFU0hfTUVBTl9DLFxuICAgICAgICB0aE1lYW5Db3JyZWN0aW9uOiAxMCxcbiAgICAgICAgdGhCbG9ja1NpemU6IDI1LFxuICAgICAgICB0aE1heDogMjU1LFxuICAgICAgICBncmF5U2NhbGU6IHRydWUsXG4gICAgICB9O1xuICAgICAgY29uc3QgZHN0ID0gY3YuaW1yZWFkKHRoaXMuZWRpdGVkSW1hZ2UpO1xuXG4gICAgICBzd2l0Y2ggKHRoaXMuc2VsZWN0ZWRGaWx0ZXIpIHtcbiAgICAgICAgY2FzZSAnb3JpZ2luYWwnOlxuICAgICAgICAgIG9wdGlvbnMudGggPSBmYWxzZTtcbiAgICAgICAgICBvcHRpb25zLmdyYXlTY2FsZSA9IGZhbHNlO1xuICAgICAgICAgIG9wdGlvbnMuYmx1ciA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdtYWdpY19jb2xvcic6XG4gICAgICAgICAgb3B0aW9ucy5ncmF5U2NhbGUgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYncyJzpcbiAgICAgICAgICBvcHRpb25zLnRoTW9kZSA9IGN2LkFEQVBUSVZFX1RIUkVTSF9HQVVTU0lBTl9DO1xuICAgICAgICAgIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbiA9IDE1O1xuICAgICAgICAgIG9wdGlvbnMudGhCbG9ja1NpemUgPSAxNTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYnczJzpcbiAgICAgICAgICBvcHRpb25zLmJsdXIgPSB0cnVlO1xuICAgICAgICAgIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbiA9IDE1O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XG4gICAgICAgICAgY3YuY3Z0Q29sb3IoZHN0LCBkc3QsIGN2LkNPTE9SX1JHQkEyR1JBWSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuYmx1cikge1xuICAgICAgICAgIGNvbnN0IGtzaXplID0gbmV3IGN2LlNpemUoNSwgNSk7XG4gICAgICAgICAgY3YuR2F1c3NpYW5CbHVyKGRzdCwgZHN0LCBrc2l6ZSwgMCwgMCwgY3YuQk9SREVSX0RFRkFVTFQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnRoKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuZ3JheVNjYWxlKSB7XG4gICAgICAgICAgICBjdi5hZGFwdGl2ZVRocmVzaG9sZChkc3QsIGRzdCwgb3B0aW9ucy50aE1heCwgb3B0aW9ucy50aE1vZGUsIGN2LlRIUkVTSF9CSU5BUlksIG9wdGlvbnMudGhCbG9ja1NpemUsIG9wdGlvbnMudGhNZWFuQ29ycmVjdGlvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRzdC5jb252ZXJ0VG8oZHN0LCAtMSwgMSwgNjApO1xuICAgICAgICAgICAgY3YudGhyZXNob2xkKGRzdCwgZHN0LCAxNzAsIDI1NSwgY3YuVEhSRVNIX0JJTkFSWSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldmlldykge1xuICAgICAgICAgIGN2Lmltc2hvdyh0aGlzLmVkaXRlZEltYWdlLCBkc3QpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuc2hvd1ByZXZpZXcoZHN0KTtcbiAgICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQoZmFsc2UpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9LCAzMCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogcmVzaXplIGFuIGltYWdlIHRvIGZpdCBjb25zdHJhaW50cyBzZXQgaW4gb3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnNcbiAgICovXG4gIHByaXZhdGUgcmVzaXplKGltYWdlOiBIVE1MQ2FudmFzRWxlbWVudCk6IFByb21pc2U8SFRNTENhbnZhc0VsZW1lbnQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5wcm9jZXNzaW5nLmVtaXQodHJ1ZSk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3Qgc3JjID0gY3YuaW1yZWFkKGltYWdlKTtcbiAgICAgICAgY29uc3QgY3VycmVudERpbWVuc2lvbnMgPSB7XG4gICAgICAgICAgd2lkdGg6IHNyYy5zaXplKCkud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBzcmMuc2l6ZSgpLmhlaWdodFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXNpemVEaW1lbnNpb25zID0ge1xuICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgIGhlaWdodDogMFxuICAgICAgICB9O1xuICAgICAgICBpZiAoY3VycmVudERpbWVuc2lvbnMud2lkdGggPiB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoKSB7XG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy53aWR0aCA9IHRoaXMub3B0aW9ucy5tYXhJbWFnZURpbWVuc2lvbnMud2lkdGg7XG4gICAgICAgICAgcmVzaXplRGltZW5zaW9ucy5oZWlnaHQgPSB0aGlzLm9wdGlvbnMubWF4SW1hZ2VEaW1lbnNpb25zLndpZHRoIC8gY3VycmVudERpbWVuc2lvbnMud2lkdGggKiBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgICAgICAgaWYgKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID4gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0ID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgICAgICAgICByZXNpemVEaW1lbnNpb25zLndpZHRoID0gdGhpcy5vcHRpb25zLm1heEltYWdlRGltZW5zaW9ucy5oZWlnaHQgLyBjdXJyZW50RGltZW5zaW9ucy5oZWlnaHQgKiBjdXJyZW50RGltZW5zaW9ucy53aWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZHNpemUgPSBuZXcgY3YuU2l6ZShNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMud2lkdGgpLCBNYXRoLmZsb29yKHJlc2l6ZURpbWVuc2lvbnMuaGVpZ2h0KSk7XG4gICAgICAgICAgY3YucmVzaXplKHNyYywgc3JjLCBkc2l6ZSwgMCwgMCwgY3YuSU5URVJfQVJFQSk7XG4gICAgICAgICAgY29uc3QgcmVzaXplUmVzdWx0ID0gPEhUTUxDYW52YXNFbGVtZW50PiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICBjdi5pbXNob3cocmVzaXplUmVzdWx0LCBzcmMpO1xuICAgICAgICAgIHNyYy5kZWxldGUoKTtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NpbmcuZW1pdChmYWxzZSk7XG4gICAgICAgICAgcmVzb2x2ZShyZXNpemVSZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucHJvY2Vzc2luZy5lbWl0KGZhbHNlKTtcbiAgICAgICAgICByZXNvbHZlKGltYWdlKTtcbiAgICAgICAgfVxuICAgICAgfSwgMzApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGRpc3BsYXkgYSBwcmV2aWV3IG9mIHRoZSBpbWFnZSBvbiB0aGUgcHJldmlldyBjYW52YXNcbiAgICovXG4gIHByaXZhdGUgc2hvd1ByZXZpZXcoaW1hZ2U/OiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHNyYztcbiAgICAgIGlmIChpbWFnZSkge1xuICAgICAgICBzcmMgPSBpbWFnZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNyYyA9IGN2LmltcmVhZCh0aGlzLmVkaXRlZEltYWdlKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRzdCA9IG5ldyBjdi5NYXQoKTtcbiAgICAgIGNvbnN0IGRzaXplID0gbmV3IGN2LlNpemUoMCwgMCk7XG4gICAgICBjdi5yZXNpemUoc3JjLCBkc3QsIGRzaXplLCB0aGlzLmltYWdlUmVzaXplUmF0aW8sIHRoaXMuaW1hZ2VSZXNpemVSYXRpbywgY3YuSU5URVJfQVJFQSk7XG4gICAgICBjdi5pbXNob3codGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQsIGRzdCk7XG4gICAgICBzcmMuZGVsZXRlKCk7XG4gICAgICBkc3QuZGVsZXRlKCk7XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKiogLy9cbiAgLy8gVXRpbGl0eSBNZXRob2RzIC8vXG4gIC8vICoqKioqKioqKioqKioqKiAvL1xuICAvKipcbiAgICogc2V0IHByZXZpZXcgY2FudmFzIGRpbWVuc2lvbnMgYWNjb3JkaW5nIHRvIHRoZSBjYW52YXMgZWxlbWVudCBvZiB0aGUgb3JpZ2luYWwgaW1hZ2VcbiAgICovXG4gIHByaXZhdGUgc2V0UHJldmlld1BhbmVEaW1lbnNpb25zKGltZzogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAvLyBzZXQgcHJldmlldyBwYW5lIGRpbWVuc2lvbnNcbiAgICB0aGlzLnByZXZpZXdEaW1lbnNpb25zID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKGltZy53aWR0aCwgaW1nLmhlaWdodCk7XG4gICAgdGhpcy5wcmV2aWV3Q2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggPSB0aGlzLnByZXZpZXdEaW1lbnNpb25zLndpZHRoO1xuICAgIHRoaXMucHJldmlld0NhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMuaGVpZ2h0O1xuICAgIHRoaXMuaW1hZ2VSZXNpemVSYXRpbyA9IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggLyBpbWcud2lkdGg7XG4gICAgdGhpcy5pbWFnZURpdlN0eWxlID0ge1xuICAgICAgd2lkdGg6IHRoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoICsgJ3B4JyxcbiAgICAgIGhlaWdodDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy5oZWlnaHQgKyB0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLmhlaWdodCArICdweCcsXG4gICAgICAnbWFyZ2luLWxlZnQnOiBgY2FsYygoMTAwJSAtICR7dGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCArIDEwfXB4KSAvIDIgKyAke3RoaXMub3B0aW9ucy5jcm9wVG9vbERpbWVuc2lvbnMud2lkdGggLyAyfXB4KWAsXG4gICAgICAnbWFyZ2luLXJpZ2h0JzogYGNhbGMoKDEwMCUgLSAke3RoaXMucHJldmlld0RpbWVuc2lvbnMud2lkdGggKyAxMH1weCkgLyAyIC0gJHt0aGlzLm9wdGlvbnMuY3JvcFRvb2xEaW1lbnNpb25zLndpZHRoIC8gMn1weClgLFxuICAgIH07XG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnNldFBhbmVEaW1lbnNpb25zKHt3aWR0aDogdGhpcy5wcmV2aWV3RGltZW5zaW9ucy53aWR0aCwgaGVpZ2h0OiB0aGlzLnByZXZpZXdEaW1lbnNpb25zLmhlaWdodH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhbGN1bGF0ZSBkaW1lbnNpb25zIG9mIHRoZSBwcmV2aWV3IGNhbnZhc1xuICAgKi9cbiAgcHJpdmF0ZSBjYWxjdWxhdGVEaW1lbnNpb25zKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcjsgcmF0aW86IG51bWJlcn0ge1xuICAgIGNvbnN0IHJhdGlvID0gd2lkdGggLyBoZWlnaHQ7XG5cbiAgICBjb25zdCBtYXhXaWR0aCA9IHRoaXMuc2NyZWVuRGltZW5zaW9ucy53aWR0aCA+IHRoaXMubWF4UHJldmlld1dpZHRoID9cbiAgICAgIHRoaXMubWF4UHJldmlld1dpZHRoIDogdGhpcy5zY3JlZW5EaW1lbnNpb25zLndpZHRoIC0gNDA7XG4gICAgY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5zY3JlZW5EaW1lbnNpb25zLmhlaWdodCAtIDI0MDtcbiAgICBjb25zdCBjYWxjdWxhdGVkID0ge1xuICAgICAgd2lkdGg6IG1heFdpZHRoLFxuICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKG1heFdpZHRoIC8gcmF0aW8pLFxuICAgICAgcmF0aW86IHJhdGlvXG4gICAgfTtcblxuICAgIGlmIChjYWxjdWxhdGVkLmhlaWdodCA+IG1heEhlaWdodCkge1xuICAgICAgY2FsY3VsYXRlZC5oZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICBjYWxjdWxhdGVkLndpZHRoID0gTWF0aC5yb3VuZChtYXhIZWlnaHQgKiByYXRpbyk7XG4gICAgfVxuICAgIHJldHVybiBjYWxjdWxhdGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBwb2ludCBieSBpdCdzIHJvbGVzXG4gICAqIEBwYXJhbSByb2xlcyAtIGFuIGFycmF5IG9mIHJvbGVzIGJ5IHdoaWNoIHRoZSBwb2ludCB3aWxsIGJlIGZldGNoZWRcbiAgICovXG4gIHByaXZhdGUgZ2V0UG9pbnQocm9sZXM6IFJvbGVzQXJyYXkpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHMuZmluZChwb2ludCA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5saW1pdHNTZXJ2aWNlLmNvbXBhcmVBcnJheShwb2ludC5yb2xlcywgcm9sZXMpO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogYSBjbGFzcyBmb3IgZ2VuZXJhdGluZyBjb25maWd1cmF0aW9uIG9iamVjdHMgZm9yIHRoZSBlZGl0b3JcbiAqL1xuY2xhc3MgSW1hZ2VFZGl0b3JDb25maWcgaW1wbGVtZW50cyBEb2NTY2FubmVyQ29uZmlnIHtcbiAgLyoqXG4gICAqIG1heCBkaW1lbnNpb25zIG9mIG9wdXRwdXQgaW1hZ2UuIGlmIHNldCB0byB6ZXJvXG4gICAqL1xuICBtYXhJbWFnZURpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcbiAgICB3aWR0aDogODAwLFxuICAgIGhlaWdodDogMTIwMFxuICB9O1xuICAvKipcbiAgICogYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgbWFpbiBlZGl0b3IgZGl2XG4gICAqL1xuICBlZGl0b3JCYWNrZ3JvdW5kQ29sb3IgPSAnI2ZlZmVmZSc7XG4gIC8qKlxuICAgKiBjc3MgcHJvcGVydGllcyBmb3IgdGhlIG1haW4gZWRpdG9yIGRpdlxuICAgKi9cbiAgZWRpdG9yRGltZW5zaW9uczogeyB3aWR0aDogc3RyaW5nOyBoZWlnaHQ6IHN0cmluZzsgfSA9IHtcbiAgICB3aWR0aDogJzEwMHZ3JyxcbiAgICBoZWlnaHQ6ICcxMDB2aCdcbiAgfTtcbiAgLyoqXG4gICAqIGNzcyB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIG1haW4gZGl2IG9mIHRoZSBlZGl0b3IgY29tcG9uZW50XG4gICAqL1xuICBleHRyYUNzczoge1trZXk6IHN0cmluZ106IHN0cmluZ3xudW1iZXJ9ID0ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwXG4gIH07XG5cbiAgLyoqXG4gICAqIG1hdGVyaWFsIGRlc2lnbiB0aGVtZSBjb2xvciBuYW1lXG4gICAqL1xuICBidXR0b25UaGVtZUNvbG9yOiAncHJpbWFyeSd8J3dhcm4nfCdhY2NlbnQnID0gJ2FjY2VudCc7XG4gIC8qKlxuICAgKiBpY29uIGZvciB0aGUgYnV0dG9uIHRoYXQgY29tcGxldGVzIHRoZSBlZGl0aW5nIGFuZCBlbWl0cyB0aGUgZWRpdGVkIGltYWdlXG4gICAqL1xuICBleHBvcnRJbWFnZUljb24gPSAnY2xvdWRfdXBsb2FkJztcbiAgLyoqXG4gICAqIGNvbG9yIG9mIHRoZSBjcm9wIHRvb2xcbiAgICovXG4gIGNyb3BUb29sQ29sb3IgPSAnIzNjYWJlMic7XG4gIC8qKlxuICAgKiBzaGFwZSBvZiB0aGUgY3JvcCB0b29sLCBjYW4gYmUgZWl0aGVyIGEgcmVjdGFuZ2xlIG9yIGEgY2lyY2xlXG4gICAqL1xuICBjcm9wVG9vbFNoYXBlOiBQb2ludFNoYXBlID0gJ3JlY3QnO1xuICAvKipcbiAgICogZGltZW5zaW9ucyBvZiB0aGUgY3JvcCB0b29sXG4gICAqL1xuICBjcm9wVG9vbERpbWVuc2lvbnM6IEltYWdlRGltZW5zaW9ucyA9IHtcbiAgICB3aWR0aDogMTAsXG4gICAgaGVpZ2h0OiAxMFxuICB9O1xuICAvKipcbiAgICogYWdncmVnYXRpb24gb2YgdGhlIHByb3BlcnRpZXMgcmVnYXJkaW5nIHBvaW50IGF0dHJpYnV0ZXMgZ2VuZXJhdGVkIGJ5IHRoZSBjbGFzcyBjb25zdHJ1Y3RvclxuICAgKi9cbiAgcG9pbnRPcHRpb25zOiBQb2ludE9wdGlvbnM7XG4gIC8qKlxuICAgKiBhZ2dyZWdhdGlvbiBvZiB0aGUgcHJvcGVydGllcyByZWdhcmRpbmcgdGhlIGVkaXRvciBzdHlsZSBnZW5lcmF0ZWQgYnkgdGhlIGNsYXNzIGNvbnN0cnVjdG9yXG4gICAqL1xuICBlZGl0b3JTdHlsZT86IHtba2V5OiBzdHJpbmddOiBzdHJpbmd8bnVtYmVyfTtcbiAgLyoqXG4gICAqIGNyb3AgdG9vbCBvdXRsaW5lIHdpZHRoXG4gICAqL1xuICBjcm9wVG9vbExpbmVXZWlnaHQgPSAzO1xuICAvKipcbiAgICogbWF4aW11bSBzaXplIG9mIHRoZSBwcmV2aWV3IHBhbmVcbiAgICovXG4gIG1heFByZXZpZXdXaWR0aCA9IDgwMDtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zOiBEb2NTY2FubmVyQ29uZmlnKSB7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgdGhpc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5lZGl0b3JTdHlsZSA9IHsnYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuZWRpdG9yQmFja2dyb3VuZENvbG9yIH07XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmVkaXRvclN0eWxlLCB0aGlzLmVkaXRvckRpbWVuc2lvbnMpO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5lZGl0b3JTdHlsZSwgdGhpcy5leHRyYUNzcyk7XG5cbiAgICB0aGlzLnBvaW50T3B0aW9ucyA9IHtcbiAgICAgIHNoYXBlOiB0aGlzLmNyb3BUb29sU2hhcGUsXG4gICAgICBjb2xvcjogdGhpcy5jcm9wVG9vbENvbG9yLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDBcbiAgICB9O1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5wb2ludE9wdGlvbnMsIHRoaXMuY3JvcFRvb2xEaW1lbnNpb25zKTtcbiAgfVxufVxuXG4iXX0=