/*
 * Arc Menu: The new applications menu for Gnome 3.
 *
 * Original work: Copyright (C) 2015 Giovanni Campagna
 * Modified work: Copyright (C) 2016-2017 Zorin OS Technologies Ltd.
 * Modified work: Copyright (C) 2017 LinxGem33
 * Modified work: Copyright (C) 2017 Alexander Rüedlinger
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
 *
 *
 * Credits:
 * This file is based on code from the Gnome Applications Menu Extension by Giovanni Campagna.
 * Some code was also referenced from the Gnome Places Status Indicator by Giovanni Campagna
 * and Gno-Menu by The Panacea Projects.
 * These extensions can be found at the following URLs:
 * http://git.gnome.org/browse/gnome-shell-extensions/
 * https://github.com/The-Panacea-Projects/Gnomenu
 */


// Import Libraries
const Main = imports.ui.main;
const Dash = imports.ui.dash;
const ExtensionSystem = imports.ui.extensionSystem;
const ExtensionUtils = imports.misc.extensionUtils;
const AppDisplay = imports.ui.appDisplay;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const MW = Me.imports.menuWidgets;
const Controller = Me.imports.controller;
const Convenience = Me.imports.convenience;

// Initialize panel button variables
let settings;
let settingsControllers;
let oldGetAppFromSource;
let extensionChangedId;

// Initialize menu language translations
function init(metadata) {
    Convenience.initTranslations(Me.metadata['gettext-domain']);      
}

// Enable the extension
function enable() {
    settings = Convenience.getSettings(Me.metadata['settings-schema']);
    settings.connect('changed::multi-monitor', () => _onMultiMonitorChange());
    settingsControllers = [];

    oldGetAppFromSource = Dash.getAppFromSource;
    Dash.getAppFromSource = getAppFromSource;

    _enableButtons();
    
    // dash to panel might get enabled after Arc-Menu
    extensionChangedId = ExtensionSystem.connect('extension-state-changed', (data, extension) => {
        if (extension.uuid === 'dash-to-panel@jderose9.github.com' && extension.state === 1) {
            _connectDtpSignals();
            _enableButtons();
        }
    });

    // listen to dash to panel if it is compatible and already enabled
    _connectDtpSignals();
}

// Disable the extension
function disable() {
    ExtensionSystem.disconnect(extensionChangedId);
    extensionChangedId = 0;

    _disconnectDtpSignals();
    
    settingsControllers.forEach(sc => _disableButton(sc));
    settingsControllers = null;

    settings.run_dispose();
    settings = null;
    
    Dash.getAppFromSource = oldGetAppFromSource;
    oldGetAppFromSource = null;
}

function getAppFromSource(source) {
    if (source instanceof AppDisplay.AppIcon) {
        return source.app;
    } else if (source instanceof MW.ApplicationMenuItem) {
        return source._app;
    } else {
        return null;
    }
}

function _connectDtpSignals() {
    if (global.dashToPanel) {
        global.dashToPanel._amPanelsCreatedId = global.dashToPanel.connect('panels-created', () => _enableButtons());
    }
}

function _disconnectDtpSignals() {
    if (global.dashToPanel && global.dashToPanel._amPanelsCreatedId) {
        global.dashToPanel.disconnect(global.dashToPanel._amPanelsCreatedId);
        delete global.dashToPanel._amPanelsCreatedId;
    }
}

function _onMultiMonitorChange() {
    if (!settings.get_boolean('multi-monitor')) {
        for (let i = settingsControllers.length - 1; i >= 0; --i) {
            let sc = settingsControllers[i];

            if (sc.panel != Main.panel) {
                _disableButton(sc, 1);
            }
        }
    }

    _enableButtons();
}

function _enableButtons() {
    (settings.get_boolean('multi-monitor') && global.dashToPanel ? 
     global.dashToPanel.panels.map(pw => pw.panel) : 
     [Main.panel]).forEach(panel => {
        if (settingsControllers.filter(sc => sc.panel == panel).length)
            return;

        // Create a Menu Controller that is responsible for controlling
        // and managing the menu as well as the menu button.
        let isMainPanel = panel == Main.panel;
        let settingsController = new Controller.MenuSettingsController(settings, settingsControllers, panel, isMainPanel);
        
        if (!isMainPanel) {
            panel._amDestroyId = panel.connect('destroy', () => extensionChangedId ? _disableButton(settingsController, 1) : null);
        }

        settingsController.enableButton();
        settingsController.bindSettingsChanges();
        settingsControllers.push(settingsController);
    });
}

function _disableButton(controller, remove) {
    if (controller.panel._amDestroyId) {
        controller.panel.disconnect(controller.panel._amDestroyId);
        delete controller.panel._amDestroyId;
    }

    controller.destroy();
    
    if (remove) {
        settingsControllers.splice(settingsControllers.indexOf(controller), 1);
    }
}
