

### Unreleased v16
##
### Changelog for v15
##
#### [Oct 5, 2017]()

- menuWidgets.js: Fix formatting issues
- menuWidgets.js: Define classes using var instead of const 

#### [Oct 2, 2017]()

- SearchBox: Handle control key press events 
- SearchBox: Reimplement the "type-away-feature" 
- menuWidgets.js: Fix bug & typo
- SearchBox: Reimplement basic functionality
- menuWidgets.js: Add class SearchBox

#### [Oct 1, 2017]()

- prefs.js: Comment temporarily the general settings page

#### [Sep 23, 2017]()

- Remove dead code 

#### [Sep 21, 2017]()

- menuWidgets.js: Refactor session buttons 

#### [Sep 18, 2017]()

- stylesheet.css: ST.Entry to fix menu resize bug

#### [Sep 17, 2017]()

- stylesheet.css: set max-width for ST.Entry to fix menu resize bug

#### [Sep 16, 2017]()

- menu.js: move MenuWidgetButton class to menuWidgets.js 
- update Makefile 
- menu.js: move menu widgets into their own module 
- menu.js: reformat some code parts
- menu.js: use map to keep track of app items
- menu.js: add missing semicolon
- menu.js: add missing semicolon and reformat 
- menu.js: refactor existing DnD code

#### [Sep 14, 2017]()

- menu.js: remove space key support to launch apps

#### [Sep 6, 2017]()

- Minor change to Gtk.LinkButton( label

#### [Sep 4, 2017]()

- GNOME-Shell 3.25/26: Fix JS warnings 

#### [Sep 3, 2017]()

- ArcMenuPreferencesWidget update for v15 

#### [Sep 2, 2017]()

- helper.js: fix bug in method destroy

#### [Sep 1, 2017]()

- Preparations for general features tab (PW.NotebookPage)
- Migration for GNOME 3.25/3.26

#### [Aug 18, 2017]()

- Makefile: create checksums when invoking the targets zip-file/tgz-file 
- Makefile: fix name of the root folder in tar.gz and zip files
- Makefile: add target tgz-file to create tar.gz files 
- Makefile: fix condition in first ifeq
- Makefile: refine versioning using version tags
- Makefile: update make help target
- Makefile: simplify the way to retrieve the pretty commit hash
- Makefile: improve versioning 
- Makefile: ignore errors in enable/disable targets 

#### [Aug 17, 2017]()

- Makefile: add support for system-wide installation 
- Makefile: add help target

#### [Aug 9, 2017]()

- menu.js: add _onKeyPressEvent handler to ApplicationMenuItem 

#### [Aug 8, 2017]()

- prefs.js: define MenuButtonCustomizationWindow before AppearanceSetti…
- prefs.js: define the class ArcMenuPreferencesWidget at the bottom
- prefs.js: remove hack and use '===' instead of '=='
- prefs.js: define menuButtonIconCombo before it's used 
- prefs.js: add missing semicolons
- prefs.js: use dot notation to use access metadata 
- prefsWidgets.js: refactor class IconButton 
- controller.js: refcator code following jshint remarks 
- .jshintrc: remove '_' from predef list 
- Makefile: add jshint and test targets 

#### [Aug 6, 2017]()

- prefs.js: use the string 'unknown' for unknown versions
- Makefile: use git hash for versioning development builds 
- metadata.json: drop support for 3.14 and 3.16 
- metadata.json: add a default version of -1
- metadata.json: reformat json 
- prefjs.js & prefsWidgets.js: refactor Notebook, NotebookPage, and Arc…

#### [Aug 5, 2017]()

- updated patch for polish translation

#### [Aug 2, 2017]()

- Added few translations and fixed some

##
### Changelog for v14
##
#### [Aug 1, 2017]()

- prefs.js: show GPL2 info text on the about page
- Prepare menu.js for gnome tweaks/GNOME 3.26
- refactorings
- menu.js: replace new Array() with []
- prefsWidgets.js: remove hacks that use child property
- prefsWidgets.js: use Gtk.Box instead of Gtk.VBox
- prefs.js: rename AM constant to PW and rename am.js file to prefsWidgets.js
- menu.js: initiliaze and clear array properly 

#### [Jul 31, 2017]()

- Update fr.po 

#### [Jul 26, 2017]()

- menu.js: eliminate unnecessary code in class ApplicationMenuItem
- menu.js: fix #77
- menu.js: remove dead code
- remove a _removeMenuTimeout in the class ApplicationMenuItem
- menu.js: eliminate unnecessary code in class ApplicationMenuItem
- menu.js: handle KEY_KP_Enter the same way as KEY_Return
- menu.js: add code to capture KEY_KP_Enter
- menu.js: remove dead code

#### [Jul 22, 2017]() 

- fix-disable-hotcorner-bug 
- fix: keep disabled hot corner disabled on new session
 
#### [Jul 16, 2017]() 
 
- Merge pull request #91 from lexruee/refactoring
- menu.js: remove unused constant availableIconSizes 
- menu.js: refactor the class MenuButtonWidget 
- #90 from lexruee/refactoring 
- remove fixes for the adapta theme 
- #87 from itmitica/Development-Branch 
    
#### [Jul 15, 2017]() 
    
- symbolic icon: svg in media, const in constants.js
- Adapta-Theme changes for symbolic icon
- #86 from LinxGem33/revert-78-Development-Branch 
    
#### [Jul 13, 2017]() 
     
- controller.js: implement method _isActivitiesButtonPresent 
- Merge pull request #79 from lexruee/sync-development-branch 
- Sync development branch with master 
        
#### [Jul 11, 2017]() 
        
- icon: symbolic
- Merge pull request #75 from zakkak/master 
- Add Greek translation
         
##
### Changelog for v13
##

#### [Jul 06, 2017]()

- Implement menu-button-customization feature (update). 
- refactor the appearance settings page and fix some code in prefs.js a… 
- fix tiny bugs 			        
- refactor settings page (now behavour page) and about page 			
- Implement menu-button-customization feature. 
- Fix bug: Correct the default size for the menu button icon in the schema 
- Fix bug: User cannot unset the menu hotkey. 
- Prettify the existing UI in prefs.js and refactor prefs.js 
- Update am.js 			        
- Update constants.js 			
- Update controller.js 			
- Update extension.js 			
- Update helper.js 			
- Merge pull request #48 from lexruee/menu-button-customization 
- Update am.js, constants.js, controller.js, extension.js, and helper.js   
- Refactor menu.js                        
- Arc icon SVG 			        
- Merge pull request #49 from lexruee/prettification-and-refactoring 
- Merge pull request #51 from LinxGem33/Development-Branch 

