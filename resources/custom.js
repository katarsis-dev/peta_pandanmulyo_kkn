/* ============================================================
   qgis2web custom enhancements
   - Layer toggle control (dark sidebar)
   - Search fasilitas by name
   - Styled popup (name + amenity)
   - Improved legend UI
   - Fullscreen button
   - Mobile drawer
   ============================================================ */
(function () {
    'use strict';

    /* ---------- helper ---------- */
    function $(id) { return document.getElementById(id); }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function trimName(n) {
        return String(n == null ? '' : n).replace(/\s+/g, ' ').trim();
    }

    /* ---------- Indonesian labels / categories ---------- */
    var AMENITY_MAP = {
        'fasilitas_kesehaatan': { label: 'Fasilitas Kesehatan', color: '#de256f', icon: 'fa-heartbeat' },
        'kantor_administrasi':  { label: 'Kantor Administrasi', color: '#a831d0', icon: 'fa-building' },
        'Kopdes Merah Putih':   { label: 'Kopdes Merah Putih', color: '#e4b287', icon: 'fa-store' },
        'playground':           { label: 'Wisata / Taman', color: '#7e89e9', icon: 'fa-tree' },
        'school':               { label: 'Sekolah', color: '#12e3ee', icon: 'fa-graduation-cap' },
        'tempat_ibadah':        { label: 'Tempat Ibadah', color: '#86e197', icon: 'fa-mosque' }
    };

    var ROAD_MAP = {
        'living_street': { label: 'Jalan Hunian', color: '#fef0d9' },
        'residential':   { label: 'Jalan Permukiman', color: '#fdcc8a' },
        'service':       { label: 'Jalan Layanan', color: '#fc8d59' }
    };

    /* curated, simplified fields for area layers (GADM admin boundaries) */
    var AREA_FIELDS = [
        { key: 'NAME_4', label: 'Nama Wilayah' },
        { key: 'NAME_3', label: 'Kecamatan' },
        { key: 'NAME_2', label: 'Kabupaten' },
        { key: 'NAME_1', label: 'Provinsi' },
        { key: 'TYPE_4', label: 'Tipe' }
    ];

    /* popup titles that use the simplified area layout */
    var AREA_POPUP_TITLES = ['Batas Desa Pandanmulyo'];

    /* order must match layersList in layers/layers.js — hanya layer
       yang relevan dengan Desa Pandanmulyo yang dipertahankan */
    var LAYER_META = [
        { key: 'lyr_GoogleSatellite_0', label: 'Citra Satelit', swatch: 'linear-gradient(135deg,#3b82f6,#22d3ee)' },
        { key: 'lyr_Pandanmulyocopy_4', label: 'Batas Desa Pandanmulyo', swatch: '#f7ff00' },
        { key: 'lyr_output_jalan3lines_5', label: 'Jaringan Jalan', swatch: '#fdcc8a' },
        { key: 'lyr_fasilitas_6', label: 'Fasilitas', swatch: '#38bdf8' }
    ];

    /* ---------- set Indonesian popup titles ---------- */
    var POPUP_TITLE = {
        lyr_GoogleSatellite_0: 'Citra Satelit',
        lyr_Pandanmulyocopy_4: 'Batas Desa Pandanmulyo',
        lyr_output_jalan3lines_5: 'Jaringan Jalan',
        lyr_fasilitas_6: 'Fasilitas'
    };
    Object.keys(POPUP_TITLE).forEach(function (k) {
        if (typeof window[k] !== 'undefined') {
            window[k].set('popuplayertitle', POPUP_TITLE[k]);
        }
    });

    /* ---------- 1. Layer toggle control ---------- */
    var fasilitasCheckbox = null;

    function metaForLayer(layer) {
        for (var i = 0; i < LAYER_META.length; i++) {
            if (typeof window[LAYER_META[i].key] !== 'undefined' && window[LAYER_META[i].key] === layer) {
                return LAYER_META[i];
            }
        }
        return null;
    }

    function buildLayerToggles() {
        var list = $('layer-list');
        if (!list || typeof layersList === 'undefined') return;

        layersList.forEach(function (layer, i) {
            var meta = metaForLayer(layer) || { label: 'Lapisan ' + (i + 1), swatch: '#64748b' };

            var item = document.createElement('label');
            item.className = 'layer-item';

            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = layer.getVisible();
            cb.addEventListener('change', function () {
                layer.setVisible(cb.checked);
            });

            var sw = document.createElement('span');
            sw.className = 'l-swatch';
            sw.style.background = meta.swatch;

            var name = document.createElement('span');
            name.className = 'l-name';
            name.textContent = meta.label;

            item.appendChild(cb);
            item.appendChild(sw);
            item.appendChild(name);
            list.appendChild(item);

            if (meta.key === 'lyr_fasilitas_6') fasilitasCheckbox = cb;
        });
    }

    /* ---------- 4. Legend UI ---------- */
    function buildLegend() {
        var box = $('legend');
        if (!box) return;

        var html = '';

        /* Fasilitas */
        html += '<div class="legend-group">';
        html += '<div class="legend-group-title">Fasilitas</div>';
        Object.keys(AMENITY_MAP).forEach(function (k) {
            var a = AMENITY_MAP[k];
            html += '<div class="legend-item"><span class="lg-dot" style="background:' + a.color + '"></span>' +
                '<span>' + esc(a.label) + '</span></div>';
        });
        html += '</div>';

        /* Jaringan Jalan */
        html += '<div class="legend-group">';
        html += '<div class="legend-group-title">Jaringan Jalan</div>';
        Object.keys(ROAD_MAP).forEach(function (k) {
            var r = ROAD_MAP[k];
            html += '<div class="legend-item"><span class="lg-line" style="background:' + r.color + '"></span>' +
                '<span>' + esc(r.label) + '</span></div>';
        });
        html += '</div>';

        /* Wilayah */
        html += '<div class="legend-group">';
        html += '<div class="legend-group-title">Wilayah</div>';
        if (typeof window.lyr_Pandanmulyocopy_4 !== 'undefined') {
            html += '<div class="legend-item"><span class="lg-box" style="background:transparent;border:2px dashed #f7ff00"></span><span>Batas Desa Pandanmulyo</span></div>';
        }
        html += '</div>';

        box.innerHTML = html;
    }

    /* ---------- 3. Styled popup ---------- */
    window.createPopupField = function (currentFeature, currentFeatureKeys, layer) {
        var layerName = layer.get('popuplayertitle') || '';
        var isFasilitas = layerName === 'Fasilitas';
        var isJalan = layerName === 'Jaringan Jalan';
        var isArea = AREA_POPUP_TITLES.indexOf(layerName) !== -1;

        /* simplified area-layer popup: name + kecamatan/kabupaten/provinsi/tipe only */
        if (isArea) {
            var rows = '';
            var nm = trimName(currentFeature.get('NAME_4')) || trimName(currentFeature.get('NAME_3'));
            if (nm) rows += '<tr class="pp-row pp-name"><td colspan="2">' + esc(nm) + '</td></tr>';
            for (var f = 0; f < AREA_FIELDS.length; f++) {
                if (AREA_FIELDS[f].key === 'NAME_4') continue; /* already shown as title */
                var av = currentFeature.get(AREA_FIELDS[f].key);
                if (av === null || av === undefined || av === '' || String(av) === 'NA') continue;
                rows += '<tr class="pp-row"><td class="pp-label">' + esc(AREA_FIELDS[f].label) + '</td><td>' +
                    esc(av) + '</td></tr>';
            }
            return rows;
        }

        var rows = '';
        for (var i = 0; i < currentFeatureKeys.length; i++) {
            var k = currentFeatureKeys[i];
            if (k === 'geometry' || k === 'layerObject' || k === 'idO' || k === '_mvtLayer_') continue;
            if (k === 'fid' || k === 'osm_id') continue;
            if (/^(GID_|CC_|VARNAME_)/.test(k)) continue; /* skip internal codes on area layers */

            var v = currentFeature.get(k);
            if (v === null || v === undefined || v === '') continue;

            if (isFasilitas && k === 'name') {
                var nm = trimName(v);
                if (nm) rows += '<tr class="pp-row pp-name"><td colspan="2">' + esc(nm) + '</td></tr>';
                continue;
            }

            if (isFasilitas && k === 'amenity') {
                var a = AMENITY_MAP[String(v)] || { label: String(v), color: '#64748b', icon: 'fa-map-marker-alt' };
                rows += '<tr class="pp-row pp-amenity"><td colspan="2">' +
                    '<span class="pp-badge" style="--ppc:' + a.color + '"><i class="fa ' + a.icon + '"></i>' +
                    esc(a.label) + '</span></td></tr>';
                continue;
            }

            if (isFasilitas && k === 'keterangan') {
                rows += '<tr class="pp-row"><td class="pp-label">Keterangan</td><td>' + esc(v) + '</td></tr>';
                continue;
            }

            if (isJalan && k === 'highway') {
                var hv = String(v);
                var r = ROAD_MAP[hv] || { label: (hv === 'unclassified' ? 'Jalan' : hv), color: '#94a3b8' };
                rows += '<tr class="pp-row pp-road"><td colspan="2">' +
                    '<span class="pp-badge pp-road-badge" style="--ppc:' + r.color + '"><span class="pp-line" style="background:' + r.color + '"></span>' +
                    esc(r.label) + '</span></td></tr>';
                continue;
            }

            if (isJalan && k === 'name') {
                var jn = trimName(v);
                if (jn) rows += '<tr class="pp-row pp-name"><td colspan="2">' + esc(jn) + '</td></tr>';
                continue;
            }

            /* generic row (area layers) */
            rows += '<tr class="pp-row"><td class="pp-label">' + esc(k) + '</td><td>' + esc(v) + '</td></tr>';
        }
        return rows;
    };

    /* ---------- 2. Search fasilitas by name ---------- */
    var searchInput = $('search-input');
    var searchResults = $('search-results');
    var fasilitasFeatures = (typeof lyr_fasilitas_6 !== 'undefined')
        ? lyr_fasilitas_6.getSource().getFeatures()
        : [];

    function closeSearch() {
        searchResults.classList.remove('open');
        searchResults.innerHTML = '';
    }

    function renderSearch(q) {
        searchResults.innerHTML = '';
        if (!q) { searchResults.classList.remove('open'); return; }

        var needle = q.toLowerCase();
        var hits = [];
        for (var i = 0; i < fasilitasFeatures.length && hits.length < 8; i++) {
            var nm = trimName(fasilitasFeatures[i].get('name')).toLowerCase();
            if (nm.indexOf(needle) !== -1) hits.push(fasilitasFeatures[i]);
        }

        if (!hits.length) {
            var empty = document.createElement('li');
            empty.className = 'search-empty';
            empty.textContent = 'Tidak ditemukan';
            searchResults.appendChild(empty);
            searchResults.classList.add('open');
            return;
        }

        hits.forEach(function (f) {
            var li = document.createElement('li');
            li.className = 'search-item';

            var a = AMENITY_MAP[String(f.get('amenity'))] || { color: '#64748b', label: 'Fasilitas' };
            var dot = document.createElement('span');
            dot.className = 's-dot';
            dot.style.background = a.color;

            var name = document.createElement('span');
            name.className = 's-name';
            name.textContent = trimName(f.get('name'));

            var type = document.createElement('span');
            type.className = 's-type';
            type.textContent = a.label;

            li.appendChild(dot);
            li.appendChild(name);
            li.appendChild(type);

            li.addEventListener('mousedown', function (ev) {
                ev.preventDefault();
                selectFasilitas(f);
            });

            searchResults.appendChild(li);
        });

        searchResults.classList.add('open');
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            renderSearch(searchInput.value.trim());
        });
        searchInput.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') {
                var first = searchResults.querySelector('.search-item');
                if (first) first.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            } else if (ev.key === 'Escape') {
                closeSearch();
                searchInput.blur();
            }
        });
        searchInput.addEventListener('focus', function () {
            if (searchInput.value.trim()) renderSearch(searchInput.value.trim());
        });
        document.addEventListener('click', function (ev) {
            if (!ev.target.closest('.search-box')) closeSearch();
        });
    }

    function selectFasilitas(f) {
        if (!f) return;

        /* make sure fasilitas layer is visible */
        if (typeof lyr_fasilitas_6 !== 'undefined' && !lyr_fasilitas_6.getVisible()) {
            lyr_fasilitas_6.setVisible(true);
            if (fasilitasCheckbox) fasilitasCheckbox.checked = true;
        }

        var geom = f.getGeometry();
        var center = ol.extent.getCenter(geom.getExtent());
        var view = map.getView();
        var targetZoom = Math.max(view.getZoom() || 10, 17);
        view.animate({
            center: center,
            zoom: targetZoom,
            duration: 700,
            easing: ol.easing.easeOutCubic
        });

        /* highlight */
        if (typeof featureOverlay !== 'undefined' && typeof collection !== 'undefined') {
            collection.clear();
            collection.push(f);
            featureOverlay.setStyle([new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 9,
                    stroke: new ol.style.Stroke({ color: '#38bdf8', width: 3 }),
                    fill: new ol.style.Fill({ color: 'rgba(56,189,248,0.25)' })
                })
            })]);
        }

        /* popup */
        var keys = f.getKeys();
        popupContent = '<ul><li><table>' +
            '<a><b>Fasilitas</b></a>' +
            window.createPopupField(f, keys, lyr_fasilitas_6) +
            '</table></li></ul>';
        popupCoord = center;
        updatePopup();

        closeSearch();
        document.body.classList.remove('sidebar-open');
    }

    /* clear the search highlight ring when the user clicks the map */
    map.on('singleclick', function () {
        if (typeof collection !== 'undefined') collection.clear();
    });

    /* ---------- 5. Fullscreen ---------- */
    var fsBtn = $('fullscreen-btn');
    function syncFsIcon() {
        if (!fsBtn) return;
        var icon = fsBtn.querySelector('i');
        var on = !!(document.fullscreenElement || document.webkitFullscreenElement);
        if (icon) icon.className = on ? 'fa fa-compress' : 'fa fa-expand';
    }
    if (fsBtn) {
        fsBtn.addEventListener('click', function () {
            var el = document.getElementById('app');
            var isFs = document.fullscreenElement || document.webkitFullscreenElement;
            if (!isFs) {
                var enter = el.requestFullscreen ? el.requestFullscreen() :
                    (el.webkitRequestFullscreen ? el.webkitRequestFullscreen() : null);
                if (enter && enter.catch) enter.catch(function () { /* dibatalkan oleh browser */ });
            } else {
                if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            }
        });
        document.addEventListener('fullscreenchange', syncFsIcon);
        document.addEventListener('webkitfullscreenchange', syncFsIcon);
    }

    /* ---------- 6. Mobile drawer ---------- */
    var menuToggle = $('menu-toggle');
    var backdrop = $('sidebar-backdrop');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            document.body.classList.toggle('sidebar-open');
        });
    }
    if (backdrop) {
        backdrop.addEventListener('click', function () {
            document.body.classList.remove('sidebar-open');
        });
    }

    /* ---------- init ---------- */
    buildLayerToggles();
    buildLegend();
})();
