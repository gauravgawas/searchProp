import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
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
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Dashboard() {
  const center: [number, number] = [15.2993, 74.124];
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [layerGroups, setLayerGroups] = useState<any[]>([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const auth = useSelector((state: any) => state.auth);
  const [details, setDetails] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<L.Layer | null>(null);
  const mapRef = useRef<L.Map | null>(null);
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
    // .then((res) => {
    //   const parsed = res.data.map((g: any) => ({
    //     ...g,
    //     geometries: JSON.parse(g.geometries),
    //   }));
    //   setLayerGroups(parsed);
    // })
    // .catch(console.error);
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
          const popupContent = `
      <div>
        ${Object.entries(geo.info)
          .map(
            ([key, value]) =>
              `<div><strong>${key}:</strong></div> <div>${value}</div>`
          )
          .join("<br>")}
      </div>
    `;
          layer.bindPopup(popupContent);
          featureGroup.addLayer(layer);
        }
      });
    });
  }, [layerGroups]);

  function closeDialog() {
    const featureGroup = featureGroupRef.current;
    if (featureGroup && currentLayer && featureGroup.hasLayer(currentLayer)) {
      featureGroup.removeLayer(currentLayer);
    }
    setShowDialog(false);
  }
  const bindInfoWithElement = () => {
    if (currentLayer) {
      // Attach object as custom data to the layer
      (currentLayer as any).customInfo = details;

      // Optional: bind popup with formatted info for display
      const popupContent = `
      <div>
        ${Object.entries(details)
          .map(
            ([key, value]) =>
              `<div><strong>${key}:</strong></div> <div>${value}</div>`
          )
          .join("<br>")}
      </div>
    `;

      currentLayer.bindPopup(popupContent);
      setShowDialog(false);
      setShowSaveButton(true);
      console.log("Bound details:", details);
    } else {
      console.warn("No current layer selected to bind info.");
    }
  };
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

    // ✅ If a marker is created, explicitly apply the default icon
    if (layer instanceof L.Marker) {
      layer.setIcon(DefaultIcon);
    }
    setCurrentLayer(layer);

    setShowDialog(true);
    // const info = prompt("Enter related information and contact details:");

    // If no info entered → remove the layer
    // if (!info || info.trim() === "") {
    //   alert("Information is required to add this layer.");

    //   // Remove the layer from FeatureGroup safely
    //   const featureGroup = featureGroupRef.current;
    //   if (featureGroup && featureGroup.hasLayer(layer)) {
    //     featureGroup.removeLayer(layer);
    //   }
    //   return;
    // }

    // // Otherwise attach info and keep the layer
    // setShowSaveButton(true);
    // (layer as any).customInfo = info.trim();
    // layer.bindPopup(info.trim());
  };
  // Convert all layers inside feature group to JSON
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

          {/* Show previously saved groups
          {layerGroups.map((g, idx) =>
            g.geometries.map((geo: any, i: number) => {
              if (geo.type === "Point") {
                const [lat, lng] = geo.coordinates;
                return (
                  <Marker key={`${idx}-${i}`} position={[lat, lng]}>
                    <Popup>{geo.info}</Popup>
                  </Marker>
                );
              } else if (geo.type === "LineString") {
                return (
                  <Polyline
                    key={`${idx}-${i}`}
                    positions={geo.coordinates.map((c: any) => [c[0], c[1]])}
                    color="blue"
                  >
                    <Popup>{geo.info}</Popup>
                  </Polyline>
                );
              } else if (geo.type === "Polygon") {
                return (
                  <Polygon
                    key={`${idx}-${i}`}
                    positions={geo.coordinates.map((c: any) => [c[0], c[1]])}
                    color="green"
                  >
                    <Popup>{geo.info}</Popup>
                  </Polygon>
                );
              } else if (geo.type === "Circle") {
                // Circle has center and radius
                const [lat, lng] = geo.center;
                const radius = geo.radius || 100; // fallback if radius missing
                return (
                  <Circle
                    key={`${idx}-${i}`}
                    center={[lat, lng]}
                    radius={radius}
                    color="red"
                  >
                    <Popup>{geo.info}</Popup>
                  </Circle>
                );
              }
              return null;
            })
          )} */}
        </MapContainer>
        {showDialog && (
          <InfoDialog
            closeDialog={closeDialog}
            details={details}
            setDetails={setDetails}
            saveData={bindInfoWithElement}
          />
        )}
        {showSaveButton && (
          <button
            onClick={handleSaveGroup}
            className="z-[1000] absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded shadow-lg"
          >
            Save
          </button>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;
