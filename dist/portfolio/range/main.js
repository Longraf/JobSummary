(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let RangeSlider = require('./rangeslider');

let rr = new RangeSlider({
    Target       : document.querySelector('.wrapper'),
    MinValue     : 4000,
    MaxValue     : 75000,
    Values       : [6000, 65000],
    MinMaxVision : true,
    StepLength   : 100,
    // ScaleStep    : 500,
});

let rr2 = new RangeSlider({
    Target       : document.querySelector('.wrapper'),
    MinValue     : 1,
    MaxValue     : 15,
    Values       : [4, 6],
    MinMaxVision : true,
    StepLength   : 1,

});
let rr3 = new RangeSlider({
    Target       : document.querySelector('.wrapper'),
    MinValue     : 500,
    MaxValue     : 3700,
    Values       : [500, 3700],
    MinMaxVision : true,
    ScaleStep    : false,
    StepLength   : false,
});
let rr4 = new RangeSlider({
    Target       : document.querySelector('.wrapper'),
    MinValue     : 10000,
    MaxValue     : 1200000,
    Values       : [300000, 1100000],
    MinMaxVision : true,
    // StepLength   : 1,
});
let rr5 = new RangeSlider({
    Target       : document.querySelector('.wrapper'),
    MinValue     : 28,
    MaxValue     : 100,
    Values       : [34, 90],
    MinMaxVision : true,
    ScaleStep    : 1,
    StepLength   : 0.5,
});
},{"./rangeslider":2}],2:[function(require,module,exports){
module.exports = class rangeslider {
    static _createDOM(target, value1, value2, minValue, maxValue) { // Creates a DOM tree for the slider
        let slider  = document.createElement('div');
        slider.setAttribute('class', 'my-JSRS-rangeSlider rangeSlider5a4');
        slider.innerHTML = `<div class="JSRSrangeSlider">
                                <div class="JSRSvaluee min-value">${minValue}</div>
                                <div class="JSRSspace space-left">
                                    <div class="JSRSbuttonn min__button">
                                        <span class="JSRSrange__value range__value_left">${value1}</span>
                                    </div>
                                </div>
                                <div class="JSRSspace JSRSrange-line"></div>
                                <div class="JSRSspace space-right">
                                    <div class="JSRSbuttonn max__button">
                                        <span class="JSRSrange__value range__value_right">${value2}</span>
                                    </div>
                                </div>
                                <div class="JSRSvaluee max-value">${maxValue}</div>
                            </div>
                            <div class="JSRSscale">
                            </div>`;
        target.appendChild(slider);
        return slider
    }
    constructor({
                    Target       = null,
                    MinValue     = null,
                    MaxValue     = null,
                    Values       = [MinValue, MaxValue],
                    MinMaxVision = false,
                    ScaleStep    = false,
                    StepLength   = 1,
                })
    {
        let that = this;
        //
        this._Target        = rangeslider._createDOM(Target, Values[0], Values[1], MinValue, MaxValue, ScaleStep);

        this._MinValue      = MinValue;
        this._MaxValue      = MaxValue;
        this._Values        = Values;
        this._MinMaxVision  = MinMaxVision;
        this._ScaleStep     = ScaleStep;
        this._StepLength    = StepLength;
        this._Selectors     = {
            slider                  : this.Target,
            spaceLeft               : this.Target.querySelector('.space-left'),
            minButton               : this.Target.querySelector('.min__button'),
            rangeLine               : this.Target.querySelector('.JSRSrange-line'),
            maxButton               : this.Target.querySelector('.max__button'),
            spaceRight              : this.Target.querySelector('.space-right'),
            rangeValueLeft          : this.Target.querySelector('.range__value_left'),
            rangeValueRight         : this.Target.querySelector('.range__value_right'),
            positionLeftGlow        : (this.Values[0] - this.MinValue) / (this.MaxValue -this. MinValue),
            positionRightGlow       : (this.MaxValue - this.Values[1]) / (this.MaxValue - this.MinValue),
            MinValueSelect          : this.Target.querySelector('.min-value'),
            MaxValueSelect          : this.Target.querySelector('.max-value'),
            scale                   : this.Target.querySelector('.JSRSscale'),
            scaleSpan               : this.Target.querySelectorAll('.JSRSscale span'),
            scaleSpanP              : this.Target.querySelectorAll('.JSRSscale span p'),
        };
        this._startPosition = () => {
            let minButtonCoord = this._Selectors.spaceLeft.offsetWidth - this._Selectors.minButton.offsetWidth/2;
            let maxButtonCoord = this._Selectors.spaceRight.getBoundingClientRect().x - this._Selectors.slider.getBoundingClientRect().x - this._Selectors.minButton.offsetWidth/2;
            let coord = event.pageX - this._Selectors.slider.getBoundingClientRect().x;
            let center = (maxButtonCoord + minButtonCoord) / 2 ;
            if (coord < center) {
                document.addEventListener('mousemove', moveLeftSlider);
            } else {
                document.addEventListener('mousemove', moveRightSlider);
            }
            // this._validationCorrectData();
        };
        this._validationCorrectData = () => {
            if (this.MinValue === this.MaxValue) {
                console.warn(Error('MinValue can not be equal than MaxValue'));
            }
            if (this.MinValue > this.MaxValue) {
                [this.MinValue, this.MaxValue] = [this.MaxValue, this.MinValue];
                console.warn(Error('MinValue can not be greater than MaxValue'));
            }
            if (this.Values[0] < this.MinValue) {
                this.Values[0] = this.MinValue;
                console.warn('The value[0] can not be less than the MinValue and above the MaxValue');
            }
            if (this.Values[1] > this.MaxValue) {
                this.Values[1] = this.MaxValue;
                console.warn('The value[1] can not be less than the MinValue and above the MaxValue');
            }
            if (this.Values[1] < this.MinValue) {
                this.Values[1] = this.Values[0];
                console.warn('The value[1] can not be less than the MinValue and above the MaxValue');
            }
            if (this.Values[0] > this.Values[1] ) {
                this.Values[0] = this.Values[1];
                console.warn('Value[0] can not be greater than Value[1]');
            }
            this._recountFlexGlow();
        };
        this._recountFlexGlow = () => {
            this._Selectors.spaceLeft.style.flexGrow  = (this.Values[0] - this.MinValue) / (this.MaxValue -this.MinValue);
            this._Selectors.spaceRight.style.flexGrow = (this.MaxValue - this.Values[1]) / (this.MaxValue - this.MinValue);
            this._Selectors.rangeLine.style.flexGrow  = 1- this._Selectors.spaceLeft.style.flexGrow - this._Selectors.spaceRight.style.flexGrow;
            this._Selectors.rangeValueLeft.innerHTML  = this.Values[0];
            this._Selectors.rangeValueRight.innerHTML = this.Values[1];
            this._installRangeValueHTML();
        };
        this._installRangeValueHTML = () => {
            this._Selectors.rangeValueLeft.innerHTML  = this.Values[0];
            this._Selectors.rangeValueRight.innerHTML = Math.round((1 - this._Selectors.spaceRight.style.flexGrow ) * (this.MaxValue - this.MinValue)) + this.MinValue;
            let left  = this._Selectors.spaceLeft.style.flexGrow  * (this.MaxValue - this.MinValue) + this.MinValue ;
            let right = (1 - this._Selectors.spaceRight.style.flexGrow ) * (this.MaxValue - this.MinValue) + this.MinValue;
            this._Selectors.maxButton.style.transform = `translate(${-this._Selectors.maxButton.offsetWidth/2}px,0px)`;
            this._Selectors.minButton.style.transform = `translate(${this._Selectors.maxButton.offsetWidth/2}px,0px)`;
            if (this.StepLength % 1 === 0) {
                if (this.StepLength % 1000 === 0 && String(this.MaxValue).length > 5) {
                    left  = Math.round(left  / 1000) * 1000 ;
                    right = Math.round(right / 1000) * 1000;
                }
                left  = Math.round(left);
                right = Math.round(right);
            } else {
                left  = left.toFixed(String(this.StepLength).split('.')[1].length);
                right = right.toFixed(String(this.StepLength).split('.')[1].length);
            }
            if (this.MaxValue > 99999 ) {
                left = this._rounderExp(left, false);
                right = this._rounderExp(right, false);
            }
            this._Values = [left, right];
            let distanse = this._Selectors.rangeValueRight.getBoundingClientRect().x - this._Selectors.rangeValueLeft.getBoundingClientRect().x - this._Selectors.rangeValueLeft.offsetWidth ;
            //console.log(distanse);
            if (distanse < 10) {
                this._Selectors.rangeValueRight.style.border = '0px';
                if (left === right) {
                    this._Selectors.rangeValueLeft.innerHTML = this._rankNumber(left);
                } else {
                    this._Selectors.rangeValueLeft.innerHTML = this._rankNumber(left) + '-' + this._rankNumber(right);
                }
                this._Selectors.rangeValueRight.innerHTML = '';
            } else {
                this._Selectors.rangeValueRight.style.border = '';
                this._Selectors.rangeValueLeft.innerHTML  = this._rankNumber(left);
                this._Selectors.rangeValueRight.innerHTML = this._rankNumber(right);
            }
            let padding = this._Selectors.minButton.offsetWidth/2 + 2;
            if (this.minMaxVisibility) {
                this._Selectors.MinValueSelect.style.display = 'block';
                this._Selectors.MaxValueSelect.style.display = 'block';

                if (this._Selectors.spaceLeft.offsetWidth < this._Selectors.MinValueSelect.offsetWidth + padding) { // hidden MinValue left
                    this._Selectors.MinValueSelect.style.display = "none";
                } else {
                    this._Selectors.MinValueSelect.style.color = "";
                }
                if (this._Selectors.spaceRight.offsetWidth < this._Selectors.MaxValueSelect.offsetWidth + padding) { // hidden MaxValue right
                    this._Selectors.MaxValueSelect.style.display = "none";
                } else {
                    this._Selectors.MaxValueSelect.style.color = "";
                }
            } else {
                this._Selectors.MinValueSelect.style.display = 'none';
                this._Selectors.MaxValueSelect.style.display = 'none';
            }
            this._Selectors.MinValueSelect.innerHTML  = this._rankNumber(this.MinValue);
            this._Selectors.MaxValueSelect.innerHTML  = this._rankNumber(this.MaxValue);
            if (this._Selectors.minButton.getBoundingClientRect().x - this._Selectors.slider.getBoundingClientRect().x // Value[0]can not be to the left of the slider
                - (this._Selectors.rangeValueLeft.offsetWidth / 2 ) + this._Selectors.minButton.offsetWidth < 0 ){
                this._Selectors.rangeValueLeft.style.left = this._Selectors.slider.getBoundingClientRect().x
                    - this._Selectors.minButton.getBoundingClientRect().x + (this._Selectors.rangeValueLeft.offsetWidth / 2)  - this._Selectors.minButton.offsetWidth + 'px' ;
            } else {
                this._Selectors.rangeValueLeft.style.left = '';
            }
            if (this._Selectors.minButton.getBoundingClientRect().x - this._Selectors.slider.getBoundingClientRect().x
                + this._Selectors.minButton.offsetWidth + this._Selectors.rangeValueLeft.offsetWidth / 2 + this._Selectors.minButton.offsetWidth - this._Selectors.slider.offsetWidth > 0){ // Value[0] can not be to the right of the slider
                this._Selectors.rangeValueLeft.style.right = this._Selectors.minButton.getBoundingClientRect().x - this._Selectors.slider.getBoundingClientRect().x
                    + this._Selectors.minButton.offsetWidth + this._Selectors.rangeValueLeft.offsetWidth/2 - this._Selectors.slider.offsetWidth - this._Selectors.minButton.offsetWidth + 'px';
            } else {
                this._Selectors.rangeValueLeft.style.right = '';
            }
            //console.log(this._Selectors.rangeValueLeft.style.left);
            if (this._Selectors.maxButton.getBoundingClientRect().x - this._Selectors.slider.getBoundingClientRect().x // Value[1] can not be to the right of the slider
                + this._Selectors.maxButton.offsetWidth + this._Selectors.rangeValueRight.offsetWidth/2 + this._Selectors.minButton.offsetWidth> this._Selectors.slider.offsetWidth){
                this._Selectors.rangeValueRight.style.right = this._Selectors.maxButton.getBoundingClientRect().x - this._Selectors.slider.getBoundingClientRect().x
                    + this._Selectors.maxButton.offsetWidth + this._Selectors.rangeValueRight.offsetWidth/2 - this._Selectors.slider.offsetWidth - this._Selectors.minButton.offsetWidth + 'px';
            } else {
                this._Selectors.rangeValueRight.style.right = '';
            }
            this._dimensionScale(this.ScaleStep);
        };
        this._roundingToFive = (val) => {
            let rezult = val % 5;
            rezult && (val = val - rezult + 5);
            return val;
        };
        this._rankNumber = (e) => {
            return String(e).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
        };
        this._rounderExp = (val, isEqualFive = true, coefficient = 1) => {
            //num = M * Math.pow(10, P)
            let lengthVal = String(this.MaxValue).length - 3 - coefficient;
            if (this.MaxValue < 20) {
                return val;
            }
            if (isEqualFive) {
                return Math.round( this._roundingToFive(val /  Math.pow(10, lengthVal))) *  Math.pow(10, lengthVal);
            } else {
                return Math.round( val /  Math.pow(10, lengthVal) ) *  Math.pow(10, lengthVal);
            }
        };
        this._fromValuesToFlex = (e) => (e - this.MinValue) / (this.MaxValue - this.MinValue);
        this._currentRoundstep = (val) => {
            val = val /that.StepLength;
            //let currentValueLeft = Math.round(val / that._Selectors.slider.offsetWidth * (that.MaxValue - that.MinValue)) + that.MinValue;
            let currentValueLeft = Math.round(val / that._Selectors.slider.offsetWidth * (that.MaxValue - that.MinValue)) * that.StepLength + that.MinValue;
            return (currentValueLeft - this.MinValue) / (this.MaxValue - this.MinValue)
        };
        function moveLeftSlider() {
            event.preventDefault();
            let coord = event.pageX - that._Selectors.slider.getBoundingClientRect().x;
            if (StepLength) {
                that._Selectors.spaceLeft.style.flexGrow = that._currentRoundstep(coord);
            } else {
                that._Selectors.spaceLeft.style.flexGrow = coord / that._Selectors.slider.offsetWidth;
            }
            let LeftGrow  = parseFloat(that._Selectors.spaceLeft.style.flexGrow);
            let RightGrow = parseFloat(that._Selectors.spaceRight.style.flexGrow);
            if  (coord <= 0) {
                that._Selectors.spaceLeft.style.flexGrow = 0;
            }
            if (LeftGrow + RightGrow < 1) {
                that._Selectors.rangeLine.style.flexGrow = 1 - LeftGrow - RightGrow;
            } else {
                that._Selectors.rangeLine.style.flexGrow = 0;
                that._Selectors.spaceLeft.style.flexGrow = 1- RightGrow;
            }
            that._installRangeValueHTML();
            // that.Values[0] = LeftGrow * that.MaxValue;
        }
        function moveRightSlider() {
            event.preventDefault();
            let coord = event.pageX - that._Selectors.slider.getBoundingClientRect().x;
            if (StepLength) {
                that._Selectors.spaceRight.style.flexGrow = 1 - that._currentRoundstep(coord) ;
            } else {
                that._Selectors.spaceRight.style.flexGrow = 1 - coord / that._Selectors.slider.offsetWidth
            }
            let LeftGrow  = parseFloat(that._Selectors.spaceLeft.style.flexGrow);
            let RightGrow = parseFloat(that._Selectors.spaceRight.style.flexGrow);
            if  (coord >= that._Selectors.slider.offsetWidth) {
                that._Selectors.spaceRight.style.flexGrow = 0;
            }
            if (1 - LeftGrow - RightGrow > 0) {
                that._Selectors.rangeLine.style.flexGrow = 1 - LeftGrow - RightGrow;
            } else {
                that._Selectors.rangeLine.style.flexGrow = 0;
                that._Selectors.spaceRight.style.flexGrow = 1 - LeftGrow;
            }
            that._installRangeValueHTML();
        }

        this._getSpanElementWidth = () => {
            let span    = document.createElement('span');
            span.setAttribute('class', 'span');
            let p       = document.createElement('p');
            p.innerHTML = this.MaxValue;
            span.appendChild(p);
            this._Selectors.scale.appendChild(span);
            let width = p.offsetWidth;
            span.remove();
            return width
        };
        this._dimensionScale = (step) => {
            this._Selectors.scaleSpan = this._Selectors.slider.querySelector('.JSRSscale span');
            let clone = this._Selectors.scale.cloneNode(false);
            this._Selectors.scale.remove();
            this._Selectors.scale = clone;
            this._Selectors.slider.appendChild(clone);
            if (step) {
                let maxStep = Math.floor(this._Selectors.slider.offsetWidth / (this._getSpanElementWidth() )) - 2;
                let currentSum = this.MinValue;
                let counter = step;
                while (MinValue + counter < MaxValue ) {
                    currentSum += step;
                    let span    = document.createElement('span');
                    span.setAttribute('class', 'span');
                    let p = document.createElement('p');
                    p.innerHTML = currentSum;
                    span.style.left = (this._Selectors.slider.offsetWidth * counter / (this.MaxValue - this.MinValue))  + 'px';
                    span.appendChild(p);
                    this._Selectors.scale.appendChild(span);
                    counter += step;
                }
                this._Selectors.scaleSpan = this._Selectors.slider.querySelectorAll('.JSRSscale span');
                this._Selectors.scaleSpanP = this._Selectors.slider.querySelectorAll('.JSRSscale span p');
                let coefficient = Math.floor(this._Selectors.scaleSpan.length / maxStep);
                if (this._Selectors.slider.offsetWidth < this._Selectors.scaleSpanP[this._Selectors.scaleSpanP.length-1].offsetWidth * this._Selectors.scaleSpanP.length * 1.5 ) {
                    for (let i = 0; i < this._Selectors.scaleSpan.length; i++ ) {
                        if (i % (coefficient + 1) === 0 ) {
                            this._Selectors.scaleSpan[i].querySelector('p').style.display = '';
                        } else {
                            this._Selectors.scaleSpan[i].querySelector('p').style.display = 'none';
                        }
                    }
                }
            } else {
                let maxStep = Math.floor(this._Selectors.slider.offsetWidth / (this._getSpanElementWidth() * 2)) - 2;
                if (maxStep  > 15 ) {
                    maxStep = 15;
                }
                if (maxStep  < 1) {
                    return
                }
                let step = this._rounderExp((this.MaxValue - this.MinValue) / maxStep , true, 0);
                let currentSum = this.MinValue;
                let counter = step;
                while (this.MinValue + counter  < this.MaxValue) {
                    currentSum += step;
                    let span = document.createElement('span');
                    span.setAttribute('class', 'span');
                    let p = document.createElement('p');
                    p.innerHTML = Math.round(this._rounderExp(currentSum, true, 0));
                    if (p.innerHTML >= this.MaxValue) {
                        return
                    }
                    span.style.left = this._Selectors.slider.offsetWidth * this._fromValuesToFlex(p.innerHTML) + 'px';
                    span.appendChild(p);
                    this._Selectors.scale.appendChild(span);
                    counter += step;
                }
            }
        };
        this._dimensionScale(this.ScaleStep);
        this._debounce = (func, wait, immediate) => {
            let timeout;
            return () => {
                const context = this, args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };
        that._Selectors.slider.addEventListener('mousedown' , this._startPosition);
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', moveRightSlider);
            document.removeEventListener('mousemove', moveLeftSlider);
        });
        window.addEventListener('resize', this._debounce(() => this._dimensionScale(this.ScaleStep), 200, false), false);
        this._validationCorrectData();
        this._recountFlexGlow();
    }
    get Target(){
        return this._Target;
    }
    set Target(v){
        this._Target = v;
    }
    get ValueLeft(){
        return this._Values[0];
    }
    set ValueLeft(v){
        this._Values[0] = v;
        this._validationCorrectData();

    }
    get ValueRight(){
        return this._Values[1];
    }
    set ValueRight(v){
        this._Values[1] = v;
        this._validationCorrectData();
    }
    get Values(){
        return this._Values;
    }
    set Values(array){
        if (!Array.isArray(array) || array.length !== 2 ) {
            console.warn('Only accepts an array and only two values');
            return
        }
        if (array[0] > array[1]) {
            [array[0], array[1]] = [array[1], array[0]];
            console.warn('Value[0] can not be greater than Value[1]');
        }
        this._Values = [array[0], array[1]];
        this._validationCorrectData();
    }
    get MinValue(){
        return this._MinValue;
    }
    set MinValue(v){
        this._MinValue = v;
        this._validationCorrectData();
    }
    get MaxValue(){
        return this._MaxValue;
    }
    set MaxValue(v){
        this._MaxValue = v;
        this._validationCorrectData();

    }
    get minMaxVisibility(){
        return this._MinMaxVision;
    }
    set minMaxVisibility(v){
        this._MinMaxVision = v;
        this._validationCorrectData();
    }
    get ScaleStep(){
        return this._ScaleStep;
    }
    set ScaleStep(v){
        this._ScaleStep = v;
        this._validationCorrectData();
    }
    get StepLength(){
        return this._StepLength;
    }
    set StepLength(v){
        this._StepLength = v;
        this._validationCorrectData();
    }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9yYW5nZXNsaWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImxldCBSYW5nZVNsaWRlciA9IHJlcXVpcmUoJy4vcmFuZ2VzbGlkZXInKTtcclxuXHJcbmxldCByciA9IG5ldyBSYW5nZVNsaWRlcih7XHJcbiAgICBUYXJnZXQgICAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud3JhcHBlcicpLFxyXG4gICAgTWluVmFsdWUgICAgIDogNDAwMCxcclxuICAgIE1heFZhbHVlICAgICA6IDc1MDAwLFxyXG4gICAgVmFsdWVzICAgICAgIDogWzYwMDAsIDY1MDAwXSxcclxuICAgIE1pbk1heFZpc2lvbiA6IHRydWUsXHJcbiAgICBTdGVwTGVuZ3RoICAgOiAxMDAsXHJcbiAgICAvLyBTY2FsZVN0ZXAgICAgOiA1MDAsXHJcbn0pO1xyXG5cclxubGV0IHJyMiA9IG5ldyBSYW5nZVNsaWRlcih7XHJcbiAgICBUYXJnZXQgICAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud3JhcHBlcicpLFxyXG4gICAgTWluVmFsdWUgICAgIDogMSxcclxuICAgIE1heFZhbHVlICAgICA6IDE1LFxyXG4gICAgVmFsdWVzICAgICAgIDogWzQsIDZdLFxyXG4gICAgTWluTWF4VmlzaW9uIDogdHJ1ZSxcclxuICAgIFN0ZXBMZW5ndGggICA6IDAuMSxcclxuXHJcbn0pO1xyXG5sZXQgcnIzID0gbmV3IFJhbmdlU2xpZGVyKHtcclxuICAgIFRhcmdldCAgICAgICA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53cmFwcGVyJyksXHJcbiAgICBNaW5WYWx1ZSAgICAgOiA1MDAsXHJcbiAgICBNYXhWYWx1ZSAgICAgOiAzNzAwLFxyXG4gICAgVmFsdWVzICAgICAgIDogWzUwMCwgMzcwMF0sXHJcbiAgICBNaW5NYXhWaXNpb24gOiB0cnVlLFxyXG4gICAgU2NhbGVTdGVwICAgIDogZmFsc2UsXHJcbiAgICBTdGVwTGVuZ3RoICAgOiBmYWxzZSxcclxufSk7XHJcbmxldCBycjQgPSBuZXcgUmFuZ2VTbGlkZXIoe1xyXG4gICAgVGFyZ2V0ICAgICAgIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndyYXBwZXInKSxcclxuICAgIE1pblZhbHVlICAgICA6IDEwMDAwLFxyXG4gICAgTWF4VmFsdWUgICAgIDogMTIwMDAwMCxcclxuICAgIFZhbHVlcyAgICAgICA6IFszMDAwMDAsIDExMDAwMDBdLFxyXG4gICAgTWluTWF4VmlzaW9uIDogdHJ1ZSxcclxuICAgIC8vIFN0ZXBMZW5ndGggICA6IDEsXHJcbn0pO1xyXG5sZXQgcnI1ID0gbmV3IFJhbmdlU2xpZGVyKHtcclxuICAgIFRhcmdldCAgICAgICA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53cmFwcGVyJyksXHJcbiAgICBNaW5WYWx1ZSAgICAgOiAyOCxcclxuICAgIE1heFZhbHVlICAgICA6IDEwMCxcclxuICAgIFZhbHVlcyAgICAgICA6IFszNCwgOTBdLFxyXG4gICAgTWluTWF4VmlzaW9uIDogdHJ1ZSxcclxuICAgIFNjYWxlU3RlcCAgICA6IDEsXHJcbiAgICBTdGVwTGVuZ3RoICAgOiAwLjUsXHJcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgcmFuZ2VzbGlkZXIge1xyXG4gICAgc3RhdGljIF9jcmVhdGVET00odGFyZ2V0LCB2YWx1ZTEsIHZhbHVlMiwgbWluVmFsdWUsIG1heFZhbHVlKSB7IC8vIENyZWF0ZXMgYSBET00gdHJlZSBmb3IgdGhlIHNsaWRlclxyXG4gICAgICAgIGxldCBzbGlkZXIgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgc2xpZGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbXktSlNSUy1yYW5nZVNsaWRlciByYW5nZVNsaWRlcjVhNCcpO1xyXG4gICAgICAgIHNsaWRlci5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cIkpTUlNyYW5nZVNsaWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJKU1JTdmFsdWVlIG1pbi12YWx1ZVwiPiR7bWluVmFsdWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkpTUlNzcGFjZSBzcGFjZS1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJKU1JTYnV0dG9ubiBtaW5fX2J1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJKU1JTcmFuZ2VfX3ZhbHVlIHJhbmdlX192YWx1ZV9sZWZ0XCI+JHt2YWx1ZTF9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiSlNSU3NwYWNlIEpTUlNyYW5nZS1saW5lXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkpTUlNzcGFjZSBzcGFjZS1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiSlNSU2J1dHRvbm4gbWF4X19idXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiSlNSU3JhbmdlX192YWx1ZSByYW5nZV9fdmFsdWVfcmlnaHRcIj4ke3ZhbHVlMn08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJKU1JTdmFsdWVlIG1heC12YWx1ZVwiPiR7bWF4VmFsdWV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJKU1JTc2NhbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XHJcbiAgICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHNsaWRlcik7XHJcbiAgICAgICAgcmV0dXJuIHNsaWRlclxyXG4gICAgfVxyXG4gICAgY29uc3RydWN0b3Ioe1xyXG4gICAgICAgICAgICAgICAgICAgIFRhcmdldCAgICAgICA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgTWluVmFsdWUgICAgID0gbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBNYXhWYWx1ZSAgICAgPSBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIFZhbHVlcyAgICAgICA9IFtNaW5WYWx1ZSwgTWF4VmFsdWVdLFxyXG4gICAgICAgICAgICAgICAgICAgIE1pbk1heFZpc2lvbiA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFNjYWxlU3RlcCAgICA9IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIFN0ZXBMZW5ndGggICA9IDEsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICAvL1xyXG4gICAgICAgIHRoaXMuX1RhcmdldCAgICAgICAgPSByYW5nZXNsaWRlci5fY3JlYXRlRE9NKFRhcmdldCwgVmFsdWVzWzBdLCBWYWx1ZXNbMV0sIE1pblZhbHVlLCBNYXhWYWx1ZSwgU2NhbGVTdGVwKTtcclxuXHJcbiAgICAgICAgdGhpcy5fTWluVmFsdWUgICAgICA9IE1pblZhbHVlO1xyXG4gICAgICAgIHRoaXMuX01heFZhbHVlICAgICAgPSBNYXhWYWx1ZTtcclxuICAgICAgICB0aGlzLl9WYWx1ZXMgICAgICAgID0gVmFsdWVzO1xyXG4gICAgICAgIHRoaXMuX01pbk1heFZpc2lvbiAgPSBNaW5NYXhWaXNpb247XHJcbiAgICAgICAgdGhpcy5fU2NhbGVTdGVwICAgICA9IFNjYWxlU3RlcDtcclxuICAgICAgICB0aGlzLl9TdGVwTGVuZ3RoICAgID0gU3RlcExlbmd0aDtcclxuICAgICAgICB0aGlzLl9TZWxlY3RvcnMgICAgID0ge1xyXG4gICAgICAgICAgICBzbGlkZXIgICAgICAgICAgICAgICAgICA6IHRoaXMuVGFyZ2V0LFxyXG4gICAgICAgICAgICBzcGFjZUxlZnQgICAgICAgICAgICAgICA6IHRoaXMuVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5zcGFjZS1sZWZ0JyksXHJcbiAgICAgICAgICAgIG1pbkJ1dHRvbiAgICAgICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvcignLm1pbl9fYnV0dG9uJyksXHJcbiAgICAgICAgICAgIHJhbmdlTGluZSAgICAgICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvcignLkpTUlNyYW5nZS1saW5lJyksXHJcbiAgICAgICAgICAgIG1heEJ1dHRvbiAgICAgICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvcignLm1heF9fYnV0dG9uJyksXHJcbiAgICAgICAgICAgIHNwYWNlUmlnaHQgICAgICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvcignLnNwYWNlLXJpZ2h0JyksXHJcbiAgICAgICAgICAgIHJhbmdlVmFsdWVMZWZ0ICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvcignLnJhbmdlX192YWx1ZV9sZWZ0JyksXHJcbiAgICAgICAgICAgIHJhbmdlVmFsdWVSaWdodCAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvcignLnJhbmdlX192YWx1ZV9yaWdodCcpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbkxlZnRHbG93ICAgICAgICA6ICh0aGlzLlZhbHVlc1swXSAtIHRoaXMuTWluVmFsdWUpIC8gKHRoaXMuTWF4VmFsdWUgLXRoaXMuIE1pblZhbHVlKSxcclxuICAgICAgICAgICAgcG9zaXRpb25SaWdodEdsb3cgICAgICAgOiAodGhpcy5NYXhWYWx1ZSAtIHRoaXMuVmFsdWVzWzFdKSAvICh0aGlzLk1heFZhbHVlIC0gdGhpcy5NaW5WYWx1ZSksXHJcbiAgICAgICAgICAgIE1pblZhbHVlU2VsZWN0ICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvcignLm1pbi12YWx1ZScpLFxyXG4gICAgICAgICAgICBNYXhWYWx1ZVNlbGVjdCAgICAgICAgICA6IHRoaXMuVGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5tYXgtdmFsdWUnKSxcclxuICAgICAgICAgICAgc2NhbGUgICAgICAgICAgICAgICAgICAgOiB0aGlzLlRhcmdldC5xdWVyeVNlbGVjdG9yKCcuSlNSU3NjYWxlJyksXHJcbiAgICAgICAgICAgIHNjYWxlU3BhbiAgICAgICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvckFsbCgnLkpTUlNzY2FsZSBzcGFuJyksXHJcbiAgICAgICAgICAgIHNjYWxlU3BhblAgICAgICAgICAgICAgIDogdGhpcy5UYXJnZXQucXVlcnlTZWxlY3RvckFsbCgnLkpTUlNzY2FsZSBzcGFuIHAnKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zaXRpb24gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBtaW5CdXR0b25Db29yZCA9IHRoaXMuX1NlbGVjdG9ycy5zcGFjZUxlZnQub2Zmc2V0V2lkdGggLSB0aGlzLl9TZWxlY3RvcnMubWluQnV0dG9uLm9mZnNldFdpZHRoLzI7XHJcbiAgICAgICAgICAgIGxldCBtYXhCdXR0b25Db29yZCA9IHRoaXMuX1NlbGVjdG9ycy5zcGFjZVJpZ2h0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggLSB0aGlzLl9TZWxlY3RvcnMuc2xpZGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggLSB0aGlzLl9TZWxlY3RvcnMubWluQnV0dG9uLm9mZnNldFdpZHRoLzI7XHJcbiAgICAgICAgICAgIGxldCBjb29yZCA9IGV2ZW50LnBhZ2VYIC0gdGhpcy5fU2VsZWN0b3JzLnNsaWRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54O1xyXG4gICAgICAgICAgICBsZXQgY2VudGVyID0gKG1heEJ1dHRvbkNvb3JkICsgbWluQnV0dG9uQ29vcmQpIC8gMiA7XHJcbiAgICAgICAgICAgIGlmIChjb29yZCA8IGNlbnRlcikge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZUxlZnRTbGlkZXIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW92ZVJpZ2h0U2xpZGVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyB0aGlzLl92YWxpZGF0aW9uQ29ycmVjdERhdGEoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRpb25Db3JyZWN0RGF0YSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuTWluVmFsdWUgPT09IHRoaXMuTWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihFcnJvcignTWluVmFsdWUgY2FuIG5vdCBiZSBlcXVhbCB0aGFuIE1heFZhbHVlJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLk1pblZhbHVlID4gdGhpcy5NYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgW3RoaXMuTWluVmFsdWUsIHRoaXMuTWF4VmFsdWVdID0gW3RoaXMuTWF4VmFsdWUsIHRoaXMuTWluVmFsdWVdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKEVycm9yKCdNaW5WYWx1ZSBjYW4gbm90IGJlIGdyZWF0ZXIgdGhhbiBNYXhWYWx1ZScpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5WYWx1ZXNbMF0gPCB0aGlzLk1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlZhbHVlc1swXSA9IHRoaXMuTWluVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1RoZSB2YWx1ZVswXSBjYW4gbm90IGJlIGxlc3MgdGhhbiB0aGUgTWluVmFsdWUgYW5kIGFib3ZlIHRoZSBNYXhWYWx1ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLlZhbHVlc1sxXSA+IHRoaXMuTWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuVmFsdWVzWzFdID0gdGhpcy5NYXhWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIHZhbHVlWzFdIGNhbiBub3QgYmUgbGVzcyB0aGFuIHRoZSBNaW5WYWx1ZSBhbmQgYWJvdmUgdGhlIE1heFZhbHVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuVmFsdWVzWzFdIDwgdGhpcy5NaW5WYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5WYWx1ZXNbMV0gPSB0aGlzLlZhbHVlc1swXTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignVGhlIHZhbHVlWzFdIGNhbiBub3QgYmUgbGVzcyB0aGFuIHRoZSBNaW5WYWx1ZSBhbmQgYWJvdmUgdGhlIE1heFZhbHVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuVmFsdWVzWzBdID4gdGhpcy5WYWx1ZXNbMV0gKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlZhbHVlc1swXSA9IHRoaXMuVmFsdWVzWzFdO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdWYWx1ZVswXSBjYW4gbm90IGJlIGdyZWF0ZXIgdGhhbiBWYWx1ZVsxXScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY291bnRGbGV4R2xvdygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fcmVjb3VudEZsZXhHbG93ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuc3BhY2VMZWZ0LnN0eWxlLmZsZXhHcm93ICA9ICh0aGlzLlZhbHVlc1swXSAtIHRoaXMuTWluVmFsdWUpIC8gKHRoaXMuTWF4VmFsdWUgLXRoaXMuTWluVmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuc3BhY2VSaWdodC5zdHlsZS5mbGV4R3JvdyA9ICh0aGlzLk1heFZhbHVlIC0gdGhpcy5WYWx1ZXNbMV0pIC8gKHRoaXMuTWF4VmFsdWUgLSB0aGlzLk1pblZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnJhbmdlTGluZS5zdHlsZS5mbGV4R3JvdyAgPSAxLSB0aGlzLl9TZWxlY3RvcnMuc3BhY2VMZWZ0LnN0eWxlLmZsZXhHcm93IC0gdGhpcy5fU2VsZWN0b3JzLnNwYWNlUmlnaHQuc3R5bGUuZmxleEdyb3c7XHJcbiAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5yYW5nZVZhbHVlTGVmdC5pbm5lckhUTUwgID0gdGhpcy5WYWx1ZXNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5yYW5nZVZhbHVlUmlnaHQuaW5uZXJIVE1MID0gdGhpcy5WYWx1ZXNbMV07XHJcbiAgICAgICAgICAgIHRoaXMuX2luc3RhbGxSYW5nZVZhbHVlSFRNTCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5faW5zdGFsbFJhbmdlVmFsdWVIVE1MID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZUxlZnQuaW5uZXJIVE1MICA9IHRoaXMuVmFsdWVzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZVJpZ2h0LmlubmVySFRNTCA9IE1hdGgucm91bmQoKDEgLSB0aGlzLl9TZWxlY3RvcnMuc3BhY2VSaWdodC5zdHlsZS5mbGV4R3JvdyApICogKHRoaXMuTWF4VmFsdWUgLSB0aGlzLk1pblZhbHVlKSkgKyB0aGlzLk1pblZhbHVlO1xyXG4gICAgICAgICAgICBsZXQgbGVmdCAgPSB0aGlzLl9TZWxlY3RvcnMuc3BhY2VMZWZ0LnN0eWxlLmZsZXhHcm93ICAqICh0aGlzLk1heFZhbHVlIC0gdGhpcy5NaW5WYWx1ZSkgKyB0aGlzLk1pblZhbHVlIDtcclxuICAgICAgICAgICAgbGV0IHJpZ2h0ID0gKDEgLSB0aGlzLl9TZWxlY3RvcnMuc3BhY2VSaWdodC5zdHlsZS5mbGV4R3JvdyApICogKHRoaXMuTWF4VmFsdWUgLSB0aGlzLk1pblZhbHVlKSArIHRoaXMuTWluVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5tYXhCdXR0b24uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgkey10aGlzLl9TZWxlY3RvcnMubWF4QnV0dG9uLm9mZnNldFdpZHRoLzJ9cHgsMHB4KWA7XHJcbiAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5taW5CdXR0b24uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMuX1NlbGVjdG9ycy5tYXhCdXR0b24ub2Zmc2V0V2lkdGgvMn1weCwwcHgpYDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuU3RlcExlbmd0aCAlIDEgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLlN0ZXBMZW5ndGggJSAxMDAwID09PSAwICYmIFN0cmluZyh0aGlzLk1heFZhbHVlKS5sZW5ndGggPiA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdCAgPSBNYXRoLnJvdW5kKGxlZnQgIC8gMTAwMCkgKiAxMDAwIDtcclxuICAgICAgICAgICAgICAgICAgICByaWdodCA9IE1hdGgucm91bmQocmlnaHQgLyAxMDAwKSAqIDEwMDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZWZ0ICA9IE1hdGgucm91bmQobGVmdCk7XHJcbiAgICAgICAgICAgICAgICByaWdodCA9IE1hdGgucm91bmQocmlnaHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGVmdCAgPSBsZWZ0LnRvRml4ZWQoU3RyaW5nKHRoaXMuU3RlcExlbmd0aCkuc3BsaXQoJy4nKVsxXS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSByaWdodC50b0ZpeGVkKFN0cmluZyh0aGlzLlN0ZXBMZW5ndGgpLnNwbGl0KCcuJylbMV0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5NYXhWYWx1ZSA+IDk5OTk5ICkge1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IHRoaXMuX3JvdW5kZXJFeHAobGVmdCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgcmlnaHQgPSB0aGlzLl9yb3VuZGVyRXhwKHJpZ2h0LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fVmFsdWVzID0gW2xlZnQsIHJpZ2h0XTtcclxuICAgICAgICAgICAgbGV0IGRpc3RhbnNlID0gdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVSaWdodC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54IC0gdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggLSB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZUxlZnQub2Zmc2V0V2lkdGggO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRpc3RhbnNlKTtcclxuICAgICAgICAgICAgaWYgKGRpc3RhbnNlIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5yYW5nZVZhbHVlUmlnaHQuc3R5bGUuYm9yZGVyID0gJzBweCc7XHJcbiAgICAgICAgICAgICAgICBpZiAobGVmdCA9PT0gcmlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZUxlZnQuaW5uZXJIVE1MID0gdGhpcy5fcmFua051bWJlcihsZWZ0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0LmlubmVySFRNTCA9IHRoaXMuX3JhbmtOdW1iZXIobGVmdCkgKyAnLScgKyB0aGlzLl9yYW5rTnVtYmVyKHJpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5yYW5nZVZhbHVlUmlnaHQuaW5uZXJIVE1MID0gJyc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZVJpZ2h0LnN0eWxlLmJvcmRlciA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0LmlubmVySFRNTCAgPSB0aGlzLl9yYW5rTnVtYmVyKGxlZnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVSaWdodC5pbm5lckhUTUwgPSB0aGlzLl9yYW5rTnVtYmVyKHJpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcGFkZGluZyA9IHRoaXMuX1NlbGVjdG9ycy5taW5CdXR0b24ub2Zmc2V0V2lkdGgvMiArIDI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbk1heFZpc2liaWxpdHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5NaW5WYWx1ZVNlbGVjdC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5NYXhWYWx1ZVNlbGVjdC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fU2VsZWN0b3JzLnNwYWNlTGVmdC5vZmZzZXRXaWR0aCA8IHRoaXMuX1NlbGVjdG9ycy5NaW5WYWx1ZVNlbGVjdC5vZmZzZXRXaWR0aCArIHBhZGRpbmcpIHsgLy8gaGlkZGVuIE1pblZhbHVlIGxlZnRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuTWluVmFsdWVTZWxlY3Quc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuTWluVmFsdWVTZWxlY3Quc3R5bGUuY29sb3IgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX1NlbGVjdG9ycy5zcGFjZVJpZ2h0Lm9mZnNldFdpZHRoIDwgdGhpcy5fU2VsZWN0b3JzLk1heFZhbHVlU2VsZWN0Lm9mZnNldFdpZHRoICsgcGFkZGluZykgeyAvLyBoaWRkZW4gTWF4VmFsdWUgcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuTWF4VmFsdWVTZWxlY3Quc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuTWF4VmFsdWVTZWxlY3Quc3R5bGUuY29sb3IgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLk1pblZhbHVlU2VsZWN0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuTWF4VmFsdWVTZWxlY3Quc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuTWluVmFsdWVTZWxlY3QuaW5uZXJIVE1MICA9IHRoaXMuX3JhbmtOdW1iZXIodGhpcy5NaW5WYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5NYXhWYWx1ZVNlbGVjdC5pbm5lckhUTUwgID0gdGhpcy5fcmFua051bWJlcih0aGlzLk1heFZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX1NlbGVjdG9ycy5taW5CdXR0b24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCAtIHRoaXMuX1NlbGVjdG9ycy5zbGlkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCAvLyBWYWx1ZVswXWNhbiBub3QgYmUgdG8gdGhlIGxlZnQgb2YgdGhlIHNsaWRlclxyXG4gICAgICAgICAgICAgICAgLSAodGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0Lm9mZnNldFdpZHRoIC8gMiApICsgdGhpcy5fU2VsZWN0b3JzLm1pbkJ1dHRvbi5vZmZzZXRXaWR0aCA8IDAgKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5yYW5nZVZhbHVlTGVmdC5zdHlsZS5sZWZ0ID0gdGhpcy5fU2VsZWN0b3JzLnNsaWRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54XHJcbiAgICAgICAgICAgICAgICAgICAgLSB0aGlzLl9TZWxlY3RvcnMubWluQnV0dG9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggKyAodGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0Lm9mZnNldFdpZHRoIC8gMikgIC0gdGhpcy5fU2VsZWN0b3JzLm1pbkJ1dHRvbi5vZmZzZXRXaWR0aCArICdweCcgO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0LnN0eWxlLmxlZnQgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fU2VsZWN0b3JzLm1pbkJ1dHRvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54IC0gdGhpcy5fU2VsZWN0b3JzLnNsaWRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54XHJcbiAgICAgICAgICAgICAgICArIHRoaXMuX1NlbGVjdG9ycy5taW5CdXR0b24ub2Zmc2V0V2lkdGggKyB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZUxlZnQub2Zmc2V0V2lkdGggLyAyICsgdGhpcy5fU2VsZWN0b3JzLm1pbkJ1dHRvbi5vZmZzZXRXaWR0aCAtIHRoaXMuX1NlbGVjdG9ycy5zbGlkZXIub2Zmc2V0V2lkdGggPiAwKXsgLy8gVmFsdWVbMF0gY2FuIG5vdCBiZSB0byB0aGUgcmlnaHQgb2YgdGhlIHNsaWRlclxyXG4gICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0LnN0eWxlLnJpZ2h0ID0gdGhpcy5fU2VsZWN0b3JzLm1pbkJ1dHRvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54IC0gdGhpcy5fU2VsZWN0b3JzLnNsaWRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS54XHJcbiAgICAgICAgICAgICAgICAgICAgKyB0aGlzLl9TZWxlY3RvcnMubWluQnV0dG9uLm9mZnNldFdpZHRoICsgdGhpcy5fU2VsZWN0b3JzLnJhbmdlVmFsdWVMZWZ0Lm9mZnNldFdpZHRoLzIgLSB0aGlzLl9TZWxlY3RvcnMuc2xpZGVyLm9mZnNldFdpZHRoIC0gdGhpcy5fU2VsZWN0b3JzLm1pbkJ1dHRvbi5vZmZzZXRXaWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZUxlZnQuc3R5bGUucmlnaHQgPSAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuX1NlbGVjdG9ycy5yYW5nZVZhbHVlTGVmdC5zdHlsZS5sZWZ0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX1NlbGVjdG9ycy5tYXhCdXR0b24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCAtIHRoaXMuX1NlbGVjdG9ycy5zbGlkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueCAvLyBWYWx1ZVsxXSBjYW4gbm90IGJlIHRvIHRoZSByaWdodCBvZiB0aGUgc2xpZGVyXHJcbiAgICAgICAgICAgICAgICArIHRoaXMuX1NlbGVjdG9ycy5tYXhCdXR0b24ub2Zmc2V0V2lkdGggKyB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZVJpZ2h0Lm9mZnNldFdpZHRoLzIgKyB0aGlzLl9TZWxlY3RvcnMubWluQnV0dG9uLm9mZnNldFdpZHRoPiB0aGlzLl9TZWxlY3RvcnMuc2xpZGVyLm9mZnNldFdpZHRoKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5yYW5nZVZhbHVlUmlnaHQuc3R5bGUucmlnaHQgPSB0aGlzLl9TZWxlY3RvcnMubWF4QnV0dG9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnggLSB0aGlzLl9TZWxlY3RvcnMuc2xpZGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnhcclxuICAgICAgICAgICAgICAgICAgICArIHRoaXMuX1NlbGVjdG9ycy5tYXhCdXR0b24ub2Zmc2V0V2lkdGggKyB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZVJpZ2h0Lm9mZnNldFdpZHRoLzIgLSB0aGlzLl9TZWxlY3RvcnMuc2xpZGVyLm9mZnNldFdpZHRoIC0gdGhpcy5fU2VsZWN0b3JzLm1pbkJ1dHRvbi5vZmZzZXRXaWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMucmFuZ2VWYWx1ZVJpZ2h0LnN0eWxlLnJpZ2h0ID0gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZGltZW5zaW9uU2NhbGUodGhpcy5TY2FsZVN0ZXApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fcm91bmRpbmdUb0ZpdmUgPSAodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCByZXp1bHQgPSB2YWwgJSA1O1xyXG4gICAgICAgICAgICByZXp1bHQgJiYgKHZhbCA9IHZhbCAtIHJlenVsdCArIDUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fcmFua051bWJlciA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoZSkucmVwbGFjZSgvKFxcZCkoPz0oXFxkXFxkXFxkKSsoW15cXGRdfCQpKS9nLCAnJDEgJylcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3JvdW5kZXJFeHAgPSAodmFsLCBpc0VxdWFsRml2ZSA9IHRydWUsIGNvZWZmaWNpZW50ID0gMSkgPT4ge1xyXG4gICAgICAgICAgICAvL251bSA9IE0gKiBNYXRoLnBvdygxMCwgUClcclxuICAgICAgICAgICAgbGV0IGxlbmd0aFZhbCA9IFN0cmluZyh0aGlzLk1heFZhbHVlKS5sZW5ndGggLSAzIC0gY29lZmZpY2llbnQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLk1heFZhbHVlIDwgMjApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzRXF1YWxGaXZlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCggdGhpcy5fcm91bmRpbmdUb0ZpdmUodmFsIC8gIE1hdGgucG93KDEwLCBsZW5ndGhWYWwpKSkgKiAgTWF0aC5wb3coMTAsIGxlbmd0aFZhbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCggdmFsIC8gIE1hdGgucG93KDEwLCBsZW5ndGhWYWwpICkgKiAgTWF0aC5wb3coMTAsIGxlbmd0aFZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2Zyb21WYWx1ZXNUb0ZsZXggPSAoZSkgPT4gKGUgLSB0aGlzLk1pblZhbHVlKSAvICh0aGlzLk1heFZhbHVlIC0gdGhpcy5NaW5WYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fY3VycmVudFJvdW5kc3RlcCA9ICh2YWwpID0+IHtcclxuICAgICAgICAgICAgdmFsID0gdmFsIC90aGF0LlN0ZXBMZW5ndGg7XHJcbiAgICAgICAgICAgIC8vbGV0IGN1cnJlbnRWYWx1ZUxlZnQgPSBNYXRoLnJvdW5kKHZhbCAvIHRoYXQuX1NlbGVjdG9ycy5zbGlkZXIub2Zmc2V0V2lkdGggKiAodGhhdC5NYXhWYWx1ZSAtIHRoYXQuTWluVmFsdWUpKSArIHRoYXQuTWluVmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50VmFsdWVMZWZ0ID0gTWF0aC5yb3VuZCh2YWwgLyB0aGF0Ll9TZWxlY3RvcnMuc2xpZGVyLm9mZnNldFdpZHRoICogKHRoYXQuTWF4VmFsdWUgLSB0aGF0Lk1pblZhbHVlKSkgKiB0aGF0LlN0ZXBMZW5ndGggKyB0aGF0Lk1pblZhbHVlO1xyXG4gICAgICAgICAgICByZXR1cm4gKGN1cnJlbnRWYWx1ZUxlZnQgLSB0aGlzLk1pblZhbHVlKSAvICh0aGlzLk1heFZhbHVlIC0gdGhpcy5NaW5WYWx1ZSlcclxuICAgICAgICB9O1xyXG4gICAgICAgIGZ1bmN0aW9uIG1vdmVMZWZ0U2xpZGVyKCkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBsZXQgY29vcmQgPSBldmVudC5wYWdlWCAtIHRoYXQuX1NlbGVjdG9ycy5zbGlkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueDtcclxuICAgICAgICAgICAgaWYgKFN0ZXBMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX1NlbGVjdG9ycy5zcGFjZUxlZnQuc3R5bGUuZmxleEdyb3cgPSB0aGF0Ll9jdXJyZW50Um91bmRzdGVwKGNvb3JkKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX1NlbGVjdG9ycy5zcGFjZUxlZnQuc3R5bGUuZmxleEdyb3cgPSBjb29yZCAvIHRoYXQuX1NlbGVjdG9ycy5zbGlkZXIub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IExlZnRHcm93ICA9IHBhcnNlRmxvYXQodGhhdC5fU2VsZWN0b3JzLnNwYWNlTGVmdC5zdHlsZS5mbGV4R3Jvdyk7XHJcbiAgICAgICAgICAgIGxldCBSaWdodEdyb3cgPSBwYXJzZUZsb2F0KHRoYXQuX1NlbGVjdG9ycy5zcGFjZVJpZ2h0LnN0eWxlLmZsZXhHcm93KTtcclxuICAgICAgICAgICAgaWYgIChjb29yZCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0Ll9TZWxlY3RvcnMuc3BhY2VMZWZ0LnN0eWxlLmZsZXhHcm93ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoTGVmdEdyb3cgKyBSaWdodEdyb3cgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0Ll9TZWxlY3RvcnMucmFuZ2VMaW5lLnN0eWxlLmZsZXhHcm93ID0gMSAtIExlZnRHcm93IC0gUmlnaHRHcm93O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5fU2VsZWN0b3JzLnJhbmdlTGluZS5zdHlsZS5mbGV4R3JvdyA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGF0Ll9TZWxlY3RvcnMuc3BhY2VMZWZ0LnN0eWxlLmZsZXhHcm93ID0gMS0gUmlnaHRHcm93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoYXQuX2luc3RhbGxSYW5nZVZhbHVlSFRNTCgpO1xyXG4gICAgICAgICAgICAvLyB0aGF0LlZhbHVlc1swXSA9IExlZnRHcm93ICogdGhhdC5NYXhWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbW92ZVJpZ2h0U2xpZGVyKCkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBsZXQgY29vcmQgPSBldmVudC5wYWdlWCAtIHRoYXQuX1NlbGVjdG9ycy5zbGlkZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkueDtcclxuICAgICAgICAgICAgaWYgKFN0ZXBMZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX1NlbGVjdG9ycy5zcGFjZVJpZ2h0LnN0eWxlLmZsZXhHcm93ID0gMSAtIHRoYXQuX2N1cnJlbnRSb3VuZHN0ZXAoY29vcmQpIDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX1NlbGVjdG9ycy5zcGFjZVJpZ2h0LnN0eWxlLmZsZXhHcm93ID0gMSAtIGNvb3JkIC8gdGhhdC5fU2VsZWN0b3JzLnNsaWRlci5vZmZzZXRXaWR0aFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBMZWZ0R3JvdyAgPSBwYXJzZUZsb2F0KHRoYXQuX1NlbGVjdG9ycy5zcGFjZUxlZnQuc3R5bGUuZmxleEdyb3cpO1xyXG4gICAgICAgICAgICBsZXQgUmlnaHRHcm93ID0gcGFyc2VGbG9hdCh0aGF0Ll9TZWxlY3RvcnMuc3BhY2VSaWdodC5zdHlsZS5mbGV4R3Jvdyk7XHJcbiAgICAgICAgICAgIGlmICAoY29vcmQgPj0gdGhhdC5fU2VsZWN0b3JzLnNsaWRlci5vZmZzZXRXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5fU2VsZWN0b3JzLnNwYWNlUmlnaHQuc3R5bGUuZmxleEdyb3cgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgxIC0gTGVmdEdyb3cgLSBSaWdodEdyb3cgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0Ll9TZWxlY3RvcnMucmFuZ2VMaW5lLnN0eWxlLmZsZXhHcm93ID0gMSAtIExlZnRHcm93IC0gUmlnaHRHcm93O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhhdC5fU2VsZWN0b3JzLnJhbmdlTGluZS5zdHlsZS5mbGV4R3JvdyA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGF0Ll9TZWxlY3RvcnMuc3BhY2VSaWdodC5zdHlsZS5mbGV4R3JvdyA9IDEgLSBMZWZ0R3JvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGF0Ll9pbnN0YWxsUmFuZ2VWYWx1ZUhUTUwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2dldFNwYW5FbGVtZW50V2lkdGggPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzcGFuICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc3BhbicpO1xyXG4gICAgICAgICAgICBsZXQgcCAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICAgICAgcC5pbm5lckhUTUwgPSB0aGlzLk1heFZhbHVlO1xyXG4gICAgICAgICAgICBzcGFuLmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuc2NhbGUuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHAub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgIHNwYW4ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB3aWR0aFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGltZW5zaW9uU2NhbGUgPSAoc3RlcCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuc2NhbGVTcGFuID0gdGhpcy5fU2VsZWN0b3JzLnNsaWRlci5xdWVyeVNlbGVjdG9yKCcuSlNSU3NjYWxlIHNwYW4nKTtcclxuICAgICAgICAgICAgbGV0IGNsb25lID0gdGhpcy5fU2VsZWN0b3JzLnNjYWxlLmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5zY2FsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnNjYWxlID0gY2xvbmU7XHJcbiAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5zbGlkZXIuYXBwZW5kQ2hpbGQoY2xvbmUpO1xyXG4gICAgICAgICAgICBpZiAoc3RlcCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1heFN0ZXAgPSBNYXRoLmZsb29yKHRoaXMuX1NlbGVjdG9ycy5zbGlkZXIub2Zmc2V0V2lkdGggLyAodGhpcy5fZ2V0U3BhbkVsZW1lbnRXaWR0aCgpICkpIC0gMjtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U3VtID0gdGhpcy5NaW5WYWx1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBjb3VudGVyID0gc3RlcDtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChNaW5WYWx1ZSArIGNvdW50ZXIgPCBNYXhWYWx1ZSApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50U3VtICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNwYW4gICAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgICAgICAgICAgICAgICAgICBwLmlubmVySFRNTCA9IGN1cnJlbnRTdW07XHJcbiAgICAgICAgICAgICAgICAgICAgc3Bhbi5zdHlsZS5sZWZ0ID0gKHRoaXMuX1NlbGVjdG9ycy5zbGlkZXIub2Zmc2V0V2lkdGggKiBjb3VudGVyIC8gKHRoaXMuTWF4VmFsdWUgLSB0aGlzLk1pblZhbHVlKSkgICsgJ3B4JztcclxuICAgICAgICAgICAgICAgICAgICBzcGFuLmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5zY2FsZS5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudGVyICs9IHN0ZXA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9TZWxlY3RvcnMuc2NhbGVTcGFuID0gdGhpcy5fU2VsZWN0b3JzLnNsaWRlci5xdWVyeVNlbGVjdG9yQWxsKCcuSlNSU3NjYWxlIHNwYW4nKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX1NlbGVjdG9ycy5zY2FsZVNwYW5QID0gdGhpcy5fU2VsZWN0b3JzLnNsaWRlci5xdWVyeVNlbGVjdG9yQWxsKCcuSlNSU3NjYWxlIHNwYW4gcCcpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvZWZmaWNpZW50ID0gTWF0aC5mbG9vcih0aGlzLl9TZWxlY3RvcnMuc2NhbGVTcGFuLmxlbmd0aCAvIG1heFN0ZXApO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX1NlbGVjdG9ycy5zbGlkZXIub2Zmc2V0V2lkdGggPCB0aGlzLl9TZWxlY3RvcnMuc2NhbGVTcGFuUFt0aGlzLl9TZWxlY3RvcnMuc2NhbGVTcGFuUC5sZW5ndGgtMV0ub2Zmc2V0V2lkdGggKiB0aGlzLl9TZWxlY3RvcnMuc2NhbGVTcGFuUC5sZW5ndGggKiAxLjUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9TZWxlY3RvcnMuc2NhbGVTcGFuLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSAlIChjb2VmZmljaWVudCArIDEpID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnNjYWxlU3BhbltpXS5xdWVyeVNlbGVjdG9yKCdwJykuc3R5bGUuZGlzcGxheSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnNjYWxlU3BhbltpXS5xdWVyeVNlbGVjdG9yKCdwJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXhTdGVwID0gTWF0aC5mbG9vcih0aGlzLl9TZWxlY3RvcnMuc2xpZGVyLm9mZnNldFdpZHRoIC8gKHRoaXMuX2dldFNwYW5FbGVtZW50V2lkdGgoKSAqIDIpKSAtIDI7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4U3RlcCAgPiAxNSApIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXhTdGVwID0gMTU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobWF4U3RlcCAgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RlcCA9IHRoaXMuX3JvdW5kZXJFeHAoKHRoaXMuTWF4VmFsdWUgLSB0aGlzLk1pblZhbHVlKSAvIG1heFN0ZXAgLCB0cnVlLCAwKTtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U3VtID0gdGhpcy5NaW5WYWx1ZTtcclxuICAgICAgICAgICAgICAgIGxldCBjb3VudGVyID0gc3RlcDtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLk1pblZhbHVlICsgY291bnRlciAgPCB0aGlzLk1heFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN1bSArPSBzdGVwO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYW4uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcC5pbm5lckhUTUwgPSBNYXRoLnJvdW5kKHRoaXMuX3JvdW5kZXJFeHAoY3VycmVudFN1bSwgdHJ1ZSwgMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwLmlubmVySFRNTCA+PSB0aGlzLk1heFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzcGFuLnN0eWxlLmxlZnQgPSB0aGlzLl9TZWxlY3RvcnMuc2xpZGVyLm9mZnNldFdpZHRoICogdGhpcy5fZnJvbVZhbHVlc1RvRmxleChwLmlubmVySFRNTCkgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYW4uYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fU2VsZWN0b3JzLnNjYWxlLmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gc3RlcDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZGltZW5zaW9uU2NhbGUodGhpcy5TY2FsZVN0ZXApO1xyXG4gICAgICAgIHRoaXMuX2RlYm91bmNlID0gKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdGltZW91dDtcclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGF0Ll9TZWxlY3RvcnMuc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicgLCB0aGlzLl9zdGFydFBvc2l0aW9uKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlUmlnaHRTbGlkZXIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3ZlTGVmdFNsaWRlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX2RlYm91bmNlKCgpID0+IHRoaXMuX2RpbWVuc2lvblNjYWxlKHRoaXMuU2NhbGVTdGVwKSwgMjAwLCBmYWxzZSksIGZhbHNlKTtcclxuICAgICAgICB0aGlzLl92YWxpZGF0aW9uQ29ycmVjdERhdGEoKTtcclxuICAgICAgICB0aGlzLl9yZWNvdW50RmxleEdsb3coKTtcclxuICAgIH1cclxuICAgIGdldCBUYXJnZXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fVGFyZ2V0O1xyXG4gICAgfVxyXG4gICAgc2V0IFRhcmdldCh2KXtcclxuICAgICAgICB0aGlzLl9UYXJnZXQgPSB2O1xyXG4gICAgfVxyXG4gICAgZ2V0IFZhbHVlTGVmdCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9WYWx1ZXNbMF07XHJcbiAgICB9XHJcbiAgICBzZXQgVmFsdWVMZWZ0KHYpe1xyXG4gICAgICAgIHRoaXMuX1ZhbHVlc1swXSA9IHY7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGlvbkNvcnJlY3REYXRhKCk7XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0IFZhbHVlUmlnaHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fVmFsdWVzWzFdO1xyXG4gICAgfVxyXG4gICAgc2V0IFZhbHVlUmlnaHQodil7XHJcbiAgICAgICAgdGhpcy5fVmFsdWVzWzFdID0gdjtcclxuICAgICAgICB0aGlzLl92YWxpZGF0aW9uQ29ycmVjdERhdGEoKTtcclxuICAgIH1cclxuICAgIGdldCBWYWx1ZXMoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fVmFsdWVzO1xyXG4gICAgfVxyXG4gICAgc2V0IFZhbHVlcyhhcnJheSl7XHJcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSB8fCBhcnJheS5sZW5ndGggIT09IDIgKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignT25seSBhY2NlcHRzIGFuIGFycmF5IGFuZCBvbmx5IHR3byB2YWx1ZXMnKTtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhcnJheVswXSA+IGFycmF5WzFdKSB7XHJcbiAgICAgICAgICAgIFthcnJheVswXSwgYXJyYXlbMV1dID0gW2FycmF5WzFdLCBhcnJheVswXV07XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignVmFsdWVbMF0gY2FuIG5vdCBiZSBncmVhdGVyIHRoYW4gVmFsdWVbMV0nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fVmFsdWVzID0gW2FycmF5WzBdLCBhcnJheVsxXV07XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGlvbkNvcnJlY3REYXRhKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgTWluVmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fTWluVmFsdWU7XHJcbiAgICB9XHJcbiAgICBzZXQgTWluVmFsdWUodil7XHJcbiAgICAgICAgdGhpcy5fTWluVmFsdWUgPSB2O1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRpb25Db3JyZWN0RGF0YSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IE1heFZhbHVlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX01heFZhbHVlO1xyXG4gICAgfVxyXG4gICAgc2V0IE1heFZhbHVlKHYpe1xyXG4gICAgICAgIHRoaXMuX01heFZhbHVlID0gdjtcclxuICAgICAgICB0aGlzLl92YWxpZGF0aW9uQ29ycmVjdERhdGEoKTtcclxuXHJcbiAgICB9XHJcbiAgICBnZXQgbWluTWF4VmlzaWJpbGl0eSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9NaW5NYXhWaXNpb247XHJcbiAgICB9XHJcbiAgICBzZXQgbWluTWF4VmlzaWJpbGl0eSh2KXtcclxuICAgICAgICB0aGlzLl9NaW5NYXhWaXNpb24gPSB2O1xyXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRpb25Db3JyZWN0RGF0YSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IFNjYWxlU3RlcCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9TY2FsZVN0ZXA7XHJcbiAgICB9XHJcbiAgICBzZXQgU2NhbGVTdGVwKHYpe1xyXG4gICAgICAgIHRoaXMuX1NjYWxlU3RlcCA9IHY7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGlvbkNvcnJlY3REYXRhKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgU3RlcExlbmd0aCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9TdGVwTGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgc2V0IFN0ZXBMZW5ndGgodil7XHJcbiAgICAgICAgdGhpcy5fU3RlcExlbmd0aCA9IHY7XHJcbiAgICAgICAgdGhpcy5fdmFsaWRhdGlvbkNvcnJlY3REYXRhKCk7XHJcbiAgICB9XHJcbn07Il19
