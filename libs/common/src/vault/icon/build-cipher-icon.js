"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCipherIcon = buildCipherIcon;
const utils_1 = require("../../platform/misc/utils");
const cipher_type_1 = require("../enums/cipher-type");
function buildCipherIcon(iconsServerUrl, cipher, showFavicon) {
    let icon;
    let image;
    let fallbackImage = "";
    const cardIcons = {
        Visa: "card-visa",
        Mastercard: "card-mastercard",
        Amex: "card-amex",
        Discover: "card-discover",
        "Diners Club": "card-diners-club",
        JCB: "card-jcb",
        Maestro: "card-maestro",
        UnionPay: "card-union-pay",
        RuPay: "card-ru-pay",
    };
    switch (cipher.type) {
        case cipher_type_1.CipherType.Login:
            icon = "bwi-globe";
            if (cipher.login.uri) {
                let hostnameUri = cipher.login.uri;
                let isWebsite = false;
                if (hostnameUri.indexOf("androidapp://") === 0) {
                    icon = "bwi-android";
                    image = null;
                }
                else if (hostnameUri.indexOf("iosapp://") === 0) {
                    icon = "bwi-apple";
                    image = null;
                }
                else if (showFavicon &&
                    hostnameUri.indexOf("://") === -1 &&
                    hostnameUri.indexOf(".") > -1) {
                    hostnameUri = `http://${hostnameUri}`;
                    isWebsite = true;
                }
                else if (showFavicon) {
                    isWebsite = hostnameUri.indexOf("http") === 0 && hostnameUri.indexOf(".") > -1;
                }
                if (showFavicon && isWebsite) {
                    try {
                        image = `${iconsServerUrl}/${utils_1.Utils.getHostname(hostnameUri)}/icon.png`;
                        fallbackImage = "images/bwi-globe.png";
                    }
                    catch (e) {
                        // Ignore error since the fallback icon will be shown if image is null.
                    }
                }
            }
            else {
                image = null;
            }
            break;
        case cipher_type_1.CipherType.SecureNote:
            icon = "bwi-sticky-note";
            break;
        case cipher_type_1.CipherType.Card:
            icon = "bwi-credit-card";
            if (showFavicon && cipher.card.brand in cardIcons) {
                icon = `credit-card-icon ${cardIcons[cipher.card.brand]}`;
            }
            break;
        case cipher_type_1.CipherType.Identity:
            icon = "bwi-id-card";
            break;
        default:
            break;
    }
    return {
        imageEnabled: showFavicon,
        image,
        fallbackImage,
        icon,
    };
}
//# sourceMappingURL=build-cipher-icon.js.map