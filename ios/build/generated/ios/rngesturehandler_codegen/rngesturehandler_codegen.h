/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleObjCpp
 *
 * We create an umbrella header (and corresponding implementation) here since
 * Cxx compilation in BUCK has a limitation: source-code producing genrule()s
 * must have a single output. More files => more genrule()s => slower builds.
 */

#ifndef __cplusplus
#error This file must be compiled as Obj-C++. If you are importing it, you must change your file extension to .mm.
#endif
#import <Foundation/Foundation.h>
#import <RCTRequired/RCTRequired.h>
#import <RCTTypeSafety/RCTConvertHelpers.h>
#import <RCTTypeSafety/RCTTypedModuleConstants.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTCxxConvert.h>
#import <React/RCTManagedPointer.h>
#import <ReactCommon/RCTTurboModule.h>
#import <optional>
#import <vector>


@protocol NativeRNGestureHandlerModuleSpec <RCTBridgeModule, RCTTurboModule>

- (void)handleSetJSResponder:(double)tag
        blockNativeResponder:(BOOL)blockNativeResponder;
- (void)handleClearJSResponder;
- (void)createGestureHandler:(NSString *)handlerName
                  handlerTag:(double)handlerTag
                      config:(NSDictionary *)config;
- (void)attachGestureHandler:(double)handlerTag
                     newView:(double)newView
                  actionType:(double)actionType;
- (void)updateGestureHandler:(double)handlerTag
                   newConfig:(NSDictionary *)newConfig;
- (void)dropGestureHandler:(double)handlerTag;
- (NSNumber *)install;
- (void)flushOperations;

@end
namespace facebook::react {
  /**
   * ObjC++ class for module 'NativeRNGestureHandlerModule'
   */
  class JSI_EXPORT NativeRNGestureHandlerModuleSpecJSI : public ObjCTurboModule {
  public:
    NativeRNGestureHandlerModuleSpecJSI(const ObjCTurboModule::InitParams &params);
  };
} // namespace facebook::react

