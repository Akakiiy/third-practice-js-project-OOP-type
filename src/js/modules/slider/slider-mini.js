import Slider from './slider';

export default class MiniSlider extends Slider {
    constructor (container, next, prev, activeClass, animate, autoplay) {
        super(container, next, prev, activeClass, animate, autoplay);
    }

    decorizeSlides () {
        this.slides.forEach(slide => {
            slide.classList.remove(this.activeClass);
            if (this.animate) {
                slide.querySelector('.card__title').style.opacity = '0.4';
                slide.querySelector('.card__controls-arrow').style.opacity = '0';
            }
        });

        this.slides[0].classList.add(this.activeClass);

        if (this.animate) {
            this.slides[0].querySelector('.card__title').style.opacity = '1';
            this.slides[0].querySelector('.card__controls-arrow').style.opacity = '1';
        }
    }

    nextSlide() {
        if (this.slides[this.slides.length - 1].getAttribute('type') == "button") {
            this.container.insertBefore(this.slides[0], this.slides[this.slides.length - 2]);
        } else {
            this.container.appendChild(this.slides[0]);
        }
        this.decorizeSlides();
    }

    bindTriggers() {
        this.next.addEventListener('click', () => this.nextSlide());

        this.prev.addEventListener('click', () => {
            let active = this.slides[this.slides.length - 1];

            if (active.getAttribute('type') == "button") {
                active = this.slides[this.slides.length - 3];
            }

            this.container.insertBefore(active, this.slides[0]);
            this.decorizeSlides();
        });
    }

    bindTriggersForAutoplay() {
        let interval = setInterval(() => this.nextSlide(), 5000);
        const freezeAutoplayForElem = (elem) => {
            elem.addEventListener('mouseover', () => clearInterval(interval));
            elem.addEventListener('mouseout', () => interval = setInterval(() => this.nextSlide(), 5000));
        }
        freezeAutoplayForElem(this.container);
        freezeAutoplayForElem(this.prev);
        freezeAutoplayForElem(this.next);
    }

    init () {
        this.container.style.cssText = `
            display: flex;  
            flex-wrap: wrap;
            overflow: hidden;
            align-items: flex-start;
        `;

        this.bindTriggers();
        this.decorizeSlides();
        if (this.autoplay) {
            this.bindTriggersForAutoplay();
        }
    }
}