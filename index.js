const touchMyRipple = () => {

    let mouseMove = false;
    const defaultSettings = {
        area: '',
        color: 'rgba(255, 255, 255, 0.4)',
        offsetEl: null,
        eventListener: 'click',
    };

    function onDrag(eventListener) {
        if (eventListener === 'touchend') {
            document.getElementsByTagName('body')[0].addEventListener('touchmove', () => {
                mouseMove = true;
            });
        }
    }

    function ripple(els, rippleColor, eventListener) {
        for (let i = 0; i < els.length; i += 1) {
            const currentBtn = els[i];

            currentBtn.addEventListener(eventListener, function (e) {
                let PageX;
                let PageY;

                if (eventListener.match(/touch/) && eventListener.match(/touch/)[0].length > 0) {
                    PageX = e.changedTouches[0].pageX;
                    PageY = e.changedTouches[0].pageY;
                } else {
                    PageX = e.x;
                    PageY = e.y;
                }

                var el = this.getBoundingClientRect(),
                    btnWidth = this.clientWidth,
                    rippleOffset = defaultSettings.offsetEl,
                    headerHeight = rippleOffset ? rippleOffset.clientHeight : 0,
                    btnOffsetTop = el.top + headerHeight,
                    btnOffsetLeft = el.left,
                    posMouseX = PageX,
                    posMouseY = PageY + headerHeight,
                    rippleX = posMouseX - btnOffsetLeft,
                    rippleY = posMouseY - btnOffsetTop;

                const baseCSS = `position: absolute;
                               width: ${btnWidth * 2}px;
                               height: ${btnWidth * 2}px;
                               border-radius: 50%;
                               transition: transform 700ms, opacity 700ms;
                               transition-timing-function: cubic-bezier(0.250, 0.460, 0.450, 0.940);
                               background: ${rippleColor};
                               background-position: center;
                               background-repeat: no-repeat;
                               background-size: 100%;
                               top: ${rippleY - btnWidth}px;
                               left: ${rippleX - btnWidth}px;
                               transform: scale(0);
                               pointer-events: none;`;

                // Prepare the dom
                const rippleEffect = document.createElement('span');
                rippleEffect.style.cssText = baseCSS;

                // Add some css for prevent errors
                this.style.overflow = 'hidden';

                if (window.getComputedStyle(this).position !== 'absolute' || window.getComputedStyle(this).position !== 'fixed') {

                    this.style.position = 'relative';
                }

                if (mouseMove) {
                    mouseMove = false;
                    return;
                }

                this.appendChild(rippleEffect);

                // start animation
                setTimeout(() => {
                    rippleEffect.style.cssText = `${baseCSS} transform: scale(1); opacity: 0;`;
                }, 50);

                setTimeout(() => {
                    rippleEffect.remove();
                }, 700);
            });
        }
    }

    function attachRippleToAttribute(area, rippleColor, eventListener) {
        const attributeEl = document.querySelectorAll(`${area} [data-animation='ripple']`);

        if (attributeEl.length > 0) {
            ripple(attributeEl, rippleColor, eventListener);
        } else {
            throw new Error('Selector/s not found');
        }
    }

    function attachRippleToSelectors(selectors, rippleColor, eventListener) {
        let selectorsEl;

        if (selectors) {
            selectorsEl = document.querySelectorAll(selectors);
        } else {
            throw new Error('You have to enter at least 1 selector');
        }

        if (selectorsEl.length <= 0) {
            console.warn('No element found');
        }

        ripple(selectorsEl, rippleColor, eventListener);
    }

    const tmripple = {

        init(data) {
            try {
                defaultSettings.area = (data && data.area) ? data.area : defaultSettings.area;
                defaultSettings.color = (data && data.color) ? data.color : defaultSettings.color;
                defaultSettings.offsetEl = (data && data.offsetEl) ? this.setOffsetEl(data.offsetEl) : defaultSettings.offsetEl;
                defaultSettings.eventListener = (data && data.eventListener) ? data.eventListener : defaultSettings.eventListener;

                onDrag(defaultSettings.eventListener);
                attachRippleToAttribute(defaultSettings.area, defaultSettings.color, defaultSettings.eventListener);
            } catch (e) {
                console.error(e.message);
                console.error(e);
            }
        },

        attachToSelectors(data) {
            try {
                const rippleColor = data.color || defaultSettings.color;
                const eventListener = data.eventListener || defaultSettings.eventListener;

                attachRippleToSelectors(data.selectors, rippleColor, eventListener);
            } catch (e) {
                console.error(e.message);
                console.error(e);
            }
        },

        setOffsetEl(el) {
            defaultSettings.offsetEl = document.querySelector(el);
        },
    };
    return tmripple;
};

export default touchMyRipple();
export const tmripple = touchMyRipple();
