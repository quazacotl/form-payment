const addButton = document.querySelector('.form__add-wrapper');
const addForm = document.querySelector('.add-form');
const successForm = document.querySelector('.success-form');
const failForm = document.querySelector('.fail-form');
const mainForm = document.querySelector('.form');
const productItems = document.querySelectorAll('.add-form__product-item');
const addFormBtn = document.querySelector('.add-form__btn');
const formBtn = document.querySelector('.form__submit');
const addWrapper = document.querySelector('.form__add-wrapper');

let productCount = 1
let success = true


const countAddedProducts = () => {
    const products = document.querySelectorAll('.additional-product')
    products.forEach((item, i) => {
        const labels =  item.querySelectorAll('.form__label')
        const inputs =  item.querySelectorAll('.form__input')

        item.querySelector('.form__subheader').innerText = `Product ${i+2}`

        labels[0].setAttribute('for', `product-name${i+2}`)
        inputs[0].setAttribute('id', `product-name${i+2}`)
        inputs[0].setAttribute('name', `product-name${i+2}`)

        labels[1].setAttribute('for', `product-link${i+2}`)
        inputs[1].setAttribute('id', `product-link${i+2}`)
        inputs[1].setAttribute('name', `product-link${i+2}`)
    });
}

const animateIn = (element, styleNameIn) => {
    element.classList.add(styleNameIn)
    element.style.display = 'block'
}

const animateOut = (element, styleNameIn) => {
    element.classList.remove(styleNameIn)
    element.style.display = 'none'
}

const countSum = () => {
    switch (productCount) {
        case 1: formBtn.innerText = 'Submit and pay 24.99 USD'
            break
        case 2: formBtn.innerText = 'Submit and pay 44 USD'
            break
        case 3: formBtn.innerText = 'Submit and pay 60 USD'
            break
        case 4: formBtn.innerText = 'Submit and pay 72 USD'
            break
        case 5: formBtn.innerText = 'Submit and pay 80 USD'
            break
        default: formBtn.innerText = 'Submit and pay 24.99 USD'
    }
}

const showForm = (form, pathname) => {
    animateIn(form, 'animate__flipInY')
    animateOut(mainForm, 'animate__flipInY')
    window.history.pushState("", "", pathname)
    countSum()
}

const backForm = (form, btnSelector) => {
    const backBtn = document.querySelector(`.${btnSelector}`);
    backBtn.addEventListener('click', () => {
        if (form === successForm) window.location = 'http://localhost:3000/'
        else {
            animateOut(form, 'animate__flipInY')
            animateIn(mainForm, 'animate__flipInY')
            window.history.back()
        }

    });
}


// Показ блока добавления товара

addButton.addEventListener('click', () => {
    animateIn(addForm,  'animate__flipInY')
    animateOut(mainForm, 'animate__flipInY')
});

// Переключение радио в блоке добавления

productItems.forEach(item => {
    item.addEventListener('click', () => {
        productItems.forEach(i => {
            i.querySelector('.add-form__product-item_radio').innerHTML = ''
            i.classList.remove('active-item');
        });
        item.classList.add('active-item')
        item.querySelector('.add-form__product-item_radio').innerHTML = '<span></span>'
    });
});

// Добавление продуктов

addFormBtn.addEventListener('click', () => {
    const addedProducts = document.querySelectorAll('.additional-product');

    if (addedProducts && addedProducts.length > 0) {
        addedProducts.forEach(item => item.remove())
    }

    try {
        const productId = addForm.querySelector('.active-item').id;
        productCount = +productId[productId.length - 1] - 1;
    } catch (e) {}


    if (productCount === 1) {
        animateIn(mainForm, 'animate__flipInY')
        animateOut(addForm, 'animate__flipInY')
    }

    for (let i = 2; i <= productCount; i++) {
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('form__fieldset', 'additional-product');
        fieldset.innerHTML = `
            <div class="additional-product__wrapper">
                <div class="form__subheader"></div>
                <div class="additional-product__delete">&times;</div>
            </div>
            <label class="form__label">Enter main keyword for the product</label>
            <input type="text" class="form__input" placeholder="for example, sylicon wine cup">
            <label class="form__label">Enter link to the similar product as a reference</label>
            <input type="text" class="form__input" placeholder="https://...">
        `
        addWrapper.insertAdjacentElement('beforebegin', fieldset)
    }

    countSum()

    const deleteBtns = document.querySelectorAll('.additional-product__delete')

    countAddedProducts()

    // Удаление элемента

    deleteBtns.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentNode
            parent.parentNode.classList.add('animate__animated', 'animate__zoomOut')
            setTimeout(() => {
                parent.parentNode.remove()
            }, 1000);
            countAddedProducts()
            productCount--
            countSum()
        });
    });
    animateIn(mainForm, 'animate__flipInY')
    animateOut(addForm, 'animate__flipInY')
});

// Отправка формы

formBtn.addEventListener('click', (e) => {
    e.preventDefault()
    formBtn.innerHTML = `<img class="loading-img" src="../icon/Rolling-1s-32px.svg" alt="loading">`
    setTimeout(() => {
        if (success) {
            showForm(successForm, '/paymentsuccess')
        } else {
            showForm(failForm, '/paymenterror')
        }
    }, 3000);

});

// Кнопка назад

backForm(successForm, 'success-form__btn')
backForm(failForm, 'fail-form__btn')