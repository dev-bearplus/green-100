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
    function isStagging() {
        let currentUrl = window.location.href;
        return currentUrl.includes('webflow.io')
    }
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
    // Initialize Lenis
    const lenis = new Lenis();
    // gsap.ticker.add((time) => {
    //     if (lenis) {
    //         lenis.raf(time * 1000);
    //     }
    // });
    // gsap.ticker.lagSmoothing(0);
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update)
    lenis.on('scroll', (inst) => {
        header.toggleSticky(inst.scroll >= header.clientHeight)
    })

    const pageName = $('.main-inner').attr('data-barba-namespace');
    class Loading extends HTMLElement {
        constructor() {
            super();
            this.el = this;
        }
        connectedCallback() {
            this.setup();

        }
        setup() {
            let tl = new gsap.timeline({
                onComplete: () => {
                    $('.loading').addClass('loaded')
                }
            });
            tl
                .to('.loading-logo-path', {opacity: 1, duration: .4})
                .fromTo('.loading-logo-path', {strokeDasharray: "0 15px"}, { strokeDasharray: "1 15px", duration: .8, ease: 'power1.in'}, '<=.2')
                .to('.loading', {yPercent: -100, duration: .6, ease: 'power4.in'})
                .to('.loading-logo', {opacity: 0, duration: .6, }, '<=0.6')
            // if(viewport.w > 991) {
            //         // .to('html', {'--col-1': '0vh', duration: 1.2, ease: 'power1.out'}, `>=.2`)
            //         // .to('html', {'--col-2': '0vh', duration: 1.2 - .1, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-3': '0vh', duration: 1.2 - .1 * 2, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-4': '0vh', duration: 1.2 - .1 * 3, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-5': '0vh', duration: 1.2 - .1 * 4, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-6': '0vh', duration: 1.2 - .1 * 5, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-7': '0vh', duration: 1.2 - .1 * 6, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-8': '0vh', duration: 1.2 - .1 * 7, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-9': '0vh', duration: 1.2 - .1 * 8, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-10': '0vh', duration: 1.2 - .1 * 9, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-11': '0vh', duration: 1.2 - .1 * 10, ease: 'power1.out'}, `<=${.1}`)
            //         // .to('html', {'--col-12': '0vh', duration: 1.2 - .1 * 11 , ease: 'power1.out'}, `<=${.1}`)
            // }
            // else if( viewport.w > 767 && viewport.w <= 991) {
            //     tl
            //         .to('.loading-logo-path', {opacity: 1, duration: .6})
            //         .fromTo('.loading-logo-path', {strokeDasharray: "0 15px"}, { strokeDasharray: "1 15px", duration: 1, ease: 'power2.in'}, '<=.2')
            //         .to('html', {'--col-1': '0vh', duration: .9, ease: 'power1.out'}, `>=.2`)
            //         .to('html', {'--col-2': '0vh', duration: .9 - .1, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-3': '0vh', duration: .9 - .1 * 2, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-4': '0vh', duration: .9 - .1 * 3, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-5': '0vh', duration: .9 - .1 * 4, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-6': '0vh', duration: .9 - .1 * 5, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-7': '0vh', duration: .9 - .1 * 6, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-8': '0vh', duration: .9 - .1 * 7, ease: 'power1.out'}, `<=${.1}`)
            // }
            //  else {
            //     tl
            //         .to('.loading-logo-path', {opacity: 1, duration: .6})
            //         .fromTo('.loading-logo-path', {strokeDasharray: "0 15px"}, { strokeDasharray: "1 15px", duration: 1, ease: 'power2.in'}, '<=.2')
            //         .to('html', {'--col-1': '0vh', duration: .8, ease: 'power1.out'}, `>=.2`)
            //         .to('html', {'--col-2': '0vh', duration: .8 - .1, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-3': '0vh', duration: .8 - .1 * 2, ease: 'power1.out'}, `<=${.1}`)
            //         .to('html', {'--col-4': '0vh', duration: .8 - .1 * 3, ease: 'power1.out'}, `<=${.1}`)
            // }
        }
        
    }
    customElements.define('loading-wrap', Loading);
    class Header extends HTMLElement {
        constructor() {
            super();
            this.el = this;
            this.navEl = this.el.querySelector('.header-act');
            this.toggle = this.el.querySelector('.header-toggle-btn');
            this.allLinks = this.el.querySelectorAll('.header-link[data-link="section"]');
            this.allFooterLinks = document.querySelectorAll('.footer-link[href^="/#"]')
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
            this.allLinks.forEach((item, idx) => {
                item.addEventListener('click', (e) => {
                    this.toggleMenu();
                })
            })
            this.toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            })
        }
        setupDesktop() {
            this.allLinks.forEach((item, idx) => {
                item.addEventListener('click', (e) => {
                    if (pageName === 'home') {
                        e.preventDefault();
                        let target = item.getAttribute('href').split('#')[1];
                        lenis.scrollTo('#' + target, {
                            immediate: true,
                            force: true
                        })
                    }
                })
            })
            this.allFooterLinks.forEach((item, idx) => {
                item.addEventListener('click', (e) => {
                    if (pageName === 'home') {
                        e.preventDefault();
                        let target = item.getAttribute('href').split('#')[1];
                        lenis.scrollTo('#' + target, {
                            immediate: true,
                            force: true
                        })
                    }
                })
            })
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
                // Clean up loading timeout
                if (this.loadingTimeout) {
                    clearTimeout(this.loadingTimeout);
                    this.loadingTimeout = null;
                }
            }
        },
        'home-partner-wrap': class extends HTMLElement {
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
                this.setup();
                this.interact();
            }
            setup() {
                if(viewport.w < 768){
                    if($('.home-partner-main-item').length > 10){
                        $('.home-partner-viewmore').show();
                        $('.home-partner-main-item').slice(10).hide();
                        $('.home-partner-viewmore').on('click', () => {
                            $('.home-partner-main-item').slice(10).fadeIn();
                            $('.home-partner-viewmore').hide();
                        })
                    }
                }
            }
            interact() {
                
            }
            destroy() {
                this.tlTrigger.kill();
            }
        },
        'home-testi-wrap': class extends HTMLElement {
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
                this.setup();
                if (viewport.w > 767) {
                    this.interact();
                }
            }
            setup() {
                let swiperEvent = new Swiper(".home-testi-cms", {
                    slidesPerView: 1,
                    spaceBetween: parseRem(0),
                    effect: "fade",
                    navigation: {
                        prevEl: ".home-testi-content-control-item.prev",
                        nextEl: ".home-testi-content-control-item.next",
                    },
                    pagination: {
                        el: '.home-testi-content-pagi',
                        bulletClass: 'home-testi-content-pagi-item',
                        bulletActiveClass: 'active',
                        clickable: true,
                    },
                    breakpoints: {
                        767: {
                            spaceBetween: parseRem(16),
                        }
                    }
                });
            }
            interact() {

            }
            destroy() {
                this.tlTrigger.kill();
            }
        },
        'home-event-wrap': class extends HTMLElement {
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
                this.setup();
                if (viewport.w > 767) {
                    this.interact();
                }
            }
            setup() {
                let swiperEvent = new Swiper(".home-event-cms", {
                    slidesPerView: 'auto',
                    spaceBetween: parseRem(8),
                    navigation: {
                        prevEl: ".home-event-control-item-prev",
                        nextEl: ".home-event-control-item-next",
                    },
                    pagination: {
                        el: '.home-event-pagi',
                        bulletClass: 'home-event-pagi-item',
                        bulletActiveClass: 'active',
                        clickable: true,
                    },
                    breakpoints: {
                        767: {
                            spaceBetween: parseRem(16),
                        }
                    }
                });
            }
            interact() {

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
                let offsetRatio = viewport.w > 991 ? .75 : .85;
                let stickHeight = this.querySelector('.home-hiw-sticky').clientHeight;
                let remainHeight = (window.innerHeight - stickHeight);
                gsap.set(this.querySelector('.home-hiw-sticky'), {'top': remainHeight * offsetRatio});
                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: this.querySelector('.home-hiw-main'),
                        start: `top-=${stickHeight} top+=${remainHeight * offsetRatio}`,
                        end: `bottom bottom-=${remainHeight * ( 1 - offsetRatio )}`,
                        scrub: true,
                        onUpdate: ((tlPrg) => {
                            let prog = tlPrg.progress * this.allHeadItems.length;
                            let index = Math.floor(prog);
                            if (index < this.allHeadItems.length) {
                                this.activeHead(index);
                            }
                        }).bind(this),
                        invalidateOnRefresh: true
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
                let headerTop = (remainHeight * offsetRatio) - document.querySelector('.home-hiw-text-wrap').offsetHeight
                gsap.set('.home-hiw-text-wrap', {'position': 'sticky', top: headerTop, marginBottom: document.querySelector('.home-hiw-sticky').clientHeight})
                gsap.set('.home-hiw-sticky', {marginTop: document.querySelector('.home-hiw-sticky').clientHeight * -1})
                function updateOnResize() {
                    offsetRatio = viewport.w > 991 ? .75 : .85;
                    stickHeight = this.querySelector('.home-hiw-sticky').clientHeight;
                    remainHeight = (window.innerHeight - stickHeight);
                    gsap.set(this.querySelector('.home-hiw-sticky'), {'top': remainHeight * offsetRatio});
                    ScrollTrigger.refresh()
                    headerTop = (remainHeight * offsetRatio) - document.querySelector('.home-hiw-text-wrap').offsetHeight
                    gsap.set('.home-hiw-text-wrap', {'position': 'sticky', top: headerTop, marginBottom: document.querySelector('.home-hiw-sticky').clientHeight})
                    gsap.set('.home-hiw-sticky', {marginTop: document.querySelector('.home-hiw-sticky').clientHeight * -1})
                }
                $(window).on('resize', updateOnResize.bind(this))
            }
            interactMb() {
                this.activeHead(0)
                this.allItems.forEach((item, idx) => {
                    // let dis = item.querySelectorAll('.home-hiw-item-card')[1].clientHeight - parseRem(83);
                    // let itemTl = gsap.timeline({
                    //     scrollTrigger: {
                    //         trigger: item.querySelectorAll('.home-hiw-item-card')[0],
                    //         start: 'center center',
                    //         endTrigger: item.querySelectorAll('.home-hiw-item-card')[1],
                    //         end: 'center center',
                    //         scrub: true,
                    //     },
                    //     defaults: {
                    //         ease: 'none'
                    //     }
                    // })
                    // requestAnimationFrame(() => {
                    //     itemTl
                    //     .to(item.querySelector('.home-hiw-body-item-head'), {y: dis * 1, duration: 1})
                    //     .to(item.querySelectorAll('.home-hiw-item-card')[0], {y: dis, duration: 1}, 0)
                    //     .to(item.querySelectorAll('.home-hiw-item-card')[1], {'box-shadow': '0 -4px 12px 0 rgba(0, 32, 16, 0.08)', duration: 1}, 0)
                    // })
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
                        let itemOffsetTop = this.allItems[idx].getBoundingClientRect().top + window.scrollY;
                        let startPos = itemOffsetTop - parseRem(107);
                        lenis.scrollTo(startPos, {
                            duration: 1,
                            force: true
                        });
                    })
                })
            }
            activeHead(index) {
                if (this.activeIndex == index) return;
                this.activeIndex = index;
                this.allHeadItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx == index);
                })
                this.allItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx == index);
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
    const TpEventPage = {
        'tp-event-blog-wrap': class extends HTMLElement {
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
                this.setup();
                if (viewport.w > 767) {
                    this.interact();
                }
            }

            setup() {
                if(viewport.w < 992) {
                    $('.tp-event-blog-cms').addClass('swiper');
                    $('.tp-event-blog-list').addClass('swiper-wrapper');
                    $('.tp-event-blog-item').addClass('swiper-slide');
                    let swiperBlog = new Swiper(".tp-event-blog-cms", {
                        slidesPerView: 'auto',
                        spaceBetween: parseRem(8),
                        pagination: {
                            el: '.tp-event-blog-pagi',
                            bulletClass: 'tp-event-blog-pagi-item',
                            bulletActiveClass: 'active',
                            clickable: true,
                        },
                        breakpoints: {
                            767: {
                                spaceBetween: parseRem(16),
                            }
                        }
                    });
                }
            }
            interact() {
            }
            destroy() {
                this.tlTrigger.kill();
            }
        }
    }
    const ParticipantPage = {
        'part-pled-wrap': class extends HTMLElement {
            constructor() {
                super();
                this.tlTrigger = null;
                this.rowDOM = $(this).find('.part-pled-table-list .part-pled-table-row').eq(0).clone();
                this.paginationDOM = $(this).find('.part-pled-table-pagin-list .part-pled-table-pagin-page').eq(0).clone();
                this.currentPage = 1;
                this.totalPages = 10;
                this.isRequestInProgress = false;
                this.loadingTimeout = null;
                this.loadingDelay = 300; // Show loading after 300ms
                this.filter = {
                    pledge_status: [],
                    industry: [],
                    category: []
                }
                this.query = { type: 'enterprise', limit: 10, page: 1 }
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
                this.setup();
                this.interact();
            }
            setup() {

                if(viewport.w < 768) {
                    $('.part-pled-filters-form-inner').attr('data-lenis-prevent', true)
                }
                else {
                    $('.part-pled-dropdown-list').attr('data-lenis-prevent', true)
                }
            }
            fetchData(type) {
                return new Promise(async (resolve, reject) => {
                    try {
                        let url = `https://app.gprnt.ai/api/v1/cms/${type}`;
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            },
                            cache: "force-cache"
                        }).then((res) => res);
                        if (response.ok) {
                            let data = await response.json();
                            resolve(data);
                        }
                        else {
                            reject(response);
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                })
            }
            async fetchLeaderBoard() {
                // Prevent multiple simultaneous requests
                if (this.isRequestInProgress) {
                    return Promise.reject(new Error('Request already in progress'));
                }
                // Filter out empty, null, undefined values from query
                const filteredQuery = Object.entries(this.query).reduce((acc, [key, value]) => {
                    if (value !== null && value !== undefined && value !== '') {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                // convert filtered query to urlSearchParam
                let queryString = new URLSearchParams(filteredQuery).toString();
                this.isRequestInProgress = true;

                // Clear any existing loading timeout
                if (this.loadingTimeout) {
                    clearTimeout(this.loadingTimeout);
                    this.loadingTimeout = null;
                }

                // Set timeout to show loading only if request takes longer than delay
                this.loadingTimeout = setTimeout(() => {
                    if (this.isRequestInProgress) {
                        this.isLoading(true);
                    }
                }, this.loadingDelay);

                try {
                    const result = await this.fetchData(`leaderboard?${queryString}`);
                    // Clear timeout and hide loading after successful fetch
                    if (this.loadingTimeout) {
                        clearTimeout(this.loadingTimeout);
                        this.loadingTimeout = null;
                    }
                    this.isLoading(false);
                    this.isRequestInProgress = false;
                    $(this).find('.part-pled-table-empty').toggleClass('show', result.data.length === 0);
                    return result;
                } catch (error) {
                    // Clear timeout and hide loading on error
                    if (this.loadingTimeout) {
                        clearTimeout(this.loadingTimeout);
                        this.loadingTimeout = null;
                    }
                    this.isLoading(false);
                    this.isRequestInProgress = false;
                    throw error;
                }
            }
            async fetchPledge(id) {
                return await this.fetchData(`pledge?pledge_id=${id}`);
            }
            interact() {
                if(viewport.w < 768) {
                    $('.part-pled-dropdown-filter').on('click', function(e) {
                        e.preventDefault();
                        $('.part-pled-filters-form-inner').toggleClass('active');
                        
                        $(this).toggleClass('active');
                    })
                }
                const dropdownAct = {
                    open: (target) => {
                        let dropdown = $(target).parent();
                        dropdown.addClass('active');
                        dropdown.siblings().removeClass('active');
                    },
                    close: (target) => {
                        if (target) {
                            $(target).parent().removeClass('active');
                        }
                        else {
                            $('.part-pled-dropdown').removeClass('active');
                        }
                    },
                    toggle: (target) => {
                        let dropdown = $(target).parent();
                        if(dropdown.hasClass('active')){
                            dropdown.removeClass('active');
                        }
                        else {
                            $('[data-filter]').removeClass('active');
                            dropdown.addClass('active');
                        }
                    }
                }
                $(this).find('.part-pled-dropdown-toggle').on('click', function (e) {
                    e.preventDefault();
                    dropdownAct.toggle(this);
                })
                $(this).find('.part-pled-dropdown-link').on('click', (e) => {
                    e.preventDefault();
                    let key = $(e.target).closest('[data-filter]').attr('data-filter');

                    if ($(e.target).hasClass('check-all')) {
                        if ($(e.target).find('.checkbox-field').hasClass('active')) {
                            $(e.target).parent().find('.checkbox-field').removeClass('active');
                        }
                        else {
                            $(e.target).parent().find('.checkbox-field').addClass('active');
                        }
                    }
                    else {
                        $(e.target).find('.checkbox-field').toggleClass('active');
                        let filter = $(e.target).find('.checkbox-txt .txt').text();
                        if ($(e.target).find('.checkbox-field').hasClass('active')) {
                            this.filter[key].push(filter);
                        }
                        else {
                            this.filter[key] = this.filter[key].filter(item => item !== filter);
                            $(this).find('.part-pled-dropdown-link.check-all .checkbox-field').removeClass('active');
                        }
                    }

                    if (this.filter[key].length !== 0) {
                        this.query = { ...this.query, page: 1, [key]: this.filter[key].join(',') };
                    }
                    else {
                        delete this.query[key];
                    }
                    this.fetchLeaderBoard().then(({data, pagination}) => {
                        this.updateData(data);
                        this.updatePagination(pagination);
                    }).catch((error) => {
                        if (error.message !== 'Request already in progress') {
                            console.error('Failed to fetch leaderboard:', error);
                        }
                    });
                })
                // $('.part-pled-dropdown-link.check-all').click();
                // $('[data-filter="pledge_status"] .part-pled-dropdown-link').click();
                $(window).on('click', (e) => {
                    if (!$(this).find('.part-pled-dropdown-link:hover').length)
                        if (!$(this).find('.part-pled-dropdown-toggle:hover').length) {
                            dropdownAct.close();
                        }
                })

                $(this).find('.part-pled-tab').on('click', (e) => {
                    e.preventDefault();
                    $(e.target).addClass('active').siblings().removeClass('active');
                    let typeTab = $(e.target).attr('data-type');
                    if(typeTab == 'sp') {
                        delete this.query['industry'];
                        let categories = this.updateActiveDropdown('category');
                        console.log(categories)
                        this.query = { ...this.query, 'category': categories.join(',') };
                        $('[data-table-head]').removeClass('show');
                        $('[data-table-head="category"]').addClass('show');
                        $('.part-pled-dropdown-item').removeClass('show');
                        $('.part-pled-dropdown-item[data-filter="category"]').addClass('show');
                    }
                    else {
                        delete this.query['category'];
                        let industries = this.updateActiveDropdown('industry');
                        this.query = { ...this.query, 'industry': industries.join(',') };
                        $('[data-table-head]').removeClass('show');
                        $('[data-table-head="industry"]').addClass('show');
                        $('.part-pled-dropdown-item').removeClass('show');
                        $('.part-pled-dropdown-item[data-filter="industry"]').addClass('show');
                    }
                    this.query = { ...this.query, type: typeTab, page: 1 };
                    console.log(this.query  )
                    this.fetchLeaderBoard().then(({data, pagination}) => {
                        this.updateData(data);
                        this.updatePagination(pagination);
                    }).catch((error) => {
                        if (error.message !== 'Request already in progress') {
                            console.error('Failed to fetch leaderboard:', error);
                        }
                    });
                })
                $(this).find('.part-pled-tab').eq(0).trigger('click');

                $(this).find('.part-pled-table-pagin-arrow').on('click', (e) => {
                    e.preventDefault();
                    if ($(e.target).hasClass('prev')) {
                        this.currentPage--;
                        if (this.currentPage < 1) {
                            this.currentPage = 1;
                        }
                    }
                    else {
                        this.currentPage++;
                        if (this.currentPage > this.totalPages) {
                            this.currentPage = this.totalPages;
                        }
                    }
                    $('[data-pagi-current]').text(this.currentPage);
                    $(this).find('.part-pled-table-pagin-arrow.prev').toggleClass('disable', this.currentPage === 1);
                    $(this).find('.part-pled-table-pagin-arrow.next').toggleClass('disable', this.currentPage === this.totalPages);
                    $(this).find('.part-pled-table-pagin-page').removeClass('active');
                    $(this).find('.part-pled-table-pagin-page').eq(this.currentPage - 1).addClass('active');

                    this.query = {  ...this.query, page: this.currentPage };
                    this.fetchLeaderBoard().then(({ data }) => {
                        this.updateData(data);
                    }).catch((error) => {
                        if (error.message !== 'Request already in progress') {
                            console.error('Failed to fetch leaderboard:', error);
                        }
                    });
                })

                $(this).find('.part-pled-search-input').on('input', debounce((e) => {
                    const searchValue = e.target.value.trim();
                    this.query = { ...this.query, search: searchValue, page: 1 };

                    this.fetchLeaderBoard().then(({ data, pagination }) => {
                        this.updateData(data);
                        this.updatePagination(pagination);
                    }).catch((error) => {
                        if (error.message !== 'Request already in progress') {
                            console.error('Failed to fetch leaderboard:', error);
                        }
                    });
                }, 500))
            }
            updateActiveDropdown(filterType){
                let filterArr =[];
                $(`[data-filter = "${filterType}"] .checkbox-field.active .txt`).each((idx, item)=> {
                    filterArr.push($(item).text());
                })
                return filterArr;
            }
            // scrollToTop() {
            //     let elem = $('.part-pled-stick');
            //     let heightHeader = $('.header').outerHeight(); 
            //     if (elem.length) {
            //         let elemTop = elem.offset().top;
            //         let elemHeight = elem.height();
            //         let scrollTop = $(window).scrollTop();
            //         if (elemTop - scrollTop <= heightHeader + elemHeight){
            //             console.log('khanh')
            //             lenis.scrollTo('.part-pled-stick', {
            //             duration: 0.6,
            //             offset: heightHeader + elemHeight,
            //             });
            //         }
            //     }
            // }
            updateData(data) {
                $(this).find('.part-pled-table-list').empty();
                data.forEach((item) => {
                    let row = this.rowDOM.clone();
                    Object.keys(item).forEach((key) => {
                        if ($(row).find(`[data-value="${key}"]`).length) {
                            if (key === 'pledge_id') {
                                $(row).find(`[data-value="${key}"] a`).attr('href', `/pledger/${item[key]}`);
                            }
                            else if (key === 'website_url') {
                                if (item[key]) {
                                    $(row).find(`[data-value="${key}"] .txt`).text(item[key].replace(/^https?:\/\/(www\.)?([^\/]+)/, '$2').replace(/\/$/, ''));
                                    $(row).find(`[data-value="${key}"] a`).attr('href', item[key]);
                                }
                                else {
                                    $(row).find(`[data-value="${key}"] .txt`).text('-');
                                    $(row).find(`[data-value="${key}"] a`).addClass('item-null')
                                }
                            }
                            else if (key === 'company_name') {
                                $(row).find(`[data-value="${key}"] a`).attr('href', `/pledger/${item['pledge_id']}`);
                                $(row).find(`[data-value="${key}"] .txt`).text(item[key].length !== 0 ? item[key] : '-');
                            }
                            else if (key === 'pledge_date') {
                                $(row).find(`[data-value="${key}"] .txt`).text(item[key] ? new Date(item[key]).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }) : '-');
                            }
                            else if(key =='industry'){
                                if($('.part-pled-tab.active').attr('data-type') == 'sp'){
                                    $(row).find(`[data-value="${key}"] .txt`).text(item['primary_service_type']? item['primary_service_type'] : '-');
                                }
                                else {
                                 $(row).find(`[data-value="${key}"] .txt`).text(item[key].length !== 0 ? item[key] : '-');
                                }
                            }
                            else {
                                $(row).find(`[data-value="${key}"] .txt`).text(item[key].length !== 0 ? item[key] : '-');
                                if ($(row).find('[data-status]').length) {
                                    $(row).find('[data-status]').attr('data-status', item[key]);
                                }
                            }
                            $(this).find('.part-pled-table-list').append(row);
                        }
                    })
                })
            }
            generatePagination(currentPage, totalPages, maxVisible = 5) {
                const pages = [];

                pages.push(1);

                if (totalPages <= maxVisible) {
                    for (let i = 2; i <= totalPages; i++) {
                    pages.push(i);
                    }
                } else {
                    if (currentPage <= 3) {
                    for (let i = 2; i <= 3; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(totalPages - 1);
                    pages.push(totalPages);
                    }
                    else if (currentPage >= totalPages - 2) {
                    pages.push('...');
                    for (let i = totalPages - 2; i <= totalPages; i++) {
                        pages.push(i);
                    }
                    }
                    else {
                    pages.push('...');
                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i);
                    }
                    pages.push('...');
                    pages.push(totalPages);
                    }
                }

                return pages;
            }
            updatePagination(pagination, query) {
                this.currentPage = pagination.currentPage;
                this.totalPages = pagination.totalPages;
                $('[data-pagi-total]').text(this.totalPages)
                if(viewport.w > 767){
                    $(this).find('.part-pled-table-pagin-list').empty();
                }
                $(this).find('.part-pled-table-pagin-arrow.prev').toggleClass('disable', this.currentPage === 1);
                $(this).find('.part-pled-table-pagin-arrow.next').toggleClass('disable', this.currentPage === this.totalPages);
                const visiblePages = this.generatePagination(this.currentPage, this.totalPages);

                visiblePages.forEach((pageNumber) => {
                    let page = this.paginationDOM.clone();
                    page.find('.txt').text(pageNumber);
                    console.log(this.currentPage)
                    page.toggleClass('active', pageNumber === this.currentPage);
                    page.on('click', (e) => {
                        e.preventDefault();
                        this.currentPage = pageNumber;
                        this.query = { ...this.query, page: this.currentPage };

                        this.fetchLeaderBoard().then(({ data }) => {
                            this.updateData(data);
                        }).catch((error) => {
                            if (error.message !== 'Request already in progress') {
                                console.error('Failed to fetch leaderboard:', error);
                            }
                        });
                        this.updatePagination({
                            currentPage: this.currentPage,
                            totalPages: this.totalPages
                        }, query);
                    });
                    if(viewport.w > 767){
                        $(this).find('.part-pled-table-pagin-list').append(page);
                    }                    
                });
            }
            isLoading(loading) {
                $(this).find('.part-pled-table-loading').toggleClass('loading', loading);
            }
            destroy() {
                this.tlTrigger.kill();
            }
        }
    }
    const NotFoundPage = {
       'not-found-hero-wrap': class extends HTMLElement {
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
                this.setup();
            }
            setup() {
                this.checkRedirect();
            }
            checkRedirect() {
                let url = window.location.pathname;
                if (url.includes('/pledger/')) {
                    const pathParts = window.location.pathname.split("/").filter(Boolean);
                    const pledgeId = pathParts[pathParts.length - 1];
                    this.getDetail(pledgeId);
                }
                else {
                    this.notFound();
                    return;
                }
            }
            notFound() {
                history.replaceState({},'',`/404`)
                $('title').text('Not Found')
                $('.body-inner').removeAttr('data-init-hidden')
                return;
            }
            getDetail(id) {
                $.ajax({
                url: 'https://app.gprnt.ai/api/v1/cms/pledge',
                method: "GET",
                data: { pledge_id: id },
                success: (data) => {
                    window.location.href = `/pledger?id=${id}`;
                },
                error: (xhr, status, error) => {
                    console.error("Lỗi khi gọi API:", error);
                    this.notFound();
                }
                });
            }
            destroy() {
                this.tlTrigger.kill();
                // Clean up loading timeout
                if (this.loadingTimeout) {
                    clearTimeout(this.loadingTimeout);
                    this.loadingTimeout = null;
                }
            }
        },
    }
    const ParticipantDetailPage = {
       'part-dl-hero-wrap': class extends HTMLElement {
            constructor() {
                super();
                this.tlTrigger = null;
                this.badgeMap = {
                    Pledger: {
                    enterprise: "https://cdn.prod.website-files.com/68b8587b9524e7690bad4973/697985297684f6ad9997e309_enterprise%202026%20pledger.png",
                    sme:   "https://cdn.prod.website-files.com/68b8587b9524e7690bad4973/6979852923e757f43eca70d7_business%202026%20pledger.png",
                    sp:   "https://cdn.prod.website-files.com/68b8587b9524e7690bad4973/69798529346e0a753916d962_solution%202026%20pledger.png"
                    },
                    Achiever: {
                    enterprise: "https://cdn.prod.website-files.com/68b8587b9524e7690bad4973/6979852993f94c06ddbda6cd_enterprise%202026%20achiever.png",
                    sme:   "https://cdn.prod.website-files.com/68b8587b9524e7690bad4973/69798529af2ce08554a89827_business%202026%20achiever.png",
                    sp:   "https://cdn.prod.website-files.com/68b8587b9524e7690bad4973/69798529e30c2a6170e51e1e_solution%202026%20achiever.png"
                    }
                };
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
                this.setup();
            }
            setup() {
                let url = window.location.pathname;
                const urlParams = new URLSearchParams(window.location.search);
                const pledgeId = urlParams.get("id");
                if (pledgeId) {
                    const newUrl = `/pledger/${pledgeId}`;
                    window.history.replaceState({}, "", newUrl);
                }
                else {
                    window.location.href = '/pledgers'
                }
                this.getDetail(pledgeId);
            }
            async getDetail(id) {
                $.ajax({
                url: 'https://app.gprnt.ai/api/v1/cms/pledge',
                method: "GET",
                data: { pledge_id: id },
                success: async (data) => {
                    if(data['status'] == 'Achiever') {
                        $('.part-dl-hero').addClass('part-dl-hero-achiever');
                    }
                    console.log('khanh' +data['website_url'])
                    if(data['industry']== '' || !data['website_url']){
                        $('.part-dl-hero-social-item-space').hide();
                    }
                   $('[data-key]').each(async (idx, item) => {
                    let key = $(item).attr('data-key');
                    if(!data[key] && key != 'info-img'){
                        $(item).parent().hide();
                        return;
                    }
                    else if(key == 'logo_url'){
                        const isValidImage = await this.checkImageWithAjax(data[key]);
                        console.log(isValidImage);
                        if(isValidImage){
                            $(item).attr('src', data[key])
                        }
                        else {
                            $(item).parent().hide();
                        }
                    }
                    else if(key == 'type_of_company'){
                        let type  = data[key];
                        if(type == 'sp'){
                            $(item).text('Solution')
                        }
                        else if(type == 'sme') {
                            $(item).text("Business")
                        }
                        else {
                            $(item).text('Enterprise')
                        }
                    }
                    else if(key == 'pledge_issued_date' || key =='pledge_expiry_date') {
                        $(item).text( this.formatDate(data[key]) )
                    }
                    else if(key == 'website_url') {
                        $(item).attr('href', data[key]);
                        $(item).find('.txt').text(this.cleanLink(data[key]));
                    }
                    else if(key == 'info-img') {
                        const badgeUrl = this.getBadgeImage(data.status, data.type_of_company);
                        console.log(badgeUrl)
                        $(item).attr('src', badgeUrl)
                    }
                    else {
                        $(item).text(data[key])
                    }
                   })
                },
                error: (xhr, status, error) => {
                    console.error("Lỗi khi gọi API:", error);
                }
                });
            }
            getBadgeImage(status, type) {
                return this.badgeMap[status]?.[type] || null;
            }
            async checkImageWithAjax(url) {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                    img.src = url;
                });
            }
            formatDate(dateStr) {
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const date = new Date(dateStr); 

                const day = String(date.getDate()).padStart(2, '0');
                const month = months[date.getMonth()];
                const year = date.getFullYear();

                return `${day} ${month} ${year}`;
            }
            cleanLink(url) {
                return url.replace(/^https?:\/\/(www\.)?/, '');
            }
            destroy() {
                this.tlTrigger.kill();
                if (this.loadingTimeout) {
                    clearTimeout(this.loadingTimeout);
                    this.loadingTimeout = null;
                }
            }
        },
    }
    const AboutPage = {
       'about-mission-wrap': class extends HTMLElement {
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
                this.setup();
            }
            setup() {
                let content = new SplitType('.about-mission-sub-txt', {types: 'lines, words, chars', lineClass: 'bp-line'});
                let tl = new gsap.timeline({
                    scrollTrigger: {
                        trigger: '.about-mission-sub',
                        start: 'top center',
                        end: 'bottom center',
                        scrub: 1,
                    }
                })
                tl.to(content.chars, {color: "#1A3628", duration: 1, stagger: .02})
            }
           
            destroy() {
                this.tlTrigger.kill();
                if (this.loadingTimeout) {
                    clearTimeout(this.loadingTimeout);
                    this.loadingTimeout = null;
                }
            }
        },
        'about-mile-wrap': class extends HTMLElement {
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
                this.setup();
            }
            setup() {
                let swiperMile = new Swiper(".about-mile-cms", {
                    slidesPerView: 1.2,
                    spaceBetween: parseRem(16),
                    navigation: {
                        prevEl: ".about-mile-control-item.about-mile-control-item-prev",
                        nextEl: ".about-mile-control-item.about-mile-control-item-next",
                    },
                    breakpoints: {
                        767: {
                            spaceBetween: parseRem(24),
                            slidesPerView: 1.4,
                        },
                        991: {
                            spaceBetween: parseRem(24),
                            slidesPerView: 2,
                        }
                    }
                });
            }
           
            destroy() {
                this.tlTrigger.kill();
                if (this.loadingTimeout) {
                    clearTimeout(this.loadingTimeout);
                    this.loadingTimeout = null;
                }
            }
        },
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
        tpEvent: TpEventPage,
        term: TermPage,
        participant: ParticipantPage,
        participantDetail: ParticipantDetailPage,
        notFound: NotFoundPage,
        about: AboutPage,
    };
    const registry = {};
    registry[pageName]?.destroy();
    pageConfig[pageName] && (registry[pageName] = new PageManager(pageConfig[pageName]));
    refreshOnBreakpoint();
}
window.onload = script