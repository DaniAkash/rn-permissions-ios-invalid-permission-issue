import { Platform } from "react-native";
import { check, RESULTS, request } from "react-native-permissions";

const requestPermission = ({
  permissionType = "",
  featureUnavailable = () => null,
  permissionBlocked = () => null,
  permissionGranted = () => null,
  requestError = () => null
}) => {
  check(permissionType)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          logError("Required feature missing in device", {
            permissionType
          });
          featureUnavailable();
          break;
        case RESULTS.DENIED:
          request(permissionType)
            .then(requestResult => {
              switch (requestResult) {
                case RESULTS.GRANTED:
                  permissionGranted();
                  break;

                default:
                  permissionBlocked();
                  break;
              }
            })
            .catch(error => {
              logError(error, {
                type: "Failed to request permission from user",
                permissionType
              });
              requestError();
            });
          break;
        case RESULTS.GRANTED:
          permissionGranted();
          break;
        case RESULTS.BLOCKED:
          permissionBlocked();
          break;
      }
    })
    .catch(error => {
      requestError();
    });
};

export default requestPermission;
