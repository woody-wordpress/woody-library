let profilesMailto = document.querySelectorAll('.profile-mailto');
if(!!profilesMailto){
    profilesMailto.forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            if(!!el.dataset.to){
                window.location.href = 'mailto:' + atob(el.dataset.to);
            }
        })
    });
}
