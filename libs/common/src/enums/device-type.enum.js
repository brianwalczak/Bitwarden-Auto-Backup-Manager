"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesktopDeviceTypes = exports.MobileDeviceTypes = exports.DeviceType = void 0;
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["Android"] = 0] = "Android";
    DeviceType[DeviceType["iOS"] = 1] = "iOS";
    DeviceType[DeviceType["ChromeExtension"] = 2] = "ChromeExtension";
    DeviceType[DeviceType["FirefoxExtension"] = 3] = "FirefoxExtension";
    DeviceType[DeviceType["OperaExtension"] = 4] = "OperaExtension";
    DeviceType[DeviceType["EdgeExtension"] = 5] = "EdgeExtension";
    DeviceType[DeviceType["WindowsDesktop"] = 6] = "WindowsDesktop";
    DeviceType[DeviceType["MacOsDesktop"] = 7] = "MacOsDesktop";
    DeviceType[DeviceType["LinuxDesktop"] = 8] = "LinuxDesktop";
    DeviceType[DeviceType["ChromeBrowser"] = 9] = "ChromeBrowser";
    DeviceType[DeviceType["FirefoxBrowser"] = 10] = "FirefoxBrowser";
    DeviceType[DeviceType["OperaBrowser"] = 11] = "OperaBrowser";
    DeviceType[DeviceType["EdgeBrowser"] = 12] = "EdgeBrowser";
    DeviceType[DeviceType["IEBrowser"] = 13] = "IEBrowser";
    DeviceType[DeviceType["UnknownBrowser"] = 14] = "UnknownBrowser";
    DeviceType[DeviceType["AndroidAmazon"] = 15] = "AndroidAmazon";
    DeviceType[DeviceType["UWP"] = 16] = "UWP";
    DeviceType[DeviceType["SafariBrowser"] = 17] = "SafariBrowser";
    DeviceType[DeviceType["VivaldiBrowser"] = 18] = "VivaldiBrowser";
    DeviceType[DeviceType["VivaldiExtension"] = 19] = "VivaldiExtension";
    DeviceType[DeviceType["SafariExtension"] = 20] = "SafariExtension";
    DeviceType[DeviceType["SDK"] = 21] = "SDK";
    DeviceType[DeviceType["Server"] = 22] = "Server";
    DeviceType[DeviceType["WindowsCLI"] = 23] = "WindowsCLI";
    DeviceType[DeviceType["MacOsCLI"] = 24] = "MacOsCLI";
    DeviceType[DeviceType["LinuxCLI"] = 25] = "LinuxCLI";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
exports.MobileDeviceTypes = new Set([
    DeviceType.Android,
    DeviceType.iOS,
    DeviceType.AndroidAmazon,
]);
exports.DesktopDeviceTypes = new Set([
    DeviceType.WindowsDesktop,
    DeviceType.MacOsDesktop,
    DeviceType.LinuxDesktop,
    DeviceType.UWP,
    DeviceType.WindowsCLI,
    DeviceType.MacOsCLI,
    DeviceType.LinuxCLI,
]);
//# sourceMappingURL=device-type.enum.js.map