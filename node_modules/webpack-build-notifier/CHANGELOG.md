# Changelog

#### 0.1.32
###### _April 16, 2019_

- Fixed TypeScript definitions per issues [#38](/../../issues/38) and [#39](/../../issues/39).

#### 0.1.31
###### _March 20, 2019_

- Added TypeScript definitions per issue [#35](/../../issues/35).

#### 0.1.30
###### _October 7, 2018_

- Fix for [#29](/../../issues/29) where error occurs on Windows 7 when attempting to register the SnoreToast app ID for notifications.

#### 0.1.29
###### _August 21, 2018_

- Fix for [#30](/../../issues/30), compilation notifications no longer ignore *sound* option.
- Added new config option: *compilationSound*

#### 0.1.28
###### _June 30, 2018_

- Fix for [#28](/../../issues/28) to allow webpack build to complete while notification is visible. Updated to node-notifier@5.2.1.

#### 0.1.27
###### _June 1, 2018_

- Check that error/warning is not null before formatting it.

#### 0.1.26
###### _May 31, 2018_

- Added two new config options: *notifyOptions* and *onTimeout* per [#26](/../../issues/26).

#### 0.1.25
###### _April 18, 2018_

- Updated Webpack 4 watchRun hook to use tapAsync to fix [#25](/../../issues/25).

#### 0.1.24
###### _April 15, 2018_

- Updated to use new hooks API for Webpack 4.

#### 0.1.23
###### _February 21, 2018_

- Updated terminal activation to handle VS Code.

#### 0.1.22
###### _January 16, 2018_

- Merged PR to detect terminal application. [#21](/../../issues/21).

#### 0.1.21
###### _December 13, 2017_

- Reworked previous "fix" to use default SnoreToast AppID for Windows toast notifications. [#20](/../../issues/20).

#### 0.1.19
###### _December 13, 2017_

- Added appName parameter to notify config to resolve issue with notifications not being generated in Windows build >=1709 [#20](/../../issues/20).

#### 0.1.18
###### _November 30, 2017_

- Updated `node-notifier` package version to latest; enforced max message length to 256 to fix [#20](/../../issues/20).

#### 0.1.17
###### _November 6, 2017_

- Added notification hook for webpack "watch-run" compilation event to show notifications when the compilation process has started.
Added *suppressCompileStart* and *compileIcon* configuration options to support this. This notification will not be shown by default;
set *suppressCompileStart* to *false* to enable.

#### 0.1.16
###### _July 25, 2017_

- Updated *suppressSuccess* configuration option to support "always" and "initial" values.

#### 0.1.15
###### _July 17, 2017_

- Updated webpack icons.

#### 0.1.14
###### _June 14, 2017_

- Added *warningSound* configuration option.

#### 0.1.13
###### _October 19, 2016_

- Added *messageFormatter* configuration option to allow custom formatting of notification message.


#### 0.1.12
###### _July 25, 2016_

- Bugfix for #6, more null checking.


#### 0.1.11
###### _July 16, 2016_

- Bugfix for #6; added null check for error messages.

#### 0.1.10
###### _July 14, 2016_

- Added reference to *[strip-ansi](https://www.npmjs.com/package/strip-ansi)* NPM package to remove CLI color formatting from notifications.

#### 0.1.9
###### _July 5, 2016_

- Added new *onClick* configuration option to allow for specifying of notification click behavior.

#### 0.1.8
###### _February 17, 2016_

- Added new *successSound* and *failureSound* configuration options to allow different sounds depending upon the notification type. The *sound* configuration is still supported, but these two new options will take precedence.

#### 0.1.7
###### _January 18, 2016_

- Fixed *sound* configuration option to allow "false" value to disable sound.

#### 0.1.6
###### _December 17, 2015_

- Added *suppressWarning* configuration option.
