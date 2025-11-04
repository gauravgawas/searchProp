import { useRef, useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";

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
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38], // bottom tip is the anchor point
  popupAnchor: [0, -38], // popup appears above the pin
});
function AllDashboard() {
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
  const auth = useSelector((state: any) => state.auth);
  const [details, setDetails] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  //Fetch saved groups
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
  useEffect(() => {
    axios
      .get(auth.resourceUrl + "/api/geometry/getAllGeom", {
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
    setShowDialog(false);
  }
  const createOnClickListener = (layer: L.Layer) => {
    layer.on("click", () => {
      if ((layer as any).customInfo) {
        setDetails((layer as any).customInfo);
        setShowDialog(true);
      }
    });
  };
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
          <AutoPanToCurrentLocation />
        </MapContainer>
      </div>
      {showDialog && (
        <InfoDialog
          closeDialog={closeDialog}
          details={details}
          readonly={true}
        />
      )}
      <div className="z-[1000] absolute top-32 right-5">
        <div className="">
          <Filters
            filter={filter}
            setFilter={setFilter}
            handleSearch={handleSearch}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default AllDashboard;
