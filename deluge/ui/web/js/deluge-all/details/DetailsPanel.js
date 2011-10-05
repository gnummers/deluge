/*!
 * Deluge.details.DetailsPanel.js
 *
 * Copyright (c) Damien Churchill 2009-2011 <damoxc@gmail.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, write to:
 *     The Free Software Foundation, Inc.,
 *     51 Franklin Street, Fifth Floor
 *     Boston, MA  02110-1301, USA.
 *
 * In addition, as a special exception, the copyright holders give
 * permission to link the code of portions of this program with the OpenSSL
 * library.
 * You must obey the GNU General Public License in all respects for all of
 * the code used other than OpenSSL. If you modify file(s) with this
 * exception, you may extend this exception to your version of the file(s),
 * but you are not obligated to do so. If you do not wish to do so, delete
 * this exception statement from your version. If you delete this exception
 * statement from all source files in the program, then also delete it here.
 */

/**
 * @class Deluge.details.DetailsPanel
 */
Ext.define('Deluge.details.DetailsPanel', {
    extend: 'Ext.tab.Panel',

    region: 'south',
    id: 'torrentDetails',
    split: true,
    height: 210,
    minSize: 100,
    collapsible: true,
    margins: '0 5 5 5',

    initComponent: function() {
        this.callParent(arguments);
        this.add(Ext.create('Deluge.details.StatusTab'));
        this.add(Ext.create('Deluge.details.DetailsTab'));
        this.add(Ext.create('Deluge.details.FilesTab'));
        this.add(Ext.create('Deluge.details.PeersTab'));
        this.add(Ext.create('Deluge.details.OptionsTab'));
        this.setActiveTab(0);
    },

    clear: function() {
        this.items.each(function(panel) {
            if (panel.clear) {
                Ext.defer(panel.clear, 100, panel);
                panel.disable();
            }
        });
    },


    update: function(tab) {
        var torrent = deluge.torrents.getSelected();
        if (!torrent) {
            this.clear();
            return;
        }

        this.items.each(function(tab) {
            if (tab.disabled) tab.enable();
        });

        tab = tab || this.getActiveTab();
        if (tab.update) tab.update(torrent.getId());
    },

    /* Event Handlers */

    // We need to add the events in onRender since Deluge.Torrents hasn't
    // been created yet.
    onRender: function(ct, position) {
        this.callParent(arguments);
        deluge.events.on('disconnect', this.clear, this);
        deluge.torrents.on('rowclick', this.onTorrentsClick, this);
        this.on('tabchange', this.onTabChange, this);

        deluge.torrents.getSelectionModel().on('selectionchange', function(selModel) {
            if (!selModel.hasSelection()) this.clear();
        }, this);
    },

    onTabChange: function(panel, tab) {
        this.update(tab);
    },

    onTorrentsClick: function(grid, rowIndex, e) {
        this.update();
    }
});
