/**
 * @author Philipp Winterle
 * @file : Simply load this module after the lightGallery has been included. Then after you added some more images to you container trigger the "refreshItems"- * Event on it and you are done.
 */
(function ($, window, document, undefined) {

    'use strict';

    var defaults = {
        itemsAutoUpdate: true,
        imageCount: 0
    };

    var AutoUpdate = function (element) {

        // You can access all lightgallery variables and functions like this.
        this.core = jQuery(element).data('lightGallery');

        this.$el = jQuery(element);
        this.core.s = jQuery.extend({}, defaults, this.core.s);

        this.init();

        return this;
    };

    AutoUpdate.prototype.init = function () {
        if(this.core.s.itemsAutoUpdate) {
            if (this.core.s.imageCount !== 0) {
                var self = this;
                this.$el.on("onAfterOpen.lg", function() {
                    self.setCounter(self.core.s.imageCount);
                });
            }
            // Add custom events for triggering
            this.$el.on("refreshItems", this.refreshItems);

        }

    };

    AutoUpdate.prototype.refreshItems = function () {
        var self = this;
        // Get core data
        this.core = jQuery(this).data('lightGallery');

        // Check if gallery is opened
        if (jQuery(".lg-outer").length > 0) {

            // Add gallery items
            if (this.core.s.dynamic) {
                this.core.$items = this.core.s.dynamicEl;
            } else {
                if (this.core.s.selector === 'this') {
                    this.core.$items = this.core.$el;
                } else if (this.core.s.selector !== '') {
                    if (this.core.s.selectWithin) {
                        this.core.$items = jQuery(this.core.s.selectWithin).find(this.core.s.selector);
                    } else {
                        this.core.$items = this.core.$el.find(jQuery(this.core.s.selector));
                    }
                } else {
                    this.core.$items = this.core.$el.children();
                }
            }

            // Append new elements to outer html
            var elementsToAdd = this.core.$items.length - this.core.$outer.find(".lg-inner").find(".lg-item").length;
            while (elementsToAdd > 0) {
                var newSlide = jQuery('<div class="lg-item"></div>');
                this.core.$outer.find(".lg-inner").append(newSlide);
                this.core.$slide = this.core.$outer.find(".lg-item");
                elementsToAdd--;
            }

            // Add removed events again
            this.core.$items.on('click.lgcustom', function(event) {

                // For IE8
                try {
                    event.preventDefault();
                } catch (er) {
                    event.returnValue = false;
                }

                self.core.$el.trigger('onBeforeOpen.lg');

                self.core.index = self.core.s.index || self.core.$items.index(this);

                // prevent accidental double execution
                if (!jQuery('body').hasClass('lg-on')) {
                    self.core.build(self.core.index);
                    jQuery('body').addClass('lg-on');
                }
            });

            this.core.enableSwipe();
            this.core.enableDrag();

            // this.core.modules.autoUpdate.overwriteCloseEvent();

            // Write the counter state
            if (this.core.s.imageCount === 0) {
                this.core.modules.autoUpdate.setCounter(this.core.$items.length);
            }
        }
    };

    AutoUpdate.prototype.overwriteCloseEvent = function() {
        var core = this.core;
        // Overwrites of close behaviour
        this.core.$outer.off("mouseup.lg");

        this.core.$outer.on('mouseup.lg', function(e) {

            if (jQuery(e.target).is('.lg-close') ) {
                if (!core.$outer.hasClass('lg-dragging')) {
                    core.destroy();
                }
            }

        });
    };

    AutoUpdate.prototype.setCounter = function(count) {
        // Write the counter state
        this.core.$outer.find('#lg-counter-all').html(count);
    };

    /**
     * Destroy function must be defined.
     * lightgallery will automatically call your module destroy function
     * before destroying the gallery
     */
    AutoUpdate.prototype.destroy = function () {

    };

    // Attach your module with lightgallery
    jQuery.fn.lightGallery.modules.autoUpdate = AutoUpdate;


})(jQuery, window, document);