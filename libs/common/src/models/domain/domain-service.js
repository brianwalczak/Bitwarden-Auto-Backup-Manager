"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UriMatchStrategy = void 0;
/*
  See full documentation at:
    https://bitwarden.com/help/uri-match-detection/#match-detection-options

  Domain: "the top-level domain and second-level domain of the URI match the detected resource",
  Host: "the hostname and (if specified) port of the URI matches the detected resource",
  StartsWith: "the detected resource starts with the URI, regardless of what follows it",
  Exact: "the URI matches the detected resource exactly",
  RegularExpression: "the detected resource matches a specified regular expression",
  Never: "never offer auto-fill for the item",
*/
exports.UriMatchStrategy = {
    Domain: 0,
    Host: 1,
    StartsWith: 2,
    Exact: 3,
    RegularExpression: 4,
    Never: 5,
};
//# sourceMappingURL=domain-service.js.map