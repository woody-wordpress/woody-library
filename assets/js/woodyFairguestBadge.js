const fairguestGroup = 1;
let sheetIds = [];

document.querySelectorAll('#woody-fairguest-badge').forEach(badge => {
    let sheetId = badge.closest('.card').getAttribute('data-sheetid');

    sheetId !== null && !sheetIds.includes(sheetId) ? sheetIds.push(sheetId) : '';
});

if (fairguestGroup !== null && sheetIds.length > 0) {
    fetch(`https://api.tourism-system.com/v2/fairguest/sheets/fairguest-ratings?ids=${sheetIds}&fairguestGroup=${fairguestGroup}`).then((response) => response.json()).then((sheetRatings) => {
        if (Object.keys(sheetRatings).length !== 0) {
            let finalRatings = {};

            for (let sheetRating in sheetRatings) {
                if (sheetRatings[sheetRating].weighted_rating_is_valid) {
                    let roundedRating = Math.round(sheetRatings[sheetRating].weighted_rating * 10) / 10;
                    finalRatings[sheetRating] = roundedRating;
                }
            }

            if (Object.keys(finalRatings).length !== 0) {
                for (let sheetId in finalRatings) {
                    document.querySelectorAll(`.card[data-sheetid="${sheetId}"]`).forEach(card => {
                        let fairguestBadge = card.querySelector('#woody-fairguest-badge');
                        let color = getFairguestColorMatchingReview(finalRatings[sheetId]);
                        fairguestBadge !== null ? fairguestBadge.innerHTML = `<span style="background-color: ${color};">${finalRatings[sheetId]}</span>` : '';
                        fairguestBadge !== null ? fairguestBadge.classList.add('has-rating') : '';
                    });
                }
            }
        }
    }).catch((err) => {
        console.warn('Erreur fairguest ratings : ', err);
    });
}

function getFairguestColorMatchingReview (rating) {
    switch (true) {
        case rating < 0.1:
            return '#7a7a7a';
            break
        case rating < 4:
            return '#ee622d';
            break
        case rating < 7:
            return '#ffc001';
            break
        case rating < 8:
            return '#9fbf04';
            break
        case rating < 9:
            return '#71a63e';
            break
        default:
            return '#277712';
    }
}
