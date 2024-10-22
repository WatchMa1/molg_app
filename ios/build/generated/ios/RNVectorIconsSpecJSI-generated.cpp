/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleCpp.js
 */

#include "RNVectorIconsSpecJSI.h"

namespace facebook::react {

static jsi::Value __hostFunction_NativeRNVectorIconsCxxSpecJSI_getImageForFont(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeRNVectorIconsCxxSpecJSI *>(&turboModule)->getImageForFont(
    rt,
    args[0].asString(rt),
    args[1].asString(rt),
    args[2].asNumber(),
    args[3].asNumber()
  );
}
static jsi::Value __hostFunction_NativeRNVectorIconsCxxSpecJSI_getImageForFontSync(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeRNVectorIconsCxxSpecJSI *>(&turboModule)->getImageForFontSync(
    rt,
    args[0].asString(rt),
    args[1].asString(rt),
    args[2].asNumber(),
    args[3].asNumber()
  );
}
static jsi::Value __hostFunction_NativeRNVectorIconsCxxSpecJSI_loadFontWithFileName(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<NativeRNVectorIconsCxxSpecJSI *>(&turboModule)->loadFontWithFileName(
    rt,
    args[0].asString(rt),
    args[1].asString(rt)
  );
}

NativeRNVectorIconsCxxSpecJSI::NativeRNVectorIconsCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("RNVectorIcons", jsInvoker) {
  methodMap_["getImageForFont"] = MethodMetadata {4, __hostFunction_NativeRNVectorIconsCxxSpecJSI_getImageForFont};
  methodMap_["getImageForFontSync"] = MethodMetadata {4, __hostFunction_NativeRNVectorIconsCxxSpecJSI_getImageForFontSync};
  methodMap_["loadFontWithFileName"] = MethodMetadata {2, __hostFunction_NativeRNVectorIconsCxxSpecJSI_loadFontWithFileName};
}


} // namespace facebook::react
