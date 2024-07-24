"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityLinkedId = exports.CardLinkedId = exports.LoginLinkedId = void 0;
// LoginView
var LoginLinkedId;
(function (LoginLinkedId) {
    LoginLinkedId[LoginLinkedId["Username"] = 100] = "Username";
    LoginLinkedId[LoginLinkedId["Password"] = 101] = "Password";
})(LoginLinkedId || (exports.LoginLinkedId = LoginLinkedId = {}));
// CardView
var CardLinkedId;
(function (CardLinkedId) {
    CardLinkedId[CardLinkedId["CardholderName"] = 300] = "CardholderName";
    CardLinkedId[CardLinkedId["ExpMonth"] = 301] = "ExpMonth";
    CardLinkedId[CardLinkedId["ExpYear"] = 302] = "ExpYear";
    CardLinkedId[CardLinkedId["Code"] = 303] = "Code";
    CardLinkedId[CardLinkedId["Brand"] = 304] = "Brand";
    CardLinkedId[CardLinkedId["Number"] = 305] = "Number";
})(CardLinkedId || (exports.CardLinkedId = CardLinkedId = {}));
// IdentityView
var IdentityLinkedId;
(function (IdentityLinkedId) {
    IdentityLinkedId[IdentityLinkedId["Title"] = 400] = "Title";
    IdentityLinkedId[IdentityLinkedId["MiddleName"] = 401] = "MiddleName";
    IdentityLinkedId[IdentityLinkedId["Address1"] = 402] = "Address1";
    IdentityLinkedId[IdentityLinkedId["Address2"] = 403] = "Address2";
    IdentityLinkedId[IdentityLinkedId["Address3"] = 404] = "Address3";
    IdentityLinkedId[IdentityLinkedId["City"] = 405] = "City";
    IdentityLinkedId[IdentityLinkedId["State"] = 406] = "State";
    IdentityLinkedId[IdentityLinkedId["PostalCode"] = 407] = "PostalCode";
    IdentityLinkedId[IdentityLinkedId["Country"] = 408] = "Country";
    IdentityLinkedId[IdentityLinkedId["Company"] = 409] = "Company";
    IdentityLinkedId[IdentityLinkedId["Email"] = 410] = "Email";
    IdentityLinkedId[IdentityLinkedId["Phone"] = 411] = "Phone";
    IdentityLinkedId[IdentityLinkedId["Ssn"] = 412] = "Ssn";
    IdentityLinkedId[IdentityLinkedId["Username"] = 413] = "Username";
    IdentityLinkedId[IdentityLinkedId["PassportNumber"] = 414] = "PassportNumber";
    IdentityLinkedId[IdentityLinkedId["LicenseNumber"] = 415] = "LicenseNumber";
    IdentityLinkedId[IdentityLinkedId["FirstName"] = 416] = "FirstName";
    IdentityLinkedId[IdentityLinkedId["LastName"] = 417] = "LastName";
    IdentityLinkedId[IdentityLinkedId["FullName"] = 418] = "FullName";
})(IdentityLinkedId || (exports.IdentityLinkedId = IdentityLinkedId = {}));
//# sourceMappingURL=linked-id-type.enum.js.map