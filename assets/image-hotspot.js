function debounce(func, delay) {
    let inDebounce;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
}

const TOOLTIP_MARGIN = 16;
const ACTIVE_Z_INDEX = 2;
const DEFAULT_Z_INDEX = 1;

class HotspotBlock extends HTMLElement {

    constructor() {
        super();
        this.toggler = this.querySelector('[data-action="show-tooltip"]');
        this.tooltip = this.querySelector('.hotspot__tooltip');
        this.imageWrapper = document.querySelector('.hotspot__image');
        this.focusableElements = this.tooltip.querySelectorAll('a, button, input, select, textarea');
        this.toggler.addEventListener('click', this.toogleTooltip.bind(this));
    }

    toogleTooltip(e) {
        e.stopPropagation();
        if (this.classList.contains('active')) {
            this.hideTooltip();
        } else {
            this.showTooltip();
        }
    }
    showTooltip() {
        document.querySelectorAll('hotspot-block.active')?.forEach(b=>b.hideTooltip());
        this.style.zIndex = ACTIVE_Z_INDEX;
        this.classList.add('active');
        this.tooltip.setAttribute('aria-hidden', 'false');
        if (this.focusableElements?.length) {
            this.setTooltipFocusable(true)
        }
        this.updatePositionWhenOverflow();
    }
    hideTooltip() {
        this.classList.remove('active');
        this.tooltip.setAttribute('aria-hidden', 'true');
        if (this.focusableElements?.length) {
            this.setTooltipFocusable(false)
        }
        this.style.zIndex = DEFAULT_Z_INDEX;
    }

    updatePositionWhenOverflow() {
        if (!this.classList.contains('active')) {
            return
        }
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const containerRect = this.imageWrapper.getBoundingClientRect();

        const overflowOffsetCSSProperty = getComputedStyle(this).getPropertyValue('--overflow-offset').replace('px', '')
        const currentAppliedOffset = Number(overflowOffsetCSSProperty || '0')

        const leftOffset = tooltipRect.left - currentAppliedOffset - containerRect.left;
        const rightOffset = containerRect.right + currentAppliedOffset - tooltipRect.right;

        let offset = 0;
        if (rightOffset < TOOLTIP_MARGIN) {
            offset = rightOffset - TOOLTIP_MARGIN
        } else if (leftOffset < TOOLTIP_MARGIN) {
            offset = (leftOffset * -1) + TOOLTIP_MARGIN;
        }
        this.style.setProperty('--overflow-offset', offset + 'px');
    }

    setTooltipFocusable(focusable) {
        this.focusableElements.forEach(el => el.setAttribute('tabindex', focusable ? '0' : '-1'));
    }
    connectedCallback() {
        window.addEventListener('resize', debounce(this.updatePositionWhenOverflow.bind(this), 50));
    }
}

document.addEventListener('click', function (event) {
    document.querySelectorAll('hotspot-block.active')?.forEach(block => {
        if (!block.contains(event.target)) {
            block.hideTooltip();
        }
    });
    if (event.target.matches('[data-action="add-all-to-cart"]')) {
        const blockElements = document.querySelectorAll('hotspot-block')

        if (!blockElements?.length) {
            return
        }

        const availableVariants = Array.from(blockElements).filter(b => b.dataset.variantId);

        if (!availableVariants) {
            // TODO: Go to an specific collection.
            alert('No products available.')
            return;
        }

        const formData = {
            items: availableVariants.map(b => (
                {
                    id: b.dataset.variantId,
                    quantity: 1,
                }
            ))
        }
        const buttonContent = event.target.textContent;
        event.target.textContent = window.variantStrings.addingToCart;
        fetch('/cart/add.js', {
            body: JSON.stringify(formData),
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
            .then(_ => window.Rebuy?.SmartCart?.show())
            .catch(error => console.error('There has been a problem with your fetch operation:', error))
            .finally(_ => event.target.textContent = buttonContent);
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('hotspot-block.active')?.forEach(block => block.hideTooltip());
    }

});

customElements.define('hotspot-block', HotspotBlock);
Shopify.designMode && document.addEventListener('shopify:section:load', _ => customElements.define('hotspot-block', HotspotBlock));