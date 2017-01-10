#import "AppConfig.h"
#import "Environment.m"

@implementation AppConfig

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport {
  return ENV;
}

@end
