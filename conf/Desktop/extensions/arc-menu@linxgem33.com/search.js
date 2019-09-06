/*
 * Arc Menu: The new applications menu for Gnome 3.
 * Copyright (C) 2017-2019 LinxGem33 
 *
 * Copyright (C) 2019 Andrew Zaech 
 *
 * **Based off https://github.com/GNOME/gnome-shell/blob/master/js/ui/search.js 
 * Heavily edited to better suit Arc Menu's needs.**
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

const {Atk, Clutter, Gio, GLib, GObject, Shell, St } = imports.gi;
const Signals = imports.signals;
const AppDisplay = imports.ui.appDisplay;
const IconGrid = imports.ui.iconGrid;
const Main = imports.ui.main;
const RemoteSearch = imports.ui.remoteSearch;
const Util = imports.misc.util;
const Params = imports.misc.params;
const PopupMenu = imports.ui.popupMenu;
const SEARCH_PROVIDERS_SCHEMA = 'org.gnome.desktop.search-providers';
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const MW = Me.imports.menuWidgets;
const appSys = Shell.AppSystem.get_default();
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

var MAX_LIST_SEARCH_RESULTS_ROWS = 6;
var MAX_APPS_SEARCH_RESULTS_ROWS = 6;

var ArcSearchMaxWidthBin = GObject.registerClass(
class ArcSearchMaxWidthBin extends St.Bin {
    vfunc_allocate(box, flags) {
        let themeNode = this.get_theme_node();
        let maxWidth = themeNode.get_max_width();
        let availWidth = box.x2 - box.x1;
        let adjustedBox = box;
        if (availWidth > maxWidth) {
            let excessWidth = availWidth - maxWidth;
            adjustedBox.x1 += Math.floor(excessWidth / 2);
            adjustedBox.x2 -= Math.floor(excessWidth / 2);
        }
        super.vfunc_allocate(adjustedBox, flags);
    }
});

var SearchResult = class {
    constructor(provider, metaInfo, resultsView) {
        this.provider = provider;
        this._button= resultsView._button;
        this.metaInfo = metaInfo;
        this._resultsView = resultsView;
        let app = appSys.lookup_app(this.metaInfo['id']);
        if(app){
            this.menuItem = new MW.SearchResultItem(this._button,app); 
        }
        else {
            this.menuItem = new MW.BaseMenuItem(this._button);
        }
       	this.menuItem._delegate = this;
        this.menuItem.connect('activate', this.activate.bind(this));

        let isMenuItem=true;
        if(this.metaInfo['description'] || ((app!=undefined) ? app.get_description() : false))
        {
          this.tooltip = new MW.Tooltip(this.menuItem.actor, this.metaInfo['description'] ? this.metaInfo['description']:  app.get_description(),isMenuItem,this._button._settings);
          this.tooltip.hide();
          this.menuItem.actor.connect('notify::hover', this._onHover.bind(this));
        }

    }

    _onHover() {

        if (this.menuItem.actor.hover) { // mouse pointer hovers over the button
            this.tooltip.show();
        } else { // mouse pointer leaves the button area
            this.tooltip.hide();
        }
    }
    activate() {
        //global.log('activate');
        this.emit('activate', this.metaInfo.id);
    }
};
Signals.addSignalMethods(SearchResult.prototype);

var ListSearchResult = class extends SearchResult {
    constructor(provider, metaInfo, resultsView) {
        super(provider, metaInfo, resultsView);
        let button = resultsView._button;

        this._termsChangedId = 0;

        // An icon for, or thumbnail of, content
        let icon = this.metaInfo['createIcon'](this.ICON_SIZE);
        if (icon) {
             this.menuItem.actor.add_child(icon);
        }

        let title = new St.Label({ text: this.metaInfo['name'],x_expand: true,y_align: Clutter.ActorAlign.CENTER });
        this.menuItem.actor.add_child(title);

        if (this.metaInfo['description']&&  this.provider.appInfo.get_name() == "Calculator") {
            title.text = this.metaInfo['name'] + "   " + this.metaInfo['description'];
        }
        this.menuItem.connect('destroy', this._onDestroy.bind(this));
    }
  
    get ICON_SIZE() {
        return 16;
    }

    _highlightTerms() {
        let markup = this._resultsView.highlightTerms(this.metaInfo['description'].split('\n')[0]);
        this._descriptionLabel.clutter_text.set_markup(markup);
    }

    _onDestroy() {
        if (this._termsChangedId)
            this._resultsView.disconnect(this._termsChangedId);
        this._termsChangedId = 0;
    }
};

var AppSearchResult = class extends SearchResult {
    constructor(provider, metaInfo, resultsView) {
        super(provider, metaInfo, resultsView);
        this._button = resultsView._button;
         
        this.icon = this.metaInfo['createIcon'](16);
        if (this.icon) {
              this.menuItem.actor.add_child(this.icon);
        }             
        let label = new St.Label({
            text: this.metaInfo['name'],
            y_expand: true,
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        this.menuItem.actor.add_child(label);
    }
};
var SearchResultsBase = class {
    constructor(provider, resultsView) {
        this.provider = provider;
        this._resultsView = resultsView;
        this._button= resultsView._button;
        this._terms = [];

        this.actor = new St.BoxLayout({ style_class: 'arc-search',
                                        vertical: true });

        this._resultDisplayBin = new St.Bin({ style_class: 'arc-search',x_fill: true,
                                              y_fill: true });
        this.actor.add(this._resultDisplayBin, { expand: true,x_fill:true });

        this._resultDisplays = {};

        this._clipboard = St.Clipboard.get_default();

        this._cancellable = new Gio.Cancellable();
    }

    destroy() {
        this.actor.destroy();
        this._terms = [];
    }

    _createResultDisplay(meta) {
        if (this.provider.createResultObject)
            return this.provider.createResultObject(meta, this._resultsView);
        
        return null;
    }

    clear() {
        this._cancellable.cancel();
        for (let resultId in this._resultDisplays)
            this._resultDisplays[resultId].menuItem.destroy();
        this._resultDisplays = {};
        this._clearResultDisplay();
        this.actor.hide();
    }

    _keyFocusIn(actor) {
        this.emit('key-focus-in', actor);
    }

    _activateResult(result, id) {
        if(this.provider.activateResult){
            this.provider.activateResult(id, this._terms);
            if (result.metaInfo.clipboardText)
                this._clipboard.set_text(St.ClipboardType.CLIPBOARD, result.metaInfo.clipboardText);
        }
        else{
            let temp = this.provider.createResultObject(result.metaInfo, this._resultsView);
            this.actor.add(temp.actor);
            temp.actor.hide();
            temp.activate();
        }
        this._button.leftClickMenu.toggle();
    }

    _setMoreCount(count) {
    }

    _ensureResultActors(results, callback) {
        let metasNeeded = results.filter(
            resultId => this._resultDisplays[resultId] === undefined
        );

        if (metasNeeded.length === 0) {
            callback(true);
        } else {
            this._cancellable.cancel();
            this._cancellable.reset();

            this.provider.getResultMetas(metasNeeded, metas => {
                if (this._cancellable.is_cancelled()) {
                    if (metas.length > 0)
                        log(`Search provider ${this.provider.id} returned results after the request was canceled`);
                    callback(false);
                    return;
                }
                if (metas.length != metasNeeded.length) {
                    log('Wrong number of result metas returned by search provider ' + this.provider.id +
                        ': expected ' + metasNeeded.length + ' but got ' + metas.length);
                    callback(false);
                    return;
                }
                if (metas.some(meta => !meta.name || !meta.id)) {
                    log('Invalid result meta returned from search provider ' + this.provider.id);
                    callback(false);
                    return;
                }

                metasNeeded.forEach((resultId, i) => {
                    let meta = metas[i];                    
                    let display = this._createResultDisplay(meta);
                    display.connect('activate', this._activateResult.bind(this));
                    display.menuItem.connect('key-focus-in', this._keyFocusIn.bind(this));
                    this._resultDisplays[resultId] = display;
                });
                callback(true);
            }, this._cancellable);
        }
    }

    updateSearch(providerResults, terms, callback) {
        this._terms = terms;
        if (providerResults.length == 0) {
            this._clearResultDisplay();
            this.actor.hide();
            callback();
        } else {
            let maxResults = this._getMaxDisplayedResults();
            let results = this.provider.filterResults(providerResults, maxResults);
            let moreCount = Math.max(providerResults.length - results.length, 0);

            this._ensureResultActors(results, successful => {
                if (!successful) {
                    this._clearResultDisplay();
                    callback();
                    return;
                }

                // To avoid CSS transitions causing flickering when
                // the first search result stays the same, we hide the
                // content while filling in the results.
                this.actor.hide();
                this._clearResultDisplay();
                results.forEach(resultId => {
                    this._addItem(this._resultDisplays[resultId]);
                });
                this._setMoreCount(this.provider.canLaunchSearch ? moreCount : 0);
                this.actor.show();
                callback();
            });
        }
    }
};

var ListSearchResults = class extends SearchResultsBase {
    constructor(provider, resultsView) {
        super(provider, resultsView);
        this._button= resultsView._button;
        this._container = new St.BoxLayout({ style_class: 'arc-search',vertical: true,x_align: St.Align.START });
        this.providerInfo = new ArcSearchProviderInfo(provider,this._button);
        this.providerInfo.connect('key-focus-in', this._keyFocusIn.bind(this));
        this.providerInfo.connect('activate', () => {
            this.providerInfo.animateLaunch();
            provider.launchSearch(this._terms);
            this._button.leftClickMenu.toggle();
        });
        this._container.add(this.providerInfo.actor, { x_fill: true,
                                                 y_fill: false,
                                                 x_align: St.Align.START,
                                                 y_align: St.Align.START,
                                                 xexpand:true });

        this._content = new St.BoxLayout({ style_class: 'arc-search',
                                           vertical: true });
        this._container.add(this._content, { expand: true});

        this._resultDisplayBin.set_child(this._container);
    }

    _setMoreCount(count) {
        this.providerInfo.setMoreCount(count);
    }

    _getMaxDisplayedResults() {
        return MAX_LIST_SEARCH_RESULTS_ROWS;
    }

    _clearResultDisplay() {
        this._content.remove_all_children();
    }

    _createResultDisplay(meta) {
        return super._createResultDisplay(meta, this._resultsView) ||
               new ListSearchResult(this.provider, meta, this._resultsView);
    }

    _addItem(display) {
        //global.log(display.actor);
        this._content.add_actor(display.menuItem.actor);
        //this._button.applicationsBox.add(display.actor);
    }

    getFirstResult() {
        if (this._content.get_n_children() > 0)
            return this._content.get_child_at_index(0)._delegate;
        else
            return null;
    }
};
Signals.addSignalMethods(ListSearchResults.prototype);
var AppSearchResults = class extends SearchResultsBase {
      constructor(provider, resultsView) {
        super(provider, resultsView);
        this._parentContainer = resultsView.actor;
        this._grid = new St.BoxLayout({vertical: true });
        this._resultDisplayBin.set_child(this._grid);
    }

    _getMaxDisplayedResults() {
         return MAX_APPS_SEARCH_RESULTS_ROWS;
    }

    _clearResultDisplay() {
        this._grid.remove_all_children();
    }

    _createResultDisplay(meta) {
        return  new AppSearchResult(this.provider, meta, this._resultsView);
    }

    _addItem(display) {
      this._grid.add_actor(display.menuItem.actor);
    }

    getFirstResult() {
          if (this._grid.get_n_children() > 0)
            return this._grid.get_child_at_index(0)._delegate;
        else
            return null;
    }
};
Signals.addSignalMethods(AppSearchResults.prototype);

var SearchResults = class {
    constructor(button) {
        this.actor = new St.BoxLayout({ name: 'arc-search',
                                        vertical: true });
        this._button = button;
        this._content = new St.BoxLayout({ name: 'arc-search',
                                           vertical: true });
        this._contentBin = new ArcSearchMaxWidthBin({ name: 'arc-search',
                                             x_fill: true,
                                             y_fill: true,
                                             child: this._content, });
        let scrollChild = new St.BoxLayout();
        scrollChild.add(this._contentBin, { expand: true,x_align: St.Align.START });
        this.actor.add(scrollChild);
       
        this._statusText = new St.Label();
        this._statusBin = new St.Bin({ x_align: St.Align.MIDDLE,
                                       y_align: St.Align.MIDDLE });
        if(button._settings.get_boolean('enable-custom-arc-menu'))
            this._statusText.add_style_class_name('arc-menu-status-text');
        else
            this._statusText.add_style_class_name('search-statustext');
        this.actor.add(this._statusBin, { expand: true });
        this._statusBin.add_actor(this._statusText);

        this._highlightDefault = false;
        this._defaultResult = null;
        this._startingSearch = false;

        this._terms = [];
        this._results = {};

        this._providers = [];

        this._highlightRegex = null;

        this._searchSettings = new Gio.Settings({ schema_id: SEARCH_PROVIDERS_SCHEMA });
        this._searchSettings.connect('changed::disabled', this._reloadRemoteProviders.bind(this));
        this._searchSettings.connect('changed::enabled', this._reloadRemoteProviders.bind(this));
        this._searchSettings.connect('changed::disable-external', this._reloadRemoteProviders.bind(this));
        this._searchSettings.connect('changed::sort-order', this._reloadRemoteProviders.bind(this));

        this._searchTimeoutId = 0;
        this._cancellable = new Gio.Cancellable();

        this._registerProvider(new AppDisplay.AppSearchProvider());

        appSys.connect('installed-changed', this._reloadRemoteProviders.bind(this));
        this._reloadRemoteProviders();
    }
    setStyle(style){
        this._statusText.style_class = style;
    }

    _reloadRemoteProviders() {
        let remoteProviders = this._providers.filter(p => p.isRemoteProvider);
        remoteProviders.forEach(provider => {
            this._unregisterProvider(provider);
        });

        RemoteSearch.loadRemoteSearchProviders(this._searchSettings, providers => {
            providers.forEach(this._registerProvider.bind(this));
        });
    }

    _registerProvider(provider) {
        provider.searchInProgress = false;
        this._providers.push(provider);
        this._ensureProviderDisplay(provider);
    }

    _unregisterProvider(provider) {
        let index = this._providers.indexOf(provider);
        this._providers.splice(index, 1);

        if (provider.display)
            provider.display.destroy();
    }

    _gotResults(results, provider) {
        this._results[provider.id] = results;
        this._updateResults(provider, results);
    }

    _clearSearchTimeout() {
        if (this._searchTimeoutId > 0) {
            GLib.source_remove(this._searchTimeoutId);
            this._searchTimeoutId = 0;
        }
    }

    _reset() {
        this._terms = [];
        this._results = {};
        this._clearDisplay();
        this._clearSearchTimeout();
        this._defaultResult = null;
        this._startingSearch = false;

        this._updateSearchProgress();
    }

    _doSearch() {
        this._startingSearch = false;

        let previousResults = this._results;
        this._results = {};

        this._providers.forEach(provider => {
            provider.searchInProgress = true;

            let previousProviderResults = previousResults[provider.id];
            if (this._isSubSearch && previousProviderResults)
                provider.getSubsearchResultSet(previousProviderResults,
                                               this._terms,
                                               results => {
                                                   this._gotResults(results, provider);
                                               },
                                               this._cancellable);
            else
                provider.getInitialResultSet(this._terms,
                                             results => {
                                                 this._gotResults(results, provider);
                                             },
                                             this._cancellable);
        });

        this._updateSearchProgress();

        this._clearSearchTimeout();
    }

    _onSearchTimeout() {
        this._searchTimeoutId = 0;
        this._doSearch();
        return GLib.SOURCE_REMOVE;
    }

    setTerms(terms) {
        // Check for the case of making a duplicate previous search before
        // setting state of the current search or cancelling the search.
        // This will prevent incorrect state being as a result of a duplicate
        // search while the previous search is still active.
        let searchString = terms.join(' ');
        let previousSearchString = this._terms.join(' ');
        if (searchString == previousSearchString)
            return;

        this._startingSearch = true;

        this._cancellable.cancel();
        this._cancellable.reset();

        if (terms.length == 0) {
            this._reset();
            return;
        }

        let isSubSearch = false;
        if (this._terms.length > 0)
            isSubSearch = searchString.indexOf(previousSearchString) == 0;

        this._terms = terms;
        this._isSubSearch = isSubSearch;
        this._updateSearchProgress();

        if (this._searchTimeoutId == 0)
            this._searchTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 150, this._onSearchTimeout.bind(this));

        let escapedTerms = this._terms.map(term => Shell.util_regex_escape(term));
        this._highlightRegex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
     
        this.emit('terms-changed');
    }


    _ensureProviderDisplay(provider) {
        if (provider.display)
            return;

        let providerDisplay;
        if (provider.appInfo)
      
            providerDisplay = new ListSearchResults(provider, this);
        else
            providerDisplay = new AppSearchResults(provider, this);
        providerDisplay.actor.hide();
        this._content.add(providerDisplay.actor);
        provider.display = providerDisplay;
    }

    _clearDisplay() {
        this._providers.forEach(provider => {
            provider.display.clear();
        });
    }

    _maybeSetInitialSelection() {
        let newDefaultResult = null;

        let providers = this._providers;
        for (let i = 0; i < providers.length; i++) {
            let provider = providers[i];
            let display = provider.display;

            if (!display.actor.visible)
                continue;

            let firstResult = display.getFirstResult();
            if (firstResult) {
                newDefaultResult = firstResult;
                break; // select this one!
            }
        }

        if (newDefaultResult != this._defaultResult) {
            this._setSelected(this._defaultResult, false);
            this._setSelected(newDefaultResult, this._highlightDefault);

            this._defaultResult = newDefaultResult;
        }
    }

    get searchInProgress() {
        if (this._startingSearch)
            return true;

        return this._providers.some(p => p.searchInProgress);
    }

    _updateSearchProgress() {
        let haveResults = this._providers.some(provider => {
            let display = provider.display;
            return (display.getFirstResult() != null);
        });

        this._statusBin.visible = !haveResults;

        if (!haveResults) {
            if (this.searchInProgress) {
                this._statusText.set_text(_("Searching..."));
            } else {
                this._statusText.set_text(_("No results."));
            }
        }
    }

    _updateResults(provider, results) {
        let terms = this._terms;
        let display = provider.display;
        display.updateSearch(results, terms, () => {
            provider.searchInProgress = false;

            this._maybeSetInitialSelection();
            this._updateSearchProgress();
        });
    }

    highlightDefault(highlight) {
        this._highlightDefault = highlight;
        this._setSelected(this._defaultResult, highlight);
    }

    getTopResult(){
        return this._defaultResult;
    }
    
    _setSelected(result, selected) {
        if (!result)
            return;
        if (selected) {
            result.actor.add_style_class_name('selected');
        } else {
            result.actor.remove_style_class_name('selected');
        }
    }

    highlightTerms(description) {
        if (!description)
            return '';

        if (!this._highlightRegex)
            return description;

        return description.replace(this._highlightRegex, '<b>$1</b>');
    }
};
Signals.addSignalMethods(SearchResults.prototype);

var ArcSearchProviderInfo = 
class ArcSearchProviderInfo extends MW.BaseMenuItem {
    constructor(provider,button) {
            super(button);
        this.provider = provider;
        this._button = button;

        this.nameLabel = new St.Label({ text: provider.appInfo.get_name() + ":",
                                       x_align: Clutter.ActorAlign.START,x_expand: true});
        this._moreText="";
        this.actor.add_child(this.nameLabel);

        let isMenuItem = true;
        if(provider.appInfo.get_description()!=null){
            this.tooltip = new MW.Tooltip(this.actor, provider.appInfo.get_description(),isMenuItem,this._button._settings);
            this.tooltip.hide();
            this.actor.connect('notify::hover', this._onHover.bind(this));
        }
    }
    _onHover() {
        if ( this.actor.hover) { // mouse pointer hovers over the button
            this.tooltip.show();
        } else { // mouse pointer leaves the button area
            this.tooltip.hide();
        }
    }
    animateLaunch() {
        let app = appSys.lookup_app(this.provider.appInfo.get_id());
    }

    setMoreCount(count) {
        this._moreText= ngettext("%d more", "%d more", count).format(count);
        if(count>0)
            this.nameLabel.text = this.provider.appInfo.get_name() + "  ("+ this._moreText+")";
    }
};

