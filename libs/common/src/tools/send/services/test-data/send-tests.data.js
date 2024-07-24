"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSendViewData = testSendViewData;
exports.createSendData = createSendData;
exports.testSendData = testSendData;
exports.testSend = testSend;
const enc_string_1 = require("../../../../platform/models/domain/enc-string");
const send_type_1 = require("../../enums/send-type");
const send_text_api_1 = require("../../models/api/send-text.api");
const send_text_data_1 = require("../../models/data/send-text.data");
const send_data_1 = require("../../models/data/send.data");
const send_1 = require("../../models/domain/send");
const send_view_1 = require("../../models/view/send.view");
function testSendViewData(id, name) {
    const data = new send_view_1.SendView({});
    data.id = id;
    data.name = name;
    data.disabled = false;
    data.accessCount = 2;
    data.accessId = "1";
    data.revisionDate = null;
    data.expirationDate = null;
    data.deletionDate = null;
    data.notes = "Notes!!";
    data.key = null;
    return data;
}
function createSendData(value = {}) {
    var _a;
    const defaultSendData = {
        id: "1",
        name: "Test Send",
        accessId: "123",
        type: send_type_1.SendType.Text,
        notes: "notes!",
        file: null,
        text: new send_text_data_1.SendTextData(new send_text_api_1.SendTextApi({ Text: "send text" })),
        key: "key",
        maxAccessCount: 12,
        accessCount: 2,
        revisionDate: "2024-09-04",
        expirationDate: "2024-09-04",
        deletionDate: "2024-09-04",
        password: "password",
        disabled: false,
        hideEmail: false,
    };
    const testSend = {};
    for (const prop in defaultSendData) {
        testSend[prop] = (_a = value[prop]) !== null && _a !== void 0 ? _a : defaultSendData[prop];
    }
    return testSend;
}
function testSendData(id, name) {
    const data = new send_data_1.SendData({});
    data.id = id;
    data.name = name;
    data.disabled = false;
    data.accessCount = 2;
    data.accessId = "1";
    data.revisionDate = null;
    data.expirationDate = null;
    data.deletionDate = null;
    data.notes = "Notes!!";
    data.key = null;
    return data;
}
function testSend(id, name) {
    const data = new send_1.Send({});
    data.id = id;
    data.name = new enc_string_1.EncString(name);
    data.disabled = false;
    data.accessCount = 2;
    data.accessId = "1";
    data.revisionDate = null;
    data.expirationDate = null;
    data.deletionDate = null;
    data.notes = new enc_string_1.EncString("Notes!!");
    data.key = null;
    return data;
}
//# sourceMappingURL=send-tests.data.js.map