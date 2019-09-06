/*
 * Borrowed from Dash to Panel -- https://github.com/home-sweet-gnome/dash-to-panel
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
 * This file is based on code from the Dash to Dock extension by micheleg
 * and code from the Taskbar extension by Zorin OS
 * Some code was also adapted from the upstream Gnome Shell source code.
 */

const Clutter = imports.gi.Clutter;
const GdkPixbuf = imports.gi.GdkPixbuf
const Gi = imports._gi;
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Util = imports.misc.util;

var TRANSLATION_DOMAIN = imports.misc.extensionUtils.getCurrentExtension().metadata['gettext-domain'];

var defineClass = function (classDef) {
    let parentProto = classDef.Extends ? classDef.Extends.prototype : null;
    
    if (imports.misc.config.PACKAGE_VERSION < '3.31.9') {
        if (parentProto && (classDef.Extends.name || classDef.Extends.toString()).indexOf('DashToPanel.') < 0) {
            classDef.callParent = function() {
                let args = Array.prototype.slice.call(arguments);
                let func = args.shift();

                classDef.Extends.prototype[func].apply(this, args);
            };
        }

        return new imports.lang.Class(classDef);
    }

    let isGObject = parentProto instanceof GObject.Object;
    let needsSuper = parentProto && !isGObject;
    let getParentArgs = function(args) {
        let parentArgs = [];

        (classDef.ParentConstrParams || parentArgs).forEach(p => {
            if (p.constructor === Array) {
                let param = args[p[0]];
                
                parentArgs.push(p[1] ? param[p[1]] : param);
            } else {
                parentArgs.push(p);
            }
        });

        return parentArgs;
    };
    
    let C = eval(
        '(class C ' + (needsSuper ? 'extends Object' : '') + ' { ' +
        '     constructor(...args) { ' +
                  (needsSuper ? 'super(...getParentArgs(args));' : '') +
                  (needsSuper || !parentProto ? 'this._init(...args);' : '') +
        '     }' +
        '     callParent(...args) { ' +
        '         let func = args.shift(); ' +
        '         if (!(func === \'_init\' && needsSuper))' +
        '             super[func](...args); ' +
        '     }' +    
        '})'
    );

    if (parentProto) {
        Object.setPrototypeOf(C.prototype, parentProto);
        Object.setPrototypeOf(C, classDef.Extends);
    } 
    
    Object.defineProperty(C, 'name', { value: classDef.Name });
    Object.keys(classDef)
          .filter(k => classDef.hasOwnProperty(k) && classDef[k] instanceof Function)
          .forEach(k => C.prototype[k] = classDef[k]);

    if (isGObject) { 
        C = GObject.registerClass({ Signals: classDef.Signals || {} }, C);
    }
    
    return C;
};