const script = () => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.defaults({
        invalidateOnRefresh: true,
        // scroller: '.main-inner',
    });
    const parseRem = (input) => {
        return input / 10 * parseFloat($('html').css('font-size'))
    }
    const viewport = {
        w: window.innerWidth,
        h: window.innerHeight,
    };
    const device = { desktop: 991, tablet: 767, mobile: 479 }

    const cvUnit = (val, unit) => {
        let result;
        switch (true) {
            case unit === 'vw':
                result = window.innerWidth * (val / 100);
                break;
            case unit === 'vh':
                result = window.innerHeight * (val / 100);
                break;
            case unit === 'rem':
                result = val / 10 * parseFloat($('html').css('font-size'));
                break;
            default: break;
        }
        return result;
    }
    const debounce = (func, timeout = 300) => {
        let timer

        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => { func.apply(this, args) }, timeout)
        }
    }
    const refreshOnBreakpoint = () => {
        const breakpoints = Object.values(device).sort((a, b) => a - b);
        const initialViewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const breakpoint = breakpoints.find(bp => initialViewportWidth < bp) || breakpoints[breakpoints.length - 1];
        window.addEventListener('resize', debounce(function () {
            const newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
            if ((initialViewportWidth < breakpoint && newViewportWidth >= breakpoint) ||
                (initialViewportWidth >= breakpoint && newViewportWidth < breakpoint)) {
                location.reload();
            }
        }));
    }

    const lenis = new Lenis({
        // wrapper: document.querySelector('.main-inner'),
        // smoothTouch: false,
    })
    gsap.ticker.add((time) => {
        if (lenis) {
            lenis.raf(time * 1000);
        }
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', () => {
    })
    const pageName = $('.main-inner').attr('data-barba-namespace');

    class Header extends HTMLElement {
        constructor() {
            super();
            this.el = this;
        }
        connectedCallback() {
            if (window.innerWidth > 991) {
                this.setupDesktop();
                this.update();

            } else {
                this.setupMobile();
            }

        }
        setupMobile() {
            console.log('mobile')
            this.el.querySelector('.header-menu-toggle').addEventListener('click', (e) => {
                console.log('click')
                e.preventDefault();
                this.toggleMenu();
            })
        }
        setupDesktop() {
        }
        toggleSticky(state) {
        }
        update() {
        }
        toggleMenu() {
        }
    }
    // customElements.define('header', Header);

    const HomePage = {

    }
    const TermPage = {
        'term-main-wrap': class extends HTMLElement {
            constructor() {
                super();
                this.tlTrigger = null;
            }
            connectedCallback() {
                this.tlTrigger = gsap.timeline({
                    scrollTrigger: {
                        trigger: this,
                        start: 'top bottom+=50%',
                        end: 'bottom top-=50%',
                        once: true,
                        onEnter: () => {
                            this.onTrigger();
                        }
                    }
                });
            }
            onTrigger() {
                this.animationScrub();
                this.animationReveal();
                if (viewport.w > 767) {
                    this.setup();
                    this.interact();
                }
            }
            animationReveal() {
            }
            animationScrub() {
            }
            setup() {
                let tocClone = $('.term-main-toc-item').eq(0).clone().removeClass('active');
                let headings = $('.term-main-content-richtext h2');
                $('.term-main-toc-list').html('');
                headings.each((idx, heading) => {
                    let text = $(heading).text();
                    let id = text.toLowerCase().trim().replace(/^\d+\.\s*/, '').replace(/\s*\([^)]*\)/g, '').replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
                    let link = tocClone.clone();
                    $(heading).attr('id', id);
                    link.attr('href', `#${id}`);
                    link.find('.txt').text(text);
                    $('.term-main-toc-list').append(link);
                })
                $('.term-main-toc-stick').css('top', $('.header').outerHeight());
            }
            interact() {
                let headings = $('.term-main-content-richtext h2');

                lenis.on('scroll', function (e) {
                    let currScroll = e.scroll;
                    for (let i = 0; i < headings.length; i++) {
                        let top = headings.eq(i).get(0).getBoundingClientRect().top;
                        if (top > 0 && top < (viewport.h / 5)) {
                            let id = headings.eq(i).attr('id');
                            $(`.term-main-toc-item[href="#${id}"]`).addClass('w--current');
                            $(`.term-main-toc-item`).not(`[href="#${id}"]`).removeClass('w--current');
                        }
                    }
                });

                $('.term-main-toc-item').on('click', function (e) {
                    e.preventDefault();
                    let target = $(this).attr('href');

                    lenis.scrollTo(target, {
                        offset: -100,
                        duration: .2,
                        force: true
                    })
                    $(this).addClass('w--current');
                    $(`.term-main-toc-item`).not(this).removeClass('w--current');

                    history.replaceState({}, '', `${window.location.pathname + target}`);
                    return false;
                })

                const currToc = window.location.hash;
                if ($(currToc).length) {
                    setTimeout(() => {
                        $(`.term-main-toc-item[href='${currToc}']`).trigger('click');
                    }, 10)
                }
                else {
                    history.replaceState({}, '', window.location.pathname);
                }
            }
            destroy() {
                this.tlTrigger.kill();
            }
        }
    }
    class PageManager {
        constructor(page) {
            if (!page || typeof page !== 'object') {
                throw new Error('Invalid page configuration');
            }

            // Store registered component names to prevent duplicate registration
            this.registeredComponents = new Set();

            this.sections = Object.entries(page).map(([name, Component]) => {
                if (typeof Component !== 'function') {
                    throw new Error(`Section "${name}" must be a class constructor`);
                }

                // Only register the custom element if not already registered
                if (!this.registeredComponents.has(name)) {
                    try {
                        customElements.define(name, Component);
                        this.registeredComponents.add(name);
                    } catch (error) {
                        // Handle case where element is already defined
                        console.warn(`Custom element "${name}" is already registered`);
                    }
                }

                return new Component();
            });
        }

        // Method to cleanup sections if needed
        destroy() {
            this.sections.forEach(section => {
                if (typeof section.destroy === 'function') {
                    section.destroy();
                }
            });
        }
    }

    const pageConfig = {
        term: TermPage
    };
    const registry = {};
    registry[pageName]?.destroy();
    pageConfig[pageName] && (registry[pageName] = new PageManager(pageConfig[pageName]));
    refreshOnBreakpoint();
}
window.onload = script