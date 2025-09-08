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
    let header = document.querySelector('header-component')
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
    lenis.on('scroll', (inst) => {
        header.toggleSticky(inst.scroll >= header.clientHeight)
    })
    
    const pageName = $('.main-inner').attr('data-barba-namespace');

    class Header extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.navEl = this.el.querySelector('.header-act');
            this.toggle = this.el.querySelector('.header-toggle-btn');
            this.allLinks = this.el.querySelectorAll('.header-link');
        }
        connectedCallback() {
            if (window.innerWidth > 767) {
                this.setupDesktop();
                this.update();
            } else {
                this.el.classList.remove('on-open')
                this.setupMobile();
            }

        }
        setupMobile() {
            console.log('mobile');
            this.allLinks.forEach((item, idx) => {
                item.addEventListener('click', (e) => {
                    this.toggleMenu();
                })
            })
            this.toggle.addEventListener('click', (e) => {
                console.log('click')
                e.preventDefault();
                this.toggleMenu();
            })
        }
        setupDesktop() {
        }
        toggleSticky(state) {
            if (state) {
                header.classList.add('on-scroll')
            } else {
                header.classList.remove('on-scroll')
            }
        }
        update() {
        }
        toggleMenu() {
            this.el.classList.toggle('on-open');
        }
    }
    customElements.define('header-component', Header);

    class Popup extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.popup = this.el.querySelector('.popup-wrap')
            this.toggles = document.querySelectorAll('[data-popup-contact]');
        }
        connectedCallback() {
            this.setup()

        }
        setup() {
            console.log('mobile')
            if (!this.toggles) return;
            this.toggles.forEach((el) => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    let type = el.getAttribute('data-popup-contact');
                    this.togglePopup(type);
                })
            })
        }
        togglePopup(state) {
            if (state == 'open') {
                this.popup.classList.add('on-open')
            } else {
                this.popup.classList.remove('on-open')
            }
        }
    }
    customElements.define('popup-component', Popup);

    const HomePage = {
        'home-faq-wrap': class extends HTMLElement {
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
                this.interact();
            }
            animationReveal() {
            }
            animationScrub() {
            }
            interact() {
                const DOM = {
                    accordion: $('.accordion'),
                    accordionTitle: $('.accordion-title'),
                    accordionContent: $('.accordion-content')
                }
                const activeAccordion = (index) => {
                    DOM.accordionContent.eq(index).slideToggle("slow");
                    DOM.accordion.eq(index).toggleClass("active");

                    DOM.accordionContent.not(DOM.accordionContent.eq(index)).slideUp("slow");
                    DOM.accordion.not(DOM.accordion.eq(index)).removeClass("active");
                }
                DOM.accordionTitle.on("click", function () {
                    let index = $(this).parent().index();
                    activeAccordion(index);
                })
            }
            destroy() {
                this.tlTrigger.kill();
            }
        },
        'home-partner-wrap': class extends HTMLElement {
            constructor() {
                super();
                this.tlTrigger = null;
            }
            connectedCallback() {
                // this.tlTrigger = gsap.timeline({
                //     scrollTrigger: {
                //         trigger: this,
                //         start: 'top bottom+=50%',
                //         end: 'bottom top-=50%',
                //         once: true,
                //         onEnter: () => {
                //             this.onTrigger();
                //         }
                //     }
                // });
            }
            onTrigger() {
                if (viewport.w > 767) {
                    this.interact();
                }
            }
            interact() {
                const listElement = this.querySelector('.home-partner-main-list');
                const innerElement = this.querySelector('.home-partner-main-inner');
                
                if (!listElement || !innerElement) return;
                
                const cloneCount = Math.ceil(listElement.clientWidth / innerElement.clientWidth) + 1;
                const allGroups = this.querySelectorAll('.home-partner-main-cms');
                
                allGroups.forEach((group, index) => {
                    const originalList = group.querySelector('.home-partner-main-list');
                    if (!originalList) return;
                    
                    for (let i = 0; i < cloneCount; i++) {
                        const clonedList = originalList.cloneNode(true);
                        group.appendChild(clonedList);
                    }
                    
                    const animationClass = index % 2 === 0 ? 'anim-marquee' : 'anim-marquee-revert';
                    group.querySelectorAll('.home-partner-main-list').forEach(list => {
                        list.classList.add(animationClass);
                    });
                });
            }
            destroy() {
                this.tlTrigger.kill();
            }
        },
        'home-hiw-wrap': class extends HTMLElement {
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
                this.activeIndex = -1;
                this.allHeadItems = this.querySelectorAll('.home-hiw-head-item')
                this.allItems = this.querySelectorAll('.home-hiw-body-item');
                if (viewport.w > 767) {
                    this.interact();
                } else {
                    this.interactMb()
                }
            }
            interact() {
                let stickHeight = this.querySelector('.home-hiw-sticky').clientHeight;
                let topOffset = (window.innerHeight - stickHeight) * .5;
                gsap.set(this.querySelector('.home-hiw-sticky'), {'top': topOffset})
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: this.querySelector('.home-hiw-main'),
                        start: `top center-=${stickHeight * .5}`,
                        end: `bottom center+=${stickHeight * .5}`,
                        scrub: true,
                        onUpdate: ((tlPrg) => {
                            let prog = tlPrg.progress * this.allHeadItems.length;
                            let index = Math.floor(prog);
                            if (index < this.allHeadItems.length) {
                                this.activeHead(index);
                            }
                        }).bind(this),
                    },
                    defaults: {
                        ease: 'none'
                    },
                })
                let fadeDur = .75;
                
                this.allItems.forEach((item, idx) => {    
                    let dis = item.querySelectorAll('.home-hiw-item-card')[0].clientHeight + parseRem(8);
                    let headDis = item.querySelectorAll('.home-hiw-item-card')[0].querySelector('.home-hiw-item-card-top').clientHeight;
                    
                    tl
                    .to(item, {'transform': 'none', duration: fadeDur, ease: 'power1.out'}, idx * (fadeDur + 1))
                    .to(item.querySelectorAll('.home-hiw-item-card')[0], {y: headDis * -1, scale: .95, duration: 1}, '>=0')
                    .to(item.querySelectorAll('.home-hiw-item-card')[1], {y: dis * -1, duration: 1,'box-shadow': '0 -33.169px 33.169px 0 rgba(0, 32, 16, 0.06), 0 -8.78px 18.536px 0 rgba(26, 54, 40, 0.06)'}, '<=0')
                    .to(item, {'transform': 'none', duration: fadeDur, ease: 'power1.out'}, '>=0')
                })
                this.activeHead(0)
                this.allHeadItems.forEach((item, idx) => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        let targetProgress = idx / 3;
                        let scrollTrigger = tl.scrollTrigger;
                        let startPos = scrollTrigger.start;
                        let endPos = scrollTrigger.end;
                        let targetScrollPos = (startPos + (endPos - startPos) * targetProgress) + parseRem(10);
                        lenis.scrollTo(targetScrollPos, {
                            immediate: true, 
                            force: true
                        });
                    })
                })

                let headerDis = this.querySelector('.home-hiw-main').clientHeight -  this.querySelector('.home-hiw-sticky').clientHeight;
                console.log(headerDis)
                let dupTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: this.querySelector('.home-hiw-main'),
                        start: `top center-=${stickHeight * .5}`,
                        end: `bottom center+=${stickHeight * .5}`,
                        scrub: true,
                    },
                    defaults: {
                        ease: 'none'
                    },
                })
                dupTl
                .to(this.querySelector('.home-hiw-text-wrap'), {y: headerDis, duration: 1})
                .from(document.querySelector('.home-partner'), {y: headerDis * -1, duration: 1}, 0)
            }
            interactMb() {
                this.activeHead(0)
                this.allItems.forEach((item, idx) => {
                    let dis = item.querySelectorAll('.home-hiw-item-card')[1].clientHeight - parseRem(83);
                    let itemTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item.querySelectorAll('.home-hiw-item-card')[0],
                            start: 'center center',
                            endTrigger: item.querySelectorAll('.home-hiw-item-card')[1],
                            end: 'center center',
                            scrub: true,
                        },
                        defaults: {
                            ease: 'none'
                        }
                    })
                    requestAnimationFrame(() => {
                        itemTl
                        .to(item.querySelector('.home-hiw-body-item-head'), {y: dis * 1, duration: 1})
                        .to(item.querySelectorAll('.home-hiw-item-card')[0], {y: dis, scale: .98, duration: 1}, 0)
                        .to(item.querySelectorAll('.home-hiw-item-card')[1], {'box-shadow': '0 -4px 12px 0 rgba(0, 32, 16, 0.08)', duration: 1}, 0)
                    })
                    let itemHeadTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item.querySelector('.home-hiw-body-item-head'),
                            start: `top top+=25%`,
                            endTrigger: item.querySelectorAll('.home-hiw-item-card')[1],
                            end: 'bottom center',
                            scrub: true,
                            onUpdate: () => {
                                this.activeHead(idx)
                            }
                        }
                    })
                    this.allHeadItems[idx].addEventListener('click', (e) => {
                        e.preventDefault();
                        let scrollTrigger = itemHeadTl.scrollTrigger;
                        let startPos = scrollTrigger.start + parseRem(83);
                        lenis.scrollTo(startPos, {
                            immediate: true, 
                            force: true
                        });
                    })
                })
            }
            activeHead(index) {
                console.log(this.activeIndex == index)
                if (this.activeIndex == index) return;
                this.activeIndex = index;
                this.allHeadItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx == index);
                })
                this.allItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx == index);
                })
            }
            interactOld() {
                let allItems = this.querySelectorAll('.home-hiw-item')
                allItems.forEach((item) => {
                    let dis = item.querySelectorAll('.home-hiw-item-card')[1].clientHeight - parseRem(100);
                    let itemTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: item.querySelectorAll('.home-hiw-item-card')[0],
                            start: 'center center',
                            endTrigger: item.querySelectorAll('.home-hiw-item-card')[1],
                            end: 'center center',
                            scrub: true
                        },
                        defaults: {
                            ease: 'none'
                        }
                    })
                    requestAnimationFrame(() => {
                        itemTl
                        .to(item.querySelector('.home-hiw-item-img'), {y: dis * 1, duration: 1})
                        .to(item.querySelector('.home-hiw-item-main'), {y: dis * (viewport.w > 767 ? .65 : 1), duration: 1}, 0)
                        .to(item.querySelectorAll('.home-hiw-item-card')[0], {y: dis, scale: .98, duration: 1}, 0)
                        .to(item.querySelectorAll('.home-hiw-item-card')[1], {'box-shadow': '0 -33.169px 33.169px 0 rgba(0, 32, 16, 0.06), 0 -8.78px 18.536px 0 rgba(26, 54, 40, 0.06)', duration: 1}, 0)  
                    })
                })
            }
            destroy() {
                this.tlTrigger.kill();
            }
        },
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
        home: HomePage,
        term: TermPage
    };
    const registry = {};
    registry[pageName]?.destroy();
    pageConfig[pageName] && (registry[pageName] = new PageManager(pageConfig[pageName]));
    refreshOnBreakpoint();
}
window.onload = script