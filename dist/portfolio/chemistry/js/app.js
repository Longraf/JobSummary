
// 'use strict';
(() => {
    let certificates = document.querySelectorAll('.certificates .certificates__img');
    for(let item of certificates){
        item.addEventListener('click', ()=>{
            item.classList.toggle('scale2');
            item.classList.remove('.cursor-zoom-in')
        })
    }
})();

var slideShow = (function () {
    return function (selector, config) {
        var
            _slider = document.querySelector(selector), // основный элемент блока
            _sliderContainer = _slider.querySelector('.slider__items'), // контейнер для .slider-item
            _sliderItems = _slider.querySelectorAll('.slider__item'), // коллекция .slider-item
            _sliderControls = _slider.querySelectorAll('.slider__control'), // элементы управления
            _currentPosition = 0, // позиция левого активного элемента
            _transformValue = 0, // значение транфсофрмации .slider_wrapper
            _transformStep = 100, // величина шага (для трансформации)
            _itemsArray = [], // массив элементов
            _timerId,
            _indicatorItems,
            _indicatorIndex = 0,
            _indicatorIndexMax = _sliderItems.length - 1,
            _config = {
                isAutoplay: false, // автоматическая смена слайдов
                directionAutoplay: 'next', // направление смены слайдов
                delayAutoplay: 5000, // интервал между автоматической сменой слайдов
                isPauseOnHover: true // устанавливать ли паузу при поднесении курсора к слайдеру
            };

        // настройка конфигурации слайдера в зависимости от полученных ключей
        for (var key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }

        // наполнение массива _itemsArray
        for (var i = 0; i < _sliderItems.length; i++) {
            _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
        }

        // переменная position содержит методы с помощью которой можно получить минимальный и максимальный индекс элемента, а также соответствующему этому индексу позицию
        var position = {
            getItemIndex: function (mode) {
                var index = 0;
                for (var i = 0; i < _itemsArray.length; i++) {
                    if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
                        index = i;
                    }
                }
                return index;
            },
            getItemPosition: function (mode) {
                return _itemsArray[position.getItemIndex(mode)].position;
            }
        };

        // функция, выполняющая смену слайда в указанном направлении
        var _move = function (direction) {
            var nextItem, currentIndicator = _indicatorIndex;;
            if (direction === 'next') {
                _currentPosition++;
                if (_currentPosition > position.getItemPosition('max')) {
                    nextItem = position.getItemIndex('min');
                    _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
                    _itemsArray[nextItem].transform += _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue -= _transformStep;
                _indicatorIndex = _indicatorIndex + 1;
                if (_indicatorIndex > _indicatorIndexMax) {
                    _indicatorIndex = 0;
                }
            } else {
                _currentPosition--;
                if (_currentPosition < position.getItemPosition('min')) {
                    nextItem = position.getItemIndex('max');
                    _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
                    _itemsArray[nextItem].transform -= _itemsArray.length * 100;
                    _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
                }
                _transformValue += _transformStep;
                _indicatorIndex = _indicatorIndex - 1;
                if (_indicatorIndex < 0) {
                    _indicatorIndex = _indicatorIndexMax;
                }
            }
            _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
            _indicatorItems[currentIndicator].classList.remove('active');
            _indicatorItems[_indicatorIndex].classList.add('active');
        };

        // функция, осуществляющая переход к слайду по его порядковому номеру
        var _moveTo = function (index) {
            var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
            while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
                _move(direction);
                i++;
            }
        };

        // функция для запуска автоматической смены слайдов через промежутки времени
        var _startAutoplay = function () {
            if (!_config.isAutoplay) {
                return;
            }
            _stopAutoplay();
            _timerId = setInterval(function () {
                _move(_config.directionAutoplay);
            }, _config.delayAutoplay);
        };

        // функция, отключающая автоматическую смену слайдов
        var _stopAutoplay = function () {
            clearInterval(_timerId);
        };

        // функция, добавляющая индикаторы к слайдеру
        var _addIndicators = function () {
            var indicatorsContainer = document.createElement('ol');
            indicatorsContainer.classList.add('slider__indicators');
            for (var i = 0; i < _sliderItems.length; i++) {
                var sliderIndicatorsItem = document.createElement('li');
                if (i === 0) {
                    sliderIndicatorsItem.classList.add('active');
                }
                sliderIndicatorsItem.setAttribute("data-slide-to", i);
                indicatorsContainer.appendChild(sliderIndicatorsItem);
            }
            _slider.appendChild(indicatorsContainer);
            _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
        };

        // функция, осуществляющая установку обработчиков для событий
        var _setUpListeners = function () {
            _slider.addEventListener('click', function (e) {
                if (e.target.classList.contains('slider__control')) {
                    e.preventDefault();
                    _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
                    _startAutoplay();
                } else if (e.target.getAttribute('data-slide-to')) {
                    e.preventDefault();
                    _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
                    _startAutoplay();
                }
            });
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === "hidden") {
                    _stopAutoplay();
                } else {
                    _startAutoplay();
                }
            }, false);
            if (_config.isPauseOnHover && _config.isAutoplay) {
                _slider.addEventListener('mouseenter', function () {
                    _stopAutoplay();
                });
                _slider.addEventListener('mouseleave', function () {
                    _startAutoplay();
                });
            }
        };

        // добавляем индикаторы к слайдеру
        _addIndicators();
        // установливаем обработчики для событий
        _setUpListeners();
        // запускаем автоматическую смену слайдов, если установлен соответствующий ключ
        _startAutoplay();

        return {
            // метод слайдера для перехода к следующему слайду
            next: function () {
                _move('next');
            },
            // метод слайдера для перехода к предыдущему слайду
            left: function () {
                _move('prev');
            },
            // метод отключающий автоматическую смену слайдов
            stop: function () {
                _config.isAutoplay = false;
                _stopAutoplay();
            },
            // метод запускающий автоматическую смену слайдов
            cycle: function () {
                _config.isAutoplay = true;
                _startAutoplay();
            }
        }
    }
}());

const closeHeader = document.querySelector('.header .close');
const header = document.querySelector('.header');
const minMenu = document.querySelector('.header-hide__minmenu');
const jsHideMenu = document.querySelectorAll('.header .js-hide-menu');
// closeHeader.addEventListener('click', ()=>{
//     header.classList.add('header-hide');
// });
for(let item of jsHideMenu){
    item.addEventListener('click', ()=>{
        header.classList.add('header-hide')
    });

}
minMenu.addEventListener('click', ()=>{
    header.classList.remove('header-hide');
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8vICd1c2Ugc3RyaWN0JztcclxuKCgpID0+IHtcclxuICAgIGxldCBjZXJ0aWZpY2F0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VydGlmaWNhdGVzIC5jZXJ0aWZpY2F0ZXNfX2ltZycpO1xyXG4gICAgZm9yKGxldCBpdGVtIG9mIGNlcnRpZmljYXRlcyl7XHJcbiAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnRvZ2dsZSgnc2NhbGUyJyk7XHJcbiAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnLmN1cnNvci16b29tLWluJylcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXHJcbnZhciBzbGlkZVNob3cgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxlY3RvciwgY29uZmlnKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICAgIF9zbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSwgLy8g0L7RgdC90L7QstC90YvQuSDRjdC70LXQvNC10L3RgiDQsdC70L7QutCwXHJcbiAgICAgICAgICAgIF9zbGlkZXJDb250YWluZXIgPSBfc2xpZGVyLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZXJfX2l0ZW1zJyksIC8vINC60L7QvdGC0LXQudC90LXRgCDQtNC70Y8gLnNsaWRlci1pdGVtXHJcbiAgICAgICAgICAgIF9zbGlkZXJJdGVtcyA9IF9zbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9faXRlbScpLCAvLyDQutC+0LvQu9C10LrRhtC40Y8gLnNsaWRlci1pdGVtXHJcbiAgICAgICAgICAgIF9zbGlkZXJDb250cm9scyA9IF9zbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9fY29udHJvbCcpLCAvLyDRjdC70LXQvNC10L3RgtGLINGD0L/RgNCw0LLQu9C10L3QuNGPXHJcbiAgICAgICAgICAgIF9jdXJyZW50UG9zaXRpb24gPSAwLCAvLyDQv9C+0LfQuNGG0LjRjyDQu9C10LLQvtCz0L4g0LDQutGC0LjQstC90L7Qs9C+INGN0LvQtdC80LXQvdGC0LBcclxuICAgICAgICAgICAgX3RyYW5zZm9ybVZhbHVlID0gMCwgLy8g0LfQvdCw0YfQtdC90LjQtSDRgtGA0LDQvdGE0YHQvtGE0YDQvNCw0YbQuNC4IC5zbGlkZXJfd3JhcHBlclxyXG4gICAgICAgICAgICBfdHJhbnNmb3JtU3RlcCA9IDEwMCwgLy8g0LLQtdC70LjRh9C40L3QsCDRiNCw0LPQsCAo0LTQu9GPINGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4KVxyXG4gICAgICAgICAgICBfaXRlbXNBcnJheSA9IFtdLCAvLyDQvNCw0YHRgdC40LIg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgICAgICAgIF90aW1lcklkLFxyXG4gICAgICAgICAgICBfaW5kaWNhdG9ySXRlbXMsXHJcbiAgICAgICAgICAgIF9pbmRpY2F0b3JJbmRleCA9IDAsXHJcbiAgICAgICAgICAgIF9pbmRpY2F0b3JJbmRleE1heCA9IF9zbGlkZXJJdGVtcy5sZW5ndGggLSAxLFxyXG4gICAgICAgICAgICBfY29uZmlnID0ge1xyXG4gICAgICAgICAgICAgICAgaXNBdXRvcGxheTogZmFsc2UsIC8vINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutCw0Y8g0YHQvNC10L3QsCDRgdC70LDQudC00L7QslxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uQXV0b3BsYXk6ICduZXh0JywgLy8g0L3QsNC/0YDQsNCy0LvQtdC90LjQtSDRgdC80LXQvdGLINGB0LvQsNC50LTQvtCyXHJcbiAgICAgICAgICAgICAgICBkZWxheUF1dG9wbGF5OiA1MDAwLCAvLyDQuNC90YLQtdGA0LLQsNC7INC80LXQttC00YMg0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60L7QuSDRgdC80LXQvdC+0Lkg0YHQu9Cw0LnQtNC+0LJcclxuICAgICAgICAgICAgICAgIGlzUGF1c2VPbkhvdmVyOiB0cnVlIC8vINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDRgtGMINC70Lgg0L/QsNGD0LfRgyDQv9GA0Lgg0L/QvtC00L3QtdGB0LXQvdC40Lgg0LrRg9GA0YHQvtGA0LAg0Log0YHQu9Cw0LnQtNC10YDRg1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDQvdCw0YHRgtGA0L7QudC60LAg0LrQvtC90YTQuNCz0YPRgNCw0YbQuNC4INGB0LvQsNC50LTQtdGA0LAg0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINC/0L7Qu9GD0YfQtdC90L3Ri9GFINC60LvRjtGH0LXQuVxyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBjb25maWcpIHtcclxuICAgICAgICAgICAgaWYgKGtleSBpbiBfY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICBfY29uZmlnW2tleV0gPSBjb25maWdba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L3QsNC/0L7Qu9C90LXQvdC40LUg0LzQsNGB0YHQuNCy0LAgX2l0ZW1zQXJyYXlcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9zbGlkZXJJdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBfaXRlbXNBcnJheS5wdXNoKHsgaXRlbTogX3NsaWRlckl0ZW1zW2ldLCBwb3NpdGlvbjogaSwgdHJhbnNmb3JtOiAwIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/QtdGA0LXQvNC10L3QvdCw0Y8gcG9zaXRpb24g0YHQvtC00LXRgNC20LjRgiDQvNC10YLQvtC00Ysg0YEg0L/QvtC80L7RidGM0Y4g0LrQvtGC0L7RgNC+0Lkg0LzQvtC20L3QviDQv9C+0LvRg9GH0LjRgtGMINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0Lgg0LzQsNC60YHQuNC80LDQu9GM0L3Ri9C5INC40L3QtNC10LrRgSDRjdC70LXQvNC10L3RgtCwLCDQsCDRgtCw0LrQttC1INGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQvNGDINGN0YLQvtC80YMg0LjQvdC00LXQutGB0YMg0L/QvtC30LjRhtC40Y5cclxuICAgICAgICB2YXIgcG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgIGdldEl0ZW1JbmRleDogZnVuY3Rpb24gKG1vZGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9pdGVtc0FycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChfaXRlbXNBcnJheVtpXS5wb3NpdGlvbiA8IF9pdGVtc0FycmF5W2luZGV4XS5wb3NpdGlvbiAmJiBtb2RlID09PSAnbWluJykgfHwgKF9pdGVtc0FycmF5W2ldLnBvc2l0aW9uID4gX2l0ZW1zQXJyYXlbaW5kZXhdLnBvc2l0aW9uICYmIG1vZGUgPT09ICdtYXgnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRJdGVtUG9zaXRpb246IGZ1bmN0aW9uIChtb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2l0ZW1zQXJyYXlbcG9zaXRpb24uZ2V0SXRlbUluZGV4KG1vZGUpXS5wb3NpdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPLCDQstGL0L/QvtC70L3Rj9GO0YnQsNGPINGB0LzQtdC90YMg0YHQu9Cw0LnQtNCwINCyINGD0LrQsNC30LDQvdC90L7QvCDQvdCw0L/RgNCw0LLQu9C10L3QuNC4XHJcbiAgICAgICAgdmFyIF9tb3ZlID0gZnVuY3Rpb24gKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgbmV4dEl0ZW0sIGN1cnJlbnRJbmRpY2F0b3IgPSBfaW5kaWNhdG9ySW5kZXg7O1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcclxuICAgICAgICAgICAgICAgIF9jdXJyZW50UG9zaXRpb24rKztcclxuICAgICAgICAgICAgICAgIGlmIChfY3VycmVudFBvc2l0aW9uID4gcG9zaXRpb24uZ2V0SXRlbVBvc2l0aW9uKCdtYXgnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRJdGVtID0gcG9zaXRpb24uZ2V0SXRlbUluZGV4KCdtaW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBfaXRlbXNBcnJheVtuZXh0SXRlbV0ucG9zaXRpb24gPSBwb3NpdGlvbi5nZXRJdGVtUG9zaXRpb24oJ21heCcpICsgMTtcclxuICAgICAgICAgICAgICAgICAgICBfaXRlbXNBcnJheVtuZXh0SXRlbV0udHJhbnNmb3JtICs9IF9pdGVtc0FycmF5Lmxlbmd0aCAqIDEwMDtcclxuICAgICAgICAgICAgICAgICAgICBfaXRlbXNBcnJheVtuZXh0SXRlbV0uaXRlbS5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgnICsgX2l0ZW1zQXJyYXlbbmV4dEl0ZW1dLnRyYW5zZm9ybSArICclKSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdHJhbnNmb3JtVmFsdWUgLT0gX3RyYW5zZm9ybVN0ZXA7XHJcbiAgICAgICAgICAgICAgICBfaW5kaWNhdG9ySW5kZXggPSBfaW5kaWNhdG9ySW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKF9pbmRpY2F0b3JJbmRleCA+IF9pbmRpY2F0b3JJbmRleE1heCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9pbmRpY2F0b3JJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfY3VycmVudFBvc2l0aW9uLS07XHJcbiAgICAgICAgICAgICAgICBpZiAoX2N1cnJlbnRQb3NpdGlvbiA8IHBvc2l0aW9uLmdldEl0ZW1Qb3NpdGlvbignbWluJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbSA9IHBvc2l0aW9uLmdldEl0ZW1JbmRleCgnbWF4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgX2l0ZW1zQXJyYXlbbmV4dEl0ZW1dLnBvc2l0aW9uID0gcG9zaXRpb24uZ2V0SXRlbVBvc2l0aW9uKCdtaW4nKSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgX2l0ZW1zQXJyYXlbbmV4dEl0ZW1dLnRyYW5zZm9ybSAtPSBfaXRlbXNBcnJheS5sZW5ndGggKiAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgX2l0ZW1zQXJyYXlbbmV4dEl0ZW1dLml0ZW0uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIF9pdGVtc0FycmF5W25leHRJdGVtXS50cmFuc2Zvcm0gKyAnJSknO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX3RyYW5zZm9ybVZhbHVlICs9IF90cmFuc2Zvcm1TdGVwO1xyXG4gICAgICAgICAgICAgICAgX2luZGljYXRvckluZGV4ID0gX2luZGljYXRvckluZGV4IC0gMTtcclxuICAgICAgICAgICAgICAgIGlmIChfaW5kaWNhdG9ySW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2luZGljYXRvckluZGV4ID0gX2luZGljYXRvckluZGV4TWF4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9zbGlkZXJDb250YWluZXIuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVgoJyArIF90cmFuc2Zvcm1WYWx1ZSArICclKSc7XHJcbiAgICAgICAgICAgIF9pbmRpY2F0b3JJdGVtc1tjdXJyZW50SW5kaWNhdG9yXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgX2luZGljYXRvckl0ZW1zW19pbmRpY2F0b3JJbmRleF0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8sINC+0YHRg9GJ0LXRgdGC0LLQu9GP0Y7RidCw0Y8g0L/QtdGA0LXRhdC+0LQg0Log0YHQu9Cw0LnQtNGDINC/0L4g0LXQs9C+INC/0L7RgNGP0LTQutC+0LLQvtC80YMg0L3QvtC80LXRgNGDXHJcbiAgICAgICAgdmFyIF9tb3ZlVG8gPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgdmFyIGkgPSAwLCBkaXJlY3Rpb24gPSAoaW5kZXggPiBfaW5kaWNhdG9ySW5kZXgpID8gJ25leHQnIDogJ3ByZXYnO1xyXG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggIT09IF9pbmRpY2F0b3JJbmRleCAmJiBpIDw9IF9pbmRpY2F0b3JJbmRleE1heCkge1xyXG4gICAgICAgICAgICAgICAgX21vdmUoZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPINC00LvRjyDQt9Cw0L/Rg9GB0LrQsCDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrQvtC5INGB0LzQtdC90Ysg0YHQu9Cw0LnQtNC+0LIg0YfQtdGA0LXQtyDQv9GA0L7QvNC10LbRg9GC0LrQuCDQstGA0LXQvNC10L3QuFxyXG4gICAgICAgIHZhciBfc3RhcnRBdXRvcGxheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFfY29uZmlnLmlzQXV0b3BsYXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfc3RvcEF1dG9wbGF5KCk7XHJcbiAgICAgICAgICAgIF90aW1lcklkID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX21vdmUoX2NvbmZpZy5kaXJlY3Rpb25BdXRvcGxheSk7XHJcbiAgICAgICAgICAgIH0sIF9jb25maWcuZGVsYXlBdXRvcGxheSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8g0YTRg9C90LrRhtC40Y8sINC+0YLQutC70Y7Rh9Cw0Y7RidCw0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60YPRjiDRgdC80LXQvdGDINGB0LvQsNC50LTQvtCyXHJcbiAgICAgICAgdmFyIF9zdG9wQXV0b3BsYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoX3RpbWVySWQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vINGE0YPQvdC60YbQuNGPLCDQtNC+0LHQsNCy0LvRj9GO0YnQsNGPINC40L3QtNC40LrQsNGC0L7RgNGLINC6INGB0LvQsNC50LTQtdGA0YNcclxuICAgICAgICB2YXIgX2FkZEluZGljYXRvcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRpY2F0b3JzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2wnKTtcclxuICAgICAgICAgICAgaW5kaWNhdG9yc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzbGlkZXJfX2luZGljYXRvcnMnKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfc2xpZGVySXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzbGlkZXJJbmRpY2F0b3JzSXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlckluZGljYXRvcnNJdGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2xpZGVySW5kaWNhdG9yc0l0ZW0uc2V0QXR0cmlidXRlKFwiZGF0YS1zbGlkZS10b1wiLCBpKTtcclxuICAgICAgICAgICAgICAgIGluZGljYXRvcnNDb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVySW5kaWNhdG9yc0l0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9zbGlkZXIuYXBwZW5kQ2hpbGQoaW5kaWNhdG9yc0NvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIF9pbmRpY2F0b3JJdGVtcyA9IF9zbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnNsaWRlcl9faW5kaWNhdG9ycyA+IGxpJylcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyDRhNGD0L3QutGG0LjRjywg0L7RgdGD0YnQtdGB0YLQstC70Y/RjtGJ0LDRjyDRg9GB0YLQsNC90L7QstC60YMg0L7QsdGA0LDQsdC+0YLRh9C40LrQvtCyINC00LvRjyDRgdC+0LHRi9GC0LjQuVxyXG4gICAgICAgIHZhciBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF9zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVyX19jb250cm9sJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgX21vdmUoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbGlkZXJfX2NvbnRyb2xfbmV4dCcpID8gJ25leHQnIDogJ3ByZXYnKTtcclxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRBdXRvcGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGUtdG8nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBfbW92ZVRvKHBhcnNlSW50KGUudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZS10bycpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3N0YXJ0QXV0b3BsYXkoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQudmlzaWJpbGl0eVN0YXRlID09PSBcImhpZGRlblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3N0b3BBdXRvcGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfc3RhcnRBdXRvcGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlmIChfY29uZmlnLmlzUGF1c2VPbkhvdmVyICYmIF9jb25maWcuaXNBdXRvcGxheSkge1xyXG4gICAgICAgICAgICAgICAgX3NsaWRlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zdG9wQXV0b3BsYXkoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgX3NsaWRlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9zdGFydEF1dG9wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vINC00L7QsdCw0LLQu9GP0LXQvCDQuNC90LTQuNC60LDRgtC+0YDRiyDQuiDRgdC70LDQudC00LXRgNGDXHJcbiAgICAgICAgX2FkZEluZGljYXRvcnMoKTtcclxuICAgICAgICAvLyDRg9GB0YLQsNC90L7QstC70LjQstCw0LXQvCDQvtCx0YDQsNCx0L7RgtGH0LjQutC4INC00LvRjyDRgdC+0LHRi9GC0LjQuVxyXG4gICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIC8vINC30LDQv9GD0YHQutCw0LXQvCDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrRg9GOINGB0LzQtdC90YMg0YHQu9Cw0LnQtNC+0LIsINC10YHQu9C4INGD0YHRgtCw0L3QvtCy0LvQtdC9INGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQuSDQutC70Y7Rh1xyXG4gICAgICAgIF9zdGFydEF1dG9wbGF5KCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC8vINC80LXRgtC+0LQg0YHQu9Cw0LnQtNC10YDQsCDQtNC70Y8g0L/QtdGA0LXRhdC+0LTQsCDQuiDRgdC70LXQtNGD0Y7RidC10LzRgyDRgdC70LDQudC00YNcclxuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX21vdmUoJ25leHQnKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8g0LzQtdGC0L7QtCDRgdC70LDQudC00LXRgNCwINC00LvRjyDQv9C10YDQtdGF0L7QtNCwINC6INC/0YDQtdC00YvQtNGD0YnQtdC80YMg0YHQu9Cw0LnQtNGDXHJcbiAgICAgICAgICAgIGxlZnQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF9tb3ZlKCdwcmV2Jyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINC80LXRgtC+0LQg0L7RgtC60LvRjtGH0LDRjtGJ0LjQuSDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrRg9GOINGB0LzQtdC90YMg0YHQu9Cw0LnQtNC+0LJcclxuICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX2NvbmZpZy5pc0F1dG9wbGF5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBfc3RvcEF1dG9wbGF5KCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vINC80LXRgtC+0LQg0LfQsNC/0YPRgdC60LDRjtGJ0LjQuSDQsNCy0YLQvtC80LDRgtC40YfQtdGB0LrRg9GOINGB0LzQtdC90YMg0YHQu9Cw0LnQtNC+0LJcclxuICAgICAgICAgICAgY3ljbGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF9jb25maWcuaXNBdXRvcGxheSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBfc3RhcnRBdXRvcGxheSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpO1xyXG5cclxuY29uc3QgY2xvc2VIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyIC5jbG9zZScpO1xyXG5jb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XHJcbmNvbnN0IG1pbk1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyLWhpZGVfX21pbm1lbnUnKTtcclxuY29uc3QganNIaWRlTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5oZWFkZXIgLmpzLWhpZGUtbWVudScpO1xyXG4vLyBjbG9zZUhlYWRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcbi8vICAgICBoZWFkZXIuY2xhc3NMaXN0LmFkZCgnaGVhZGVyLWhpZGUnKTtcclxuLy8gfSk7XHJcbmZvcihsZXQgaXRlbSBvZiBqc0hpZGVNZW51KXtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xyXG4gICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdoZWFkZXItaGlkZScpXHJcbiAgICB9KTtcclxuXHJcbn1cclxubWluTWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XHJcbiAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVhZGVyLWhpZGUnKTtcclxufSk7Il0sImZpbGUiOiJhcHAuanMifQ==
