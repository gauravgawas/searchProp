import { useRef, useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import axios from "axios";
import MainLayout from "../Layouts/MainLayout";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useSelector } from "react-redux";
import InfoDialog from "../Components/InfoDialog";
import Filters from "../Components/Filters";
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Dashboard() {
  const [filter, setFilter] = useState<Object | null>({
    Price: {
      min: 0,
      max: 500000000,
    },
    Area: {
      min: 0,
      max: 50000,
    },
  });
  const center: [number, number] = [15.2993, 74.124];
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [layerGroups, setLayerGroups] = useState<any[]>([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const auth = useSelector((state: any) => state.auth);
  const [details, setDetails] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<L.Layer | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38], // bottom tip is the anchor point
    popupAnchor: [0, -38], // popup appears above the pin
  });
  function AutoPanToCurrentLocation() {
    const map = useMap(); // ✅ works only inside <MapContainer>
    const [position, setPosition] = useState(null);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const latlng: any = [latitude, longitude];
            setPosition(latlng);
            map.setView(latlng, 15);
          },
          (err) => console.error("Geolocation error:", err)
        );
      }
    }, [map]);

    return (
      position && (
        <Marker position={position} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )
    );
  }
  const handleSearch = useCallback(() => {
    if (!layerGroups.length || !featureGroupRef.current) return;

    const featureGroup = featureGroupRef.current;

    featureGroup.eachLayer((layer: any) => {
      const info = layer.customInfo || {};

      // Check match for all filter fields
      const matches =
        filter &&
        Object.entries(filter).every(([key, value]) => {
          if (value === "" || value == null) return true; // ignore empty filters

          // 🏷️ Handle range filters (Price, Area)
          if (key === "Price" || key === "Area") {
            const min = value.min ?? 0;
            const max = value.max ?? Number.MAX_VALUE;
            const fieldValue = Number(info[key]);
            return !(fieldValue < min || fieldValue > max);
          }

          // 🔤 Handle normal string filters (Type, BHK, etc.)
          return info[key] === value;
        });

      // 🌐 Show / hide layers based on match result
      if (matches) {
        layer.setStyle?.({ opacity: 1, fillOpacity: 0.7 }); // visible for shapes
        if (layer._icon) layer._icon.style.display = "";
        if (layer._shadow) layer._shadow.style.display = "";
      } else {
        layer.setStyle?.({ opacity: 0, fillOpacity: 0 }); // invisible for shapes
        if (layer._icon) layer._icon.style.display = "none";
        if (layer._shadow) layer._shadow.style.display = "none";
      }
    });

    // 🔍 Optionally trigger API updates or other map changes
  }, [filter, layerGroups]);

  //Fetch saved groups
  useEffect(() => {
    const param = {
      username: auth.username,
    };
    axios
      .post(auth.resourceUrl + "/api/geometry/getMyGeom", param, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.Status == "OK") {
          const parsed = res.data.Data.map((g: any) => ({
            ...g,
            geometries: JSON.parse(g.geom),
          }));
          setLayerGroups(parsed);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!layerGroups.length || !featureGroupRef.current) return;

    const featureGroup = featureGroupRef.current;
    featureGroup.clearLayers(); // Clear old drawings

    layerGroups.forEach((g) => {
      g.geometries.forEach((geo: any) => {
        let layer: any;

        if (geo.type === "Point") {
          const [lat, lng] = geo.coordinates;
          layer = L.marker([lat, lng]);
        } else if (geo.type === "LineString") {
          layer = L.polyline(
            geo.coordinates.map((c: any) => [c[0], c[1]]),
            {
              color: "blue",
            }
          );
        } else if (geo.type === "Polygon") {
          layer = L.polygon(
            geo.coordinates.map((c: any) => [c[0], c[1]]),
            {
              color: "green",
            }
          );
        } else if (geo.type === "Circle") {
          const [lat, lng] = geo.center;
          layer = L.circle([lat, lng], { radius: geo.radius, color: "red" });
        }

        if (layer) {
          (layer as any).customInfo = geo.info;
          createOnClickListener(layer);
          featureGroup.addLayer(layer);
        }
      });
    });
  }, [layerGroups]);

  function closeDialog() {
    const featureGroup = featureGroupRef.current;
    if (
      featureGroup &&
      currentLayer &&
      !(currentLayer as any).customInfo &&
      featureGroup.hasLayer(currentLayer)
    ) {
      featureGroup.removeLayer(currentLayer);
    }
    setShowDialog(false);
  }

  const bindInfoWithElement = useCallback(() => {
    if (currentLayer) {
      // Attach object as custom data to the layer
      (currentLayer as any).customInfo = details;

      setShowDialog(false);
      setShowSaveButton(true);
      console.log("Bound details:", details);
    } else {
      console.warn("No current layer selected to bind info.");
    }
  }, [details]);
  const handleLayerEdited = () => {
    setShowSaveButton(true);
  };

  const handleLayerDeleted = () => {
    const featureGroup = featureGroupRef.current;

    if (featureGroup) {
      // Check how many layers remain after deletion
      const layerCount = Object.keys((featureGroup as any)._layers).length;

      if (layerCount === 0) {
        return;
      }

      setShowSaveButton(true);
    }
  };
  const setDeafultIcon = (e: any) => {
    if (e.layerType === "marker") {
      L.Marker.prototype.options.icon = DefaultIcon;
    }
  };
  const handleLayerCreated = (e: any) => {
    const layer = e.layer;

    if (layer instanceof L.Marker) {
      layer.setIcon(DefaultIcon);
    }
    createOnClickListener(layer);

    setCurrentLayer(layer);

    setShowDialog(true);
  };

  const createOnClickListener = (layer: L.Layer) => {
    layer.on("click", () => {
      if ((layer as any).customInfo) {
        setCurrentLayer(layer);
        setDetails((layer as any).customInfo);
        setShowDialog(true);
      }
    });
  };
  const handleSaveGroup = () => {
    const featureGroup = featureGroupRef.current;
    if (!featureGroup) return;

    const layers: any[] = [];

    featureGroup.eachLayer((layer: any) => {
      const propInfo = (layer as any).customInfo || "";
      if (layer instanceof L.Marker) {
        const { lat, lng } = layer.getLatLng();

        layers.push({ type: "Point", coordinates: [lat, lng], info: propInfo });
      } else if (layer instanceof L.Polygon) {
        // getLatLngs() can return LatLng[][] for polygons
        const latlngs = layer.getLatLngs();
        // Make sure we access the first ring if multiple rings exist
        const ring = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
        layers.push({
          type: "Polygon",
          coordinates: (ring as L.LatLng[]).map((p) => [p.lat, p.lng]),
          info: propInfo,
        });
      } else if (layer instanceof L.Polyline) {
        // Polyline gives LatLng[] (or LatLng[][] in some cases)
        const latlngs = layer.getLatLngs();
        const coordsArray = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
        layers.push({
          type: "LineString",
          coordinates: (coordsArray as L.LatLng[]).map((p) => [p.lat, p.lng]),
          info: propInfo,
        });
      } else if (layer instanceof L.Circle) {
        const center = layer.getLatLng();
        const radius = layer.getRadius();
        layers.push({
          type: "Circle",
          center: [center.lat, center.lng],
          radius: radius,
          info: propInfo,
        });
      }
    });

    if (layers.length === 0) {
      alert("No data to save!");
      return;
    }

    const params = {
      username: auth.username,
      geom: JSON.stringify(layers),
    };

    axios
      .post(auth.resourceUrl + "/api/geometry/saveGeom", params, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.Status == "OK") {
          setShowSaveButton(false);
          alert("Data saved successfully!");
        } else {
          alert("Error saving data: " + res.data.Message);
        }
      })
      .catch(console.error);
  };

  return (
    <MainLayout>
      <div className="relative">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom
          className="w-full min-h-[91vh] "
          whenReady={() => {
            const mapInstance = mapRef.current;
            if (!mapInstance) return;

            // 🔹 Ensure marker icon shows correctly while drawing
            mapInstance.on("draw:drawstart", (e: any) => {
              if (e.layerType === "marker") {
                L.Marker.prototype.options.icon = DefaultIcon;
              }
            });

            // 🔹 Also fix marker icon when layer is added (while dragging)
            mapInstance.on("layeradd", (e: any) => {
              if (e.layer instanceof L.Marker) {
                e.layer.setIcon(DefaultIcon);
              }
            });
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AutoPanToCurrentLocation />
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topleft"
              draw={{
                rectangle: false,
                circle: true,
                circlemarker: false,
              }}
              onDrawStart={setDeafultIcon}
              onCreated={handleLayerCreated}
              onEdited={handleLayerEdited}
              onDeleted={handleLayerDeleted}
            />
          </FeatureGroup>
        </MapContainer>
        {showDialog && (
          <InfoDialog
            closeDialog={closeDialog}
            details={details}
            setDetails={setDetails}
            saveData={bindInfoWithElement}
          />
        )}

        <div className="z-[1000] absolute top-4 right-5">
          <div className="flex flex-col">
            <Filters
              filter={filter}
              setFilter={setFilter}
              handleSearch={handleSearch}
            />
            {showSaveButton && (
              <button
                onClick={handleSaveGroup}
                className="bg-primary absolute top-20 right-0  text-white  px-6 py-2  rounded shadow-lg"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
