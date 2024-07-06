const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
const tabs = document.querySelectorAll('.tab');
const productCardsContainer = document.querySelector('.product-cards');

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data); 

        if (!data.categories || !Array.isArray(data.categories)) {
            throw new Error('Not a valid format: "categories" is not there');
        }

        const categories = data.categories;

        const menProducts = categories.find(category => category.category_name === 'Men')?.category_products || [];
        const womenProducts = categories.find(category => category.category_name === 'Women')?.category_products || [];
        const kidsProducts = categories.find(category => category.category_name === 'Kids')?.category_products || [];

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabCategory = tab.getAttribute('data-tab');
                let productsToDisplay;

                switch (tabCategory) {
                    case 'men':
                        productsToDisplay = menProducts;
                        break;
                    case 'women':
                        productsToDisplay = womenProducts;
                        break;
                    case 'kids':
                        productsToDisplay = kidsProducts;
                        break;
                    default:
                        productsToDisplay = menProducts;
                }
                productCardsContainer.innerHTML = '';

                productsToDisplay.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';

                    const productImage = document.createElement('img');
                    productImage.src = product.image;
                    productImage.alt = product.title;

                    const badge = document.createElement('div');
                    badge.className = 'badge';
                    badge.textContent = product.badge_text || 'New';  

                    const productInfo = document.createElement('div');
                    productInfo.className = 'product-info';

                    const titleVendor = document.createElement('div');
                    titleVendor.className = 'title-vendor';

                    const productTitle = document.createElement('span');
                    productTitle.className = 'product-title';
                    productTitle.textContent = product.title;


                    const vendorName = document.createElement('li');
                    vendorName.className = 'vendor-name';
                    vendorName.textContent = product.vendor;

                    titleVendor.appendChild(productTitle);
                    titleVendor.appendChild(vendorName);
                    productInfo.appendChild(titleVendor);

                    const pricingRow = document.createElement('div');
                    pricingRow.className = 'pricing-row';

                    const price = document.createElement('span');
                    price.className = 'price';
                    price.textContent = `₹${product.price}`;

                    const compareAtPrice = document.createElement('span');
                    compareAtPrice.className = 'compare-at-price';
                    compareAtPrice.textContent = `₹${product.compare_at_price}`;

                    const discount = document.createElement('span');
                    discount.className = 'discount';
                    const discountPercentage = calculateDiscount(product.price, product.compare_at_price);
                    discount.textContent = `${discountPercentage}% off`;

                    pricingRow.appendChild(price);
                    pricingRow.appendChild(compareAtPrice);
                    pricingRow.appendChild(discount);

                    productInfo.appendChild(pricingRow);

                    const addToCartButton = document.createElement('button');
                    addToCartButton.className = 'add-to-cart';
                    addToCartButton.textContent = 'Add to cart';

                    productInfo.appendChild(addToCartButton);

                    productCard.appendChild(badge);
                    productCard.appendChild(productImage);
                    productCard.appendChild(productInfo);

                    productCardsContainer.appendChild(productCard);
                });
            });
        });

        tabs[0].click();
    })
    .catch(error => console.error('Error fetching product data:', error));


function calculateDiscount(price, compareAtPrice) {
    if (compareAtPrice > price) {
        const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
        return Math.round(discount);
    } else {
        return 0;
    }
}


