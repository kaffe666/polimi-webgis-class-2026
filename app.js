/* ==========================================================================
   Greece Air Quality WebGIS  |  app.js  (vanilla JS + OpenLayers v7)
   --------------------------------------------------------------------------
   1. Initialise the OpenLayers map with two base maps (OSM + Esri Satellite).
   2. Add the required controls: ScaleLine, FullScreen, MousePosition.
   3. Define the GeoServer WMS layers in four groups: NO2, PM2.5, PM10 and a
      shared Land Cover Change layer. No file paths are used - only WMS.
   4. Build the sidebar layer switcher (flat list with group headers) and a
      dynamic legend, including the custom 5x5 bivariate matrix legend.
   ========================================================================== */

/* --------------------------------------------------------------------------
   0) GEOSERVER CONFIGURATION
   --------------------------------------------------------------------------
   The online GeoServer web URL is:
       https://www.gis-geoserver.polimi.it/geoserver
   For OGC map requests we use the workspace-scoped WMS endpoint:
       <base>/<workspace>/wms
   -------------------------------------------------------------------------- */
const GEOSERVER_BASE = "https://www.gis-geoserver.polimi.it/geoserver";
const WORKSPACE = "gisgeoserver_05";
const WMS_URL = `${GEOSERVER_BASE}/${WORKSPACE}/wms`;

/* --------------------------------------------------------------------------
   1) BASE MAPS (two, each with proper attribution)
   -------------------------------------------------------------------------- */
const osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  zIndex: 0,
});

const satLayer = new ol.layer.Tile({
  visible: false,
  zIndex: 0,
  source: new ol.source.XYZ({
    url:
      "https://server.arcgisonline.com/ArcGIS/rest/services/" +
      "World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attributions:
      "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, " +
      "and the GIS User Community",
    maxZoom: 19,
  }),
});

/* --------------------------------------------------------------------------
   2) THEMATIC WMS LAYERS (published on the online GeoServer)
   --------------------------------------------------------------------------
   legendType: "ramp"       - continuous raster (color ramp + unit)
               "classified" - discrete raster classes
               "bivariate"  - custom 5x5 color-matrix legend
   group:      sidebar group header the layer is listed under
   -------------------------------------------------------------------------- */
function makeWmsLayer(layerName, zIndex) {
  return new ol.layer.Tile({
    visible: false,
    zIndex: zIndex,
    source: new ol.source.TileWMS({
      url: WMS_URL,
      params: {
        LAYERS: layerName,
        TILED: true,
      },
      serverType: "geoserver",
      transition: 0,
      attributions: "Air quality data © Polimi GIS project / CAMS",
    }),
  });
}

const LAYERS = [
  /* ---- NO2 group ---- */
  {
    group: "NO₂",
    title: "NO₂ – CAMS December 2023",
    name: "gisgeoserver_05:Greece_CAMS_no2_2023_12",
    legendType: "ramp",
    unit: "µg/m³",
    description: "NO₂ concentration from CAMS reanalysis, December 2023.",
  },
  {
    group: "NO₂",
    title: "NO₂ – Annual Average 2023",
    name: "gisgeoserver_05:Greece_average_no2_2023",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual average NO₂ concentration across Greece, 2023.",
  },
  {
    group: "NO₂",
    title: "NO₂ – Concentration Classes 2023",
    name: "gisgeoserver_05:Greece_no2_concentration_map_2023",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual average NO₂ reclassified into air quality classes.",
  },
  {
    group: "NO₂",
    title: "NO₂ – AMAC 2021–2023",
    name: "gisgeoserver_05:Greece_no2_2021_2023_AMAC_map",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual Mean Aggregation Change of NO₂, 2021–2023.",
  },
  {
    group: "NO₂",
    title: "NO₂ – Population Bivariate 2023",
    name: "gisgeoserver_05:Greece_no2_2023_bivariate",
    legendType: "bivariate",
    bivX: "NO₂ concentration →",
    bivY: "Population →",
    description: "5×5 bivariate classification: NO₂ concentration × population.",
  },

  /* ---- PM2.5 group ---- */
  {
    group: "PM2.5",
    title: "PM2.5 – CAMS December 2023",
    name: "gisgeoserver_05:Greece_CAMS_pm2p5_2023_12",
    legendType: "ramp",
    unit: "µg/m³",
    description: "PM2.5 concentration from CAMS reanalysis, December 2023.",
  },
  {
    group: "PM2.5",
    title: "PM2.5 – Annual Average 2023",
    name: "gisgeoserver_05:Greece_average_pm2p5_2023",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual average PM2.5 concentration across Greece, 2023.",
  },
  {
    group: "PM2.5",
    title: "PM2.5 – Concentration Classes 2023",
    name: "gisgeoserver_05:Greece_pm2p5_concentration_map_2023",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual average PM2.5 reclassified into air quality classes.",
  },
  {
    group: "PM2.5",
    title: "PM2.5 – AMAC 2021–2023",
    name: "gisgeoserver_05:Greece_pm2p5_2021_2023_AMAC_map",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual Mean Aggregation Change of PM2.5, 2021–2023.",
  },
  {
    group: "PM2.5",
    title: "PM2.5 – Population Bivariate 2023",
    name: "gisgeoserver_05:Greece_pm2p5_2023_bivariate",
    legendType: "bivariate",
    bivX: "PM2.5 concentration →",
    bivY: "Population →",
    description: "5×5 bivariate classification: PM2.5 concentration × population.",
  },

  /* ---- PM10 group ---- */
  {
    group: "PM10",
    title: "PM10 – CAMS December 2023",
    name: "gisgeoserver_05:Greece_CAMS_pm10_2023_12",
    legendType: "ramp",
    unit: "µg/m³",
    description: "PM10 concentration from CAMS reanalysis, December 2023.",
  },
  {
    group: "PM10",
    title: "PM10 – Annual Average 2023",
    name: "gisgeoserver_05:Greece_average_pm10_2023",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual average PM10 concentration across Greece, 2023.",
  },
  {
    group: "PM10",
    title: "PM10 – Concentration Classes 2023",
    name: "gisgeoserver_05:Greece_pm10_concentration_map_2023",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual average PM10 reclassified into air quality classes.",
  },
  {
    group: "PM10",
    title: "PM10 – AMAC 2021–2023",
    name: "gisgeoserver_05:Greece_pm10_2021_2023_AMAC_map",
    legendType: "ramp",
    unit: "µg/m³",
    description: "Annual Mean Aggregation Change of PM10, 2021–2023.",
  },
  {
    group: "PM10",
    title: "PM10 – Population Bivariate 2023",
    name: "gisgeoserver_05:Greece_pm10_2023_bivariate",
    legendType: "bivariate",
    bivX: "PM10 concentration →",
    bivY: "Population →",
    description: "5×5 bivariate classification: PM10 concentration × population.",
  },

  /* ---- Shared land cover ---- */
  {
    group: "Land Cover",
    title: "Land Cover Change 2021–2023",
    name: "gisgeoserver_05:Greece_LCC_2021_2023",
    legendType: "classified",
    description:
      "Land cover change detection classes (2021→2023): water, trees, " +
      "flooded vegetation, crops, built area, bare ground, rangeland and " +
      "their change-transition codes.",
  },
];

// Map group names to the CSS modifier used for the colored group-header dot.
const GROUP_CLASS = {
  "NO₂": "grp-no2",
  "PM2.5": "grp-pm25",
  "PM10": "grp-pm10",
  "Land Cover": "grp-lcc",
};

// Build an OpenLayers layer for every catalogue entry. zIndex starts at 1
// (above the base maps at 0) and increments by position so the predefined
// order is respected regardless of toggle sequence.
LAYERS.forEach((cfg, i) => {
  cfg.layer = makeWmsLayer(cfg.name, i + 1);
});

/* --------------------------------------------------------------------------
   3) MAP CONTROLS (ScaleLine, FullScreen, MousePosition + zoom/rotate/attrib)
   -------------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------------
   4) THE MAP
   -------------------------------------------------------------------------- */
const map = new ol.Map({
  target: "map",
  controls: controls,
  layers: [osmLayer, satLayer, ...LAYERS.map((cfg) => cfg.layer)],
  view: new ol.View({
    center: ol.proj.fromLonLat([23.8, 39.0]),
    zoom: 6,
  }),
});

/* --------------------------------------------------------------------------
   5) BASE MAP SWITCHER (radio buttons)
   -------------------------------------------------------------------------- */
document.querySelectorAll('input[name="basemap"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const chosen = e.target.value;
    osmLayer.setVisible(chosen === "osm");
    satLayer.setVisible(chosen === "sat");
  });
});

/* --------------------------------------------------------------------------
   6) LEGEND SYSTEM
   --------------------------------------------------------------------------
   renderAllVisibleLegends() rebuilds the legend panel from scratch on every
   toggle, showing one block per visible layer in catalogue order.
   -------------------------------------------------------------------------- */
const legendBox = document.getElementById("legend");

// 5x5 bivariate palette (column = pollutant class 0..4 low→high,
//                         row    = population class 0..4 low→high).
const BIVARIATE_COLORS = [
  ["#f6f0ee", "#dde2e2", "#b4cdda", "#8fafc9", "#8399b9"], // row 0 – lowest pop
  ["#f6d8c2", "#ddcab6", "#b4b6ad", "#8f979d", "#82818c"], // row 1
  ["#f6c09d", "#ddb291", "#b49d89", "#8f7f78", "#826968"], // row 2
  ["#eaa486", "#d1967a", "#a88171", "#836361", "#774d50"], // row 3
  ["#ca9481", "#b18675", "#88726c", "#63535c", "#573d4b"], // row 4 – highest pop
];

function legendUrl(cfg) {
  const isRamp = cfg.legendType === "ramp";
  const params = new URLSearchParams({
    REQUEST: "GetLegendGraphic",
    VERSION: "1.0.0",
    FORMAT: "image/png",
    WIDTH: isRamp ? "20" : "18",
    HEIGHT: isRamp ? "200" : "300",
    LEGEND_OPTIONS:
      "forceLabels:on;fontAntiAliasing:true;fontSize:11;fontColor:0x333333",
    LAYER: cfg.name,
  });
  return `${WMS_URL}?${params.toString()}`;
}

function buildBivariateMatrix(cfg) {
  // Render rows top→bottom as high pop → low pop so the axis reads upward.
  let rows = "";
  for (let r = 4; r >= 0; r--) {
    let cells = "";
    for (let c = 0; c < 5; c++) {
      cells +=
        `<div class="biv-cell" style="background:${BIVARIATE_COLORS[r][c]};"` +
        ` title="Pollutant class ${c + 1}, Population class ${r + 1}"></div>`;
    }
    rows += `<div class="biv-row">${cells}</div>`;
  }

  return `
    <div class="biv-wrap">
      <div class="biv-ylabel"><span>${cfg.bivY}</span></div>
      <div class="biv-content">
        <div class="biv-matrix">${rows}</div>
        <div class="biv-xlabel">${cfg.bivX}</div>
      </div>
    </div>
    <p class="legend-desc">${cfg.description}</p>`;
}

function buildLayerLegendHtml(cfg) {
  let inner;

  if (cfg.legendType === "ramp") {
    inner = `
      <div class="legend-ramp-wrap">
        <img src="${legendUrl(cfg)}" alt="Legend for ${cfg.title}" class="legend-ramp-img"
             onerror="this.style.display='none'" />
        ${cfg.unit ? `<span class="legend-unit">${cfg.unit}</span>` : ""}
      </div>`;
  } else if (cfg.legendType === "bivariate") {
    inner = buildBivariateMatrix(cfg);
  } else {
    inner = `
      ${cfg.description ? `<p class="legend-desc">${cfg.description}</p>` : ""}
      <img src="${legendUrl(cfg)}" alt="Legend for ${cfg.title}" class="legend-symbol-img"
           onerror="this.style.display='none'" />`;
  }

  return `<div class="legend-block">
            <div class="legend-block-title">${cfg.title}</div>
            ${inner}
          </div>`;
}

function renderAllVisibleLegends() {
  const visible = LAYERS.filter((cfg) => cfg.layer.getVisible());
  legendBox.innerHTML =
    visible.length === 0
      ? '<p class="hint">Enable a layer to see its legend.</p>'
      : visible.map(buildLayerLegendHtml).join("");
}

/* --------------------------------------------------------------------------
   7) LAYER SWITCHER (flat list with group headers)
   -------------------------------------------------------------------------- */

// Re-sort the map's layer collection by zIndex after every toggle so OL keeps
// the predefined render order even after re-appending a layer's canvas.
function enforceLayerOrder() {
  const coll = map.getLayers();
  const sorted = coll
    .getArray()
    .slice()
    .sort((a, b) => (a.getZIndex() ?? 0) - (b.getZIndex() ?? 0));
  coll.clear();
  sorted.forEach((l) => coll.push(l));
}

const switcher = document.getElementById("layer-switcher");
let currentGroup = null;

LAYERS.forEach((cfg, i) => {
  // Insert a group header whenever the group changes.
  if (cfg.group !== currentGroup) {
    currentGroup = cfg.group;
    const header = document.createElement("div");
    header.className = "layer-group-header " + (GROUP_CLASS[cfg.group] || "");
    header.textContent = cfg.group;
    switcher.appendChild(header);
  }

  const label = document.createElement("label");
  label.className = "row";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `lyr-${i}`;

  checkbox.addEventListener("change", () => {
    cfg.layer.setVisible(checkbox.checked);
    enforceLayerOrder();
    renderAllVisibleLegends();
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" " + cfg.title));
  switcher.appendChild(label);
});
