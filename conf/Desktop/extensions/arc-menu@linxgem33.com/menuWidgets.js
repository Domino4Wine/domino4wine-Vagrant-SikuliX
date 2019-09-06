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
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;
const Signals = imports.signals;
const AccountsService = imports.gi.AccountsService;
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const Util = imports.misc.util;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Constants = Me.imports.constants;
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;
const DND = imports.ui.dnd;
const Dash = imports.ui.dash;
const LoginManager = imports.misc.loginManager;
const Gdk = imports.gi.Gdk;
const Gtk = imports.gi.Gtk;
const AppFavorites = imports.ui.appFavorites;

const SWITCHEROO_BUS_NAME = 'net.hadess.SwitcherooControl';
const SWITCHEROO_OBJECT_PATH = '/net/hadess/SwitcherooControl';
const SwitcherooProxyInterface = '<node> \
<interface name="net.hadess.SwitcherooControl"> \
  <property name="HasDualGpu" type="b" access="read"/> \
</interface> \
</node>';
const SwitcherooProxy = Gio.DBusProxy.makeProxyWrapper(SwitcherooProxyInterface);
// Menu Size variables
const LARGE_ICON_SIZE = 34;
const MEDIUM_ICON_SIZE = 25;
const SMALL_ICON_SIZE = 16;
const USER_AVATAR_SIZE = 28;
const TOOLTIP_LABEL_SHOW_TIME = 0.15;
const TOOLTIP_LABEL_HIDE_TIME = 0.1;

function setIconAsync(icon, gioFile, fallback_icon_name) {
    gioFile.load_contents_async(null, function (source, result) {
        try {
            let bytes = source.load_contents_finish(result)[1];
            icon.gicon = Gio.BytesIcon.new(bytes);
        } catch (err) {
            icon.icon_name = fallback_icon_name;
        }
    });
}
var AppRightClickMenu = class extends PopupMenu.PopupMenu {
    constructor(actor,app,button, isPinnedApp){
        super(actor,.45,St.Side.TOP);
        this._button = button;
        this._settings = this._button._settings;
        this._app = app;
        this.isPinnedApp = isPinnedApp;
        //this.actor.style_class = 'app-right-click-boxpointer';
        //this.actor.add_style_class_name('app-right-click');
        //this.actor.width=250;
        
        this.discreteGpuAvailable = false;
        Gio.DBus.system.watch_name(SWITCHEROO_BUS_NAME,
            Gio.BusNameWatcherFlags.NONE,
            this._switcherooProxyAppeared.bind(this),
            () => {
                this._switcherooProxy = null;
                this._updateDiscreteGpuAvailable();
            });
        this.redisplay();
    }
    _updateDiscreteGpuAvailable() {
        if (!this._switcherooProxy)
            this.discreteGpuAvailable = false;
        else
            this.discreteGpuAvailable = this._switcherooProxy.HasDualGpu;
    }

    _switcherooProxyAppeared() {
        this._switcherooProxy = new SwitcherooProxy(Gio.DBus.system, SWITCHEROO_BUS_NAME, SWITCHEROO_OBJECT_PATH,
            (proxy, error) => {
                if (error) {
                    log(error.message);
                    return;
                }
                this._updateDiscreteGpuAvailable();
            });
    }
    redisplay(){
        this.removeAll();
        let addStyle = this._settings.get_boolean('enable-custom-arc-menu');
        if(addStyle){
            //this.actor.style_class = 'app-right-click-boxpointer';
            //this.actor.add_style_class_name('app-right-click');
            this.actor.style_class = 'arc-right-click-boxpointer';
            this.actor.add_style_class_name('arc-right-click');
            this.actor.set_name('rightClickMenu');
        }
        else{
            this.actor.style_class = 'popup-menu-boxpointer';
            this.actor.add_style_class_name('popup-menu');   
        }
        if(this._app instanceof Shell.App){
            this.appInfo = this._app.get_app_info();
            let actions = this.appInfo.list_actions();
            
            let windows = this._app.get_windows().filter(
                w => !w.skip_taskbar
            );

            if (windows.length > 0){    
                let item = new PopupMenu.PopupMenuItem(_("Current Windows:"),{reactive:false,can_focus:false});
                item.actor.add_style_class_name('inactive');  
                this.addMenuItem(item);
            }

            windows.forEach(window => {
                let title = window.title ? window.title
                                        : this._app.get_name();
                let item = this._appendMenuItem(title);
                item.connect('activate', () => {
                    this.emit('activate-window', window);
                    Main.activateWindow(window);
                    this._button.leftClickMenu.toggle();
                });
            });

            if (!this._app.is_window_backed()) {
                this._appendSeparator();
                if (this._app.can_open_new_window() &&
                    !actions.includes('new-window')) {
                    this._newWindowMenuItem = this._appendMenuItem(_("New Window"));
                    this._newWindowMenuItem.connect('activate', () => {
                        this._app.open_new_window(-1);
                        this.emit('activate-window', null);
                        this._button.leftClickMenu.toggle(); 
                    });  
                }
                if (this.discreteGpuAvailable &&
                    this._app.state == Shell.AppState.STOPPED &&
                    !actions.includes('activate-discrete-gpu')) {
                    this._onDiscreteGpuMenuItem = this._appendMenuItem(_("Launch using Dedicated Graphics Card"));
                    this._onDiscreteGpuMenuItem.connect('activate', () => {
                        this._app.launch(0, -1, true);
                        this.emit('activate-window', null);
                        this._button.leftClickMenu.toggle();
                    });
                }
    
                for (let i = 0; i < actions.length; i++) {
                    let action = actions[i];
                    let item = this._appendMenuItem(this.appInfo.get_action_name(action));
                    item.connect('activate', (emitter, event) => {
                        this._app.launch_action(action, event.get_time(), -1);
                        this.emit('activate-window', null);
                        this._button.leftClickMenu.toggle();
                    });
                }

                let canFavorite = global.settings.is_writable('favorite-apps');
                if (canFavorite) {
                    this._appendSeparator();
                    let isFavorite = AppFavorites.getAppFavorites().isFavorite(this._app.get_id());
                    if (isFavorite) {
                        let item = this._appendMenuItem(_("Remove from Favorites"));
                        item.connect('activate', () => {
                            let favs = AppFavorites.getAppFavorites();
                            favs.removeFavorite(this._app.get_id());
                        });
                    } else {
                        let item = this._appendMenuItem(_("Add to Favorites"));
                        item.connect('activate', () => {
                            let favs = AppFavorites.getAppFavorites();
                            favs.addFavorite(this._app.get_id());
                        });
                    }
                }
                let pinnedApps = this._settings.get_strv('pinned-app-list');
                let pinnedAppID=[];
                for(let i=2;i<pinnedApps.length;i+=3){
                    pinnedAppID.push(pinnedApps[i]);  
                }
                let match = pinnedAppID.find( (element)=>{
                   // global.log(this._app.get_id());
                    //global.log(element);
                    return element == this._app.get_id();
                });
                //global.log(this._app.get_id());
                if(this.isPinnedApp || match){ //if app is pinned add Unpin
                    let item = new PopupMenu.PopupMenuItem(_("Unpin from Arc Menu"));  
                    item.connect('activate', ()=>{
                        for(let i = 0;i<pinnedApps.length;i+=3){
                            if(pinnedApps[i+2]==this._app.get_id()){
                                pinnedApps.splice(i,3);
                                this._button.applicationsBox.remove_actor(this._button.favoritesArray[ i / 3 ].actor)
                                this._settings.set_strv('pinned-app-list',pinnedApps);
                                break;
                            }
                        }
                    });      
                    this.addMenuItem(item);
                }
                else{ //if app is not pinned add pin
                    let item = new PopupMenu.PopupMenuItem(_("Pin to Arc Menu"));   
                    item.connect('activate', ()=>{
                        pinnedApps.push(this.appInfo.get_display_name());
                        pinnedApps.push(this.appInfo.get_icon().to_string());
                        pinnedApps.push(this._app.get_id());
                        this._settings.set_strv('pinned-app-list',pinnedApps);
                    });      
                    this.addMenuItem(item);
                }
                if (Shell.AppSystem.get_default().lookup_app('org.gnome.Software.desktop')) {
                    this._appendSeparator();
                    let item = this._appendMenuItem(_("Show Details"));
                    item.connect('activate', () => {
                        let id = this._app.get_id();
                        let args = GLib.Variant.new('(ss)', [id, '']);
                        Gio.DBus.get(Gio.BusType.SESSION, null, (o, res) => {
                            let bus = Gio.DBus.get_finish(res);
                            bus.call('org.gnome.Software',
                                    '/org/gnome/Software',
                                    'org.gtk.Actions', 'Activate',
                                    GLib.Variant.new('(sava{sv})',
                                                    ['details', [args], null]),
                                    null, 0, -1, null, null);
                            this._button.leftClickMenu.toggle();
                        });
                    });
                }
            }
        }  
        else{  //if pinned custom shortcut add unpin option to menu
            if(this.isPinnedApp){
                this._appendSeparator()  ;
                let item = new PopupMenu.PopupMenuItem(_("Unpin from Arc Menu"));   
                item.connect('activate', ()=>{
                    let pinnedApps = this._settings.get_strv('pinned-app-list');
                        for(let i = 0;i<pinnedApps.length;i+=3){
                            if(pinnedApps[i+2]==this._app){
                                pinnedApps.splice(i,3);
                                this._button.applicationsBox.remove_actor(this._button.favoritesArray[ i / 3 ].actor)
                                this._button.favoritesArray.splice(i / 3, 1);
                                this._settings.set_strv('pinned-app-list',pinnedApps);
                                break;
                            }
                        }
                });      
                this.addMenuItem(item);
            }
        }   
    }

    _appendSeparator() {
        let separator = new PopupMenu.PopupSeparatorMenuItem();
        separator.actor.style_class='app-right-click-sep';
        separator._separator.style_class='';
        this.addMenuItem(separator);
    }

    _appendMenuItem(labelText) {
        let item = new PopupMenu.PopupMenuItem(labelText);
        this.addMenuItem(item);
        return item;
    }
    _onKeyPress(actor, event) {
        // Disable toggling the menu by keyboard
        // when it cannot be toggled by pointer
        if (!actor.reactive)
            return Clutter.EVENT_PROPAGATE;

        let navKey;
        switch (this._boxPointer.arrowSide) {
        case St.Side.TOP:
            navKey = Clutter.KEY_Down;
            break;
        case St.Side.BOTTOM:
            navKey = Clutter.KEY_Up;
            break;
        case St.Side.LEFT:
            navKey = Clutter.KEY_Right;
            break;
        case St.Side.RIGHT:
            navKey = Clutter.KEY_Left;
            break;
        }

        let state = event.get_state();

        // if user has a modifier down (except capslock)
        // then don't handle the key press here
        state &= ~Clutter.ModifierType.LOCK_MASK;
        state &= Clutter.ModifierType.MODIFIER_MASK;

        if (state)
            return Clutter.EVENT_PROPAGATE;

        let symbol = event.get_key_symbol();
        if (symbol == Clutter.KEY_space || symbol == Clutter.KEY_Return) {
            this.toggle();
            return Clutter.EVENT_STOP;
        } else if (symbol == Clutter.KEY_Escape && this.isOpen) {
            this.close();
            return Clutter.EVENT_STOP;
        } else if (symbol == navKey) {
            if (this.isOpen){
                this.actor.navigate_focus(null, Gtk.DirectionType.TAB_FORWARD, false);
                return Clutter.EVENT_STOP;
            }
            else 
                return Clutter.EVENT_PROPAGATE;
        } else {
            return Clutter.EVENT_PROPAGATE;
        }
    }


};

// Removing the default behaviour which selects a hovered item if the space key is pressed.
// This avoids issues when searching for an app with a space character in its name.
var BaseMenuItem = class extends PopupMenu.PopupBaseMenuItem {
    constructor(button){
        super();
        this._button = button;
        
    }    
    _onKeyPressEvent(actor, event) {
        let symbol = event.get_key_symbol();
        if (symbol == Clutter.KEY_Return ||
            symbol == Clutter.KEY_KP_Enter) {
            this.activate(event);
            return Clutter.EVENT_STOP;
        }
        return Clutter.EVENT_PROPAGATE;
    }
    _onButtonPressEvent(actor, event) {
		
        return Clutter.EVENT_PROPAGATE;
    }

    _onButtonReleaseEvent(actor, event) {
        if(event.get_button()==1){
            this.activate(event);
        }
  	    if(event.get_button()==3){
	    }   
        return Clutter.EVENT_STOP;
    }

};

// Menu item to launch GNOME activities overview
var ActivitiesMenuItem = class extends BaseMenuItem {
    // Initialize the menu item
    constructor(button) {
        super(button);
        this._button = button;
        this._icon = new St.Icon({
            icon_name: 'view-fullscreen-symbolic',
            style_class: 'popup-menu-icon',
            icon_size: SMALL_ICON_SIZE
        });
        this.actor.add_child(this._icon);
        let label = new St.Label({
            text: _("Activities Overview"),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(label);
    }

    // Activate the menu item (Open activities overview)
    activate(event) {
        this._button.leftClickMenu.toggle();
        Main.overview.toggle();
        super.activate(event);
    }
};

/**
 * A class representing a Tooltip.
 */
var Tooltip = class {
    constructor(sourceActor, text, isMenuItem=false, settings) {
        this.sourceActor = sourceActor;
        this.isMenuItem = isMenuItem;
        this._settings = settings;
        this.actor = new St.Label({
            style_class: 'dash-label',
            text: text,
            opacity: 0
        });
        this.actor.set_name('tooltip-menu-item');
        global.stage.add_actor(this.actor);
        this.actor.show();
        this.actor.connect('destroy', this._onDestroy.bind(this));
        this._useTooltips = ! this._settings.get_boolean('disable-tooltips');
        this.toggleID = this._settings.connect('changed::disable-tooltips', this.disableTooltips.bind(this));
    }
    disableTooltips() {
        this._useTooltips = ! this._settings.get_boolean('disable-tooltips');
    }
    

    show() {
        if(this._useTooltips){
            let [stageX, stageY] = this.sourceActor.get_transformed_position();
            let [width, height] = this.sourceActor.get_transformed_size();
            let y = this.isMenuItem ? stageY + height: stageY -Math.round(height / 1.24);
            
            let x = this.isMenuItem ? stageX + Math.round(width / 2)  : stageX - Math.round((this.actor.get_width() - width) / 2);

            this.actor.show();
            this.actor.set_position(x, y);
            Tweener.addTween(this.actor, {
                opacity: 255,
                time: TOOLTIP_LABEL_SHOW_TIME,
                transition: 'easeOutQuad'
            });
        }
    }

    hide() {
        if(this._useTooltips){
            Tweener.addTween(this.actor, {
                opacity: 0,
                time: TOOLTIP_LABEL_HIDE_TIME,
                transition: 'easeOutQuad',
                onComplete: () => {
                    this.actor.hide();
                }
            });
        }
    }

    _onDestroy() {
        global.stage.remove_actor(this.actor);
        this._settings.disconnect(this.toggleID);
    }
};


/**
 * A base class for custom session buttons.
 */
var SessionButton = class {
    constructor(button, accessible_name, icon_name) {
        this._button = button;

        this.actor = new St.Button({
            reactive: true,
            can_focus: true,
            track_hover: true,
            accessible_name: accessible_name,
            style_class: 'system-menu-action'
        });

        this.tooltip = new Tooltip(this.actor, accessible_name, false, this._button._settings);
        this.tooltip.hide();
        this.actor.child = new St.Icon({ 
            icon_name: icon_name,
            icon_size: SMALL_ICON_SIZE 
        });
        this.actor.connect('clicked', this._onClick.bind(this));
        this.actor.connect('notify::hover', this._onHover.bind(this));
    }


    _onClick() {
        this._button.leftClickMenu.toggle();
        this.activate();
    }

    activate() {
        // Button specific action
    }

    _onHover() {
        if (this.actor.hover) { // mouse pointer hovers over the button
            this.tooltip.show();
        } else { // mouse pointer leaves the button area
            this.tooltip.hide();
        }
    }
};

// Power Button
var PowerButton = class extends SessionButton {
    // Initialize the button
    constructor(button) {
        super(button, _("Power Off"), 'system-shutdown-symbolic');
    }

    // Activate the button (Shutdown)
    activate() {
        this._button._session.ShutdownRemote(0);
    }
};

// Logout Button
var LogoutButton = class extends SessionButton {
    // Initialize the button
    constructor(button) {
        super(button, _("Log Out"), 'application-exit-symbolic');
    }

    // Activate the button (Logout)
    activate() {
        this._button._session.LogoutRemote(0);
    }
};

// Suspend Button
var SuspendButton = class extends SessionButton {
    // Initialize the button
    constructor(button) {
        super(button, _("Suspend"), 'media-playback-pause-symbolic');
    }

    // Activate the button (Suspend the system)
    activate() {
        let loginManager = LoginManager.getLoginManager();
        loginManager.canSuspend(function (result) {
            if (result) {
                loginManager.suspend();
            }
        }.bind(this));
    }
};

// Lock Screen Button
var LockButton = class extends SessionButton {
    // Initialize the button
    constructor(button) {
        super(button, _("Lock"), 'changes-prevent-symbolic');
    }

    // Activate the button (Lock the screen)
    activate() {
        Main.screenShield.lock(true);
    }
};

// Menu item to go back to category view
var BackMenuItem = class extends BaseMenuItem {
    // Initialize the button
    constructor(button) {
        super(button);
        this._button = button;
        this._icon = new St.Icon({
            icon_name: 'go-previous-symbolic',
            style_class: 'popup-menu-icon',
            icon_size: 24
        });
        this.actor.add_child(this._icon);
        let backLabel = new St.Label({
            text: _("Back"),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(backLabel);
    }

    // Activate the button (go back to category view)
    activate(event) {
        //this._button.selectCategory(null);
        this._button._clearApplicationsBox();
        if(this._button.currentMenu == Constants.CURRENT_MENU.SEARCH_RESULTS)
        { 
        	if(this._button._settings.get_boolean('enable-pinned-apps')){
         		this._button.currentMenu = Constants.CURRENT_MENU.FAVORITES;
            		this._button.resetSearch();
            		this._button._displayFavorites();
        	}
        	else {
        		this._button.currentMenu = Constants.CURRENT_MENU.CATEGORIES;
            		this._button.resetSearch();
            		this._button._displayCategories();
        	}
           
        }
        else if(this._button.currentMenu == Constants.CURRENT_MENU.CATEGORIES)
        { 
 	    if(this._button._settings.get_boolean('enable-pinned-apps')){
            	this._button.currentMenu = Constants.CURRENT_MENU.FAVORITES;
            	this._button._displayFavorites();
            }
            
        }
        else if(this._button.currentMenu == Constants.CURRENT_MENU.CATEGORY_APPLIST)
        {
            this._button.currentMenu = Constants.CURRENT_MENU.CATEGORIES;
            this._button._displayCategories();
        }
        super.activate(event);
    }
};

// Menu item to view all apps
var ViewAllPrograms = class extends BaseMenuItem {
    // Initialize the button
    constructor(button) {
        super(button);
        this._button = button;
        this._icon = new St.Icon({
            icon_name: 'go-next-symbolic',
            style_class: 'popup-menu-icon',
            icon_size: 24,
             x_align: St.Align.START
        });
        this.actor.add_child(this._icon);
        let backLabel = new St.Label({
            text: _("All Programs"),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(backLabel);
    }

    // Activate the button (go back to category view)
    activate(event) {
      this._button._clearApplicationsBox();
      if(this._button._settings.get_boolean('enable-pinned-apps')){
	      this._button._displayCategories();
	      this._button.currentMenu = Constants.CURRENT_MENU.CATEGORIES;
      }
      else{ 
       	  this._button._displayAllApps();
          this._button.currentMenu = Constants.CURRENT_MENU.SEARCH_RESULTS;
      }
      super.activate(event);
    }
};

// Menu shortcut item class
var ShortcutMenuItem = class extends BaseMenuItem {
    // Initialize the menu item
    constructor(button, name, icon, command) {
        super(button);
        this._button = button;
        this._command = command;
        this._icon = new St.Icon({
            icon_name: icon,
            style_class: 'popup-menu-icon',
            icon_size: SMALL_ICON_SIZE
        });
        this.actor.add_child(this._icon);
        let label = new St.Label({
            text: name, y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(label);
    }

    // Activate the menu item (Launch the shortcut)
    activate(event) {
        Util.spawnCommandLine(this._command);
        this._button.leftClickMenu.toggle();
        super.activate(event);
    }
};

// Menu item which displays the current user
var UserMenuItem = class extends BaseMenuItem {
    // Initialize the menu item
    constructor(button) {
        super(button);
        this._button = button;
        let username = GLib.get_user_name();
        this._user = AccountsService.UserManager.get_default().get_user(username);
        this.iconBin =  new St.Bin({ style_class: 'menu-user-avatar',
            width: USER_AVATAR_SIZE,
            height: USER_AVATAR_SIZE });
        this.actor.add_child(this.iconBin);
        this._userLabel = new St.Label({
            text: GLib.get_real_name(),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(this._userLabel);
        this._userLoadedId = this._user.connect('notify::is-loaded', this._onUserChanged.bind(this));
        this._userChangedId = this._user.connect('changed', this._onUserChanged.bind(this));
        this.actor.connect('destroy', this._onDestroy.bind(this));
        this._onUserChanged();
    }

    // Activate the menu item (Open user account settings)
    activate(event) {
        Util.spawnCommandLine("gnome-control-center user-accounts");
        this._button.leftClickMenu.toggle();
        super.activate(event);
    }

    // Handle changes to user information (redisplay new info)
    _onUserChanged() {
        if (this._user.is_loaded) {
            this._userLabel.set_text(this._user.get_real_name());
                let iconFileName = this._user.get_icon_file();
                if (iconFileName && !GLib.file_test(iconFileName ,GLib.FileTest.EXISTS))
                    iconFileName = null;

                if (iconFileName) {
                    let iconFile = Gio.file_new_for_path(iconFileName);
                    this.iconBin.child = null;
                    this.iconBin.style = 'background-image: url("%s");'.format(iconFileName);
                } else {
                    this.iconBin.style = null;
                    this.iconBin.child = new St.Icon({ icon_name: 'avatar-default-symbolic',
                                                     icon_size: USER_AVATAR_SIZE});
                }
        
                //setIconAsync(this._userIcon, iconFile, 'avatar-default-symbolic');
        }
        
    }

    // Destroy the menu item
    _onDestroy() {
        if (this._userLoadedId != 0) {
            this._user.disconnect(this._userLoadedId);
            this._userLoadedId = 0;
        }
        if (this._userChangedId != 0) {
            this._user.disconnect(this._userChangedId);
            this._userChangedId = 0;
        }
    }
};
// Menu pinned apps/favorites item class
var FavoritesMenuItem = class extends BaseMenuItem {
    // Initialize the menu item
    constructor(button, name, icon, command) {
        super(button);
        this._button = button;
        this._command = command;
        this._iconPath = icon;
        this._name = name == "Arc Menu Settings" ? _("Arc Menu Settings") : name;
        this._name = name == "Terminal" ? _("Terminal") : name;
        this._icon = new St.Icon({
            gicon: Gio.icon_new_for_string(icon),
            style_class: 'popup-menu-icon',
            icon_size: MEDIUM_ICON_SIZE
        })
        this.actor.add_child(this._icon);
 
        let label = new St.Label({
            text: _(this._name), y_expand: true, x_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(label);
        this._draggable = DND.makeDraggable(this.actor);
        this.isDraggableApp = true;
	    this._draggable.connect('drag-begin', this._onDragBegin.bind(this));
        this._draggable.connect('drag-cancelled', this._onDragCancelled.bind(this));
        this._draggable.connect('drag-end', this._onDragEnd.bind(this));
        
        let sys = Shell.AppSystem.get_default();
        this.app = sys.lookup_app(this._command);
        if(this._command == "firefox.desktop" && !this.app){
            //check if Firefox ESR
            this.app = sys.lookup_app("firefox-esr.desktop");
            if(this.app){
                this._iconPath = "firefox-esr";
                this._command = "firefox-esr.desktop";
                this._icon.gicon = Gio.icon_new_for_string("firefox-esr");
            }
        }
        this.rightClickMenu = new AppRightClickMenu(this.actor,this.app ? this.app : this._command ,this._button,true);

        
        this.rightClickMenu.actor.hide();
        Main.uiGroup.add_actor(this.rightClickMenu.actor);
        //this.actor.connect('enter-event', this.enterEvent.bind(this));
    }
    enterEvent(){
        if(this._button.appMenuManager.activeMenu!=this.rightClickMenu)
            this._button.appMenuManager.activeMenu.toggle();
      
    }
    
    _onButtonReleaseEvent(actor, event) {
        if(event.get_button()==1){
                this.activate(event); 
        }
  	    if(event.get_button()==3){
            this._button.appMenuManager.addMenu(this.rightClickMenu);
            if(!this.rightClickMenu.isOpen)
                this.rightClickMenu.redisplay();
            this.rightClickMenu.toggle();
	    }   
        return Clutter.EVENT_STOP;
    }
   _onDragBegin() {   
        this._dragMonitor = {
            dragMotion: (this, this._onDragMotion.bind(this))
        };
        DND.addDragMonitor(this._dragMonitor); 
        DND.SNAP_BACK_ANIMATION_TIME = 0;
        this.dragStartY = (this._draggable._dragStartY); 
        this._emptyDropTarget = new Dash.EmptyDropTargetItem();
        this._emptyDropTarget.setChild(new St.Bin({ style_class: 'arc-empty-dash-drop-target' }));  

        let p = this._button.applicationsBox.get_transformed_position();
        this.posY= p[1];        
        this.rowHeight = this._button.applicationsBox.get_child_at_index(0).height;

        this.startIndex=0;
        for(let i = 0; i< this._button.applicationsBox.get_children().length;i++){
        if(this.actor == this._button.applicationsBox.get_child_at_index(i))
            this.startIndex=i;
        }
        this._button.applicationsBox.insert_child_at_index(this._emptyDropTarget, this.startIndex);
            
        Main.overview.beginItemDrag(this);  
        this._emptyDropTarget.show(true); 

    }
    _onDragMotion(dragEvent) {
    	this.newIndex = Math.floor((this._draggable._dragY - this.posY) / (this.rowHeight));
    	if(this.newIndex > this._button.applicationsBox.get_children().length -1)
            this.newIndex = this._button.applicationsBox.get_children().length -1;
        if(this.newIndex < 0)
            this.newIndex = 0;	
    	if(this._button.applicationsBox.get_child_at_index(this.newIndex) != this._emptyDropTarget){
            this._button.applicationsBox.set_child_at_index(this._emptyDropTarget, this.newIndex);
	    }

	return DND.DragMotionResult.CONTINUE;
    }
    _onDragCancelled() {
       Main.overview.cancelledItemDrag(this);
    }

    _onDragEnd() {    
 	    this._button.applicationsBox.remove_child(this._emptyDropTarget); 
        let index = this.newIndex;
        if(index > this.startIndex)
        	index--;
        if(index > this._button.applicationsBox.get_children().length -1)
        	index = this._button.applicationsBox.get_children().length -1;
         if(index < 0)
            index = 0;	
        if(index != this.startIndex){	
            this._button.applicationsBox.set_child_at_index(this.actor,index);    	
            let temp = this._button.favoritesArray[this.startIndex];
            this._button.favoritesArray.splice(this.startIndex,1);
            this._button.favoritesArray.splice(index,0,temp);
        }
        Main.overview.endItemDrag(this);
        DND.removeDragMonitor(this._dragMonitor);   
        this.emit('saveSettings');	  
    }
    
    getDragActor() {
        return new St.Icon({
            gicon: Gio.icon_new_for_string(this._iconPath),
            style_class: 'popup-menu-icon',
            icon_size: 40
        });
    }

    // Returns the original actor that should align with the actor
    // we show as the item is being dragged.
    getDragActorSource() {
        return this.actor;
    }

    // Activate the menu item (Launch the shortcut)
    activate(event) {
        if(this.app){
            this.app.open_new_window(-1);
        }
            
        else
            Util.spawnCommandLine(this._command);
        if(this._button.appMenuManager.activeMenu)
            this._button.appMenuManager.activeMenu.toggle();
        this._button.leftClickMenu.toggle();
        super.activate(event);
    }
    _onDestroy(){
        if(this._button.appMenuManager.activeMenu)
            this._button.appMenuManager.activeMenu.toggle();    
    }
};
// Menu application item class
var ApplicationMenuItem = class extends PopupMenu.PopupBaseMenuItem {
    // Initialize menu item
    constructor(button, app) {
        super();
        this._app = app;
        this.app = app;
        //global.log(app);
        this._button = button;
        this._iconBin = new St.Bin();
        this.actor.add_child(this._iconBin);

        let appLabel = new St.Label({
            text: app.get_name(),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(appLabel);
        this.actor.label_actor = appLabel;

        let textureCache = St.TextureCache.get_default();
        let iconThemeChangedId = textureCache.connect('icon-theme-changed',
            this._updateIcon.bind(this));
        this.actor.connect('destroy', () => {
            textureCache.disconnect(iconThemeChangedId);
        });
        this._updateIcon();

        let isMenuItem=true;
        if( app.get_description()){
            this.tooltip = new Tooltip(this.actor, app.get_description(),isMenuItem,this._button._settings);
            this.tooltip.hide();
            this.actor.connect('notify::hover', this._onHover.bind(this));
        }
        this._draggable = DND.makeDraggable(this.actor);
        this.isDraggableApp = true;
        this._draggable.connect('drag-begin', this._onDragBegin.bind(this));
        this._draggable.connect('drag-cancelled', this._onDragCancelled.bind(this));
        this._draggable.connect('drag-end', this._onDragEnd.bind(this));

        this.rightClickMenu = new AppRightClickMenu(this.actor,this.app,this._button);

        this.rightClickMenu.actor.hide();
        Main.uiGroup.add_actor(this.rightClickMenu.actor);
    }

    _onButtonReleaseEvent(actor, event) {
        if(event.get_button()==1){
            this.activate(event);
        }
        if(event.get_button()==3){
            this._button.appMenuManager.addMenu(this.rightClickMenu);
            if(!this.rightClickMenu.isOpen)
                this.rightClickMenu.redisplay();
            this.rightClickMenu.toggle();
	    }   
        return Clutter.EVENT_STOP;
    }
    _onHover() {

        if ( this.actor.hover) { // mouse pointer hovers over the button
            this.tooltip.show();
        } else { // mouse pointer leaves the button area
            this.tooltip.hide();
        }
    }
    _onDragBegin() {
        Main.overview.beginItemDrag(this);
    }

    _onDragCancelled() {
        Main.overview.cancelledItemDrag(this);
    }

    _onDragEnd() {
        Main.overview.endItemDrag(this);
    }

    _onKeyPressEvent(actor, event) {
        let symbol = event.get_key_symbol();
        if (symbol == Clutter.KEY_Return ||
            symbol == Clutter.KEY_KP_Enter) {
            this.activate(event);
            return Clutter.EVENT_STOP;
        }
        return Clutter.EVENT_PROPAGATE;
    }

    get_app_id() {
        return this._app.get_id();
    }

    getDragActor() {
        return this._app.create_icon_texture(MEDIUM_ICON_SIZE);
    }

    // Returns the original actor that should align with the actor
    // we show as the item is being dragged.
    getDragActorSource() {
        return this.actor;
    }

    // Activate menu item (Launch application)
    activate(event) {
        if(this._button.appMenuManager.activeMenu)
            this._button.appMenuManager.activeMenu.toggle();
        this._app.open_new_window(-1);
        this._button.leftClickMenu.toggle();
        super.activate(event);
    }

   // Set button as active, scroll to the button
    setActive(active, params) {
        if (active && !this.actor.hover)
            this._button.scrollToButton(this);

        super.setActive(active, params);
    }

    setFakeActive(active) {
        if (active) {
            this._button.scrollToButton(this);
            this.actor.add_style_class_name('selected');
        } else {
            this.actor.remove_style_class_name('selected');
        }
    }

    // Grab the key focus
    grabKeyFocus() {
        this.actor.grab_key_focus();
    }

    // Update the app icon in the menu
    _updateIcon() {
        this._iconBin.set_child(this._app.create_icon_texture(SMALL_ICON_SIZE));
    }
    _onDestroy(){
        if(this._button.appMenuManager.activeMenu)
            this._button.appMenuManager.activeMenu.toggle();
    }
};
var SearchResultItem = class extends PopupMenu.PopupBaseMenuItem {
    // Initialize menu item
    constructor(button, app) {
        super();
        this._button = button;
        this.app =app;
        this.rightClickMenu = new AppRightClickMenu(this.actor,this.app,this._button);
        this.rightClickMenu.actor.hide();
        Main.uiGroup.add_actor(this.rightClickMenu.actor);
  
    }
  
    _onButtonReleaseEvent(actor, event) {
        if(event.get_button()==1){
            this.activate(event);
        }
        if(event.get_button()==3){
            this._button.appMenuManager.addMenu(this.rightClickMenu);
            if(!this.rightClickMenu.isOpen)
                this.rightClickMenu.redisplay();
            this.rightClickMenu.toggle();
	    }   
        return Clutter.EVENT_STOP;
    }

    _onKeyPressEvent(actor, event) {
        let symbol = event.get_key_symbol();
        if (symbol == Clutter.KEY_Return ||
            symbol == Clutter.KEY_KP_Enter) {
            this.activate(event);
            return Clutter.EVENT_STOP;
        }
        return Clutter.EVENT_PROPAGATE;
    }


 

    _onDestroy(){
        if(this._button.appMenuManager.activeMenu)
            this._button.appMenuManager.activeMenu.toggle();
    }
};
// Menu Category item class
var CategoryMenuItem = class extends BaseMenuItem {
    // Initialize menu item
    constructor(button, category) {
        super(button);
        this._category = category;
        this._button = button;
        let name;
        if (this._category) {
            name = this._category.get_name();
        } else {
            name = _("Frequent Apps");
        }
        this._icon = new St.Icon({
            gicon: this._category ? this._category.get_icon() : null,
            style_class: 'popup-menu-icon',
            icon_size: MEDIUM_ICON_SIZE
        });
        if(!this._category){
            this._icon.icon_name= 'emblem-favorite-symbolic';
        }
        this.actor.add_child(this._icon);
        let categoryLabel = new St.Label({
            text: name,
            y_expand: true,
            x_expand:true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(categoryLabel);
        this._arrowIcon = new St.Icon({
            icon_name: 'go-next-symbolic',
            style_class: 'popup-menu-icon',
            x_align: St.Align.END,
            icon_size: 12,
        });
        this.actor.add_child(this._arrowIcon);
        this.actor.label_actor = categoryLabel;
    }

    // Activate menu item (Display applications in category)
    activate(event) {
        if (this._category)
            this._button.selectCategory(this._category);
        else
            this._button.selectCategory("Frequent Apps");
        super.activate(event);
    }

    // Set button as active, scroll to the button
    setActive(active, params) {
        if (active && !this.actor.hover) {
            this._button.scrollToButton(this);
        }
        super.setActive(active, params);
    }
};




// Place Info class
var PlaceInfo = class {
    // Initialize place info
    constructor(file, name, icon) {
        this.file = file;
        this.name = name ? name : this._getFileName();
        this.icon = icon ? new Gio.ThemedIcon({ name: icon }) : this.getIcon();
    }

    // Launch place with appropriate application
    launch(timestamp) {
        let launchContext = global.create_app_launch_context(timestamp, -1);
        Gio.AppInfo.launch_default_for_uri(this.file.get_uri(), launchContext);
    }

    // Get Icon for place
    getIcon() {
        try {
            let info = this.file.query_info('standard::symbolic-icon', 0, null);
            return info.get_symbolic_icon();

        } catch (e) {
            if (e instanceof GioIOErrorEnum) {
                if (!this.file.is_native()) {
                    return new Gio.ThemedIcon({ name: 'folder-remote-symbolic' });
                } else {
                    return new Gio.ThemedIcon({ name: 'folder-symbolic' });
                }
            }
        }
    }

    // Get display name for place
    _getFileName() {
        try {
            let info = this.file.query_info('standard::display-name', 0, null);
            return info.get_display_name();
        } catch (e) {
            if (e instanceof Gio.IOErrorEnum) {
                return this.file.get_basename();
            }
        }
    }
};
Signals.addSignalMethods(PlaceInfo.prototype);

// Menu Place Shortcut item class
var PlaceMenuItem = class extends BaseMenuItem {
    // Initialize menu item
    constructor(button, info) {
        super(button);
        this._button = button;
        this._info = info;
        this._icon = new St.Icon({
            gicon: info.icon,
            icon_size: SMALL_ICON_SIZE
        });
        this.actor.add_child(this._icon);
        this._label = new St.Label({
            text: _(info.name),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.actor.add_child(this._label);
        this._changedId = this._info.connect('changed',
            this._propertiesChanged.bind(this));
    }

    // Destroy menu item
    destroy() {
        if (this._changedId) {
            this._info.disconnect(this._changedId);
            this._changedId = 0;
        }
        super.destroy();
    }

    // Activate (launch) the shortcut
    activate(event) {
        this._info.launch(event.get_time());
        this._button.leftClickMenu.toggle();
        super.activate(event);
    }

    // Handle changes in place info (redisplay new info)
    _propertiesChanged(info) {
        this._icon.gicon = info.icon;
        this._label.text = info.name;
    }
};

/**
 * This class represents a SearchBox.
 */
var SearchBox = class {
    constructor() {
        this.actor = new St.BoxLayout({
            style_class: 'search-box search-box-padding'
        });
        this._stEntry = new St.Entry({
            name: 'search-entry',
            hint_text: _("Type to search…"),
            track_hover: true,
            can_focus: true
        });
        this._findIcon = new St.Icon({
            style_class: 'search-entry-icon',
            icon_name: 'edit-find-symbolic',
            icon_size: 16
        });
        this._clearIcon = new St.Icon({
            style_class: 'search-entry-icon',
            icon_name: 'edit-clear-symbolic',
            icon_size: 16
        });
        this._stEntry.set_primary_icon(this._findIcon);
        this.actor.add(this._stEntry, {
            expand: true,
            x_align: St.Align.START,
            y_align: St.Align.START
        });

        this._text = this._stEntry.get_clutter_text();
        this._textChangedId = this._text.connect('text-changed', this._onTextChanged.bind(this));
        this._keyPressId = this._text.connect('key-press-event', this._onKeyPress.bind(this));
        this._keyFocusInId = this._text.connect('key-focus-in', this._onKeyFocusIn.bind(this));
        this._searchIconClickedId = 0;
        this._inputHistory = [];
        this._maxInputHistory = 5;

        this.actor.connect('destroy', this._onDestroy.bind(this));
    }

    _pushInput(searchString) {
        if (this._inputHistory.length == this._maxInputHistory) {
            this._inputHistory.shift();
        }
        this._inputHistory.push(searchString);
    }

    _lastInput() {
        if (this._inputHistory.length != 0) {
            return this._inputHistory[this._inputHistory.length - 1];
        }
        return '';
    }

    _previousInput() {
        if (this._inputHistory.length > 1) {
            return this._inputHistory[this._inputHistory.length - 2];
        }
        return '';
    }

    getText() {
        return this._stEntry.get_text();
    }

    setText(text) {
        this._stEntry.set_text(text);
    }

    // Grab the key focus
    grabKeyFocus() {
        this._stEntry.grab_key_focus();
    }

    hasKeyFocus() {
        return this._stEntry.contains(global.stage.get_key_focus());
    }
    // Clear the search box
    clear() {
        this._stEntry.set_text('');
        this.emit('cleared');
    }

    isEmpty() {
        return this._stEntry.get_text() == '';
    }

    _isActivated() {
        return this._stEntry.get_text() != '';
    }

    _setClearIcon() {
        this._stEntry.set_secondary_icon(this._clearIcon);
        if (this._searchIconClickedId == 0) {
            this._searchIconClickedId = this._stEntry.connect('secondary-icon-clicked',
                this.clear.bind(this));
        }
    }

    _unsetClearIcon() {
        if (this._searchIconClickedId > 0) {
            this._stEntry.disconnect(this._searchIconClickedId);
        }
        this._searchIconClickedId = 0;
        this._stEntry.set_secondary_icon(null);
    }

    _onTextChanged(entryText) {
        let searchString = this._stEntry.get_text();
        this._pushInput(searchString);
        if (this._isActivated()) {
            this._setClearIcon();
        } else {
            this._unsetClearIcon();
            if (searchString == '' && this._previousInput() != '') {
                this.emit('cleared');
            }
        }
        this.emit('changed', searchString);
    }

    _onKeyPress(actor, event) {
        let symbol = event.get_key_symbol();
        if (symbol == Clutter.KEY_Return ||
            symbol == Clutter.KEY_KP_Enter) {
            if (!this.isEmpty()) {
                this.emit('activate');
            }
            return Clutter.EVENT_STOP;
        }
        this.emit('key-press-event', event);
        return Clutter.EVENT_PROPAGATE;
    }

    _onKeyFocusIn(actor) {
        this.emit('key-focus-in');
        return Clutter.EVENT_PROPAGATE;
    }

    _onDestroy() {
        if (this._textChangedId > 0) {
            this._text.disconnect(this._textChangedId);
            this._textChangedId = 0;
        }
        if (this._keyPressId > 0) {
            this._text.disconnect(this._keyPressId);
            this._keyPressId = 0;
        }
        if (this._keyFocusInId > 0) {
            this._text.disconnect(this._keyFocusInId);
            this._keyFocusInId = 0;
        }
    }
};
Signals.addSignalMethods(SearchBox.prototype);

/**
 * This class is responsible for the appearance of the menu button.
 */
var MenuButtonWidget = class {
    constructor() {
        this.actor = new St.BoxLayout({
            style_class: 'panel-status-menu-box',
            pack_start: false
        });
        this._arrowIcon = PopupMenu.arrowIcon(St.Side.BOTTOM);
        this._icon = new St.Icon({
            icon_name: 'start-here-symbolic',
            style_class: 'popup-menu-icon'
        });
        this._label = new St.Label({
            text: _("Applications"),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });

        this.actor.add_child(this._icon);
        this.actor.add_child(this._label);
        this.actor.add_child(this._arrowIcon);
    }

    getPanelLabel() {
        return this._label;
    }

    getPanelIcon() {
        return this._icon;
    }

    showArrowIcon() {
        if (!this.actor.contains(this._arrowIcon)) {
            this.actor.add_child(this._arrowIcon);
        }
    }

    hideArrowIcon() {
        if (this.actor.contains(this._arrowIcon)) {
            this.actor.remove_child(this._arrowIcon);
        }
    }

    showPanelIcon() {
        if (!this.actor.contains(this._icon)) {
            this.actor.add_child(this._icon);
        }
    }

    hidePanelIcon() {
        if (this.actor.contains(this._icon)) {
            this.actor.remove_child(this._icon);
        }
    }

    showPanelText() {
        if (!this.actor.contains(this._label)) {
            this.actor.add_child(this._label);
        }
    }

    hidePanelText() {
        if (this.actor.contains(this._label)) {
            this.actor.remove_child(this._label);
        }
    }
};
