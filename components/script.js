//////////////////////////////////////////
// Theme Control
let currentTheme = "dark"
const themeButton = document.querySelector(".header__theme-button");

function changeTheme() {
    themeButton.addEventListener("click", function () {
        let page_el = document.querySelector(".page");
        let main_el = document.querySelector(".main");

        page_el.classList.toggle("page_theme-light");
        main_el.classList.toggle("main_theme-light");

        if (currentTheme === "dark") {
            currentTheme = "light";
        } else {
            currentTheme = "dark";
        }
    })
}

changeTheme();


//////////////////////////////////////////
// Background Control
function r(from, to) {
    return ~~(Math.random() * (to - from + 1) + from);
}

function pick() {
    return arguments[r(0, arguments.length - 1)];
}

function getChar() {
    return String.fromCharCode(pick(
        r(0x3041, 0x30ff),
        r(0x2000, 0x206f),
        r(0x0020, 0x003f)
    ));
}

function loop(fn, delay) {
    let stamp = Date.now();

    function _loop() {
        if (Date.now() - stamp >= delay) {
            fn();
            stamp = Date.now();
        }
        requestAnimationFrame(_loop);
    }

    requestAnimationFrame(_loop);
}

class Char {
    constructor() {
        this.element = document.createElement('span');
        this.mutate();
    }

    mutate() {
        this.element.textContent = getChar();
    }
}

class Trail {
    constructor(list = [], options) {
        this.list = list;
        this.options = Object.assign(
            {size: 10, offset: 0}, options
        );
        this.body = [];
        this.move();
    }

    traverse(fn) {
        this.body.forEach((n, i) => {
            let last = (i == this.body.length - 1);
            if (n) fn(n, i, last);
        });
    }

    move() {
        this.body = [];
        let {offset, size} = this.options;
        for (let i = 0; i < size; ++i) {
            let item = this.list[offset + i - size + 1];
            this.body.push(item);
        }
        this.options.offset =
            (offset + 1) % (this.list.length + size - 1);
    }
}

class Rain {
    constructor({target, row}) {
        this.element = document.createElement('p');
        this.build(row);
        if (target) {
            target.appendChild(this.element);
        }
        this.drop();
    }

    build(row = 20) {
        let root = document.createDocumentFragment();
        let chars = [];
        for (let i = 0; i < row; ++i) {
            let c = new Char();
            root.appendChild(c.element);
            chars.push(c);
            if (Math.random() < .5) {
                loop(() => c.mutate(), r(1e3, 5e3));
            }
        }
        this.trail = new Trail(chars, {
            size: r(10, 30), offset: r(0, 100)
        });
        this.element.appendChild(root);
    }

    drop() {
        let trail = this.trail;
        let len = trail.body.length;
        let delay = r(10, 100);
        loop(() => {
            trail.move();
            trail.traverse((c, i, last) => {
                if (currentTheme === "dark") {
                    c.element.style = `color: hsl(136, 100%, ${85 / len * (i + 1)}%)`;
                } else {
                    c.element.style = `color: hsl(136, 100%, ${100 - (85 / len * (i + 1))}%)`;
                }
                if (last) {
                    c.mutate();
                    c.element.style = `
            color: hsl(136, 100%, 85%);
            text-shadow:
              0 0 .5em #fff,
              0 0 .5em currentColor;
          `;
                }
            });
        }, delay);
    }
}

// Event Listeners
let isRainOn = false
const rainButton = document.querySelector(".header__rain-button");

const canvasBackground = document.querySelector('.canvas-background');

function switchRainClick() {
    if (isRainOn === false) {
        if (window.innerWidth >= 800) {
            for (let i = 0; i < 50; ++i) {
                new Rain({target: canvasBackground, row: 50});
            }
            isRainOn = true;
        }
    } else {
        while (canvasBackground.firstChild) {
            canvasBackground.removeChild(canvasBackground.firstChild);
        }
        isRainOn = false;
    }
}

function switchRainResize() {
    if (isRainOn) {
        if (window.innerWidth < 800) {
            while (canvasBackground.firstChild) {
                canvasBackground.removeChild(canvasBackground.firstChild);
            }
        } else {
            for (let i = 0; i < 50; ++i) {
                new Rain({target: canvasBackground, row: 50});
            }
        }
    }
}

rainButton.addEventListener("click", switchRainClick);
window.addEventListener("resize", switchRainResize);


//////////////////////////////////////////
// Contact Control
const contactButton = document.querySelector(".footer__copyright");

const popupContact = document.querySelector(".popup_contact");
const popupContactContainer = popupContact.querySelector(".popup__container")

const popupContactCloseButton = popupContact.querySelector(".popup__close-button");

popupContactContainer.addEventListener("click", function (evt) {
    evt.stopPropagation();
})

contactButton.addEventListener("click", function () {
    popupContact.classList.toggle("popup_opened");
    popupContactContainer.classList.toggle("popup__container_opened")
})

popupContactCloseButton.addEventListener("click", function (evt) {
    popupContact.classList.toggle("popup_opened");
    popupContactContainer.classList.toggle("popup__container_opened")
    evt.stopPropagation();
})

popupContact.addEventListener("click", function() {
    popupContact.classList.toggle("popup_opened");
    popupContactContainer.classList.toggle("popup__container_opened")
})


//////////////////////////////////////////
// Gallery Control
const popupGallery = document.querySelector(".popup_gallery");
const popupGalleryContainer = popupGallery.querySelector(".popup__container");

let currentImageNumber = 0;
const imageArray = ["./images/1.jpg", "./images/2.jpg", "./images/3.jpg"];
const popupImage = document.querySelector(".popup__image");

const galleryButton = document.querySelector(".profile__avatar");
const GalleryCloseButton = popupGallery.querySelector(".popup__close-button");
const GalleryNextButton = document.querySelector(".popup__next-button");
const GalleryPrevButton = document.querySelector(".popup__prev-button");

function changeImage() {
    popupImage.src = imageArray[currentImageNumber];
    GalleryNextButton.classList.remove("popup__next-button_disabled");
    GalleryPrevButton.classList.remove("popup__prev-button_disabled");
    if (currentImageNumber === 0) {
        GalleryPrevButton.classList.add("popup__prev-button_disabled");
    }
    if (currentImageNumber === imageArray.length - 1) {
        GalleryNextButton.classList.add("popup__next-button_disabled");
    }
}
galleryButton.addEventListener("click", function () {
    currentImageNumber = 0;
    changeImage();
    popupGallery.classList.toggle("popup_opened");
    popupGalleryContainer.classList.toggle("popup__container_opened")
})

popupGalleryContainer.addEventListener("click", function(evt) {
    evt.stopPropagation();
})

GalleryCloseButton.addEventListener("click", function (evt) {
    popupGallery.classList.remove("popup_opened");
    popupGalleryContainer.classList.remove("popup__container_opened");
    evt.stopPropagation();
})

GalleryNextButton.addEventListener("click", function (evt) {
    currentImageNumber = (currentImageNumber + 1) % imageArray.length;
    changeImage();
    evt.stopPropagation();
})

GalleryPrevButton.addEventListener("click", function (evt) {
    currentImageNumber -= 1;
    if (currentImageNumber < 0) {
        currentImageNumber = imageArray.length - 1;
    }
    changeImage();
    evt.stopPropagation();
})

popupGallery.addEventListener("click", function () {
    popupGallery.classList.remove("popup_opened");
    popupGalleryContainer.classList.remove("popup__container_opened");
})

//////////////////////////////////////////
// Gallery Control
const formElement = document.querySelector(".popup__form");
const formInputEmail = formElement.querySelector(".popup__input_email");
const formInputText = formElement.querySelector(".popup__input_text");

const formSaveButton = formElement.querySelector(".popup__save-button");

const formErrorEmail = formElement.querySelector(".popup__error-message_email");
const formErrorText = formElement.querySelector(".popup__error-message_text");

const showInputError = (elementInput, elementError) => {
    elementInput.classList.add("popup__input_error");
    elementError.classList.remove("popup__error-message_disabled");
}
const hideInputError = (elementInput, elementError) => {
    elementInput.classList.remove("popup__input_error");
    elementError.classList.add("popup__error-message_disabled");
}
const isValid = (elementInput, elementError) => {
    if (!elementInput.validity.valid) {
        showInputError(elementInput, elementError);
    } else {
        hideInputError(elementInput, elementError);
    }
}

function switchButton() {
    if (formInputEmail.validity.valid && formInputText.validity.valid) {
        formSaveButton.classList.remove("popup__save-button_disabled");
    } else {
        formSaveButton.classList.add("popup__save-button_disabled");
    }
}

formInputEmail.addEventListener("input", () => {
    isValid(formInputEmail, formErrorEmail);
    switchButton();
});
formInputText.addEventListener("input", () => {
    isValid(formInputText, formErrorText);
    switchButton();
});