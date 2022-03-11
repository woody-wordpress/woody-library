modele = {
    default: { //pas obligatoire        si default n'est pas rempli la carte aura le même design que la carte liée au playlist
        position: { //obligatoire
            latitude: nbr, //obligatoire
            longitude: nbr, //obligatoire
            zoom: nbr, //obligatoire
        },
        theme: { //obligatoire (pour définir le fond de carte par défault)
            //pour un fond de carte normal mettre les valeurs à false sinon mettre terrain ou satellite à true
            terrain: bool, //obligatoire
            satellite: bool, //obligatoire
            hue: string, // pas obligatoire         couleur de fond, écrite en hexa
            tint_intensity: nbr, //pas obligatoire  pour définir l'intensité de la couleur de fond (chiffre entre 1 et 10)
        },
        map: { //pas obligatoire et ses enfants non plus
            keyboardZoomOffset: bool, // activer par défault
            dragging: bool, // activer par défault
            scrollWheelZoom: bool, //désactivé par défault
            zoomDelta: nbr, //set a 1 par défault
            zoomControl: bool, //désactivé par défault
            minZoom: nbr, //set a 5 par défault
            maxZoom: nbr, //set a 20 par défault
            maxBounds: L.latLngBounds(topLeftCorner, bottomRightCorner), //pas de valeur par défault
        },
        zoom: { //pas obligatoire et ces enfants non plus
            state: bool // activer par défault
        },
        fullscreen: { //pas obligatoire et ces enfants non plus
            state: bool // activer par défault
        },
        locate: { //pas obligatoire et ces enfants non plus
            state: bool // activer par défault
        },
        geosearch: { //pas obligatoire et ces enfants non plus
            state: bool // activer par défault
        },
        carto: { //pas obligatoire et ces enfants non plus
            state: bool, // activer par défault
            elevation: bool, // désactivé par défault        permet d'afficher les lignes de relief lorsque l'on est sur le fond de carte terrain
            normalState: string, // activer par défault      'display:none' -> pour désactiver la possibilité de choisir ce layer
            terrainState: string, // activer par défault     'display:none' -> pour désactiver la possibilité de choisir ce layer
            satelliteState: string // activer par défault    'display:none' -> pour désactiver la possibilité de choisir ce layer
        }
    },
    id: String, //pas obligatoire, doit correspondre à l'id du bloc dans laquel doit être mise la carte (par défault : "map")
    cluster: { //pas obligatoire
        customClusters: string, //obligatoire               style du boutton
        iconSize: [nbr, nbr], //pas obligatoire             taille du boutton
    },
    markers: { //pas obligatoire, doit contenir la liste des markers si il y en a avec au minimum leurs coordonnées
        //foreach
        lat: nbr, //obligatoire
        lng: nbr, //obligatoire
        customMarker: string, //pas obligatoire           style du boutton
        iconSize: [nbr, nbr], //pas obligatoire           taille du boutton
    }
}
