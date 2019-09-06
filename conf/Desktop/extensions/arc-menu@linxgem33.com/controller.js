/*
 * Arc Menu: The new applications menu for Gnome 3.
 *
 * Copyright (C) 2017 Alexander Rüedlinger
 * Copyright (C) 2017-2019 LinxGem33
 * Copyright (C) 2019 Andrew Zaech
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Import Libraries
const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Constants = Me.imports.constants;
const Helper = Me.imports.helper;
const Menu = Me.imports.menu;
const ExtensionSystem = imports.ui.extensionSystem;
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
/**
 * The Menu Settings Controller class is responsible for changing and handling
 * the settings changes of the Arc Menu.
 */
var MenuSettingsController = class {
    constructor(settings, settingsControllers, panel, isMainPanel) {
        this._settings = settings;
        this.panel = panel;
        this.currentMonitorIndex;
        this.isMainPanel = isMainPanel;
        this._activitiesButton = this.panel.statusArea.activities;
        this._settingsControllers = settingsControllers
        // Create the button, a Hot Corner Manager, a Menu Keybinder as well as a Keybinding Manager
        this._menuButton = new Menu.ApplicationsButton(settings, panel);
        this._hotCornerManager = new Helper.HotCornerManager(this._settings);
        if(this.isMainPanel){
            this._menuHotKeybinder = new Helper.MenuHotKeybinder(() => {
                this.toggleMenus();   
            });
            this._keybindingManager = new Helper.KeybindingManager(this._settings); 
        }
        this._applySettings();
    }

    // Load and apply the settings from the arc-menu settings
    _applySettings() {
        this._updateHotCornerManager();
        if(this.isMainPanel)
            this._updateHotKeyBinder();
        this._setButtonAppearance();
        this._setButtonText();
        this._setButtonIcon();
        this._setButtonIconSize();
    }

    // Bind the callbacks for handling the settings changes to the event signals
    bindSettingsChanges() {
        this.settingsChangeIds = [
            this._settings.connect('changed::disable-activities-hotcorner', this._updateHotCornerManager.bind(this)),
            this._settings.connect('changed::menu-hotkey', this._updateHotKeyBinder.bind(this)),
            this._settings.connect('changed::position-in-panel', this._setButtonPosition.bind(this)),
            this._settings.connect('changed::menu-button-appearance', this._setButtonAppearance.bind(this)),
            this._settings.connect('changed::menu-button-text', this._setButtonText.bind(this)),
            this._settings.connect('changed::custom-menu-button-text', this._setButtonText.bind(this)),
            this._settings.connect('changed::menu-button-icon', this._setButtonIcon.bind(this)),
            this._settings.connect('changed::custom-menu-button-icon', this._setButtonIcon.bind(this)),
            this._settings.connect('changed::custom-menu-button-icon-size', this._setButtonIconSize.bind(this)),
            this._settings.connect('changed::enable-menu-button-arrow', this._setMenuButtonArrow.bind(this)),
            this._settings.connect('changed::enable-custom-arc-menu', this._enableCustomArcMenu.bind(this)),
            this._settings.connect('changed::show-home-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-documents-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-downloads-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-music-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-pictures-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-videos-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-computer-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-network-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-software-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-tweaks-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-terminal-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-settings-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-activities-overview-shortcut', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-logout-button', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-lock-button', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-external-devices', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-bookmarks', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::show-suspend-button', this._redisplayRightSide.bind(this)),
            this._settings.connect('changed::menu-height', this._updateMenuHeight.bind(this)),
            this._settings.connect('changed::reload-theme',this._reloadExtension.bind(this)),
            this._settings.connect('changed::pinned-app-list',this._updateFavorites.bind(this)),
            this._settings.connect('changed::enable-pinned-apps',this._updateMenuDefaultView.bind(this)),
        ];
    }
    toggleMenus(){
        if(this._settings.get_boolean('multi-monitor')){
            let screen = Gdk.Screen.get_default();
            //global.log( global.get_pointer());
            let pointer = global.get_pointer();
            let currentMonitor = screen.get_monitor_at_point(pointer[0],pointer[1]);
            for(let i = 0;i<screen.get_n_monitors();i++){
                if(i==currentMonitor)
                    this.currentMonitorIndex=i;
            }
            //close current menus that are open on monitors other than current monitor
            for (let i = 0; i < this._settingsControllers.length; i++) {
                if(i!=this.currentMonitorIndex){
                if(this._settingsControllers[i]._menuButton.leftClickMenu.isOpen)
                    this._settingsControllers[i]._menuButton.toggleMenu();
                if(this._settingsControllers[i]._menuButton.rightClickMenu.isOpen)
                    this._settingsControllers[i]._menuButton.toggleRightClickMenu();
                }
            }  
            //toggle menu on current monitor
            for (let i = 0; i < this._settingsControllers.length; i++) {
                if(i==this.currentMonitorIndex)
                    this._settingsControllers[i]._menuButton.toggleMenu();
            }   
        }
        else {
            //global.log("no dash to panel")
            this._menuButton.toggleMenu();
        }
    }
    _reloadExtension(){
        if(this._settings.get_boolean('reload-theme') == true){
            Main.loadTheme();
            this._settings.set_boolean('reload-theme',false);
        }
    }
    _enableCustomArcMenu() {
        this._menuButton.updateStyle();
    }
    _updateMenuHeight(){
        this._menuButton.updateHeight();
    }
    _updateFavorites(){
        this._menuButton._loadFavorites();
        if(this._menuButton.currentMenu == Constants.CURRENT_MENU.FAVORITES)
           this._menuButton._displayFavorites();
    }
    _updateMenuDefaultView(){
        if(this._settings.get_boolean('enable-pinned-apps'))
            this._menuButton._displayFavorites();
        else
            this._menuButton._displayCategories();
    }
    _redisplayRightSide(){
        this._menuButton._redisplayRightSide();
    }
    _updateHotCornerManager() {
        if (this._settings.get_boolean('disable-activities-hotcorner')) {
            this._hotCornerManager.disableHotCorners();
        } else {
            this._hotCornerManager.enableHotCorners();
        }
    }

    _updateHotKeyBinder() {
        if(this.isMainPanel){
            this._keybindingManager.unbind('menu-keybinding-text');
            this._menuHotKeybinder.disableHotKey();
            let hotKeyPos = this._settings.get_enum('menu-hotkey');

            if (hotKeyPos==3) {
                this._keybindingManager.bind('menu-keybinding-text', 'menu-keybinding',
                    () => {
                        this.toggleMenus();    
                    });
            }
            else if (hotKeyPos !== Constants.HOT_KEY.Undefined ) {
                let hotKey = Constants.HOT_KEY[hotKeyPos];
                this._menuHotKeybinder.enableHotKey(hotKey);
            }        
        } 
    }

    // Place the menu button to main panel as specified in the settings
    _setButtonPosition() {
        if (this._isButtonEnabled()) {
            this._removeMenuButtonFromMainPanel();
            this._addMenuButtonToMainPanel();
        }
    }

    // Change the menu button appearance as specified in the settings
    _setButtonAppearance() {
        let menuButtonWidget = this._menuButton.getWidget();
        switch (this._settings.get_enum('menu-button-appearance')) {
            case Constants.MENU_APPEARANCE.Text:
                menuButtonWidget.hidePanelIcon();
                menuButtonWidget.showPanelText();
                break;
            case Constants.MENU_APPEARANCE.Icon_Text:
                menuButtonWidget.hidePanelIcon();
                menuButtonWidget.hidePanelText();
                menuButtonWidget.showPanelIcon();
                menuButtonWidget.showPanelText();
                break;
            case Constants.MENU_APPEARANCE.Text_Icon:
                menuButtonWidget.hidePanelIcon();
                menuButtonWidget.hidePanelText();
                menuButtonWidget.showPanelText();
                menuButtonWidget.showPanelIcon();
                break;
            case Constants.MENU_APPEARANCE.Icon: /* falls through */
            default:
                menuButtonWidget.hidePanelText();
                menuButtonWidget.showPanelIcon();
        }
        this._setMenuButtonArrow();
    }

    _setMenuButtonArrow() {
        let menuButtonWidget = this._menuButton.getWidget();
        if (this._settings.get_boolean('enable-menu-button-arrow')) {
            menuButtonWidget.hideArrowIcon();
            menuButtonWidget.showArrowIcon();
        } else {
            menuButtonWidget.hideArrowIcon();
        }
    }

    // Update the text of the menu button as specified in the settings
    _setButtonText() {
        // Update the text of the menu button
        let menuButtonWidget = this._menuButton.getWidget();
        let label = menuButtonWidget.getPanelLabel();

        switch (this._settings.get_enum('menu-button-text')) {
            case Constants.MENU_BUTTON_TEXT.Custom:
                let customTextLabel = this._settings.get_string('custom-menu-button-text');
                label.set_text(customTextLabel);
                break;
            case Constants.MENU_BUTTON_TEXT.System: /* falls through */
            default:
                let systemTextLabel = _('Applications');
                label.set_text(systemTextLabel);
        }
    }

    // Update the icon of the menu button as specified in the settings
    _setButtonIcon() {
        let iconFilepath = this._settings.get_string('custom-menu-button-icon');
        let menuButtonWidget = this._menuButton.getWidget();
        let stIcon = menuButtonWidget.getPanelIcon();

        switch (this._settings.get_enum('menu-button-icon')) {
            case Constants.MENU_BUTTON_ICON.Custom:
                if (GLib.file_test(iconFilepath, GLib.FileTest.EXISTS)) {
                    stIcon.set_gicon(Gio.icon_new_for_string(iconFilepath));
                    break;
                } /* falls through */
            case Constants.MENU_BUTTON_ICON.Arc_Menu:
                let arcMenuIconPath = Me.path + Constants.MENU_ICON_PATH.Arc_Menu;
                if (GLib.file_test(arcMenuIconPath, GLib.FileTest.EXISTS)) {
                    stIcon.set_gicon(Gio.icon_new_for_string(arcMenuIconPath));
                    break;
                } /* falls through */
            case Constants.MENU_BUTTON_ICON.System: /* falls through */
            default:
                stIcon.set_icon_name('start-here-symbolic');
        }
    }

    // Update the icon of the menu button as specified in the settings
    _setButtonIconSize() {
        let display = Gdk.Display.get_default();
        let primaryMonitor =display.get_monitor(0);
        let scaleFactor = primaryMonitor.get_scale_factor();
        //let scaleFactor = St.ThemeContext.get_for_stage(global.stage).scale_factor;
        let menuButtonWidget = this._menuButton.getWidget();
        let stIcon = menuButtonWidget.getPanelIcon();
        let iconSize = this._settings.get_double('custom-menu-button-icon-size');
        let size = iconSize * scaleFactor;
        stIcon.set_icon_size(size);
    }

    // Get the current position of the menu button and its associated position order
    _getMenuPositionTuple() {
        switch (this._settings.get_enum('position-in-panel')) {
            case Constants.MENU_POSITION.Center:
                return ['center', 0];
            case Constants.MENU_POSITION.Right:
                return ['right', -1];
            case Constants.MENU_POSITION.Left: /* falls through */
            default:
                return ['left', 0];
        }
    }

    // Check if the activities button is present on the main panel
    _isActivitiesButtonPresent() {
        // Thanks to lestcape @github.com for the refinement of this method.
        return (this._activitiesButton &&
            this._activitiesButton.container &&
            this.panel._leftBox.contains(this._activitiesButton.container));
    }

    // Remove the activities button from the main panel
    _removeActivitiesButtonFromMainPanel() {
        if (this._isActivitiesButtonPresent()) {
            this.panel._leftBox.remove_child(this._activitiesButton.container);
        }
    }

    // Add or restore the activities button on the main panel
    _addActivitiesButtonToMainPanel() {
        if (this.panel == Main.panel && !this._isActivitiesButtonPresent()) {
            // Retsore the activities button at the default position
            this.panel._leftBox.add_child(this._activitiesButton.container);
            this.panel._leftBox.set_child_at_index(this._activitiesButton.container, 0);
        }
    }

    // Add the menu button to the main panel
    _addMenuButtonToMainPanel() {
        let [menuPosition, order] = this._getMenuPositionTuple();
        this.panel.addToStatusArea('arc-menu', this._menuButton, order, menuPosition);
    }

    // Remove the menu button from the main panel
    _removeMenuButtonFromMainPanel() {
        this.panel.menuManager.removeMenu(this._menuButton.leftClickMenu);
        this.panel.menuManager.removeMenu(this._menuButton.rightClickMenu);
        this.panel.statusArea['arc-menu'] = null;
    }

    // Enable the menu button
    enableButton() {
        this._removeActivitiesButtonFromMainPanel(); // disable the activities button
        this._addMenuButtonToMainPanel();
    }

    // Disable the menu button
    _disableButton() {
        this._removeMenuButtonFromMainPanel();
        this._addActivitiesButtonToMainPanel(); // restore the activities button
        this._menuButton._onDestroy();
    }

    _isButtonEnabled() {
        return this.panel.statusArea['arc-menu'] !== null;
    }

    // Destroy this object
    destroy() {
        this.settingsChangeIds.forEach(id => this._settings.disconnect(id));
        
        // Clean up and restore the default behaviour
        if (this._isButtonEnabled()) {
            this._disableButton();
        }
        this._hotCornerManager.destroy();
        if(this.isMainPanel){
            this._menuHotKeybinder.destroy();
            this._keybindingManager.destroy();
        }
        this._settings = null;
        this._activitiesButton = null;
        this._menuButton = null;
    }
};
