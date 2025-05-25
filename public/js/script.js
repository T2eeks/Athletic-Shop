const details = document.querySelectorAll('details.details-close');

details.forEach((targetDetail) => {
    targetDetail.addEventListener("click", () => {
        details.forEach((detail) => {
            if (detail !== targetDetail) {
                detail.removeAttribute("open");
            }
        });
    });
});

const burger = document.querySelector('.header__top_bars');
const closeMenu = document.querySelector('.menu-close');
const height = document.querySelector('.header__top');
const nav = document.querySelector('.menu__box');
const basketIcon = document.querySelector('.header__basket_icon');
const basket = document.querySelector('.header__basket');
const closeBasket = document.querySelector('.basket-close');

if (burger) {
    burger.addEventListener('click', (event) => {
        burger.classList.toggle('_bars-active');
        if (burger.classList.contains('_bars-active')) {
            height.classList.add('_height-100vh');
            // nav.classList.remove('_menu-active');

        } else {
            height.classList.remove('_height-100vh');
            // nav.classList.add('_menu-active');
        }
        nav.classList.toggle('_menu-active');
        // document.body.classList.toggle('_lock')
        if (basket.classList.contains('_basket-active')) {
            basket.classList.remove('_basket-active');
        }

    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', (event) => {
        if (burger.classList.contains('_bars-active')) {
            burger.classList.remove('_bars-active');
            nav.classList.remove('_menu-active');
        }
    });
}

if (basketIcon) {
    basketIcon.addEventListener('click', (event) => {
        basket.classList.toggle('_basket-active');
        if (nav.classList.contains('_menu-active')) {
            burger.classList.remove('_bars-active');
            nav.classList.remove('_menu-active');
        }
    });
}

if (closeBasket) {
    closeBasket.addEventListener('click', (event) => {
        if (basket.classList.contains('_basket-active')) {
            basket.classList.remove('_basket-active');
        }
    });
}



// const isMobile = {
//     Android: function () {
//         return navigator.userAgent.match(/Android/i);
//     },
//     BlackBerry: function () {
//         return navigator.userAgent.match(/BlackBerry/i);
//     },
//     IOS: function () {
//         return navigator.userAgent.match(/iPhone|iPad|iPod/i);
//     },
//     Opera: function () {
//         return navigator.userAgent.match(/Opera Mini/i);
//     },
//     Windows: function () {
//         return navigator.userAgent.match(/IEMobile/i);
//     },
//     any: function () {
//         return (isMobile.Android() || isMobile.BlackBerry() || isMobile.IOS() || isMobile.Opera() || isMobile.Windows());
//     }
// };

// const anchors = document.querySelectorAll('.goto[href*="#"]')

// for (let anchor of anchors) {
//     anchor.addEventListener('click', (event) => {
//         if (burger.classList.contains('_menu-active')) {
//             burger.classList.remove('_menu-active');
//             nav.classList.remove('_menu-active');
//             // document.body.classList.remove('_lock')
//         }
//         const blockID = anchor.getAttribute('href').substr(1)
//         document.getElementById(blockID).scrollIntoView({
//             behavior: 'smooth',
//             block: 'start'
//         });
//         event.preventDefault()
//     });
// }



// if (isMobile.any()) {
//     document.body.classList.add('_touch');
// } else {
//     document.body.classList.add('_mouse');
// }


// let goToTopEl = document.getElementById('goToTop');

// window.addEventListener('scroll', (event) => {
//     if (window.pageYOffset > 500) {
//         goToTopEl.style.display = "block";
//     } else {
//         goToTopEl.style.display = "none";
//     }
// });

