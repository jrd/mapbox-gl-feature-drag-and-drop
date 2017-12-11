const DOM = require("mapbox-gl/src/util/dom");
const util = require("mapbox-gl/src/util/util");
const window = require("mapbox-gl/src/util/window");

/**
 * Feature drag and drop handler class.
 *
 * The following events will be triggered on the map:
 * - `feature-is-draggable`
 * - `feature-dragstart`
 * - `feature-drag`
 * - `feature-dragend`
 *
 * Each event is composed of the following fields:
 * - `originalEvent` the browser event
 * - `startPoint` the point where the drag starts
 * - `point` the current point
 * - `feature` the feature on which the drag starts
 * - `handler` this handler instance
 *
 * @param {Map} map The Mapbox GL JS map to add the handler to.
 */
class FeatureDragNDropHandler {
    constructor(map) {
        this._map = map;
        this._el = map.getCanvasContainer();
        this._enabled = false;
        this._active = false;
        this._startPos = null;
        this._pos = null;
        this._feature = null;
        util.bindAll([
            "_onDown",
            "_onMove",
            "_onUp",
            "_onTouchEnd",
            "_onMouseUp"
        ], this);
    }

    /**
     * Returns a boolean indicating whether this handler is enabled or not.
     *
     * @returns {boolean} `true` if the drag and drop enabled.
     */
    isEnabled() {
        return !!this._enabled;
    }

    /**
     * Returns a boolean indicating whether this handler is in a dragging state or not.
     *
     * @returns {boolean} `true` if dragging.
     */
    isActive() {
        return !!this._active;
    }

    /**
     * Enables this handler
     */
    enable() {
        if (!this.isEnabled()) {
            this._el.addEventListener("mousedown", this._onDown);
            this._el.addEventListener("touchstart", this._onDown);
            this._enabled = true;
        }
    }

    /**
     * Disables this handler
     */
    disable() {
        if (this.isEnabled()) {
            this._el.removeEventListener("mousedown", this._onDown);
            this._el.removeEventListener("touchstart", this._onDown);
            this._enabled = false;
        }
    }

    /**
     * Call by external code when a `feature-is-draggable` event is triggered and the feature should not be draggable
     */
    featureNotDraggable() {
        this._startPos = null;
        this._pos = null;
        this._feature = null;
    }

    /**
     * Returns the feature on which the drag starts.
     * @returns {Object} the feature on which the drag starts.
     */
    getFeature() {
        return this._feature;
    }

    /**
     * Tells if the event is processed by this handler or not.
     * @private
     * @param {Event} e any browser event but probably on MouseEvent or TouchEvent.
     * @returns {boolean} `true` is event ignored
     */
    _ignoreEvent(e) {
        const map = this._map;
        if (map.boxZoom && map.boxZoom.isActive()) {
            return true;
        } else if (map.dragPan && map.dragPan.isActive()) {
            return true;
        } else if (map.dragRotate && map.dragRotate.isActive()) {
            return true;
        } else if (e.touches) {
            return !!(e.touches.length > 1);
        } else if (e.ctrlKey) {
            return true;
        } else {
            return e.type !== "mousemove" && e.button && e.button !== 0; // left button
        }
    }

    /**
     * Convert a local `Point` instance into a `[x, y]` `Array`.
     * @param {Point} point local `Point` instance
     * @returns {Array}
     */
    _pointToArray(point) {
        return point ? [point.x, point.y] : null;
    }

    /**
     * Triggered when a mouse button is pressed on the canvas.
     * @private
     * @param {MouseEvent|TouchEvent} e mouse or touch browser event
     */
    _onDown(e) {
        if (!this._ignoreEvent(e) && !this.isActive()) {
            // because this plugin Point class prototype will be different than the one defined in mapboxgl
            // this._pos could no be considered a Point for the map
            // https://github.com/mapbox/mapbox-gl-js/blob/46ec4e2fb57f0db772ec928ac8d945efde5d2082/src/ui/map.js#L802
            // https://github.com/mapbox/mapbox-gl-js/blob/46ec4e2fb57f0db772ec928ac8d945efde5d2082/src/ui/map.js#L784
            // So the Point instance is converted to a Array.
            this._startPos = this._pos = this._pointToArray(DOM.mousePos(this._el, e));
            this._feature = this._map.queryRenderedFeatures(this._pos).shift();
            this._fireEvent("feature-is-draggable", e);
            if (this._feature) {
                if (e.touches) {
                    window.document.addEventListener("touchmove", this._onMove);
                    window.document.addEventListener("touchend", this._onTouchEnd);
                } else {
                    window.document.addEventListener("mousemove", this._onMove);
                    window.document.addEventListener("mouseup", this._onMouseUp);
                    window.addEventListener("blur", this._onMouseUp);
                }
            }
        }
    }

    /**
     * Triggered when the mouse move on the document.
     * @private
     * @param {MouseEvent|TouchEvent} e mouse or touch browser event
     */
    _onMove(e) {
        if (this._ignoreEvent(e) || !this._feature) {
            return;
        }
        this._pos = this._pointToArray(DOM.mousePos(this._el, e));
        if (!this.isActive()) {
            this._active = true;
            this._fireEvent("feature-dragstart", e);
        }
        this._fireEvent("feature-drag", e);
        e.preventDefault();
    }

    /**
     * Triggered when a mouse button is released or the touch event ends.
     * @private
     * @param {MouseEvent|TouchEvent|FocusEvent} e mouse or touch browser event
     */
    _onUp(e) {
        if (!this.isActive()) {
            return;
        }
        this._active = false;
        this._pos = this._pointToArray(DOM.mousePos(this._el, e));
        this._fireEvent("feature-dragend", e);
    }

    /**
     * Triggered when a mouse button is released or the mouse leave the window.
     * @private
     * @param {MouseEvent|FocusEvent} e mouse browser event
     */
    _onMouseUp(e) {
        if (!this._ignoreEvent(e)) {
            this._onUp(e);
            window.document.removeEventListener("mousemove", this._onMove);
            window.document.removeEventListener("mouseup", this._onMouseUp);
            window.removeEventListener("blur", this._onMouseUp);
        }
    }

    /**
     * Triggered when the touch event ends.
     * @private
     * @param {FocusEvent} e touch browser event
     */
    _onTouchEnd(e) {
        if (!this._ignoreEvent(e)) {
            this._onUp(e);
            window.document.removeEventListener("touchmove", this._onMove);
            window.document.removeEventListener("touchend", this._onTouchEnd);
        }
    }

    /**
     * Fire the event on the map.
     *
     * The event is wrapped in a object providing the following fields:
     * - `originalEvent` the browser event
     * - `startPoint` the point where the drag starts
     * - `point` the current point
     * - `feature` the feature on which the drag starts
     * - `handler` this handler instance
     *
     * @private
     * @param {string} type event type
     * @param {Event} e browser event
     * @returns {Map} the map instance
     */
    _fireEvent(type, e) {
        return this._map.fire(type, {
            originalEvent: e,
            startPoint: this._startPos,
            point: this._pos,
            feature: this._feature,
            handler: this
        });
    }
}

module.exports = FeatureDragNDropHandler;
