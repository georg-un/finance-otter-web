/**
 * @fileoverview added by tsickle
 * Generated from: lib/components/shape-outline/ngx-shape-outline.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, ViewChild } from '@angular/core';
import { LimitsService } from '../../services/limits.service';
var NgxShapeOutlineComponent = /** @class */ (function () {
    function NgxShapeOutlineComponent(limitsService) {
        this.limitsService = limitsService;
        this.color = '#3cabe2';
    }
    /**
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // init drawing canvas dimensions
        this.canvas.nativeElement.width = this.dimensions.width;
        this.canvas.nativeElement.height = this.dimensions.height;
        this.limitsService.positions.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        function (positions) {
            if (positions.length === 4) {
                _this._points = positions;
                _this.sortPoints();
                _this.clearCanvas();
                _this.drawShape();
            }
        }));
        // subscribe to changes in the pane's dimensions
        this.limitsService.paneDimensions.subscribe((/**
         * @param {?} dimensions
         * @return {?}
         */
        function (dimensions) {
            _this.clearCanvas();
            _this.canvas.nativeElement.width = dimensions.width;
            _this.canvas.nativeElement.height = dimensions.height;
        }));
        // subscribe to reposition events
        this.limitsService.repositionEvent.subscribe((/**
         * @param {?} positions
         * @return {?}
         */
        function (positions) {
            if (positions.length === 4) {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.clearCanvas();
                    _this.sortPoints();
                    _this.drawShape();
                }), 10);
            }
        }));
    };
    /**
     * clears the shape canvas
     */
    /**
     * clears the shape canvas
     * @private
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.clearCanvas = /**
     * clears the shape canvas
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var canvas = this.canvas.nativeElement;
        /** @type {?} */
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height);
    };
    /**
     * sorts the array of points according to their clockwise alignment
     */
    /**
     * sorts the array of points according to their clockwise alignment
     * @private
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.sortPoints = /**
     * sorts the array of points according to their clockwise alignment
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var _points = Array.from(this._points);
        /** @type {?} */
        var sortedPoints = [];
        /** @type {?} */
        var sortOrder = {
            vertical: ['top', 'top', 'bottom', 'bottom'],
            horizontal: ['left', 'right', 'right', 'left']
        };
        var _loop_1 = function (i) {
            /** @type {?} */
            var roles = Array.from([sortOrder.vertical[i], sortOrder.horizontal[i]]);
            sortedPoints.push(_points.filter((/**
             * @param {?} point
             * @return {?}
             */
            function (point) {
                return _this.limitsService.compareArray(point.roles, roles);
            }))[0]);
        };
        for (var i = 0; i < 4; i++) {
            _loop_1(i);
        }
        this._sortedPoints = sortedPoints;
    };
    /**
     * draws a line between the points according to their order
     */
    /**
     * draws a line between the points according to their order
     * @private
     * @return {?}
     */
    NgxShapeOutlineComponent.prototype.drawShape = /**
     * draws a line between the points according to their order
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var canvas = this.canvas.nativeElement;
        /** @type {?} */
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = this.weight;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        this._sortedPoints.forEach((/**
         * @param {?} point
         * @param {?} index
         * @return {?}
         */
        function (point, index) {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            }
            if (index !== _this._sortedPoints.length - 1) {
                /** @type {?} */
                var nextPoint = _this._sortedPoints[index + 1];
                ctx.lineTo(nextPoint.x, nextPoint.y);
            }
            else {
                ctx.closePath();
            }
        }));
        ctx.stroke();
    };
    NgxShapeOutlineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-shape-outine',
                    template: "<canvas #outline\n        style=\"position: absolute; z-index: 1000\"\n        [ngStyle]=\"{width: dimensions.width + 'px', height: dimensions.height + 'px'}\"\n        *ngIf=\"dimensions\">\n</canvas>\n"
                }] }
    ];
    /** @nocollapse */
    NgxShapeOutlineComponent.ctorParameters = function () { return [
        { type: LimitsService }
    ]; };
    NgxShapeOutlineComponent.propDecorators = {
        color: [{ type: Input }],
        weight: [{ type: Input }],
        dimensions: [{ type: Input }],
        canvas: [{ type: ViewChild, args: ['outline', { static: false },] }]
    };
    return NgxShapeOutlineComponent;
}());
export { NgxShapeOutlineComponent };
if (false) {
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.color;
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.weight;
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.dimensions;
    /** @type {?} */
    NgxShapeOutlineComponent.prototype.canvas;
    /**
     * @type {?}
     * @private
     */
    NgxShapeOutlineComponent.prototype._points;
    /**
     * @type {?}
     * @private
     */
    NgxShapeOutlineComponent.prototype._sortedPoints;
    /**
     * @type {?}
     * @private
     */
    NgxShapeOutlineComponent.prototype.limitsService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNoYXBlLW91dGxpbmUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWRvY3VtZW50LXNjYW5uZXIvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9zaGFwZS1vdXRsaW5lL25neC1zaGFwZS1vdXRsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekUsT0FBTyxFQUFDLGFBQWEsRUFBc0IsTUFBTSwrQkFBK0IsQ0FBQztBQUdqRjtJQWFFLGtDQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQVB2QyxVQUFLLEdBQUcsU0FBUyxDQUFDO0lBT3dCLENBQUM7Ozs7SUFFcEQsa0RBQWU7OztJQUFmO1FBQUEsaUJBNEJDO1FBM0JDLGlDQUFpQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFNBQVM7Ozs7UUFBQyxVQUFBLFNBQVM7WUFDOUMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDMUIsS0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7Z0JBQ3pCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuQixLQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDbEI7UUFDSCxDQUFDLEVBQUMsQ0FBQztRQUNILGdEQUFnRDtRQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxTQUFT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QUU7Z0JBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtZQUNELElBQUksS0FBSyxLQUFLLEtBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7b0JBQ3JDLFNBQVMsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEM7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDZixDQUFDOztnQkFqR0YsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLHVOQUFpRDtpQkFDbEQ7Ozs7Z0JBTk8sYUFBYTs7O3dCQVNsQixLQUFLO3lCQUNMLEtBQUs7NkJBQ0wsS0FBSzt5QkFDTCxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzs7SUF5RnZDLCtCQUFDO0NBQUEsQUFsR0QsSUFrR0M7U0E5Rlksd0JBQXdCOzs7SUFFbkMseUNBQTJCOztJQUMzQiwwQ0FBd0I7O0lBQ3hCLDhDQUFxQzs7SUFDckMsMENBQThDOzs7OztJQUU5QywyQ0FBNEM7Ozs7O0lBQzVDLGlEQUFrRDs7Ozs7SUFDdEMsaURBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtMaW1pdHNTZXJ2aWNlLCBQb2ludFBvc2l0aW9uQ2hhbmdlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9saW1pdHMuc2VydmljZSc7XG5pbXBvcnQge0ltYWdlRGltZW5zaW9uc30gZnJvbSAnLi4vLi4vUHVibGljTW9kZWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LXNoYXBlLW91dGluZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZ3gtc2hhcGUtb3V0bGluZS5jb21wb25lbnQuaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIE5neFNoYXBlT3V0bGluZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIGNvbG9yID0gJyMzY2FiZTInO1xuICBASW5wdXQoKSB3ZWlnaHQ6IG51bWJlcjtcbiAgQElucHV0KCkgZGltZW5zaW9uczogSW1hZ2VEaW1lbnNpb25zO1xuICBAVmlld0NoaWxkKCdvdXRsaW5lJywge3N0YXRpYzogZmFsc2V9KSBjYW52YXM7XG5cbiAgcHJpdmF0ZSBfcG9pbnRzOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPjtcbiAgcHJpdmF0ZSBfc29ydGVkUG9pbnRzOiBBcnJheTxQb2ludFBvc2l0aW9uQ2hhbmdlPjtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBsaW1pdHNTZXJ2aWNlOiBMaW1pdHNTZXJ2aWNlKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBpbml0IGRyYXdpbmcgY2FudmFzIGRpbWVuc2lvbnNcbiAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gdGhpcy5kaW1lbnNpb25zLndpZHRoO1xuICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gdGhpcy5kaW1lbnNpb25zLmhlaWdodDtcbiAgICB0aGlzLmxpbWl0c1NlcnZpY2UucG9zaXRpb25zLnN1YnNjcmliZShwb3NpdGlvbnMgPT4ge1xuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgdGhpcy5fcG9pbnRzID0gcG9zaXRpb25zO1xuICAgICAgICB0aGlzLnNvcnRQb2ludHMoKTtcbiAgICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xuICAgICAgICB0aGlzLmRyYXdTaGFwZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIHN1YnNjcmliZSB0byBjaGFuZ2VzIGluIHRoZSBwYW5lJ3MgZGltZW5zaW9uc1xuICAgIHRoaXMubGltaXRzU2VydmljZS5wYW5lRGltZW5zaW9ucy5zdWJzY3JpYmUoZGltZW5zaW9ucyA9PiB7XG4gICAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LndpZHRoID0gZGltZW5zaW9ucy53aWR0aDtcbiAgICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuaGVpZ2h0ID0gZGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgfSk7XG4gICAgLy8gc3Vic2NyaWJlIHRvIHJlcG9zaXRpb24gZXZlbnRzXG4gICAgdGhpcy5saW1pdHNTZXJ2aWNlLnJlcG9zaXRpb25FdmVudC5zdWJzY3JpYmUoIHBvc2l0aW9ucyA9PiB7XG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICBzZXRUaW1lb3V0KCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xuICAgICAgICAgIHRoaXMuc29ydFBvaW50cygpO1xuICAgICAgICAgIHRoaXMuZHJhd1NoYXBlKCk7XG4gICAgICAgIH0sIDEwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjbGVhcnMgdGhlIHNoYXBlIGNhbnZhc1xuICAgKi9cbiAgcHJpdmF0ZSBjbGVhckNhbnZhcygpIHtcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50O1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5kaW1lbnNpb25zLndpZHRoLCB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzb3J0cyB0aGUgYXJyYXkgb2YgcG9pbnRzIGFjY29yZGluZyB0byB0aGVpciBjbG9ja3dpc2UgYWxpZ25tZW50XG4gICAqL1xuICBwcml2YXRlIHNvcnRQb2ludHMoKSB7XG4gICAgY29uc3QgX3BvaW50cyA9IEFycmF5LmZyb20odGhpcy5fcG9pbnRzKTtcbiAgICBjb25zdCBzb3J0ZWRQb2ludHMgPSBbXTtcblxuICAgIGNvbnN0IHNvcnRPcmRlciA9IHtcbiAgICAgIHZlcnRpY2FsOiBbJ3RvcCcsICd0b3AnLCAnYm90dG9tJywgJ2JvdHRvbSddLFxuICAgICAgaG9yaXpvbnRhbDogWydsZWZ0JywgJ3JpZ2h0JywgJ3JpZ2h0JywgJ2xlZnQnXVxuICAgIH07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgY29uc3Qgcm9sZXMgPSBBcnJheS5mcm9tKFtzb3J0T3JkZXIudmVydGljYWxbaV0sIHNvcnRPcmRlci5ob3Jpem9udGFsW2ldXSk7XG4gICAgICBzb3J0ZWRQb2ludHMucHVzaChfcG9pbnRzLmZpbHRlcigocG9pbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGltaXRzU2VydmljZS5jb21wYXJlQXJyYXkocG9pbnQucm9sZXMsIHJvbGVzKTtcbiAgICAgIH0pWzBdKTtcblxuICAgIH1cbiAgICB0aGlzLl9zb3J0ZWRQb2ludHMgPSBzb3J0ZWRQb2ludHM7XG4gIH1cblxuICAvKipcbiAgICogZHJhd3MgYSBsaW5lIGJldHdlZW4gdGhlIHBvaW50cyBhY2NvcmRpbmcgdG8gdGhlaXIgb3JkZXJcbiAgICovXG4gIHByaXZhdGUgZHJhd1NoYXBlKCkge1xuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQ7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMud2VpZ2h0O1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuX3NvcnRlZFBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICBjdHgubW92ZVRvKHBvaW50LngsIHBvaW50LnkpO1xuICAgICAgfVxuICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLl9zb3J0ZWRQb2ludHMubGVuZ3RoIC0gMSkge1xuICAgICAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLl9zb3J0ZWRQb2ludHNbaW5kZXggKyAxXTtcbiAgICAgICAgY3R4LmxpbmVUbyhuZXh0UG9pbnQueCwgbmV4dFBvaW50LnkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGN0eC5zdHJva2UoKTtcbiAgfVxufVxuXG5cbiJdfQ==