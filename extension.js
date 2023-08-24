import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import BringoutMenu from './BringoutMenu.js';

let modifiedMenu;
let sourceId = null;

export default class BringoutExtension extends Extension {
    _modifySystemItem() {
        modifiedMenu = new BringoutMenu(this._settings);
    }

    _queueModifySystemItem() {
        sourceId = GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            if (!Main.panel.statusArea.quickSettings._system)
                return GLib.SOURCE_CONTINUE;

            this._modifySystemItem();
            return GLib.SOURCE_REMOVE;
        });
    }

    enable() {
        this._settings = this.getSettings();
        if (Main.panel.statusArea.quickSettings._system)
            this._modifySystemItem();
        else
            this._queueModifySystemItem();
    }

    disable() {
        this._settings = null;
        modifiedMenu._destroy();
        modifiedMenu.destroy();
        modifiedMenu = null;
        if (sourceId) {
            GLib.Source.remove(sourceId);
            sourceId = null;
        }
    }
}
