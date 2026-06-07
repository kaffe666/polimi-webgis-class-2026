// GeoServer WMS endpoint for Group 05
const GEOSERVER_BASE = "https://www.gis-geoserver.polimi.it/geoserver";
const WORKSPACE = "gisgeoserver_05";
const WMS_URL = `${GEOSERVER_BASE}/${WORKSPACE}/wms`;

// Base maps
const osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  zIndex: 0,
});

const satLayer = new ol.layer.Tile({
  visible: false,
  zIndex: 0,
  source: new ol.source.XYZ({
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attributions: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 19,
  }),
});

// Helper: create a WMS tile layer
function makeWmsLayer(layerName, zIndex) {
  return new ol.layer.Tile({
    visible: false,
    zIndex: zIndex,
    source: new ol.source.TileWMS({
      url: WMS_URL,
      params: { LAYERS: layerName, TILED: true },
      serverType: "geoserver",
      transition: 0,
      attributions: "Air quality data © Polimi GIS project / CAMS",
    }),
  });
}

// Layer catalogue
const LAYERS = [
  // NO2
  { group: "NO₂",  title: "NO₂ – CAMS December 2023",          name: "gisgeoserver_05:Greece_CAMS_no2_2023_12",            legendType: "ramp",      unit: "µg/m³", description: "NO₂ concentration from CAMS reanalysis, December 2023." },
  { group: "NO₂",  title: "NO₂ – Annual Average 2023",          name: "gisgeoserver_05:Greece_average_no2_2023",            legendType: "ramp",      unit: "µg/m³", description: "Annual average NO₂ concentration across Greece, 2023." },
  { group: "NO₂",  title: "NO₂ – Concentration Classes 2023",   name: "gisgeoserver_05:Greece_no2_concentration_map_2023",  legendType: "ramp",      unit: "µg/m³", description: "Annual average NO₂ reclassified into air quality classes." },
  { group: "NO₂",  title: "NO₂ – AMAC 2021–2023",               name: "gisgeoserver_05:Greece_no2_2021_2023_AMAC_map",      legendType: "ramp",      unit: "µg/m³", description: "Annual Mean Aggregation Change of NO₂, 2021–2023." },
  { group: "NO₂",  title: "NO₂ – Population Bivariate 2023",    name: "gisgeoserver_05:Greece_no2_2023_bivariate",          legendType: "bivariate", bivX: "NO₂ concentration →", bivY: "Population →", description: "5×5 bivariate classification: NO₂ concentration × population." },
  // PM2.5
  { group: "PM₂.₅", title: "PM₂.₅ – CAMS December 2023",         name: "gisgeoserver_05:Greece_CAMS_pm2p5_2023_12",           legendType: "ramp",      unit: "µg/m³", description: "PM2.5 concentration from CAMS reanalysis, December 2023." },
  { group: "PM₂.₅", title: "PM₂.₅ – Annual Average 2023",         name: "gisgeoserver_05:Greece_average_pm2p5_2023",           legendType: "ramp",      unit: "µg/m³", description: "Annual average PM2.5 concentration across Greece, 2023." },
  { group: "PM₂.₅", title: "PM₂.₅ – Conc. Classes 2023",          name: "gisgeoserver_05:Greece_pm2p5_concentration_map_2023", legendType: "ramp",      unit: "µg/m³", description: "Annual average PM2.5 reclassified into air quality classes." },
  { group: "PM₂.₅", title: "PM₂.₅ – AMAC 2021–2023",              name: "gisgeoserver_05:Greece_pm2p5_2021_2023_AMAC_map",     legendType: "ramp",      unit: "µg/m³", description: "Annual Mean Aggregation Change of PM2.5, 2021–2023." },
  { group: "PM₂.₅", title: "PM₂.₅ – Population Bivariate 2023",   name: "gisgeoserver_05:Greece_pm2p5_2023_bivariate",         legendType: "bivariate", bivX: "PM₂.₅ concentration →", bivY: "Population →", description: "5×5 bivariate classification: PM2.5 concentration × population." },
  // PM10
  { group: "PM₁₀", title: "PM₁₀ – CAMS December 2023",          name: "gisgeoserver_05:Greece_CAMS_pm10_2023_12",            legendType: "ramp",      unit: "µg/m³", description: "PM10 concentration from CAMS reanalysis, December 2023." },
  { group: "PM₁₀", title: "PM₁₀ – Annual Average 2023",          name: "gisgeoserver_05:Greece_average_pm10_2023",            legendType: "ramp",      unit: "µg/m³", description: "Annual average PM10 concentration across Greece, 2023." },
  { group: "PM₁₀", title: "PM₁₀ – Conc. Classes 2023",           name: "gisgeoserver_05:Greece_pm10_concentration_map_2023",  legendType: "ramp",      unit: "µg/m³", description: "Annual average PM10 reclassified into air quality classes." },
  { group: "PM₁₀", title: "PM₁₀ – AMAC 2021–2023",               name: "gisgeoserver_05:Greece_pm10_2021_2023_AMAC_map",      legendType: "ramp",      unit: "µg/m³", description: "Annual Mean Aggregation Change of PM10, 2021–2023." },
  { group: "PM₁₀", title: "PM₁₀ – Population Bivariate 2023",    name: "gisgeoserver_05:Greece_pm10_2023_bivariate",          legendType: "bivariate", bivX: "PM₁₀ concentration →", bivY: "Population →", description: "5×5 bivariate classification: PM10 concentration × population." },
];

const GROUP_CLASS = {
  "NO₂": "grp-no2",
  "PM\u2082.\u2085": "grp-pm25",
  "PM\u2081\u2080": "grp-pm10",
};

const LAYER_CATEGORIES = {
  "gisgeoserver_05:Greece_CAMS_no2_2023_12":           "CAMS December",
  "gisgeoserver_05:Greece_average_no2_2023":            "Annual Average",
  "gisgeoserver_05:Greece_no2_concentration_map_2023":  "Concentration Classes",
  "gisgeoserver_05:Greece_no2_2021_2023_AMAC_map":      "AMAC",
  "gisgeoserver_05:Greece_no2_2023_bivariate":          "Population Bivariate",
  "gisgeoserver_05:Greece_CAMS_pm2p5_2023_12":          "CAMS December",
  "gisgeoserver_05:Greece_average_pm2p5_2023":          "Annual Average",
  "gisgeoserver_05:Greece_pm2p5_concentration_map_2023":"Concentration Classes",
  "gisgeoserver_05:Greece_pm2p5_2021_2023_AMAC_map":    "AMAC",
  "gisgeoserver_05:Greece_pm2p5_2023_bivariate":        "Population Bivariate",
  "gisgeoserver_05:Greece_CAMS_pm10_2023_12":           "CAMS December",
  "gisgeoserver_05:Greece_average_pm10_2023":           "Annual Average",
  "gisgeoserver_05:Greece_pm10_concentration_map_2023": "Concentration Classes",
  "gisgeoserver_05:Greece_pm10_2021_2023_AMAC_map":     "AMAC",
  "gisgeoserver_05:Greece_pm10_2023_bivariate":         "Population Bivariate",
};

// Attach an OL layer to each catalogue entry
LAYERS.forEach((cfg, i) => { cfg.layer = makeWmsLayer(cfg.name, i + 1); });

// Map controls
const mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(4),
  projection: "EPSG:4326",
  className: "",
  target: document.getElementById("mouse-position"),
});

const controls = [
  new ol.control.Zoom(),
  new ol.control.Attribution({ collapsible: false }),
  new ol.control.Rotate(),
  new ol.control.ScaleLine(),
  new ol.control.FullScreen(),
  mousePositionControl,
];

// Map
const map = new ol.Map({
  target: "map",
  controls: controls,
  layers: [osmLayer, satLayer, ...LAYERS.map((cfg) => cfg.layer)],
  view: new ol.View({
    center: ol.proj.fromLonLat([23.8, 39.0]),
    zoom: 6,
  }),
});

// Base map switcher
document.querySelectorAll('input[name="basemap"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    osmLayer.setVisible(e.target.value === "osm");
    satLayer.setVisible(e.target.value === "sat");
  });
});

// Legend
const legendBox = document.getElementById("legend-inner");

// 5x5 bivariate palette (col = pollutant class 0-4, row = population class 0-4)
const BIVARIATE_COLORS = [
  ["#f6f0ee", "#dde2e2", "#b4cdda", "#8fafc9", "#8399b9"],
  ["#f6d8c2", "#ddcab6", "#b4b6ad", "#8f979d", "#82818c"],
  ["#f6c09d", "#ddb291", "#b49d89", "#8f7f78", "#826968"],
  ["#eaa486", "#d1967a", "#a88171", "#836361", "#774d50"],
  ["#ca9481", "#b18675", "#88726c", "#63535c", "#573d4b"],
];

function legendUrl(cfg) {
  const params = new URLSearchParams({ REQUEST: "GetLegendGraphic", VERSION: "1.0.0", FORMAT: "image/png", WIDTH: "20", LAYER: cfg.name });
  return `${WMS_URL}?${params.toString()}&LEGEND_OPTIONS=forceLabels:on;fontAntiAliasing:true;fontSize:11;fontColor:0x333333;reverseOrder:true`;
}

function buildBivariateMatrix(cfg) {
  let rows = "";
  for (let r = 4; r >= 0; r--) {
    let cells = "";
    for (let c = 0; c < 5; c++) {
      cells += `<div class="biv-cell" style="background:${BIVARIATE_COLORS[r][c]};" title="Pollutant class ${c + 1}, Population class ${r + 1}"></div>`;
    }
    rows += `<div class="biv-row">${cells}</div>`;
  }
  return `<div class="biv-wrap">
      <div class="biv-ylabel"><span>${cfg.bivY}</span></div>
      <div class="biv-content">
        <div class="biv-matrix">${rows}</div>
        <div class="biv-xlabel">${cfg.bivX}</div>
      </div>
    </div>
    <p class="legend-desc">${cfg.description}</p>`;
}

function buildLayerLegendHtml(cfg) {
  const inner = cfg.legendType === "bivariate"
    ? buildBivariateMatrix(cfg)
    : `<div class="legend-entries-wrap" data-fetch-layer="${cfg.name}" data-unit="${cfg.unit || ''}"></div>`;
  return `<div class="legend-block">
            <div class="legend-block-title">
              <span class="legend-block-name" title="${cfg.title}">${cfg.title}</span>
              <button class="legend-close" data-layer-name="${cfg.name}" title="Hide layer">&times;</button>
            </div>
            ${inner}
          </div>`;
}

// Fetch legend entries as JSON from GeoServer; falls back to PNG on error
async function fetchAndFillLegend(el) {
  const layerName = el.dataset.fetchLayer;
  const unit = el.dataset.unit;
  const cfg = LAYERS.find((l) => l.name === layerName);
  if (!cfg) return;

  try {
    const params = new URLSearchParams({ REQUEST: "GetLegendGraphic", VERSION: "1.0.0", FORMAT: "application/json", LAYER: layerName });
    const res = await fetch(`${WMS_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    const rasterSym = data?.Legend?.[0]?.rules?.[0]?.symbolizers?.[0]?.Raster;
    const colormap = rasterSym?.colormap ?? {};
    const colormapEntries = colormap.entries ?? [];

    if (colormapEntries.length > 0) {
      const entries = colormapEntries.filter((e) => e.label && e.label.trim() !== "");
      const isRamp = colormap.type === "ramp";
      const labeled = entries.map((e, i) => {
        let label;
        if (isRamp) {
          const lo = parseFloat(e.label);
          const hi = entries[i + 1] ? parseFloat(entries[i + 1].label) : null;
          label = hi !== null ? `${lo.toFixed(2)} – ${hi.toFixed(2)}` : `> ${lo.toFixed(2)}`;
        } else {
          label = e.label;
        }
        return { color: e.color, label };
      });
      const rows = [...labeled].reverse().map((e) =>
        `<div class="leg-entry"><span class="leg-swatch" style="background:${e.color};"></span><span class="leg-entry-label">${e.label}</span></div>`
      ).join("");
      el.innerHTML = rows + (unit ? `<p class="legend-unit">${unit}</p>` : "");
      return;
    }

    const rules = data?.Legend?.[0]?.rules ?? [];
    if (rules.length > 0) {
      const rows = [...rules].reverse().map((rule) => {
        const sym = rule.symbolizers?.[0] ?? {};
        const color = sym.Polygon?.fill ?? sym.Polygon?.["fill-color"] ?? "#888888";
        const label = rule.title || rule.name || "";
        return `<div class="leg-entry"><span class="leg-swatch" style="background:${color};"></span><span class="leg-entry-label">${label}</span></div>`;
      }).join("");
      el.innerHTML = rows + (unit ? `<p class="legend-unit">${unit}</p>` : "");
      return;
    }

    throw new Error("no entries");
  } catch {
    el.innerHTML = `<img src="${legendUrl(cfg)}" class="legend-ramp-img" style="align-self:flex-start" onerror="this.style.display='none'" />` +
      (unit ? `<p class="legend-unit">${unit}</p>` : "");
  }
}

function renderAllVisibleLegends() {
  const visible = LAYERS.filter((cfg) => cfg.layer.getVisible());
  legendBox.innerHTML = visible.length === 0
    ? '<p class="hint" style="padding:10px 14px;">Enable a layer to see its legend.</p>'
    : visible.map(buildLayerLegendHtml).join("");
  legendBox.querySelectorAll('[data-fetch-layer]').forEach(fetchAndFillLegend);
  legendBox.querySelectorAll('.legend-close').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cfg = LAYERS.find((l) => l.name === btn.dataset.layerName);
      if (!cfg) return;
      cfg.layer.setVisible(false);
      if (cfg._checkbox) cfg._checkbox.checked = false;
      renderAllVisibleLegends();
    });
  });
}

// Draggable floating panels
function makeDraggable(panel, handle) {
  let dragging = false, ox = 0, oy = 0, startL = 0, startT = 0;

  handle.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragging = true;
    const pr = panel.getBoundingClientRect();
    const cr = panel.offsetParent.getBoundingClientRect();
    startL = pr.left - cr.left;
    startT = pr.top  - cr.top;
    panel.style.left = startL + 'px';
    panel.style.top  = startT + 'px';
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    ox = e.clientX;
    oy = e.clientY;
    handle.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    panel.style.left = (startL + e.clientX - ox) + 'px';
    panel.style.top  = (startT + e.clientY - oy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.style.cursor = 'grab';
    document.body.style.userSelect = '';
  });
}

makeDraggable(document.getElementById('legend'),      document.getElementById('legend-drag-handle'));
makeDraggable(document.getElementById('layer-panel'), document.getElementById('layer-panel-handle'));

// Layer switcher with collapsible groups
function enforceLayerOrder() {
  const coll = map.getLayers();
  const sorted = coll.getArray().slice().sort((a, b) => (a.getZIndex() ?? 0) - (b.getZIndex() ?? 0));
  coll.clear();
  sorted.forEach((l) => coll.push(l));
}

function buildLayerSwitcher(sortMode) {
  const switcher = document.getElementById("layer-switcher");
  switcher.innerHTML = "";

  const groups = new Map();
  LAYERS.forEach((cfg) => {
    const key = sortMode === "pollutant" ? cfg.group : (LAYER_CATEGORIES[cfg.name] || cfg.group);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(cfg);
  });

  for (const [groupName, layers] of groups) {
    const groupDiv = document.createElement("div");
    groupDiv.className = "lp-group";

    const header = document.createElement("div");
    const dotClass = sortMode === "pollutant" ? (GROUP_CLASS[groupName] || "") : "grp-cat";
    header.className = "lp-group-header " + dotClass;
    header.innerHTML = `<span>${groupName}</span><span class="lp-arrow">▶</span>`;

    const content = document.createElement("div");
    content.className = "lp-group-content collapsed";

    header.addEventListener("click", () => {
      const collapsed = content.classList.toggle("collapsed");
      header.querySelector(".lp-arrow").textContent = collapsed ? "▶" : "▼";
    });

    layers.forEach((cfg) => {
      const label = document.createElement("label");
      label.className = "lp-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = cfg.layer.getVisible();
      checkbox.addEventListener("change", () => {
        cfg.layer.setVisible(checkbox.checked);
        enforceLayerOrder();
        renderAllVisibleLegends();
      });
      cfg._checkbox = checkbox;
      const lbl = document.createElement("span");
      lbl.className = "lp-label";
      lbl.title = cfg.title;
      lbl.textContent = " " + cfg.title;
      label.appendChild(checkbox);
      label.appendChild(lbl);
      content.appendChild(label);
    });

    groupDiv.appendChild(header);
    groupDiv.appendChild(content);
    switcher.appendChild(groupDiv);
  }
}

buildLayerSwitcher("pollutant");

document.querySelectorAll('input[name="lp-sort"]').forEach((radio) => {
  radio.addEventListener("change", (e) => buildLayerSwitcher(e.target.value));
});