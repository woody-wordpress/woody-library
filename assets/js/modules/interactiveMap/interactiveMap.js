export function interactiveMap (inputOptions = {}) {
    const defaultOptions = {
        maps: '.interactive-map',
        pins: '.map-pin',
        card: '.card'
    }

    const options = Object.assign({}, defaultOptions, inputOptions);

    const maps = document.querySelectorAll(options.maps);

    if (maps.length > 0) {
        maps.forEach(map => {
            let mapPins = map.querySelectorAll(options.pins);

            mapPins.forEach(pin => {
                pin.addEventListener('click', () => {
                    let activePin = map.querySelector('.active')
                    activePin ? activePin.classList.remove('active') : '';
                    pin.classList.add('active');

                    let id = pin.getAttribute('data-id') || pin.getAttribute('data-post-id');
                    let card = map.querySelector(options.card);

                    if (id && card) {
                        card.classList.remove('card-loaded');
                        card.classList.add('skeleton-card');

                        fetch(`/wp-json/woody/page/preview?post=${id}`).then((response) => response.json()).then((post) => {
                            updateCard(post, card);
                        }).catch((err) => {
                            console.warn('Interactive map error : ', err);
                        });
                    }
                });
            })
        });
    }
}

export function updateCard (post, card) {
    let page_type = post.page_type;
    let postId = post.post_id;
    let url = (post.link.url) ? post.link.url : '';
    let img = post.img;
    let icon = post.woody_icon;
    let pretitle = post.pretitle;
    let title = post.title;
    let subtitle = post.subtitle;
    let description = post.description;
    description = (description && description.length > 180) ? description.slice(0, 180) + '...' : description;
    let linkLabel = (post.link.link_label) ? post.link.link_label : '';

    card.setAttribute('data-postid', postId);
    card.querySelector('.card-link') ? card.querySelector('.card-link').setAttribute('href', url) : '';
    card.querySelector('.card-pretitle') ? card.querySelector('.card-pretitle').innerHTML = pretitle : '';
    card.querySelector('.card-title') ? card.querySelector('.card-title').innerHTML = title : '';
    card.querySelector('.card-subtitle') ? card.querySelector('.card-subtitle').innerHTML = subtitle : '';
    card.querySelector('.card-description') ? card.querySelector('.card-description').innerHTML = description : '';
    card.querySelector('.card-button') ? card.querySelector('.card-button').innerHTML = linkLabel : '';

    if (card.querySelector('.card-wicon')) {
        if (icon) {
            card.querySelector('.card-wicon').setAttribute('class', `card-wicon wicon wicon-woody-icons ${icon}`);
        } else {
            card.querySelector('.card-wicon').setAttribute('class', `card-wicon wicon wicon-woody-icons`);
        }
    }

    let imgRatio = card.getAttribute('class').match(/\bratio[^\s]*/)[0];

    if (!imgRatio) {
        imgRatio = 'ratio_square';
    }

    if (!img.sizes) {
        if (card.querySelector('.cardMediaWrapper img')) {
            let currentImgHeight = card.querySelector('.cardMediaWrapper img').offsetHeight;
            let currentImgWidth = card.querySelector('.cardMediaWrapper img').offsetWidth;
            img.cleanImgUrl = img.url.replace('%width%/%height%', `${currentImgWidth}/${currentImgHeight}`);
        }
    }

    if (img) {
        card.querySelector('.cardMediaWrapper') ? card.querySelector('.cardMediaWrapper').style.opacity = '1' : '';

        if (card.querySelector('.cardMediaWrapper img')) {
            let ratioSmall = `${imgRatio}_small`;
            let ratioMedium = `${imgRatio}_medium`;
            let ratioLarge = `${imgRatio}`;
            card.querySelector('.cardMediaWrapper img').classList.remove('lazyloaded');
            if(img.sizes) {
                card.querySelector('.cardMediaWrapper img').setAttribute('data-srcset', `${img.sizes[ratioSmall]} 360w, ${img.sizes[ratioMedium]} 640w, ${img.sizes[ratioLarge]} 1200w`);
                card.querySelector('.cardMediaWrapper img').setAttribute('data-src', img.sizes[ratioLarge]);
            } else {
                card.querySelector('.cardMediaWrapper img').setAttribute('data-srcset', `${img.cleanImgUrl} 360w, ${img.cleanImgUrl} 640w, ${img.cleanImgUrl} 1200w`);
                card.querySelector('.cardMediaWrapper img').setAttribute('data-src', img.cleanImgUrl);
            }
            card.querySelector('.cardMediaWrapper img').classList.add('lazyload');
            img.alt ? card.querySelector('.cardMediaWrapper img').setAttribute('alt', img.alt) : '';
        }
    } else {
        card.querySelector('.cardMediaWrapper') ? card.querySelector('.cardMediaWrapper').style.opacity = '0' : '';
    }

    card.classList.add('card-loaded');
}
