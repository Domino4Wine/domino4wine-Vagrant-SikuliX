/*
 * Arc Menu: The new applications menu for Gnome 3.
 * 
 * Copyright (C) 2017 Alexander Rüedlinger
 *
 * Copyright (C) 2017-2018 LinxGem33
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
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Params = imports.misc.params;

/**
 * The module prefsWidgets.js contains all the customized GUI elements
 * for the preferences widget (prefs.js).
 * In order to have a consistent UI/UX, every GUI element in the preferences
 * should be based on a widget from this module.
 */

/**
 * Arc Menu Notebook
 */
var Notebook = GObject.registerClass(
    class ArcMenuNotebook extends Gtk.Notebook{

    _init() {
        super._init({
            margin_left: 6,
            margin_right: 6
        });
    }

    append_page(notebookPage) {
        Gtk.Notebook.prototype.append_page.call(
            this,
            notebookPage,
            notebookPage.getTitleLabel()
        );
    }
});

/**
 * Arc Menu Notebook Page
 */
var NotebookPage =GObject.registerClass(
    class ArcMenuNotebookPage extends Gtk.Box {

    _init(title) {
        super._init({
            orientation: Gtk.Orientation.VERTICAL,
            margin: 24,
            spacing: 20,
            homogeneous: false
        });
        this._title = new Gtk.Label({
            label: "<b>" + title + "</b>",
            use_markup: true,
            xalign: 0
        });
    }

    getTitleLabel() {
        return this._title;
    }
});

/**
 * Arc Menu icon Button
 */
var IconButton = GObject.registerClass(
    class extends Gtk.Button {

    _init(params) {
        super._init();
        this._params = Params.parse(params, {
            circular: true,
            icon_name: ''
        });
        if (this._params.circular) {
            let context = this.get_style_context();
            context.add_class('circular');
        }
        if (this._params.icon_name) {
            let image = new Gtk.Image({
                icon_name: this._params.icon_name,
                xalign: 0.5
            });
            this.add(image);
        }
    }
});

/**
 * Arc Menu Dialog Window
 */
var DialogWindow = GObject.registerClass(
    class extends Gtk.Dialog {
        _init(title, parent) {
            super._init({
                title: title,
                transient_for: parent.get_toplevel(),
                use_header_bar: true,
                modal: true
            });
            let vbox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 20,
                homogeneous: false,
                margin: 5
            });

            this._createLayout(vbox);
            this.get_content_area().add(vbox);
        }

        _createLayout(vbox) {
            throw "Not implemented!";
        }
    });

/**
 * Arc Menu Frame Box
 */
var FrameBox = GObject.registerClass(
    class extends Gtk.Frame {
        _init() {
            super._init({ label_yalign: 0.50 });
            this._listBox = new Gtk.ListBox();
            this._listBox.set_selection_mode(Gtk.SelectionMode.NONE);
            this.count=0;
            Gtk.Frame.prototype.add.call(this, this._listBox);
        }

        add(boxRow) {
            this._listBox.add(boxRow);
            this.count++;
        }
        show() {
            this._listBox.show_all();
        }
        length() {
            return this._listBox.length;
        }
        remove(boxRow) {
            this._listBox.remove(boxRow);
            this.count = this.count -1;
        }
        get_index(index){
            return this._listBox.get_row_at_index(index);
        }
        insert(row,pos){
            this._listBox.insert(row,pos);
            this.count++;
        }
    });

/**
 * Arc Menu Frame Box Row
 */
var FrameBoxRow = GObject.registerClass(
    class extends Gtk.ListBoxRow {
        _init() {
            super._init({});
            this._grid = new Gtk.Grid({
                margin: 5,
                column_spacing: 20,
                row_spacing: 20
            });
            Gtk.ListBoxRow.prototype.add.call(this, this._grid);
        }

        add(widget) {
            this._grid.add(widget);
        }
    });