(function(laroux) {
    "use strict";

    // ui
    laroux.ui = {
        floatContainer: null,

        popup: {
            defaultTimeout: 500,

            createBox: function(id, xclass, message) {
                return laroux.dom.createElement('DIV', { 'id': id, 'class': xclass },
                    message
                );
            },

            msgbox: function(timeout, message) {
                var id = laroux.helpers.getUniqueId();
                var obj = laroux.ui.popup.createBox(id, 'laroux_msgbox', message);
                laroux.ui.floatContainer.appendChild(obj);

                laroux.css.setProperty(obj, 'opacity', '1');

                laroux.timers.set({
                    timeout: timeout,
                    reset: false,
                    ontick: function(x) {
                        // laroux.css.setProperty(x, 'opacity', '0');
                        laroux.dom.remove(x);
                    },
                    state: obj
                });
            },

            init: function() {
                laroux.popupFunc = function(message) {
                    laroux.ui.popup.msgbox(laroux.ui.popup.defaultTimeout, message);
                };
            }
        },

        loading: {
            elementSelector: null,
            element: null,
            defaultDelay: 1500,
            timer: null,

            killTimer: function() {
                clearTimeout(laroux.ui.loading.timer);
            },

            hide: function() {
                laroux.ui.loading.killTimer();

                laroux.css.setProperty(laroux.ui.loading.element, 'display', 'none');
                localStorage.loadingIndicator = 'false';
            },

            show: function(delay) {
                laroux.ui.loading.killTimer();

                if (typeof delay == 'undefined') {
                    delay = laroux.ui.loading.defaultDelay;
                }

                if (delay > 0) {
                    setTimeout(function() { laroux.ui.loading.show(0); }, delay);
                } else {
                    laroux.css.setProperty(laroux.ui.loading.element, 'display', 'block');
                    localStorage.loadingIndicator = 'true';
                }
            },

            init: function() {
                if (laroux.ui.loading.element === null && laroux.ui.loading.elementSelector !== null) {
                    laroux.ui.loading.element = laroux.dom.selectSingle(laroux.ui.loading.elementSelector);
                }

                if (laroux.ui.loading.element !== null) {
                    laroux.dom.setEvent(window, 'load', laroux.ui.loading.hide);
                    laroux.dom.setEvent(window, 'beforeunload', laroux.ui.loading.show);

                    if (typeof localStorage.loadingIndicator != 'undefined' && localStorage.loadingIndicator == 'true') {
                        laroux.ui.loading.show(0);
                    } else {
                        laroux.ui.loading.show();
                    }
                }
            }
        },

        dynamicDates: {
            updateDatesElements: null,

            updateDates: function() {
                if (laroux.ui.dynamicDates.updateDatesElements === null) {
                    laroux.ui.dynamicDates.updateDatesElements = laroux.dom.select('*[data-epoch]');
                }

                laroux.ui.dynamicDates.updateDatesElements.forEach(function(obj) {
                    var date = new Date(parseInt(obj.getAttribute('data-epoch'), 10) * 1000);

                    laroux.dom.replace(
                        obj,
                        laroux.date.getDateString(date)
                    );

                    obj.setAttribute('title', laroux.date.getLongDateString(date));
                });
            },

            init: function() {
                laroux.timers.set({
                    timeout: 500,
                    reset: true,
                    ontick: laroux.ui.dynamicDates.updateDates
                });
            }
        },

        createFloatContainer: function() {
            if (!laroux.ui.floatContainer) {
                laroux.ui.floatContainer = laroux.dom.createElement('DIV', { id: 'laroux_floatdiv' }, '');
                document.body.insertBefore(laroux.ui.floatContainer, document.body.firstChild);
            }
        },

        init: function() {
            laroux.ui.createFloatContainer();
            laroux.ui.popup.init();
            laroux.ui.loading.init();
            laroux.ui.dynamicDates.init();
        }
    };
})(this.laroux);
