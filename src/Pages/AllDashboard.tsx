import { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import axios from "axios";
import MainLayout from "../Layouts/MainLayout";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useSelector } from "react-redux";
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function AllDashboard() {
  const center: [number, number] = [15.2993, 74.124];
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const [layerGroups, setLayerGroups] = useState<any[]>([]);
  const auth = useSelector((state: any) => state.auth);
  //Fetch saved groups
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/geometry/getAllGeom", {
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
  return (
    <MainLayout>
      <div className="relative">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom
          className="w-full min-h-[91vh] "
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FeatureGroup ref={featureGroupRef}></FeatureGroup>
        </MapContainer>
      </div>
    </MainLayout>
  );
}

export default AllDashboard;
