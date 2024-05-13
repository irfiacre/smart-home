export const INITIAL_REGION = {
  latitude: -1.9342,
  longitude: 30.0827,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

// export const IOS_CLIENT_ID ="206559309545-vgep72ttudg3nca81gh54hlcoh7vtv95.apps.googleusercontent.com";
export const IOS_CLIENT_ID =
  "10924546893-1kpnshj6uvhthae65aah44p53magt3jq.apps.googleusercontent.com";
// export const ANDROID_CLIENT_ID ="206559309545-nf8tlbg7mbmi8c92nudfvgmrf680hs4h.apps.googleusercontent.com";
export const ANDROID_CLIENT_ID =
  "10924546893-a41e6gufqij4tpft0odgb63i5jtj007o.apps.googleusercontent.com";

export const GOOGLE_MAPS_API_KEY = "AIzaSyDsd_AHt1twk6QObcc0bqcZ5USTwYof8Xc";
// AIzaSyDsd_AHt1twk6QObcc0bqcZ5USTwYof8Xc

export const WORK_LOCATION = {
  latitude: -1.9466,
  longitude: 30.0596,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

export const HOME_LOCATION = {
  latitude: -1.9515,
  longitude: 30.1098,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

export const GEOFENCING_LOCATIONS = [
  { key: 1, latitude: -1.9557, longitude: 30.1042, title: "At School (AUCA)" },
  {
    key: 2,
    latitude: HOME_LOCATION.latitude,
    longitude: HOME_LOCATION.longitude,
    title: "Home",
  },
  {
    key: 3,
    latitude: WORK_LOCATION.latitude,
    longitude: WORK_LOCATION.longitude,
    title: "Work",
  },
];

export const TEST_GEOFENCING_LOCATIONS = [
  { key: 1, latitude: -1.9512, longitude: 30.06, title: "Norrsken KGL" },
  { key: 2, latitude: -1.947, longitude: 30.061, title: "Ubumwe Hotel" },
  {
    key: 3,
    latitude: -1.98507,
    longitude: 30.031855,
    title: "Nyarugenge Market",
  },
  {
    key: 4,
    latitude: -1.98507,
    longitude: 30.031855,
    title: "Simba",
  },
];
